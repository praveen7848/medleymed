 Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require('moment');
const generateSlots = require('../helpers/Slots');
const db = require("../models");
const SCHEDULE = db.telemedicine_schedule_tbl;
const SLOTS = db.telemedicine_schedule_child_tbl;
const Appointments = db.patient_appointment_tbl;
const Doctor = db.doctor_tbl;


// Fetch Created Slots Doctor's List
exports.getDoctorsSlotListDetails = (req,res) => {
   
     Doctor.hasMany(SCHEDULE, { foreignKey: "doctor_id" });
     SCHEDULE.belongsTo(Doctor, { foreignKey: "doctor_id" });

     Doctor
       .findAll({
        attributes: ['id','doctor_name'],
        group: ['doctor_appointment_schedule_tbls.doctor_id'],
         include: [
            {
              model: SCHEDULE,
              required: true,
              attributes: ['id','doctor_id','from_date','to_date'],
            },
          ],
       })
       .then((resData) => {
           res.send({
               status: 200,
               error: false,
               message: "Doctor Details fetched Sucessfully..",
               data : resData
           });
       });
   };
// Ends here


// Create a Problem Name
exports.create = (req, res) => {

    if (!req.body) {
        res.status(400).send({ "message": "Content cannot be empty" })
    }
    else if (!req.body.fromDate) {
        res.status(400).send({ "message": "From Date cannot be empty" })
    }
    else if (!req.body.toDate) {
        res.status(400).send({ "message": "To date cannot be empty" })
    }
    else if (!req.body.module_type) {
        res.status(400).send({ "message": "Module type cannot be empty" })
    } else {


        const module_type = req.body.module_type;
        const doctorId = req.body.doctorId;
        const todayDate = moment().format("YYYY-MM-DD");

       

        const todayDateTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');


        // const slotFromtime = generateSlots.convert24To12Hours("15:30:00");
        // console.log(slotFromtime+" slotFromtime");
        // const slotTotime = generateSlots.convert12To24Hours("01:30 AM");
        // console.log(slotTotime+" slotTotime");
        // return;



        // const generatedSlotsArray = generateSlots.slotTimings("04:00 PM", "05:00 PM", "15");
        // console.log(generatedSlotsArray);
        // return;


        // SCHEDULE.count({
        //     where: {
        //         'doctor_id': doctorId,
        //         'module_type': module_type,
        //     },
        // }).then(count => {
        //     if (count > 0) {
        //         SCHEDULE.destroy({
        //             where: {
        //                 'doctor_id': doctorId,
        //                 'module_type': module_type,
        //             },
        //             truncate: false,
        //         })
        //     }
        // });

        // SLOTS.count({
        //     where: {
        //         'doctor_id': doctorId,
        //         'module_type': module_type,
        //     },
        // }).then(count => {
        //     if (count > 0) {
        //         SLOTS.destroy({
        //             where: {
        //                 'doctor_id': doctorId,
        //                 'module_type': module_type,
        //             },
        //             truncate: false,
        //         })
        //     }
        // });


        // console.log(todayDate+" todayDate "); 
        // return;

        // SCHEDULE.count({
        //     where: {
        //         from_date: {
        //             [Op.lte]: todayDate,
        //         },
        //         'module_type': module_type,
        //     },
        // }).then(count => {
        //     if (count > 0) {
        //         SCHEDULE.destroy({
        //             where: {
        //                 from_date: {
        //                     [Op.lte]: todayDate,
        //                 },
        //                 'module_type': module_type,
        //             },
        //             truncate: false,
        //         })
        //     }
        // });


        // SLOTS.count({
        //     where: {
        //         from_date: {
        //             [Op.lte]: todayDate,
        //         },
        //         'module_type': module_type,
        //     },
        // }).then(count => {
        //     if (count > 0) {
        //         SLOTS.destroy({
        //             where: {
        //                 from_date: {
        //                     [Op.lte]: todayDate,
        //                 },
        //                 'module_type': module_type,
        //             },
        //             truncate: false,
        //         })
        //     }
        // });

        const fromDate = req.body.fromDate;
        const toDate = req.body.toDate;

        // const responnse = checkIsScheduleDuplicates(fromDate, toDate, doctorId, module_type);
        // console.log(" responnse " + responnse);

        const consultationDuration = req.body.consultationDuration + ":00";
        const timezone_offset = req.body.timezone_offset;
        const eachTimeslotHours = req.body.eachTimeslotHours;
        const eachTimeslotMinutes = req.body.eachTimeslotMinutes;
        const breakTime = req.body.breakTime + ":00";;
        const notificationTime = req.body.notificationTime;
        const splitDuration = consultationDuration.split(":");
        const slotInterval = splitDuration[1];
        const intervalDuration = slotInterval + ' mins';
        const splitBreakTime = breakTime.split(":");
        const breakInterval = splitBreakTime[1];

        const splitFromdate = fromDate.split("-");
        const splitTodate = toDate.split("-");

        var startDate = moment(fromDate, "YYYY-MM-DD");
        var endDate = moment(toDate, "YYYY-MM-DD");

        const daysDifference = endDate.diff(startDate, 'days');
        const reqBody = req.body;

        if (daysDifference >= 7 && daysDifference <= 92) {

            const betweenDates = generateSlots.generateDaysBetweenDates(fromDate, toDate);

            SCHEDULE.count({
                where: {
                   // 'from_date': fromDate,
                   // 'to_date': toDate,
                    'doctor_id': doctorId,
                    'status': 'Active',
                    'module_type': module_type,
                },
            }).then(count => {
                if (count > 0) {

                    res.status(200).send({
                        status: 204,
                        message: "Slots already exists for Doctor,Please delete and create new slots",
                    });

                } else {

                    if (fromDate >= todayDate) {

                        commonCreateSlotsMethod(reqBody, module_type, doctorId, todayDate, fromDate, toDate, consultationDuration, timezone_offset, breakTime, notificationTime, slotInterval, breakInterval, betweenDates);

                        res.status(200).send({
                            status: 200,
                            message: "Doctor Telemedicine Appointment Slots Created Sucessfully",
                        });

                    } else {
                        res.status(200).send({
                            status: 204,
                            message: "Chooses from Date was Greater or Equal to Todat's Date",
                        });
                    }
                }
            })
        } else {
            res.status(200).send({
                status: 204,
                message: "You can choose a minimum of 1week to maximum of 3months duration",
            });
        }
    }
};

