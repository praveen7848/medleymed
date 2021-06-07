import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigRetailer";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import RetailerCss from "../../public/css/retailer/retailer_style.css";
import Dialog from 'react-bootstrap-dialog';

const moment = require("moment");



export default class RetailerHeader extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        errors: {},
        files: [],
        activeNotificationsCount:0,
        notifyid:"",

        
      };
      
    } 
    //show logout button
    showLogout=()=>{
      document.getElementById("myDropdown").classList.toggle("show");
    }
    //logout from the retailer 
    logout=()=>{
      
      var retrievedObject=localStorage.removeItem('retuserObj');
      var retrievedObjectToken=localStorage.removeItem('token');
          window.location.href="./login";
      
    }
    componentDidMount=()=>{

        var retrievedObject=localStorage.getItem('retuserObj');
        if(retrievedObject==null){
            window.location.href="./login";
        }
        let userData=JSON.parse(retrievedObject)
        
        this.setState({
            retailerId: userData.retailer_id,
            storeName: userData.name,
            date:moment().format('Do MMMM , YYYY')
        })
        //alert(userData.retailer_id);
        if(userData.retailer_id!=""){
            this.validateToken();
        }
        
    }

    logout = () => {

        var retrievedObject=localStorage.getItem('retuserObj');
            if(retrievedObject==null){
                window.location.href="./login";
            }
            let userData=JSON.parse(retrievedObject);
    
          let retailerId=userData.userID;
          Httpconfig.httptokenget(Constant.siteurl +"api/Users/logout/"+retailerId,)
          .then((response) => {
    
        localStorage.removeItem("retuserObj");
        localStorage.removeItem('retailerToken');
        
        setTimeout(
           () => window.location.reload(),
           1000
        );
      })
      .catch((error) => {
        toast.error(error);
      });
     }


    
 validateToken=()=>{
    var retrievedObject=localStorage.getItem('retuserObj');
    
    if(retrievedObject==null){
        window.location.href="./login";
    }
    let userData=JSON.parse(retrievedObject);
    let userId=userData.userID;
    if(localStorage.getItem("retailerToken")){
      let token=JSON.parse(localStorage.getItem("retailerToken"));
    
      Httpconfig.httptokenpost(Constant.siteurl +"api/Users/checkToken",{
        userid:userId,
        token:token,
        
      })
        .then((response) => {
          if(response.data.status=="200" && response.data.error===true){
            localStorage.removeItem("retuserObj");
            localStorage.removeItem('retailerToken');
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
      localStorage.removeItem("retuserObj");
      localStorage.removeItem('retailerToken');
      setTimeout(
        () => window.location.reload(),
        1000
     );
    }  
   }
  
    render() {
        return (
            <main id="main">
             <header id="header" class="fixed-top">
        <div class="container-fluid">
            <div class="logo float-left logo_sec">
                
                <a href="index.html" class="scrollto"><img src="../images/patient/img/logo.svg" alt="" class="img-fluid"/></a>
                <p class="logo_txt">{this.state.storeName}</p>
            </div>   
            <nav class="main-nav float-right d-none d-lg-block">
                
                <ul class="second_menu">
                {/* Mon 13 Dec, 2020 */}
                    <li >{this.state.date} </li>
                   <li >
                    <div class="pro_dropdown">
                      <div class="dropdown">
                    <button onClick={this.showLogout} class="dropbtn"><img class="user_img" src="../images/retailer/profile_avaatar.svg"/> {this.state.storeName} <img class="drop_img" src="../images/retailer/arrow-dropdown.svg"/></button>
                    <div id="myDropdown" class="dropdown-content">
                      <a href="#" onClick={this.logout}>Logout</a>
                   
                    </div>
                </div>
                  </div></li>
                  </ul>
    
                </nav>
            
        </div>
    </header>

<ToastContainer />

       
  </main>

        );
    }
}