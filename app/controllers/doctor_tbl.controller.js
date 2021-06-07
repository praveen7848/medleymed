const Sequelize = require("sequelize");
const db = require("../models");
const Doctor = db.doctor_tbl;
const Users = db.users_tbl;
const Doctoreducation = db.doctor_education;
const Appointments = db.patient_appointment_tbl;
const Patient = db.patient_tbl;
const Clinic = db.clinic_tbl;
const Op = Sequelize.Op;
const multer = require("multer");
var fs = require("fs");
const AuditTrail = db.audit_trails;
const base64Img = require("base64-img");
let encryption = require("../helpers/Encryption");
const imgurl = "https://www.uzima.co.za";

// Retrieve all Doctors
// exports.findAll = (req, res) => {
//     Doctor.findAll({})
//       .then((data) => {
//         res.send(data);
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving Doctor List.",
//         });
//       });
//   };




// fetch doctors list
exports.searchDoctorParameters = (req, res) => {
  // console.log(req.body);
   let filterItems = "";
  // console.log("Decrypt Data1 "+encryption.decryptData('h6lCdSd0d4l4+GaWZ9hLng=='));
  // console.log("Decrypt Data2 "+encryption.decryptData('c8ZMPZ5XS6V3RPaz7kkH5w=='));
  // console.log("Decrypt Data3 "+encryption.decryptData('hk9KV6gtZlWh56NU7AVMiaHNIi4mA0RdxKhmZcWVYIs='));
  // SbrA1V4Op6jK9JkXAFCcro004jmMg61J/bYS01sXhXg=
  // encryption.encryptData();

  // if (req.body.experience_range) {
  //   let experience = "";
  // }
  

  var db = require("../models");

  if (req.body.gender) {
    filterItems += " gender='" + encryption.encryptData(req.body.gender) + "' ";
  }

  // return;

  db.sequelize
    .query("select * from doctor_tbls where" + filterItems)
    .then(function (data) {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor Details Fetched Sucessfully..",
        data: data,
      });
    });
};



exports.findAll = (req, res) => {
  
  Users.hasOne(Doctor, { foreignKey: "user_id" });
  
  Doctor.belongsTo(Users, { foreignKey: "user_id" });

  Clinic.hasOne(Doctor, { foreignKey: "clinic_id" });

  Doctor.belongsTo(Clinic, { foreignKey: "clinic_id" });

  Doctor.findAll({ 
    include: [
      { model: Users, attributes: ["id","name","email","mobile_number",], order: [["name", "desc"]] },
      { model: Clinic, attributes: ["clinic_name"] },
    ],

    order: [[{ model: Users }, "name", "ASC"]],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    //attributes:["id","speciality","education","fees","experience","profile_pic","signature_pic","practice","languages","area_of_expertise","registraion_no"],
  })
    .then((data) => {
      //res.send({ message: "Doctor was fetched successfully.", data });
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor was fetched successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Doctor List.",
      });
    });
};

// Find a single Doctor with an by id
exports.findOne = (req, res) => {
  //console.log(req.params.id);
  const id = req.params.id;
  Users.hasOne(Doctor, { foreignKey: "user_id" });  
  Doctor.belongsTo(Users, { foreignKey: "user_id" });
  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  Doctor.findAll({
    where: {
      id: id,
    },
    include: [
      { model: Users, attributes: ["id","name","email","mobile_number","password"]}],
  })
    .then((data) => {
      //res.send(data);
      res.status(200).send({
        status:200,
        error:false,
        message: "Doctor Details Fetched Sucessfully.",
        data:data
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Doctors.",
      });
    });
};

// Create a Language Name

// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";

  let profileDetails = "";
  if (req.body.profile_pic != "") {
    profileDetails = req.body.profile_pic;
    //delete req.body["profile_pic"];
  }

  let signatureDetails = "";
  if (req.body.signature_pic != "") {
    signatureDetails = req.body.signature_pic;
    //delete req.body["signature_pic"];
  }

   //console.log(req.body);
  // console.log(signatureDetails);
  //return;
  delete req.body["profile_pic"];
  delete req.body["signature_pic"];
  Doctor.update(req.body, {
    where: { id: id },
  }).then((num) =>  {
      if (num == 1) {
        Doctor.findOne({where: {id: id}})
          .then((data) => {
            let userdata = {
              email: req.body.email,
              password: req.body.password };
           Users.update(userdata, {where: { id: data.user_id }});
          });
        
        if (profileDetails != "") {
          const PROFILE_FILE_PATH = "./public/uploads/doctor/profile_image";
            base64Img.img(profileDetails.base64,PROFILE_FILE_PATH,Date.now(),function (err, filepath) {

                const pathArr = filepath.split("/");
                const fileName = pathArr[pathArr.length - 1];

                const updatefinalName = filepath.replace(/\\/g, '/').split('/');
                const updatefinalFileName = updatefinalName[4];

                const profileImageData = "/uploads/doctor/profile_image/" + updatefinalFileName;

                var options = {where: {id: id,},};
                Doctor.update({profile_pic: profileImageData,},options).then((data) => { });

              });
            }
         
            if (signatureDetails != "") {
              const SIGNATURE_FILE_PATH = "./public/uploads/doctor/signatures";
              base64Img.img(signatureDetails.base64,SIGNATURE_FILE_PATH,Date.now(),function (err, filepath) {

                const pathArr = filepath.split("/");
                const fileName = pathArr[pathArr.length - 1];

                const updatefinalName = filepath.replace(/\\/g, '/').split('/');
                const updatefinalFileName = updatefinalName[4];

                const profileImageData = "/uploads/doctor/signatures/" + updatefinalFileName;

                var options = {where: {id: id,},};
                Doctor.update({signature_pic: profileImageData,},options).then((data) => { });

              });
            }

        res.send({
          message: "Doctor was updated successfully.",
        });

      } else {
        res.send({
          message: `Cannot update Doctor with id=${id}. Maybe Doctor was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).send({
      //   message: "Error updating Doctor with id=" + id,
      // });
    });
};

exports.uploaddoctorimage = (req, res) => {
  const id = req.params.id;
  const FILE_PATH = "./public/uploads/Doctors";
  const upload = multer({
    dest: `${FILE_PATH}/`,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    // limits: { fileSize: 1000000 },
  }).single("myImage");

  upload(req, res, (err) => {
    if (err) {
      return res.end("Error uploading file." + err);
    }
    if (req.file != undefined) {
      var imageData = "/uploads/Doctors/" + req.file.filename + ".jpeg"; //fs.readFileSync(req.file.path);
      if (
        req.file.mimetype == "image/jpg" ||
        req.file.mimetype == "image/png" ||
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/gif"
      ) {
        var newfile = req.file.filename + ".jpeg";
      }
      var oldfile = req.file.filename;
      fs.renameSync(
        "./public/uploads/Doctors/" + oldfile,
        "./public/uploads/Doctors/" + newfile
      );
    } else {
      imageData = "";
    }
    var imgobjData = { profile_pic: imageData };
    userTypeController = Doctor;
    var options = { where: { id: id } };
    userTypeController
      .update(imgobjData, options)
      .then((data) => {
        res.send({
          message: "Doctor image updated successfully.",
          data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Patient List.",
        });
      });
    // 	/*Now do where ever you want to do*/
  });
};

exports.uploaddoctorsignature = (req, res) => {
  const id = req.params.id;
  const FILE_PATH = "./public/uploads/Doctorsignature";
  const upload = multer({
    dest: `${FILE_PATH}/`,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    // limits: { fileSize: 1000000 },
  }).single("myImage1");

  upload(req, res, (err) => {
    if (err) {
      return res.end("Error uploading file." + err);
    }
    if (req.file != undefined) {
      var imageData = "/uploads/Doctorsignature/" + req.file.filename + ".jpeg"; //fs.readFileSync(req.file.path);
      if (
        req.file.mimetype == "image/jpg" ||
        req.file.mimetype == "image/png" ||
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/gif"
      ) {
        var newfile = req.file.filename + ".jpeg";
      }
      var oldfile = req.file.filename;
      fs.renameSync(
        "./public/uploads/Doctorsignature/" + oldfile,
        "./public/uploads/Doctorsignature/" + newfile
      );
    } else {
      imageData = "";
    }
    var imgobjData = { signature_pic: imageData };
    userTypeController = Doctor;
    var options = { where: { id: id } };
    userTypeController
      .update(imgobjData, options)
      .then((data) => {
        res.send({
          message: "Doctor signature  updated successfully.",
          data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving uploading image.",
        });
      });
    // 	/*Now do where ever you want to do*/
  });
};
// Delete a Doctor with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  Doctor.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        //     const auditTrailVal = {
        //         'user_id' : req.params.id,
        //         'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Countries Modules',
        //         'trail_message' :  req.params.id+ ' '+ ' is Countries Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //         'status': 1
        //       }
        //   AuditTrail.create(auditTrailVal,(err, data)=>{ });
        res.send({
          message: "Doctor  was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Docotrs with id=${id}. Maybe Doctors was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Doctors with id=" + id,
      });
    });
};

// By Added 07-10-2020
// fetch doctors list

exports.DoctorProfiler = (req, res) => {
  var id = req.params.id;
  // Users.hasOne(Doctor, { foreignKey: "user_id" });
  // Doctor.belongsTo(Users, { foreignKey: "user_id" });
  //include:[Users],attributes:["id","speciality","education","fees","experience","profile_pic","signature_pic"]

  Doctor.hasMany(Doctoreducation, { foreignKey: "doctor_user_tbl_id" });
  Doctoreducation.belongsTo(Doctor, { foreignKey: "doctor_user_tbl_id" });
  Users.hasOne(Doctor, { foreignKey: "user_id" });
  Doctor.belongsTo(Users, { foreignKey: "user_id" });
  Doctor.findAll({
    where: { id: id },
    include: [{ model: Doctoreducation }],
    include: [{ model: Users, attributes: ["name"] }],
  }) //, attributes: ['doctor_user_tbl_id']
    .then((data) => {
      if (data.length > 0) {
        var doctordetails = data;
      } else {
        var doctordetails = "Not valid this id doctor!, Please check it.";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor was fetched successfully.",
        data: doctordetails,
      });
      //res.send({ "message": "Doctor was fetched successfully.", data});
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Doctor List.",
      });
    });
};

exports.DoctorIsavailablecheck = (req, res) => {

  const id = req.params.id;
  Doctor.findAll({
    where: {
      id: id,
    },
    attributes: ["is_available"],
  })
    .then((data) => {
      //res.send(data);
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor was fetched successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Doctor with id=" + id,
      });
    });
};

exports.IsDoctoravailable = (req, res) => {
  const id = req.params.id;
  const is_available = req.body.is_available;
  var user_type = "Admin";
  var data = { is_available: is_available };
  Doctor.update(data, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        //     const auditTrailVal = {
        //         'user_id' : req.params.id,
        //         'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Countries Modules',
        //         'trail_message' : req.body.shortname+ ' '+ req.body.name + ' is Countries Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //         'status': 1
        //       }
        //   AuditTrail.create(auditTrailVal,(err, data)=>{ });
        // res.send({
        //   message: "Doctor was updated successfully."

        // });
        res.status(200).send({
          status: 200,
          error: false,
          message: "Doctor was updated successfully.",
          // data: data,
        });
      } else {
        res.send({
          message: `Cannot update Doctor with id=${id}. Maybe Doctor was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Doctor with id=" + id,
      });
    });
};

