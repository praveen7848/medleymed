import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigRetailer';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";
import RetailerCss from "../../public/css/retailer/retailer_style.css";
import RetailerHeader from "../retailer/RetailerHeader";
import RetailerSideMenu from "../retailer/RetailerSideMenu";
import Footer from "../patient/Patientfooter";


export default class Viewretailers extends Component {
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
                <section class="manage_section">
                    <div class="container">
                       
                        <div class="row">
                            <div class="col-md-12">
                                <nav class="p_nav">
                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" id="available_home-tab" data-toggle="tab" href="#available_home" role="tab" aria-controls="available-home" aria-selected="true">Total Available in stock<p>20,000</p></a>
                                        <a class="nav-item nav-link" id="running_home-tab" data-toggle="tab" href="#running_home" role="tab" aria-controls="running_home" aria-selected="false">Running Low<p>30</p></a>
                                        <a class="nav-item nav-link" id="out_home-tab" data-toggle="tab" href="#out_home" role="tab" aria-controls="out_home" aria-selected="false">Out of Stock <p>220</p></a>
                                        <a class="nav-item nav-link" id="Expire_home-tab" data-toggle="tab" href="#expire_home" role="tab" aria-controls="expire_home" aria-selected="false">Expired <p>220</p></a>
                                        <a class="nav-item nav-link order_book_item" id="order_home-tab" data-toggle="tab" href="#order_home" role="tab" aria-controls="order_home" aria-selected="false">Order <br/>Book <h5>56 added</h5></a>
                                        <div class="add_med_btn">
                                         <a href="#"><button type="button">Add Medicine</button></a>   
                                        </div>
                                    </div>
                                   
                                </nav>
                                
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="manage_search">
                                        <div class="input-group col-md-8">
                                            <input type="text" class="form-control" placeholder="Search medicine by name, batch no.." />
                                            <div class="input-group-btn">
                                                <div class="btn-group" role="group">
                                                    <button class="btn btn-default">
                                                  <img src="https://listimg.pinclipart.com/picdir/s/485-4851736_free-png-search-icon-search-icon-free-download.png" />
                                                  </button>

                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                                {/* <div class="tab-content" id="nav-tabContent">
                                    <div class="tab-pane fade show active" id="available_home" role="tabpanel" aria-labelledby="available_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Index</th>
                                                        <th>Customer</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>HSN</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th>Reorder</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td class="index_active">All</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                     <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    
                                                        <td>
                                                            <input type="checkbox"/>
                                                            <div class="dropdown">
                                                               
                                                                <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                    <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                    <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                                </div>
                                                              </div>
                                                        </td>
                                                    
                                                   
                                                   
                                                </tr>
                                                <tr>
                                                    <td>A</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/></p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td >C</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/></p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                       
                                              </tbody>
                                            </table>
                                          </div>
                                      
                                    </div>
                                    <div class="tab-pane fade" id="running_home" role="tabpanel" aria-labelledby="running_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Index</th>
                                                        <th>Customer</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>HSN</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th>Reorder</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td class="index_active">All</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td>A</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td >C</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                       
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                    <div class="tab-pane fade" id="out_home" role="tabpanel" aria-labelledby="out_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Index</th>
                                                        <th>Customer</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>HSN</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th>Reorder</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td class="index_active">All</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td>A</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td >C</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                       
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                    <div class="tab-pane fade" id="expire_home" role="tabpanel" aria-labelledby="order_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Index</th>
                                                        <th>Customer</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>HSN</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th>Reorder</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td class="index_active">All</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td>A</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td >C</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td><p>562585</p>
                                                  <p> 5248521</p></td>
                                                    <td><p>20-05-2020</p>
                                                       <p>20-05-2020</p></td>
                                                   
                                                    <td><p>3004</p>
                                                    <p>3004</p>
                                                    </td>
                                                    <td><p>200 Strips</p><p>400 Strips</p></td>
                                                 
                                                    <td><p>₹ 890</p>
                                                        <p>₹ 890</p>
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"/>
                                                        <div class="dropdown">
                                                           
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                                <a href="#"><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                   
                                                </tr>
                                       
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                    <div class="tab-pane fade" id="order_home" role="tabpanel" aria-labelledby="order_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Index</th>
                                                        <th>Medicine</th>
                                                        <th>Add Quantity</th>
                                                        <th><input type="checkbox"/>Order All</th>
                                                        <th><img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/delete-1432400-1211078.png" /></th>
                                                        
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td class="index_active">All</td>
                                                    <td>New 500 Tablet <h6>Phamra private Ltd</h6></td>
                                                    <td> 
                                                        <div class="qty ">
                                                     <span class="minus bg-dark">-</span>
                                                     <input type="number" class="count" name="qty" value="1"/>
                                                     <span class="plus bg-dark">+</span>
                                                 </div>
                                                 </td>
                                                  <td><input type="checkbox"/> Add</td>
                                                   
                                                   
                                                    <td><img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/delete-1432400-1211078.png" />
                                                         </td>
                                                   
                                                </tr>
                                                <tr>
                                                    <td>A</td>
                                                    <td>New 500 Tablet <h6>Phamra private Ltd</h6></td>
                                                    <td> 
                                                        <div class="qty ">
                                                     <span class="minus bg-dark">-</span>
                                                     <input type="number" class="count" name="qty" value="1"/>
                                                     <span class="plus bg-dark">+</span>
                                                 </div>
                                                 </td>
                                                  <td><input type="checkbox"/> Add</td>
                                                   
                                                   
                                                    <td><img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/delete-1432400-1211078.png" />
                                                         </td>
                                                </tr>
                                                <tr>
                                                    <td >B</td>
                                                    <td>New 500 Tablet <h6>Phamra private Ltd</h6></td>
                                                    <td> 
                                                        <div class="qty ">
                                                     <span class="minus bg-dark">-</span>
                                                     <input type="number" class="count" name="qty" value="1"/>
                                                     <span class="plus bg-dark">+</span>
                                                 </div>
                                                 </td>
                                                  <td><input type="checkbox"/> Add</td>
                                                   
                                                   
                                                    <td><img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/delete-1432400-1211078.png" />
                                                         </td>
                                                </tr>
                                       
                                              </tbody>
                                            
                                            </table>
                                            <div class="total_items">
                                                <p>Total 35 items added <h5>Final Order</h5></p>
                                            </div>
                                          </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
    
        </div>
    </div>
</section>            <Footer/>
         </main>
         
      )
   }
}

