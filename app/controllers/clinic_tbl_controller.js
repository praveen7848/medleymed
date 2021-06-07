const Sequelize = require("sequelize");
const db = require("../models");

const Clinics = db.clinic_tbl;
const Languages = db.tbl_languages;
const Op = Sequelize.Op;
var encryption = require("../helpers/Encryption");
const base64Img = require("base64-img");
const user_tblModel = require("../models/user_tbl.model");


var MasterModule = db.master_modules_tbl;
var MastersubModule = db.master_sub_module_tbl;
var MastersubModulePages = db.master_sub_module_pages_tbl;
var MastersubModuleClinicPage = db.master_sub_module_clinic_pages_tbl


// Load Clinic Dashboard Starts
exports.clinicDashboard = (req, res) => {


  // console.log("req---------", req)
const clinicId = req.params.clinicId;
  // MasterModule.hasMany(MastersubModule, { foreignKey: "master_module_id" });
  // MastersubModule.belongsTo(MasterModule, { foreignKey: "master_module_id" });  
  // MasterModule.hasMany(MastersubModulePages, { foreignKey: "master_module_id" });
  // MastersubModulePages.belongsTo(MasterModule, { foreignKey: "master_module_id" });
  // MasterModule.hasMany(MastersubModuleClinicPage, { foreignKey: "master_module_id" });
  // MastersubModuleClinicPage.belongsTo(MasterModule, { foreignKey: "master_module_id" });
 
  // MasterModule.findAll({
  //   where: {  },
  //   include: [{ model: MastersubModule , where:{ status: 1 } }, { model: MastersubModulePages }, 
  //     { model: MastersubModuleClinicPage, where:{clinic_id: clinicId } }],
  // }) 

  MasterModule.hasMany(MastersubModule, { foreignKey: "master_module_id" });
  MastersubModule.belongsTo(MasterModule, { foreignKey: "master_module_id" });  
  MasterModule.hasMany(MastersubModulePages, { foreignKey: "master_module_id" });
  MastersubModulePages.belongsTo(MasterModule, { foreignKey: "master_module_id" });
  MasterModule.hasMany(MastersubModuleClinicPage, { foreignKey: "master_module_id" });
  MastersubModuleClinicPage.belongsTo(MasterModule, { foreignKey: "master_module_id" });
 
  MasterModule.findAll({
    where: {  },
    include: [{ model: MastersubModule , where:{ status: 1 } , required:false,attributes:{exclude: ["createdAt", "updatedAt"]}}, { model: MastersubModulePages, attributes:{exclude: ["createdAt", "updatedAt"]}}, 
        { model: MastersubModuleClinicPage, where:{clinic_id: clinicId, status:1 }, attributes:{exclude: ["createdAt", "updatedAt"]} }],
  }) 
  // // pagese wise 

  // MasterModule.hasMany(MastersubModuleClinicPage, { foreignKey: "master_module_id" });
  // MastersubModuleClinicPage.belongsTo(MasterModule, { foreignKey: "master_module_id" }); 

  // MastersubModule.hasMany(MastersubModuleClinicPage, { foreignKey: "sub_module_id" });
  // MastersubModuleClinicPage.belongsTo(MastersubModule, { foreignKey: "sub_module_id" });

  // MastersubModulePages.hasMany(MastersubModuleClinicPage, { foreignKey: "page_module_id" });
  // MastersubModuleClinicPage.belongsTo(MastersubModulePages, { foreignKey: "page_module_id" });
  // // MasterModule.hasMany(MastersubModuleClinicPage, { foreignKey: "master_module_id" });
  // // MastersubModuleClinicPage.belongsTo(MasterModule, { foreignKey: "master_module_id" });
 
  // MastersubModuleClinicPage.findAll({
  //   where: { clinic_id: clinicId  },
  //   include: [{ model: MasterModule, attributes:{exclude: ["createdAt", "updatedAt"]}, where:{ status: 1 }},{ model: MastersubModule,attributes:{exclude: ["createdAt","updatedAt"]}, where:{ status: 1 } },{ model: MastersubModulePages,attributes:{exclude: ["createdAt", "updatedAt"]} }],
  //  // include: [{ model: MasterModule, attributes:{exclude: ["createdAt","updatedAt"]}, where:{ status: 1 }},{ model: MastersubModule,attributes:{exclude: ["createdAt","updatedAt"]}, where:{ status: 1 } },{ model: MastersubModulePages,attributes:{exclude: ["createdAt", "updatedAt"]} }],
   
  // }) 

////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
// MasterModule.hasMany(MastersubModuleClinicPage, { foreignKey: "master_module_id" });
//   MastersubModuleClinicPage.belongsTo(MasterModule, { foreignKey: "master_module_id" }); 

//   MastersubModule.hasMany(MastersubModuleClinicPage, { foreignKey: "sub_module_id" });
//   MastersubModuleClinicPage.belongsTo(MastersubModule, { foreignKey: "sub_module_id" });

//   MasterModule.hasMany(MastersubModule, { foreignKey: "master_module_id" });
//   MastersubModule.belongsTo(MasterModule, { foreignKey: "master_module_id" });

//   MasterModule.findAll({
//     where: {  },
//     include: [{model:MastersubModule, required:false},{model:MastersubModuleClinicPage,  where:{clinic_id: clinicId }}]
//     // include: [{ model: MastersubModule , where:{ status: 1 } , required:false}, { model: MastersubModulePages }, 
//     //     { model: MastersubModuleClinicPage, where:{clinic_id: clinicId } }],
//   }) 

   ///////////////////////////////////////////////////////////////////////////////////////////////////////
 .then((data) => {
  if (data.length > 0) {
  MastersubModuleClinicPage.findAll({where:{clinic_id: clinicId, status:1, sub_module_id: {
          [Op.ne]: null
        } }, group: ['sub_module_id']})
        .then(function(clinicdata){
          var clinicdataarr = [];
          for(var i=0; i< clinicdata.length; i++)
          {
            var obj={};
            obj.id = clinicdata[i].sub_module_id;
            clinicdataarr.push(obj);
          }
         
var data1=[];
var finalArr = [];
for(var j=0; j < data.length; j++ )
{
var objj={}
objj.module_name=data[j].module_name;
objj.id=data[j].id;
objj.image_path=data[j].image_path;
objj.sequence_id=data[j].sequence_id;
objj.status=data[j].status;
if(data[j].master_sub_module_tbls !="")
{
clinicdataarr.map(item => {
data[j].master_sub_module_tbls.map(item1 => {
 if (item.id === item1.id) {
  var yy={}
  yy.id=item1.dataValues.id;
  yy.master_module_id=item1.dataValues.master_module_id;
  yy.sub_module_name= encryption.decryptData(item1.dataValues.sub_module_name);
  yy.image_path= item1.dataValues.image_path;
  yy.tag_line= encryption.decryptData(item1.dataValues.tag_line);
  yy.sequence_id= item1.dataValues.sequence_id;
  yy.status= item1.dataValues.status;  
 finalArr.push(Object.assign(item, yy));
 }
 })
 })
 //finalArr.push(data[0].master_sub_module_tbls[0].dataValues);
 objj.master_sub_module_tbls= finalArr; 
 }
else{
  objj.master_sub_module_tbls=[];
}
objj.master_sub_module_pages_tbls=data[j].master_sub_module_pages_tbls;
objj.master_sub_module_clinic_pages_tbls=data[j].master_sub_module_clinic_pages_tbls;
data1.push(objj);
}
if(data1){ var clinicDetails =  data1; }
else { var clinicDetails = "No Records found."; }

 res.status(200).send({
            status: 200,
            error: false,
            message: "Clinic Menu was fetched successfully.",
            data: clinicDetails,
          });
        })
      }
       
      // } else {
      //   var clinicDetails = "No Records found.";
      // }
      // res.status(200).send({
      //   status: 200,
      //   error: false,
      //   message: "Clinic Menu was fetched successfully.",
      //   data: clinicDetails,
      // });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Doctor List.",
      });
    });
  };