// based on admin all doctors filters apis

exports.getAllDoctoravailablefilter = (req, res) => {
  var clinicId = req.params.clinicId;
  const genderarr = [];
  const specalitiesarr = [];
  const experience = [];
if(req.body.gender){
     req.body.gender.forEach((userVal, index) => {
    genderarr.push(encryption.encryptData(userVal));
     });
    }

    if(req.body.specalities){
     req.body.specalities.forEach((userVal, index) => {
      specalitiesarr.push(encryption.encryptData(userVal));
       });
      }
      
  
      if(req.body.experience){
    req.body.experience.forEach((expval, index) => {
      experience.push(expval);
       });
      

  var exparr =[];
for(var j = 0; j < req.body.experience.length; j++)
  {
    var count = 1; 
    //exparr.push(req.body.experience[j][0]);
    var dd =  req.body.experience[j].split("-");
  for(var i = 0; i < dd.length; i++)
       {
     if(dd[i] != '-')
          {
            exparr.push(Number(dd[i]));
          }
          count++;
        }
  }
  
var finalexparr = exparr;
 finalexparr.sort(function(a,b){
   return a-b;
 }) 
 var f = finalexparr[0];  
 var l = finalexparr[finalexparr.length-1]; 
}

 Users.hasOne(Doctor, { foreignKey: "user_id" });
 Doctor.belongsTo(Users, { foreignKey: "user_id" });

 
 if(genderarr != ''  && specalitiesarr != '')
 {
  var options = { gender : { [Op.in]: genderarr },   speciality_name : { [Op.in]: specalitiesarr }} 
 }
 else if(genderarr != ''  && specalitiesarr == '')
 {  
  var options = { gender : { [Op.in]: genderarr }}  
 }    
 else if(genderarr == ''  && specalitiesarr != '')
 {  
  var options = { speciality_name : { [Op.in]: specalitiesarr }} 
 }    
 else
 {
  var options = { } 
 } 

 var sortting = req.body.sortting; 
  if(sortting =="low to high")
  {
  
    var oppp = { where:options,  include: [{ model: Users, attributes: ["name"] }
  ], order: [['fees', 'ASC']] }

  } 
  else if(sortting == "high to low")
  {
    var oppp ={ where:options,  include: [{ model: Users, attributes: ["name"] }], order: [['fees', 'DESC']] }
  }  

  else if(sortting == "experience")
  {
    var oppp ={ where:options,  include: [{ model: Users, attributes: ["name"] }], order: [['experience', 'DESC']] }
  }

  else
  { 
    oppp ={ where:options,  include: [{ model: Users, attributes: ["name"] }], } 
  }    
  
  Doctor.findAll(oppp)     //{ where: options}
  .then(function(data) {
    var finaldata =  [];
    if(req.body.languages != '' || req.body.experience != '')
    {

    for(var i= 0; i < data.length; i++ )
    {
      if(req.body.languages != '' && req.body.experience != '')
      {
        if(arrayMatch(req.body.languages, [data[i].languageids]).length > 0 &&   Number(data[i].experience) >= Number(f))
       {
       
        if(Number(data[i].experience) <= Number(l))  
        {
          finaldata.push( data[i]);
        }
      }
     }
     else if(req.body.languages == '' && req.body.experience != '')
     {
      if(Number(data[i].experience) >= Number(f))
      {
       if(Number(data[i].experience) <= Number(l))  
       {
         finaldata.push( data[i]);
       }
     }
     }
     else{
      if(arrayMatch(req.body.languages, [data[i].languageids]).length > 0)
      {
        finaldata.push( data[i]);
      }
     }
    }
    }
    else
     {
       finaldata = data;
     }
    // Clinic.findOne({
    //    where: {
    //      id: clinicId,
    //    },
    //    attributes: ["id","clinic_name","clinic_logo"]
    //  }).then(function(clinicidata){       
    //   var fdarr=[];
    //   var fdobj={};
    //   if(clinicidata)
    //   {
    //     fdobj.clinic_tbl = clinicidata;
    //   }
    //   else{  fdobj.clinic_tbl = {};}
     
    //   fdobj.data = finaldata;
      
      //fdarr.push(fdobj);
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor Details Fetched Sucessfully..",
        data: finaldata,
       // data: fdarr,
      });

    // })
  
   })
};



