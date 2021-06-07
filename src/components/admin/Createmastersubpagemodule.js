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
    };
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.getMasterSubPageModuleInfo(handle);
    this.getMastermoduleDetails();
    this.getMastersubmoduleDetails();
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  // Get Timezone
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

  // Get Timezone
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

  // To get all the ResponderInfo
  getMasterSubPageModuleInfo(handle) {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/masterSubModulePage/" + handle
    )
      //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
      .then((response) => {
        console.log(response);
        this.setState({
          fields: {
            master_module_id: response.data.data[0].master_module_id,
            sub_module_id: response.data.data[0].sub_module_id,
            
            page_name: response.data.data[0].page_name,
            web_reference_page_name: response.data.data[0].web_reference_page_name,
            mobile_reference_page_name: response.data.data[0].mobile_reference_page_name,

            sequence_id: response.data.data[0].sequence_id,
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
    Httpconfig.httptokenpost(Constant.siteurl + "api/masterSubModulePage", {
      master_module_id: fields["master_module_id"],
      sub_module_id: fields["sub_module_id"],
      
      page_name: fields["page_name"],
      web_reference_page_name: fields["web_reference_page_name"],
      mobile_reference_page_name: fields["mobile_reference_page_name"],

      sequence_id: fields["sequence_id"],
      status: fields["status"],
    })
      .then((response) => {
        toast.success("Successfully Created Master Sub Module");
        setTimeout(
          () => this.props.history.push("/admin/Viewmastersubpagemodules"),
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
    Httpconfig.httptokenput(
      Constant.siteurl + "api/masterSubModulePage/" + handle,
      {
        master_module_id: fields["master_module_id"],
        sub_module_id: fields["sub_module_id"],
        
        page_name: fields["page_name"],
        web_reference_page_name: fields["web_reference_page_name"],
        mobile_reference_page_name: fields["mobile_reference_page_name"],

        sequence_id: fields["sequence_id"],
        status: fields["status"],
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Master Page Module");
        setTimeout(
          () => this.props.history.push("/admin/Viewmastersubpagemodules"),
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
    
    if (!fields["master_module_id"]) {
      formIsValid = false;
      errors["master_module_id"] = "Master module name cannot be empty";
    }
    // if (!fields["sub_module_id"]) {
    //   formIsValid = false;
    //   errors["sub_module_id"] = "Sub Module name cannot be empty";
    // }
    if (!fields["page_name"]) {
      formIsValid = false;
      errors["page_name"] = "Page name cannot be empty";
    }
    if (!fields["web_reference_page_name"]) {
      formIsValid = false;
      errors["web_reference_page_name"] = "Web Page cannot be empty";
    }
    if (!fields["mobile_reference_page_name"]) {
      formIsValid = false;
      errors["mobile_reference_page_name"] = "Mobile Page cannot be empty";
    }
    if (!fields["sequence_id"]) {
      formIsValid = false;
      errors["sequence_id"] = "Sequence Id cannot be empty";
    }
    if (!fields["status"]) {
      formIsValid = false;
      errors["status"] = "Status cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
    const { fields, errors, masterModule, masterSubModule } = this.state;
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
                      <a> Master Sub Page Module </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Master Sub Page Module</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                            
                              <div className="form-group ">
                              <label>Select Module</label>
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
                         
                            <div className="col-md-4">
                            
                              <div className="form-group ">
                              <label>Select Sub Module</label>
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
                                {/* <span className="cRed">
                                  {this.state.errors["sub_module_id"]}
                                </span> */}
                              </div>
                            </div>
                         
                            <div className="col-md-4">
                            
                              <div className="form-group ">
                              <label>Enter Page Name</label>
                                <input
                                  type="ftext"
                                  name="page_name"
                                  className="form-control"
                                  value={this.state.fields["page_name"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "page_name"
                                  )}
                                  placeholder="Page Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["page_name"]}
                                </span>
                              </div>
                            </div>
                          </div>


                          <div className="row">
                            <div className="col-md-4">
                            
                              <div className="form-group">
                              <label>Enter Web Page Reference Name</label>
                                <input
                                  type="ftext"
                                  name="web_reference_page_name"
                                  className="form-control"
                                  value={this.state.fields["web_reference_page_name"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "web_reference_page_name"
                                  )}
                                  placeholder="Web Reference Page Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["web_reference_page_name"]}
                                </span>
                              </div>
                            </div>
                         
                            <div className="col-md-4">
                            
                              <div className="form-group ">
                              <label>Enter Mobile Page Reference Name</label>
                                <input
                                  type="ftext"
                                  name="mobile_reference_page_name"
                                  className="form-control"
                                  value={
                                    this.state.fields["mobile_reference_page_name"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "mobile_reference_page_name"
                                  )}
                                  placeholder="Mobile Reference Page Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["mobile_reference_page_name"]}
                                </span>
                              </div>
                            </div>
                         
                            <div className="col-md-4">
                            
                              <div className="form-group">
                              <label>Enter Page Sequence Id</label>
                                <input
                                  type="ftext"
                                  name="sequence_id"
                                  className="form-control"
                                  value={this.state.fields["sequence_id"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "sequence_id"
                                  )}
                                  placeholder="Sequence Id"
                                />
                                <span className="cRed">
                                  {this.state.errors["sequence_id"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                            
                              <div className="form-group ">
                                {/* <label
                                  for="customRadio2"
                                  class="custom-control-label"
                                >
                                  Status
                                </label> */}
                                 <label>Page Status</label>
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
                                <span className="cRed">
                                  {this.state.errors["status"]}
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
                                Save Master Sub Page Module
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/Viewmastersubpagemodules"
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
