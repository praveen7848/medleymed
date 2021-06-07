import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import Patcss from "../../public/css/patient/order-medicine.css";
import PatientMenu from "../patient/Patientmenu";
import PatientSideMenu from "../patient/Patientsidemenu";
import PatientFooter from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";
import FileBase64 from "react-file-base64";
const moment = require("moment");

const addressDetailsView = [];

export default class ManageAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      add_address_form:"add_address_form collapse-hide",
    };
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    var lang = localStorage.getItem("Language_selected");
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
        this.forceUpdate();
      }
    } else {
      this.state.Language = "en-us";
    }
    var retrievedObject = localStorage.getItem("userObj");
    let userObj = JSON.parse(retrievedObject);
    if (userObj == null) {
      window.location.href = "./patientLogin";
    }
    if (typeof userObj != undefined) {
      this.setState({
        name: userObj.name,
        user_mobile: userObj.mobile_number,
        email_id: userObj.email,
        token: userObj.accessToken,
        patientId: userObj.patient_id,
        profile_image: "",
      });
      this.forceUpdate();
    }

    this.getaddressInfo(userObj.patient_id);
    this.getProfileDetails(userObj.patient_id);
    const interval = setInterval(() => {
      this.getaddressInfo(userObj.patient_id);
    }, 10000);
  };

  getProfileDetails = (patientId) => {
    if (patientId != "") {
      let url_path = "api/Patients/" + patientId;
      let patientDob = "";
      Httpconfig.httptokenget(Constant.siteurl + url_path, {}).then(
        (response) => {
          let patientDob = "";
          if (response.data.status == 200 && response.data.error == false) {
            let PatientGender = response.data.data[0].gender;
            let patientProfileImage = "";
            if (response.data.data[0].profile_pic != null) {
              patientProfileImage =
                Constant.imgurl + response.data.data[0].profile_pic;
            }
            // alert(patientProfileImage);
            this.setState({
              patientProfileImage: patientProfileImage,
              PatientGender: PatientGender,
            });
          }
        }
      );
    }
  };

  removeAddressBox = (e) => {
    const anchor = e.target.closest("a");
    let clickValue = anchor.getAttribute("value");
    let clickName = anchor.getAttribute("name");
    var isConfirm = window.confirm("Are you sure to delete " + clickName + "?");
    if (isConfirm) {
      Httpconfig.httptokendelete(
        Constant.siteurl + "api/OM/deliveryAddress/" + clickValue
      )
        .then((response) => {
          toast.success("Successfully Deleted Manage Address");
          // setTimeout(() => window.location.reload(), 2000);
          this.getaddressInfo(this.state.patientId);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // this.state.patientId
  defaultAddressBox = (e) => {
    const anchor = e.target.closest("a");
    let rowId = anchor.getAttribute("value");
    let clickName = anchor.getAttribute("name");
    let patientId = this.state.patientId; //'7';//
    var isConfirm = window.confirm(
      "Are you sure to set Default address " + clickName + "?"
    );
    if (isConfirm) {
      Httpconfig.httptokenput(
        Constant.siteurl + "api/OM/deliveryAddress/" + patientId + "/" + rowId
      )
        .then((response) => {
          toast.success("Successfully updated the Default Address ");
          this.getaddressInfo(this.state.patientId);
          // setTimeout(() => window.location.reload(), 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  editAddressBox = (e) => {
    const anchor = e.target.closest("a");
    let clickValue = anchor.getAttribute("value");
    let clickName = anchor.getAttribute("name");
    this.state.add_address_form="add_address_form collapse-show";
    Httpconfig.httptokenget(
      Constant.siteurl + "api/OM/deliveryAddress/" + clickValue
    )
      .then((response) => {
        console.clear();
       // console.log(response);
        this.setState({
          fields: {
            patient_id: response.data.data[0].patient_id,
            username: response.data.data[0].name,
            mobile_no: response.data.data[0].mobile_no,
            location: response.data.data[0].location,
            address: response.data.data[0].address,
            landmark: response.data.data[0].landmark,
            latitude: response.data.data[0].latitude,
            longitude: response.data.data[0].longitude,
            address_type: response.data.data[0].address_type,
            isEdit: true,
            rowId: response.data.data[0].id,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // To get all the Patient Addresses
  getaddressInfo(patientId) {
    //patientId = this.state.patientId; //7;
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/OM/deliveryAddress/findAllDeliveryAddress/" +
        patientId
    )
      .then((response) => {
        //console.log(response);
        
        if (response.data.status == "200" && response.data.error == false) {
          
          const addressDetailsView = response.data.data.map(
            (addressDetails, num) => {
              return (
                <div className="add_address_box">
                  <div className="add_address_det">
                    <h2>
                      {addressDetails.name}{" "}
                      <p>({addressDetails.address_type})</p>
                      <span>+{addressDetails.mobile_no}</span>
                    </h2>
                    <h6>
                      {addressDetails.address}
                      {addressDetails.landmark}
                    </h6>
                  </div>
                  <div className="add_address_bar">
                    <li className="nav-item dropdown">
                      <a href="#" id="navbardrop" data-toggle="dropdown">
                        <img src="../images/patient/img/Ordermedicine/blueDottedMenu.svg" />
                      </a>
                      <div className="dropdown-menu">
                        <a
                          className="dropdown-item"
                          name={addressDetails.name}
                          value={addressDetails.id}
                          href="javascript:void(0);"
                          onClick={this.editAddressBox.bind(this)}
                        >
                          Edit
                        </a>
                        <a
                          className="dropdown-item"
                          name={addressDetails.name}
                          value={addressDetails.id}
                          href="javascript:void(0);"
                          onClick={this.defaultAddressBox.bind(this)}
                        >
                          Set as Default
                        </a>
                        <a
                          className="dropdown-item"
                          name={addressDetails.name}
                          value={addressDetails.id}
                          href="javascript:void(0);"
                          onClick={this.removeAddressBox.bind(this)}
                        >
                          Delete
                        </a>
                        {/* onClick={() => this.deleteCoupon(addressDetails.id, addressDetails.coupon_name)} */}
                      </div>
                    </li>
                  </div>
                </div>
              );
            }
          );
          this.setState({
            addressDetailsView: addressDetailsView,
          });
        }
        else if(response.data.status == "401" && response.data.token == false)
        {   
        Httpconfig.httptokenget(Constant.siteurl +"api/Users/logout/"+localStorage.getItem("userID"));
        window.location.href="./patientLogin";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getFiles(files) {
    this.setState({ files: files });
    let patientId = this.state.patientId;
    let patientProfileImage = this.state.files[0].base64;
    this.state.patientProfileImage = patientProfileImage;
    this.forceUpdate();
    Httpconfig.httptokenput(
      Constant.siteurl + "api/Users/uploadimages/" + patientId,
      {
        profile_pic: this.state.files[0].base64,
      }
    )
      .then((response) => {
        toast.success("👌 Profile Image Updated Successfully", {
          position: "bottom-center",
        });
      })
      .catch((error) => {
        this.props.history.push("/patienthealthprofile");
        console.log(error);
        toast.error(error);
      });
  }

  checkSubmit(event) {
    event.preventDefault();
    let isEditEnabled = this.state.fields.isEdit;

    if (isEditEnabled) {
      this.updateAddressModule(event);
    } else {
      this.createAddressModule(event);
    }
    // const { handle } = this.props.match.params;
    // if (this.handleValidation() && handle) {
    //   this.updateAddressModule(event);
    // } else if (this.handleValidation() && handle == undefined) {
    //   this.createAddressModule(event);
    // } else {
    //   toast.warn("Form has errors.");
    // }
  }

  // creates address Module
  createAddressModule = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    let enteredAddress = $('textarea[name="address"]').val();
    this.getLatLangfromAddress(enteredAddress);

    let address_latitude = localStorage.getItem('address_latitude');
    let address_longitude = localStorage.getItem('address_longitude');

    // console.clear();
    // console.log(this.state);
    // console.log(this.state.patientId);
    // return;

    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/deliveryAddress", {
      patient_id: this.state.patientId,
      name: fields["username"],
      mobile_no: fields["mobile_no"],
      location: fields["location"] ? fields["location"] : "asdf",
      address: fields["address"],
      landmark: fields["landmark"],
      latitude: address_latitude ? address_latitude : "17.438976", //fields["latitude"] ? fields["latitude"] : "1",
      longitude: address_longitude ? address_longitude : "78.38905559999999", //fields["longitude"] ? fields["longitude"] : "2",
      address_type: fields["address_type"],
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.status == 200 && response.data.error == false) {
          toast.success("Successfully Created Manage Address");
          this.getaddressInfo(this.state.patientId);
          // setTimeout(
          //   () => this.props.history.push("/patient/manageAddress"),
          //   2000
          // );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateAddressModule = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;
    let rowId = this.state.fields.rowId;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/OM/deliveryAddress/" + rowId,
      {
        patient_id: this.state.patientId,
        name: fields["username"],
        mobile_no: fields["mobile_no"],
        location: fields["location"] ? fields["location"] : "asdf",
        address: fields["address"],
        landmark: fields["landmark"],
        latitude: fields["latitude"] ? fields["latitude"] : "1",
        longitude: fields["longitude"] ? fields["longitude"] : "2",
        address_type: fields["address_type"],
      }
    )
      .then((response) => {
        if (response.data.status == 200 && response.data.error == false) {
          toast.success("Successfully Updated Manage Address");
          // setTimeout(
          //   () => this.props.history.push("/patient/manageAddress"),
          //   2000
          // );
          this.getaddressInfo(this.state.patientId);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  getLatLangfromAddress = (enteredAddress) => {
    var latitude = "";
    var longitude = "";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+enteredAddress+"&key=AIzaSyDf9nNe-DZ5ICYu1tIPqRVfOaAMz16mNfw"
    $.getJSON(url, function (data, textStatus) {
     // console.log(data);
      var responseStatus = data.status;
      if(responseStatus === 'OK'){
         latitude = data.results[0].geometry.location.lat;
         longitude = data.results[0].geometry.location.lng;
          localStorage.setItem("address_latitude", latitude);
          localStorage.setItem("address_longitude", longitude);
      }
    });
    
    let address_latitude = localStorage.getItem('address_latitude');
    let address_longitude = localStorage.getItem('address_longitude');
    if(address_latitude && address_longitude){
    //   console.log(address_latitude+" >> address_latitude ");
    // console.log(address_longitude+" >> address_longitude ");
      this.setState({
        fields: {
          latitude: address_latitude,
          longitude: address_longitude,
        },
      });
      setTimeout(function(){ localStorage.removeItem("address_latitude"); localStorage.removeItem("address_longitude"); }, 2000);
    }
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Name cannot be empty";
    }
    if (!fields["mobile_no"]) {
      formIsValid = false;
      errors["mobile_no"] = "Mobile No cannot be empty";
    }
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "Address cannot be empty";
    }
    if (!fields["address_type"]) {
      formIsValid = false;
      errors["address_type"] = "Address type cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }
  addNewAddress=()=>{
    this.state.add_address_form="add_address_form collapse-show";
  }

  render() {
    return (
      <main id="main_ord_nav">
        {/* ja-jp */}
        {/* en-us */}
        {/* de-de */}
        {/* fr-ca */}
        <PatientHeader onSelectLanguage={this.handleLanguage} />
        <I18nPropvider locale={this.state.Language}>
          <section id="order_profile">
            <div className="appoint_section">
              <div className="container">
                <div className="row">
                  <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                  <PatientSideMenu />
                    {/* <div className="profile_menu_sec" id="pro_menu">
                      <div className="profile_box">
                        {this.state.patientProfileImage != "" ? (
                          <img src={this.state.patientProfileImage} />
                        ) : this.state.PatientGender == "Male" ? (
                          <img src="../images/patient/img/Profile/Male_patient.svg" />
                        ) : (
                          <img src="../images/patient/img/Profile/Female_patient.svg" />
                        )}
                        <a href="#">
                          {" "}
                          <h2 className="edit_avtar">
                            <div className="input-group">
                              <span className="input-group-btn">
                                <span className="btn btn-default btn-file">
                                  <img
                                    src="../images/patient/img/Profile/edit.svg"
                                    onClick={this.uploadProfilePic}
                                  />
                                  <FileBase64
                                    multiple={true}
                                    onDone={this.getFiles.bind(this)}
                                  />
                                </span>
                              </span>
                            </div>
                          </h2>
                        </a>
                        <div className="profile_name_sec">
                          <p className="hello_word">{translate("Hello!")}</p>
                          <p className="doc_name">{this.state.name}</p>
                        </div>
                      </div>
                      <ul class="profile-menu-ul-1">
            <li class=""><a href="/Patientdashboard"><img src="../images/patient/img/Ordermedicine/myAppointment.svg" />{translate('My Appointment')} <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
            <li class="">
                          <a href="/patient/myOrders">
                            <img src="../images/patient/img/Ordermedicine/MyOrder.svg"/>
                            {translate("My Orders")}
                            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
                          </a>
                        </li>
                        <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />My Saved Medicine  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
            <li class="" onClick={this.addPatient}><a href="#"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />{translate('My Profile')}  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
          
          
                        <li class="profile_li">
                          <a href="/patient/manageAddress">
                            <img src="../images/patient/img/Ordermedicine/locationicon.svg" />
                            {translate("Manage Address")}
                            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
                          </a>
                        </li>
                        <h2>Others</h2>
            <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/PrivacyPolicy.svg" />{translate('Privacy Policy')}
            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
            </a></li>
            <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/T&C.svg" />{translate('Terms & Conditions')}
            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
            </a></li>
            
            
            </ul>
                    </div> */}
                  </div>
                  {/* Side Menu Ends here */}

                  <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                    <section id="order_add_address">
                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="add_address_sec">
                              <div className="add_address_head">
                                <h2>Manage Address</h2>
                              </div>
                              <a href="#" onClick={this.addNewAddress}>
                                <div className="add_address_btn">
                                  <p>Add New Address</p>
                                </div>
                              </a>

                              
                                <div className={this.state.add_address_form}>
                                <form onSubmit={this.checkSubmit.bind(this)}>
                                  <div className="form-group">
                                    <div className="row">
                                      <div className="col-md-7">
                                        <label>New User</label>
                                        <input
                                          type="text"
                                          name="username"
                                          value={this.state.fields.username}
                                          className="form-control"
                                          placeholder="Name"
                                          onChange={this.handleChange.bind(
                                            this,
                                            "username"
                                          )}
                                        />
                                        <span className="cRed">
                                          {this.state.errors["username"]}
                                        </span>
                                      </div>

                                      <div className="col-md-5 num_inp">
                                        <label>+91</label>
                                        <input
                                          type="number"
                                          name="mobile_no"
                                          value={
                                            this.state.fields["mobile_no"] || ""
                                          }
                                          className="form-control"
                                          placeholder="Mobile number"
                                          onChange={this.handleChange.bind(
                                            this,
                                            "mobile_no"
                                          )}
                                        />
                                        {/* <span className="cRed">
                                          {this.state.errors["mobile_no"]}
                                        </span> */}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label>Complete Address</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      name="address"
                                      value={this.state.fields["address"] || ""}
                                      placeholder="Enter Full address"
                                      onChange={this.handleChange.bind(
                                        this,
                                        "address"
                                      )}
                                      onBlur={() => this.getLatLangfromAddress.bind(this)}
                                    ></textarea>
                                    {/* <span className="cRed">
                                      {this.state.errors["address"]}
                                    </span> */}
                                  </div>
                                  <div className="form-group">
                                    <label>
                                      Land Mark<span>(Optional)</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="landmark"
                                      value={
                                        this.state.fields["landmark"] || ""
                                      }
                                      placeholder="Enter Landmark"
                                      onChange={this.handleChange.bind(
                                        this,
                                        "landmark"
                                      )}
                                    />
                                    {/* <span className="cRed">
                                      {this.state.errors["landmark"]}
                                    </span> */}
                                  </div>
                                  <div
                                    className="form-group"
                                    onChange={this.handleChange.bind(
                                      this,
                                      "address_type"
                                    )}
                                  >
                                    <label className="radio-inline">
                                      <input
                                        type="radio"
                                        name="address_type"
                                        value="Home"
                                        checked={
                                          this.state.fields["address_type"] ===
                                          "Home"
                                        }
                                      />
                                      Home
                                    </label>
                                    <label className="radio-inline">
                                      <input
                                        type="radio"
                                        name="address_type"
                                        value="Work"
                                        checked={
                                          this.state.fields["address_type"] ===
                                          "Work"
                                        }
                                      />
                                      Work
                                    </label>
                                    <label className="radio-inline">
                                      <input
                                        type="radio"
                                        name="address_type"
                                        value="Other"
                                        checked={
                                          this.state.fields["address_type"] ===
                                          "Other"
                                        }
                                      />
                                      Other
                                    </label>
                                    {/* <span className="cRed">
                                      {this.state.errors["address_type"]}
                                    </span> */}
                                  </div>

                                  <div className="">
                                    <button
                                      type="submit"
                                      className="btn  btn-primary padTopCategorySave"
                                    >
                                      Save Address
                                    </button>{" "}
                                  </div>
                                  </form>
                                </div>
                             

                              {/* addressbox Code will come here */}
                              {this.state.addressDetailsView}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <PatientFooter />
        </I18nPropvider>
      </main>
    );
  }
}
