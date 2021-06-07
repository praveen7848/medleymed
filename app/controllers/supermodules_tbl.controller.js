const Sequelize = require('sequelize');
const db = require("../models");
const Supermodules = db.supermodules_tbl;
const Op = Sequelize.Op;

// Retrieve all Super modules
exports.findAll = (req, res) => { 
    Supermodules.findAll({})
    .then((data) => {
        res.status(200).send({
            data: data,
            message: "Super modules records found",
        });
    })
    .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Super modules List.",
        });
    });
};

// Find a single Super modules with an Name
exports.findOne = (req, res) => {
    const name = req.body.name;  
    // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
    Supermodules.findAll({ 
        where: {
            name: {
                [Op.like]: '%'+name+'%',
            },
            status:true
            
           
        }
        
    })
    .then((data) => {
        res.send({
            message: "Super modules records found",
            data: data,
        });
    })
    .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Super modules.",
        });
    });
};


// Create a Super modules Name
exports.create = (req,res)=>{
   
    if (!req.body) {
        res.status(400).send({"message":"Content cannot be empty"})
    } else if (!req.body.name) {
        res.status(400).send({"message":"Super modules Name cannot be empty"})
    } else {
        const SuperVal = {
            'name' : req.body.name,
            'display_name' : req.body.display_name,
            'unique_id' : req.body.unique_id,
            'required' : req.body.required,
            'sequence' : req.body.sequence,
            'image':req.body.image,
            'description':req.body.description,
            'short_description':req.body.short_description,
            'status' : req.body.status,
            'updated_by' : req.body.updated_by
        }
        Supermodules.create(SuperVal,(err,data)=>{
            if (err) {
                console.log(err);
                res.status(500).send({"error":`${err} while creating Super modules Name`})
            }
        })
        res.status(200).send({
            "message": "Super modules Created Successfully"
        });
    }
};


// Update a Super modules by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    
    if(req.body.data) {
        req.body = req.body.data;
    }
    Supermodules.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Super modules was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Super modules with id=${id}. Maybe Super modules was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Super modules with id=" + id
        });
    });
};


// Delete a Super modules with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Supermodules.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Super modules was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Super modules with id=${id}. Maybe Super modules was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Super modules with id=" + id
        });
    });
};
// Retrieve all Super Module Count
exports.getModuleCount = (req, res) => {
    Supermodules.findAll({})
    .then(function (data) {
        var activeData = data.filter(function(o) { return o.status == 1 }).length
        res.send({ totalData: data.length, activeData: activeData });
    })
    .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving " + user_type,
        });
    });
};