// based on clinic doctors filter apis

// exports.DoctorIsavailablefilter = (req, res) => {
//   var clinicId = req.params.clinicId;
//   const genderarr = [];
//   const specalitiesarr = [];
//   const experience = [];
// if(req.body.gender){
//      req.body.gender.forEach((userVal, index) => {
//     genderarr.push(encryption.encryptData(userVal));
//      });
//     }

//     if(req.body.specalities){
//      req.body.specalities.forEach((userVal, index) => {
//       specalitiesarr.push(encryption.encryptData(userVal));
//        });
//       }
      
  
//       if(req.body.experience){
//     req.body.experience.forEach((expval, index) => {
//       experience.push(expval);
//        });
      

//   var exparr =[];
// for(var j = 0; j < req.body.experience.length; j++)
//   {
//     var count = 1; 
//     //exparr.push(req.body.experience[j][0]);
//     var dd =  req.body.experience[j].split("-");
//   for(var i = 0; i < dd.length; i++)
//        {
//      if(dd[i] != '-')
//           {
//             exparr.push(Number(dd[i]));
//           }
//           count++;
//         }
//   }
  
// var finalexparr = exparr;
//  finalexparr.sort(function(a,b){
//    return a-b;
//  }) 
//  var f = finalexparr[0];  
//  var l = finalexparr[finalexparr.length-1]; 
// }

