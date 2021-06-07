const db = require("../models");
const Category = db.category_tbl;
const AuditTrail = db.audit_trails;
const Op = db.Sequelize.Op;
const multer = require("multer");
var fs = require("fs");
const { session } = require("passport");

var encryption = require('../helpers/Encryption');

exports.create = (req,res)=>{
    if (!req.body) {
        res.status(400).send({"message":"Content cannot be empty"})
    } else if (!req.body.category_type) {
        res.status(400).send({"message":"Category Type cannot be empty"})
    } else if (!req.body.category) {
        res.status(400).send({"message":"Category cannot be empty"})
    } else {
        const categoryVal = {
            'clinic_id' : req.body.clinic_id,
            'category_type' : req.body.category_type,
            'category' : req.body.category,
          	'status': 1
        }
        Category.create(categoryVal).then((data) =>{
            
              // const auditTrailVal = {
              //   'user_id' : session.user_id,
              //   'trail_type' : "Create Category",
              //   'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Created faclity with'+id,
              //   'status': 1
              // }
              // AuditTrail.create(auditTrailVal,(data)=>{ })

              res.status(200).send({
                status: 200,
                error: false,
                message: "Category Created Successfully",
            });
          }).catch((err) => {
            res.status(500).send({ error: `${err} while creating Category` });
        });
    }
};


