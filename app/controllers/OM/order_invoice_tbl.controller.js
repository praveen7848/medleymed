const db = require("../../models");

const cartTbl = db.cart_tbl;
const Retailer = db.retailer_registration_tbl;
const retailerStockTbl = db.retailer_stock_tbl;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const orderProcessing = db.order_processing_tbl;
const orderStatus = db.order_status_tbl;
const orderTable = db.order_tbl;
const Users = db.users_tbl;
const Patient = db.patient_tbl;
const deliveryAddress = db.delivery_address_tbl;
const orderInvoice = db.order_invoice_tbl;
const ProductMaster = db.products_master_tbl;
const Op = db.Sequelize.Op;
const AuditTrail = db.audit_trails;
var encryption = require("../../helpers/Encryption");
var invoicePDF = require("html-pdf");
const moment = require("moment");
const emailHelper = require("../../helpers/Email");
var fs = require("fs");

exports.create = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    var minNumber = 1000000;
    var maxNumber = 9999999;
    const generatedInvoiceNumber =
      Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    let invoiceDetails = req.body.invoice_details;
    let invoiceDetailsLength = invoiceDetails.length;

    // console.log("orderDetailsLength " + invoiceDetailsLength);

    if (invoiceDetailsLength > 0) {
      orderInvoice.bulkCreate(invoiceDetails).then((data) => {
        const id = req.params.id;
        var user_type = "Admin";
        const invoiceNumber = {
          invoice_no: generatedInvoiceNumber,
        };
        orderInvoice
          .update(invoiceNumber, {
            where: { order_id: req.body.order_id },
          })
          .then((num) => {
            console.log("num >>> " + num);
            // if (num == 1) {
            const invoiceOrderDetails = {
              payment_mode: req.body.payment_mode,
              total_taxable_amount: req.body.total_taxable_amount,
              total_taxes: req.body.total_taxes,
              sub_total: req.body.sub_total,
              invoice_date: req.body.invoice_date,
              discount: req.body.discount,
              total_paid: req.body.total_paid,
              invoice_date: req.body.invoice_date,
            };
            orderTable
              .update(invoiceOrderDetails, {
                where: { id: req.body.order_id },
              })
              .then((data) => {
                let stockData = req.body.stock_details;
                let stockDataLength = stockData.length;

                if (stockDataLength > 0) {
                  stockData.forEach((arg) => {
                    updateRetailerStock(arg, req, res);
                  });
                }

                // let updateAppointmentColumn = {
                //   order_status: "2",
                // };
                // let whereObject = {
                //   where: {
                //     id: req.body.order_id,
                //   },
                // };

                // orderTable.update(updateAppointmentColumn, {
                //   where:  {
                //     id: req.body.order_id,
                //   },
                // }).then((num) => {
                //   // console.log("Num >>> "+num);
                //   if (num == 1) {
                //   // console.log("Status Flag Updated");
                //   }else{
                //   // console.log("Status Flag Not Updated");
                //   }
                // });

                const auditTrailVal = {
                  user_id: req.body.order_id,
                  trail_type: "Admin",
                  trail_message: "Invoice added Successfully",
                  status: 1,
                };
                AuditTrail.create(auditTrailVal, (err, data) => {});
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Invoice added Successfully",
                  invoiceId: generatedInvoiceNumber,
                });
              });
          });
      });
    }
  }
};

// update Retailer Stock
function updateRetailerStock(arg, req, res) {
  const stockTblVal = {
    retailer_id: arg.retailer_id,
    medicine_id: arg.medicine_id,
    batch: arg.batch,
    expiry_date: arg.expiry,
    mrp: arg.mrp,
  };
  retailerStockTbl
    .findAll({
      where: stockTblVal,
    })
    .then(function (resData) {
      if (resData.length > 0) {
        let currentStock = resData[0].quantity;
        if (currentStock > 0) {
          let reduceStock = arg.quantity;
          console.log(
            currentStock + " <<< currentStock + reduceStock>>>>> " + reduceStock
          );
          let finalStock = parseInt(currentStock) - parseInt(reduceStock);
          console.log("finalStock >>>" + finalStock);
          const updateQuantity = {
            quantity: finalStock,
          };
          retailerStockTbl
            .update(updateQuantity, {
              where: stockTblVal,
            })
            .then((num) => {
              if (num == 1) {
                console.log("Stock Quantity Reduced");
              }
            });
        }
      }
    });
}
// Ends


