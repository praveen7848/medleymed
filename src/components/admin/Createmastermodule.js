import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Link } from "react-router-dom";

import FileBase64 from "react-file-base64";
const imgurl = "http://3.7.234.106:8100";

export default class Createmastermodule extends Component {
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
    this.getMasterModuleInfo(handle);
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  // To get all the ResponderInfo
  getMasterModuleInfo(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterModules/" + handle)
      //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
      .then((response) => {
        console.log(response);
        this.setState({
          fields: {
            module_name: response.data.data[0].module_name,
            sequence_id: response.data.data[0].sequence_id,
            status: response.data.data[0].status,
            image_path: response.data.data[0].image_path,
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
      this.updateMasterModule(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createMasterModule(event);
    } else {
      toast.warn("Form has errors.");
    }
  }

  getMasterModuleImageFile(files) {
    this.setState({ 
      fields: {
        image_path: files,
        module_name: this.state.fields.module_name,
        sequence_id: this.state.fields.sequence_id,
        status: this.state.fields.status,
       },
    });
  }

  // creates new controller
  createMasterModule = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    let masterModuleLogo = "";
    if (this.state.fields.image_path != undefined) {
      masterModuleLogo = this.state.fields.image_path[0];
    }
    
    // console.clear();
    // console.log("Fields >>>");
    // console.log(fields);
    // console.log(masterModuleLogo);
    // return;
    

    Httpconfig.httptokenpost(Constant.siteurl + "api/masterModules", {
      module_name: fields["module_name"],
      sequence_id: fields["sequence_id"],
      status: fields["status"],
      image_path: masterModuleLogo,
    })
      .then((response) => {
         console.log(response.data);
         if(response.data.status == 200 && response.data.error == false){
           toast.success("Successfully Created Master Module");
            setTimeout(
              () => this.props.history.push("/admin/Viewmastermodules"),
              2000
            );
         }else{
          toast.error(response.data.message);
         }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateMasterModule = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;

    let masterModuleLogo = "";
    if (this.state.fields.image_path != undefined) {
     // alert(this.state.fields.image_path[0]);
      if(this.state.fields.image_path[0]=="/"){
        masterModuleLogo ="";
      }else{
      masterModuleLogo = this.state.fields.image_path[0];
      }
    }

    // console.clear();
    // console.log("Fields >>>");
    // console.log(fields);
    // return;

    Httpconfig.httptokenput(Constant.siteurl + "api/masterModules/" + handle, {
      module_name: fields["module_name"],
      sequence_id: fields["sequence_id"],
      status: fields["status"],
      image_path: masterModuleLogo,
    })
      .then((response) => {
        if(response.data.status == 200 && response.data.error == false){
          toast.success("Successfully Updated Master Module");
        setTimeout(
          () => this.props.history.push("/admin/Viewmastermodules"),
          2000
        );
        }else{
         toast.error(response.data.message);
        }
        
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

    if (!fields["module_name"]) {
      formIsValid = false;
      errors["module_name"] = "Master module name cannot be empty";
    }
    if (!fields["sequence_id"]) {
      formIsValid = false;
      errors["sequence_id"] = "Sequence Id cannot be empty";
    }
    if (!fields["status"]) {
      formIsValid = false;
      errors["status"] = "Status cannot be empty";
    }
    if(!this.state.fields.image_path){
      formIsValid = false;
      errors["image_path"] = "Image cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {

    let moduleLogoImage = "";
    if (this.state.fields.image_path) {
      let imageName = this.state.fields.image_path;
      moduleLogoImage = imgurl + imageName;
    }

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
                      <a> Master Module </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Master Module</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-6">
                            <label>Module Name</label>
                              <div className="form-group">
                                <input
                                  type="ftext"
                                  name="module_name"
                                  className="form-control"
                                  value={this.state.fields["module_name"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "module_name"
                                  )}
                                  placeholder="Module Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["module_name"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-6">
                            <label>Module Sequence</label>
                              <div className="form-group">
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
                            <label>Status</label>
                              <div className="form-group">
                                {/* <label
                                  for="customRadio2"
                                  class="custom-control-label"
                                >
                                  Status
                                </label> */}
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

                            <div className="form-group col-md-8">
                              <FileBase64
                                multiple={true}
                                onDone={this.getMasterModuleImageFile.bind(this)}
                              />
                              <div class="upload_imgs">
                              <img src={moduleLogoImage} />
                              <img src={moduleLogoImage} />
                              </div>
                            </div>
                            <span className="cRed">
                                  {this.state.errors["image_path"]}
                                </span>
                          </div>


                          <div className="row">
                            <div className="form-group col-md-12">
                              <button
                                type="submit"
                                className="btn btn-primary save_btn"
                              >
                                Save Master Module
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/Viewmastermodules"
                                className=" cancel_btn"
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
