var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const doctor_registration_tbl = sequelize.define(
        "doctor_registration",
        {
            c_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            doctor_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            is_independent	: {
                allowNull: true,
                type: Sequelize.BOOLEAN, 
            },
            user_subadmin_id	: {
                allowNull: true,
                type: Sequelize.STRING, 
            }, 
            clinic_id	: {
                allowNull: true, 
                type: Sequelize.INTEGER, 
            },
            doctor_name	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            gender	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            specialization	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            username	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            password	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            mobile_no1	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            mobile_no2	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            mobile_no3	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            mobile_no4	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            mobile_no5	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            email1	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            email2	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            email3	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            email4	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            email5	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_assistant_name	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_assistant_mobile_no	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            email	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            date_of_birth	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            address	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            city	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            pincode	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            doctor_image	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_digital_signature	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            status	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_registration_no	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_registration_year	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_council_details	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            timings	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            type_of_doctor	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_qualifications	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_university	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            year_of_pass	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            adhaar_no	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            role_type	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            premium_status	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            is_premium_diagnosis	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            is_premium_videocall	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            practice_since	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            languages	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            rating	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            doctor_consultation_fees	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            country_id	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            city_id	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            state_id	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            mode	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            experience	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            date_of_practice_start	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            country_id	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            otp	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            country_id	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            otp_status	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            is_avilable	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            on_off_line_status	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            is_consultation	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            is_approved	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            currency_type	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            push_notification_status	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            profile_status	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
            is_login	: {
                allowNull: true,
                type: Sequelize.STRING, 
            },
        },
        {
            getterMethods: {
                doctor_name: function () { return encryption.decryptData(this.getDataValue("doctor_name")); },
                gender: function () { return encryption.decryptData(this.getDataValue("gender")); },
                username: function () { return encryption.decryptData(this.getDataValue("username")); },
                password: function () { return encryption.decryptData(this.getDataValue("password")); },
                mobile_no1: function () { return encryption.decryptData(this.getDataValue("mobile_no1")); },
                mobile_no2: function () { return encryption.decryptData(this.getDataValue("mobile_no2")); },
                mobile_no3: function () { return encryption.decryptData(this.getDataValue("mobile_no3")); },
                mobile_no4: function () { return encryption.decryptData(this.getDataValue("mobile_no4")); },
                mobile_no5: function () { return encryption.decryptData(this.getDataValue("mobile_no5"));},
                email1: function () { return encryption.decryptData(this.getDataValue("email1"));},
                email2: function () { return encryption.decryptData(this.getDataValue("email2"));},
                email3: function () { return encryption.decryptData(this.getDataValue("email3"));},
                email4: function () { return encryption.decryptData(this.getDataValue("email4"));},
                email5: function () { return encryption.decryptData(this.getDataValue("email5"));},
                doctor_assistant_name: function () { return encryption.decryptData(this.getDataValue("doctor_assistant_name"));},
                doctor_assistant_mobile_no: function () { return encryption.decryptData(this.getDataValue("doctor_assistant_mobile_no"));},
                email: function () { return encryption.decryptData(this.getDataValue("email"));},
                date_of_birth: function () { return encryption.decryptData(this.getDataValue("date_of_birth"));},
                address: function () { return encryption.decryptData(this.getDataValue("address"));},
                city: function () { return encryption.decryptData(this.getDataValue("city"));},
                pincode: function () { return encryption.decryptData(this.getDataValue("pincode"));},
                docotor_registration_no: function () { return encryption.decryptData(this.getDataValue("docotor_registration_no"));},
                doctor_registration_year: function () { return encryption.decryptData(this.getDataValue("doctor_registration_year"));},
                adhaar_no: function () { return encryption.decryptData(this.getDataValue("adhaar_no"));},


            },
            setterMethods: {
                doctor_name: function (value) { this.setDataValue("doctor_name", encryption.encryptData(value)); },
                gender: function (value) { this.setDataValue("gender", encryption.encryptData(value)); },
                username: function (value) { this.setDataValue("username", encryption.encryptData(value)); },
                password: function (value) { this.setDataValue("password", encryption.encryptData(value)); },
                mobile_no1: function (value) { this.setDataValue("mobile_no1", encryption.encryptData(value)); },
                mobile_no2: function (value) { this.setDataValue("mobile_no2", encryption.encryptData(value)); },
                mobile_no3: function (value) { this.setDataValue("mobile_no3", encryption.encryptData(value)); },
                mobile_no4: function (value) { this.setDataValue("mobile_no4", encryption.encryptData(value)); },
                mobile_no5: function (value) { this.setDataValue("mobile_no5", encryption.encryptData(value)); },
                email1: function (value) { this.setDataValue("email1", encryption.encryptData(value)); },
                email2: function (value) { this.setDataValue("email2", encryption.encryptData(value)); },
                email3: function (value) { this.setDataValue("email3", encryption.encryptData(value)); },
                email4: function (value) { this.setDataValue("email4", encryption.encryptData(value)); },
                email5: function (value) { this.setDataValue("email5", encryption.encryptData(value)); },
                doctor_assistant_name: function (value) { this.setDataValue("doctor_assistant_name", encryption.encryptData(value)); },
                doctor_assistant_mobile_no: function (value) { this.setDataValue("doctor_assistant_mobile_no", encryption.encryptData(value)); },
                email: function (value) { this.setDataValue("email", encryption.encryptData(value)); },
                date_of_birth: function (value) { this.setDataValue("date_of_birth", encryption.encryptData(value)); },
                address: function (value) { this.setDataValue("address", encryption.encryptData(value)); },
                city: function (value) { this.setDataValue("city", encryption.encryptData(value)); },
                pincode: function (value) { this.setDataValue("pincode", encryption.encryptData(value)); },
                docotor_registration_no: function (value) { this.setDataValue("docotor_registration_no", encryption.encryptData(value)); },
                doctor_registration_year: function (value) { this.setDataValue("doctor_registration_year", encryption.encryptData(value)); },
                adhaar_no: function (value) { this.setDataValue("adhaar_no", encryption.encryptData(value)); },


            },
          }
       
        
    );
    
    return doctor_registration_tbl;
};