//  Users.hasOne(Doctor, { foreignKey: "user_id" });
//  Doctor.belongsTo(Users, { foreignKey: "user_id" });
//  Clinic.hasOne(Doctor, { foreignKey: "clinic_id" });
//  Doctor.belongsTo(Clinic, { foreignKey: "clinic_id" });
 
//  if(genderarr != ''  && specalitiesarr != '')
//  {
//   var options = { clinic_id:clinicId, gender : { [Op.in]: genderarr },   speciality_name : { [Op.in]: specalitiesarr }} 
//  }
//  else if(genderarr != ''  && specalitiesarr == '')
//  {  
//   var options = { clinic_id:clinicId, gender : { [Op.in]: genderarr }}  
//  }    
//  else if(genderarr == ''  && specalitiesarr != '')
//  {  
//   var options = { clinic_id:clinicId, speciality_name : { [Op.in]: specalitiesarr }} 
//  }    
//  else
//  {
//   var options = { } 
//  } 

//  var sortting = req.body.sortting; 
//   if(sortting =="low to high")
//   {
  
//     var oppp = { where:options,  include: [{ model: Users, attributes: ["name"] },   { model: Clinic, where:{ id : clinicId}, attributes: ["id","clinic_name","clinic_logo"] }
//   ], order: [['fees', 'ASC']] }

//   } 
//   else if(sortting == "high to low")
//   {
//     var oppp ={ where:options,  include: [{ model: Users, attributes: ["name"] }, { model: Clinic, where:{ id : clinicId}, attributes: ["id","clinic_name","clinic_logo"] }], order: [['fees', 'DESC']] }
//   }  

//   else if(sortting == "experience")
//   {
//     var oppp ={ where:options,  include: [{ model: Users, attributes: ["name"] }, { model: Clinic, where:{ id : clinicId}, attributes: ["id", "clinic_name", "clinic_logo"] }], order: [['experience', 'DESC']] }
//   }

//   else
//   { 
//     oppp ={ where:options,  include: [{ model: Users, attributes: ["name"] }, { model: Clinic, where:{ id : clinicId}, attributes: ["id", "clinic_name", "clinic_logo"] }], } 
//   }    
  
//   Doctor.findAll(oppp)     //{ where: options}
//   .then(function(data) {
//     var finaldata =  [];
//     if(req.body.languages != '' || req.body.experience != '')
//     {

//     for(var i= 0; i < data.length; i++ )
//     {
//       if(req.body.languages != '' && req.body.experience != '')
//       {
//         if(arrayMatch(req.body.languages, [data[i].languageids]).length > 0 &&   Number(data[i].experience) >= Number(f))
//        {
       
