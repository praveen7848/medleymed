import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Multiselect } from "multiselect-react-dropdown";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import FileBase64 from "react-file-base64";
//``const imgurl = "http://3.7.234.106:8100";
const fs = require("fs");

export default class Createdoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        profile_pic:"",
        signature_pic:"",
        
      },
      errors: {},
      clinic_data: "",
      files: [],
      type:"password",  
      img:"/images/doctor-img/Login screens/hide_icon.svg",

      options: [],
      speciality_options: [],

      langarray: [],
      languagesarray: [],
      selectedLangList: {},
      selectedLangValue: [],
      signatureUploaded:"0",
      profileUploaded:"0",
      selectedList:"",
      speciality_selectedList:"",
    };
    this.showPassword=this.showPassword.bind(this);
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.fetchLanguagesData();
    this.getClinicSpecialities();
    this.fetchClinicListData();
    this.fetchCountryCurrencyDetails();
    this.getDoctorInfo(handle);
  };

  getProfileImageFile(files) {
    //alert(files[0].base64);
    //this.state.files[0].base64;
    //this.setState({ profile_pic: files[0].base64 });
	this.setState({ ProfileImageFiles: files });
    this.state.fields.profile_pic=files;
    this.state.profileUploaded=1;
    this.forceUpdate();
  }

  getProfileSignatureFile(files) {
     this.setState({ ProfileSignatureFiles: files });
    this.state.fields.signature_pic=files;
    this.state.signatureUploaded=1;
    this.forceUpdate();
    
  }

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

  // Get Specialities
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
    //console.log(selectedListdata);

    this.setState({
      selectedLangName: selectedListdata.map((x) => x.name),
    });
    this.setState({
      selectedLangId: selectedListdata.map((x) => x.id),
      selectedList:selectedListdata.map((x) => x.id),
    });
  };

  onRemove = (deselectedList, removedItem) => {
    this.setState({
      selectedList: deselectedList.map((x) => x.id),
    //  speciality_selectedList:deselectedList.map((x) => x.id),
      
    });
    // console.log(Object.assign({}, this.state.selectedList));
  };

  onSpecialitySelect = (selectedSpecialityListdata, selectedItem) => {
   // console.log(selectedSpecialityListdata);

    this.setState({
      selectedSpecialityName: selectedSpecialityListdata.map(
        (x) => x.category_type
      ),
    });
    this.setState({
      selectedSpecialityId: selectedSpecialityListdata.map((x) => x.id),
      speciality_selectedList:selectedSpecialityListdata.map((x) => x.id),
    });
    // console.log("after State Set");
    // console.log(this.state.selectedSpecialityName);
    // console.log(this.state.selectedSpecialityId);
  };

  onSpecialityRemove = (deselectedSpecialityList, removedItem) => {
    //alert(deselectedSpecialityList.map((x) => x.id));
    this.setState({
      selectedSpecialityList: deselectedSpecialityList.map((x) => x.id),
      speciality_selectedList:deselectedSpecialityList.map((x) => x.id),
      selectedSpecialityName: deselectedSpecialityList.map((x) => x.category_type),
      
    });
    this.forceUpdate();
     //console.log(Object.assign({}, this.state.selectedSpecialityList));
    // console.log(this.state.selectedSpecialityName);
  };

  // To get all the ResponderInfo
  getDoctorInfo(handle) {
    //alert("in");
    Httpconfig.httptokenget(
      Constant.siteurl + "api/Doctor/getAllDoctors/" + handle
    )
      .then((response) => {
       var usersdata = this.state.userarray;
        var specialitydata = this.state.speciality_userarray;
        // console.log(specialitydata);
        this.setState({
          fields: {
            name: response.data.data[0].doctor_name,
            mobile_number: response.data.data[0].mobile_no,

            currency_name: response.data.data[0].currency_name,
            currency_symbol: response.data.data[0].currency_symbol,

            // email: response.data.data[0].email,                                                  //response.data.data[0].email,
            // password: response.data.data[0].password,
            email: response.data.data[0].tbl_user.email,                                                  //response.data.data[0].email,
            password: response.data.data[0].tbl_user.password,
            user_type: "doctor",
            selected_language: "en-us",
            is_fingerprint_required: 0,
            clinic_id: response.data.data[0].clinic_id,

            speciality_id: response.data.data[0].speciality_id,
            speciality_name: response.data.data[0].speciality_name,

            default_language_id: response.data.data[0].default_language_id,
            default_language_name: response.data.data[0].default_language_name,
           // selectedLangId: response.data.data[0].selected_language,
            selected_language_id: response.data.data[0].selected_language,
            selected_language_name: response.data.data[0].selected_language,

            gender: response.data.data[0].gender,
            dob: response.data.data[0].dob,
            address: response.data.data[0].address,
            city: response.data.data[0].city,
            state: response.data.data[0].state,
            zip_code: response.data.data[0].zip_code,
            lat_long: "",
            education: response.data.data[0].education,
            experience: response.data.data[0].experience,
            registraion_no: response.data.data[0].registraion_no,
            practice: response.data.data[0].practice,
            area_of_expertise: response.data.data[0].area_of_expertise,
            fees: response.data.data[0].fees,
            commission: response.data.data[0].commission,

            languages: response.data.data[0].languages,
            languageids: response.data.data[0].languageids,

            slot_duration: response.data.data[0].slot_duration,
            break_duration: response.data.data[0].break_duration,
            profile_pic: response.data.data[0].profile_pic,
            signature_pic: response.data.data[0].signature_pic,

          },
        });

        // Edit Highlight Language Data
        let editLangData = [];
        let customerData = response.data.data[0].languageids;

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
       // alert(this.state.fields.clinic_id);
        // Ends
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
      this.updateDoctor(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createDoctor(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  // creates new controller
  createDoctor = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    let profileImage = "";
    if (this.state.fields.profile_pic != undefined) {
      profileImage  = this.state.fields.profile_pic[0];
	  
    }
    //alert(profileImage);

    let signatureImage = "";
    if (this.state.fields.signature_pic != undefined) {
      signatureImage = this.state.fields.signature_pic[0];
    } 
//alert(signatureImage);
    // alert("Iam Before Saving API");
    // console.clear();
    // console.log(this.state);
    // console.log(profileImage);
    // console.log(signatureImage);
    // return;
    
    if(fields["clinic_id"]==undefined){
      this.state.fields.clinic_id=4;
    }
    //alert(fields["clinic_id"]);
    Httpconfig.httptokenpost(Constant.siteurl + "api/Users/", {
      name: fields["name"],
      mobile_number: fields["mobile_number"],
      currency_name: fields["currency_name"],
      currency_symbol: fields["currency_symbol"],
      email: fields["email"],
      password: fields["password"],
      clinic_id: fields["clinic_id"],
      user_type: "doctor",
      selected_language: "en-us",
      is_fingerprint_required: 0,
      gender: fields["gender"],
      dob: fields["dob"],
      address: fields["address"],
      city: fields["city"],
      state: fields["state"],
      zip_code: fields["zip_code"],
      lat_long: "",
      education: fields["education"],
      experience: fields["experience"],
      registraion_no: fields["registraion_no"],
      practice: fields["practice"],
      area_of_expertise: fields["area_of_expertise"],
      fees: fields["fees"],
      commission: fields["commission"],

      languages: this.state.selectedLangName.toString(),
      languageids: this.state.selectedLangId.toString(),

      selected_language_id: this.state.selectedLangId.toString(),
      selected_language_name: this.state.selectedLangName.toString(),

      speciality_id: this.state.selectedSpecialityId.toString(),
      speciality_name: this.state.selectedSpecialityName.toString(),

      slot_duration: fields["slot_duration"],
      break_duration: fields["break_duration"],

      status: 0,
      is_available: 0,
      profile_pic: profileImage,
      signature_pic: signatureImage,
    })
      .then((response) => {
        console.log("Before response Print");
        console.log(response);
        if (response.data.status === 204) {
          toast.error(response.data.message);
          return false;
        } else {
          toast.success("Successfully Created Doctor");
          setTimeout(() => this.props.history.push("/admin/ViewDoctors"), 1000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateDoctor = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;

    let selectedLang = "";
    if (this.state.selectedLangName == undefined) {
      let stateData = this.state.selectedValue;
      let names = stateData.map((x) => x.name);
      selectedLang = names.toString();
    } else {
      selectedLang = this.state.selectedLangName.toString();
    }

    let selectedLangIds = "";
    if (this.state.selectedLangId == undefined) {
      let stateIdData = this.state.selectedList;
      selectedLangIds = stateIdData.toString();
    } else {
      selectedLangIds = this.state.selectedLangId.toString();
    }

    // console.log("selectedSpecialityName "+this.state.selectedSpecialityName);
    let selectedSpeciality = "";
    if (this.state.selectedSpecialityName == undefined) {
      let stateData = this.state.speciality_selectedValue;
      let names = stateData.map((x) => x.category_type);
      selectedSpeciality = names.toString();
    } else {
      selectedSpeciality = this.state.selectedSpecialityName.toString();
    }

    let selectedSpecialityIds = "";
    if (this.state.selectedSpecialityId == undefined) {
      let stateIdData = this.state.speciality_selectedList;
      selectedSpecialityIds = stateIdData.toString();
    } else {
      selectedSpecialityIds = this.state.selectedSpecialityId.toString();
    }

    // console.log("selectedSpeciality >>> "+selectedSpeciality);
    // console.log("selectedSpecialityIds >>> "+selectedSpecialityIds);

    let profileImage = "";
    let signatureImage = "";
    if (this.state.fields.profile_pic != undefined) {
      profileImage = this.state.fields.profile_pic[0];
    }
    if (this.state.fields.signature_pic != undefined) {
      signatureImage = this.state.fields.signature_pic[0];
    }
    if(this.state.signatureUploaded==0){
      signatureImage ="";// this.state.fields.signature_pic;
    }
    if(this.state.profileUploaded==0){
      profileImage ="";// this.state.fields.profile_pic;
    }
//      console.clear();
// console.log(profileImage);
// console.log(signatureImage);
    
   

    // console.clear();
    // console.log(this.state);

    // console.log("selectedSpecialityName "+this.state.selectedSpecialityName);
    // console.log("selectedSpecialityId "+this.state.selectedSpecialityId);

    // console.log("selectedSpecialityName "+this.state.selectedSpecialityName);
    // console.log("selectedSpecialityId "+this.state.selectedSpecialityId);
    // return;

    Httpconfig.httptokenput(Constant.siteurl + "api/Doctor/" + handle, {
      doctor_name: fields["name"],
      mobile_no: fields["mobile_number"],
      currency_name: fields["currency_name"],
      currency_symbol: fields["currency_symbol"],
      email: fields["email"],
      password: fields["password"],
      clinic_id: fields["clinic_id"],
      user_type: "doctor",
      selected_language: "en-us",
      is_fingerprint_required: 0,
      gender: fields["gender"],
      dob: fields["dob"],
      address: fields["address"],
      city: fields["city"],
      state: fields["state"],
      zip_code: fields["zip_code"],
      lat_long: "",
      education: fields["education"],
      experience: fields["experience"],
      registraion_no: fields["registraion_no"],
      practice: fields["practice"],
      area_of_expertise: fields["area_of_expertise"],
      fees: fields["fees"],
      commission: fields["commission"],

      languages: selectedLang,
      languageids: selectedLangIds,

      selected_language_id: selectedLangIds,
      selected_language_name: selectedLang,

      speciality_id: selectedSpecialityIds,
      speciality_name: selectedSpeciality,

      slot_duration: fields["slot_duration"],
      break_duration: fields["break_duration"],

      status: 0,
      is_available: 0,
      profile_pic: profileImage,
      signature_pic: signatureImage,
    })
      .then((response) => {
        toast.success("Successfully Updated Doctor");
      //  setTimeout(() => this.props.history.push("/admin/ViewDoctors"), 2000);
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
// alert(Object.keys(this.state.selectedList).length);
// alert(Object.keys(this.state.speciality_selectedList).length);

    var pattern = /^[a-zA-Z0-9]{3,20}$/g;
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
    } else if (typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf("@");
      let lastDotPos = fields["email"].lastIndexOf(".");
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          fields["email"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is invalid";
      }
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
    if (!fields["mobile_number"]) {
      formIsValid = false;
      errors["mobile_number"] = "Phone number cannot be empty";
    } else if (fields["mobile_number"].length < 10) {
      formIsValid = false;
      errors["mobile_number"] = "Phone number invalid";
    }

    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Doctor Name cannot be empty";
    }

    // if (!fields["clinic_id"]) {
    //   formIsValid = false;
    //   errors["clinic_id"] = "Clinic cannot be empty";
    // }

    if (!fields["gender"]) {
      formIsValid = false;
      errors["gender"] = "gender cannot be empty";
    }
    // dob
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "Address cannot be empty";
    }
    if (!fields["city"]) {
      formIsValid = false;
      errors["city"] = "City cannot be empty";
    }
    if (!fields["state"]) {
      formIsValid = false;
      errors["state"] = "State cannot be empty";
    }
    if (!fields["zip_code"]) {
      formIsValid = false;
      errors["zip_code"] = "Zip code cannot be empty";
    }
    if (!fields["education"]) {
      formIsValid = false;
      errors["education"] = "Education cannot be empty";
    }
    if (!fields["experience"]) {
      formIsValid = false;
      errors["experience"] = "Experience cannot be empty";
    }
    if (!fields["registraion_no"]) {
      formIsValid = false;
      errors["registraion_no"] = "Registration Number cannot be empty";
    }
    if (!fields["practice"]) {
      formIsValid = false;
      errors["practice"] = "Practice cannot be empty";
    }
    if (!fields["area_of_expertise"]) {
      formIsValid = false;
      errors["area_of_expertise"] = "Experctise cannot be empty";
    }
    if (!fields["fees"]) {
      formIsValid = false;
      errors["fees"] = "Fees cannot be empty";
    }
    if (!fields["commission"]) {
      formIsValid = false;
      errors["commission"] = "Commission cannot be empty";
    }

    // // languages
    if (!fields["slot_duration"]) {
      formIsValid = false;
      errors["slot_duration"] = "Slot Duration cannot be empty";
    }
    if (!fields["break_duration"]) {
      formIsValid = false;
      errors["break_duration"] = "Break Duration cannot be empty";
    }

    if (!fields["currency_symbol"]) {
      formIsValid = false;
      errors["currency_symbol"] = "Currency Symbol cannot be empty";
    }

    if (!fields["currency_name"]) {
      formIsValid = false;
      errors["currency_name"] = "Currency Name cannot be empty";
    }
    if (Object.keys(this.state.selectedList).length==0) {
      formIsValid = false;
      errors["languages"] = "Select Language(s)";
    }else{
      errors["languages"] = "";
    }
    if (Object.keys(this.state.speciality_selectedList).length==0) {
      formIsValid = false;
      errors["specialities"] = "Select Specalities";
    }else{
      errors["specialities"] ="";
    }
    
    if (!fields["profile_pic"]) {
      formIsValid = false;
      errors["profile_pic"] = "Please upload profile image";
    }
    if (!fields["signature_pic"]) {
      formIsValid = false;
      errors["signature_pic"] = "Please upload Signature image";
    }
    
    this.setState({ errors: errors });
    // console.log(this.state.errors);
    return formIsValid;
  }
  ImageClick = (event) => {
    var array = this.state.files;
    var foundValue = array.filter((obj) => obj.name != event.target.id);
    this.setState({ files: foundValue });
    
  };
  ImageZoomClick=(event)=>{
   // alert(event.currentTarget.src);
  this.setState({
    zoomimage:event.currentTarget.src,
  })
  }
  removeImageOnClick=(imageName)=>{
    //let imageName=event.currentTarget.id.replace("img_","");
    $('#'+imageName).remove();
    $('.'+imageName).remove();
    //alert(imageName);
    //// // // console.log("State values");
    //// // // console.log(this.state.files);
   // var array = [...this.state.fields.profile_pic]; // make a separate copy of the array
    // // // console.log("array values");
  //var index = array.indexOf(imageName);
  //var index = array.findIndex((item) => item.name === imageName);
  //alert(index);
  //// // // console.log(array);
  // if (index !== -1) {
  //   array.splice(index, 1);
  //   this.setState({files: array});
  // }
//this.forceUpdate();
    // this.setState({
    //   zoomimage:'',
    // })
    }
    showPassword(){
      let type=this.state.type;
      if(this.state.type){
      if(this.state.type=='input'){
        this.state.type='password';
        this.state.img="/images/doctor-img/Login screens/hide_icon.svg";
      }else{
        this.state.type='input';
        this.state.img="/images/doctor-img/Login screens/unhide_icon.svg";
      }
    }
     this.forceUpdate();   
    }

  render() {
    const {
      fields,
      errors,
      specialities_data,
      clinic_details,
      countryData,
    } = this.state;
    let profileImage = "";
    let signatureImage = "";
     
    if (this.state.fields.profile_pic && this.state.profileUploaded==0) {
      let imageName = this.state.fields.profile_pic;
      const fileProfilepath =
        "./public/uploads/doctor/profile_image/" + imageName;
      profileImage = Constant.imgurl + imageName;
    }
    
    if (this.state.fields.signature_pic && this.state.signatureUploaded==0) {
    //if (this.state.fields.ProfileSignatureFiles && this.state.signatureUploaded==0) {
      let signatureName = this.state.fields.signature_pic;
      const fileProfilepath =
        "./public/uploads/doctor/signatures/" + signatureName;
      signatureImage = Constant.imgurl + signatureName;
    }
    let documentsRelated = [];
    let SignaturesRelated = [];
    let imageArray="";
    let imageSigArray=[];
    //alert(this.state.fields.profile_pic);

        imageArray = this.state.fields.profile_pic;
        imageSigArray = this.state.fields.signature_pic;
    
   // // // // console.log(imageArray);
   //alert(imageArray);
   if(imageArray && this.state.profileUploaded==1){
    if (imageArray.length > 0) {
      for (var i = 0; i < imageArray.length; i++) {
        let img=imageArray[i].name.split(".");
        let imgName=img[0];
        let imageName = imageArray[i].name;
        let imagebase64 = imageArray[i].base64;
        let imageType = imageArray[i].type;
        let imageSize = imageArray[i].size;
        let imageId = imageArray[i];
       
        documentsRelated.push(
          <div class={"upload_presc_img "+imgName}>
                <a class="thumbnail" data-toggle="modal" data-target="#lightbox"> 
                <img
            src={imagebase64}
            id={imgName}
            value={imageName}
            alt={imageName}
            name={imageName}
            
             onClick={this.ImageZoomClick.bind(this)}
            
          />
                </a>
                <div class="upload_top_img">
                  <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox" >
              </a>
               <img class="del_img" id={imageName} onClick={this.removeImageOnClick.bind(this,imgName)} src="https://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-cross-black-and-white-icon.png" />
              </div>
              </div>

         
        );
      }
    }  
  } 
    
    //alert(imageSigArray.length);
   // // // // console.log(imageArray);
   if(imageSigArray && this.state.signatureUploaded==1){
    if (imageSigArray.length > 0) {
      for (var i = 0; i < imageSigArray.length; i++) {
        let img=imageSigArray[i].name.split(".");
        let imgSigName=img[0];
        let imageSigName = imageSigArray[i].name;
        let imageSigbase64 = imageSigArray[i].base64;
        let imageSigType = imageSigArray[i].type;
        let imageSigSize = imageSigArray[i].size;
        let imageSigId = imageSigArray[i];
       SignaturesRelated.push(
          <div class={"upload_presc_img "+imgSigName}>
                <a class="thumbnail" data-toggle="modal" data-target="#lightbox"> 
                <img
            src={imageSigbase64}
            id={imgSigName}
            value={imageSigName}
            alt={imageSigName}
            name={imageSigName}
             onClick={this.ImageZoomClick.bind(this)}
            
          />
                </a>
                <div class="upload_top_img">
                  <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox" >
              </a>
               <img class="del_img" id={imageSigName} onClick={this.removeImageOnClick.bind(this,imgSigName)} src="https://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-cross-black-and-white-icon.png" />
              </div>
              </div>

         
        );
         console.log(SignaturesRelated);
      } 
    }
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
                      <a> Doctor </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Doctor </h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group ">
                              
                                <input
                                  type="text"
                                  name="name"
                                  value={this.state.fields["name"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "name"
                                  )}
                                  className="form-control"
                                  placeholder="Doctor Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["name"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            <div className="col-md-3">
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
                                  <option value="">Select Clinic</option>
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

                            {/* <div className="row"> */}
                            <div className="col-md-3">
                              <div className="form-group ">
                                <select
                                  name="gender"
                                  onChange={this.handleChange.bind(
                                    this,
                                    "gender"
                                  )}
                                  value={this.state.fields["gender"] || ""}
                                  className="form-control"
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                <span className="cRed">
                                  {this.state.errors["gender"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-3">
                              <div className="form-group">
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
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group ">
                                <select
                                  name="currency_name"
                                  className="form-control"
                                  value={
                                    this.state.fields["currency_name"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "currency_name"
                                  )}
                                >
                                  <option value="">Select Country</option>
                                  {countryData &&
                                    countryData.map((countryData, i) => {
                                      return (
                                        <option value={countryData.name}>
                                          {countryData.name}
                                        </option>
                                      );
                                    })}
                                </select>
                                <span className="cRed">
                                  {this.state.errors["currency_name"]}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-3">
                              <div className="form-group ">
                                <select
                                  name="currency_symbol"
                                  className="form-control"
                                  value={
                                    this.state.fields["currency_symbol"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "currency_symbol"
                                  )}
                                >
                                  <option value="">Select Currency</option>
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
                                  {this.state.errors["currency_symbol"]}
                                </span>
                              </div>
                            </div>

                            {/* <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <input
                                  type="text"
                                  name="currency"
                                  value={this.state.fields["currency"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "currency"
                                  )}
                                  className="form-control"
                                  placeholder="Currency"
                                />
                                <span className="cRed">
                                  {this.state.errors["currency"]}
                                </span>
                              </div>
                            </div> */}
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-3">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="email"
                                  value={this.state.fields["email"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "email"
                                  )}
                                  className="form-control"
                                  placeholder="Email"
                                />
                                <span className="cRed">
                                  {this.state.errors["email"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-3">
                              <div className="form-group ">
                                <input
                                  type={this.state.type}
                                  name="password"
                                  value={this.state.fields["password"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "password"
                                    
                                  )}
                                  className="form-control log_input"
                                 
                                  placeholder="password"
                                />
                                 <img class="password_view" onClick={ this.showPassword }  src={this.state.img} />
                                <span className="cRed">
                                  {this.state.errors["password"]}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                          <div className="col-md-4">
                              <div className="form-group">
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
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="city"
                                  value={this.state.fields["city"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "city"
                                  )}
                                  className="form-control"
                                  placeholder="City"
                                />
                                <span className="cRed">
                                  {this.state.errors["city"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="state"
                                  value={this.state.fields["state"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "state"
                                  )}
                                  className="form-control"
                                  placeholder="State"
                                />
                                <span className="cRed">
                                  {this.state.errors["state"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                           
                          </div>

                          <div className="row">
                          <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="zip_code"
                                  value={this.state.fields["zip_code"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "zip_code"
                                  )}
                                  className="form-control"
                                  placeholder="Zip Code"
                                />
                                <span className="cRed">
                                  {this.state.errors["zip_code"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="education"
                                  value={this.state.fields["education"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "education"
                                  )}
                                  className="form-control"
                                  placeholder="Education"
                                />
                                <span className="cRed">
                                  {this.state.errors["education"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="number"
                                  name="experience"
                                  value={this.state.fields["experience"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "experience"
                                  )}
                                  className="form-control"
                                  placeholder="Experience"
                                />
                                <span className="cRed">
                                  {this.state.errors["experience"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            
                          </div>

                          <div className="row">
                          <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="registraion_no"
                                  value={
                                    this.state.fields["registraion_no"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "registraion_no"
                                  )}
                                  className="form-control"
                                  placeholder="Registration Number"
                                />
                                <span className="cRed">
                                  {this.state.errors["registraion_no"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="practice"
                                  value={this.state.fields["practice"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "practice"
                                  )}
                                  className="form-control"
                                  placeholder="Practice"
                                />
                                <span className="cRed">
                                  {this.state.errors["practice"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="area_of_expertise"
                                  value={
                                    this.state.fields["area_of_expertise"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "area_of_expertise"
                                  )}
                                  className="form-control"
                                  placeholder="Expertise"
                                />
                                <span className="cRed">
                                  {this.state.errors["area_of_expertise"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                           
                          </div>

                          <div className="row">
                          <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="fees"
                                  value={this.state.fields["fees"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "fees"
                                  )}
                                  className="form-control"
                                  placeholder="Fees"
                                />
                                <span className="cRed">
                                  {this.state.errors["fees"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group ">
                                <input
                                  type="text"
                                  name="slot_duration"
                                  value={
                                    this.state.fields["slot_duration"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "slot_duration"
                                  )}
                                  className="form-control"
                                  placeholder="Slot Duration"
                                />
                                <span className="cRed">
                                  {this.state.errors["slot_duration"]}
                                </span>
                              </div>
                            </div>
                            {/* </div> */}

                            {/* <div className="row"> */}
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="break_duration"
                                  value={
                                    this.state.fields["break_duration"] || ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "break_duration"
                                  )}
                                  className="form-control"
                                  placeholder="Break Duration"
                                />
                                <span className="cRed">
                                  {this.state.errors["break_duration"]}
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
                            <div className="col-md-4">
                              <div className="form-group">
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
                                <span className="cRed">
                                  {this.state.errors["specialities"]}
                                </span>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="commission"
                                  value={this.state.fields["commission"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "commission"
                                  )}
                                  className="form-control"
                                  placeholder="Commission %"
                                />
                                <span className="cRed">
                                  {this.state.errors["commission"]}
                                </span>
                              </div>
                            </div>
                            

                            {/* <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <select
                                  name="clinic_speciality"
                                  className="form-control"
                                  value={this.state.fields["speciality"] || ""}
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
                          </div>

                          <div className="row">
                          <div className="form-group col-md-4">
                          <label>Upload Profile Image</label> 
                              <FileBase64
                                multiple={true}
                                onDone={this.getProfileImageFile.bind(this)}
                              />
                              {/* <span className="cRed">
                                {this.state.errors["profile_pic"]}
                              </span> */}
                              <div class="upload_imgs">
                              {this.state.profileUploaded==1 ?
                              documentsRelated
                              :profileImage ?
                              <div class="upload_view_img">
                              <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox" >
                                <img src={profileImage} onClick={this.ImageZoomClick.bind(this)}/>
                                </a>
                                </div>
                                :""}
                              </div>
                              <span className="cRed">
                                  {this.state.errors["profile_pic"]}
                                </span>
                            </div>
                             
                            <div className="form-group col-md-4">
                            <label>Upload Signature</label> 
                              <FileBase64
                                multiple={true}
                                onDone={this.getProfileSignatureFile.bind(this)}
                              />
                              
                              <div class="upload_imgs">
                              {this.state.signatureUploaded==1 ?
                              SignaturesRelated :
                              signatureImage ?
                              <div class="upload_view_img">
                  <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox" >
                  <img src={signatureImage} onClick={this.ImageZoomClick.bind(this)} /> 
              </a></div>
                                 
                                 :""}
                              </div>
                              <span className="cRed">
                                {this.state.errors["signature_pic"]}
                              </span>
                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-md-12">
                              <button
                                type="submit"
                                className="btn  btn-primary save_btn"
                              >
                                Save Doctor
                              </button>{" "}
                              &nbsp;
                              <Link
                                to="/admin/ViewDoctors"
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
        <div id="lightbox" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <button type="button" class="close hidden" data-dismiss="modal" aria-hidden="true">×</button>
        <div class="modal-content">
            <div class="modal-body">
                <img src={this.state.zoomimage} alt="" />
            </div>
        </div>
    </div>
</div>
      </section>
    );
  }
}
