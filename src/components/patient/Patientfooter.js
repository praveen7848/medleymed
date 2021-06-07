import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import  Patcss from "../../public/css/patient/style_pat.css";
import  Constant from "../../constants";
//import Boot from "../../public/css/patient/bootstrap.min.css";
// import Boo from "../../public/bootstrap/css/bootstrap.min.css";
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";






export default class Patientmenu extends Component {

	constructor(props) {
        super(props);
        //const [locale, setLocale] = useState(LOCALES.ENGLISH);
        this.state = {
            Language:""
        }
  }
  
  componentDidMount = () => {
    this.state = {
        Language:localStorage.getItem('Language_selected')
    }
}
    componentDidUpdate =() =>{
        var lang=localStorage.getItem('Language_selected');
        if(lang!=null) {
            if(this.state.Language!=lang){
        this.state.Language=lang;
        console.log("notnull "+this.state.Language);
        this.forceUpdate();
            }
        //
        } else {
            this.state.Language="en-us";
        console.log(this.state.Language);
        }
    
      }
    //this.setState({"Language":localStorage.getItem('Language_selected')});
    //console.log()
   // alert(this.state.Language);
    // window.onstorage = event => { // same as window.addEventListener('storage', () => {
    //     alert("in");
    //   //  if (event.key != 'Language_selected') return;
    //     //alert(event.key + ':' + event.newValue + " at " + event.url);
    //   };
   
  
 
  render(){
   	return(
        
        <div> 
        {/* ja-jp */}
        {/* en-us */}
        {/* de-de */}
        {/* fr-ca */}
        
        <I18nPropvider locale={this.state.Language} >
       
                     <section id="footer">
                  <div class="container">
                     <div class="row">
                        <div class="col-md-12">
                           {/* <div class="col2">
                              <h2 class="footer_head">
                                 {translate('For patients')}
                              </h2>
                              <p>{translate('Search for doctors')}</p>
                              <p>{translate('Search for Clinics')}</p>
                              <p>{translate('Search for hospitals')}</p>
                              <p>{translate('Book Diagnostic Tests')}</p>
                              <p>{translate('Book Full Body Checkups')}</p>
                           </div> */}
                           <div class="col2 col-md-3">
                              <h2 class="footer_head">
                                 {translate('Our Services')}
                              </h2>
                              {/* <p>{translate('Order Medicines')}</p> */}
                              {/* <p>{translate('Book Lab Tests')}</p> */}
                              <p>{translate('Consult a Doctor')}</p>
                              {/* <p>{translate('Home Care')}</p> */}

                           </div>
                           <div class="col2 col-md-3">
                              <h2 class="footer_head">
                                 {translate('Our Policies')}
                              </h2>
                              <p>{translate('Privacy Policy')}</p>
                              <p>{translate('Terms and Conditions')}</p>
                              <p>{translate('Return Policy')}</p>

                           </div>
                           <div class="col2 col-md-3">
                              <h2 class="footer_head">
                                 {translate('Social')}
                              </h2>
                              <p><span><img src="../images/patient/img/Homepage/Footer/facebook.svg" /></span>
              <span><img src="../images/patient/img/Homepage/Footer/call.svg" /></span>
              <span><img src="../images/patient/img/Homepage/Footer/Youtube.svg" /></span>
            </p>
                              <h3>{translate('Need Help')} ?</h3>
                              <p><span><i class="fa fa-phone"></i></span>9876543210</p>
                           </div>
                           <div class="col2 col-md-3">
                              <h2 class="footer_head">
                                 {translate('Our App')}
                              </h2>
                              <p><img src="../images/patient/img/Homepage/Footer/Appstore.svg" /></p>
           <p><img src="../images/patient/img/Homepage/Footer/google_play.svg" /></p>
           
                              {/* <h3>{translate('App Store')}</h3>
                              <h3>{translate('Play Store')}</h3> */}
                           </div>
                        </div>
                     </div>
                     <hr />
                     <div class="row">
                        <div class="col-md-12">
                           <div class="footer_text">
                              <h5 >
                                 {translate('Copyright')} © 2020, {translate('Medleymed.com')}. {translate('All rights reserved')}.</h5>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
            
 </I18nPropvider> 
 {/* <div>{this.state.Language}</div> */}
</div>

			
      )
  }

}