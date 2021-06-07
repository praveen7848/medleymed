import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Multiselect } from "multiselect-react-dropdown";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

export default class Createretailers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      retailer_data: "",

      options: [],
    };
  }

  setStartTimeOnChange = (value) => {
    this.setState({ registration_expirity: value });
  };

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.getRetailerInfo(handle);
    this.fetchCountryCurrencyDetails();
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  // To get all the ResponderInfo
  getRetailerInfo(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/retailer/" + handle)
      .then((response) => {
        this.setState({
          fields: {
            storename: response.data.data[0].storename,
            mobile_number: response.data.data[0].mobile_number,
            email: response.data.data[0].email,
            password: response.data.data[0].password,
            registration_number: response.data.data[0].registration_number,
            registration_expirity: response.data.data[0].registration_expirity,
            address: response.data.data[0].address,
            latitude: response.data.data[0].latitude,
            longitude: response.data.data[0].longitude,
            currency: response.data.data[0].currency,

            bank_name: response.data.data[0].bank_name,
            account_number: response.data.data[0].account_number,
            account_holder_name: response.data.data[0].account_holder_name,
            ifsc_code: response.data.data[0].ifsc_code,
            upi_number: response.data.data[0].upi_number,
            gst_number: response.data.data[0].gst_number,
            pan_number: response.data.data[0].pan_number,
            commission: response.data.data[0].commission,
            is_active: response.data.data[0].is_active,
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
      this.updateRetailers(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createRetailer(event);
    } else {
      toast.warn("Form has errors.");
    }
  }

  fetchCountryCurrencyDetails() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Country")
      .then((response) => {
        this.setState({
          countryData: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // creates new controller
  createRetailer = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    console.log(this.state);

    Httpconfig.httptokenpost(Constant.siteurl + "api/retailer/", {
      storename: fields["storename"],
      email: fields["email"],
      mobile_number: fields["mobile_number"],
      password: fields["password"],
      registration_expirity: this.state.registration_expirity,
      registration_number: fields["registration_number"],
      address: fields["address"],
      latitude: fields["latitude"],
      longitude: fields["longitude"],
      currency: fields["currency"],

      bank_name: fields["bank_name"],
      account_number: fields["account_number"],
      account_holder_name: fields["account_holder_name"],
      ifsc_code: fields["ifsc_code"],
      upi_number: fields["upi_number"],
      gst_number: fields["gst_number"],
      pan_number: fields["pan_number"],
      commission: fields["commission"],
    })
      .then((response) => {
        if (response.data.status == 200) {
          toast.success("Successfully Created Retailer");
          setTimeout(
            () => this.props.history.push("/admin/Viewretailers"),
            1000
          );
        } else if (response.status == 204) {
          toast.error("Email or Mobile Number already assosiated with us...");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateRetailers = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;

    console.log(this.state);

    Httpconfig.httptokenput(Constant.siteurl + "api/retailer/" + handle, {
      storename: fields["storename"],
      email: fields["email"],
      mobile_number: fields["mobile_number"],
      registration_expirity: this.state.registration_expirity,
      registration_number: fields["registration_number"],
      address: fields["address"],
      latitude: fields["latitude"],
      longitude: fields["longitude"],
      currency: fields["currency"],

      bank_name: fields["bank_name"],
      account_number: fields["account_number"],
      account_holder_name: fields["account_holder_name"],
      ifsc_code: fields["ifsc_code"],
      upi_number: fields["upi_number"],
      gst_number: fields["gst_number"],
      pan_number: fields["pan_number"],
      commission: fields["commission"],
    })
      .then((response) => {
        toast.success("Successfully Updated Retailer");
        setTimeout(() => this.props.history.push("/admin/Viewretailers"), 2000);
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

    if (!fields["storename"]) {
      formIsValid = false;
      errors["storename"] = "Store name cannot be empty";
    }
    if (!fields["mobile_number"]) {
      formIsValid = false;
      errors["mobile_number"] = "Mobile Number cannot be empty";
    }
    if (!fields["registration_number"]) {
      formIsValid = false;
      errors["registration_number"] = "Registration Number cannot be empty";
    }
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
    }
    if (!this.state.registration_expirity) {
      formIsValid = false;
      errors["registration_expirity"] = "Expiry Date cannot be empty";
    }
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Password cannot be empty";
    }
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "Address cannot be empty";
    }
    if (!fields["latitude"]) {
      formIsValid = false;
      errors["latitude"] = "Latitude cannot be empty";
    }
    if (!fields["longitude"]) {
      formIsValid = false;
      errors["longitude"] = "Longitude cannot be empty";
    }

    if (!fields["bank_name"]) {
      formIsValid = false;
      errors["bank_name"] = "Bank Name cannot be empty";
    }
    if (!fields["account_number"]) {
      formIsValid = false;
      errors["account_number"] = "Account Number cannot be empty";
    }
    if (!fields["account_holder_name"]) {
      formIsValid = false;
      errors["account_holder_name"] = "Account Holder cannot be empty";
    }
    if (!fields["ifsc_code"]) {
      formIsValid = false;
      errors["ifsc_code"] = "IFSC Code cannot be empty";
    }
    if (!fields["upi_number"]) {
      formIsValid = false;
      errors["upi_number"] = "UPI cannot be empty";
    }
    if (!fields["gst_number"]) {
      formIsValid = false;
      errors["gst_number"] = "GST Number cannot be empty";
    }
    if (!fields["pan_number"]) {
      formIsValid = false;
      errors["pan_number"] = "PAN Number cannot be empty";
    }
    if (!fields["currency"]) {
      formIsValid = false;
      errors["currency"] = "Currency cannot be empty";
    }
    if (!fields["commission"]) {
      formIsValid = false;
      errors["commission"] = "Commission cannot be empty";
    }

    
    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
    const { fields, errors, coupon_data, countryData } = this.state;
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
                      <a> Retailers </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Retailer </h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="storename"
                                  value={this.state.fields["storename"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "storename"
                                  )}
                                  className="form-control"
                                  placeholder="Store Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["storename"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="mobile_number"
                                  value={
                                    this.state.fields["mobile_number"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "mobile_number"
                                  )}
                                  className="form-control"
                                  placeholder="Mobile Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["mobile_number"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="email"
                                  value={this.state.fields["email"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "email"
                                  )}
                                  className="form-control"
                                  placeholder="Email address"
                                />
                                <span className="cRed">
                                  {this.state.errors["email"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="password"
                                  value={this.state.fields["password"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "password"
                                  )}
                                  className="form-control"
                                  placeholder="Enter Password"
                                />
                                <span className="cRed">
                                  {this.state.errors["password"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="registration_number"
                                  value={
                                    this.state.fields["registration_number"] ||
                                    ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "registration_number"
                                  )}
                                  className="form-control"
                                  placeholder="Registration Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["registration_number"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <DatePicker
                                  name="registration_expirity"
                                  autoComplete="off"
                                  className="dateInput"
                                  placeholderText="Registration Expiry"
                                  selected={this.state.registration_expirity}
                                  onChange={this.setStartTimeOnChange}
                                  dateFormat="yyyy-MM-d"
                                  calendarIcon
                                  showMonthDropdown
                                  adjustDateOnChange
                                />
                                <br />
                                <span className="cRed">
                                  {this.state.errors["registration_expirity"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="address"
                                  value={this.state.fields["address"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "address"
                                  )}
                                  className="form-control"
                                  placeholder="Address"
                                />
                                <span className="cRed">
                                  {this.state.errors["address"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="latitude"
                                  value={this.state.fields["latitude"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "latitude"
                                  )}
                                  className="form-control"
                                  placeholder="Latitude"
                                />
                                <span className="cRed">
                                  {this.state.errors["latitude"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="longitude"
                                  value={this.state.fields["longitude"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "longitude"
                                  )}
                                  className="form-control"
                                  placeholder="Longitude"
                                />
                                <span className="cRed">
                                  {this.state.errors["longitude"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Extra fields Start */}

                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="bank_name"
                                  value={this.state.fields["bank_name"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "bank_name"
                                  )}
                                  className="form-control"
                                  placeholder="Bank Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["bank_name"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="account_number"
                                  value={
                                    this.state.fields["account_number"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "account_number"
                                  )}
                                  className="form-control"
                                  placeholder="Account Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["account_number"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="account_holder_name"
                                  value={
                                    this.state.fields["account_holder_name"] ||
                                    ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "account_holder_name"
                                  )}
                                  className="form-control"
                                  placeholder="Account Holder Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["account_holder_name"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="ifsc_code"
                                  value={this.state.fields["ifsc_code"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "ifsc_code"
                                  )}
                                  className="form-control"
                                  placeholder="IFSC Code"
                                />
                                <span className="cRed">
                                  {this.state.errors["ifsc_code"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="upi_number"
                                  value={this.state.fields["upi_number"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "upi_number"
                                  )}
                                  className="form-control"
                                  placeholder="UPI Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["upi_number"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="gst_number"
                                  value={this.state.fields["gst_number"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "gst_number"
                                  )}
                                  className="form-control"
                                  placeholder="GST Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["gst_number"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="pan_number"
                                  value={this.state.fields["pan_number"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "pan_number"
                                  )}
                                  className="form-control"
                                  placeholder="PAN Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["pan_number"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <select
                                  name="currency"
                                  className="form-control"
                                  value={this.state.fields["currency"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "currency"
                                  )}
                                >
                                  <option value="">Select</option>
                                  {countryData &&
                                    countryData.map((countryData, i) => {
                                      return (
                                        <option
                                          value={countryData.currency_symbol}
                                        >
                                          {countryData.currency_name}
                                        </option>
                                      );
                                    })}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["currency"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="commission"
                                  value={this.state.fields["commission"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "commission"
                                  )}
                                  className="form-control"
                                  placeholder="commission %"
                                />
                                <span className="cRed">
                                  {this.state.errors["commission"]}
                                </span>
                              </div>
                            </div>

                          </div>

                          {/* Ends here */}

                          <div className="row">
                            <div className="form-group col-md-12">
                              <button
                                type="submit"
                                className="btn  btn-primary save_btn"
                              >
                                Save Retailer
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/Viewretailers"
                                className="cancel_btn"
                              >
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
    );
  }
}