commonCreateSlotsMethod = (reqBody, module_type, doctorId, todayDate, fromDate, toDate, consultationDuration, timezone_offset, breakTime, notificationTime, slotInterval, breakInterval, betweenDates) => {

    if (reqBody.Morning.morningSlotStatus == "true" && reqBody.Morning.repeat == "false") {
        const repeat_days = reqBody.Morning.repeat_days;
        const is_morning_matched = 'false';
        reqBody.Morning.repeat_days.forEach(function (repeatArrayItem) {
            betweenDates.forEach(function (daysArrayItem) {
                var weekDayName = moment(daysArrayItem['startDate']).format('dddd');
                const loopFromDate = moment(daysArrayItem['startDate']).format('YYYY-MM-DD');
                const a = repeatArrayItem.name.toString();
                const b = weekDayName.toString();
                if (a == b && repeatArrayItem.status == true) {
                    const slot_from_time = generateSlots.convert12To24Hours(reqBody.Morning.startTime.slotTime);
                    const slot_to_time = generateSlots.convert12To24Hours(reqBody.Morning.endTime.slotTime);
                    const slotFromTime12 = reqBody.Morning.startTime.slotTime;
                    const slotToTime12 = reqBody.Morning.endTime.slotTime;
                    const is_repeat = 0;
                    const is_morning_matched = "true";
                    const dayType = "Morning";
                    const docName = "ASDF";
                    if (slot_from_time != slot_to_time) {
                        // insertScheduleTable(doctorId, dayType, docName, weekDayName, fromDate, toDate, slot_from_time, slot_to_time, module_type, consultationDuration, breakTime, is_repeat, intervalDuration, timezone_offset, loopFromDate, todayDateTimestamp, notificationTime, slotInterval);

                        const morningAppointmentData = {
                            'doctor_id': doctorId,
                            'doctor_name': docName,
                            'appointment_day': weekDayName,
                            'from_date': fromDate,
                            'to_date': toDate,
                            'appointment_date': loopFromDate,
                            'appointment_type': dayType,
                            // 'doctor_timezone': timezone_offset,
                            'doctor_timezone': 'as',
                            'notification_duration': notificationTime,
                            'from_time': slot_from_time,
                            'to_time': slot_to_time,
                            'module_type': module_type,
                            'consultation_duration': consultationDuration,
                            'break_time': breakTime,
                            'status': "Active",
                            'is_repeat': is_repeat,
                            'consultation_mode': "video",
                        }

                        SCHEDULE.create(morningAppointmentData).then((data) => {

                            const schedule_table_id = data.id;
                            // console.log(schedule_table_id + "  last_insert_id ");

                            const splitBreakTime = breakTime.split(":");
                            const breakInterval = splitBreakTime[1];

                            const totalSlotInterval = parseInt(slotInterval) + parseInt(breakInterval);

                            // const slotFromtime = generateSlots.convert24To12Hours(slot_from_time);
                            // const slotTotime = generateSlots.convert24To12Hours(slot_to_time);

                            // console.log("Afternoon Generate slotFromtime");
                            // console.log(slotFromTime12 + " == " + slotToTime12);
                            // console.log("Afternoon G Ends slotTotime");

                            const generatedMrngSlotsArray = generateSlots.slotTimings(slotFromTime12, slotToTime12, totalSlotInterval);
                            // console.log("Morning Generate");
                            // console.log(generatedMrngSlotsArray);
                            // console.log("Morning G Ends");
                            // return;
                            generatedMrngSlotsArray.forEach(function (generatedArrayItem) {

                                var startTime = generatedArrayItem.startTime;
                                const checkSlotType = generateSlots.slotType(startTime);
                                const slotTotimeConvertion = generateSlots.convert12To24Hours(startTime);

                                const docConsultationDuration = consultationDuration

                                const slotTotimeEndwithConsultationDuration = moment(slotTotimeConvertion, 'HH:mm:ss').add(consultationDuration, 'minutes').format('HH:mm:ss');
                                // console.log(slotTotimeConvertion+" slotTotimeConvertion "+consultationDuration+" consultationDuration "+slotTotimeEndwithConsultationDuration+" slotTotimeEndwithConsultationDuration");
                                // return;
                                var slotEndtimeConvertion = generateSlots.convert24To12Hours(slotTotimeEndwithConsultationDuration);

                                // console.log("<br/>");
                                // console.log(slotEndtimeConvertion+" slotEndtimeConvertion");
                                // console.log("<br/>");
                                // console.log(generateSlots.convert24To12Hours(slotEndtimeConvertion)+" slotEndtimeConvertion");
                                // console.log("<br/>");
                                // console.log(generateSlots.convert12To24Hours("01:15 AM")+ "  " )
                                // console.log("<br/>");
                                // console.log("\n\n\n");
                                // return;

                                generatedArrayItem['id'] = "";
                                generatedArrayItem['schedule_table_id'] = schedule_table_id;
                                generatedArrayItem['doctor_id'] = doctorId;
                                generatedArrayItem['from_date'] = loopFromDate;
                                generatedArrayItem['appointment_day'] = weekDayName;
                                generatedArrayItem['slot_type'] = dayType;
                                generatedArrayItem['slot_start_time'] = startTime;
                                generatedArrayItem['slot_start_24hr_time'] = slotTotimeConvertion;
                                generatedArrayItem['slot_end_time'] = slotEndtimeConvertion;
                                generatedArrayItem['slot_end_24hr_time'] = slotTotimeEndwithConsultationDuration;
                                generatedArrayItem['is_active'] = "1";
                                generatedArrayItem['module_type'] = module_type;
                                generatedArrayItem['break_time'] = breakTime;
                                generatedArrayItem['consultation_duration'] = consultationDuration;
                                generatedArrayItem['notification_duration'] = notificationTime;
                                delete generatedArrayItem['startTime'];
                            });

                            // console.log("Morning");
                            // console.log(generatedArrayItem);
                            // console.log("Morning Ends");

                            SLOTS.bulkCreate(generatedMrngSlotsArray).then((data) => {
                            }).catch((err) => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while removing all Scheduled Slots.",
                                });
                            });

                        }).catch((err) => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while removing all Scheduled Slots.",
                            });
                        });
                    }
                }
            });
        });
    }

    if (reqBody.Afternoon.afternoonSlotStatus == "true" && reqBody.Afternoon.repeat == "false") {
        const repeat_days = reqBody.Afternoon.repeat_days;
        const is_afternoon_matched = 'false';
        reqBody.Afternoon.repeat_days.forEach(function (repeatArrayItem) {
            betweenDates.forEach(function (daysArrayItem) {
                var weekDayName = moment(daysArrayItem['startDate']).format('dddd');
                //const loopFromDate = daysArrayItem['startDate'];
                const loopFromDate = moment(daysArrayItem['startDate']).format('YYYY-MM-DD');
                const a = repeatArrayItem.name.toString();
                const b = weekDayName.toString();
                if (a == b && repeatArrayItem.status == true) {
                    // if (repeatArrayItem.name === weekDayName && repeatArrayItem.status == true) {
                    const slot_from_time = generateSlots.convert12To24Hours(reqBody.Afternoon.startTime.slotTime);
                    const slot_to_time = generateSlots.convert12To24Hours(reqBody.Afternoon.endTime.slotTime);

                    const slotFromTime12 = reqBody.Afternoon.startTime.slotTime;
                    const slotToTime12 = reqBody.Afternoon.endTime.slotTime;

                    const is_repeat = 0;
                    const is_afternoon_matched = "true";
                    const dayType = "Afternoon";
                    const docName = "ASDF";
                    if (slot_from_time != slot_to_time) {
                        // insertScheduleTable(doctorId, dayType, docName, weekDayName, fromDate, toDate, slot_from_time, slot_to_time, module_type, consultationDuration, breakTime, is_repeat, intervalDuration, timezone_offset, loopFromDate, todayDateTimestamp, notificationTime, slotInterval);

                        const afternoonAppointmentData = {
                            'doctor_id': doctorId,
                            'doctor_name': docName,
                            'appointment_day': weekDayName,
                            'from_date': fromDate,
                            'to_date': toDate,
                            'appointment_date': loopFromDate,
                            'appointment_type': dayType,
                            // 'doctor_timezone': timezone_offset,
                            'doctor_timezone': 'as',
                            'notification_duration': notificationTime,
                            'from_time': slot_from_time,
                            'to_time': slot_to_time,
                            'module_type': module_type,
                            'consultation_duration': consultationDuration,
                            'break_time': breakTime,
                            'status': "Active",
                            'is_repeat': is_repeat,
                            'consultation_mode': "video",
                        }

                        SCHEDULE.create(afternoonAppointmentData).then((data) => {

                            const schedule_table_id = data.id;
                            // console.log(schedule_table_id + "  last_insert_id ");

                            const splitBreakTime = breakTime.split(":");
                            const breakInterval = splitBreakTime[1];

                            const totalSlotInterval = parseInt(slotInterval) + parseInt(breakInterval);

                            // const slotFromtime = generateSlots.convert24To12Hours(slot_from_time);
                            // const slotTotime = generateSlots.convert24To12Hours(slot_to_time);

                            // console.log("Afternoon Generate slotFromtime");
                            // console.log(slotFromTime12 + " == " + slotToTime12);
                            // console.log("Afternoon G Ends slotTotime");

                            const generatedAtrnSlotsArray = generateSlots.slotTimings(slotFromTime12, slotToTime12, totalSlotInterval);
                            // console.log("Afternoon Generate");
                            // console.log(generatedAtrnSlotsArray);
                            // console.log("Afternoon G Ends");
                            generatedAtrnSlotsArray.forEach(function (generatedArrayItem) {

                                var startTime = generatedArrayItem.startTime;
                                const checkSlotType = generateSlots.slotType(startTime);
                                const slotTotimeConvertion = generateSlots.convert12To24Hours(startTime);

                                const docConsultationDuration = consultationDuration

                                const slotTotimeEndwithConsultationDuration = moment(slotTotimeConvertion, 'HH:mm:ss').add(consultationDuration, 'minutes').format('HH:mm:ss');
                                // console.log(slotTotimeConvertion+" slotTotimeConvertion "+consultationDuration+" consultationDuration "+slotTotimeEndwithConsultationDuration+" slotTotimeEndwithConsultationDuration");
                                const slotEndtimeConvertion = generateSlots.convert24To12Hours(slotTotimeEndwithConsultationDuration);

                                generatedArrayItem['id'] = "";
                                generatedArrayItem['schedule_table_id'] = schedule_table_id;
                                generatedArrayItem['doctor_id'] = doctorId;
                                generatedArrayItem['from_date'] = loopFromDate;
                                generatedArrayItem['appointment_day'] = weekDayName;
                                generatedArrayItem['slot_type'] = dayType;
                                generatedArrayItem['slot_start_time'] = startTime;
                                generatedArrayItem['slot_start_24hr_time'] = slotTotimeConvertion;
                                generatedArrayItem['slot_end_time'] = slotEndtimeConvertion;
                                generatedArrayItem['slot_end_24hr_time'] = slotTotimeEndwithConsultationDuration;
                                generatedArrayItem['is_active'] = "1";
                                generatedArrayItem['module_type'] = module_type;
                                generatedArrayItem['break_time'] = breakTime;
                                generatedArrayItem['consultation_duration'] = consultationDuration;
                                generatedArrayItem['notification_duration'] = notificationTime;
                                delete generatedArrayItem['startTime'];
                            });
                            // console.log("Afternoon");
                            // console.log(generatedAtrnSlotsArray);
                            // console.log("Afternoon Ends");
                            SLOTS.bulkCreate(generatedAtrnSlotsArray).then((data) => {
                            }).catch((err) => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while removing all Scheduled Slots.",
                                });
                            });

                        }).catch((err) => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while removing all Scheduled Slots.",
                            });
                        });




                    }
                }

            });
        });
    }

    if (reqBody.Evening.eveningSlotStatus == "true" && reqBody.Evening.repeat == "false") {
        const repeat_days = reqBody.Evening.repeat_days;
        const is_evening_matched = 'false';
        reqBody.Evening.repeat_days.forEach(function (repeatArrayItem) {
            betweenDates.forEach(function (daysArrayItem) {
                var weekDayName = moment(daysArrayItem['startDate']).format('dddd');
                // console.log("A B "+ weekDayName+" weekDayName "+repeatArrayItem.name);
                //const loopFromDate = daysArrayItem['startDate'];
                const loopFromDate = moment(daysArrayItem['startDate']).format('YYYY-MM-DD');
                //  && repeatArrayItem.status == "true"
                const a = repeatArrayItem.name.toString();
                const b = weekDayName.toString();
                if (a == b && repeatArrayItem.status == true) {
                    // console.log("AVINASH");
                    const slot_from_time = generateSlots.convert12To24Hours(reqBody.Evening.startTime.slotTime);
                    const slot_to_time = generateSlots.convert12To24Hours(reqBody.Evening.endTime.slotTime);
                    const is_repeat = 0;
                    const is_evening_matched = "true";
                    const dayType = "Evening";
                    const docName = "ASDF";
                    if (slot_from_time != slot_to_time) {
                        //  insertScheduleTable(doctorId, dayType, docName, weekDayName, fromDate, toDate, slot_from_time, slot_to_time, module_type, consultationDuration, breakTime, is_repeat, intervalDuration, timezone_offset, loopFromDate, todayDateTimestamp, notificationTime, slotInterval);

                        const evngAppointmentData = {
                            'doctor_id': doctorId,
                            'doctor_name': docName,
                            'appointment_day': weekDayName,
                            'from_date': fromDate,
                            'to_date': toDate,
                            'appointment_date': loopFromDate,
                            'appointment_type': dayType,
                            // 'doctor_timezone': timezone_offset,
                            'doctor_timezone': 'as',
                            'notification_duration': notificationTime,
                            'from_time': slot_from_time,
                            'to_time': slot_to_time,
                            'module_type': module_type,
                            'consultation_duration': consultationDuration,
                            'break_time': breakTime,
                            'status': "Active",
                            'is_repeat': is_repeat,
                            'consultation_mode': "video",
                        }

                        SCHEDULE.create(evngAppointmentData).then((data) => {

                            const schedule_table_id = data.id;
                            // console.log(schedule_table_id + "  last_insert_id ");

                            const splitBreakTime = breakTime.split(":");
                            const breakInterval = splitBreakTime[1];

                            const totalSlotInterval = parseInt(slotInterval) + parseInt(breakInterval);
                            const generatedEvngSlotsArray = generateSlots.slotTimings(reqBody.Evening.startTime.slotTime, reqBody.Evening.endTime.slotTime, totalSlotInterval);
                            generatedEvngSlotsArray.forEach(function (generatedArrayItem) {

                                var slotStartTime = generatedArrayItem.startTime;
                                const checkSlotType = generateSlots.slotType(slotStartTime);
                                const slotTotimeConvertion = generateSlots.convert12To24Hours(slotStartTime);
                                const docConsultationDuration = consultationDuration
                                const slotTotimeEndwithConsultationDuration = moment(slotTotimeConvertion, 'HH:mm:ss').add(consultationDuration, 'minutes').format('HH:mm:ss');
                                // console.log(slotTotimeConvertion+" slotTotimeConvertion "+consultationDuration+" consultationDuration "+slotTotimeEndwithConsultationDuration+" slotTotimeEndwithConsultationDuration");
                                const slotEndtimeConvertion = generateSlots.convert24To12Hours(slotTotimeEndwithConsultationDuration);
                                generatedArrayItem['id'] = "";
                                generatedArrayItem['schedule_table_id'] = schedule_table_id;
                                generatedArrayItem['doctor_id'] = doctorId;
                                generatedArrayItem['from_date'] = loopFromDate;
                                generatedArrayItem['appointment_day'] = weekDayName;
                                generatedArrayItem['slot_type'] = dayType;
                                generatedArrayItem['slot_start_time'] = slotStartTime;
                                generatedArrayItem['slot_start_24hr_time'] = slotTotimeConvertion;
                                generatedArrayItem['slot_end_time'] = slotEndtimeConvertion;
                                generatedArrayItem['slot_end_24hr_time'] = slotTotimeEndwithConsultationDuration;
                                generatedArrayItem['is_active'] = "1";
                                generatedArrayItem['module_type'] = module_type;
                                generatedArrayItem['break_time'] = breakTime;
                                generatedArrayItem['consultation_duration'] = consultationDuration;
                                generatedArrayItem['notification_duration'] = notificationTime;
                                delete generatedArrayItem['startTime'];
                            });

                            SLOTS.bulkCreate(generatedEvngSlotsArray);
                        });

                    }


                }
            });

        });
    }

    if (reqBody.Night.nightSlotStatus == "true" && reqBody.Night.repeat == "false") {
        const repeat_days = reqBody.Night.repeat_days;
        const is_night_matched = 'false';
        reqBody.Night.repeat_days.forEach(function (repeatArrayItem) {
            betweenDates.forEach(function (daysArrayItem) {
                var weekDayName = moment(daysArrayItem['startDate']).format('dddd');
                //const loopFromDate = daysArrayItem['startDate'];
                const loopFromDate = moment(daysArrayItem['startDate']).format('YYYY-MM-DD');
                const a = repeatArrayItem.name.toString();
                const b = weekDayName.toString();
                if (a == b && repeatArrayItem.status == true) {
                    // if (repeatArrayItem.name === weekDayName && repeatArrayItem.status == true) {
                    const slot_from_time = generateSlots.convert12To24Hours(reqBody.Night.startTime.slotTime);
                    const slot_to_time = generateSlots.convert12To24Hours(reqBody.Night.endTime.slotTime);

                    const slotFromTime12 = reqBody.Night.startTime.slotTime;
                    const slotToTime12 = reqBody.Night.endTime.slotTime;

                    const is_repeat = 0;
                    const is_night_matched = "true";
                    const dayType = "Night";
                    const docName = "ASDF";
                    if (slot_from_time != slot_to_time) {
                        // insertScheduleTable(doctorId, dayType, docName, weekDayName, fromDate, toDate, slot_from_time, slot_to_time, module_type, consultationDuration, breakTime, is_repeat, intervalDuration, timezone_offset, loopFromDate, todayDateTimestamp, notificationTime, slotInterval);

                        const nightAppointmentData = {
                            'doctor_id': doctorId,
                            'doctor_name': docName,
                            'appointment_day': weekDayName,
                            'from_date': fromDate,
                            'to_date': toDate,
                            'appointment_date': loopFromDate,
                            'appointment_type': dayType,
                            // 'doctor_timezone': timezone_offset,
                            'doctor_timezone': 'as',
                            'notification_duration': notificationTime,
                            'from_time': slot_from_time,
                            'to_time': slot_to_time,
                            'module_type': module_type,
                            'consultation_duration': consultationDuration,
                            'break_time': breakTime,
                            'status': "Active",
                            'is_repeat': is_repeat,
                            'consultation_mode': "video",
                        }

                        SCHEDULE.create(nightAppointmentData).then((data) => {

                            const schedule_table_id = data.id;
                            // console.log(schedule_table_id + "  last_insert_id ");

                            const splitBreakTime = breakTime.split(":");
                            const breakInterval = splitBreakTime[1];

                            const totalSlotInterval = parseInt(slotInterval) + parseInt(breakInterval);

                            // const slotFromtime = generateSlots.convert24To12Hours(slot_from_time);
                            // const slotTotime = generateSlots.convert24To12Hours(slot_to_time);

                            // console.log("Afternoon Generate slotFromtime");
                            // console.log(slotFromTime12 + " == " + slotToTime12);
                            // console.log("Afternoon G Ends slotTotime");

                            const generatedNghtSlotsArray = generateSlots.slotTimings(slotFromTime12, slotToTime12, totalSlotInterval);
                            // console.log("Afternoon Generate");
                            // console.log(generatedMrngSlotsArray);
                            // console.log("Afternoon G Ends");
                            generatedNghtSlotsArray.forEach(function (generatedArrayItem) {

                                var startTime = generatedArrayItem.startTime;
                                const checkSlotType = generateSlots.slotType(startTime);
                                const slotTotimeConvertion = generateSlots.convert12To24Hours(startTime);

                                const docConsultationDuration = consultationDuration

                                const slotTotimeEndwithConsultationDuration = moment(slotTotimeConvertion, 'HH:mm:ss').add(consultationDuration, 'minutes').format('HH:mm:ss');
                                // console.log(slotTotimeConvertion+" slotTotimeConvertion "+consultationDuration+" consultationDuration "+slotTotimeEndwithConsultationDuration+" slotTotimeEndwithConsultationDuration");
                                const slotEndtimeConvertion = generateSlots.convert24To12Hours(slotTotimeEndwithConsultationDuration);

                                generatedArrayItem['id'] = "";
                                generatedArrayItem['schedule_table_id'] = schedule_table_id;
                                generatedArrayItem['doctor_id'] = doctorId;
                                generatedArrayItem['from_date'] = loopFromDate;
                                generatedArrayItem['appointment_day'] = weekDayName;
                                generatedArrayItem['slot_type'] = dayType;
                                generatedArrayItem['slot_start_time'] = startTime;
                                generatedArrayItem['slot_start_24hr_time'] = slotTotimeConvertion;
                                generatedArrayItem['slot_end_time'] = slotEndtimeConvertion;
                                generatedArrayItem['slot_end_24hr_time'] = slotTotimeEndwithConsultationDuration;
                                generatedArrayItem['is_active'] = "1";
                                generatedArrayItem['module_type'] = module_type;
                                generatedArrayItem['break_time'] = breakTime;
                                generatedArrayItem['consultation_duration'] = consultationDuration;
                                generatedArrayItem['notification_duration'] = notificationTime;
                                delete generatedArrayItem['startTime'];
                            });
                            SLOTS.bulkCreate(generatedNghtSlotsArray).then((data) => {
                            }).catch((err) => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while removing all Scheduled Slots.",
                                });
                            });

                        }).catch((err) => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while removing all Scheduled Slots.",
                            });
                        });

                    }
                }
            });
        });
    }

};
// Ends here 


