const Sequelize = require('sequelize'); 
const db = require("../models");

const Doctors = db.doctor_registration;
const User = db.users_tbl;
const Op = Sequelize.Op;
var encryption = require('../helpers/Encryption');

exports.create = (request,response)=>{
    
    if (!request.body) {
        response.status(400).send({"message":"Content cannot be empty"})
    // } else if (!request.body.Clinics) {
    //     response.status(400).send({"message":"Clinics Type cannot be empty"})
    // } 
    }else {
      //  console.log(request.body);
        const usersVals={
            "name":encryption.encryptData(request.body.doctor_name),
            "username":encryption.encryptData(request.body.username),
            "password":encryption.encryptData(request.body.password),
            "email":encryption.encryptData(request.body.email),
            //"clinic_id":encryption.encryptData(request.body.c_id),
            "user_type":encryption.encryptData("doctor"),
            "mobile_number":encryption.encryptData(request.body.mobile_no1),
            "sent_otp":encryption.encryptData(""), 
            "is_verified":"0",
            "default_language":encryption.encryptData("UK"),
            "selected_language":encryption.encryptData("EN"),
            "country":encryption.encryptData("IN"),
            "status":0

        };
        
        console.log(usersVals);
      //  User.create(usersVals).then((data) => {
            User.create(usersVals).then((data)=>{ 

            const doctor_id=data.id;
            console.log(doctor_id);
            const doctorValues = {
                "c_id":request.body.c_id ,
                "doctor_id":doctor_id ,
                "is_independent":request.body.is_independent ,
                "user_subadmin_id":request.body.user_subadmin_id ,
                "clinic_id":request.body.clinic_id ,
                "doctor_name":encryption.encryptData(request.body.doctor_name),
                "gender":encryption.encryptData(request.body.gender),
                "specialization":request.body.specialization ,
                "username":encryption.encryptData(request.body.username),
                "password":encryption.encryptData(request.body.password),
                "mobile_no1":encryption.encryptData(request.body.mobile_no1) ,
                "mobile_no2":encryption.encryptData(request.body.mobile_no2 ),
                "mobile_no3":encryption.encryptData(request.body.mobile_no3) ,
                "mobile_no4":encryption.encryptData(request.body.mobile_no4 ),
                "mobile_no5":encryption.encryptData(request.body.mobile_no5 ),
                "email1":encryption.encryptData(request.body.email1) ,
                "email2":encryption.encryptData(request.body.email2 ),
                "email3":encryption.encryptData(request.body.email3 ),
                "email4":encryption.encryptData(request.body.email4 ),
                "email5":encryption.encryptData(request.body.email5 ),
                "doctor_assistant_name":encryption.encryptData(request.body.doctor_assistant_name) ,
                "doctor_assistant_mobile_no":encryption.encryptData(request.body.doctor_assistant_mobile_no) ,
                "email":encryption.encryptData(request.body.email ),
                "date_of_birth":encryption.encryptData(request.body.date_of_birth ),
                "address":encryption.encryptData(request.body.address) ,
                "city":encryption.encryptData(request.body.city) ,
                "pincode":encryption.encryptData(request.body.pincode) ,
                "doctor_image":request.body.doctor_image ,
                "doctor_digital_signature":request.body.doctor_digital_signature ,
                "status":request.body.status ,
                "doctor_registration_no":encryption.encryptData(request.body.doctor_registration_no) ,
                "doctor_registration_year":encryption.encryptData(request.body.doctor_registration_year) ,
                "doctor_council_details":request.body.doctor_council_details ,
                "timings":request.body.timings ,
                "type_of_doctor":request.body.type_of_doctor ,
                "doctor_qualifications":request.body.doctor_qualifications ,
                "doctor_university":request.body.doctor_university ,
                "year_of_pass":request.body.year_of_pass ,
                "adhaar_no":encryption.encryptData(request.body.adhaar_no) ,
                "role_type":request.body.role_type ,
                "premium_status":request.body.premium_status ,
                "is_premium_diagnosis":request.body.is_premium_diagnosis ,
                "is_premium_videocall":request.body.is_premium_videocall ,
                "practice_since":request.body.practice_since ,
                "languages":request.body.languages ,
                "rating":request.body.rating ,
                "doctor_consultation_fees":request.body.doctor_consultation_fees ,
                "country_id":request.body.country_id ,
                "city_id":request.body.city_id ,
                "state_id":request.body.state_id ,
                "mode":request.body.mode ,
                "experience":request.body.experience ,
                "otp":request.body.otp ,
                "otp_status":request.body.otp_status ,
                "is_avilable":request.body.is_avilable ,
                "on_off_line_status":request.body.on_off_line_status ,
                "is_consultation":request.body.is_consultation,
                "is_approved":request.body.is_approved,
                "currency_type":request.body.currency_type,
                "push_notification_status":request.body.push_notification_status, 
                "profile_status":request.body.profile_status,
                "is_login":request.body.is_login
    
                
                
            }
            Doctors.create(doctorValues).then((data) => {
                response.status(200).send({
                    message: `Doctor Created Successfully`
                  });

            })
            


        })
		
    }
};

// Retrieve all Doctors from the Doctors list.
exports.findAll = (req, res) => {
    Doctors.findAll({})
      .then((data) => {
        res.status(200).send({
          data: data,
          message: "Doctors records found",
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Doctors.",
        });
      });
  };

// Find a single Doctors with an Name
exports.findOne = (req, res) => {
    const name = req.params.id;  
   // console.log(req.body);
  // console.log(req);
    Doctors.findAll({ 
        where: {
            doctor_name: {
              [Op.like]: '%'+name+'%',
            }
          }
    })
      .then((data) => {
        res.send({
            message: "Doctors records found",
            data: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Doctors.",
        });
      });
};

// Update a Doctors by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    
    if(req.body.data) {
        req.body = req.body.data;
    }
    
    Doctors.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Doctors was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Doctors with id=${id}. Maybe Doctors was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Audit Trail with id=" + id
        });
    });
};

// Delete a Doctors with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    
    Doctors.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Doctors was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Doctors with id=${id}. Maybe Doctors was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Doctors with id=" + id
        });
    });
};

// Delete all Doctors from the database.
exports.deleteAll = (req, res) => {
    Doctors.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Doctors were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all Doctors."
        });
    });
};