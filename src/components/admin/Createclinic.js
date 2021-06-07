import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Multiselect } from "multiselect-react-dropdown";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
//import DatePicker from "react-datepicker";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import FileBase64 from "react-file-base64";
const imgurl = "http://3.7.234.106:8100";
const fs = require("fs");

export default class Createclinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      clinic_data: "",

      address: "",

      options: [],
      speciality_options: [],

      langarray: [],
      languagesarray: [],
      selectedLangList: {},
      selectedLangValue: [],
    };
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.getClinicSpecialities();
    this.fetchLanguagesData();
    this.getClinicTimezones();
    this.getClinicInfo(handle);
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  fetchLanguagesData() {
   Httpconfig.httptokenget(Constant.siteurl + "api/Languages").then(
     (response) => {
       this.setState({
         options: response.data,
         userarray: response.data,
       });
     }
   );
 }

  // Get Specialities
  // getClinicSpecialities(handle) {
  //   Httpconfig.httptokenget(Constant.siteurl + "api/Category/Findall")
  //     .then((response) => {
  //       // this.setState({
  //       //   specialities_data: response.data.data,
  //       // });
  //       this.setState({
  //         speciality_options: response.data.data,
  //         speciality_userarray: response.data.data,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
  getClinicSpecialities(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/Category")
      .then((response) => {
        // this.setState({
        //   specialities_data: response.data.data,
        // });
        this.setState({
          speciality_options: response.data.data,
          speciality_userarray: response.data.data,
        });
      })
      .catch((error) => {
       // console.log(error);
      });
  }
  // Ends

  onSelect = (selectedListdata, selectedItem) => {
    console.log(selectedListdata);

    this.setState({
      selectedLangName: selectedListdata.map((x) => x.name),
    });
    this.setState({
      selectedLangId: selectedListdata.map((x) => x.id),
    });
  };

  onRemove = (deselectedList, removedItem) => {
    this.setState({
      selectedList: deselectedList.map((x) => x.id),
    });
    console.log(Object.assign({}, this.state.selectedList));
  };

  onSpecialitySelect = (selectedSpecialityListdata, selectedItem) => {
    console.log(selectedSpecialityListdata);

    this.setState({
      selectedSpecialityName: selectedSpecialityListdata.map(
        (x) => x.category_type
      ),
    });
    this.setState({
      selectedSpecialityId: selectedSpecialityListdata.map((x) => x.id),
    });
    // console.log("after State Set");
    // console.log(this.state.selectedSpecialityName);
    // console.log(this.state.selectedSpecialityId);
  };

  onSpecialityRemove = (deselectedSpecialityList, removedItem) => {
    this.setState({
      selectedSpecialityList: deselectedSpecialityList.map((x) => x.id),
    });
    // console.log(Object.assign({}, this.state.selectedSpecialityList));
  };

  // Get Timezone
  getClinicTimezones() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Country/timezoneList")
      .then((response) => {
        this.setState({
          timezone: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Ends

  getClinicImageFile(files) {
    this.setState({ ClinicImageFiles: files });
  }

  // To get all the ResponderInfo
  getClinicInfo(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/Clinic/" + handle)
      .then((response) => {

      

        this.setState({
          fields: {
            clinic_name: response.data.data[0].clinic_name,
            address: response.data.data[0].address,
            pincode: response.data.data[0].pincode,
            kyc_status: response.data.data[0].kyc_status,
            clinic_phone_no: response.data.data[0].clinic_phone_no,
            email_id: response.data.data[0].email_id,
            password: response.data.data[0].password,
            latitude: response.data.data[0].latitude,
            longitude: response.data.data[0].longitude,
            timezone_name: response.data.data[0].timezone_name,
            clinic_registration_no:
              response.data.data[0].clinic_registration_no,
            clinic_type: response.data.data[0].clinic_type,
            // clinic_speciality: response.data.data[0].clinic_speciality,
            clinic_logo: response.data.data[0].clinic_logo,

            selected_language_id: response.data.data[0].selected_language_id,
            selected_language_name: response.data.data[0].selected_language_name,

            speciality_id: response.data.data[0].speciality_id,
            speciality_name: response.data.data[0].speciality_name,
          },
        });

        var usersdata = this.state.userarray;
        var specialitydata = this.state.speciality_userarray;

        // console.log(usersdata);
        // console.log(specialitydata);
      //   return;

         // Edit Highlight Language Data
         let editLangData = [];
         let customerData = response.data.data[0].selected_language_id;
 
         let editLangList = customerData.split(",");
         editLangList.forEach(function (item, index) {
           usersdata.forEach(function (obj, i) {
             if (obj.id == item) {
               return editLangData.push(obj);
             }
           });
         });
         this.setState({
           selectedValue: editLangData,
           selectedList: editLangList,
         });
         // Ends 
 
         // Edit Speciality Data
         let editSpecialityData = [];
         let specialityData = response.data.data[0].speciality_id;
         console.log(specialityData);
         let editSpecialityList = specialityData.split(",");
         editSpecialityList.forEach(function (item, index) {
           specialitydata.forEach(function (obj, i) {
             if (obj.id == item) {
               return editSpecialityData.push(obj);
             }
           });
         });
         this.setState({
           speciality_selectedValue: editSpecialityData,
           speciality_selectedList: editSpecialityList,
         });
         // Ends

         console.log(this.state);
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
      this.updateClinic(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createClinic(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  // creates new controller
  createClinic = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    let clinicLogo = "";
    if (this.state.ClinicImageFiles != undefined) {
      clinicLogo = this.state.ClinicImageFiles[0];
    }

    // console.clear();
    // console.log(this.state);
    // return;

    Httpconfig.httptokenpost(Constant.siteurl + "api/Clinic/", {
      clinic_name: fields["clinic_name"],
      address: fields["address"],
      pincode: fields["pincode"],
      clinic_phone_no: fields["clinic_phone_no"],
      email_id: fields["email_id"],
      password: fields["password"],
      latitude: fields["latitude"],
      longitude: fields["longitude"],
      kyc_status: fields["kyc_status"],
      clinic_registration_no: fields["clinic_registration_no"],
      clinic_type: fields["clinic_type"],
      timezone_name: fields["timezone_name"],
      
      speciality_id: this.state.selectedSpecialityId.toString(),
      speciality_name: this.state.selectedSpecialityName.toString(),

      selected_language_name: this.state.selectedLangName.toString(),
      selected_language_id: this.state.selectedLangId.toString(),

      clinic_pic: clinicLogo,
    })
      .then((response) => {
        if (response.status == 200) {
          toast.success("Successfully Created Clinic");
          setTimeout(
            () => this.props.history.push("/admin/ViewClinics"),
            10000
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateClinic = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;

    let clinicLogo = "";
    if (this.state.ClinicImageFiles != undefined) {
      clinicLogo = this.state.ClinicImageFiles[0];
    }

    let selectedLang = "";
    if(this.state.selectedLangName == undefined){
       let stateData = this.state.selectedValue;
      let names = stateData.map((x) => x.name);
      selectedLang = names.toString();
    }else{
      selectedLang = this.state.selectedLangName.toString();
    }

    let selectedLangIds = "";
    if(this.state.selectedLangId == undefined){
       let stateIdData = this.state.selectedList;
       selectedLangIds = stateIdData.toString();
    }else{
      selectedLangIds = this.state.selectedLangId.toString();
    }

    // console.log("selectedSpecialityName "+this.state.selectedSpecialityName);
    let selectedSpeciality = "";
    if(this.state.selectedSpecialityName == undefined){
       let stateData = this.state.speciality_selectedValue;
      let names = stateData.map((x) => x.category_type);
      selectedSpeciality = names.toString();
    }else{
      selectedSpeciality = this.state.selectedSpecialityName.toString();
    }

    let selectedSpecialityIds = "";
    if(this.state.selectedSpecialityId == undefined){
       let stateIdData = this.state.speciality_selectedList;
       selectedSpecialityIds = stateIdData.toString();
    }else{
      selectedSpecialityIds = this.state.selectedSpecialityId.toString();
    }

    // console.log("selectedSpeciality >>> "+selectedSpeciality);
    // console.log("selectedSpecialityIds >>> "+selectedSpecialityIds);

    // console.clear();
    // console.log(this.state);
    // console.log(this.state.ClinicImageFiles);
    // console.log(clinicLogo);
    // return;

    Httpconfig.httptokenput(Constant.siteurl + "api/Clinic/" + handle, {
      clinic_name: fields["clinic_name"],
      address: fields["address"],
      pincode: fields["pincode"],
      clinic_phone_no: fields["clinic_phone_no"],
      email_id: fields["email_id"],
      password: fields["password"],
      latitude: fields["latitude"],
      longitude: fields["longitude"],
      kyc_status: fields["kyc_status"],
      clinic_registration_no: fields["clinic_registration_no"],
      clinic_type: fields["clinic_type"],
      // clinic_speciality: fields["clinic_speciality"],
      clinic_pic: clinicLogo,

      timezone_name: fields["timezone_name"],

      selected_language_id: selectedLangIds,
      selected_language_name: selectedLang,

      speciality_id: selectedSpecialityIds,
      speciality_name: selectedSpeciality,

    })
      .then((response) => {
        toast.success("Successfully Updated Clinic");
        setTimeout(() => this.props.history.push("/admin/ViewClinics"), 2000);
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

    var pattern = /^[a-zA-Z0-9]{3,20}$/g;
    if (!fields["email_id"]) {
      formIsValid = false;
      errors["email_id"] = "Email cannot be empty";
    } else if (typeof fields["email_id"] !== "undefined") {
      let lastAtPos = fields["email_id"].lastIndexOf("@");
      let lastDotPos = fields["email_id"].lastIndexOf(".");
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email_id"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          fields["email_id"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email_id"] = "Email is invalid";
      }
    }

    if (!fields["clinic_phone_no"]) {
      formIsValid = false;
      errors["clinic_phone_no"] = "Phone number cannot be empty";
    } else if (fields["clinic_phone_no"].length < 10) {
      formIsValid = false;
      errors["clinic_phone_no"] = "Phone number invalid";
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Password cannot be empty";
    } else if (
      fields["password"].length < 8 ||
      fields["password"].length > 20
    ) {
      formIsValid = false;
      errors["password"] = "Password shuold contain 8-20 characters";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20}$/.exec(
        fields["password"]
      )
    ) {
      formIsValid = false;
      errors["password"] =
        "Required one upper case, one small case, one number and one special character";
    }

    if (!fields["clinic_name"]) {
      formIsValid = false;
      errors["clinic_name"] = "Clinic name cannot be empty";
    }
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "Clinic address cannot be empty";
    }
    if (!fields["pincode"]) {
      formIsValid = false;
      errors["pincode"] = "Clinic pincode cannot be empty";
    }

    //  if (!fields["clinic_phone_no"]) {
    //    formIsValid = false;
    //    errors["clinic_phone_no"] = "Clinic Phone Number cannot be empty";
    //  }
    //  if (!fields["email_id"]) {
    //    formIsValid = false;
    //    errors["email_id"] = "Clinic email cannot be empty";
    //  }
    //  if (!fields["password"]) {
    //    formIsValid = false;
    //    errors["password"] = "Clinic password cannot be empty";
    //  }

    if (!fields["latitude"]) {
      formIsValid = false;
      errors["latitude"] = "Clinic latitude cannot be empty";
    }
    if (!fields["longitude"]) {
      formIsValid = false;
      errors["longitude"] = "Clinic longitude cannot be empty";
    }
    if (!fields["kyc_status"]) {
      formIsValid = false;
      errors["kyc_status"] = "Clinic Kyc cannot be empty";
    }

   //  if (!fields["clinic_speciality"]) {
   //    formIsValid = false;
   //    errors["clinic_speciality"] = "Clinic speciality cannot be empty";
   //  }

    // if (!fields["clinic_logo"]) {
    //   formIsValid = false;
    //   errors["clinic_logo"] = "Logo cannot be empty";
    // }

    if (!fields["timezone_name"]) {
      formIsValid = false;
      errors["timezone_name"] = "Timezone cannot be empty";
    }

    this.setState({ errors: errors });

    // console.clear();
    // console.log(this.state.errors);

    return formIsValid;
  }

  handleAddressChange = (address) => {
    this.setState({ address });
  };

  handleAddressSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
  };

  render() {
    const {
      fields,
      errors,
      coupon_data,
      specialities_data,
      timezone,
    } = this.state;

    // const searchOptions = {
    //   location: new google.maps.LatLng(-34, 151),
    //   radius: 2000,
    //   types: ['address']
    // }

    let clinicLogoImage = "";
    if (this.state.fields.clinic_logo) {
      let imageName = this.state.fields.clinic_logo;
      const fileProfilepath = "./public/uploads/clinic/" + imageName;
      clinicLogoImage = imgurl + imageName;
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
                      <a> Clinic </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Clinic </h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="clinic_name"
                                  value={this.state.fields["clinic_name"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "clinic_name"
                                  )}
                                  className="form-control"
                                  placeholder="Clinic Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["clinic_name"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}

                            {/* <div className="col-md-3">
                              <div className="form-group col-md-12">
                                <select
                                  name="clinic_speciality"
                                  className="form-control"
                                  value={
                                    this.state.fields["clinic_speciality"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "clinic_speciality"
                                  )}
                                >
                                  <option value="">Select</option>
                                  {specialities_data &&
                                    specialities_data.map(
                                      (specialities_data, i) => {
                                        return (
                                          <option
                                            value={
                                              specialities_data.speciality_name
                                            }
                                          >
                                            {specialities_data.speciality_name}
                                          </option>
                                        );
                                      }
                                    )}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["clinic_speciality"]}
                                </span>
                              </div>
                            </div> */}

                            {/* </div> */}

                            <div className="col-md-4">
                              <div className="form-group">
                                <select
                                  name="timezone_name"
                                  className="form-control"
                                  value={
                                    this.state.fields["timezone_name"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "timezone_name"
                                  )}
                                >
                                  <option value="">Select</option>
                                  {timezone &&
                                    timezone.map((timezone, i) => {
                                      return (
                                        <option value={timezone.value}>
                                          {timezone.name}
                                        </option>
                                      );
                                    })}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["timezone_name"]}
                                </span>
                              </div>
                            </div>

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <select
                                  name="clinic_type"
                                  onChange={this.handleChange.bind(
                                    this,
                                    "clinic_type"
                                  )}
                                  value={this.state.fields["clinic_type"] || ""}
                                  className="form-control"
                                >
                                  <option value="">Select Clinic Type</option>
                                  <option value="Clinic">Clinic</option>
                                  <option value="Hospital">Hospital</option>
                                </select>
                                <span className="cRed">
                                  {this.state.errors["clinic_type"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group ">
                                <select
                                  name="kyc_status"
                                  onChange={this.handleChange.bind(
                                    this,
                                    "kyc_status"
                                  )}
                                  value={this.state.fields["kyc_status"] || ""}
                                  className="form-control"
                                >
                                  <option value="">Select KYC Status</option>
                                  <option value="Updated">Updated</option>
                                  <option value="Not Updated">
                                    Not Updated
                                  </option>
                                </select>
                                <span className="cRed">
                                  {this.state.errors["kyc_status"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* 
                          <div className="row">
                            <PlacesAutocomplete
                              value={this.state.address}
                              onChange={this.handleAddressChange}
                              onSelect={this.handleAddressSelect}
                              // searchOptions={searchOptions}
                              shouldFetchSuggestions={this.state.address.length > 4}
                            >
                              {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading,
                              }) => (
                                <div>
                                  <input
                                    {...getInputProps({
                                      placeholder: "Search Places ...",
                                      className: "location-search-input",
                                    })}
                                  />
                                  <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion) => {
                                      const className = suggestion.active
                                        ? "suggestion-item--active"
                                        : "suggestion-item";
                                      // inline style for demonstration purpose
                                      const style = suggestion.active
                                        ? {
                                            backgroundColor: "#fafafa",
                                            cursor: "pointer",
                                          }
                                        : {
                                            backgroundColor: "#ffffff",
                                            cursor: "pointer",
                                          };
                                      return (
                                        <div
                                          {...getSuggestionItemProps(
                                            suggestion,
                                            {
                                              className,
                                              style,
                                            }
                                          )}
                                        >
                                          <span>{suggestion.description}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </PlacesAutocomplete>
                          </div> */}

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
                                  placeholder="address"
                                />
                                <span className="cRed">
                                  {this.state.errors["address"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="pincode"
                                  value={this.state.fields["pincode"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "pincode"
                                  )}
                                  className="form-control"
                                  placeholder="pincode"
                                />
                                <span className="cRed">
                                  {this.state.errors["pincode"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="clinic_phone_no"
                                  value={
                                    this.state.fields["clinic_phone_no"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "clinic_phone_no"
                                  )}
                                  className="form-control"
                                  placeholder="Phone Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["clinic_phone_no"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="email_id"
                                  value={this.state.fields["email_id"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "email_id"
                                  )}
                                  className="form-control"
                                  placeholder="Email Id"
                                />
                                <span className="cRed">
                                  {this.state.errors["email_id"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="password"
                                  name="password"
                                  value={this.state.fields["password"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "password"
                                  )}
                                  className="form-control"
                                  placeholder="Password"
                                />
                                <span className="cRed">
                                  {this.state.errors["password"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="clinic_registration_no"
                                  value={
                                    this.state.fields[
                                      "clinic_registration_no"
                                    ] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "clinic_registration_no"
                                  )}
                                  className="form-control"
                                  placeholder="Registration Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["clinic_registration_no"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row">

                            <div className="col-md-4">
                              <div className="form-group ">
                                <Multiselect
                                  onChange={this.handleChange.bind(
                                    this,
                                    "specialities"
                                  )}
                                  name="specialities"
                                  options={this.state.speciality_options} // Options to display in the dropdown
                                  value={
                                    this.state.speciality_selectedList || ""
                                  }
                                  selectedValues={
                                    this.state.speciality_selectedValue
                                  } // Preselected value to persist in dropdown
                                  onSelect={this.onSpecialitySelect} // Function will trigger on select event
                                  placeholder="Select Specalities"
                                  onRemove={this.onSpecialityRemove} // Function will trigger on remove event
                                  displayValue="category_type" // Property name to display in the dropdown options
                                />
                                {/* <span className="cRed">
                                  {this.state.errors["specialities"]}
                                </span> */}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group ">
                                <Multiselect
                                  onChange={this.handleChange.bind(
                                    this,
                                    "languages"
                                  )}
                                  name="languages"
                                  options={this.state.options} // Options to display in the dropdown
                                  value={this.state.selectedList || ""}
                                  selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                  onSelect={this.onSelect} // Function will trigger on select event
                                  placeholder="Select Languages"
                                  onRemove={this.onRemove} // Function will trigger on remove event
                                  displayValue="name" // Property name to display in the dropdown options
                                />
                                <span className="cRed">
                                  {this.state.errors["languages"]}
                                </span>
                              </div>
                            </div>

                          </div>


                          <div className="row">
                          <div class="col-md-4">
                            <div className="form-group ">
                              <FileBase64
                                multiple={true}
                                onDone={this.getClinicImageFile.bind(this)}
                              />
                              <span className="cRed">
                                {this.state.errors["clinic_logo"]}
                              </span>
                              <img src={clinicLogoImage} />
                            </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-md-12">
                              <button
                                type="submit"
                                className="btn  btn-primary save_btn"
                              >
                                Save Clinic
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/ViewClinics"
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