exports.create = (request, response) => {
  if (!request.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    // console.log(request.body);

    let clinicImageDetails = "";
    if (request.body.clinic_pic != "") {
      clinicImageDetails = request.body.clinic_pic;
      delete request.body["clinic_pic"];
    }

    // const clinicValues = {
    //   user_tbl_id: request.body.user_tbl_id,
    //   corporate_clinic_id: request.body.corporate_clinic_id,
    //   clinic_name: request.body.clinic_name,
    //   address: request.body.address,
    //   pincode: request.body.pincode,
    //   no_of_doctors: request.body.no_of_doctors,
    //   no_of_nurses: request.body.no_of_nurses,
    //   mobile_no1: request.body.mobile_no1,
    //   mobile_no2: request.body.mobile_no2,
    //   mobile_no3: request.body.mobile_no3,
    //   mobile_no4: request.body.mobile_no4,
    //   mobile_no5: request.body.mobile_no5,
    //   email1: request.body.email1,
    //   email2: request.body.email2,
    //   email3: request.body.email3,
    //   email4: request.body.email4,
    //   email5: request.body.email5,
    //   clinic_speciality: request.body.clinic_speciality,
    //   username: request.body.username,
    //   password: request.body.password,
    //   clinic_phone_no: request.body.clinic_phone_no,
    //   clinic_registration_no: request.body.clinic_registration_no,
    //   kyc_detail_id: request.body.kyc_detail_id,
    //   email_id: request.body.email_id,
    //   clinic_website: request.body.clinic_website,
    //   opened_at: request.body.opened_at,
    //   closed_at: request.body.closed_at,
    //   clinic_type: request.body.clinic_type,
    //   status: request.body.status,
    //   role: request.body.role,
    //   latitude: request.body.latitude,
    //   longitude: request.body.longitude,
    //   kyc_status: request.body.kyc_status,
    //   lat: request.body.lat,
    //   lng: request.body.lng,
    // };
    // console.log(clinicValues);
    Clinics.create(request.body)
      .then((data) => {
        if (request.body.clinic_pic != "") {
          const CLINIC_FILE_PATH = "./public/uploads/clinic";
          base64Img.img(
            clinicImageDetails.base64,
            CLINIC_FILE_PATH,
            Date.now(),
            function (err, filepath) {
              const pathArr = filepath.split("/");
              const fileName = pathArr[pathArr.length - 1];
              const updatefinalName = filepath.replace(/\\/g, "/").split("/");
              const updatefinalFileName = updatefinalName[3];
              const clinicImageData = "/uploads/clinic/" + updatefinalFileName;
              var options = { where: { id: data.id } };
              Clinics.update(
                { clinic_logo: clinicImageData },
                options
              ).then((data) => {});
            }
          );
        }

        response.status(200).send({
          status: 200,
          error: false,
          message: "Clinic Created Successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        // response.status(500).send({
        //   message: "Error updating Clinic",
        // });
      });
  }
};

// Retrieve all Clinics from the clinic list.
exports.findAll = (req, res) => {
  Clinics.findAll({})
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Clinic records found",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Clinic.",
      });
    });
};

