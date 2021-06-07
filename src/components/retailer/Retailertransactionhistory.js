import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigRetailer";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import RetailerCss from "../../public/css/retailer/retailer_style.css";
import RetailerHeader from "../retailer/RetailerHeader";
import RetailerSideMenu from "../retailer/RetailerSideMenu";
import Footer from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";
const moment = require("moment");

export default class Retailertransactionhistory extends Component {
    constructor(props) {
       super(props);
       this.state={
         fields: {}, 
         errors: {},
         startDate:"",
         endDate:"",
       }
    } 
    
    componentDidMount = () => {
        let userData=reactLocalStorage.getObject("retuserObj");
        if(userData){
            if(userData!=""){
                this.setState({
                   retailerId:userData.retailer_id,
                   retailerCurrency:userData.currency,
                }); 
                this.forceUpdate();
            }
            } else{
                window.location.href = "/login";
            }
          this.retailerOrderDetails(userData.retailer_id,"0");
          //this.getAllDashboardDetails(userData.retailer_id);
       }


// order details list

retailerOrderDetails=(retailerId,status)=>{
    let startDate="";
    let endDate="";
    let finalorderarray=[];
    let totalCost=0;

    startDate=this.state.startDate;
    endDate=this.state.endDate;

        Httpconfig.httptokenpost(Constant.siteurl + "api/OM/orderProcess/retailerOrdersSearch",
        {"retailer_id":retailerId,"start_date":startDate,"end_date":endDate,"status":status}
    )
           .then((response) => { 
             if(response.data.status=200){
                    if(Object.keys(response.data.data).length>0){
                        
                        
                        const retailerFinalOrderMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                            totalCost=parseInt(totalCost)+parseInt(finalLoadedData.payable_amount);
                            
                            return(
                                <tr>
                                <td>{num+1}</td>
                                  <td>{finalLoadedData.patient_tbl.name.charAt(0).toUpperCase() +finalLoadedData.patient_tbl.name.slice(1)} <h6>{finalLoadedData.patient_tbl.phone_number}</h6></td>
                                  <td>{finalLoadedData.id}</td>
                                  <td>{finalLoadedData.order_date}</td>
                                  
                                  <td class="presc_field">
                                    {finalLoadedData.cart_prescriptions_tbl  ? 

                                        finalLoadedData.cart_prescriptions_tbl.medical_document.map((presImages, num) => {
                                        return(
                                        <a  href={presImages ?  Constant.imgurl+presImages: ""} target="_blank"> 
                                        <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                        </a>
                                        )
                                    })  
                                    : "--"}
                                      {/* <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" target="_blank" /> */}
                                    {/* <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  target="_blank" /> */}
                                </td>
                                  <td>
                                      {Object.keys(finalLoadedData.order_processing_tbls).length}
                                  {/* {finalLoadedData.TotalOnlineSale} */}
                                  </td>
                                 
                                  <td>{this.state.retailerCurrency} {parseInt(finalLoadedData.payable_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                                     
                                  </td>
                                  <td>{finalLoadedData.total_paid!=null ? this.state.retailerCurrency: ""} {finalLoadedData.total_paid!=null ? parseInt(finalLoadedData.total_paid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') :"--"}
                                     
                                  </td>
                                  <td>
                                  <img class="inv_img" src="../images/retailer/Invoice.svg"  />
                                 
                              </td>
                                    
                                 
                                 
                              </tr>
                            )
                        })
                        this.state.retailerFinalOrderMedicineDetailsView=retailerFinalOrderMedicineDetailsView;
                        this.state.finalorderarray=finalorderarray;
                        this.state.totalCost=totalCost;
                        
                    }else{
                        this.state.retailerFinalOrderMedicineDetailsView="";

                    }
                    this.forceUpdate();
             }
            })
           .catch((error) => {
              toast.error(error);
           });
    
    
    }

    //start date selection

    startDate=(event)=>{
        let startDate=event.target.value;
        this.state.startDate=moment(startDate).format("YYYY-MM-DD");;
        this.forceUpdate();
        }
        
        //  end date selection
        endDate=(event)=>{
            let endDate=event.target.value;
            this.state.endDate=moment(endDate).format("YYYY-MM-DD");
            this.forceUpdate();
        }

        showOrderbyDates=()=>{
            let start_date=$('#start_date').val();
            let end_date=$('#end_date').val();
        
            if(start_date!="" && end_date!=""){
                this.retailerOrderDetails(this.state.retailerId,0);
            }else{

             toast.error("Please select dates");
            }
           
        
        } 
        



render() {
      
    return (
        <main id="main">
        <RetailerHeader />
        <RetailerSideMenu/>
        <section id="Pharmacy_dashboard">
        <div  class="col-lg-10 col-md-10 Pharma_Content">
                <section class="retailer_section">
                    <div class="container">
                       
                        <div class="row col-md-12 trans_history">
                            <div class="col-lg-7 col-md-12 p_schedule">
                                <label >Select Date</label>
                                <div class="transaction_form">
                                 
                            <div class="form-group">
                            <input type="date" id="start_date" class="form-control"  placeholder="yyyy-mm-dd" onChange={this.startDate}/>
                            <p>To</p>

                             <input type="date" id="end_date" class="form-control" onChange={this.endDate}/> 
                                {/* <input type="date" class="form-control" />
                                <p>To</p>
                                <input type="date" class="form-control" /> */}
                            </div>
                            <div class="rgt_arrow_btn">
                                {/* <img src="https://thumbnail.imgbin.com/6/13/7/imgbin-arrow-button-computer-icons-others-LGga3De5R1QxAMSaSnTaby2TT_t.jpg"/> */}
                           <p  onClick={this.showOrderbyDates}>find</p>
                            </div>
                        </div>
                            </div>
                            <div class="col-lg-5 col-md-12">

                                <nav class="p_nav">
                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" id="online-tab" data-toggle="tab" href="#online_home" role="tab" aria-controls="online_home" aria-selected="true">Total Online Sale<p>₦ {this.state.totalCost ? parseInt(this.state.totalCost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : "0.00"}</p></a>
                                        {/* <a class="nav-item nav-link" id="purchase-tab" data-toggle="tab" href="#purchase_home" role="tab" aria-controls="purchase_home" aria-selected="false">Total Purchase Cost<p>₹3,69,568</p></a> */}
                                        
                                    </div>
                                   
                                </nav>
                                
                           
                              
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="tab-content" id="nav-tabContent">
                                    <div class="tab-pane fade show active" id="online_home" role="tabpanel" aria-labelledby="online-tab">
                                      <div class="container">
                                        <div class="row">
                                           
                                           <div class="col-md-12 no_padding">
                                            <div class="tableFixHead">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                           <th>No</th>
                                                            <th>Customer</th>
                                                            <th>Order ID</th>
                                                            <th>Order Date</th>
                                                            <th>Prescription</th>
                                                            <th>Items</th>
                                                            <th>Paid Amount</th>
                                                            <th>Invoice Amount</th>
                                                            <th>Invoice</th>
                                                            
                                                        </tr>
                                                    </thead>
                                                  <tbody>
                                                    {this.state.retailerFinalOrderMedicineDetailsView ? this.state.retailerFinalOrderMedicineDetailsView : <React.Fragment><td></td><td></td><td></td><td></td><td>No Order Found</td><td></td><td></td><td></td> </React.Fragment>}
                                                    {/* <tr>
                                                        <td>1</td>
                                                          <td>Alien Pharmacy <h6>9876542587</h6></td>
                                                          <td>
                                                            5248521</td>
                                                          <td>
                                                              
                                                             20-05-2020</td>
                                                             <td>
                                                              <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                            <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                        </td> 
                                                          <td>8
                                                          
                                                          </td>
                                                         
                                                          <td>₹ 890
                                                             
                                                          </td>
                                                          <td>
                                                          <img class="inv_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                         
                                                      </td>
                                                            
                                                         
                                                         
                                                      </tr>
                                                      <tr>
                                                        <td>1</td>
                                                          <td>Alien Pharmacy <h6>9876542587</h6></td>
                                                          <td>
                                                            5248521</td>
                                                          <td>
                                                              
                                                             20-05-2020</td>
                                                             <td>
                                                              <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                            <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                        </td>
                                                          <td>
                                                              8
                                                          
                                                          </td>
                                                         
                                                          <td>₹ 890
                                                             
                                                          </td>
                                                          <td>
                                                          <img class="inv_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                         
                                                      </td>
                                                            
                                                         
                                                         
                                                      </tr> */}
                                                  </tbody>
                                                </table>
                                              </div>
                                          
                                           </div>
                                       </div>
                                    </div>
                                    </div>
                                    {/* <div class="tab-pane fade" id="purchase_home" role="tabpanel" aria-labelledby="purchase-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                       <th></th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                  <td>1</td>
                                                    <td>Alien Pharmacy <h6>9876542587</h6></td>
                                                    <td>
                                                      5248521
                                                    </td>
                                                    <td>
                                                        
                                                    20-05-2020</td>
                                                      
                                                    <td>8
                                                    
                                                    </td>
                                                   
                                                    <td>₹ 890
                                                       
                                                    </td>
                                                    <td>
                                                    <img class="inv_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                   
                                                </td>
                                                      
                                                   
                                                   
                                                </tr>
                                                <tr>
                                                    <td>1</td>
                                                      <td>Alien Pharmacy <h6>9876542587</h6></td>
                                                      <td>
                                                       5248521</td>
                                                      <td>
                                                          
                                                         20-05-2020</td>
                                                       
                                                      <td>8
                                                      
                                                      </td>
                                                     
                                                      <td>₹ 890
                                                         
                                                      </td>
                                                      <td>
                                                      <img class="inv_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                     
                                                  </td>
                                                        
                                                     
                                                     
                                                  </tr>
                                                  <tr>
                                                    <td>1</td>
                                                      <td>Alien Pharmacy <h6>9876542587</h6></td>
                                                      <td>
                                                        5248521</td>
                                                      <td>
                                                          
                                                         20-05-2020</td>
                                                        
                                                      <td>8
                                                      
                                                      </td>
                                                     
                                                      <td>₹ 890
                                                         
                                                      </td>
                                                      <td>
                                                      <img class="inv_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png"  />
                                                     
                                                  </td>
                                                        
                                                     
                                                     
                                                  </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                      
                                    </div> */}
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ToastContainer />
            </div>
    </section>
        </main>
    )
}
}
 