checkIsScheduleDuplicates = (fromDate, toDate, doctorId, module_type) => {

    const duplicatesCount = 0;
    SCHEDULE.count({
        where: {
            'from_date': fromDate,
            'to_date': toDate,
            'doctor_id': doctorId,
            'status': 'Active',
            'module_type': module_type,
        },
    }).then(count => {
        if (count > 0) {
            const duplicatesCount = count;
            return duplicatesCount;
        } else {
            return duplicatesCount;
        }
    });
};



// create Insert Schedule Table
insertScheduleTable = (doctorId, dayType, docName, weekDayName, fromDate, toDate, slot_from_time, slot_to_time, module_type, consultationDuration, breakTime, is_repeat, intervalDuration, timezone_offset, loopFromDate, todayDateTimestamp, notificationTime, slotInterval) => {

    const appointmentData = {
        'doctor_id': doctorId,
        'doctor_name': docName,
        'appointment_day': weekDayName,
        'from_date': fromDate,
        'to_date': toDate,
        'appointment_date': loopFromDate,
        'appointment_type': dayType,
        // 'doctor_timezone': timezone_offset,
        'doctor_timezone': 'as',
        'notification_duration': notificationTime,
        'from_time': slot_from_time,
        'to_time': slot_to_time,
        'module_type': module_type,
        'consultation_duration': consultationDuration,
        'break_time': breakTime,
        'status': "Active",
        'is_repeat': is_repeat,
        'consultation_mode': "video",
    }

    SCHEDULE.create(appointmentData).then((data) => {

        const schedule_table_id = data.id;
        // console.log(schedule_table_id + "  last_insert_id ");

        const splitBreakTime = breakTime.split(":");
        const breakInterval = splitBreakTime[1];

        const totalSlotInterval = parseInt(slotInterval) + parseInt(breakInterval);

        const slotFromtime = generateSlots.convert24To12Hours(slot_from_time);
        const slotTotime = generateSlots.convert24To12Hours(slot_to_time);
        const generatedSlotsArray = generateSlots.slotTimings(slotFromtime, slotTotime, totalSlotInterval);

        generatedSlotsArray.forEach(function (generatedArrayItem) {

            var startTime = generatedArrayItem.startTime;
            const checkSlotType = generateSlots.slotType(startTime);
            const slotTotimeConvertion = generateSlots.convert12To24Hours(startTime);

            const docConsultationDuration = consultationDuration

            const slotTotimeEndwithConsultationDuration = moment(slotTotimeConvertion, 'HH:mm:ss').add(consultationDuration, 'minutes').format('HH:mm:ss');
            // console.log(slotTotimeConvertion+" slotTotimeConvertion "+consultationDuration+" consultationDuration "+slotTotimeEndwithConsultationDuration+" slotTotimeEndwithConsultationDuration");
            const slotEndtimeConvertion = generateSlots.convert24To12Hours(slotTotimeEndwithConsultationDuration);

            generatedArrayItem['id'] = "";
            generatedArrayItem['schedule_table_id'] = schedule_table_id;
            generatedArrayItem['doctor_id'] = doctorId;
            generatedArrayItem['from_date'] = loopFromDate;
            generatedArrayItem['appointment_day'] = weekDayName;
            generatedArrayItem['slot_type'] = dayType;
            generatedArrayItem['slot_start_time'] = startTime;
            generatedArrayItem['slot_start_24hr_time'] = slotTotimeConvertion;
            generatedArrayItem['slot_end_time'] = slotEndtimeConvertion;
            generatedArrayItem['slot_end_24hr_time'] = slotTotimeEndwithConsultationDuration;
            generatedArrayItem['is_active'] = "1";
            generatedArrayItem['module_type'] = module_type;
            generatedArrayItem['break_time'] = breakTime;
            generatedArrayItem['consultation_duration'] = consultationDuration;
            generatedArrayItem['notification_duration'] = notificationTime;
            delete generatedArrayItem['startTime'];
        });

        SLOTS.bulkCreate(generatedSlotsArray);
    });
}
// Ends here
//  Fetch Doctor Appointment Slots
exports.fetchslots = (req, res) => {

    const consultation_date = req.body.consultation_date;
    const is_events = req.body.is_events;
    const module_type = req.body.module_type;
    const doctor_id = req.body.doctor_id;
    SCHEDULE.count()

    console.log(consultation_date + " <<< consultation_date " + is_events + " <<<< is_events " + module_type + " <<<< module_type " + doctor_id + "<<docotrid");
    // To Be Continued
};

