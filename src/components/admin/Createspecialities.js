import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class createSpecialities extends Component {

   constructor(props) {
      super(props);
      this.state = {
         fields: {},
         errors: {},
         controller_data: '',
      };
   }

   // To get detais after first render
   componentDidMount = () => {
      const { handle } = this.props.match.params;
      this.getSpecialitiesInfo(handle);
      this.getControllerInfo();
   };

   // fetches all controllers
   getControllerInfo() {
      Httpconfig.httptokenget(Constant.siteurl + "api/Category/?category_type=Speciality")
         //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
         .then((response) => {
            this.setState({
               controller_data: response.data.data
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
   getSpecialitiesInfo(handle) {
      Httpconfig.httptokenget(Constant.siteurl + "api/specialities/" + handle)
         .then((response) => {
            console.log(response);
            this.setState({
               fields: {
                  speciality_name: response.data.data[0].speciality_name,
                  id: response.data.data[0].category_id,
                  //   status: response.data[0].status,
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
      Httpconfig.httptokenpost(Constant.siteurl + "api/specialities/create", {
         speciality_name: fields["speciality_name"],
         category_id: fields["id"],
      }).then((response) => {
         toast.success("Successfully Created Speciality");
         setTimeout(
            () => this.props.history.push("/admin/Viewspecialities"),
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
         Constant.siteurl + "api/specialities/" + handle,
         {
            speciality_name: fields["speciality_name"],
            category_id: fields["id"],
         }
      ).then((response) => {
         toast.success("Successfully Updated Speciality");
         setTimeout(
            () => this.props.history.push("/admin/Viewspecialities"),
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

      if (!fields["speciality_name"]) {
         formIsValid = false;
         errors["speciality_name"] = "Speciality name cannot be empty";
      }
      if (!fields["id"]) {
         formIsValid = false;
         errors["id"] = "Category name cannot be empty";
      }
      this.setState({ errors: errors });
      return formIsValid;
   }

   render() {
      const { fields, errors, controller_data } = this.state;
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
                              <a> Specialities </a>
                              </li>
                           </ol>
                        </div>
                     </div>

                     <section id="CMS_tab">
                        <div className="CMS_content">
                           <div className="container">
                              <div className="row">
                                 <div className="tab-header">
                                    <h3>Create Specialities</h3>
                                 </div>
                                 <div id="reg_form">
                                    <form onSubmit={this.checkSubmit.bind(this)}>
                                       <div className="row">

                                          <div className="col-md-4">
                                             <div className="form-group">
                                                <select
                                                   name="category_id"
                                                   className="form-control" value={this.state.fields["id"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "id"
                                                   )}
                                                >
                                                   <option value="">Select</option>
                                                   {controller_data &&
                                                      controller_data.map((controller_data, i) => {
                                                         return (
                                                            <option value={controller_data.id}>
                                                               {controller_data.category}
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
                                             <div className="form-group ">
                                                <input
                                                   type="ftext"
                                                   name="speciality_name"
                                                   className="form-control"
                                                   value={this.state.fields["speciality_name"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "speciality_name"
                                                   )}
                                                   placeholder="Speciality Name"
                                                />
                                                <span className="cRed">
                                                   {this.state.errors["speciality_name"]}
                                                </span>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="row">
                                          <div className="form-group col-md-12">
                                             <button
                                                type="submit"
                                                className="btn  btn-primary save_btn"
                                             >
                                                Save speciality
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewspecialities" className="cancel_btn">
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

