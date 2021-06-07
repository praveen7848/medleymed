const Sequelize = require('sequelize');
const db = require("../models");
const Languages = db.tbl_languages;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
const multer = require("multer");
var fs = require("fs");
// Retrieve all Languages
exports.findAll = (req, res) => { 
    Languages.findAll({})
      .then((data) => {
      
        res.send(data);

      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Languages List.",
        });
      });
  };


 

exports.findAlllanguages = (req,res) => {
  Languages.findAll({ attributes: ['id', 'name']})
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Languages List.",
    });
  });
}  

// Find a single Languages with an Name
exports.findOneByName = (req, res) => {
    const name = req.body.name;  
    // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
    Languages.findAll({ 
        where: {
            name: {
              [Op.like]: '%'+name+'%',
            }
          }
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Languages.",
        });
      });
};

// Find a single Languages with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  Languages.findAll({ 
      where: {
          id: id
        }
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Languages.",
      });
    });
};


// Create a Language Name
exports.create = (req,res)=>{
  var user_type ="Admin";

  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.name) {
    res.status(400).send({"message":"Language Name cannot be empty"})
  } else {
    
       const langVal = {
      'name' : req.body.name,
      'iso_name' : req.body.iso_name,
      'iso_val' : req.body.iso_val,
     
  }
   //var langVal = { profile_pic: imageData };
      
        Languages.create(langVal).then((data)=>{
          
      const auditTrailVal = {
          'user_id' : data.id,
          'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
          'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Language Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send(data);
  }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Patient List.",
      });
     })
    // 	/*Now do where ever you want to do*/
 

  //  base64Img.img(req.body.profile_pic, FILE_PATH, Date.now(), function(err,filepath){
  //  const pathArr = filepath.split('/');
  //  const fileName = pathArr[pathArr.length -1];
  //  var filename =   fileName.replace(/[^\d,]/g, '');
  //  var newfile = filename+'.jpeg';
  //  var pathext =filepath.split('.')
  
  //    var oldfile = filename+'.'+pathext[1];
  //    fs.renameSync("./public/uploads/patients/"+oldfile, "./public/uploads/patients/"+newfile);
  //    var imageData =  "/uploads/patients/"+filename+'.jpeg';  

  //    //var imgobjData = { profile_pic: imageData };

  //    const langVal = {
  //     'name' : req.body.name,
  //     'iso_name' : req.body.iso_name,
  //     language_pic: imageData
  // }
  // Languages.create(langVal).then((data)=>{
    
  //     const auditTrailVal = {
  //         'user_id' : data.id,
  //         'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
  //         'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Language Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
  //         'status': 1
  //       }
  //   AuditTrail.create(auditTrailVal,(err, data)=>{ });
  //     res.send(data);
  // })
  // .catch((err) => {
  //   console.log(err)
  //  res.status(500).send({ error: `${err} while creating Language Modules` });
  // });
  //  })
     
  }
};


exports.myImage = (req, res)=>
{
  console.log(req.body)
  var user_type ="Admin";
  const id = req.params.id;
  const FILE_PATH = "./public/uploads/Languages";
    const upload = multer({
      dest: `${FILE_PATH}/`,
      limits: {
        fileSize: 10 * 1024 * 1024
    },
}).single("myImage");
  
    upload(req, res, (err) => {
  if (req.file != undefined) {
      var imageData =  "/uploads/Languages/"+req.file.filename+'.jpeg';               //fs.readFileSync(req.file.path);
      if (req.file.mimetype == "image/jpg" || req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/gif") {
        var newfile = req.file.filename+'.jpeg';
      }
      var oldfile = req.file.filename;
      fs.renameSync("./public/uploads/Languages/"+oldfile, "./public/uploads/Languages/"+newfile); 
      } else {
        imageData = "";
      }
      var imgobjData = { language_pic: imageData };
      var options = { where: { id: id } };
      Languages.update(imgobjData, options).then((data) => {
     
        //users_image.create(data)
        const auditTrailVal = {
          'user_id' : id,
          'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
          'trail_message' : newfile+ ' '+  ' is Language Image is'+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
        AuditTrail.create(auditTrailVal,(err,data)=>{
             if(err){
               console.log(err)
             }else{
               console.log("created")
             }
         })
  
        return res.send(200).end();
      });
     
    });
  
  
}

// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
  var user_type= "Admin";
  const id = req.params.id;

  if(req.body.data) {
	  req.body = req.body.data;
  }
Languages.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      const auditTrailVal = {
        'user_id' : req.params.id,
        'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
        'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Language Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        'status': 1
      }
  AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "Language was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Language with id=${id}. Maybe Language was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Language with id=" + id
    });
  });
};


// Delete a Language with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;

Languages.findAll({ 
  where: {
      id: id
    }
}).then((data) => {  
 // res.send(data);
 const filepath = "./public"+data[0].language_pic;
 console.log("---", filepath)
if(data[0].language_pic !== null)
{ 
  fs.unlinkSync(filepath);
  Languages.destroy({
    where: { id: id }
  })
    .then(num => {
      
      if (num === 1) {
        
        res.send({
          message: "Language was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Language with id=${id}. Maybe language was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete language with id=" + id
      });
    }); 
}
else
{
 Languages.destroy({
  where: { id: id }
})
  .then(num => {
    
    if (num === 1) {
      
      res.send({
        message: "Language was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Language with id=${id}. Maybe language was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete language with id=" + id
    });
  });
}

 
})

};

