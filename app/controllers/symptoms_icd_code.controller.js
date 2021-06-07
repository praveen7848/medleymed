const Sequelize = require("sequelize");
const db = require("../models");
const Symptoms = db.symptoms_icd_code;
const Symptoms_tbl = db.symptoms_tbl;
const Op = Sequelize.Op;

// Retrieve all Symptoms
exports.findAll = (req, res) => {
  Symptoms.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    order: [["description", "ASC"]],
    group: "description",
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error : false,
        message: "Symptoms Fetched Sucessfully",
        result: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Symptoms List.",
      });
    });
};

// Fetch Symptoms by Body Part
exports.byBodyPart = (req, res) => {
  const body_partName = req.body.search_data;
  const gender = req.body.gender;
  var includeObj = "";

  if (gender == "Male" || gender == "male") {
    includeObj = "m";
  } else {
    includeObj = "f";
  }

  Symptoms.findAll({
    where: {
      body_part_name: body_partName,
      sex: {
        [Op.or]: ["g", includeObj],
      },
    },
    group: "infermedica_id",
    order: [["description", "ASC"]],
    attributes: [
      "id",
      "code",
      "description",
      "infermedica_id",
      "body_part_name",
      "body_part_id",
    ],
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Symptoms ICD List Fetched Sucessfully",
        result: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Symptoms.",
      });
    });
};

// Fetch Symptoms by Name
exports.getByName = (req, res) => {
  let gender = req.body.gender;
  let search_data = req.body.search_data;
  var includeObj = "";
  if (gender == "Male" || gender == "male") {
    includeObj = "m";
  } else {
    includeObj = "f";
  }

  Symptoms.findAll({
    where: {
      sex: {
        [Op.or]: ["g", includeObj],
      },
      description: {
        [Op.like]: `%` + search_data + `%`,
      },
    },
    group: "description",
    order: [["description", "ASC"]],
    attributes: [
      "id",
      "code",
      "description",
      "infermedica_id",
      "body_part_name",
      "body_part_id",
    ],
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error : false,
        message: "Symptoms By Name Details Fetched Sucessfully",
        result: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Symptoms.",
      });
    });
};




// Fetch Symptoms by Body Part
exports.getBodyPartName = (req, res) => {
  
  let data = [
    {"id" : "anus","name":"Anus","type":"G","img_path": "images/bodypart/anus.svg"},
    {"id":"back","name":"Back","type":"G","img_path": "images/bodypart/back.svg"},
    {"id":"breasts","name":"Breasts","type":"F","img_path": "images/bodypart/breasts.svg"},
    {"id":"buttocks","name":"Buttocks","type":"G","img_path": "images/bodypart/buttocks.svg"},
    {"id":"chest","name":"Chest","type":"G","img_path": "images/bodypart/chest.svg"},
    {"id":"Ears","name":"Ears","type":"G","img_path": "images/bodypart/ear.svg"},
    {"id":"elbow","name":"Elbow","type":"G","img_path": "images/bodypart/elbow.svg"},
    {"id":"Eyes","name":"Eyes","type":"G","img_path": "images/bodypart/eye.svg"},
    {"id":"foot ","name":"Foot","type":"G","img_path": "images/bodypart/foot.svg"},
    {"id":"forearm ","name":"Forearm","type":"G","img_path": "images/bodypart/forearm.svg"},
    {"id":"hand ","name":"Hand","type":"G","img_path": "images/bodypart/hand.svg"},
    {"id":"Head ","name":"Head","type":"G","img_path": "images/bodypart/head.svg"},
    {"id":"knee ","name":"Knee","type":"G","img_path": "images/bodypart/knee.svg"},
    {"id":"lower_abdomen ","name":"Lower Abdomen","type":"G","img_path": "images/bodypart/lower-abdomen.svg"},
    {"id":"lower_back ","name":"Lower Back","type":"G","img_path": "images/bodypart/lower-back.svg"},
    {"id":"lower_leg ","name":"Lower Leg","type":"G","img_path": "images/bodypart/lower-leg.svg"},
    {"id":"mid_abdomen ","name":"Mid Abdomen","type":"G","img_path": "images/bodypart/mid-abdomen.svg"},
    {"id":"nape_of_neck ","name":"Nape of Neck","type":"G","img_path": "images/bodypart/nape-of-neck.svg"},
    {"id":"neck_or_throat ","name":"Neck or Throat","type":"G","img_path": "images/bodypart/neck-or-throat.svg"},
    {"id":"Nose ","name":"Nose","type":"G","img_path": "images/bodypart/nose.svg"},
    {"id":"oral_cavity ","name":"Oral Cavity","type":"G","img_path": "images/bodypart/oral-cavity.svg"},
    {"id":"sexual_organs ","name":"Sexual Organs","type":"M","img_path": "images/bodypart/default.png"},
    {"id":"sexual_organs_f ","name":"Sexual Organs","type":"F","img_path": "images/bodypart/Sexual_Organs-female-01.svg"},
    {"id":"thigh ","name":"Thigh","type":"G","img_path": "images/bodypart/thigh.svg"},
    {"id":"upper_abdomen ","name":"Upper Abdomen","type":"G","img_path": "images/bodypart/upper-abdomen.svg"},
    {"id":"upper_arm ","name":"Upper Arm","type":"G","img_path": "images/bodypart/upper-arm.svg"},
  ];

  res.status(200).send({
    status: 200,
    error : false,
    message: "Bodypart names Fetched Sucessfully",
    result: data,
  });
  
};
