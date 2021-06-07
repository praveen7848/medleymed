import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Link } from "react-router-dom";
import FileBase64 from "react-file-base64";
const imgurl = "http://3.7.234.106:8100";

export default class Createmastersubmodule extends Component {
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
    this.getMasterSubModuleInfo(handle);
    this.getMastermoduleDetails();
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  getMasterModuleImageFile(files) {
    this.setState({ 
      fields: {
          image_path: files,
          module_name: this.state.fields.module_name,
          master_module_id: this.state.fields.master_module_id,
          sub_module_name: this.state.fields.sub_module_name,
          tag_line: this.state.fields.tag_line,
          sequence_id: this.state.fields.sequence_id,
          status: this.state.fields.status,
       },
    });
  }

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

  // To get all the ResponderInfo
  getMasterSubModuleInfo(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterSubModule/" + handle)
      //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
      .then((response) => {
        console.log(response);
        this.setState({
          fields: {
            master_module_id: response.data.data[0].master_module_id,
            sub_module_name: response.data.data[0].sub_module_name,
            tag_line: response.data.data[0].tag_line,
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
      this.updateMasterSubModule(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createMasterSubModule(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  // creates new controller
  createMasterSubModule = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    let masterModuleLogo = "";
    if (this.state.fields.image_path != undefined) {
      masterModuleLogo = this.state.fields.image_path[0];
    }

    Httpconfig.httptokenpost(Constant.siteurl + "api/masterSubModule", {
      master_module_id: fields["master_module_id"],
      sub_module_name: fields["sub_module_name"],
      tag_line: fields["tag_line"],
      sequence_id: fields["sequence_id"],
      status: fields["status"],
      image_path: masterModuleLogo,
    })
      .then((response) => {
        toast.success("Successfully Created Master Sub Module");
        setTimeout(
          () => this.props.history.push("/admin/ViewMasterSubModules"),
          2000
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateMasterSubModule = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;
    let masterModuleLogo = "";
    
    // console.clear();
    // console.log(this.state.fields.image_path[0]);
    // console.log(masterModuleLogo);
    // console.log(this.state.fields);
    
    if (this.state.fields.image_path != undefined && this.state.fields.image_path[0] != undefined ) {
       masterModuleLogo = this.state.fields.image_path[0];
    }
    console.log(masterModuleLogo);
    
    Httpconfig.httptokenput(
      Constant.siteurl + "api/masterSubModule/" + handle,
      {
        master_module_id: fields["master_module_id"],
        sub_module_name: fields["sub_module_name"],
        tag_line: fields["tag_line"],
        image_path: masterModuleLogo,
        sequence_id: fields["sequence_id"],
        status: fields["status"],
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Master Module");
        setTimeout(
          () => this.props.history.push("/admin/ViewMasterSubModules"),
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
    // if (!fields["tag_line"]) {
    //   formIsValid = false;
    //   errors["tag_line"] = "Tag line cannot be empty";
    // }
    if (!fields["sub_module_name"]) {
      formIsValid = false;
      errors["sub_module_name"] = "Master sub module name cannot be empty";
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
    const { fields, errors, masterModule } = this.state;

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
                      <a> Master Sub Module </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Master Sub Module</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                            <label>Select Module</label>
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
                        
                            <div className="col-md-4">
                            <label>Select Sub Module</label>
                              <div className="form-group ">
                                <input
                                  type="ftext"
                                  name="sub_module_name"
                                  className="form-control"
                                  value={
                                    this.state.fields["sub_module_name"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "sub_module_name"
                                  )}
                                  placeholder="Module Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["sub_module_name"]}
                                </span>
                              </div>
                            </div>
                         
                            <div className="col-md-4">
                            <label>Select Tag Line</label>
                              <div className="form-group ">
                                <input
                                  type="ftext"
                                  name="tag_line"
                                  className="form-control"
                                  value={this.state.fields["tag_line"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "tag_line"
                                  )}
                                  placeholder="Tag Line"
                                />
                                {/* <span className="cRed">
                                  {this.state.errors["tag_line"]}
                                </span> */}
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                            <label>Enter Sequence</label>
                              <div className="form-group ">
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


                         <div className="col-md-4">
                            <div className="form-group ">
                            <label>Upload Image :</label>
                            <div></div>
                              <FileBase64
                                multiple={true}
                                onDone={this.getMasterModuleImageFile.bind(this)}
                              />
                              <div class="upload_imgs">
                              <img src={moduleLogoImage} />
                              </div>
                              <span className="cRed">
                                  {this.state.errors["image_path"]}
                                </span>
                            </div>
                            </div>
                         
                         
                            <div className="col-md-4">
                            <label>Status</label>
                              <div className="form-group ">
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
                          </div>

                          <div className="row">
                            <div className="form-group col-md-12">
                              <button
                                type="submit"
                                className="btn  btn-primary save_btn"
                              >
                                Save Master Sub Module
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/Viewmastersubmodules"
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
