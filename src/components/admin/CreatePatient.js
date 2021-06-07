import React, { Component, useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import { Multiselect } from "multiselect-react-dropdown";
import axios from "axios";
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigAdmin";
var Constant = require("../../constants");

export default class CreatePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dob: '',
      fields: {},
      errors: {},
      selectedDiagnosisValue: [],
      selectedMedicineList: {},
      selectedMedicineValue: [],
    };
  }

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    if (field == "chat" || field == "audio" || field == "video") {
      fields[field] = event.target.checked;
    } else {
      fields[field] = event.target.value;
    }
    this.setState({ fields });
  };
  setStartTimeOnChange = (value) => {
    this.setState({ dob: value });
  };

  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleValidation() && handle) {
      this.updatePatient(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createPatient(event);
    } else {
      toast.warn("Form has errors.");
    }
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    var pattern = /^[a-zA-Z0-9]{3,20}$/g;
    if (!fields["email_id"]) {
      formIsValid = false;
      errors["email_id"] = "Email cannot be empty";
    } else if (typeof fields["email_id"] !== "undefined") {
      let lastAtPos = fields["email_id"].lastIndexOf("@");
      let lastDotPos = fields["email_id"].lastIndexOf(".");
      if ( !( lastAtPos < lastDotPos && lastAtPos > 0 && fields["email_id"].indexOf("@@") == -1 && lastDotPos > 2 && fields["email_id"].length - lastDotPos > 2 ) ) {
        formIsValid = false;
        errors["email_id"] = "Email is invalid";
      }
    }
    if (!fields["phone"]) {
      formIsValid = false;
      errors["phone"] = "Phone number cannot be empty";
    } else if (fields["phone"].length < 10) {
	  formIsValid = false;
      errors["phone"] = "Phone number invalid";
    }
    if (!fields["password_main"]) {
      formIsValid = false;
      errors["password_main"] = "Password cannot be empty";
    } else if ( fields["password_main"].length < 8 || fields["password_main"].length > 20 ) {
	  formIsValid = false;
      errors["password_main"] = "Password shuold contain 8-20 characters";
    } else if ( !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20}$/.exec( fields["password_main"] ) ) {
	  formIsValid = false;
      errors["password_main"] = "Required one upper case, one small case, one number and one special character";
    }
    if (!fields["rpassword"]) {
      formIsValid = false;
      errors["rpassword"] = "Retype Password";
    } else if (fields["rpassword"] != fields["password_main"]) {
	  formIsValid = false;
      errors["rpassword"] = "Password Mismatch";
    }
    if (!fields["first_name"]) {
      formIsValid = false;
      errors["first_name"] = "Enter your First Name";
    } else if (!/^[a-zA-Z0-9]{3,20}$/g.exec(fields["first_name"])) {
	  formIsValid = false;
      errors["first_name"] = "Special characters not allowed";
    }
    if (!fields["last_name"]) {
      formIsValid = false;
      errors["last_name"] = "Enter your Last Name";
    } else if (!/^[a-zA-Z0-9]{3,20}$/g.exec(fields["last_name"])) {
	  formIsValid = false;
      errors["last_name"] = "Special characters not allowed";
    }
    if (!this.state.dob) {
      formIsValid = false;
      errors["dob"] = "Date of Birth cannot be empty";
    }/* else {
		var ageDiff = Date.now() - this.state.dob;
		var ageDate = new Date(ageDiff); // miliseconds from epoch
		if(Math.abs(ageDate.getUTCFullYear() - 1970)) {
			formIsValid = false;
		}
	}*/
    if (!fields["gender"]) {
      formIsValid = false;
      errors["gender"] = "Select Gender";
    }
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "Address cannot be empty";
    }
    if (!fields["state"]) {
      formIsValid = false;
      errors["state"] = "State cannot be empty";
    }
    if (!fields["zip_code"]) {
      formIsValid = false;
      errors["zip_code"] = "Enter Zip Code";
    }
    if (!fields["marital_status"]) {
      formIsValid = false;
      errors["marital_status"] = "Select Marital Status";
    }
    if (!fields["nationality"]) {
      formIsValid = false;
      errors["nationality"] = "Enter Nationality";
    }
    if (!fields["occupation"]) {
      formIsValid = false;
      errors["occupation"] = "Enter Occupation";
    }
    if (!fields["adhaar_no"]) {
      formIsValid = false;
      errors["adhaar_no"] = "Enter Adhaar No";
    }
    if (!fields["arogya_sri_no"]) {
      formIsValid = false;
      errors["arogya_sri_no"] = "Enter Arogya Sri No";
    }


    this.setState({ errors: errors });
    return formIsValid;
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.getPatientInfo(handle);
  };

  // To add new category when user submits the form
  createPatient = (event) => {
    event.preventDefault();
    var handle = this.props.match.params.handle;
    const { fields, errors } = this.state;
   
    Httpconfig.httptokenpost(Constant.siteurl + "api/Users/", {
      email: fields["email_id"],
      mobile_no: fields["phone"],
      address: fields["address"],
      zip_code: fields["zip_code"],
      state: fields["state"],
      password: fields["password_main"],
      user_type: "patient",
      status: 1,
      first_name: fields["first_name"],
      last_name: fields["last_name"],
      gender: fields["gender"],
      dob: this.state.dob,
      //profile_pic: fields['profile_pic'],
      marital_status: fields["marital_status"] ,
      nationality: fields["nationality"] ,
      occupation: fields["occupation"],
      adhaar_no: fields["adhaar_no"],
      arogya_sri_no: fields["arogya_sri_no"],
     
    })
      .then((response) => {
        toast.success("Successfully Created Patient");
        setTimeout(() => this.props.history.push("/admin/PatientRegistration"), 2000);
        //this.props.history.push('/SetDoNotDisturb/'+handle);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  //To get all the PatientInfo
  getPatientInfo(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/Users/Patient/" + handle)
      .then((response) => {
        console.log(response.data[0]);
        this.setState({ dob: new Date(response.data[0].patient_tbl.dob) });
        this.setState({
          fields: {
            email_id: response.data[0].email,
            phone: response.data[0].mobile_number,
            password_main: response.data[0].password,
            rpassword: response.data[0].password,
            first_name: response.data[0].patient_tbl.first_name,
            last_name: response.data[0].patient_tbl.last_name,
            gender: response.data[0].patient_tbl.gender,
            address: response.data[0].patient_tbl.address,
            zip_code: response.data[0].patient_tbl.zip_code,
            state: response.data[0].patient_tbl.state,
            marital_status: response.data[0].patient_tbl.marital_status,
            nationality: response.data[0].patient_tbl.nationality,
            occupation: response.data[0].patient_tbl.occupation,
            adhaar_no: response.data[0].patient_tbl.adhaar_no,
            arogya_sri_no: response.data[0].patient_tbl.arogya_sri_no,
          },
        });

      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  }
  // To add new Responder when user submits the form
  updatePatient = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const data = this.state.fields;
    data["dob"] = this.state.dob;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/Users/UpdatePatient/" + handle,
      {
        data,
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Patient");
        setTimeout(() => this.props.history.push("/admin/PatientRegistration"), 2000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };
  render() {
    const { fields, errors } = this.state;
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
                      <Link to="/admin/PatientRegistration"> Patients</Link>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Patient</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="email_id" value={this.state.fields["email_id"] || ""} onChange={this.handleChange.bind(this, "email_id")} className="form-control" placeholder="Email ID" />
                                <span className="cRed">
                                  {this.state.errors["email_id"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="phone" value={this.state.fields["phone"] || ""} onChange={this.handleChange.bind(this, "phone")} className="form-control" placeholder="Phone Number" />
                                <span className="cRed">
                                  {this.state.errors["phone"]}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="password" name="password_main" value={this.state.fields["password_main"] || ""} onChange={this.handleChange.bind(this, "password_main")} className="form-control" placeholder="Enter Password" />
                                <span className="cRed">
                                  {this.state.errors["password_main"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="password" name="rpassword" value={this.state.fields["rpassword"] || ""} onChange={this.handleChange.bind(this, "rpassword")} className="form-control" placeholder="Retype Password" />
                                <span className="cRed">
                                  {this.state.errors["rpassword"]}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="first_name" value={this.state.fields["first_name"] || ""} onChange={this.handleChange.bind(this, "first_name")} className="form-control" placeholder="First Name" />
                                <span className="cRed">
                                  {this.state.errors["first_name"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="last_name" value={this.state.fields["last_name"] || ""} onChange={this.handleChange.bind(this, "last_name")} className="form-control" placeholder="Last Name" />
                                <span className="cRed">
                                  {this.state.errors["last_name"]}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <select name="gender" onChange={this.handleChange.bind(this, "gender")} value={this.state.fields["gender"] || ""} className="form-control" >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                    <span className="cRed">
                                      {this.state.errors["gender"]}
                                    </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                    <DatePicker name="dob" autoComplete="off" className="dateInput" placeholderText="Click to select Date of Birth"  selected={this.state.dob} onChange={this.setStartTimeOnChange} dateFormat="MMMM d, yyyy" calendarIcon showMonthDropdown showYearDropdown adjustDateOnChange /><br />
                                    <span className="cRed">
                                      {this.state.errors["dob"]}
                                    </span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                              <div className="col-md-4">
                                <div className="form-group ">
                                  <input type="text" name="address" value={this.state.fields["address"] || ""} onChange={this.handleChange.bind(this, "address")} className="form-control" placeholder="Address" />
                                  <span className="cRed">
                                    {this.state.errors["address"]}
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group ">
                                  <input type="text" name="state" value={this.state.fields["state"] || ""} onChange={this.handleChange.bind(this, "state")} className="form-control" placeholder="State" />
                                  <span className="cRed">
                                    {this.state.errors["state"]}
                                  </span>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="form-group ">
                                  <input type="text" name="zip_code" value={this.state.fields["zip_code"] || ""} onChange={this.handleChange.bind(this, "zip_code")} className="form-control" placeholder="Zip Code" />
                                  <span className="cRed">
                                    {this.state.errors["zip_code"]}
                                  </span>
                                </div>
                              </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <select name="marital_status" onChange={this.handleChange.bind(this, "marital_status")} value={this.state.fields["marital_status"] || ""} className="form-control" >
                                  <option value="">Select Marital Status</option>
                                  <option value="single">Single</option>
                                  <option value="married">Married</option>
                                  <option value="divorced">Divorced </option>
                                  <option value="others">Others </option>
                                </select>
                                    
                                <span className="cRed">
                                  {this.state.errors["marital_status"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="nationality" value={this.state.fields["nationality"] || ""} onChange={this.handleChange.bind(this, "nationality")} className="form-control" placeholder="Nationality" />
                                <span className="cRed">
                                  {this.state.errors["nationality"]}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="occupation" value={this.state.fields["occupation"] || ""} onChange={this.handleChange.bind(this, "occupation")} className="form-control" placeholder="Occupation" />
                                <span className="cRed">
                                  {this.state.errors["occupation"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="adhaar_no" value={this.state.fields["adhaar_no"] || ""} onChange={this.handleChange.bind(this, "adhaar_no")} className="form-control" placeholder="Adhaar Nno" />
                                <span className="cRed">
                                  {this.state.errors["adhaar_no"]}
                                </span>
                              </div>
                            </div>
                          </div>
                           
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input type="text" name="arogya_sri_no" value={this.state.fields["arogya_sri_no"] || ""} onChange={this.handleChange.bind(this, "arogya_sri_no")} className="form-control" placeholder="Arogya Sri No" />
                                <span className="cRed">
                                  {this.state.errors["arogya_sri_no"]}
                                </span>
                              </div>
                            </div>
                          </div>
                         
                          <div className="row"> 
                            <div className="form-group col-md-12">
                              <button type="submit" className="btn  btn-primary save_btn" > Save Patient </button>{" "} &nbsp;
                              <Link to="/admin/PatientRegistration" className="cancel_btn" > Cancel </Link>{" "} &nbsp; &nbsp;
                            </div>
                          </div>
                        </form>
                        <ToastContainer />
                      </div>
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
