import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import moment from 'moment-timezone';
import Admincss from "../../public/css/admin/css/admin.css";
import Httpconfig from "../helpers/HttpconfigAdmin";
import { ToastContainer } from "react-toastify";
import Constant from "../../constants";
import toast from "../../helpers/toast";



export default class Header extends Component {
  
  constructor(props){
    super(props);
    this.state = {
           validated : false
    }
   
     
  }

  today = moment();
  
  openNav = () => {
    
    if (document.getElementById("mySidenav") ) {
      document.getElementById("mySidenav").style.width = "250px";
      
    }
  };
  logouts =(e) =>{   
    var retrievedObject=localStorage.getItem('AdminUserObj');
    if(retrievedObject==null){
      window.location.href="/admin/login";
  }
  let userData=JSON.parse(retrievedObject);

let userID=userData.userID;
    Httpconfig.httptokenget(Constant.siteurl +"api/Users/logout/"+userID,)
    .then((response) => {
      if(response.data.status=="200" && response.data.error===false){
        localStorage.removeItem("AdminUserObj");
        localStorage.removeItem('AdminToken');
        localStorage.setItem('validated',false);
        toast.success(response.data.message);
        setTimeout(
          () => window.location.reload(),
          1000
       );
      }
      
    })
    .catch((error) => {
      toast.error(error);
    });
    // localStorage.setItem('validated',false);
    // window.history.pushState("","","/");
    // window.location.reload();
    
  }

  componentDidMount=()=>{
    var retrievedObject=localStorage.getItem('AdminUserObj'); 
    //alert(retrievedObject)
    if(retrievedObject==null){
         window.location.href="/admin/login";
     }
     let userData=JSON.parse(retrievedObject) 
     this.validateToken();
  }
  
  logout = () => {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }
  }
  validateToken=()=>{
    
    var retrievedObject=localStorage.getItem('AdminUserObj');
    
    if(retrievedObject==null){
        window.location.href="/admin/login";
    }
    
    let userData=JSON.parse(retrievedObject);
    let userId=userData.userID;
    if(retrievedObject!=""){
      
      let token=localStorage.getItem("AdminToken");
     // alert(token);return;
    if(token!=""){
      Httpconfig.httptokenpost(Constant.siteurl +"api/Users/checkToken",{
        userid:userId,
        token:token,
        
      })
        .then((response) => {
          if(response.data.status=="200" && response.data.error===true){
            localStorage.removeItem("AdminUserObj");
            localStorage.removeItem('AdminToken');
            setTimeout(
              () => window.location.reload(),
              1000
           );
          }
        })
        .catch((error) => {
          toast.error(error);
        });
      }else{
        toast.error("Your Session has timed out.Please Relogin");
        localStorage.removeItem("AdminUserObj");
        localStorage.removeItem('AdminToken');
        setTimeout(
          () => window.location.reload(),
          1000
       );
      }
  
    }else{
     // alert("in1");return;
      toast.error("Your Session has timed out.Please Relogin");
      localStorage.removeItem("AdminUserObj");
      localStorage.removeItem('AdminToken');
      setTimeout(
        () => window.location.reload(),
        1000
     );
    } 
  } 
   
  render(){
    return (
		<nav className="navbar navbar-default navbar-fixed-top nav-head">
			<div className="container-fluid">
			<div className="navbar-header">
			<a href="/Dashboard"><h2>MedleyMed</h2></a>
			<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
				<span className="sr-only">Toggle navigation</span>
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
			</button>

			<a className="navbar-brand" href="#">
				<i className="fa fa-bars" onClick={this.openNav}></i>
			</a>

			</div>
			{/* <div id="navbar" className="navbar-collapse"> */}
			<ul className="nav navbar-nav navbar-right">
   		<li>
			<a className="dropdown-btn side_txt" onClick={this.logout}>
			<img src="/img/profile.png" className="user-image" alt="User Image"/>Admin <span className="caret"></span></a>
			<div className="dropdown-container drp_content">
			<a href="#" onClick={this.logouts}>Logout</a>
			</div>
			</li>
			</ul>
			</div>
      {/* </div> */}
      <ToastContainer />
		</nav>
    
    )
  }
}