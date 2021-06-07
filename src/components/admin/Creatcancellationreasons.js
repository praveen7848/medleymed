import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Link } from "react-router-dom";

export default class Creatcancellationreasons extends Component {
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
    this.getReasonInfo(handle);
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  // To get all the ResponderInfo
  getReasonInfo(handle) {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/OM/cancellationReason/" + handle
    )
      //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
      .then((response) => {
        console.log(response);
        this.setState({
          fields: {
            reason: response.data.data[0].reason,
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
      this.updateCancellationReason(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createCancellationReason(event);
    } else {
      toast.warn("Form has errors.");
    }
  }

  // creates new controller ---------------
  createCancellationReason = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/cancellationReason/", {
      reason: fields["reason"],
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.status == 200 && response.data.error == false) {
          toast.success("Successfully Created Cancellation Reason");
          setTimeout(
            () => this.props.history.push("/admin/Viewcancellationreasons"),
            2000
          );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateCancellationReason = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;

    Httpconfig.httptokenput(
      Constant.siteurl + "api/OM/cancellationReason//" + handle,
      {
        reason: fields["reason"],
      }
    )
      .then((response) => {
        if (response.data.status == 200 && response.data.error == false) {
          toast.success("Successfully Updated Cancellation Reason");
          setTimeout(
            () => this.props.history.push("/admin/Viewcancellationreasons"),
            2000
          );
        } else {
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

    if (!fields["reason"]) {
      formIsValid = false;
      errors["reason"] = "reason cannot be empty";
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
                      <a> Cancellation Reason </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Cancellation reason</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                           <div class="col-md-4">
                              <label>Reason Name</label>
                              <div className="form-group">
                                <input
                                  type="ftext"
                                  name="reason"
                                  className="form-control"
                                  value={this.state.fields["reason"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "reason"
                                  )}
                                  placeholder="Reason"
                                />
                                <span className="cRed">
                                  {this.state.errors["reason"]}
                                </span>
                              </div>
                          </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-8">
                              <button
                                type="submit"
                                className="btn  btn-primary save_btn"
                              >
                                Save Reason
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/Viewcancellationreasons"
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
