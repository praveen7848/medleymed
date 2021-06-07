const Sequelize = require("sequelize");
var encryption = require("../helpers/Encryption");
const db = require("../models");
const Users = db.users_tbl;
const Patient = db.patient_tbl;
const Retailer = db.retailer_registration_tbl;
const ProductMaster = db.products_master_tbl;
//const HealthosMedicine = db.tbl_healthos_medicine_data;
const Cart = db.cart_tbl;
const RetailerProduct = db.retailer_products_tbl;
const RetailerStock = db.retailer_stock_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;

var range = 5000; // Search within 5 KM Distance
var request = require("request");
var async = require('async');

// Customer Product Search
exports.findAll = (req, res) => {

  let message = "";
  let cart_id = req.body.cart_id;
  let lat_lang = req.body.lat_lang;
  let search_base = (req.body.search_base) ? search_base : 'quantity_fulfillment'; // Item Fulfillment, Qty Fulfillment, Price, Discount

  // USER - PATIENT Relation
  Users.hasOne(Patient, { foreignKey: "user_id" });
  Patient.belongsTo(Users, { foreignKey: "user_id" });

  // USER - RETAILER Relation
  Users.hasOne(Retailer, { foreignKey: "user_id" });
  Retailer.belongsTo(Users, { foreignKey: "user_id" });

  // RETAILER - PRODUCTS Relation
  Retailer.hasMany(RetailerProduct, { foreignKey: "retailer_id" });
  RetailerProduct.belongsTo(Retailer, { foreignKey: "retailer_id" });

  // RETAILER - STOCK Relation
  Retailer.hasMany(RetailerStock, { foreignKey: "retailer_id" });
  RetailerStock.belongsTo(Retailer, { foreignKey: "retailer_id" });

  // PRODUCT - MEDICINE Relation
  //RetailerProduct.hasMany(ProductMaster, { foreignKey: "medicine_id" });
  //ProductMaster.belongsTo(RetailerProduct, { foreignKey: "medicine_id" });

  // STOCK - MEDICINE Relation
  ProductMaster.hasMany(RetailerStock, { foreignKey: "medicine_id" });
  RetailerStock.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  // CART - MEDICINE Relation
  ProductMaster.hasMany(Cart, { foreignKey: "medicine_id" });
  Cart.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  // PATIENT - CART Relation
  Patient.hasMany(Cart, { foreignKey: "patient_id" });
  Cart.belongsTo(Patient, { foreignKey: "patient_id" });

  Cart.findAll({
	where: { cart_id: cart_id, order_status: 0 }, 
	include: [ {model: ProductMaster, attributes: ['medicinename', 'manufacturer', 'strength', 'size']} ]
  }).then((cartData) => {
      let recordsCount = cartData.length;
      let patientId = cartData[0].patient_id;
      message = "Cart fetched successfully with "+recordsCount+" Items";
      if (recordsCount == 0) {
        message = "No records found";
      }

		//############ PATIENT INFO
		Patient.findOne({
			where: { id: patientId }, include: [Users]
		}).then((patientData) => {

			//patientLatLong = (patientData.lat_long) ? patientData.lat_long : "0,0";
			//patientLatLongVal = req.body.lat_lang ? lat_lang.split(",") : "0,0".split(",");

			//############ RETAILER INFO
			Retailer.findAll({
				//where: { distance: {[Op.lte]: range}}
			}).then((retailerData) => {

				let retailersArray = [];
				let retailersDistanceArray = [];
				for(let i=0; i < retailerData.length; i++) {
					var origin = lat_lang ? lat_lang : '0,0';
					var destination = retailerData[i].latitude + "," + retailerData[i].longitude;
					request("https://maps.googleapis.com/maps/api/distancematrix/json?mode=driving&units=metric&origins=" + origin + "&destinations=" + destination + "&key=AIzaSyAIv3Iw9DRlbspV9pnNHucci1SAQnW2hYw",
					  function (err, distance) {
						var dest = (distance != null || distance !== undefined) ? JSON.parse(distance["body"]) : 0;
						distance = (dest != null && dest !== undefined && dest.rows && dest.rows.length > 0 && dest.rows[0].elements !== undefined && dest.rows[0].elements[0].distance !== undefined && dest.rows[0].elements[0].distance.value !== undefined) ? dest.rows[0].elements[0].distance.value / 1000 : 0;
						distance = (distance) ? distance : 0;
						if(distance <= range) {
							retailersArray.push(retailerData[i].id);
							retailersDistanceArray.push({'id': retailerData[i].id, 'distance': distance});
						}
					  }
					);
				}

				var cartMedicineID = cartData.map(function(item) { return item["medicine_id"]; });

				setTimeout( function() {
					//############ FINAL RETAILER LIST BASED ON DISTANCE
					let retailerInfo = [];
					Retailer.findAll({
						where: { id: {[Op.in]: retailersArray}}, 
						include: [ { 
							model: RetailerStock, 
							where: { medicine_id: {[Op.in]: cartMedicineID}}, 
							include: [ {model: ProductMaster, attributes: ['medicinename', 'manufacturer', 'strength', 'size']} ] 
						} ]
					}).then((retailerDataInRange) => {

						for(let stockData=0; stockData<retailerDataInRange.length; stockData++) {
							var stockVal = retailerDataInRange[stockData].retailer_stock_tbls;
							stockVal = stockVal.sort((a,b) => (a.mrp < b.mrp) ? 1 : ((b.mrp < a.mrp) ? -1 : 0));
							let available = stockVal.filter(o1 => cartData.some(o2 => o1.medicine_id === o2.medicine_id));
							let notAvailable = cartData.filter(o1 => !stockVal.some(o2 => o1.medicine_id === o2.medicine_id));
							let distance = retailersDistanceArray.filter((obj) => obj.id === retailerDataInRange[stockData].id);

							let uniqueAvl = available.map(item => item.medicine_id).filter((value, index, self) => self.indexOf(value) === index);

							let cartTotal = 0;
							let priceList = [];
							let availableFinal = [];
							if(uniqueAvl.length != available.length) {
								let medicineList = [];
								for(let avl=0; avl<available.length; avl++) {
									if(!medicineList.includes(available[avl].medicine_id)) {
										medicineList.push(available[avl].medicine_id);
										priceList.push({'medicine': available[avl].medicine_id, 'price': parseFloat(available[avl].mrp).toFixed(2), 'quantity': parseInt(available[avl].quantity)});
									} else {
										var mrpArray = priceList.filter((obj) => obj.medicine === available[avl].medicine_id);
										let maxMRP = 0;
										if(parseFloat(mrpArray[0].price) > parseFloat(available[avl].mrp) ) {
											maxMRP = parseFloat(mrpArray[0].price).toFixed(2);
										} else {
											maxMRP = parseFloat(available[avl].mrp).toFixed(2);
										}
										var medicineIndex = priceList.findIndex((obj => obj.medicine == available[avl].medicine_id));
										priceList[medicineIndex]['price'] = maxMRP;
										priceList[medicineIndex]['quantity'] += parseInt(available[avl].quantity);
									}
								}

								let finalList = [];
								for(let a=0; a < available.length; a++) {
									if(!finalList.includes(available[a].medicine_id)) {
										finalList.push(available[a].medicine_id);
										var cartIndex = cartData.findIndex((obj => obj.medicine_id == available[a].medicine_id));
										var medicineIndex = priceList.findIndex((obj => obj.medicine == available[a].medicine_id));
										available[a]['quantity'] = priceList[medicineIndex].quantity;
										available[a]['mrp'] = parseFloat(priceList[medicineIndex].price).toFixed(2);
										let qty = priceList[medicineIndex]['quantity'];
										if(parseInt(available[a]['quantity']) > parseInt(cartData[cartIndex]['quantity'])) {
											qty = parseInt(cartData[cartIndex]['quantity']);
										}
										cartTotal += qty * parseFloat(priceList[medicineIndex].price).toFixed(2);
										available[a].status = cartData[cartIndex]['quantity'];
										availableFinal.push(available[a]);
									}
								}

							} else {

								for(let a=0; a < available.length; a++) {
									var cartIndex = cartData.findIndex((obj => obj.medicine_id == available[a].medicine_id));
									let qty = parseInt(available[a]['quantity']);
									available[a]['mrp'] = parseFloat(available[a].mrp).toFixed(2);
									if(parseInt(available[a]['quantity']) >= parseInt(cartData[cartIndex]['quantity'])) {
										qty = parseInt(cartData[cartIndex]['quantity']);
									}
									cartTotal += qty * parseFloat(available[a]['mrp']).toFixed(2);
									available[a].status = cartData[cartIndex]['quantity'];
									availableFinal.push(available[a]);
								}

							}

							retailerDataInRange[stockData].available = availableFinal;
							retailerDataInRange[stockData].notavailable = notAvailable;
							retailerInfo.push({'retailerInfo': retailerDataInRange[stockData], 'stockAvailable': availableFinal, 'stockNotAvailable': notAvailable, 'distance': distance[0].distance, 'cartTotal': cartTotal});
						}

						retailerInfo = (retailerInfo).sort((a,b) => (a.cartTotal < b.cartTotal) ? 1 : ((b.cartTotal < a.cartTotal) ? -1 : 0));

						res.status(200).send({
							status: 200,
							error: false,
							message: message,
							retailerInfo: retailerInfo,
							patientData: patientData,
							cartData: cartData
						});

					})
					.catch((err) => {
					  res.status(500).send({
						message:
						  err.message || "Retailer not found in your range",
					  });
					});
				}, 500);
				//############ FINAL RETAILER LIST BASED ON DISTANCE
			})
			.catch((err) => {
			  res.status(500).send({
				message:
				  err.message || "Retailer not found",
			  });
			});
			//############ RETAILER INFO
		})
		.catch((err) => {
		  res.status(500).send({
			message:
			  err.message || "Patient not found",
		  });
		});
		//############ PATIENT INFO

    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Cart not present with New status",
      });
    });

};