// Find a single Clinics with an Name
// exports.findOne = (req, res) => {
//   const name = req.body.name;
//   console.log(req);
//   Clinics.findAll({
//     where: {
//       clinic_name: {
//         [Op.like]: "%" + name + "%",
//       },
//     },
//   })
//     .then((data) => {
//       res.send({
//         status: 200,
//         error: false,
//         message: "Clinic records found",
//         data: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving Clinic.",
//       });
//     });
// };

// Find a single Patient Appointment with an Name
exports.findOne = (req, res) => {
  const clinicId = req.params.id;
  Clinics.findAll({
    where: {
      id: clinicId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "id"],
    },
  })
    .then((data) => {
      res.send({
        status: 200,
        error: false,
        message: "Clinic Data Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

// Update a Clinic by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if (req.body.data) {
    req.body = req.body.data;
  }

  let clinicImageDetails = "";
  if (req.body.clinic_pic != "") {
    clinicImageDetails = req.body.clinic_pic;
    delete req.body["clinic_pic"];
  }

  // console.log(req.body);
  // console.log(clinicImageDetails+" >>> clinicImageDetails ");
  // return;

  Clinics.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        if (req.body.clinic_pic != "") {
          const CLINIC_FILE_PATH = "./public/uploads/clinic";
          base64Img.img(
            clinicImageDetails.base64,
            CLINIC_FILE_PATH,
            Date.now(),
            function (err, filepath) {
              const pathArr = filepath.split("/");
              const fileName = pathArr[pathArr.length - 1];
              const updatefinalName = filepath.replace(/\\/g, "/").split("/");
              const updatefinalFileName = updatefinalName[3];
              const clinicImageData = "/uploads/clinic/" + updatefinalFileName;
              var options = { where: { id: id } };
              Clinics.update(
                { clinic_logo: clinicImageData },
                options
              ).then((data) => {});
            }
          );
        }

        res.send({
          status: 200,
          error: false,
          message: "Clinics was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Clinics with id=${id}. Maybe Clinics was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).send({
      //   message: "Error updating Audit Trail with id=" + id,
      // });
    });
};

// Delete a Clinic with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Clinics.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Clinics was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Clinics with id=${id}. Maybe Clinics was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Clinics with id=" + id,
      });
    });
};

// Delete all Clinic from the database.
exports.deleteAll = (req, res) => {
  Clinics.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Clinics were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Clinics.",
      });
    });
};

// Retrieve all Languages 
exports.findClinicid = (req, res) => {  
  var clinicid = req.params.id;
  Clinics.findOne({ where: { id:clinicid } })
    .then((data) => {
      if(data)
      {
      var lanids = JSON.parse("[" + data.selected_language_id + "]"); 
      Languages.findAll({ where: { id : { [Op.in]: lanids } }, attributes: ["id","name", "iso_val", "language_pic"] })
        .then((languagesdata) => {
          //res.send(data);
          res.status(200).send({
            status: 200,
            error: false,
            message: "Clinic Data Fetched Successfully.",
            data: languagesdata,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error updating  Languages with id=" + clinicid,
          });
        });
      }
      else{
        res.status(500).send({
          message: "Some error occurred while retrieving Clinic List."
        });
      }

    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Clinic List.",
      });
    });
};