// delete all records
exports.deleteAll = (req, res) => {
    // req.params.id
    const module_type = req.body.module_type ? req.body.module_type : "telemedicine-app";
    const doctor_id = req.params.doctorId;
    
    SCHEDULE.destroy({
        where: {
            'doctor_id': doctor_id,
            'module_type': module_type,
        },
        truncate: false,
    }).then((nums) => {
        console.log(nums + " Number Count");
        if (nums > 0) {
            SLOTS.destroy({
                where: {
                    'doctor_id': doctor_id,
                    'module_type': module_type,
                },
                truncate: false,
            }).then((chilsNums) => {
                if (chilsNums > 0) {
                    res.send({
                        message: "Telemedicine Scheduled Slots Deleted Sucessfully",
                        status: 200,
                        error: false
                    });
                } else {
                    res.status(500).send({
                        message: "Some error occurred while removing all Scheduled Slots."
                    });
                }
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Scheduled Slots.",
        });
    });
};

exports.findSingleSlot = (req, res) => {
    const from_date = req.body.fromDate;
    const doctor_id = req.body.doctor_id;
    const to_date = req.body.toDate;

    SCHEDULE.hasMany(SLOTS, { foreignKey: "schedule_table_id" });
    SLOTS.belongsTo(SCHEDULE, { foreignKey: "schedule_table_id" });

    SCHEDULE.findAndCountAll({
        where: {
            'doctor_id': doctor_id,
            'appointment_date': from_date,
            'status': 'Active',
            // 'to_date': req.body.toDate,

        }, raw: true,
        include: [SLOTS]

    }).then((response) => {
        let singlerecordfetch = response.rows;
        if (response.count >= 1) {
            let morningSlotStatusobj
            let afternoonSlotStatusobj;
            let eveningSlotStatusobj;
            let nightSlotStatusobj;
            let appointment_selected_day;
            let daytimesarray = [];
            let mngslotsarray = [];
            let aftslotsarray = [];
            let evngslotsarray = [];
            let nightslotsarray = [];
            singlerecordfetch.forEach(element => {
                if (element.appointment_date == to_date) {
                    appointment_selected_day = element.appointment_day;
                    repeat_days = [{
                        "name": "Sunday",
                        "status": appointment_selected_day == "Sunday" ? "true" : "false",
                        "displayName": "S"
                    }, {
                        "name": "Monday",
                        "status": appointment_selected_day == "Monday" ? "true" : "false",
                        "displayName": "M",
                    }, {
                        "name": "Tuesday",
                        "status": appointment_selected_day == "Tuesday" ? "true" : "false",
                        "displayName": "T",
                    }, {
                        "name": "Wednesday",
                        "status": appointment_selected_day == "Wednesday" ? "true" : "false",
                        "displayName": "W",
                    }, {
                        "name": "Thursday",
                        "status": appointment_selected_day == "Thursday" ? "true" : "false",
                        "displayName": "T"
                    }, {
                        "name": "Friday",
                        "status": appointment_selected_day == "Friday" ? "true" : "false",
                        "displayName": "F"
                    }, {
                        "name": "Saturday",
                        "status": appointment_selected_day == "Saturday" ? "true" : "false",
                        "displayName": "S"
                    }];
                    daytimesarray.push(element.appointment_type);

                    if (daytimesarray.includes("Morning")) {
                        if (element['doctor_appointment_slots_tbls.slot_type'] == "Morning") {
                            mngslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                        }
                        morningSlotStatusobj = {
                            "morningSlotStatus": "true",
                            repeat_days,
                            "startTime": {
                                "slotTime": element.from_time
                            },
                            "endTime": {
                                "slotTime": element.to_time
                            },
                            "repeat": element.is_repeat ? "true" : "false",
                            slots: mngslotsarray
                        }
                    } else {
                        morningSlotStatusobj = {
                            "morningSlotStatus": "false",
                            repeat_days: [''],
                            "startTime": {
                                "slotTime": ''
                            },
                            "endTime": {
                                "slotTime": ''
                            },
                            "repeat": '',
                            slots: mngslotsarray
                        }
                    }

                    if (daytimesarray.includes("Afternoon")) {
                        if (element['doctor_appointment_slots_tbls.slot_type'] == "Afternoon") {
                            aftslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                        }
                        afternoonSlotStatusobj = {
                            "afternoonSlotStatus": "true",
                            repeat_days,
                            "startTime": {
                                "slotTime": element.from_time
                            },
                            "endTime": {
                                "slotTime": element.to_time
                            },
                            "repeat": element.is_repeat ? "true" : "false",
                            slots: aftslotsarray
                        }
                    } else {
                        afternoonSlotStatusobj = {
                            "morningSlotStatus": "false",
                            repeat_days: [''],
                            "startTime": {
                                "slotTime": ''
                            },
                            "endTime": {
                                "slotTime": ''
                            },
                            "repeat": '',
                            slots: aftslotsarray
                        }
                    }
                    if (daytimesarray.includes("Evening")) {
                        if (element['doctor_appointment_slots_tbls.slot_type'] == "Evening") {
                            evngslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                        }
                        eveningSlotStatusobj = {
                            "eveningSlotStatus": "true",
                            repeat_days,
                            "startTime": {
                                "slotTime": element.from_time
                            },
                            "endTime": {
                                "slotTime": element.to_time
                            },
                            "repeat": element.is_repeat = 1 ? "true" : "false",
                            slots: evngslotsarray
                        }
                    } else {
                        eveningSlotStatusobj = {
                            "morningSlotStatus": "false",
                            repeat_days: [''],
                            "startTime": {
                                "slotTime": ''
                            },
                            "endTime": {
                                "slotTime": ''
                            },
                            "repeat": '',
                            slots: evngslotsarray
                        }
                    }

                    if (daytimesarray.includes("Night")) {
                        if (element['doctor_appointment_slots_tbls.slot_type'] == "Night") {
                            nightslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                        }
                        nightSlotStatusobj = {
                            "nightSlotStatus": "true",
                            repeat_days,
                            "startTime": {
                                "slotTime": element.from_time
                            },
                            "endTime": {
                                "slotTime": element.to_time
                            },
                            "repeat": element.is_repeat ? "true" : "false",
                            slots: nightslotsarray
                        }
                    } else {
                        nightSlotStatusobj = {
                            "morningSlotStatus": "false",
                            repeat_days: [''],
                            "startTime": {
                                "slotTime": ''
                            },
                            "endTime": {
                                "slotTime": ''
                            },
                            "repeat": '',
                            slots: nightslotsarray
                        }
                    }
                }
            })

            res.json({
                "status": 200,
                "msg": "Doctor Slots Fetched Successfully",
                "result": {
                    "Morning": morningSlotStatusobj,
                    "Afternoon": afternoonSlotStatusobj,
                    "Evening": eveningSlotStatusobj,
                    "Night": nightSlotStatusobj,
                    "allDays": req.body.allDays,
                    "fromDate": from_date,
                    "toDate": to_date,
                    "module_type": singlerecordfetch[0].module_type,
                    "toDay": appointment_selected_day,
                    "consultationDuration": singlerecordfetch[0].consultation_duration,
                    "notificationTime": singlerecordfetch[0].notification_duration,
                    "breakTime": singlerecordfetch[0].break_time
                },
            })
        } else {
            res.json({ message: "Inactive" });
        }
    })

}

// GET ALL SLOTS FOR THE APPOINTMENTS
exports.getSlots = (req, res) => {
    const from_date = req.body.fromDate;
    const doctor_id = req.body.doctor_id;
    const to_date = req.body.toDate;

    SCHEDULE.hasMany(SLOTS, { foreignKey: "schedule_table_id" });
    SLOTS.belongsTo(SCHEDULE, { foreignKey: "schedule_table_id" });

    SCHEDULE.findAndCountAll({
        where: {
            'doctor_id': doctor_id,
            'appointment_date': { [Op.between]: [from_date, to_date] },
            'status': 'Active'
        },
        raw: true,
        include: [SLOTS]
    }).then((response) => {

        let allRecords = response.rows;
        allRecords = allRecords.sort((a, b) => new Date(a.appointment_date) > new Date(b.appointment_date) ? 1 : new Date(b.appointment_date) > new Date(a.appointment_date) ? -1 : 0);

        if (response.count >= 1) {
            let dateObject = {};
            let morningSlotStatusobj = {};
            let afternoonSlotStatusobj = {};
            let eveningSlotStatusobj = {};
            let nightSlotStatusobj = {};
            let appointment_selected_day = {};
            let daytimesarray = [];
            let mngslotsarray = [];
            let aftslotsarray = [];
            let evngslotsarray = [];
            let nightslotsarray = [];

            allRecords.forEach(element => {

                //if(element.appointment_date == to_date) {
                appointment_selected_day = element.appointment_day;

                repeat_days = [
                    {
                        "name": "Sunday",
                        "status": appointment_selected_day == "Sunday" ? "true" : "false",
                        "displayName": "S"
                    },
                    {
                        "name": "Monday",
                        "status": appointment_selected_day == "Monday" ? "true" : "false",
                        "displayName": "M",
                    },
                    {
                        "name": "Tuesday",
                        "status": appointment_selected_day == "Tuesday" ? "true" : "false",
                        "displayName": "T",
                    },
                    {
                        "name": "Wednesday",
                        "status": appointment_selected_day == "Wednesday" ? "true" : "false",
                        "displayName": "W",
                    },
                    {
                        "name": "Thursday",
                        "status": appointment_selected_day == "Thursday" ? "true" : "false",
                        "displayName": "T"
                    },
                    {
                        "name": "Friday",
                        "status": appointment_selected_day == "Friday" ? "true" : "false",
                        "displayName": "F"
                    },
                    {
                        "name": "Saturday",
                        "status": appointment_selected_day == "Saturday" ? "true" : "false",
                        "displayName": "S"
                    }
                ];

                dateObjKey = element.appointment_date;
                dateObject[dateObjKey] = {};
                daytimesarray.push(element.appointment_type);

                if (daytimesarray.includes("Morning")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Morning") {
                        mngslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                    }
                    morningSlotStatusobj = {
                        "morningSlotStatus": "true",
                        repeat_days,
                        "startTime": {
                            "slotTime": element.from_time
                        },
                        "endTime": {
                            "slotTime": element.to_time
                        },
                        "repeat": element.is_repeat ? "true" : "false",
                        slots: mngslotsarray.filter(function (item, i, ar) { return ar.indexOf(item) === i; })
                    };
                    dateObject[dateObjKey]['Morning'] = morningSlotStatusobj;
                } else {
                    morningSlotStatusobj = {
                        "morningSlotStatus": "false",
                        repeat_days: [''],
                        "startTime": {
                            "slotTime": ''
                        },
                        "endTime": {
                            "slotTime": ''
                        },
                        "repeat": '',
                        slots: mngslotsarray
                    }
                }

                if (daytimesarray.includes("Afternoon")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Afternoon") {
                        aftslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                    }
                    afternoonSlotStatusobj = {
                        "afternoonSlotStatus": "true",
                        repeat_days,
                        "startTime": {
                            "slotTime": element.from_time
                        },
                        "endTime": {
                            "slotTime": element.to_time
                        },
                        "repeat": element.is_repeat ? "true" : "false",
                        slots: aftslotsarray.filter(function (item, i, ar) { return ar.indexOf(item) === i; })
                    };
                    dateObject[dateObjKey]['Afternoon'] = afternoonSlotStatusobj;
                } else {
                    afternoonSlotStatusobj = {
                        "morningSlotStatus": "false",
                        repeat_days: [''],
                        "startTime": {
                            "slotTime": ''
                        },
                        "endTime": {
                            "slotTime": ''
                        },
                        "repeat": '',
                        slots: aftslotsarray
                    }
                }

                if (daytimesarray.includes("Evening")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Evening") {
                        evngslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                    }
                    eveningSlotStatusobj = {
                        "eveningSlotStatus": "true",
                        repeat_days,
                        "startTime": {
                            "slotTime": element.from_time
                        },
                        "endTime": {
                            "slotTime": element.to_time
                        },
                        "repeat": element.is_repeat = 1 ? "true" : "false",
                        slots: evngslotsarray.filter(function (item, i, ar) { return ar.indexOf(item) === i; })
                    };
                    dateObject[dateObjKey]['Evening'] = eveningSlotStatusobj;
                } else {
                    eveningSlotStatusobj = {
                        "morningSlotStatus": "false",
                        repeat_days: [''],
                        "startTime": {
                            "slotTime": ''
                        },
                        "endTime": {
                            "slotTime": ''
                        },
                        "repeat": '',
                        slots: evngslotsarray
                    }
                }

                if (daytimesarray.includes("Night")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Night") {
                        nightslotsarray.push(element['doctor_appointment_slots_tbls.slot_start_time'])
                    }
                    nightSlotStatusobj = {
                        "nightSlotStatus": "true",
                        repeat_days,
                        "startTime": {
                            "slotTime": element.from_time
                        },
                        "endTime": {
                            "slotTime": element.to_time
                        },
                        "repeat": element.is_repeat ? "true" : "false",
                        slots: nightslotsarray.filter(function (item, i, ar) { return ar.indexOf(item) === i; })
                    };
                    dateObject[dateObjKey]['Night'] = nightSlotStatusobj;
                } else {
                    nightSlotStatusobj = {
                        "morningSlotStatus": "false",
                        repeat_days: [''],
                        "startTime": {
                            "slotTime": ''
                        },
                        "endTime": {
                            "slotTime": ''
                        },
                        "repeat": '',
                        slots: nightslotsarray
                    }
                }

                //} 
            });

            res.status("200").json({
                "status": 200,
                "msg": "Doctor Slots Fetched Successfully",
                "result": {
                    "DateObject": dateObject,
                    "allDays": req.body.allDays,
                    "fromDate": from_date,
                    "toDate": to_date,
                    "module_type": allRecords[0].module_type,
                    "toDay": appointment_selected_day,
                    "consultationDuration": allRecords[0].consultation_duration,
                    "notificationTime": allRecords[0].notification_duration,
                    "breakTime": allRecords[0].break_time
                }
            });
            res.end();

        } else {
            res.status("404").json({ message: "Inactive" })
        }
    })

}

