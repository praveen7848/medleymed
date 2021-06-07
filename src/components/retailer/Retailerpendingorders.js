import React, { Component, useState } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigRetailer';
import Constant from '../../constants';
// import { Link } from "react-router-dom";
import RetailerCss from "../../public/css/retailer/retailer_style.css";
import RetailerHeader from "../retailer/RetailerHeader";
import RetailerSideMenu from "../retailer/RetailerSideMenu";
import Footer from "../patient/Patientfooter";


export default class Retailerpendingorders extends Component {
   constructor(props) {
      super(props);
      this.state={
        currentHome:"nav-item nav-link active",
        deliverHome:"nav-item nav-link",
        cancelHome:"nav-item nav-link",
        currentHomePanel:"tab-pane fade show active",
        deliverHomePanel:"tab-pane fade",
        cancelHomePanel:"tab-pane fade",
      }
    
    
   }
   // To get detais after first render
   componentDidMount = () => {
     // this.fetchpagesdata()
   }
back=()=>{
    this.props.history.push("./Retailerdashboard");
}
handleClick=(event)=>{
    let id=event.currentTarget.id;
    this.state.currentHome="nav-item nav-link";
    this.state.deliverHome="nav-item nav-link";
    this.state.cancelHome="nav-item nav-link";
    this.state.currentHomePanel="tab-pane fade";
    this.state.deliverHomePanel="tab-pane fade";
    this.state.cancelHomePanel="tab-pane fade";

    if(id=='current_home-tab'){
        this.state.currentHome="nav-item nav-link active";
        this.state.currentHomePanel="tab-pane fade show active";
    }
    if(id=='deliver_home-tab'){
        this.state.deliverHome="nav-item nav-link active";
        this.state.deliverHomePanel="tab-pane fade show active";
    }
    if(id=='cancel_home-tab'){
        this.state.cancelHome="nav-item nav-link active";
        this.state.cancelHomePanel="tab-pane fade show active";
    }
    
    this.forceUpdate();
}
   

