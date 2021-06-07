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






export default class home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			controller_count: 0,
			controller_total: 0,
			module_count: 0,
      module_total: 0,
      fields: {},
      errors: {},
      languages_data: '',
    };
  }
  

  handleLangChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  // To get detais after first render
  componentDidMount = () => {
    this.fetchlanguagesdata()
  }

  fetchlanguagesdata() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Languages/").then((response) => {
      this.setState({
        languages_data: response.data
      })
     
    }).catch((error) => {
      console.log(error);
    });
  }



  render(){
	//const { controller_count, controller_total, module_count, module_total, pages } = this.state;
	const { languages_data } = this.state;
	return(
        <section id="" class="content_wrapper" style={{color:'#fff'}} >
        <header id="header" class="fixed-top">
    <div class="container">
        <div class="logo float-left">
            
            <a href="index.html" class="scrollto"><img src="./images/patient/img/logo.png" alt="" class="img-fluid" /></a>
        </div>
        <nav class="main-nav float-right d-none d-lg-block">
            
            <ul class="second_menu">
              
                <li ><a href="#">
               <select class="form-control lang-control">
               <option>Language</option>
                    <option>Telugu</option>
              <option>Hindi</option>
                  <option>English</option>
               </select>

{/* Working Functionality Starts */}
{/* <select name="language_id" className="form-control" value={this.state.fields["id"] || ""}  onChange={this.handleLangChange.bind(this,"id" )} >
                    <option value="">Select</option>
                    {languages_data && languages_data.map((languages_data, i) => {
                        return (
                          <option value={languages_data.id}> {languages_data.name} </option>
                        );
                      })}
                  </select> */}
{/* Ends */}
                  

                </a></li>
                <li><a href="#" class="login_btn">Login</a></li>
               </ul>
                
            </nav>
        {/* <!-- .main-nav --> */}
    </div>
</header>
<div></div>
<nav class="navbar navbar-expand-md navbar-dark nav_second_bar">
  {/* <!-- One of the primary actions on mobile is to call a business - This displays a phone button on mobile only --> */}
  <div class="navbar-toggler-right">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
  </div>




  <div class="collapse navbar-collapse flex-column " id="navbar">

    <ul class="navbar-nav  justify-content-center px-3">
      
      <li class="nav-item dropdown active">
        <a class="nav-link dropdown-toggle"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Consult a Doctor <span class="sr-only">(current)</span>
        </a>
        <div class="dropdown-menu" >
          <a class="dropdown-item" href=""><p><strong>Video Consultation</strong></p><p>Video Consultaion over the app</p></a>
          <a class="dropdown-item" href="#"><p><strong>In person Visit</strong></p><p>Meet the doctor in Clinic</p></a>
          {/* <a class="dropdown-item" href="#">Something else here</a> */}
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Order Medicine</a>
      </li>
     
      <li class="nav-item dropdown">
        <a class="nav-link" href="#">
       Book For Diagnostic
        </a>
        
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link" href="#">
         Care at Home
        </a>
       
      </li>
    </ul>



  </div>

</nav>
<main id="main">
 
  <section id="main_carousel_bar">
  <div class="container">
<div class="row">
<div class="col-md-12">


  <Carousel showThumbs={false} infiniteLoop={true}>
        <div class="carosel_item"><img src ="../images/patient/img/Homepage/Banner.png"/>this is slide 1</div>
        <div class="carosel_item">this is slide 2</div>
        <div class="carosel_item">this is slide 3</div>
      </Carousel>

</div>
</div>
  </div>
  </section>
 
<section id="consult_now">
<div class="container">
  <div class="row">
  <div class="col-md-12">
  <h2 class="Consult_head">Consult Top Specialists now</h2>
</div>
</div>
    <div class="row">
      <div class="col-md-12 heroSlider-fixed">
        <div class="overlay">
      </div>
         {/* <!-- Slider --> */}
        <div class="slider responsive">
          <div class="consult_box">
            <img src="" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
          <a href="#"><h5>Consult now</h5></a>  
          </div>
					</div>
          <div class="consult_box">
            <img src="http://placehold.it/200x150" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
            <a href="#"><h5>Consult now</h5></a>  
          </div>
					</div>
          <div class="consult_box">
            <img src="http://placehold.it/200x150" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
            <a href="#"><h5>Consult now</h5></a>  
          </div>
					</div>
          <div class="consult_box">
            <img src="http://placehold.it/200x150" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
            <a href="#"><h5>Consult now</h5></a>  
          </div>
					</div>
          <div class="consult_box">
            <img src="http://placehold.it/200x150" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
            <a href="#"><h5>Consult now</h5></a>  
          </div>
          </div>
          
          <div class="consult_box">
            <img src="http://placehold.it/200x150" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
            <a href="#"><h5>Consult now</h5></a>  
          </div>
          </div>
          
          <div class="consult_box">
            <img src="http://placehold.it/200x150" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
            <a href="#"><h5>Consult now</h5></a>  
          </div>
          </div>
          
          <div class="consult_box">
            <img src="http://placehold.it/200x150" alt="" />
            <div class="consult_content">
            <h3>Cough and cold</h3>
            <a href="#"><h5>Consult now</h5></a>  
          </div>
					</div>
        </div>
				 {/* <!-- control arrows --> */}
         <div class="prev">
          <span><i class="fa fa-angle-left" aria-hidden="true"></i></span>
         </div>
         <div class="next">
           <span><i class="fa fa-angle-right" aria-hidden="true"></i></span>
         </div>
				
      </div>
    </div>
  </div>
</section>



<section id="best_doc">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
      <h2 class="doc_head">Best Doctors from your nearest clinic</h2>
    </div>
    </div>
      <div class="row">
        <div class="col-md-12 heroSlider-fixed">
          <div class="overlay">
        </div>
           {/* <!-- Slider --> */}
          <div class="slider responsive1">
             <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
            <div class="doc_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="doc_content">
                <h3>Jaya Clinic</h3>
                <p>Madhapur</p>
                <div class="row col-md-12 doc_spec">
             
                  <div class="col-md-6 no_padding">
                  <div class="rating">
                  <p><span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                  <span><i class="fa fa-star"></i></span></p>
                
                  </div>
                  </div>
                  <div class="col-md-6 no_padding">
                  <div class="direction">
                 <h5>Directions</h5>
                 </div>
                  </div>
                </div>
              </div>
              
              <div class="doc_second_content">
                <h2>6 Doctors</h2>
                <p>Cardiologist, ENT</p>
              </div>
            </div>
          </div>
           {/* <!-- control arrows --> */}
           <div class="prev1">
            <span><i class="fa fa-angle-left" aria-hidden="true"></i></span>
           </div>
           <div class="next1">
             <span><i class="fa fa-angle-right" aria-hidden="true"></i></span>
           </div>
          
        </div>
      </div>
    </div>
  </section>



  <section id="trend_products">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
      <h2 class="trend_head">Trending Products</h2>
    </div>
    </div>
      <div class="row">
        <div class="col-md-12 heroSlider-fixed">
          <div class="overlay">
        </div>
           {/* <!-- Slider --> */}
          <div class="slider responsive2">
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
            <div class="trend_box">
              <img src="http://placehold.it/200x150" alt="" />
              <div class="trend_content">
                <h2>Dolo 120Mg</h2>
                <h5>$378</h5>
                <p>MRP $433 12% off</p>
                <a href="#" class="add_btn"><span>+</span>Add</a>
              </div>
            </div>
          </div>
           {/* <!-- control arrows --> */}
          <div class="prev2">
           <span><i class="fa fa-angle-left" aria-hidden="true"></i></span>
          </div>
          <div class="next2">
            <span><i class="fa fa-angle-right" aria-hidden="true"></i></span>
          </div>
          
        </div>
      </div>
    </div>
  </section>
  
  <section id="download_app">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="download_content">
          <h2>Download the MedleyMed app</h2>
          <h5>Book appointments and health checkups; Order medicines and consult doctors online</h5>
      <p>Get the link to download the app</p>
      <div class="form-group">
        <div class="input-group input-group-md">
            <span class="input-group-addon">+91</span>
            <div class="icon-addon addon-md">
                <input type="number"  class="form-control" placeholder="Enter Mobile number" />
                <label for="email" rel="tooltip" title="email"></label>
            </div>
            <span class="input-group-btn">
                <button class="btn btn-default app_btn" type="button">Get App link</button>
            </span>
        </div>
    </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="app_img">
        <img src="./images/patient/img/1.png" />
        </div>
      </div>
      </div>
    </div>
  </section>

  <section id="footers">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="col2">
            <h2 class="footer_head">
              For patients
            </h2>
            <p>Search for doctors</p>
            <p>Search for Clinics</p>
            <p>Search for hospitals</p>
            <p>Book Diagnostic Tests</p>
            <p>Book Full Body Checkups</p>
          </div>
          <div class="col2">
            <h2 class="footer_head">
              Our Services
            </h2>
            <p>Order Medicines</p>
            <p>Book Lab Tests</p>
            <p>Consult a Doctor</p>
            <p>Home Care</p>
            
          </div>
          <div class="col2">
            <h2 class="footer_head">
             Our Policies
            </h2>
            <p>Privacy Policy</p>
            <p>Terms and Conditions</p>
            <p>Return Policy</p>
           
          </div>
          <div class="col2">
            <h2 class="footer_head">
             Social
            </h2>
            <p><span><i class="fa fa-facebook"></i></span>
              <span><i class="fa fa-twitter"></i></span>
              <span><i class="fa fa-youtube"></i></span>
            </p>
            <h3>Need Help ?</h3>
              <p><span><i class="fa fa-phone"></i></span>9876543210</p>
          </div>
          <div class="col2">
            <h2 class="footer_head">
             Our App
            </h2>
            <h3>App Store</h3>
            <h3>Play Store</h3>
          </div>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-md-12">
          <div class="footer_text">
          <h5 >
            Copyright © 2020, MedleyMed. All rights reserved.
          </h5>
        </div>
        </div>
      </div>
    </div>
  </section>
</main>
</section>
			
      )
  }

}