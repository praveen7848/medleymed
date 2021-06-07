import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class createPages extends Component {

   constructor(props) {
      super(props);
      this.state = {
         fields: {},
         errors: {},
         page_data: '',
      };
   }

   // To get detais after first render
   componentDidMount = () => {
      const { handle } = this.props.match.params;
      this.getPagesInfo(handle);
      this.getControllerInfo();
   };

   // fetches all controllers
   getControllerInfo() {
      Httpconfig.httptokenget(Constant.siteurl + "api/Category/")
         //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
         .then((response) => {
            this.setState({
               page_data: [{ "page_name": "TOC" }, { "page_name": "Privacy Policy" }]
            })
         })
   }

   // When value changes of the fields
   handleChange = (field, event) => {
      let fields = this.state.fields;
      fields[field] = event.target.value;
      // fields['category_id'] = "3";
      this.setState({ fields });
   };

   // To get all the ResponderInfo
   getPagesInfo(handle) {
      Httpconfig.httptokenget(Constant.siteurl + "api/pages/" + handle)
         .then((response) => {
            this.setState({
               fields: {
                  page_name: response.data.data[0].page_name,
                  description: response.data.data[0].description,
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
         this.updatePages(event);
      } else if (this.handleValidation() && handle == undefined) {
         this.createPages(event);
      } else {
         toast.warn("Form has errors.");
      }
   }
   // creates new controller
   createPages = (event) => {
      event.preventDefault();
      const { fields, errors } = this.state;
      Httpconfig.httptokenpost(Constant.siteurl + "api/pages/", {
         page_name: fields["page_name"],
         description: fields["description"],
      }).then((response) => {
         toast.success("Successfully Created Page");
         setTimeout(
            () => this.props.history.push("/Viewpages"),
            2000
         );
      }).catch((error) => {
         console.log(error);
      });
   }

   // updates controller
   updatePages = (event) => {
      event.preventDefault();
      const { handle } = this.props.match.params;
      const { fields, errors } = this.state;
      Httpconfig.httptokenput(
         Constant.siteurl + "api/pages/" + handle,
         {
            page_name: fields["page_name"],
            description: fields["description"],
         }
      ).then((response) => {
         toast.success("Successfully Updated Page");
         setTimeout(
            () => this.props.history.push("/admin/Viewpages"),
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

      if (!fields["page_name"]) {
         formIsValid = false;
         errors["page_name"] = "Page name cannot be empty";
      }
      if (!fields["description"]) {
         formIsValid = false;
         errors["description"] = "Description cannot be empty";
      }
      this.setState({ errors: errors });
      return formIsValid;
   }

   render() {
      const { fields, errors, page_data } = this.state;
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
                              <a> Pages </a>
                              </li>
                           </ol>
                        </div>
                     </div>

                     <section id="CMS_tab">
                        <div className="CMS_content">
                           <div className="container">
                              <div className="row">
                                 <div className="tab-header">
                                    <h3>Create Pages</h3>
                                 </div>
                                 <div id="reg_form">
                                    <form onSubmit={this.checkSubmit.bind(this)}>
                                       <div className="row">

                                          <div className="col-md-4">
                                             <div className="form-group ">
                                                <select
                                                   name="page_name"
                                                   className="form-control" value={this.state.fields["page_name"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "page_name"
                                                   )}
                                                >
                                                   <option value="">Select</option>
                                                   {page_data &&
                                                      page_data.map((page_data, i) => {
                                                         return (
                                                            <option value={page_data.page_name}>
                                                               {page_data.page_name}
                                                            </option>
                                                         );
                                                      })}
                                                </select>
                                                <span className="cRed">
                                                   {this.state.errors["page_name"]}
                                                </span>
                                             </div>
                                          </div>


                                          <div className="col-md-4">
                                             <div className="form-group">
                                                <textarea
                                                   type="ftext"
                                                   name="description" rows={20}
                                                   className="form-control"
                                                   value={this.state.fields["description"] || ""}
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "description"
                                                   )}
                                                   placeholder="Description"
                                                />
                                                <span className="cRed">
                                                   {this.state.errors["description"]}
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
                                                Save page
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewpages" className="cancel_btn">
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