exports.findpatientslots = (req, res) => {   
    var consultation_date = moment(req.body.consultation_date).format('YYYY-MM-DD');
    const currentTimeStamp = moment().format('HH:mm:ss');
    const currentDateStamp = moment().format('YYYY-MM-DD');


//console.log("----- currentTimeStamp -------", currentTimeStamp);

//return;
if(currentDateStamp === consultation_date)
{
var Schedulecontion =  { where: {
    'appointment_date': consultation_date,
    'module_type': 'telemedicine-app',
    'doctor_id': req.body.doctor_id,
    appointment_date: moment().format("YYYY-MM-DD")    
    }
    }
    var Slotscontion =   { where: {
        'from_date': consultation_date,
        'doctor_id': req.body.doctor_id,
        slot_start_24hr_time: {
            [Op.gte]: moment().format("HH:mm:ss"),
          }
             }
            }
}
else
{
    var Schedulecontion =   { where: {
    'appointment_date': consultation_date,
    'module_type': 'telemedicine-app',
    'doctor_id': req.body.doctor_id }
        }

        var Slotscontion =   { where: {
            'from_date': consultation_date,
            'doctor_id': req.body.doctor_id,
                 }
                }

}

    SCHEDULE.count(Schedulecontion).then((countdata) => {
        if (countdata >= 1) {
            SLOTS.findAll(Slotscontion).then((response) => {
            //return;
                if(response.length >= 1){
                responseobject = JSON.parse(JSON.stringify(response));
                let mngobject = [];
                let aftobject = [];
                let evngobject = [];
                let nightobject = [];
                const todayDate = moment().format("YYYY-MM-DD");
                responseobject.forEach(element => {

                    if (element.slot_type == "Morning") {
                        var mngSlotTime = generateSlots.convert12To24Hours(element.slot_start_time);
                        if (req.body.consultation_date == todayDate) {
                            if (mngSlotTime >= currentTimeStamp)
                                mngobject.push(element.slot_start_time)
                        } 
                        else {
                            mngobject.push(element.slot_start_time)
                        }

                    }

                    if (element.slot_type == "Afternoon") {
                        var aftSlotTime = generateSlots.convert12To24Hours(element.slot_start_time);
                        if (req.body.consultation_date == todayDate) {
                            if (aftSlotTime >= currentTimeStamp)
                                aftobject.push(element.slot_start_time)
                        } else {
                            aftobject.push(element.slot_start_time)
                        }
                    }

                    if (element.slot_type == "Evening") {
                        var evngSlotTime = generateSlots.convert12To24Hours(element.slot_start_time);
                        if (req.body.consultation_date == todayDate) {
                            if (evngSlotTime >= currentTimeStamp)
                                evngobject.push(element.slot_start_time)
                        } else {
                            evngobject.push(element.slot_start_time)
                        }
                    }

                    if (element.slot_type == "Night") {
                        var nightSlotTime = generateSlots.convert12To24Hours(element.slot_start_time);
                        if (req.body.consultation_date == todayDate) {
                            if (nightSlotTime >= currentTimeStamp)
                                nightobject.push(element.slot_start_time)
                        } else {
                            nightobject.push(element.slot_start_time)
                        }
                    }

           });


        Appointments.findAll({
                    where: {
                        doctor_id: req.body.doctor_id,
                        appointment_datetime: { [Op.like]: "%" + consultation_date + "%" },   //req.body.consultation_date
                        //status : 0,
                        status: { [Op.or]: [0, 1]} },
                  }).then((appointmentdata) => {                      
                    if(appointmentdata.length > 0 ){                        
                        let morningObject = [];
                        let afternoonObject = [];
                        let eveningObject = [];
                        let nightObject = [];
                        appointmentdata.forEach(element => {
                            let appointmentDatetime = element.appointment_datetime;
                            let split = appointmentDatetime.split(' ');
                            let splitTime = split[1];

                            const checkSlotType = generateSlots.slotType(splitTime);

                            if(checkSlotType == "Morning"){
                                const slotMrngFromtime = generateSlots.convert24To12Hours(splitTime);
                                morningObject.push(slotMrngFromtime);
                            }else if(checkSlotType == "Afternoon"){
                                const slotAftrnFromtime = generateSlots.convert24To12Hours(splitTime);
                                afternoonObject.push(slotAftrnFromtime);
                            }else if(checkSlotType == "Evening"){
                                const slotEvngFromtime = generateSlots.convert24To12Hours(splitTime);
                                eveningObject.push(slotEvngFromtime);
                            }else if(checkSlotType == "Night"){
                                const slotNightFromtime = generateSlots.convert24To12Hours(splitTime);
                                nightObject.push(slotNightFromtime);
                            }
                        });

                        if(morningObject.length > 0){
                            mngobject = mngobject.filter(n=>!morningObject.includes(n))
                        }
                        if(afternoonObject.length > 0){
                            aftobject = aftobject.filter(n=>!afternoonObject.includes(n))
                        }
                        if(eveningObject.length > 0){
                            evngobject = evngobject.filter(n=>!eveningObject.includes(n))
                        }
                        if(nightObject.length > 0){
                            nightobject = nightobject.filter(n=>!nightObject.includes(n))
                        }

                        res.json({
                            "status": 200, "msg": "Calender Details fetched Successfully",  "result": [{ "Label": "Morning", "time_slots": mngobject },
                            { "Label": "Afternoon", "time_slots": aftobject },
                            { "Label": "Evening", "time_slots": evngobject }, { "Label": "Night", "time_slots": nightobject }], "events": []
                        })
                        
                        // res.send({
                        //     status : 200,
                        //     morning : morningObject,
                        //     morningLength : morningObject.length,
                        //     afternoon : afternoonObject,
                        //     evening : eveningObject,
                        //     night : nightObject,
                        //     mngobject : mngobject
                        // });

                    }
                    else
                    {
                        res.json({
                            "status": 200, "msg": "Calender Details fetched Successfully",  "result": [{ "Label": "Morning", "time_slots": mngobject },
                            { "Label": "Afternoon", "time_slots": aftobject },
                            { "Label": "Evening", "time_slots": evngobject }, { "Label": "Night", "time_slots": nightobject }], "events": []
                        })
                    }
                  });
            
            
            
                }
                else
                {
                    res.status(200).send({
                        status: 200,
                        error: false,
                        message: "No slots found",
                        result:[]
                     });  
                }
            
            
                })
        
        
        
        
        } 
        else {
            // res.json({ message: "No slots found" })
            res.status(200).send({
                status: 200,
                error: false,
                message: "No slots found",
                result:[]
             });
        }
        

    }).catch(err => {        
        res.status(500).send({
        message: "Error updating Patient with id=" + id
        });
    });
}