   render() {
      
      return (
        <main id="main">
                  <RetailerHeader />
                  <RetailerSideMenu/>
                  
                  <section id="Pharmacy_dashboard">
                  <div class="container-fluid">
        <div class="row">
                  <div  class="col-lg-10 col-md-10 Pharma_Content">
                <section id="pharm_tabs" class="pharmacy-tab">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                        <a  onClick={this.back}> <h2 class="order_back"><img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>Back to Order's List</h2></a>  
                                </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <nav class="p_nav">

                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class={this.state.currentHome} id="current_home-tab" data-toggle="tab" href="#current_home" role="tab" aria-controls="current-home" aria-selected="true" onClick={this.handleClick}>Current<h6>(Pending)</h6><p>6</p></a>
                                        <a class={this.state.deliverHome} id="deliver_home-tab" data-toggle="tab" href="#deliver_home" role="tab" aria-controls="deliver_home" aria-selected="false" onClick={this.handleClick}>Delivered<h6>(delivered 90%)</h6><p>6</p></a>
                                        <a class={this.state.cancelHome} id="cancel_home-tab" data-toggle="tab" href="#cancel_home" role="tab" aria-controls="cancel_home" aria-selected="false" onClick={this.handleClick}>Cancelled <p>35</p></a>
                                    </div>
                                </nav>
                                <div class="tab-content" id="nav-tabContent">
                                    <div class={this.state.currentHomePanel} id="current_home" role="tabpanel" aria-labelledby="current_home-tab">
                                       <div class="row">
                                           <div class="col-md-8">
                                            <div class="tableFixHead_Order">
                                                <table>
                                                    <thead class="order_table">
                                                        <tr>
                                                            <th>John <h6> 9876543210</h6></th>
                                                            <th>Order ID: <span>00584524</span></th>
                                                            <th>Items :<span>8</span></th>
                                                            <th>Price: <span>₹ 890</span></th>
                                                           
                                                           
                                                        </tr>
                                                    </thead>
                                                    <thead class="order_second_table">
                                                        <tr>
                                                            <th class="check_bar">+ Shortage</th>
                                                            <th>Medicine names</th>
                                                            <th></th>
                                                            <th>+ Quantity</th>
                                                          
                                                           
                                                        </tr>
                                                    </thead>
                                                  <tbody>
                                                    <tr>
                                                        <td class="check_bar"><input type="checkbox"/></td>
                                                        <td>Dolo 650 <h6> Micro Labs ltd</h6></td>
                                                        <td>₹ 890</td>
                                                        <td> 
                                                               <div class="qty ">
                                                            <span class="minus bg-dark">-</span>
                                                            <input type="number" class="count" name="qty" value="1"/>
                                                            <span class="plus bg-dark">+</span>
                                                        </div>
                                                        <h5>35 Strips Available</h5></td>
                                                        
                                                    </tr>
                                                    <tr>
                                                        <td class="check_bar"><input type="checkbox"/></td>
                                                        <td>Dolo 650 <h6> Micro Labs ltd</h6></td>
                                                        <td>₹ 890</td>
                                                        <td> 
                                                               <div class="qty ">
                                                            <span class="minus bg-dark">-</span>
                                                            <input type="number" class="count" name="qty" value="1"/>
                                                            <span class="plus bg-dark">+</span>
                                                        </div>
                                                        <h5>35 Strips Available</h5></td>
                                                        
                                                    </tr>
                                                    <tr>
                                                        <td class="check_bar"><input type="checkbox"/></td>
                                                        <td>Dolo 650 <h6> Micro Labs ltd</h6></td>
                                                        <td>₹ 890</td>
                                                        <td> 
                                                               <div class="qty ">
                                                            <span class="minus bg-dark">-</span>
                                                            <input type="number" class="count" name="qty" value="1"/>
                                                            <span class="plus bg-dark">+</span>
                                                        </div>
                                                        <h5>35 Strips Available</h5></td>
                                                        
                                                    </tr>
                                                  
                                                  </tbody>
                                                  <tfoot class="footer_order">
                                                    <tr>
                                                    <td class="rej_btn" colspan="2"> <a href="#">Reject</a> </td> 
                                                  <td class="app_btn" colspan="2">   <a href="#">  Approve</a> </td>
                                                    </tr>
                                                  </tfoot>
                                                </table>
                                              </div>
                                          
                                           </div>
                                            <div class="col-md-4">
                                           <div class="Prescription_bar">
                                               <div class="presc_head">
                                                   <h2>Prescription</h2>
                                               </div>
                                             <a href="#"> <p class="send_rqst_btn">Send Request</p></a> 
                                               <h6>Send a request to the customer to upload the Prescription</h6>
                                              <div class="prescription_img">
                                                <img  src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                <img  src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                              </div>
                                            </div>
                                        </div>
                                       </div>
                                       
                                    </div>
                                    <div class={this.state.deliverHomePanel} id="deliver_home" role="tabpanel" aria-labelledby="deliver_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead class="order_table">
                                                    <tr>
                                                        <th></th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                      <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>₹ 890</td>
                                                    <td class="pending_td">Delivered </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                      <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>₹ 890</td>
                                                    <td class="pending_td">Delivered </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                      <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>₹ 890</td>
                                                    <td class="pending_td">Delivered </td>
                                                    
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                    <div class={this.state.cancelHomePanel} id="cancel_home" role="tabpanel" aria-labelledby="cancel_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead class="order_table">
                                                    <tr>
                                                        <th></th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                      <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>₹ 890</td>
                                                    <td class="pending_td">Cancelled </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                      <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>₹ 890</td>
                                                    <td class="pending_td">Cancelled </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                      <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>₹ 890</td>
                                                    <td class="pending_td">Cancelled </td>
                                                    
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


             <section id="reject_reason">
                    <div class="container">
                    <div class="row">
                        <div class="col-md-8">
                                <div class="reject_back">
                                    <a href="#"> <h2 ><img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg" />Back to Order's List</h2></a>  
                                </div>
                                <div class="reject_head">
                                   <h2><img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg" /></h2>
                                </div>
                                <div class="reject_content">
                                    <div class="rej_main">
                                        <h2>Reasons For the rejection</h2>
                                        <p><input type="checkbox" class="rej_check" /> All Items out of stock</p>
                                        <p><input type="checkbox" class="rej_check" /> All Items out of stock</p>
                                        <p><input type="checkbox" class="rej_check" /> All Items out of stock</p>
                                    </div>
                            </div>
                            <div class="reject_bottom">
                                <div class="submit_btn">
                                    <button type="button">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                  </section>

            </div>
            </div>
            </div>
            </section>
            <Footer/>
            
            
         </main>
        
      )
   }
}

