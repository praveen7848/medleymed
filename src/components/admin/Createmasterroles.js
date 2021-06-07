import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Link } from "react-router-dom";

export default class Createmasterroles extends Component {
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
    this.getMasterRoleInfo(handle);
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  // To get all the ResponderInfo
  getMasterRoleInfo(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/masterRoles/" + handle)
      //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
      .then((response) => {
        console.log(response);
        this.setState({
          fields: {
            role_name: response.data.data[0].role_name,
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
      this.updateMasterRole(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createMasterRole(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  // creates new controller
  createMasterRole = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    Httpconfig.httptokenpost(Constant.siteurl + "api/masterRoles", {
      name: fields["name"],
      status: fields["status"],
    })
      .then((response) => {
        toast.success("Successfully Created Master Role");
        setTimeout(
          () => this.props.history.push("/admin/Viewmasterroles"),
          2000
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateMasterRole = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;
    Httpconfig.httptokenput(Constant.siteurl + "api/masterRoles/" + handle, {
      role_name: fields["role_name"],
      status: fields["status"],
    })
      .then((response) => {
        toast.success("Successfully Updated Master Role");
        setTimeout(
          () => this.props.history.push("/admin/Viewmasterroles"),
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

    if (!fields["role_name"]) {
      formIsValid = false;
      errors["role_name"] = "Master Role name cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
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
                      <a> Master Role </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Master Role</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <input
                                  type="ftext"
                                  name="role_name"
                                  className="form-control"
                                  value={this.state.fields["role_name"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "role_name"
                                  )}
                                  placeholder="Role Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["role_name"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <label
                                  for="customRadio2"
                                  class="custom-control-label"
                                >
                                  Status
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
                            <div className="form-group col-md-8">
                              <button
                                type="submit"
                                className="btn  btn-primary padTopCategorySave fright"
                              >
                                Save Master Role
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/Viewmasterroles"
                                className="padTopCategorySave hrefCategory fright"
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