// Fetch Doctor Appointment Slots for Patient App
exports.findOne = (req, res) => {
    const doctorId = req.params.id;
    let message = "";
    let resultStatus = true;
    const module_type = "telemedicine-app";
    let patientConsultationDate = "";
    const todayDate = moment().format("YYYY-MM-DD");
    const todayDateTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = [];
    SCHEDULE.findAll({
        where: {
            'doctor_id': doctorId,
            'status': "Active",
            'module_type': module_type,
        },
        attributes: ['appointment_date'],
        group: ['appointment_date'],
        raw: true,
    }).then(result => {
        let recordsCount = result.length;
        message = "Doctor Appointment days fetched Successfully";
        if (recordsCount == 0) {
            message = "No records found";
            resultStatus = false;
        }else{
            data = Array.prototype.map.call(result, s => s.appointment_date);
        }
        res.status(200).send({
            status: 200,
            error: resultStatus,
            message: message,
            data: data
        });
    });
};
// Ends here




// Update Doctor Appointment Slots for Patient App
exports.updatePatientSigleAppointmentSlot = (req, res) => {

    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const allDays = req.body.allDays;
    const module_type = req.body.module_type;
    const doctorId = req.body.doctorId;
    const consultationDuration = req.body.consultationDuration + ":00";
    const timezone_offset = req.body.timezone_offset;
    const eachTimeslotHours = req.body.eachTimeslotHours;
    const eachTimeslotMinutes = req.body.eachTimeslotMinutes;
    const breakTime = req.body.breakTime + ":00";;
    const notificationTime = req.body.notificationTime;
    const splitDuration = consultationDuration.split(":");
    const slotInterval = splitDuration[1];
    const intervalDuration = slotInterval + ' mins';
    const splitBreakTime = breakTime.split(":");
    const breakInterval = splitBreakTime[1];

    const splitFromdate = fromDate.split("-");
    const splitTodate = toDate.split("-");

    const reqBody = req.body;

    // var a = moment([splitFromdate[0], splitFromdate[1], splitFromdate[2]]);
    // var b = moment([splitTodate[0], splitTodate[1], splitTodate[2]]);
    // const daysDifference = b.diff(a, 'days') + 1;

    var startDate = moment(fromDate, "YYYY-MM-DD");
    var endDate = moment(toDate, "YYYY-MM-DD");
    const daysDifference = endDate.diff(startDate, 'days');

    // console.log("daysDifference " + daysDifference);
    const betweenDates = generateSlots.generateDaysBetweenDates(fromDate, toDate);
    // console.log(betweenDates);
    // return false;
    const todayDate = moment().format("YYYY-MM-DD");
    const todayDateTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    if (allDays.toString() == "false") {
        // console.log("True");
        SCHEDULE.findAndCountAll({
            where: {
                appointment_date: {
                    [Op.eq]: fromDate,
                },
                'module_type': module_type,
                "status": "Active",
            },
            raw: true,
            limit: 1,
            order: [
                ['id', 'DESC']
            ],
        }).then(result => {

            const totalRows = result.count;

            if (totalRows > 0) {

                const existingFromdate = result.rows[0].from_date;
                const existingTodate = result.rows[0].to_date;

                SCHEDULE.destroy({
                    where: {
                        appointment_date: {
                            [Op.eq]: fromDate,
                        },
                        'module_type': module_type,
                    },
                    truncate: false,
                })

                SLOTS.count({
                    where: {
                        from_date: {
                            [Op.eq]: fromDate,
                        },
                        'module_type': module_type,
                    },
                }).then(count => {
                    if (count > 0) {
                        SLOTS.destroy({
                            where: {
                                from_date: {
                                    [Op.eq]: fromDate,
                                },
                                'module_type': module_type,
                            },
                            truncate: false,
                        })
                    }
                });

                delay(function () {

                    if (fromDate >= todayDate) {

                        commonCreateSlotsMethod(reqBody, module_type, doctorId, todayDate, fromDate, toDate, consultationDuration, timezone_offset, breakTime, notificationTime, slotInterval, breakInterval, betweenDates);

                        res.status(200).send({
                            status: 200,
                            message: "Doctor Telemedicine Appointment Slots Updated Sucessfully",
                        });

                    } else {
                        res.status(200).send({
                            status: 204,
                            message: "Chooses from Date was Greater or Equal to Todat's Date",
                        });
                    }

                }, 5000);

            } else {

            }
        });
    }
    else if (allDays.toString() == "true") {

        SCHEDULE.count({
            where: {
                'from_date': fromDate,
                'to_date': toDate,
                'doctor_id': doctorId,
                'module_type': module_type,
            },
        }).then(rowsCount => {
            if (rowsCount > 0) {

                SCHEDULE.destroy({
                    where: {
                        appointment_date: {
                            [Op.between]: [fromDate, toDate],
                        },
                        'from_date': fromDate,
                        'to_date': toDate,
                        'doctor_id': doctorId,
                        'module_type': module_type,
                    },
                    truncate: false,
                })
            }
        });

        SLOTS.count({
            where: {
                from_date: {
                    [Op.between]: [fromDate, toDate],
                },
                'doctor_id': doctorId,
                'module_type': module_type,
            },
        }).then(count => {
            if (count > 0) {
                SLOTS.destroy({
                    where: {
                        from_date: {
                            [Op.between]: [fromDate, toDate],
                        },
                        'doctor_id': doctorId,
                        'module_type': module_type,
                    },
                    truncate: false,
                }).then({

                })
            }
        });

        delay(function () {

            if (fromDate >= todayDate) {

                commonCreateSlotsMethod(reqBody, module_type, doctorId, todayDate, fromDate, toDate, consultationDuration, timezone_offset, breakTime, notificationTime, slotInterval, breakInterval, betweenDates);

                res.status(200).send({
                    status: 200,
                    message: "Doctor Telemedicine Appointment Slots Updated Sucessfully",
                });

            } else {
                res.status(200).send({
                    status: 204,
                    message: "Chooses from Date was Greater or Equal to Todat's Date",
                });
            }

        }, 5000);
    }

};


// Don't Disturb Starts here 
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
// Ends here

// Fetch Doctor Appointment Slots for Doctor App
exports.fetchDoctorAppointmentSlots = (req, res) => {

    const doctorId = req.body.doctorId;
    const consultationDate = req.body.consultationDate;

    // console.log(req.body);
    // return;

    getDoctorAppointmentSlots(doctorId, consultationDate, res);

};
// Ends here 

