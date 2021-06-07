import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import Patcss from "../../public/css/patient/style_pat.css";
import Constant from "../../constants";

// For Translator Starts
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientFooter from "../patient/Patientfooter";

import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css';  

export default class Homee extends Component {

   constructor(props) {
      super(props);
      this.state = {
         Language: "ENGLISH",
         specalitiesList:[],
      }
   
   }
   componentDidUpdate = () => {     
      var lang = localStorage.getItem('Language_selected');
      if (lang != null) {
           console.log(this.state.Language +"!="+ lang);
        
         if (this.state.Language != lang) {
            this.state.Language = lang;
            console.log("notnull " + this.state.Language);
            this.forceUpdate();
         } 
         
      } else {
         this.state.Language = "en-us";
         console.log(this.state.Language); 
      }
     
   }
   componentDidMount =()=>  {
      var lang = localStorage.getItem("Language_selected");

      let clinic_id=window.location.pathname.split('/');
      if(clinic_id[2]!=""){
      localStorage.setItem("clinic_id",clinic_id[2]);
      this.setState.clinicId=clinic_id[2];
     }

      if (lang != null) {
        if (this.state.Language != lang) {
          this.state.Language = lang;
          console.log("notnull " + this.state.Language);
          this.forceUpdate();
        }
        
      } else {
        this.state.Language = "en-us";
       }
      this.onLoadSpecalities();
   }
   handleLanguage=(langValue)=>{
      this.setState({Language: langValue});
   }
   onLoadSpecalities=()=>{
    
      Httpconfig.httptokenget(Constant.siteurl +"api/Category/0",)
        .then((response) => {
          if (response.data.status == "200" && response.data.error == false) {
            this.state.specalitiesList=response.data.data;
            this.forceUpdate();
           }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
   
   render() {
      return (

         <I18nPropvider locale={this.state.Language}>

            <section id=""  style={{ color: '#fff' }} >
            <PatientHeader onSelectLanguage={this.handleLanguage}/>
               
               <PatientMenu />
               <main id="main">

                  <section id="main_carousel_bar">
                     <div class="container">
                        <div class="row">
                           <div class="col-md-12"> 


                              <Carousel showThumbs={false} infiniteLoop={true}>
                                 <div class="carosel_item"><img src="../images/patient/img/Homepage/Banner.png" /></div>
                                 <div class="carosel_item"><img src="../images/patient/img/Homepage/Banner.png" /></div>
                                 <div class="carosel_item"><img src="../images/patient/img/Homepage/Banner.png" /></div>
                              </Carousel>

                           </div>
                        </div>
                     </div>
                  </section>


                  <div>  
                  <section id="consult_now">
          <div class='container' >      
          <div class="row">
        <div class="col-md-12">
        <h2 class="Consult_head">Consult Top Specialists now</h2>
      </div>
      </div> 
           </div>  
          {this.state.specalitiesList.length ?
       
       <div class='container' >   
       <div class="row">  
       <div class="col-md-12">       
        <OwlCarousel items={4}  
          className="owl-theme"  
          loop 
          nav  
          margin={8} >  
        
          
          { 
            this.state.specalitiesList.map((spe,num) => (
              <div class="consult_box">
             <img class="img" src={Constant.imgurl+spe.category_image} />
            <div class="consult_content">
            <h3>{spe.category}</h3>
          <a href="#"><h5>Consult now</h5></a>  
          </div>
					</div>
          
          ))
          }
       
      </OwlCarousel>  
      </div> 
      </div> 
      </div>
      
:""}
</section>
      </div>  

                  <section id="bottom_content">
                     <div class="container">
                        <div class="row">

                           <div class="col-md-6 col-sm-6 col-xs-12">

                              <div class="find_doc_box">
                                 <div class="row">
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                       <img src="../images/patient/img/Homepage/Find the doctor near you.png" />
                                    </div>
                                    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 find_doc_content">
                                       <div class="">
                                          <h2>{translate('Find the doctor near you')}</h2>
                                          <h5>{translate('Meet The Doctor In Clinic')}</h5>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div class="col-md-6 col-sm-6 col-xs-12">

                              <div class="online_consult_box">
                                 <div class="row">
                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                       <img src="../images/patient/img/Homepage/Video Consultation.png" />
                                    </div>
                                    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 online_content">
                                       <div class="">
                                          <h2>{translate('Find the doctor near you')}</h2>
                                          <h5>{translate('Meet The Doctor In Clinic')}</h5>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                           </div>
                        </div>
                     </div>
                  </section>

                  <section id="trend_products">
                     <div class="container">
                        <div class="row">
                           <div class="col-md-12">
                              <h2 class="trend_head">{translate('Trending Products')}</h2>
                           </div>
                        </div>
                         
        
       <div class="row">  
       <div class="col-md-12">       
        <OwlCarousel items={4}  
          className="owl-theme"  
          loop 
          nav  
          margin={8} >  
         <div class="trend_box">
            <img src="http://placehold.it/200x150" alt="" />
             <div class="trend_content">
             <h2>Dolo 120Mg</h2>
              <h5>$378</h5>
             <p> $433 12%</p>
           <a href="#" class="add_btn"><span>+</span>Add</a>
               </div>
                   </div>
                   <div class="trend_box">
            <img src="http://placehold.it/200x150" alt="" />
             <div class="trend_content">
             <h2>Dolo 120Mg</h2>
              <h5>$378</h5>
             <p> $433 12%</p>
           <a href="#" class="add_btn"><span>+</span>Add</a>
               </div>
                   </div>
                   <div class="trend_box">
            <img src="http://placehold.it/200x150" alt="" />
             <div class="trend_content">
             <h2>Dolo 120Mg</h2>
              <h5>$378</h5>
             <p> $433 12%</p>
           <a href="#" class="add_btn"><span>+</span>Add</a>
               </div>
                   </div>
                   <div class="trend_box">
            <img src="http://placehold.it/200x150" alt="" />
             <div class="trend_content">
             <h2>Dolo 120Mg</h2>
              <h5>$378</h5>
             <p> $433 12%</p>
           <a href="#" class="add_btn"><span>+</span>Add</a>
               </div>
                   </div>
                   <div class="trend_box">
            <img src="http://placehold.it/200x150" alt="" />
             <div class="trend_content">
             <h2>Dolo 120Mg</h2>
              <h5>$378</h5>
             <p> $433 12%</p>
           <a href="#" class="add_btn"><span>+</span>Add</a>
               </div>
                   </div>
                   <div class="trend_box">
            <img src="http://placehold.it/200x150" alt="" />
             <div class="trend_content">
             <h2>Dolo 120Mg</h2>
              <h5>$378</h5>
             <p> $433 12%</p>
           <a href="#" class="add_btn"><span>+</span>Add</a>
               </div>
                   </div>
                   <div class="trend_box">
            <img src="http://placehold.it/200x150" alt="" />
             <div class="trend_content">
             <h2>Dolo 120Mg</h2>
              <h5>$378</h5>
             <p> $433 12%</p>
           <a href="#" class="add_btn"><span>+</span>Add</a>
               </div>
                   </div>
                   <div class="prev2">
                                 <span><i class="fa fa-angle-left" aria-hidden="true"></i></span>
                              </div>
                              <div class="next2">
                                 <span><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                              </div>
          
          {/* { 
            this.state.specalitiesList.map((spe,num) => (
              <div class="consult_box">
             <img class="img" src={Constant.imgurl+spe.category_image} />
            <div class="consult_content">
            <h3>Cough and cold</h3>
          <a href="#"><h5>Consult now</h5></a>  
          </div>
					</div>
          
          ))
          } */}
       
      </OwlCarousel>  
      
      </div> 
      </div>
                     
                     </div>
                  </section>

                  <section id="download_app">
                     <div class="container">
                        <div class="row">
                           <div class="col-md-6">
                              <div class="download_content">
                                 <h2>{translate('Download the MedleyMed app')}</h2>
                                 <h5>{translate('Book appointments and health checkups')}; {translate('Order medicines and consult doctors online')}</h5>
                                 <p>{translate('Get the link to download the app')}</p>
                                 <div class="form-group">
                                    <div class="input-group input-group-md">
                                       <span class="input-group-addon">+91</span>
                                       <div class="icon-addon addon-md">
                                          <FormattedMessage id="Enter Mobile number">
                                             {
                                                placeholder => <input type="number" class="form-control" placeholder={placeholder} />
                                             }
                                          </FormattedMessage>
                                          <label for="email" rel="tooltip" title="email"></label>
                                       </div>
                                       <span class="input-group-btn">
                                          <button class="btn btn-default app_btn" type="button">{translate('Get App link')}</button>
                                       </span>
                                    </div>
                                 </div>
                                 <div class="play_store">
                                    <a href="#"><img src="../images/patient/img/Homepage/googlepay_d.svg" /></a>
                                    <a href="#"><img src="../images/patient/img/Homepage/Appstore_d.svg" /></a>
                                 </div>
                              </div>
                           </div>
                           <div class="col-md-6">
                              <div class="app_img">
                                 <img class="mobile_img" src="../images/patient/img/Homepage/images/Download_App.png" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>
                  <PatientFooter />
               </main>
            </section>
         </I18nPropvider>
      )
   }
}
//export default Homee;

