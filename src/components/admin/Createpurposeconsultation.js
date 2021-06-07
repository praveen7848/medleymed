import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class Createpurposeconsultation extends Component {

   constructor(props) {
      super(props);
      this.state = {
         fields: {},
         errors: {},
         category_data: '',
      };
   }

   // To get detais after first render
   componentDidMount = () => {
      const { handle } = this.props.match.params;
      this.getPurposeConsultationInfo(handle);
      this.getControllerInfo();
   };

   // fetches all controllers
   getControllerInfo() {
      Httpconfig.httptokenget(Constant.siteurl + "api/Category/?category_type=Purpose of consultation")
         .then((response) => {
            this.setState({
               category_data: response.data.data
            })
         })
   }


   // When value changes of the fields
   handleChange = (field, event) => {
      let fields = this.state.fields;
      fields[field] = event.target.value;
      this.setState({ fields });
   };

   // To get all the ResponderInfo
   getPurposeConsultationInfo(handle) {
      Httpconfig.httptokenget(Constant.siteurl + "api/purpose_consultation/" + handle)
         .then((response) => {
            this.setState({
               fields: {
                  consultation_name: response.data.data[0].consultation_name,
                  id: response.data.data[0].category_id,
               },
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
         this.updateSpecialities(event);
      } else if (this.handleValidation() && handle == undefined) {
         this.createSpecialities(event);
      } else {
         toast.warn("Form has errors.");
      }
   }
   // creates new controller
   createSpecialities = (event) => {
      event.preventDefault();
      const { fields, errors } = this.state;

      Httpconfig.httptokenpost(Constant.siteurl + "api/purpose_consultation/create", {
         consultation_name: fields["consultation_name"],
         category_id: fields["id"],
      }).then((response) => {
         toast.success("Successfully Created Purpose Consultation");
         setTimeout(
            () => this.props.history.push("/admin/Viewpurposeconsultation"),
            2000
         );
      }).catch((error) => {
         console.log(error);
      });
   }

   // updates controller
   updateSpecialities = (event) => {
      event.preventDefault();
      const { handle } = this.props.match.params;
      const { fields, errors } = this.state;
      Httpconfig.httptokenput(
         Constant.siteurl + "api/purpose_consultation/" + handle,
         {
            consultation_name: fields["consultation_name"],
            category_id: fields["id"],
         }
      ).then((response) => {
         toast.success("Successfully Updated Purpose Consultation");
         setTimeout(
            () => this.props.history.push("/admin/Viewpurposeconsultation"),
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

      if (!fields["consultation_name"]) {
         formIsValid = false;
         errors["consultation_name"] = "consultation name cannot be empty";
      }
      if (!fields["id"]) {
         formIsValid = false;
         errors["id"] = "Category name cannot be empty";
      }
      this.setState({ errors: errors });
      return formIsValid;
   }

   render() {
      const { fields, errors, category_data } = this.state;
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
                              <a> Purpose of consultation </a>
                              </li>
                           </ol>
                        </div>
                     </div>

                     <section id="CMS_tab">
                        <div className="CMS_content">
                           <div className="container">
                              <div className="row">
                                 <div className="tab-header">
                                    <h3>Create Purpose of consultation</h3>
                                 </div>
                                 <div id="reg_form">
                                    <form onSubmit={this.checkSubmit.bind(this)}>
                                       <div className="row">

                                          <div className="col-md-4">
                                             <div className="form-group col-md-12">
                                                <select
                                                   name="category_id"
                                                   className="form-control" value={this.state.fields["id"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "id"
                                                   )}
                                                >
                                                   <option value="">Select</option>
                                                   {category_data &&
                                                      category_data.map((category_data, i) => {
                                                         return (
                                                            <option value={category_data.id}>
                                                               {category_data.category}
                                                            </option>
                                                         );
                                                      })}
                                                </select>
                                                <span className="cRed">
                                                   {this.state.errors["id"]}
                                                </span>
                                             </div>
                                          </div>

                                          <div className="col-md-4">
                                             <div className="form-group col-md-12">
                                                <input
                                                   type="ftext"
                                                   name="consultation_name"
                                                   className="form-control"
                                                   value={this.state.fields["consultation_name"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "consultation_name"
                                                   )}
                                                   placeholder="Consultation name"
                                                />
                                                <span className="cRed">
                                                   {this.state.errors["consultation_name"]}
                                                </span>
                                             </div>
                                          </div>
                                       </div>
                                       {/* { <div className="col-md-4">
                                      <div className="form-group col-md-12">
                                      <label for="customRadio2" class="custom-control-label">Status</label>
                                      <div class="custom-control custom-radio" onChange={this.handleChange.bind(
                                          this,"status")}>
                                      <input type="radio" value="1" checked={this.state.fields["status"] == "1"} name="status" /> Active
                                       &nbsp;&nbsp;&nbsp;
                                      <input type="radio" value="0" checked={this.state.fields["status"] == "0"} name="status" /> In Active
                                       </div>
                                      </div>
                                    </div> }  */}
                                       <div className="row">
                                          <div className="form-group col-md-8">
                                             <button
                                                type="submit"
                                                className="btn  btn-primary padTopCategorySave fright"
                                             >
                                                Save Purpose Consultation
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewpurposeconsultation" className="padTopCategorySave hrefCategory fright">
                                                Cancel
                                  </Link>{" "}
                                  &nbsp; &nbsp;
                                </div>
                                       </div>
                                    </form>
                                 </div>

                              </div>
                              <ToastContainer />
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

