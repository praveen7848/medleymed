import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Multiselect } from "multiselect-react-dropdown";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export default class createCoupons extends Component {

   constructor(props) {
      super(props);
      this.state = {
         fields: {},
         errors: {},
         coupon_data: '',

         options: [],
         userarray: [],
         customersarray: [],
         selectedList: {},
         selectedValue: [],
      };
   }

   setStartTimeOnChange = (value) => {
      this.setState({ start_date: value });
   };

   setEndTimeOnChange = (value) => {
      this.setState({ end_date: value });
   };

   // To get detais after first render
   componentDidMount = () => {
      const { handle } = this.props.match.params;
      this.fetchusersdata();
      this.getCouponInfo(handle);
   };

   fetchusersdata() {
      Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findPatientName").then((response) => {
         this.setState({
            options: response.data,
            userarray: response.data
         })
      });
   }

   onSelect = (selectedListdata, selectedItem) => {
      this.setState({
         selectedList: selectedListdata.map((x) => x.id),
      });

   };

   onRemove = (deselectedList, removedItem) => {
      this.setState({
         selectedList: deselectedList.map((x) => x.id),
      });
      console.log(Object.assign({}, this.state.selectedList))
   };

   // When value changes of the fields
   handleChange = (field, event) => {
      let fields = this.state.fields;
      fields[field] = event.target.value;
      this.setState({ fields });
   };

   // To get all the ResponderInfo
   getCouponInfo(handle) {
      Httpconfig.httptokenget(Constant.siteurl + "api/Coupon/" + handle)
         .then((response) => {

            this.setState({
               fields: {
                  coupon_name: response.data.data[0].coupon_name,
                  is_percentage: response.data.data[0].is_percentage,
                  discount: response.data.data[0].discount,
                  is_all: response.data.data[0].is_all,
                  status: response.data.data[0].status,
               },
            });

            this.setState({ start_date: new Date(response.data.data[0].start_date) });
            this.setState({ end_date: new Date(response.data.data[0].end_date) });

            let editusersdata = [];
            let customerData = response.data.data[0].customers;
            let editUserList = customerData.split(",");

            var usersdata = this.state.userarray;
            editUserList.forEach(function (item, index) {
               usersdata.forEach(function (obj, i) {
                  if (obj.id == item) {
                     return editusersdata.push(obj);
                  }
               });
            });
            this.setState({
               selectedValue: editusersdata,
               selectedList: editUserList,
            });

         }).catch((error) => {
            console.log(error);
         });
   }

   // create or update   
   checkSubmit(event) {
      event.preventDefault();
      const { handle } = this.props.match.params;
      if (this.handleValidation() && handle) {
         this.updateCoupons(event);
      } else if (this.handleValidation() && handle == undefined) {
         this.createCoupon(event);
      } else {
         toast.warn("Form has errors.");
      }
   }
   // creates new controller
   createCoupon = (event) => {
      event.preventDefault();
      const { fields, errors } = this.state;

      Httpconfig.httptokenpost(Constant.siteurl + "api/Coupon/", {
         coupon_name: fields["coupon_name"],
         start_date: this.state.start_date,
         end_date: this.state.end_date,
         is_percentage: fields["is_percentage"],
         discount: fields["discount"],
         is_all: fields["is_all"],
         customers: this.state.selectedList.toString(),
      }).then((response) => {
         toast.success("Successfully Created Coupon");
         setTimeout(
            () => this.props.history.push("/admin/Viewcoupons"),
            10000
         );
      }).catch((error) => {
         console.log(error);
      });
   }

   // updates controller
   updateCoupons = (event) => {
      event.preventDefault();
      const { handle } = this.props.match.params;
      const { fields, errors } = this.state;
      Httpconfig.httptokenput(
         Constant.siteurl + "api/Coupon/" + handle,
         {
            coupon_name: fields["coupon_name"],
            start_date: this.state.start_date,
            end_date: this.state.end_date,
            is_percentage: fields["is_percentage"],
            discount: fields["discount"],
            is_all: fields["is_all"],
            customers: this.state.selectedList.toString(),
         }
      ).then((response) => {
         toast.success("Successfully Updated Coupon");
         setTimeout(
            () => this.props.history.push("/admin/Viewcoupons"),
            2000
         );
      }).catch((error) => {
         console.log(error);
         toast.error(error);
      });
   }

   handleValidation() {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if (!fields["coupon_name"]) {
         formIsValid = false;
         errors["coupon_name"] = "Coupon name cannot be empty";
      }
      if (!this.state.start_date) {
         formIsValid = false;
         errors["start_date"] = "Start Date cannot be empty";
      }
      if (!this.state.end_date) {
         formIsValid = false;
         errors["end_date"] = "End Date cannot be empty";
      }
      if (!fields["discount"]) {
         formIsValid = false;
         errors["discount"] = "Discount cannot be empty";
      }
      if (!fields["is_all"]) {
         formIsValid = false;
         errors["is_all"] = "Is all cannot be empty";
       }
       if (!fields["is_percentage"]) {
         formIsValid = false;
         errors["is_percentage"] = "Percentage cannot be empty";
       }
       if (!fields["selectedList"]) {
         formIsValid = false;
         errors["selectedList"] = "Customers cannot be empty";
       }
       
      this.setState({ errors: errors });
      return formIsValid;
   }

   render() {
      const { fields, errors, coupon_data } = this.state;
      return (
         <section id="main_dashboard">
            <div className="container" id="main_front">
               <div className="row">
                  <div className="col-md-12">
                     <div className="dash-section">
                        <div className="section-header">
                           <ol className="breadcrumb">
                              <li className="active">
                                 <Link to="/admin"> Dashboard</Link> &gt;
                              <a> Coupons </a>
                              </li>
                           </ol>
                        </div>
                     </div>

                     <section id="CMS_tab">
                        <div className="CMS_content">
                           <div className="container">
                              <div className="row">
                                 <div className="tab-header">
                                    <h3>Create Coupon Management</h3>
                                 </div>
                                 <div id="reg_form">
                                    <form onSubmit={this.checkSubmit.bind(this)}>
                                       <div className="row">
                                          <div className="col-md-4">
                                             <div className="form-group ">
                                                <input
                                                   type="text"
                                                   name="coupon_name"
                                                   value={this.state.fields["coupon_name"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "coupon_name"
                                                   )}
                                                   className="form-control"
                                                   placeholder="Coupon Name"
                                                />
                                                <span className="cRed">
                                                   {this.state.errors["coupon_name"]}
                                                </span>
                                             </div>
                                          </div>
                                      
                                          <div className="col-md-4">
                                             <div className="form-group " >
                                                <DatePicker name="start_date" autoComplete="off" className="dateInput" placeholderText="Start Date" selected={this.state.start_date} onChange={this.setStartTimeOnChange} dateFormat="yyyy-MM-d" calendarIcon showMonthDropdown adjustDateOnChange /><br />
                                                <span className="cRed">
                                                   {this.state.errors["start_date"]}
                                                </span>
                                             </div>
                                          </div>
                                       
                                          <div className="col-md-4">
                                             <div className="form-group ">
                                                <DatePicker name="end_date" autoComplete="off" className="dateInput" placeholderText="End Date" selected={this.state.end_date} onChange={this.setEndTimeOnChange} dateFormat="yyyy-MM-d" calendarIcon showMonthDropdown adjustDateOnChange /><br />
                                                <span className="cRed">
                                                   {this.state.errors["end_date"]}
                                                </span>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="row">
                                          <div className="col-md-4">
                                             <div className="form-group ">
                                                <label htmlFor="customRadio2" className="custom-control-label">Is percentage?</label>
                                                <div className="custom-control custom-radio" onChange={this.handleChange.bind(
                                                   this, "is_percentage")}>
                                                   <input type="radio" value="1" checked={this.state.fields["is_percentage"] == "1"} name="is_percentage" /> Yes
                                      &nbsp;&nbsp;&nbsp;
                                      <input type="radio" value="0" checked={this.state.fields["is_percentage"] == "0"} name="is_percentage" /> No
                                  </div>
                                  <span className="cRed">
                                  {this.state.errors["is_percentage"]}
                                </span>
                                             </div>
                                          </div>
                                       
                                          <div className="col-md-4">
                                             <div className="form-group">
                                                <input
                                                   type="text"
                                                   name="discount"
                                                   value={this.state.fields["discount"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "discount"
                                                   )}
                                                   className="form-control"
                                                   placeholder="Discount"
                                                />
                                                <span className="cRed">
                                                   {this.state.errors["discount"]}
                                                </span>
                                             </div>
                                          </div>
                                      
                                          <div className="col-md-4">
                                             <div className="form-group ">

                                                <label htmlFor="customRadio2" className="custom-control-label">Is all?</label>
                                                <div className="custom-control custom-radio" onChange={this.handleChange.bind(
                                                   this, "is_all")}>
                                                   <input type="radio" value="1" checked={this.state.fields["is_all"] == "1"} name="is_all" /> Yes
                                      &nbsp;&nbsp;&nbsp;
                                      <input type="radio" value="0" checked={this.state.fields["is_all"] == "0"} name="is_all" /> No
                                  </div>
                                             </div>
                                             <span className="cRed">
                                  {this.state.errors["is_all"]}
                                </span>
                                          </div>
                                       </div>

                                       <div className="row">
                                          <div className="col-md-6">
                                             <div className="form-group">
                                                <Multiselect
                                                className="select_multiple"
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "customers"
                                                   )}
                                                   name="customers"
                                                   options={this.state.options} // Options to display in the dropdown
                                                   value={this.state.selectedList || ""}
                                                   selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                   onSelect={this.onSelect} // Function will trigger on select event
                                                   placeholder="Select Customers"
                                                   onRemove={this.onRemove} // Function will trigger on remove event
                                                   displayValue="name" // Property name to display in the dropdown options
                                                />
                                                <span className="cRed">
                                                   {this.state.errors["selectedList"]}
                                                </span>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="row">
                                          <div className="form-group col-md-12">
                                             <button
                                                type="submit"
                                                className="btn  btn-primary save_btn"                                      >
                                                Save Coupon
                              </button>{" "}
                              &nbsp;
                              <Link to="/admin/Viewcoupons" className="cancel_btn">
                                                Cancel
                              </Link>{" "}
                              &nbsp; &nbsp;
                            </div>
                                       </div>

                                    </form>
                                 </div>
                                 <ToastContainer />
                              </div>
                           </div>
                        </div>
                     </section>

                  </div>
               </div>
            </div>
         </section>
      )
   }
}

