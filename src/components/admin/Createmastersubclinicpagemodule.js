import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Link } from "react-router-dom";

export default class Createmastersubpagemodule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      isCurrentPage : true,
    };
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.getMasterSubClinicPageModuleInfo(handle);
    this.getMastermoduleDetails();
    this.getMastersubmoduleDetails();
    this.fetchClinicListData();
    this.getMasterpagemoduleDetails();
  };

  fetchMasterModuleSequenceId(masterId) {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterModules/getSequenceId/"+masterId)
    .then((response) => {
      let moduleSequenceId = response.data.data[0].sequence_id;
      this.setState({
        fields: {
          master_module_sequence_id: moduleSequenceId,
          master_module_id: response.data.data[0].id,

          sub_module_sequence_id: this.state.fields["sub_module_sequence_id"],
          sub_module_id: this.state.fields["sub_module_id"],
          
          page_module_id: this.state.fields["page_module_id"],
          page_module_sequence_id: this.state.fields["page_module_sequence_id"],

          clinic_id: this.state.fields["clinic_id"],
          status:this.state.fields["status"],
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  fetchMasterSubModuleSequenceId(masterSubId) {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterSubModule/getSequenceId/"+masterSubId)
    .then((response) => {
      let moduleSequenceId = response.data.data[0].sequence_id;
      this.setState({
        fields: {
          sub_module_sequence_id: moduleSequenceId,
          sub_module_id: response.data.data[0].id,

          page_module_id: this.state.fields["page_module_id"],
          page_module_sequence_id: this.state.fields["page_module_sequence_id"],

          master_module_sequence_id: this.state.fields["master_module_sequence_id"],
          master_module_id: this.state.fields["master_module_id"],
          status:this.state.fields["status"],
          clinic_id: this.state.fields["clinic_id"],
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  fetchPageModuleSequenceId(masterSubId) {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterSubModulePage/getSequenceId/"+masterSubId)
    .then((response) => {
      console.clear();
      console.log(response);
      this.setState({
        fields: {
          page_module_id: response.data.data[0].page_module_id,
          page_module_sequence_id: response.data.data[0].sequence_id,
          sub_module_sequence_id: this.state.fields["sub_module_sequence_id"],
          sub_module_id: this.state.fields["sub_module_id"],
          master_module_sequence_id: this.state.fields["master_module_sequence_id"],
          master_module_id: this.state.fields["master_module_id"],
          clinic_id: this.state.fields["clinic_id"],
          status:this.state.fields["status"],
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;

    // console.clear();
    // console.log("master_module_id "+fields.master_module_id);
    // console.log(fields);
    // console.log(fields[field]);
    // console.log(event.target.value);
    // return;

    if(fields.master_module_id){
      this.fetchMasterModuleSequenceId(fields.master_module_id);
    }

    if(fields.sub_module_id){
      this.fetchMasterSubModuleSequenceId(fields.sub_module_id);
    }

    if(fields.page_name){
      this.fetchPageModuleSequenceId(fields.page_name);
    }
    this.setState({ fields });
  };

  // Get Clinic Details
  fetchClinicListData() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Clinic/clinicList")
      .then((response) => {
        this.setState({
          clinic_details: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Ends

  // Get Master Page Module
  getMasterpagemoduleDetails() {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterSubModulePage")
      .then((response) => {
        this.setState({
          masterPageModule: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Ends

  // Get Master Module
  getMastermoduleDetails() {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterModules")
      .then((response) => {
        this.setState({
          masterModule: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Ends

  // Get Sub Module
  getMastersubmoduleDetails() {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterSubModule")
      .then((response) => {
        this.setState({
          masterSubModule: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Ends

  // masterModules
  // masterSubModule
  // masterSubModulePage
  // masterSubModuleClinicPage

  // To get all the ResponderInfo
  getMasterSubClinicPageModuleInfo(handle) {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/masterSubModuleClinicPage/" + handle
    )
      //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
      .then((response) => {
        console.log(response);
        this.setState({
          fields: {
            clinic_id: response.data.data[0].clinic_id,
            page_name: response.data.data[0].page_name,
            page_module_sequence_id: response.data.data[0].page_module_sequence_id,
            sub_module_sequence_id: response.data.data[0].sub_module_sequence_id,
            sub_module_id: response.data.data[0].sub_module_id,
            master_module_sequence_id: response.data.data[0].master_module_sequence_id,
            master_module_id: response.data.data[0].master_module_id,
            status: response.data.data[0].status,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // create or update
  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleValidation() && handle) {
      this.updateMasterSubPageModule(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createMasterSubPageModule(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  // creates new controller
  createMasterSubPageModule = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    console.clear();
    console.log('Fields for Create.....');
    console.log(fields);
 // return;
    
    Httpconfig.httptokenpost(
      Constant.siteurl + "api/masterSubModuleClinicPage",
      {
        clinic_id: fields["clinic_id"],
        page_module_id: fields["page_module_id"],
        page_module_sequence_id: fields["page_module_sequence_id"],
        sub_module_sequence_id: fields["sub_module_sequence_id"],
        sub_module_id: fields["sub_module_id"],
        master_module_sequence_id: fields["master_module_sequence_id"],
        master_module_id: fields["master_module_id"],
        status: fields["status"],
      }
    ).then((response) => {
        toast.success("Successfully Created Master Sub Module");
        setTimeout(
          () =>
            this.props.history.push("/admin/Viewmastersubclinicpagemodules"),
          2000
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateMasterSubPageModule = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;

    console.clear();
    console.log('Fields for Update.....');
    console.log(fields);

    Httpconfig.httptokenput(
      Constant.siteurl + "api/masterSubModuleClinicPage/" + handle,
      {
        clinic_id: fields["clinic_id"],
        page_module_id: fields["page_module_id"],
        page_module_sequence_id: fields["page_module_sequence_id"],
        sub_module_sequence_id: fields["sub_module_sequence_id"],
        sub_module_id: fields["sub_module_id"],
        master_module_sequence_id: fields["master_module_sequence_id"],
        master_module_id: fields["master_module_id"],
        status: fields["status"],
      }
    ).then((response) => {
        toast.success("Successfully Updated Master Clinic Page Module");
        setTimeout(
          () =>
            this.props.history.push("/admin/Viewmastersubclinicpagemodules"),
          2000
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["clinic_id"]) {
      formIsValid = false;
      errors["clinic_id"] = "Clinic name cannot be empty";
    }

    if (!fields["master_module_id"]) {
      formIsValid = false;
      errors["master_module_id"] = "Master module name cannot be empty";
    }
    
    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
    const {
      fields,
      errors,
      masterModule,
      masterSubModule,
      clinic_details,
      masterPageModule,
    } = this.state;

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
                      <a> Master Sub Clinic Page Module </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Master Sub Clinic Page Module</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <select
                                  name="clinic_id"
                                  className="form-control"
                                  value={this.state.fields["clinic_id"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "clinic_id"
                                  )}
                                >
                                  <option value="">Select</option>
                                  {clinic_details &&
                                    clinic_details.map((clinic_details, i) => {
                                      return (
                                        <option value={clinic_details.id}>
                                          {clinic_details.clinic_name}
                                        </option>
                                      );
                                    })}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["clinic_id"]}
                                </span>
                              </div>
                            </div>
                        
                            <div className="col-md-4">
                              <div className="form-group">
                                <select
                                  name="master_module_id"
                                  className="form-control"
                                  value={
                                    this.state.fields["master_module_id"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "master_module_id"
                                  )}
                                >
                                  <option value="">Select</option>
                                  {masterModule &&
                                    masterModule.map((masterModule, i) => {
                                      return (
                                        <option value={masterModule.id}>
                                          {masterModule.module_name}
                                        </option>
                                      );
                                    })}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["master_module_id"]}
                                </span>
                              </div>

                             
                            </div>
                            <div class="col-md-4">
                            <div className="form-group">
                              <input
                                  type="ftext"
                                  name="master_module_sequence_id"
                                  className="form-control"
                                  value={
                                    this.state.fields["master_module_sequence_id"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "master_module_sequence_id"
                                  )}
                                  placeholder="Master Module Sequence Id"
                                />
                               </div>
                            </div>
                        
                          </div>

                          <div className="row">
                           
                          <div className="col-md-4">
                              <div className="form-group ">
                                <select
                                  name="sub_module_id"
                                  className="form-control"
                                  value={
                                    this.state.fields["sub_module_id"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "sub_module_id"
                                  )}
                                >
                                  <option value="">Select</option>
                                  {masterSubModule &&
                                    masterSubModule.map(
                                      (masterSubModule, i) => {
                                        return (
                                          <option value={masterSubModule.id}>
                                            {masterSubModule.sub_module_name}
                                          </option>
                                        );
                                      }
                                    )}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["sub_module_id"]}
                                </span>
                              </div>
                             
                            </div>


                            <div class="col-md-4">
                            <div className="form-group">
                              <input
                                  type="ftext"
                                  name="sub_module_sequence_id"
                                  className="form-control"
                                  value={
                                    this.state.fields["sub_module_sequence_id"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "sub_module_sequence_id"
                                  )}
                                  placeholder="Sub Module Sequence Id"
                                />
                               </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <select
                                  name="page_module_id"
                                  className="form-control"
                                  value={this.state.fields["page_module_id"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "page_module_id"
                                  )}
                                >
                                  <option value="">Select</option>
                                  {masterPageModule &&
                                    masterPageModule.map(
                                      (masterPageModule, i) => {
                                        return (
                                          <option
                                            value={masterPageModule.id}
                                          >
                                            {masterPageModule.page_name}
                                          </option>
                                        );
                                      }
                                    )}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["page_name"]}
                                </span>
                              </div>
                             
                            </div>

                          </div>

                         
                      <div class="row">
                        
                      <div class="col-md-4">

<div className="form-group ">
 <input
     type="ftext"
     name="page_module_sequence_id"
     className="form-control"
     value={
       this.state.fields["page_module_sequence_id"] || ""
     }
     onChange={this.handleChange.bind(
       this,
       "page_module_sequence_id"
     )}
     placeholder="Page Module Sequence Id"
   />
  </div>

</div>

<div className="col-md-4">
 <div className="form-group ">
   <label
     for="customRadio2"
     class="custom-control-label"
   >
     Page Status
   </label>
   <div
     class="custom-control custom-radio"
     onChange={this.handleChange.bind(
       this,
       "status"
     )}
   >
     <input
       type="radio"
       value="1"
       checked={this.state.fields["status"] == "1"}
       name="status"
     />{" "}
     Active &nbsp;&nbsp;&nbsp;
     <input
       type="radio"
       value="0"
       checked={this.state.fields["status"] == "0"}
       name="status"
     />{" "}
     In Active
   </div>
 </div>
</div>
                      </div>
                          

                          <div className="row">
                            <div className="form-group col-md-12">
                              <button
                                type="submit"
                                className="btn  btn-primary save_btn"
                              >
                                Save Master Sub Clinic Page Module
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/Viewmastersubclinicpagemodules"
                                className="cancel_btn"
                              >
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
    );
  }
}