//         if(Number(data[i].experience) <= Number(l))  
//         {
//           finaldata.push( data[i]);
//         }
//       }
//      }
//      else if(req.body.languages == '' && req.body.experience != '')
//      {
//       if(Number(data[i].experience) >= Number(f))
//       {
//        if(Number(data[i].experience) <= Number(l))  
//        {
//          finaldata.push( data[i]);
//        }
//      }
//      }
//      else{
//       if(arrayMatch(req.body.languages, [data[i].languageids]).length > 0)
//       {
//         finaldata.push( data[i]);
//       }
//      }
//     }
//     }
//     else
//      {
//        finaldata = data;
//      }
//     // Clinic.findOne({
//     //    where: {
//     //      id: clinicId,
//     //    },
//     //    attributes: ["id","clinic_name","clinic_logo"]
//     //  }).then(function(clinicidata){       
//     //   var fdarr=[];
//     //   var fdobj={};
//     //   if(clinicidata)
//     //   {
//     //     fdobj.clinic_tbl = clinicidata;
//     //   }
//     //   else{  fdobj.clinic_tbl = {};}
     
//     //   fdobj.data = finaldata;
      
//       //fdarr.push(fdobj);
//       res.status(200).send({
//         status: 200,
//         error: false,
//         message: "Doctor Details Fetched Sucessfully..",
//         data: finaldata,
//        // data: fdarr,
//       });

//     // })
  
//    })
// };


// new filter api 