getDoctorAppointmentSlots = (doctorId, consultationDate, res) => {

    SCHEDULE.hasMany(SLOTS, { foreignKey: "schedule_table_id" });
    SLOTS.belongsTo(SCHEDULE, { foreignKey: "schedule_table_id" });

    SCHEDULE.findAndCountAll({
        where: {
            'doctor_id': doctorId,
            'appointment_date': consultationDate,
            'status': 'Active'
        },
        raw: true,
        include: [SLOTS]
    }).then((response) => {

        let allScheduledRecords = response.rows;

        allScheduledRecords = allScheduledRecords.sort((a, b) => new Date(a.appointment_date) > new Date(b.appointment_date) ? 1 : new Date(b.appointment_date) > new Date(a.appointment_date) ? -1 : 0);
        // console.log(allScheduledRecords);
        // return;
        if (response.count >= 1) {

            let daytimesarray = [];
            let mrngSlotsArray = [];
            let aftrnSlotsArray = [];
            let evngSlotsArray = [];
            let nightSlotsArray = [];

            let dateObject = {};
            allScheduledRecords.forEach(element => {

                dateObjKey = element.appointment_date;
                dateObject[dateObjKey] = {};
                daytimesarray.push(element.appointment_type);

                if (daytimesarray.includes("Morning")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Morning") {
                        mrngSlotsArray.push(
                            {
                                "start_time": element['doctor_appointment_slots_tbls.slot_start_time'],
                                "end_time": element['doctor_appointment_slots_tbls.slot_end_time'],
                                "schedule_table_id": element['doctor_appointment_slots_tbls.schedule_table_id'],
                                "row_id": element['doctor_appointment_slots_tbls.id'],
                                "is_active": element['doctor_appointment_slots_tbls.is_active'],
                            }
                        )
                    }
                }
                if (daytimesarray.includes("Afternoon")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Afternoon") {
                        aftrnSlotsArray.push(
                            {
                                "start_time": element['doctor_appointment_slots_tbls.slot_start_time'],
                                "end_time": element['doctor_appointment_slots_tbls.slot_end_time'],
                                "schedule_table_id": element['doctor_appointment_slots_tbls.schedule_table_id'],
                                "row_id": element['doctor_appointment_slots_tbls.id'],
                                "is_active": element['doctor_appointment_slots_tbls.is_active'],
                            }
                        )
                    }
                }
                if (daytimesarray.includes("Evening")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Evening") {
                        evngSlotsArray.push(
                            {
                                "start_time": element['doctor_appointment_slots_tbls.slot_start_time'],
                                "end_time": element['doctor_appointment_slots_tbls.slot_end_time'],
                                "schedule_table_id": element['doctor_appointment_slots_tbls.schedule_table_id'],
                                "row_id": element['doctor_appointment_slots_tbls.id'],
                                "is_active": element['doctor_appointment_slots_tbls.is_active'],
                            }
                        )
                    }
                }
                if (daytimesarray.includes("Night")) {
                    if (element['doctor_appointment_slots_tbls.slot_type'] == "Night") {
                        nightSlotsArray.push(
                            {
                                "start_time": element['doctor_appointment_slots_tbls.slot_start_time'],
                                "end_time": element['doctor_appointment_slots_tbls.slot_end_time'],
                                "schedule_table_id": element['doctor_appointment_slots_tbls.schedule_table_id'],
                                "row_id": element['doctor_appointment_slots_tbls.id'],
                                "is_active": element['doctor_appointment_slots_tbls.is_active'],
                            }
                        )
                    }
                }
            });
            res.status("200").json({
                "status": 200,
                "msg": "Doctor Appointment Slots Fetched Successfully",
                "result": {
                    "module_type": allScheduledRecords[0].module_type,
                    "fromDate": allScheduledRecords[0].from_date,
                    "toDate": allScheduledRecords[0].to_date,
                    "consultationDuration": allScheduledRecords[0].consultation_duration,
                    "notificationTime": allScheduledRecords[0].notification_duration,
                    "breakTime": allScheduledRecords[0].break_time,
                    "Morning": mrngSlotsArray,
                    "Afternoon": aftrnSlotsArray,
                    "Evening": evngSlotsArray,
                    "Night": nightSlotsArray,
                }
            });
            res.end();
        }
    })
};



// Fetch Doctor Appointment Slots for Doctor App
exports.doctorActivateDeactivateAppointmentSlots = (req, res) => {

    const scheduleTableId = req.body.schedule_table_id;
    const slotAction = req.body.slot_action;
    const slotDate = req.body.slot_date;
    const isSingleSlot = req.body.is_single;
    var slotActionText = "Deactivated";

    const todayDate = moment().format("YYYY-MM-DD");

    if (slotDate >= todayDate) {

        if (isSingleSlot.toString() == "true") {

            if (slotAction == 1) {
                slotActionText = "Activated";
            }
            const slotData = {
                'is_active': slotAction
            }
            SLOTS.update(slotData, {
                where: { id: scheduleTableId },
            }).then((num) => {
                if (num == 1) {
                    res.status(200).send({
                        status: 200,
                        message: "Doctor Slot " + slotActionText + " Sucessfully",
                    });
                } else {
                    res.send({
                        message: "Cannot " + slotActionText + " users with id=${id}. Maybe Users was not found or req.body is empty!",
                    });
                }
            }).catch((err) => {
                res.status(500).send({
                    message: "Error " + slotActionText + " Slots with id=" + err,
                });
            });
        } else {

            if (slotAction == 1) {
                slotActionText = "Activated";
            }
            scheduleTableId.forEach(function (arrayItem) {
                const slotBulkData = {
                    'is_active': slotAction
                }
                SLOTS.update(slotBulkData, {
                    where: { id: arrayItem.slot_id },
                }).then((num) => {

                }).catch((err) => {
                    res.status(500).send({
                        message: "Error " + slotActionText + " Slots with id=" + err,
                    });
                });
            });
            res.status(200).send({
                status: 200,
                message: "Doctor Slot " + slotActionText + " Sucessfully",
            });
        }
    } else {
        res.status(200).send({
            status: 204,
            message: "Chooses from Date was Greater or Equal to Todat's Date",
        });
    }
};
// Ends here

exports.getCalendarDates = (req,res) => {
    var doctor_id = req.params.doctor_id;
    const from_date = moment().format("YYYY-MM-DD");
    const to_date = moment(from_date, "YYYY-MM-DD").add(90,'days').format("YYYY-MM-DD");
    console.log(to_date)
    SCHEDULE.findAndCountAll({
    
        where: {
            'doctor_id': doctor_id,
            'appointment_date': { [Op.between]: [from_date, to_date] },
            'status': 'Active'
        },
        attributes:[[Sequelize.literal('DISTINCT `appointment_date`'), 'appointment_date']],
      //  raw: true,
       // include: [SLOTS]
    }).then((response) => {
       if(response.count >=1) { 
        var appointment_day = [];
        response.rows.forEach(element => {
            const splitdate = element.appointment_date.split("-");0
            appointment_day.push({"calendardate":element.appointment_date,"year":splitdate[0],"month":splitdate[1],"date":splitdate[2]})
        })
        res.send({"message": "Calender Dates fetched Successfully","data":appointment_day,"count":response.rows.length})
       } else {
           res.send({'message':"No Dates found"})
       }
    })
}



