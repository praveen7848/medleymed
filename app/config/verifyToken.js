var jwt = require("jsonwebtoken");
const db = require("../models");
var dbConfig = require("../config/db.config");
const Users = db.users_tbl;
const moment = require("moment");
function verifyToken(req, res, next) {	
  try {
	  //console.log("------------- headers ---------", req.headers.authorization);
	
	const token =req.headers.authorization;
	 const jwttoken = jwt.verify(token, dbConfig.SECRET);	
	Users.findOne({
		where:{id: jwttoken.userID}
	}).then(function (user) {
		if (!user) {
			res.status(401).send({
				message: 'Unknown User'				
			  });
		}		
		if(jwttoken && user.token === token)
		{
		var curentdate = new Date();
		const fromDate = user.token_exptime;
		const todayDate = moment(curentdate).format("YYYY-MM-DD hh:mm:ss");		
		if (fromDate <= todayDate) {			
			res.status(200).send({
				status: 401,
				error: false, 
				token:false,        
				message: "Token is Expair! Login Again.",
							   
			  });

		}
		else{

			req.user = jwttoken;
			res.user = jwttoken;
			req.token= token;
			next();
		}
		}
		else{
			res.status(200).send({
				status: 401,
				error: false,         
				message: "Please Token is not valid! Login Again.",
			   
			  });
			// res.status(401).send({
			// 	message: "Please Token is not valid! Login Again."				
			//   });
		}
	});

  } catch (error) {	 
	res.status(401).send({
		message: "Authentication Failure !!"		
	  });
  }
}
module.exports = verifyToken;