exports.DoctorIsavailablefilter = (req, res) => {
  var clinicId = req.body.clinicId;
  var docSearchName = req.body.search_name;

  const genderarr = [];
  const specalitiesarr = [];
  const experience = [];
  const ratingArr = [];

  if (req.body.gender) {
    req.body.gender.forEach((userVal, index) => {
      genderarr.push(encryption.encryptData(userVal));
    });
  }

  if (req.body.rating) {
    req.body.rating.forEach((userVal, index) => {
      ratingArr.push(userVal);
    });
  }

  if (req.body.specalities) {
    req.body.specalities.forEach((userVal, index) => {
      specalitiesarr.push(userVal);
    });
  }

  if (req.body.experience) {
    req.body.experience.forEach((expval, index) => {
      experience.push(expval);
    });

    var exparr = [];
    for (var j = 0; j < req.body.experience.length; j++) {
      var count = 1;
      //exparr.push(req.body.experience[j][0]);
      var dd = req.body.experience[j].split("-");
      for (var i = 0; i < dd.length; i++) {
        if (dd[i] != "-") {
          exparr.push(Number(dd[i]));
        }
        count++;
      }
    }

    var finalexparr = exparr;
    finalexparr.sort(function (a, b) {
      return a - b;
    });
    var f = finalexparr[0];
    var l = finalexparr[finalexparr.length - 1];
  }

  Users.hasOne(Doctor, { foreignKey: "user_id" });
  Doctor.belongsTo(Users, { foreignKey: "user_id" });
  Clinic.hasOne(Doctor, { foreignKey: "clinic_id" });
  Doctor.belongsTo(Clinic, { foreignKey: "clinic_id" });

  // if (genderarr != "" && specalitiesarr != "") {
  //   var options = {
  //     clinic_id: clinicId,
  //     gender: { [Op.in]: genderarr },
  //     speciality_name: { [Op.in]: specalitiesarr },
  //   };
  // } else if (genderarr != "" && specalitiesarr == "") {
  //   var options = { clinic_id: clinicId, gender: { [Op.in]: genderarr } };
  // } else if (genderarr == "" && specalitiesarr != "") {
  //   var options = {
  //     clinic_id: clinicId,
  //     speciality_name: { [Op.in]: specalitiesarr },
  //   };
  // } else {
  //   var options = {};
  // }

 // console.log("------", specalitiesarr);

  if (docSearchName != "" && docSearchName != undefined) {
    if (clinicId != undefined && clinicId != "") {
      var options = {
        doctor_name: { [Op.like]: "%" + docSearchName + "%" },
        clinic_id: clinicId,
      };
    } else {
      var options = { doctor_name: { [Op.like]: "%" + docSearchName + "%" } };
    }
  } else {
    if(genderarr != ''  && ratingArr!= "")
    {
     if(clinicId != undefined && clinicId != ""){

    // var options = { clinic_id:clinicId, gender : { [Op.in]: genderarr },   speciality_id : { [Op.in]: specalitiesarr }, rating : { [Op.in]: ratingArr }} 
    var options = { clinic_id:clinicId, gender : { [Op.in]: genderarr }, rating : { [Op.in]: ratingArr }} 
      
    }else{

      var options = { gender : { [Op.in]: genderarr },    rating : { [Op.in]: ratingArr }} 
     }
    }
    else if(genderarr != ''  && ratingArr == "")
    {  
      if(clinicId != undefined && clinicId != ""){
     var options = { clinic_id:clinicId, gender : { [Op.in]: genderarr }}  
      }else{
        var options = { gender : { [Op.in]: genderarr }}  
      }
    }    
    else if(genderarr == ''  && ratingArr == "")
    {  
      if(clinicId != undefined && clinicId != ""){
     var options = { clinic_id:clinicId} 
      }
      else{
      var options = { }  //speciality_id : { [Op.in]: specalitiesarr }
      }
    }
    else if(genderarr == ''    && ratingArr != "")
    {  
      if(clinicId != undefined && clinicId != ""){
     var options = { clinic_id:clinicId, rating : { [Op.in]: ratingArr }} 
      }else{
        var options = { rating : { [Op.in]: ratingArr }} 
      }
    }
    else if(genderarr != ''   && ratingArr != "")
    {  
      if(clinicId != undefined && clinicId != ""){
        var options = { clinic_id: clinicId, rating : { [Op.in]: ratingArr },gender : { [Op.in]: genderarr }  } 
      }else{
        var options = { rating : { [Op.in]: ratingArr },gender : { [Op.in]: genderarr }  } 
      }
    }
  }

  if (clinicId != undefined && clinicId != "") {
    var clhoptions = { where: { id: clinicId } };
    var chloptions = { where: { id: clinicId } };
    var ceoptions = { where: { id: clinicId } };
    var celse = { where: { id: clinicId } };
  } else {
    var clhoptions = {};
    var chloptions = {};
    var ceoptions = {};
    var celse = {};
  }

  var sortting = req.body.sortting;
  if (sortting == "low to high") {
    var oppp = {
      where: options,
      include: [
        { model: Users, attributes: ["name"] },
        {
          model: Clinic,
          clhoptions,
          attributes: ["id", "clinic_name", "clinic_logo","latitude", "longitude"],
        },
      ],
      order: [["fees", "ASC"]],
    };
  } 
  else if (sortting == "high to low") {
    var oppp = {
      where: options,
      include: [
        { model: Users, attributes: ["name"] },
        {
          model: Clinic,
          chloptions,
          attributes: ["id", "clinic_name", "clinic_logo","latitude", "longitude"],
        },
      ],
      order: [["fees", "DESC"]],
    };
  } 
  else if (sortting == "experience") {
    var oppp = {
      where: options,
      include: [
        { model: Users, attributes: ["name"] },
        {
          model: Clinic,
          ceoptions,
          attributes: ["id", "clinic_name", "clinic_logo","latitude", "longitude"],
        },
      ],
      order: [["experience", "DESC"]],
    };
  } 
  else {
    oppp = {
      where: options,
      include: [
        { model: Users, attributes: ["name"] },
        {
          model: Clinic,
          celse,
          attributes: ["id", "clinic_name", "clinic_logo","latitude", "longitude"],
        },
      ],
    };
  }

  // console.log(oppp);
  // console.log("oppp Ends");
  // return;

  Doctor.findAll(oppp) //{ where: options}
    .then(function (data) {
      var finaldata = [];
      if (req.body.languages != "" || req.body.experience != "" || req.body.specalities != "") {
        for (var i = 0; i < data.length; i++) {

          if (req.body.languages != "" && req.body.experience != "" && req.body.specalities != "") {
            if (arrayMatch(req.body.languages, [data[i].languageids]).length > 0 && arrayMatch(req.body.specalities, [data[i].speciality_id]).length > 0 &&  Number(data[i].experience) >= Number(f)) 
            {
              if (Number(data[i].experience) <= Number(l)) {
                finaldata.push(data[i]);
              }
            }
          } 
    else if (req.body.languages == "" && req.body.experience != "" && req.body.specalities != "") {

            if (arrayMatch(req.body.specalities, [data[i].speciality_id]).length > 0 &&  Number(data[i].experience) >= Number(f)) 
           {            
            if (Number(data[i].experience) <= Number(l)) {
              finaldata.push(data[i]);
            }
             
           }
         } 
         else if (req.body.languages != "" && req.body.experience == "" && req.body.specalities != "") {

          if (arrayMatch(req.body.languages, [data[i].languageids]).length > 0 && arrayMatch(req.body.specalities, [data[i].speciality_id]).length > 0) 
         {     
         
            finaldata.push(data[i]);
          
           
         }
       }            
     else if (req.body.languages == "" && req.body.experience == "" && req.body.specalities != "") {

             if (arrayMatch(req.body.specalities, [data[i].speciality_id]).length > 0) 
            {            
                finaldata.push(data[i]);
              
            }
          }    

          else if (req.body.languages == "" && req.body.specalities == "" && req.body.experience != "" ) {
            if (Number(data[i].experience) >= Number(f)) {
              if (Number(data[i].experience) <= Number(l)) {
                finaldata.push(data[i]);
              }
            }
          } 


          else {
            if (arrayMatch(req.body.languages, [data[i].languageids]).length > 0 ) 
            {
              finaldata.push(data[i]);
            }
          }
        }
      } else {
        finaldata = data;
      }

      // Clinic.findOne({
      //    where: {
      //      id: clinicId,
      //    },
      //    attributes: ["id","clinic_name","clinic_logo"]
      //  }).then(function(clinicidata){
      //   var fdarr=[];
      //   var fdobj={};
      //   if(clinicidata)
      //   {
      //     fdobj.clinic_tbl = clinicidata;
      //   }
      //   else{  fdobj.clinic_tbl = {};}

      //   fdobj.data = finaldata;

      //fdarr.push(fdobj);
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor Details Fetched Sucessfully..",
        data: finaldata,
        // data: fdarr,
      });
      // })
    });
};