exports.getCreatedDoctorSlots = (req,res) => {

    var doctorId = req.body.doctor_id;
    var from_date = req.body.from_date;
    var to_date = req.body.to_date;
    var moduleType = req.body.module_type ? req.body.module_type : "telemedicine-app";

    // console.log("Doctor Id >> "+doctorId+" startDate >> "+from_date+" endDate >> "+to_date+" moduleType >> "+moduleType);

    SCHEDULE.hasMany(SLOTS, { foreignKey: "schedule_table_id" });
    SLOTS.belongsTo(SCHEDULE, { foreignKey: "schedule_table_id" });

    SCHEDULE.findAndCountAll({
        where: {
            'doctor_id': doctorId,
            'appointment_date': { [Op.between]: [from_date, to_date] },
            'status': 'Active',
            'module_type':moduleType
        },
        raw: true,
        order: [["appointment_date", "ASC"]],
        include: [SLOTS]
    }).then((response) => {

        if(response.count > 0){

            // res.send({ status : 200 , data : response.rows })
            // return;    return;     return;

            let morningSlotStatusobj = {};
            let afternoonSlotStatusobj = {};
            let eveningSlotStatusobj = {};
            let nightSlotStatusobj = {};
            let appointment_selected_day = {};
            let daytimesarray = [];
            let mngslotsarray = [];
            let aftslotsarray = [];
            let evngslotsarray = [];
            let nightslotsarray = [];
            let allRecords = response.rows;

            let ismRepeat = isaRepeat = iseRepeat = isnRepeat = "false";

            let ismSunday = ismMonday = ismTuesday = ismWednesday = ismThursday = ismFriday = ismSaturday = "false";
            let isaSunday = isaMonday = isaTuesday = isaWednesday = isaThursday = isaFriday = isaSaturday = "false";
            let iseSunday = iseMonday = iseTuesday = iseWednesday = iseThursday = iseFriday = iseSaturday = "false";
            let isnSunday = isnMonday = isnTuesday = isnWednesday = isnThursday = isnFriday = isnSaturday = "false";

            allRecords.forEach(element => {
              
                let appointment_type = element.appointment_type;
                let appointment_day = element.appointment_day;

                if(appointment_type === "Morning"){

                    let mFromTime = generateSlots.convert24To12Hours(element.from_time);
                    let mToTime = generateSlots.convert24To12Hours(element.to_time);

                    if(element.is_repeat === 1)
                    { 
                        ismRepeat = "true";
                    }

                    if(appointment_day === 'Sunday') { ismSunday = "true"; }
                    if(appointment_day === 'Monday') { ismMonday = "true"; }
                    if(appointment_day ==='Tuesday') { ismTuesday = "true"; }
                    if(appointment_day === 'Wednesday') { ismWednesday = "true"; }
                    if(appointment_day === 'Thursday') { ismThursday = "true"; }
                    if(appointment_day === 'Friday') { ismFriday = "true"; }
                    if(appointment_day === 'Saturday') { ismSaturday = "true"; }

                    if (element['doctor_appointment_slots_tbls.slot_type'] === "Morning") {
                        mngslotsarray.push({slotTime : element['doctor_appointment_slots_tbls.slot_start_time']})
                    }

                   morningSlotStatusobj = {
                        "morningSlotStatus": "true",
                        "startTime": {
                            "slotTime": mFromTime
                        },
                        "endTime": {
                            "slotTime": mToTime
                        },
                        "repeat_days":[
                            {
                                "name": "Sunday",
                                "status": ismSunday,
                                "displayName": "S"
                            },
                            {
                                "name": "Monday",
                                "status": ismMonday,
                                "displayName": "M",
                            },
                            {
                                "name": "Tuesday",
                                "status": ismTuesday,
                                "displayName": "T",
                            },
                            {
                                "name": "Wednesday",
                                "status": ismWednesday,
                                "displayName": "W",
                            },
                            {
                                "name": "Thursday",
                                "status": ismThursday,
                                "displayName": "T"
                            },
                            {
                                "name": "Friday",
                                "status": ismFriday,
                                "displayName": "F"
                            },
                            {
                                "name": "Saturday",
                                "status": ismSaturday,
                                "displayName": "S"
                            },
                        ],
                        "repeat": ismRepeat,
                        'slots': mngslotsarray
                    };
                }
                // else {
                //     morningSlotStatusobj = {
                //         "morningSlotStatus": "false",
                //         repeat_days: [''],
                //         "startTime": {
                //             "slotTime": ''
                //         },
                //         "endTime": {
                //             "slotTime": ''
                //         },
                //         "repeat": '',
                //         slots: []
                //     }
                // }
                if(appointment_type === "Afternoon"){

                    let aFromTime = generateSlots.convert24To12Hours(element.from_time);
                    let aToTime = generateSlots.convert24To12Hours(element.to_time);

                    if(element.is_repeat === 1)
                    { 
                        isaRepeat = "true";
                    }

                    if(appointment_day === 'Sunday') { isaSunday = "true"; }
                    if(appointment_day === 'Monday') { isaMonday = "true"; }
                    if(appointment_day ==='Tuesday') { isaTuesday = "true"; }
                    if(appointment_day === 'Wednesday') { isaWednesday = "true"; }
                    if(appointment_day === 'Thursday') { isaThursday = "true"; }
                    if(appointment_day === 'Friday') { isaFriday = "true"; }
                    if(appointment_day === 'Saturday') { isaSaturday = "true"; }

                    if (element['doctor_appointment_slots_tbls.slot_type'] === "Afternoon") {
                        aftslotsarray.push({slotTime : element['doctor_appointment_slots_tbls.slot_start_time']})
                    }

                    afternoonSlotStatusobj = {
                        "afternoonSlotStatus": "true",
                        "startTime": {
                            "slotTime": aFromTime
                        },
                        "endTime": {
                            "slotTime": aToTime
                        },
                        "repeat_days":[
                            {
                                "name": "Sunday",
                                "status": isaSunday,
                                "displayName": "S"
                            },
                            {
                                "name": "Monday",
                                "status": isaMonday,
                                "displayName": "M",
                            },
                            {
                                "name": "Tuesday",
                                "status": isaTuesday,
                                "displayName": "T",
                            },
                            {
                                "name": "Wednesday",
                                "status": isaWednesday,
                                "displayName": "W",
                            },
                            {
                                "name": "Thursday",
                                "status": isaThursday,
                                "displayName": "T"
                            },
                            {
                                "name": "Friday",
                                "status": isaFriday,
                                "displayName": "F"
                            },
                            {
                                "name": "Saturday",
                                "status": isaSaturday,
                                "displayName": "S"
                            },
                        ],
                        "repeat": isaRepeat,
                        'slots': aftslotsarray,
                    };
                }
                // else {
                //         afternoonSlotStatusobj = {
                //             "afternoonSlotStatus": "false",
                //             repeat_days: [''],
                //             "startTime": {
                //                 "slotTime": ''
                //             },
                //             "endTime": {
                //                 "slotTime": ''
                //             },
                //             "repeat": '',
                //             slots: aftslotsarray
                //         }
                //     }

                if(appointment_type === "Evening"){

                    let eFromTime = generateSlots.convert24To12Hours(element.from_time);
                    let eToTime = generateSlots.convert24To12Hours(element.to_time);

                    if(element.is_repeat === 1)
                    { 
                        iseRepeat = "true";
                    }

                    if(appointment_day === 'Sunday') { iseSunday = "true"; }
                    if(appointment_day === 'Monday') { iseMonday = "true"; }
                    if(appointment_day ==='Tuesday') { iseTuesday = "true"; }
                    if(appointment_day === 'Wednesday') { iseWednesday = "true"; }
                    if(appointment_day === 'Thursday') { iseThursday = "true"; }
                    if(appointment_day === 'Friday') { iseFriday = "true"; }
                    if(appointment_day === 'Saturday') { iseSaturday = "true"; }

                    if (element['doctor_appointment_slots_tbls.slot_type'] === "Evening") {
                        evngslotsarray.push({slotTime : element['doctor_appointment_slots_tbls.slot_start_time']})
                    }

                    eveningSlotStatusobj = {
                        "eveningSlotStatus": "true",
                        "startTime": {
                            "slotTime": eFromTime
                        },
                        "endTime": {
                            "slotTime": eToTime
                        },
                        "repeat_days":[
                            {
                                "name": "Sunday",
                                "status": iseSunday,
                                "displayName": "S"
                            },
                            {
                                "name": "Monday",
                                "status": iseMonday,
                                "displayName": "M",
                            },
                            {
                                "name": "Tuesday",
                                "status": iseTuesday,
                                "displayName": "T",
                            },
                            {
                                "name": "Wednesday",
                                "status": iseWednesday,
                                "displayName": "W",
                            },
                            {
                                "name": "Thursday",
                                "status": iseThursday,
                                "displayName": "T"
                            },
                            {
                                "name": "Friday",
                                "status": isaFriday,
                                "displayName": "F"
                            },
                            {
                                "name": "Saturday",
                                "status": iseSaturday,
                                "displayName": "S"
                            },
                        ],
                        "repeat": isaRepeat,
                        'slots': evngslotsarray,
                    };
                }
                // else {
                //         eveningSlotStatusobj = {
                //             "eveningSlotStatus": "false",
                //             repeat_days: [''],
                //             "startTime": {
                //                 "slotTime": ''
                //             },
                //             "endTime": {
                //                 "slotTime": ''
                //             },
                //             "repeat": '',
                //             slots: evngslotsarray
                //         }
                //     }

                if(appointment_type === "Night"){

                    let nFromTime = generateSlots.convert24To12Hours(element.from_time);
                    let nToTime = generateSlots.convert24To12Hours(element.to_time);

                    if(element.is_repeat === 1)
                    { 
                        isnRepeat = "true";
                    }

                    if(appointment_day === 'Sunday') { isnSunday = "true"; }
                    if(appointment_day === 'Monday') { isnMonday = "true"; }
                    if(appointment_day ==='Tuesday') { isnTuesday = "true"; }
                    if(appointment_day === 'Wednesday') { isnWednesday = "true"; }
                    if(appointment_day === 'Thursday') { isnThursday = "true"; }
                    if(appointment_day === 'Friday') { isnFriday = "true"; }
                    if(appointment_day === 'Saturday') { isnSaturday = "true"; }

                    if (element['doctor_appointment_slots_tbls.slot_type'] === "Night") {
                        nightslotsarray.push({slotTime : element['doctor_appointment_slots_tbls.slot_start_time']})
                    }

                    nightSlotStatusobj = {
                        "nightSlotStatus": "true",
                        "startTime": {
                            "slotTime": nFromTime
                        },
                        "endTime": {
                            "slotTime": nToTime
                        },
                        "repeat_days":[
                            {
                                "name": "Sunday",
                                "status": isnSunday,
                                "displayName": "S"
                            },
                            {
                                "name": "Monday",
                                "status": isnMonday,
                                "displayName": "M",
                            },
                            {
                                "name": "Tuesday",
                                "status": isnTuesday,
                                "displayName": "T",
                            },
                            {
                                "name": "Wednesday",
                                "status": isnWednesday,
                                "displayName": "W",
                            },
                            {
                                "name": "Thursday",
                                "status": isnThursday,
                                "displayName": "T"
                            },
                            {
                                "name": "Friday",
                                "status": isnFriday,
                                "displayName": "F"
                            },
                            {
                                "name": "Saturday",
                                "status": isnSaturday,
                                "displayName": "S"
                            },
                        ],
                        "repeat": isaRepeat,
                        'slots': nightslotsarray,
                    };
                }
                // else {
                //         nightSlotStatusobj = {
                //             "nightSlotStatus": "false",
                //             repeat_days: [''],
                //             "startTime": {
                //                 "slotTime": ''
                //             },
                //             "endTime": {
                //                 "slotTime": ''
                //             },
                //             "repeat": '',
                //             slots: nightslotsarray
                //         }
                //     }
            });

            let breakTime = allRecords[0].break_time;
            let consultationDuration  = allRecords[0].consultation_duration;
            let breakMinutes = "N/A";
            let consultationMinutes = "N/A";
            let consultationHours = "N/A";
            if(breakTime){
                let breakTimeSplit = breakTime.split(":");
                breakMinutes = breakTimeSplit[1]; 
            }
            if(consultationDuration){
                let consultationDurationSplit = consultationDuration.split(":");
                consultationHours = consultationDurationSplit[0]; 
                consultationMinutes = consultationDurationSplit[1];
            }

            res.send({
                status: 200,
                error: false,
                message: "schedule Rows fetched Sucessfully..",
                doctor_id : allRecords[0].doctor_id,
                fromDate: allRecords[0].from_date,
                toDate: allRecords[0].to_date,
                module_type : allRecords[0].module_type,
                consultationDuration : allRecords[0].consultation_duration,
                durationHours : consultationHours,
                durationMinutes : consultationMinutes,
                notificationTime : allRecords[0].notification_duration,
                breakTime : allRecords[0].break_time,
                breakMinutes : breakMinutes,
                Morning : morningSlotStatusobj,
                Afternoon : afternoonSlotStatusobj,
                Evening : eveningSlotStatusobj,
                Night : nightSlotStatusobj,
            });

        }else{
            res.send({
                status: 200,
                error: false,
                message: "No Scheduled Rows found..",
            });
        }
    });
};


// Fetch Doctor Appointment Slots from admin part
exports.findOneDoctorSlots = (req, res) => {
    const doctorId = req.params.id;
    let message = "";
    let resultStatus = true;
    const module_type = "telemedicine-app";
    // SCHEDULE.hasMany(SLOTS, { foreignKey: "schedule_table_id" });
    // SLOTS.belongsTo(SCHEDULE, { foreignKey: "schedule_table_id" });
    
    let data = [];
    SCHEDULE.findAll({
        where: {
            'doctor_id': doctorId,
            'status': "Active",
            'module_type': module_type,
        },
        group: ['appointment_date'],
        raw: true,
       // include: [SLOTS]
    }).then(result => {
        let recordsCount = result.length;
        message = "Doctor Appointment days fetched Successfully";
        if (recordsCount == 0) {
            message = "No records found";
            resultStatus = false;
        }else{
          //  data = Array.prototype.map.call(result, s => s.appointment_date);
          data = result;
        }
        res.status(200).send({
            status: 200,
            error: resultStatus,
            message: message,
            data: data
        });
    });
};
// Ends here


