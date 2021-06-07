import React, { Component, useState } from "react";
import $ from "jquery";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigRetailer";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import RetailerCss from "../../public/css/retailer/retailer_style.css";

export default class RetailerSideMenu extends Component {
    constructor(props) {
      super(props);
      this.state = {
        Retailerprofile:"",
        RetailerDashboard:"",
        Retailerstock:"",
        RetailertransactionHistory:"",
        RetailerSettings:"",
      };
    }
    //Redirect to retailer profile page
    viewRetailerprofile=()=>{
        window.location.href="./Retailerprofile"

    }
    //Redirect to retailer Dashboard page
    viewRetailerDashboard=()=>{
        window.location.href="./Retailerdashboard"
    }
    //Redirect to retailer stock page
    viewStock=()=>{
        window.location.href="./Retailerstock"
    }
    //Redirect to retailer transaction history page
    viewtransactionHistory=()=>{
        window.location.href="./RetailertransactionHistory"
    }
    //Redirect to retailer settings
    viewsettings=()=>{
        window.location.href="./Retailersettings"
    }
    componentDidMount=()=>{
       let url_path=window.location.pathname;
       let pages=url_path.split("/");
       var page=pages[2];
       var obj={};
       //alert(page);
       obj[page]="active";
       this.setState({
           page:page,
       })
       //checking page rendered
       if(page=='Retailerprofile'){
           this.state.Retailerprofile="active";
       }
       if(page=='Retailerdashboard' || page=='retailerpendingorders'){
        this.state.RetailerDashboard="active";
       }
       if(page=='Retailerstock'){
        this.state.Retailerstock="active";
       }
       if(page=='RetailertransactionHistory'){
        this.state.RetailertransactionHistory="active";
       }
       if(page=='Retailersettings'){
        this.state.RetailerSettings="active";
       }   
        this.forceUpdate();
       
    }
    render() {
        return (


<div class="container-fluid">
        <div class="row">
            <nav id="side_Nav" class="col-lg-2 col-md-2">
              <ul>
                 
                {/* <a href="index.html"> */}
                    <li class={this.state.RetailerDashboard!="" ? this.state.RetailerDashboard :"" } onClick={this.viewRetailerDashboard}>
                      <img src="../images/retailer/manageOrder.svg"/>
                       <p>Manage Order</p>
                    </li>
                  {/* </a> */}
                  <li class={this.state.Retailerstock!="" ? this.state.Retailerstock :"" } onClick={this.viewStock}>
                    <img src="../images/retailer/manageStock.svg"/>
                    <p>Manage Stock</p>
                 </li>
                 <li class={this.state.RetailertransactionHistory!="" ? this.state.RetailertransactionHistory :"" } onClick={this.viewtransactionHistory}>
                    <img src="../images/retailer/transactions.svg"/>
                    <p>Transactions</p>
                 </li>
                 <li class={this.state.Retailersettings!="" ? this.state.Retailersettings :"" } onClick={this.viewsettings}>
                    <img src="../images/retailer/settings.svg"/>
                    <p>Settings</p>
                 </li>
              </ul>
            </nav>
            </div>
            </div>


        )
    }
}