function arrayMatch(arr1, arr2) {
  var arr = [];
  if (arr1 && arr2) {
    arr1 = arr1.toString().split(",").map(Number);
    arr2 = arr2.toString().split(",").map(Number);
    // for array1
    for (var i in arr1) {
      if (arr2.indexOf(arr1[i]) !== -1) arr.push(arr1[i]);
    }
    return arr.sort((x, y) => x - y);
  }
}

exports.clinicidfindAll = (req, res) => {

  var clinicId = req.params.clinicId;

  Users.hasOne(Doctor, { foreignKey: "user_id" });
  Doctor.belongsTo(Users, { foreignKey: "user_id" });
  Clinic.hasOne(Doctor, { foreignKey: "clinic_id" });
  Doctor.belongsTo(Clinic, { foreignKey: "clinic_id" });

  Doctor.findAll({where:{ clinic_id: clinicId},
    include: [
      { model: Users, attributes: ["id","name","email","mobile_number",], order: [["name", "desc"]] },
      { model: Clinic, where:{ id : clinicId}, attributes: ["id", "clinic_name", "clinic_logo"] },
 
    ],
    order: [[{ model: Users }, "name", "ASC"]],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    //attributes:["id","speciality","education","fees","experience","profile_pic","signature_pic","practice","languages","area_of_expertise","registraion_no"],
  })
    .then((data) => {
      
      //res.send({ message: "Doctor was fetched successfully.", data });
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor was fetched successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Doctor List.",
      });
    });
};