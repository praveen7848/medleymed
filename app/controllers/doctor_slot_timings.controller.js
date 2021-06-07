const Sequelize = require('sequelize');
const db = require("../models");
const defaultSlots = db.doctor_slot_timings_tbl;
// const Op = db.Sequelize.Op;
const moment = require('moment');
var encryption = require('../helpers/Encryption');
var generateSlots = require('../helpers/Slots');


exports.create = (request, response) => {

    if (!request.body) {
        response.status(400).send({ "message": "Content cannot be empty" })
    } else if (!request.body.slot_duration) {
        response.status(400).send({ "message": "Default Slot Duration cannot be empty" })
    } else if (request.body.slot_duration > 60) {
        response.status(400).send({ "message": "Default Slot Duration cannot be Greater than 60 Minutes" })
    } else {

        const slot_duration = request.body.slot_duration;
        const timeSlots = generateSlots.slotTimings("01:00 AM", "11:59 PM", slot_duration);

        timeSlots.forEach(function (arrayItem) {
            var startTime = arrayItem.startTime;
            const checkSlotType = generateSlots.slotType(startTime);
            arrayItem['id'] = "";
            arrayItem['slot_type'] = checkSlotType;
            arrayItem['from_time'] = startTime;
            arrayItem['duration'] = slot_duration;
            arrayItem['is_active'] = "1";
            delete arrayItem['startTime'];
        });

        defaultSlots.destroy({
            where: {},
            truncate: true
        }).then(() => {
            return defaultSlots.bulkCreate(timeSlots)
        }).then(() => {
            response.send({
                status: 200,
                error: false,
                message: "Default Settings was updated successfully."
            });
        });
    }
};
