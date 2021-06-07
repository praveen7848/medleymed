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
        const lang=localStorage.getItem('Language_selected');
        this.state={
            Language:""
        }
        // if(lang!=null)
        // this.setState({"Language":lang});
        // else
        // this.setState({"Language":'en-us'});
  }
//   componentWillMount=() =>{
//     var lang=localStorage.getItem('Language_selected');
//     //alert(lang);
//    // console.log(lang);
    
//     if(lang!=null) {
//     // this.setState({"Language":lang});
//     this.state.Language=lang;
//     console.log("notnull "+this.state.Language);
//     } else {
//     //this.setState({"Language":'en-us'});
//     this.state.Language=lang;
//     console.log(this.state.Language);
//     }

//   }
  componentDidUpdate =() =>{
    var lang=localStorage.getItem('Language_selected');
    if(lang!=null) {
        if(this.state.Language!=lang){
    this.state.Language=lang;
    //console.log("notnull "+this.state.Language);
    this.forceUpdate();
        }
    //
    } else {
        this.state.Language="en-us";
    //console.log(this.state.Language);
    }

  }
//   shouldComponentUpdate =() =>{
//     var lang=localStorage.getItem('Language_selected');
//     //alert(lang);
//    // console.log(lang);
    
//     if(lang!=null) {
//     // this.setState({"Language":lang});
//     this.state.Language=lang;
//     console.log("notnull "+this.state.Language);
//     } else {
//     //this.setState({"Language":'en-us'});
//     this.state.Language=lang;
//     console.log(this.state.Language);
//     }
//   }
  componentDidMount = () => {
    var lang=localStorage.getItem('Language_selected');
    //alert(lang);
   // console.log(lang);
   let clinic_id=window.location.pathname.split('/');
  if(clinic_id[2]!=""){
   // alert(clinic_id[2]);
    //typeof(clinice_id[2])
    if(typeof clinic_id[2] != 'undefined'){
      localStorage.setItem("clinic_id",clinic_id[2]);
      this.state.clinicId=clinic_id[2];

    }else{
      this.state.clinicId=1;
    }
  
  }else{
    this.state.clinicId=1;
  }
    this.forceUpdate();
    if(lang!=null) {
    // this.setState({"Language":lang});
    this.state.Language=lang;
    //console.log("notnull "+this.state.Language);
    } else {
    //this.setState({"Language":'en-us'});
    this.state.Language=lang;
    //console.log(this.state.Language);
    }
    this.onLoadModules();
    }   

    doRedirect=(field, event) =>{
      //alert(field);
      //alert( event.target.value);
      window.location.href = "/"+field;
    }
     
    onLoadModules=()=>{
      Httpconfig.httptokenget(
        Constant.siteurl +"api/Clinic/dashboard/"+this.state.clinicId,)
        .then((response) => {
          //alert(response);
          if (response.data.status == "200" && response.data.error == false) {
            let modulesCount=Object.keys(response.data.data).length;
            let menuArray=[];
            let divDataStart="";
            let divDataEnd="";
            let modulesList="";
            let classdropdown="";
            let divsubmenu="";
            if(modulesCount>0){


               modulesList= response.data.data.map((modulesData,num)=>{ 
                 //alert("in");
               //  console.log(modulesData.master_sub_module_tbls);
                //for(let count=0;count<specalitiesCount;count++){
                  if(modulesData.master_sub_module_tbls){
                  if(Object.keys(modulesData.master_sub_module_tbls).length>0){
                   // alert("in1");
                     classdropdown="nav-link dropdown-toggle";
                     divDataStart='<div class="dropdown-menu drop_bar_menu" >';
                     divDataEnd='</div>';
                     divsubmenu='dropdown-menu drop_bar_menu';
                    // alert("no");
                     
                  }else{
                   // alert("in2");
                     classdropdown="nav-link";
                     divDataStart='';
                     divDataEnd="";
                     divsubmenu='dropdown-menu drop_bar_menu collapse-hide';
                     //alert('yes');
                    
                  }
                }else{
                  // alert("in2");
                    classdropdown="nav-link";
                    divDataStart='';
                    divDataEnd="";
                    divsubmenu='dropdown-menu drop_bar_menu collapse-hide';
                    //alert('yes1');
                 }
                  
                  return (
                    
                  <li class="nav-item dropdown">
                  <a class={classdropdown} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img class="nav_img" src={Constant.imgurl+modulesData.image_path}/>
                   {translate(modulesData.module_name)}
                  <span class="sr-only">(current)</span></a>
          
                  <div class={divsubmenu}>
                     
                     <a class=" dropdown-item " href="#" onClick={this.doRedirect.bind(this, "Patientconsultationpurpose")}>
     
                 
                   {  Object.keys(modulesData.master_sub_module_tbls).length>0 ? 
                    
                     modulesData.master_sub_module_tbls.map((subData,num)=>{
                     //  alert(subData.image_path); 
                     return(
                   
                         <div class="row drop_flex vid_consult"> 
                           <div class="col-md-2 col-sm-2 col-xs-2 no_padding"><img src={Constant.imgurl+subData.image_path}/></div>
                           <div class="col-md-7 col-sm-7 col-xs-7 no_padding">
                             <h4>{translate(subData.sub_module_name)}</h4>
                             <h6>{translate(subData.tag_line)}</h6>
                           </div>
                           <div class="col-md-3 col-sm-3 col-xs-3 no_padding">
                           <img class="selection_img" src="../images/patient/img/Homepage/Selection.svg" /></div>
                         </div>
                     

                    )
                     
                  }) 
                   : ""
                  } 
                   </a>
                  </div>
                 
                  {/* </div> */}
                  </li>
                  
                  )
 
                })

        this.state.modulesList=modulesList;
        this.forceUpdate();
       //5u  alert(menuArray);
       // console.log(this.state.modulesList);
       
          } 
        }
      
      
      })
  }
  

    

    
  
 
  render(){
    //  alert(this.state); 
     // console.log(this.state);
   	return(

        
        <div > 
        {/* ja-jp */}
        {/* en-us */}
        {/* de-de */}
        {/* fr-ca */}  
        
        <I18nPropvider locale={this.state.Language} >
       
        {/* <section id="login-page"> */}
        <nav class="navbar navbar-expand-md navbar-dark nav_second_bar" style={{position:"absolute"}}>
               {/* <!-- One of the primary actions on mobile is to call a business - This displays a phone button on mobile only --> */}
               <div class="navbar-toggler-right">
                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                     <span class="navbar-toggler-icon"></span>
                  </button>
               </div>


               <div class="collapse navbar-collapse flex-column " id="navbar">

                  <ul class="navbar-nav  justify-content-center px-3">
                  
 {this.state.modulesList}
                   {/* <li class="nav-item dropdown active">
                        <a class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img class="nav_img" src="../images/patient/img/Homepage/Consult a Doctor.png" /> {translate('Consult a Doctor')} <span class="sr-only">(current)</span>
                        </a>

                        <div class="dropdown-menu drop_bar_menu" >
                        <a class="dropdown-item" href="#" onClick={this.doRedirect.bind(this, "Patientconsultationpurpose")}>
            <div class="row drop_flex vid_consult"> 
              <div class="col-md-2 col-sm-2 col-xs-2 no_padding"><img src="../images/patient/img/Homepage/Instant OnlineConsultation.png "/></div>
              <div class="col-md-7 col-sm-7 col-xs-7 no_padding">
                <h4>{translate('Video consultation')}</h4>
                <h6>{translate('Video consultation over app')}</h6>
              </div>
              <div class="col-md-3 col-sm-3 col-xs-3 no_padding"><img class="selection_img" src="../images/patient/img/Homepage/Selection.svg" /></div>
            </div>
          </a>
          <a class="dropdown-item" href="#" onClick={this.doRedirect.bind(this, "Patientconsultationpurpose")}>
            <div class="row drop_flex person_consult">
              <div class="col-md-2 col-sm-2 col-xs-2 no_padding"><img src="../images/patient/img/Homepage/In person visit.png"/></div>
              <div class="col-md-7 col-sm-7 col-xs-7 no_padding">
                <h4>{translate('In person visit')}</h4>
                <h6>{translate('Meet The Doctor In Clinic')}</h6>
              </div>
              <div class="col-md-3 col-sm-3 col-xs-3 no_padding"><img class="selection_img" src="../images/patient/img/Homepage/Selection.svg" /></div>
            </div>
          </a>

                        </div>
                     </li>
                     <li class="nav-item dropdown">
                        <a class="nav-link" href="#"><img class="nav_img"src="../images/patient/img/Homepage/Order_Medicine.png" />{translate('Order Medicine')}</a>
                     </li>

                     <li class="nav-item dropdown">
                        <a class="nav-link" href="#">
                        <img class="nav_img" src="../images/patient/img/Homepage/Book_for_Diagnostic.png" /> {translate('Book For Diagnostic')}
                        </a>

                     </li>
                     <li class="nav-item dropdown  nav_care">
                        <a class="nav-link" href="#">
                        <img class="nav_img" src="../images/patient/img/Homepage/Care_at_Home.png" />  {translate('Care at Home')}
                        </a>

                     </li> */}
                     
                  </ul>



               </div>

            </nav>
}
 </I18nPropvider>
 {/* <div>{this.state.Language}</div> */}
</div>

			
      )
  }

}