//get the Retailer Order details
exports.generateInvoicePDF = (req, res) => {
  const retailerId = req.params.retailerId;
  const orderId = req.params.orderId;

  // console.log("PDF Retailer Id >>> " + retailerId);
  // console.log("PDF Order Id >>> " + orderId);

  orderTable.hasMany(orderInvoice, { foreignKey: "order_id" });
  orderInvoice.belongsTo(orderTable, { foreignKey: "order_id" });

  // ProductMaster.hasMany(orderInvoice, { foreignKey: "medicine_id" });
  // orderInvoice.belongsTo(ProductMaster, { foreignKey: "medicineid" });

  ProductMaster.hasMany(orderInvoice, { foreignKey: "medicine_id" });
  orderInvoice.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  Retailer.hasMany(orderTable, { foreignKey: "retailer_id" });
  orderTable.belongsTo(Retailer, { foreignKey: "retailer_id" });

  Patient.hasMany(orderTable, { foreignKey: "patient_id" });
  orderTable.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(deliveryAddress, { foreignKey: "patient_id" });
  deliveryAddress.belongsTo(Patient, { foreignKey: "patient_id" });

  orderTable
    .findAll({
      where: {
        retailer_id: retailerId,
        id: orderId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: orderInvoice,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          order: [
            ["medicine_id", "ASC"],
          ],
          include: [
            {
              model: ProductMaster,
              required: false,
              order: [
                ["id", "ASC"],
                ["medicinename", "ASC"],
              ],
            },
          ],
        },
        {
          model: Patient,
          required: false,
          attributes: ["id", "name", "phone_number"],
          include: [
            {
              model: deliveryAddress,
              required: false,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        },
        {
          model: Retailer,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    })
    .then((invoiceData) => {
      let isInvoiceData = invoiceData.length;
      if (isInvoiceData) {
        const orderInvoice = invoiceData[0].order_invoice_tbls.length;
        const patientTbl = invoiceData[0].patient_tbl;
        const isRetailer = invoiceData[0].retailer_registration_tbl;
        let retailerAddress = "N/A";
        let storeName = "N/A";
        let retailerCurrency = "N/A";
        let patientDeliveryAddress = "N/A";
        let orderId = "N/A";
        let invoiceNumber = "N/A";
        let registrationNumber = "N/A";
        let newOrderDate = "N/A";
        let newOrderDateTime = "N/A";
        let deliveryAddress = "N/A";

        if (isRetailer) {
          retailerAddress = invoiceData[0].retailer_registration_tbl.address;
          storeName = invoiceData[0].retailer_registration_tbl.storename;
          retailerCurrency = invoiceData[0].retailer_registration_tbl.currency;
          registrationNumber =
            invoiceData[0].retailer_registration_tbl.registration_number;
        }

        if (orderInvoice > 0) {
          orderId = invoiceData[0].order_invoice_tbls[0].order_id;
          invoiceNumber = invoiceData[0].order_invoice_tbls[0].invoice_no;
          let orderDate = invoiceData[0].order_invoice_tbls[0].order_date;
          const orderDateFormat = new Date(orderDate);
          newOrderDate =
            moment(orderDateFormat).format("DD") +
            " " +
            moment(orderDateFormat).format("MMMM") +
            " " +
            moment(orderDateFormat).format("YYYY");
          const myOrderDate = new Date("2015-06-17 14:24:36");
          newOrderDateTime =
            moment(myOrderDate).format("DD") +
            " " +
            moment(myOrderDate).format("MMMM") +
            " " +
            moment(myOrderDate).format("YYYY") +
            " " +
            moment(myOrderDate).format("hh:mm A");

          // var myDate = new Date("2015-06-17 14:24:36");
          // console.log(moment(myDate).format("YYYY-MM-DD HH:mm:ss"));
          // console.log("Date: "+moment(myDate).format("YYYY-MM-DD"));
          // console.log("Year: "+moment(myDate).format("YYYY"));
          // console.log("Month: "+moment(myDate).format("MM"));
          // console.log("Month: "+moment(myDate).format("MMMM"));
        }

        let invoiceHtml = "<div style='margin:10px;display:block;'>";
        invoiceHtml += "<div >";
        invoiceHtml +=
          "<h2 style='font-size: 14px;margin:5px 0px;color:#000;font-family: sans-serif;'>" +
          storeName +
          "</h2>";
        invoiceHtml += "</div>";
        invoiceHtml +=
          "<div style='margin: 10px 0px;display: inline-block;width: 100%;'>";
        invoiceHtml += "<div style='width: 50%;float:left;'>";
        invoiceHtml +=
          "<h4 style='letter-spacing: 0px;color: #000000;font-size:10px;margin:2px 0px;opacity: 1;font-family: sans-serif;font-weight: 600;display: inline-block;margin-right:20px;'>Invoice number : <span style='font-weight:300;font-size:10px;color:#212121;font-family: sans-serif;letter-spacing: 0px;opacity:1;'>" +
          orderId +
          "</span> </h4>";
        invoiceHtml +=
          "<h4 style='letter-spacing: 0px;color: #000000;font-size:10px;margin:2px 0px;opacity: 1;font-family: sans-serif;font-weight: 600;display: inline-block;margin-right:20px;'>DL number : <span style='font-weight:300;font-size:10px;color:#212121;font-family: sans-serif;letter-spacing: 0px;opacity:1;'>" +
          registrationNumber +
          "</span> </h4>";
        invoiceHtml +=
          " <p style='letter-spacing: 0px;color: #000000;font-size:10px;margin:2px 0px;opacity: 1;font-family: sans-serif;font-weight: 300;'>" +
          retailerAddress +
          "</p>";
        invoiceHtml += " </div>";
        invoiceHtml +=
          "<div style='float: right;width: 50%;text-align: right;'>";
        invoiceHtml +=
          "<p style='letter-spacing: 0px;color: #000000;font-size:10px;margin:2px 0px;opacity: 1;font-family: sans-serif;font-weight: 600;'>Order NO: <span style='font-weight:300;font-size:10px;color:#212121;font-family: sans-serif;letter-spacing: 0px;opacity:1;'>" +
          orderId +
          "</span></p>";
        invoiceHtml +=
          "<p style='letter-spacing: 0px;color: #000000;font-size:10px;margin:2px 0px;opacity: 1;font-family: sans-serif;font-weight: 600;'>Order Date: <span style='font-weight:300;font-size:10px;color:#212121;font-family: sans-serif;letter-spacing: 0px;opacity:1;'>" +
          newOrderDate +
          "</span></p>";
        invoiceHtml +=
          "<p style='letter-spacing: 0px;color: #000000;font-size:10px;margin:2px 0px;opacity: 1;font-family: sans-serif;font-weight: 600;'>Invoice Date: <span style='font-weight:300;font-size:10px;color:#212121;font-family: sans-serif;letter-spacing: 0px;opacity:1;'>" +
          newOrderDateTime +
          "</span></p>";
        invoiceHtml += "</div>";
        invoiceHtml += "</div>";
        invoiceHtml += "<div style='margin:5px 0px 0px 0px;'>";
        invoiceHtml +=
          "<div  style='display: block;width: 100%;overflow-x: auto;'>";
        invoiceHtml +=
          "<table class='table' style='width: 100%;margin-bottom: 0px;border-collapse: collapse;background-color: transparent;border: 1px solid #ddd;'>";
        invoiceHtml +=
          "<thead style='background:#3b3e82 0% 0% no-repeat padding-box;opacity: 1;'>";
        invoiceHtml += " <tr>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;'>Sl.NO</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;'>Product</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;' >Batch & Expiry</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;'>MRP</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding:  4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;'>Qty.</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;' >Taxable Amt.</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;' >Vat %</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;'>Vat Amt.</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;'>Discount</th>";
        invoiceHtml +=
          "<th style='border-bottom: none;padding: 4px 6px;color: #fff;border: none;font-size: 8px;font-weight:600;font-family: sans-serif;text-align: left;border: 1px solid #ddd;' >Total Amt.</th>";
        invoiceHtml += " </tr>";
        invoiceHtml += "</thead>";
        invoiceHtml += "<tbody>";

        let tableRowData = "";
        if (orderInvoice > 0) {
          let invoiceDetails = invoiceData[0].order_invoice_tbls;

          for (let i = 0; i < invoiceDetails.length; i++) {
            tableRowData += "<tr >";
            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              i +
              "</td>";

            if (invoiceDetails[i].products_master_tbl != null) {
              tableRowData +=
                "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 600;letter-spacing: 0px;border: 1px solid #ddd;'>" +
                invoiceDetails[i].products_master_tbl.medicinename +
                "<p style='font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;margin:5px 0px 0px 0px;'>" +
                invoiceDetails[i].products_master_tbl.manufacturer +
                "</p>";
              tableRowData += "</td>";
            } else {
              tableRowData +=
                "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 600;letter-spacing: 0px;border: 1px solid #ddd;'>N/A</td>";
            }

            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              invoiceDetails[i].batch +
              " - " +
              invoiceDetails[i].expiry +
              "</td>";
            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              retailerCurrency +
              " " +
              invoiceDetails[i].mrp +
              "</td>";
            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              invoiceDetails[i].quantity +
              "</td>";
            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              retailerCurrency +
              " " +
              invoiceDetails[i].taxable_rate +
              "</td>";
            tableRowData +=
              " <td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              invoiceDetails[i].vat +
              "</td>";
            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              retailerCurrency +
              " " +
              invoiceDetails[i].vat_amount +
              "</td>";
            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              invoiceDetails[i].discount +
              "</td>";
            tableRowData +=
              "<td style='padding: 4px 6px;font-size: 8px;font-family: sans-serif;color: #000;font-weight: 500;letter-spacing: 0px;border: 1px solid #ddd;'>" +
              retailerCurrency +
              " " +
              invoiceDetails[i].amount +
              "</td>";
            tableRowData += "</tr>";
          }
        } else {
          tableRowData += "<tr>No Invoice Found</tr>";
        }
        invoiceHtml += tableRowData;
        invoiceHtml += "</tbody>";
        invoiceHtml += "</table>";
        invoiceHtml += "</div>";
        invoiceHtml += "</div>";
        invoiceHtml += "<div style='margin:6px 0px;float:right'>";
        invoiceHtml +=
          "<div style='display: inline-block;vertical-align: top;margin-right:25px;'>";
        invoiceHtml +=
          "<p style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Total Taxable Amount: <span>" +
          retailerCurrency +
          " " +
          invoiceData[0].total_taxable_amount +
          "</span></p>";
        invoiceHtml +=
          "<p  style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Total Taxes: <span>" +
          retailerCurrency +
          " " +
          invoiceData[0].total_taxes +
          "</span></p>";
        invoiceHtml += "</div>";
        invoiceHtml +=
          "<div style='display: inline-block;vertical-align: top;'>";
        invoiceHtml +=
          "<p  style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Sub Total : <span>" +
          retailerCurrency +
          " " +
          invoiceData[0].sub_total +
          "</span></p>";
        invoiceHtml +=
          "<p  style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Discount : <span>" +
          retailerCurrency +
          " " +
          invoiceData[0].discount +
          "</span></p>";
        invoiceHtml +=
          "<p  style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Delivery Charges : <span>" +
          retailerCurrency +
          " " +
          invoiceData[0].delivery_charges +
          "</span></p>";
        invoiceHtml +=
          "<h2  style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:600;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Total Paid: <span>" +
          retailerCurrency +
          " " +
          invoiceData[0].total_paid +
          "</span></h2>";
        invoiceHtml += "</div>";
        invoiceHtml += "</div>";
        invoiceHtml +=
          "<div style='margin: 6px 0px;float: left;width: 100%;border-top: 2px solid #000;border-bottom: 2px solid #000;'>";
        invoiceHtml +=
          "<div style='display: inline-block;vertical-align: top;'>";
        invoiceHtml +=
          "<h4 style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:600;margin:6px 25px 6px 0px;opacity: 1;font-family: sans-serif;'>Payment Mode : <span  style='display:block;letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:6px 0px;opacity: 1;font-family: sans-serif;'>" +
          invoiceData[0].payment_mode +
          " </span></h4>";
        invoiceHtml += "</div>";
        invoiceHtml += "<div style='display: inline-block;width:50%;'>";
        invoiceHtml +=
          "<h4 style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:600;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Delivery Address:";
        invoiceHtml +=
          "<span  style='display:block;letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:6px 0px;opacity: 1;font-family: sans-serif;line-height:22px;'>";

        // D. No: 13-8-160, Shop NO- 12, House Society Building, Axis Bank, Madhapur, Hyderabad,Telangana 50045
        if (invoiceData[0].patient_tbl != null) {
          if (invoiceData[0].patient_tbl.delivery_address_tbls != null && invoiceData[0].patient_tbl.delivery_address_tbls.length > 0) {
            console.log("Delivery address >> ");
            let dAddress = invoiceData[0].patient_tbl.delivery_address_tbls[0];
            patientDeliveryAddress =
              dAddress.address +
              "," +
              dAddress.location +
              "," +
              dAddress.landmark;
          }
        }

        invoiceHtml += patientDeliveryAddress;
        invoiceHtml += "</span></h4>";
        invoiceHtml += "</div>";
        invoiceHtml += "</div>";
        invoiceHtml +=
          "<div style='margin-bottom:10px;width:100%;float:left;'>";
        invoiceHtml += "<div >";
        invoiceHtml +=
          "<p style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:600;margin:6px 0px;opacity: 1;font-family: sans-serif;'>Terms and Conditions</p>";
        invoiceHtml +=
          "<p  style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:4px 0px;opacity: 1;font-family: sans-serif;'>1. Exchange of goods NOT accepted after 72 hrs of PURCHASE. Bill is required for Exchange. Subject to Hyderabad Jurisdiction. </p>";
        invoiceHtml +=
          "<p style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:4px 0px;opacity: 1;font-family: sans-serif;'>2. Fridge items will not be taken back.</p>";
        invoiceHtml +=
          "<p style='letter-spacing: 0px;color: #000000;font-size:10px;font-weight:500;margin:4px 0px;opacity: 1;font-family: sans-serif;'>3. No charge is payable on reverse charge basis.</p>";
        invoiceHtml += "</div>";
        invoiceHtml += "</div>";
        invoiceHtml += "</div>";
        console.log("Invoice Html PDF " + invoiceHtml);

        var options = {
          format: "Letter",
          zoomFactor: "0.75",
          border: {
            top: "0.75in", // default is 0, units: mm, cm, in, px
            right: "0.75in",
            bottom: "0.75in",
            left: "0.75in",
          },
        };
        let invoicePDFName =
          "Invoice_" + orderId + "_" + invoiceNumber + ".pdf";
        console.log("INVOICE " + invoicePDFName);

        // Working Code Starts
        invoicePDF
          .create(invoiceHtml, options)
          .toFile(
            "./public/uploads/patient/OM/invoice/" + invoicePDFName,
            function (err, result) {
              if (err) return console.log(err);
            }
          );

        if (invoicePDFName) {
          Users.hasOne(Patient, { foreignKey: "user_id" });
          Patient.belongsTo(Users, { foreignKey: "user_id" });
          Users.findAll({
            where: { id: invoiceData[0].patient_id },
          }).then((userTableData) => {

            let userEmail = "";
            // if(userTableData[0].email != undefined){
            //    userEmail = userTableData[0].email;
            // }
            
            // console.log(userEmail + " >>> userEmail ");

            let attachmentData = [];

            let patientMessageBody = "";
            patientMessageBody += "<p>Stay healthy, stay safe!!</p>";
            patientMessageBody += "<p>Thank you for choosing MedleyMed</p>";

            const filepath =
              "./public/uploads/patient/OM/invoice/" + invoicePDFName;
              
            if (fs.existsSync(filepath)) {
              attachmentData = [
                {
                  filename: invoicePDFName,
                  path: filepath,
                  contentType: "application/pdf",
                },
              ];
              generatedInvoice = "/uploads/patient/OM/invoice/" + invoicePDFName;
              let updateAppointmentColumn = {
                invoice: generatedInvoice,
                order_status: "3",
              };
              let whereObject = {
                where: {
                  id: orderId,
                },
              };
              orderTable.update(updateAppointmentColumn, {
                where:  {
                  id: orderId,
                },
              }).then((num) => {
                // console.log("Num >>> "+num);
                if (num == 1) {

                  // if (userEmail) {
                  //   var email = emailHelper.sendEmail(
                  //     userEmail,
                  //     "Invoice Generated",
                  //     patientMessageBody,
                  //     attachmentData
                  //   );
                  // }
                  
                // console.log("Column Updated");
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Retailer Invoice generated successfully...",
                  invoicePath: "/uploads/patient/OM/invoice/" + invoicePDFName,
                  // data: invoiceData,
                  // dataLength: invoiceData.length,
                });
                }else{
                // console.log("Column Not Updated");
                }
              });
              // 'avinash.a@medleymed.com'
             
            }
          });

        
        }
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Retailer Invoice Details not found",
          dataLength: invoiceData.length,
          data: invoiceData,
        });
      }
    });
};