// Find a single Doctors with an id
exports.findOnePrimary = (req, res) => {
  const id = req.params.Id;  
  var condition = {where :{ id:id},  attributes: { exclude: ["createdAt", "updatedAt"] } }
  Category.findOne(condition)
    .then(data => {
      //res.send(data);
      res.status(200).send({
        status: 200,
        error:false,
        message: "Successfully  fetched category details",
        data:data,
    })
    .catch((err) => {
      res.status(500).send({
         message:
            err.message || "Some error occurred while retrieving category.",
      });
   });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Category with id=" + id
      });
    });
};
// Retrieve all Categories from the Categories.
exports.findAll = (req,res) => {
  
	if(req.query.category) {
		const categoryVal = encryption.encryptData(req.query.category);
		var condition = categoryVal ? { category: { [Op.like]: `%${categoryVal}%` } } : null;
	}
	if(req.query.category_type) {
		const categoryTypeVal = encryption.encryptData(req.query.category_type);
		var condition = categoryTypeVal ? { category_type: { [Op.like]: `%${categoryTypeVal}%` } } : null;
	}

  Category.findAll({ where: condition, attributes: { exclude: ["createdAt", "updatedAt"] } })
    .then(data => {
		data.sort(function(a, b) {
			var textA = a.category.toUpperCase();
			var textB = b.category.toUpperCase();
			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    res.status(200).send({
      status:200,
      error:false,
      message: "Successfully  fetched category details.",
      data:data
    });
		//res.status(200).send({message:"Successfully  fetched category details",data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    });
};


exports.findData = (req,res) => {
  if(req.query.category_type) {
		const categoryTypeVal = encryption.encryptData(req.query.category_type);
		var condition = categoryTypeVal ? { category_type: { [Op.like]: `%${categoryTypeVal}%` } } : null;
  }
  Category.findAll({ where: condition ,attributes:["id","category"] })
  .then(data => {
  data.sort(function(a, b) {
    var textA = a.category.toUpperCase();
    var textB = b.category.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  res.status(200).send({
    status:200,
    error:false,
    message: "Successfully  fetched category details.",
    data:data
  });
  //res.status(200).send({message:"Successfully  fetched category details",data});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving categories."
    });
  });
}

// Find a single Doctors with an id
exports.findOne = (req, res) => {
  const id = req.params.categoryId;
  const clinicId = req.params.clinicId;
  var condition = {where :{ id:req.params.categoryId, clinic_id:clinicId},  attributes: { exclude: ["createdAt", "updatedAt"] } }
  Category.findOne(condition)
    .then(data => {
      //res.send(data);
      res.status(200).send({
        status: 200,
        error:false,
        message: "Successfully  fetched category details",
        data:data,
    })
    .catch((err) => {
      res.status(500).send({
         message:
            err.message || "Some error occurred while retrieving category.",
      });
   });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Category with id=" + id
      });
    });
};

// Update a Category
exports.update = (req, res) => {
  const id = req.params.id;
  const clinicId = req.params.clinicId;
 
  Category.update(req.body, {
    where: { id: id, clinic_id:clinicId }
  })
    .then(num => {
      if (num[0] == 1) {
        // const auditTrailVal = {
        //   'user_id' : session.user_id,
        //   'trail_type' : "Update Category",
        //   'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Updated Category  with'+id,
        //   'status': 1
        // }
        // AuditTrail.create(auditTrailVal,(err,data)=>{ })
        res.send({
          message: "Category was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Category with id=" + id
      });
    });
};

// Delete a Category with the specified id in the req
exports.delete = (req, res) => {
  const id = req.params.id;

  Category.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        // const auditTrailVal = {
        //   'user_id' : session.user_id,
        //   'trail_type' : "Delete Category",
        //   'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Deleted Category with'+id,
        //   'status': 1
        // }
        // AuditTrail.create(auditTrailVal,(err,data)=>{ })
       
        res.send({
          message: "Category was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Category with id=" + id
      });
    });
};

// based on clinic id

exports.clinicidAll = (req,res) => {
  if(req.params.clinicId) {
		const clinicId = req.params.clinicId;
		var condition = { clinic_id:  clinicId} ;
  }
  Category.findAll({ where: condition, attributes: { exclude: ["createdAt", "updatedAt"] } })
  .then(data => {
  data.sort(function(a, b) {
    var textA = a.category.toUpperCase();
    var textB = b.category.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  res.status(200).send({
    status:200,
    error:false,
    message: "Clinic Category details fetched Successfully.",
    data:data
  });
 // res.status(200).send({message:"Successfully  fetched category details",data});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving categories."
    });
  });
}

exports.myImage = (req, res)=>
{
    var user_type ="Admin";
  const id = req.params.id;
  const FILE_PATH = "./public/uploads/Category";
    const upload = multer({
      dest: `${FILE_PATH}/`,
      limits: {
        fileSize: 10 * 1024 * 1024
    },
}).single("myImage");
  
upload(req, res, (err) => {
 
  if (req.file != undefined) {
      var imageData =  "/uploads/Category/"+req.file.filename+'.jpeg';               //fs.readFileSync(req.file.path);
      if (req.file.mimetype == "image/jpg" || req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/gif") {
        var newfile = req.file.filename+'.jpeg';
      }
      var oldfile = req.file.filename;
      fs.renameSync("./public/uploads/Category/"+oldfile, "./public/uploads/Category/"+newfile); 
      } else {
        imageData = "";
      }
      var imgobjData = { category_image: imageData, category: req.body.category };
      var options = { where: { id: id } };
      Category.update(imgobjData, options).then((data) => {
     
        //users_image.create(data)
        // const auditTrailVal = {
        //   'user_id' : id,
        //   'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
        //   'trail_message' : newfile+ ' '+  ' is Language Image is'+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //   'status': 1
        // }
        // AuditTrail.create(auditTrailVal,(err,data)=>{
        //      if(err){
        //        console.log(err)
        //      }else{
        //        console.log("created")
        //      }
        //  })
  
        return res.send(200).end();
      });
     
    });
  
  
}

exports.CreateCategory = (req, res)=>
{
    var user_type ="Admin";
  const id = req.params.id;
  const FILE_PATH = "./public/uploads/Category";
    const upload = multer({
      dest: `${FILE_PATH}/`,
      limits: {
        fileSize: 10 * 1024 * 1024
    },
}).single("myImage");
  
upload(req, res, (err) => {
 
  if (req.file != undefined) {
      var imageData =  "/uploads/Category/"+req.file.filename+'.jpeg';               //fs.readFileSync(req.file.path);
      if (req.file.mimetype == "image/jpg" || req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/gif") {
        var newfile = req.file.filename+'.jpeg';
      }
      var oldfile = req.file.filename;
      fs.renameSync("./public/uploads/Category/"+oldfile, "./public/uploads/Category/"+newfile); 
      } else {
        imageData = "";
      }
      var imgobjData = { category_image: imageData, category: req.body.category, category_type: req.body.category_type, status:1 };
      Category.create(imgobjData).then((data) => {     
        // const auditTrailVal = {
        //   'user_id' : id,
        //   'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
        //   'trail_message' : newfile+ ' '+  ' is Language Image is'+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //   'status': 1
        // }
        // AuditTrail.create(auditTrailVal,(err,data)=>{
        //      if(err){
        //        console.log(err)
        //      }else{
        //        console.log("created")
        //      }
        //  })
  
        return res.send(200).end();
      });
     
    });
  
  
}