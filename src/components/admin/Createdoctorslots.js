import React, { Component } from "react";
import $ from "jquery";
// import { ToastContainer, toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Multiselect } from "multiselect-react-dropdown";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
const moment = require("moment");

const morning_slots = [
  "01:00 AM",
  "01:30 AM",
  "02:00 AM",
  "02:30 AM",
  "03:00 AM",
  "03:30 AM",
  "04:00 AM",
  "04:30 AM",
  "05:00 AM",
  "05:30 AM",
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];

const noon_slots = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

const evening_slots = [
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
];

const night_slots = [
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
];

const currentDDate = new Date(); // Now
const sevenDays = currentDDate.setDate(currentDDate.getDate() + 7);

export default class Createdoctorslots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        isMorningChecked: true,
        isAfternoonChecked: true,
        isEveningChecked: true,
        isNightChecked: true,

        isMrngRepeat: false,
        isAftrnRepeat: false,
        isEvngRepeat: false,
        isNghtRepeat: false,

        slot_hours: "00",
        slot_minutes: "15",
        break_minutes: "05",

        morning_from: "01:00 AM",
        morning_to: "01:30 AM",
        noon_from: "12:00 PM",
        noon_to: "12:30 PM",
        evening_from: "04:00 PM",
        evening_to: "04:30 PM",
        night_from: "08:00 PM",
        night_to: "08:30 PM",

        start_date: new Date(), //moment().format("DD-MM-YYYY"), //moment(new Date()).format("DD-MM-YYYY"),
        end_date: sevenDays, //moment().add(7, 'days')
      },

      day_categories: [
        { id: "S", status: "S", displayName: "S", name: "Sunday" },
        { id: "M", status: "M", displayName: "M", name: "Monday" },
        { id: "T", status: "T", displayName: "T", name: "Tuesday" },
        { id: "W", status: "W", displayName: "W", name: "Wednesday" },
        { id: "T", status: "T", displayName: "T", name: "Thursday" },
        { id: "F", status: "F", displayName: "F", name: "Friday" },
        { id: "S", status: "S", displayName: "S", name: "Saturday" },
      ],
      errors: {},
      active: null,

      selected: false,
      weekDay: "",
      value: "Select an Option",
      morningChecked: [],
      afternoonChecked: [],
      eveningChecked: [],
      nightChecked: [],
    };
    this.checkMorningButtom = this.checkMorningButtom.bind(this);
    this.checkAfternoonButtom = this.checkAfternoonButtom.bind(this);
    this.checkEveningButtom = this.checkEveningButtom.bind(this);
    this.checkNightButtom = this.checkNightButtom.bind(this);
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.getDoctorDetails();

    // this.setState({
    //   fields: {
    //     isMorningChecked: this.state.fields.isMorningChecked,
    //     isAfternoonChecked : this.state.fields.isAfternoonChecked,
    //     isEveningChecked : this.state.fields.isEveningChecked,
    //     isNightChecked : this.state.fields.isNightChecked,

    //     start_date :this.state.fields.start_date,
    //     end_date:this.state.fields.end_date,
    //     doctor_id:this.state.fields.doctor_id,
    //     slot_hours:this.state.fields.slot_hours,
    //     slot_minutes:this.state.fields.slot_minutes,
    //     break_minutes:this.state.fields.break_minutes,

    //     isMrngRepeat : this.state.fields.isMrngRepeat,
    //     isAftrnRepeat : this.state.fields.isAftrnRepeat,
    //     isEvngRepeat : this.state.fields.isEvngRepeat,
    //     isNghtRepeat : this.state.fields.isNghtRepeat,

    //     morning_from:this.state.fields.morning_from,
    //     morning_to:this.state.fields.morning_to,

    //     noon_from:this.state.fields.noon_from,
    //     noon_to:this.state.fields.noon_to,

    //     evening_from:this.state.fields.evening_from,
    //     evening_to:this.state.fields.evening_to,

    //     night_from:this.state.fields.night_from,
    //     night_to:this.state.fields.night_to,

    //   },
    // });
    // this.forceUpdate();


  };


  // Fetch the Doctor Appointment Slots Starts
  // fetchDoctorSlots = (event) => {
  //   Httpconfig.httptokenpost(Constant.siteurl + "api/telemedicine/fetchDoctorAppointmentSlots", {
  //     doctorId: "13", //this.state.fields.doctor_id,
  //     consultationDate: "2021-2-2",//new Date(),
  //   }).then((response) => {
  //       console.clear();
  //       console.log(response);
  //       let responseData = response.data.data;
  //       this.setState({
  //         fields:{
  //           // start_date: response.data.result.fromDate,
  //           // end_date: response.data.result.toDate,
  //           doctor_id : "13",
  //         }
  //       });
  //       toast.success("Successfully Fetched the Doctor Appointment Slots");
  //       // setTimeout(() => this.props.history.push("/admin/Createdoctorslots"), 1000);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // Ends



  // Get Doctor List
  getDoctorDetails() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/getAllDoctors")
      .then((response) => {
        this.setState({
          doctorNames: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // Ends

  // Morning Days Selects Starts
  checkMorningButtom(event) {
    const target = event.target;
    var value = target.value;
    var valueName = target.name;
    let checkedMorningItems = [];
    if (target.checked) {
      var morningObj = {
        name: valueName,
        status: true,
        displayName: value,
      };
      checkedMorningItems.push(morningObj);
      var initialData = this.state.morningChecked;
      var newData = checkedMorningItems;
      var names = new Set(initialData.map((d) => d.name));
      var merged = [
        ...initialData,
        ...newData.filter((d) => !names.has(d.names)),
      ];
      this.state.morningChecked = merged;
      this.forceUpdate();
    } else {
      var arr = this.state.morningChecked;
      const filteredMorning = arr.filter((item) => item.name !== valueName);
      this.state.morningChecked = filteredMorning;
      this.forceUpdate();
    }
  }
  // Morning Days Selects Ends here

  // Afternoon Days Selects Starts
  checkAfternoonButtom(event) {
    const target = event.target;
    var value = target.value;
    var valueName = target.name;
    let checkedAfternoonItems = [];
    if (target.checked) {
      var noonObj = {
        name: valueName,
        status: true,
        displayName: value,
      };
      checkedAfternoonItems.push(noonObj);
      var initialData = this.state.afternoonChecked;
      var newData = checkedAfternoonItems;
      var names = new Set(initialData.map((d) => d.name));
      var merged = [
        ...initialData,
        ...newData.filter((d) => !names.has(d.names)),
      ];
      this.state.afternoonChecked = merged;
      this.forceUpdate();
    } else {
      var arr = this.state.afternoonChecked;
      const filteredNoon = arr.filter((item) => item.name !== valueName);
      this.state.afternoonChecked = filteredNoon;
      this.forceUpdate();
    }
  }
  // Afternoon Days Selects Ends here

  // Evening Days Selects Starts
  checkEveningButtom(event) {
    const target = event.target;
    var value = target.value;
    var valueName = target.name;
    let checkedEveningItems = [];
    if (target.checked) {
      var eveningObj = {
        name: valueName,
        status: true,
        displayName: value,
      };
      checkedEveningItems.push(eveningObj);
      var initialData = this.state.eveningChecked;
      var newData = checkedEveningItems;
      var names = new Set(initialData.map((d) => d.name));
      var merged = [
        ...initialData,
        ...newData.filter((d) => !names.has(d.names)),
      ];
      this.state.eveningChecked = merged;
      this.forceUpdate();
    } else {
      var arr = this.state.eveningChecked;
      const filteredEvening = arr.filter((item) => item.name !== valueName);
      this.state.eveningChecked = filteredEvening;
      this.forceUpdate();
    }
  }
  // Evening Days Selects Ends here

  // Night Days Selects Starts
  checkNightButtom(event) {
    const target = event.target;
    var value = target.value;
    var valueName = target.name;
    let checkedNightItems = [];
    if (target.checked) {
      var nightObj = {
        name: valueName,
        status: true,
        displayName: value,
      };
      checkedNightItems.push(nightObj);
      var initialData = this.state.nightChecked;
      var newData = checkedNightItems;
      var names = new Set(initialData.map((d) => d.name));
      var merged = [
        ...initialData,
        ...newData.filter((d) => !names.has(d.names)),
      ];
      this.state.nightChecked = merged;
      this.forceUpdate();
    } else {
      var arr = this.state.nightChecked;
      const filteredNight = arr.filter((item) => item.name !== valueName);
      this.state.nightChecked = filteredNight;
      this.forceUpdate();
    }
  }
  // Night Days Selects Ends here

  // Repeat Functionality Starts here
  isRepeatMorningChange = () => {
    this.state.fields['isMrngRepeat'] = !this.state.fields.isMrngRepeat;
    this.forceUpdate();
  };

  isRepeatAfternoonChange = () => {
    this.state.fields['isAftrnRepeat'] = !this.state.fields.isAftrnRepeat;
    this.forceUpdate();
  };

  isRepeatEveningChange = () => {
    this.state.fields['isEvngRepeat'] = !this.state.fields.isEvngRepeat;
    this.forceUpdate();
  };

  isRepeatNightChange = () => {
    this.state.fields['isNghtRepeat'] = !this.state.fields.isNghtRepeat;
    this.forceUpdate();

  };

  // Is repeat Functionality Ends here

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
    // console.log(this.state);
    this.forceUpdate();
  };

  toggleMorningChange = () => {
    this.state.fields['isMorningChecked'] = !this.state.fields.isMorningChecked;
    this.forceUpdate();
  };

  toggleAfternoonChange = () => {
    this.state.fields['isAfternoonChecked'] = !this.state.fields.isAfternoonChecked;
    this.forceUpdate();
  };

  toggleEveningChange = () => {

    this.state.fields['isEveningChecked'] = !this.state.fields.isEveningChecked;
    this.forceUpdate();
  };

  toggleNightChange = () => {

    this.state.fields['isNightChecked'] = !this.state.fields.isNightChecked;
    this.forceUpdate();
  };

  // create or update
  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleValidation() && handle) {
      // this.updateDoctorSlots(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createDoctorSlots(event);
    } else {
      toast.warn("Form has errors.");
    }
  }

  // Delete All Doctor Slots
  deleteDoctorSlots = (event) => {
    // alert('Hai A');
    let doctorId = this.state.fields.doctor_id;
    if (doctorId) {
      var isConfirm = window.confirm(
        "Are you sure to Delete all Doctor Slots."
      );
      if (isConfirm) {
        Httpconfig.httptokendelete(
          Constant.siteurl +
            "api/telemedicine/deleteAllScheduledSlots/" +
            doctorId
          // {
          //   doctor_id: doctorId,
          //   module_type : "telemedicine-app",
          // }
        ).then((response) => {
          if (response.data.status == "200" && response.data.error == false) {
            toast.success("Slots Deleted Sucessfully.", {
              position: "bottom-center",
            });
            //alert("Doctor Slots Deleted Sucessfully..");
            setTimeout(
              () => this.props.history.push("/admin/ViewDoctorSlots"),
              2000
            );
          }
        });
      }
    } else {
      alert("Kindly Choose Doctor Id");
    }
  };
  // Ends here

  // creates new controller
  createDoctorSlots = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;

    // if (this.state.fields.start_date) {
    let start_date = new Date(this.state.fields.start_date);
    let selectedStartDate =
      start_date.getFullYear() +
      "-" +
      Number(start_date.getMonth() + 1) +
      "-" +
      start_date.getDate();
    // } else {
    //   toast.error("Choose Slots Start Date");
    //   return;
    // }

    // if (this.state.fields.end_date) {
    let end_date = new Date(this.state.fields.end_date);
    let selectedEndDate =
      end_date.getFullYear() +
      "-" +
      Number(end_date.getMonth() + 1) +
      "-" +
      end_date.getDate();
    // } else {
    //   toast.error("Choose Slots End Date");
    //   return;
    // }

    // Morning Object Starts
    let morningCheckedDays = this.state.morningChecked;
    let morningCheckedDaysLength = morningCheckedDays.length;

    let morningObject = {};
    morningObject.morningSlotStatus =
      "" + this.state.fields.isMorningChecked + "";
    morningObject.repeat_days = this.state.morningChecked;
    morningObject.repeat = "" + this.state.fields.isMrngRepeat + "";
    morningObject.startTime = {
      slotTime: this.state.fields.morning_from,
    };
    morningObject.endTime = {
      slotTime: this.state.fields.morning_to,
    };
    // Morning Object Ends

    // Afternoon Object Starts
    let afternoonCheckedDays = this.state.afternoonChecked;
    let afternoonCheckedDaysLength = afternoonCheckedDays.length;

    let afternoonObject = {};
    afternoonObject.afternoonSlotStatus =
      "" + this.state.fields.isAfternoonChecked + "";
    afternoonObject.repeat_days = this.state.afternoonChecked;
    afternoonObject.repeat = "" + this.state.fields.isAftrnRepeat + "";
    afternoonObject.startTime = {
      slotTime: this.state.fields.noon_from,
    };
    afternoonObject.endTime = {
      slotTime: this.state.fields.noon_to,
    };
    // Afternoon Object Ends here

    // Evening Object Starts
    let eveningCheckedDays = this.state.eveningChecked;
    let eveningCheckedDaysLength = eveningCheckedDays.length;

    let eveningObject = {};
    eveningObject.eveningSlotStatus =
      "" + this.state.fields.isEveningChecked + "";
    eveningObject.repeat_days = this.state.eveningChecked;
    eveningObject.repeat = "" + this.state.fields.isEvngRepeat + "";
    eveningObject.startTime = {
      slotTime: this.state.fields.evening_from,
    };
    eveningObject.endTime = {
      slotTime: this.state.fields.evening_to,
    };
    // Evening Object Ends here

    // Night Object Starts
    let nightCheckedDays = this.state.nightChecked;
    let nightCheckedDaysLength = nightCheckedDays.length;

    let nightObject = {};
    nightObject.nightSlotStatus = "" + this.state.fields.isNightChecked + "";
    nightObject.repeat_days = this.state.nightChecked;
    nightObject.repeat = "" + this.state.fields.isNghtRepeat + "";
    nightObject.startTime = {
      slotTime: this.state.fields.night_from,
    };
    nightObject.endTime = {
      slotTime: this.state.fields.night_to,
    };
    // Night Object Ends here

    let startDate = new Date(selectedStartDate);
    let endDate = new Date(selectedEndDate);
    // var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // alert("Days Difference "+diffDays);
    if (startDate < endDate && diffDays < 7) {
      alert(
        "End Date Greater than Start Date and difference Should Minimum Week.."
      );
      return;
    }

    let finalSlotArray = {
      fromDate: selectedStartDate,
      toDate: selectedEndDate,
      doctorId: this.state.fields.doctor_id,
      module_type: "telemedicine-app",
      Morning: morningObject,
      Afternoon: afternoonObject,
      Evening: eveningObject,
      Night: nightObject,
      consultationDuration:
        this.state.fields.slot_hours + ":" + this.state.fields.slot_minutes,
      timezone_offset: "Asia/Kolkata",
      eachTimeslotHours: this.state.fields.slot_hours,
      eachTimeslotMinutes: this.state.fields.slot_minutes,
      breakTime: "00:" + this.state.fields.break_minutes,
      notificationTime: "00:10:00",
    };

    // if (morningCheckedDaysLength === 0) {
    //   alert("Iam Morning = 0");
    //   toast.error("Choose Morning Days Slots");
    //   return;
    // }
    // if (afternoonCheckedDaysLength === 0) {
    //   alert("Iam Afternoon = 0");
    //   toast.error("Choose Afternoon Days Slots");
    //   return;
    // }
    // if (eveningCheckedDaysLength === 0) {
    //   alert("Iam Evening = 0");
    //   toast.error("Choose Evening Days Slots");
    //   return;
    // }
    // if (nightCheckedDaysLength === 0) {
    //   alert("Iam Night = 0");
    //   toast.error("Choose Night Days Slots");
    //   return;
    // }

    // toast.error("Choose Night Days Slots");
    // toast.success("Choose Night Days Slots");

    // console.log(this.state);
    // console.log(this.state.fields.isMorningChecked);
    // alert(this.state.fields.isMorningChecked);
    // console.log(finalSlotArray);
    // return;

    Httpconfig.httptokenpost(
      Constant.siteurl + "api/telemedicine/createDoctorSlots",
      finalSlotArray
    )
      .then((response) => {
        if (response.data.status === 200) {
         // alert("Doctor Slots Deleted Sucessfully..");
          toast.success("Solts successfully created..");
          setTimeout(
            () => this.props.history.push("/admin/ViewDoctorSlots"),
            2000
          );
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };
  // Ends here

  setStartDateOnChange = (value) => {
    // let date = new Date(value);
    // let selectedStartDate = date.getFullYear() +"-" +Number(date.getMonth() + 1) +"-" +date.getDate();
    // this.setState({
    //   fields: {
    //     start_date: value,
    //     end_date: this.state.fields.end_date,
    //   },
    // });

    this.state.fields['start_date'] = value;
    this.state.fields['end_date'] = this.state.fields.end_date;
    this.forceUpdate();
    // console.log(this.state.fields);
  };

  setEndDateOnChange = (value) => {
    // let date = new Date(value);
    // let selectedEndDate = date.getFullYear() +"-" +Number(date.getMonth() + 1) +"-" +date.getDate();
    // this.setState({
    //   fields: {
    //     end_date: value,
    //     start_date: this.state.fields.start_date,
    //   },
    // });

    this.state.fields['start_date'] = this.state.fields.start_date;
    this.state.fields['end_date'] = value;
    this.forceUpdate();
  };

  onSelectWeekDay = (weekDay) => {
    this.setState({
      selected: true,
      weekDay: weekDay,
    });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["start_date"]) {
      formIsValid = false;
      errors["start_date"] = "Start Date cannot be empty";
    }
    if (!fields["end_date"]) {
      formIsValid = false;
      errors["end_date"] = "End Date cannot be empty";
    }
    if (!fields["slot_hours"]) {
      formIsValid = false;
      errors["slot_hours"] = "Slot Hours cannot be empty";
    }
    if (!fields["slot_minutes"]) {
      formIsValid = false;
      errors["slot_minutes"] = "Slot Minutes cannot be empty";
    }
    if (!fields["break_minutes"]) {
      formIsValid = false;
      errors["break_minutes"] = "Break Minutes cannot be empty";
    }
    if (!fields["doctor_id"]) {
      formIsValid = false;
      errors["doctor_id"] = "Doctor Id cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  render() {
    const { fields, errors, doctorNames } = this.state;

    return (
      <main >
        <section id="create_slot_sec">
          <form onSubmit={this.checkSubmit.bind(this)}>
            <div className="container">
              <div className="row ">
                <div className="col-md-12">
                  <div className="create_new_slotbox">
                    <div className="row  cr_mid">
                      <div className="col-lg-2 col-md-2 cr_mid">
                        <h2>Create Slot</h2>
                      </div>
                      <div className="col-lg-6 col-md-6 cr_mid">
                        <p className="cr_slot_calendar">
                          <DatePicker
                            name="start_date"
                            autoComplete="off"
                            className="dateInput"
                            placeholderText="Start Date"
                            selected={this.state.fields["start_date"]}
                            onChange={this.setStartDateOnChange}
                            dateFormat="d-MM-yyyy"
                            calendarIcon
                            showMonthDropdown
                            adjustDateOnChange
                          />
                          <br />
                          <span className="cRed">
                            {this.state.errors["start_date"]}
                          </span>
                        </p>
                        <p className="cr_slot_or">to</p>
                        <p href="#" className="cr_slot_calendar">
                          {" "}
                          <DatePicker
                            name="end_date"
                            autoComplete="off"
                            className="dateInput"
                            placeholderText="End Date"
                            selected={this.state.fields["end_date"]}
                            onChange={this.setEndDateOnChange}
                            dateFormat="d-MM-yyyy"
                            calendarIcon
                            showMonthDropdown
                            adjustDateOnChange
                          />
                          <br />
                          <span className="cRed">
                            {this.state.errors["end_date"]}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-3 cr_mid">
                    <label>Select Doctor List</label>
                    <div className="form-group">
                      <select
                        name="doctor_id"
                        className="form-control"
                        value={this.state.fields["doctor_id"] || ""}
                        onChange={this.handleChange.bind(this, "doctor_id")}
                      >
                        <option value="">Select</option>
                        {doctorNames &&
                          doctorNames.map((doctorNames, i) => {
                            return (
                              <option value={doctorNames.id}>
                                {doctorNames.doctor_name}
                              </option>
                            );
                          })}
                      </select>
                      <span className="cRed">
                        {this.state.errors["doctor_id"]}
                      </span>
                    </div>
                  </div>

                  <div class="input-group">
                    <span class="input-group-btn">
                      <span class="btn btn-default btn-file">
                        <img
                          src="/images/patient/img/profile/edit.svg"
                          onClick={this.deleteDoctorSlots}
                        />
                        Delete Slots
                      </span>
                    </span>
                  </div>

                  {/* <div class="input-group">
                    <span class="input-group-btn">
                      <span class="btn btn-default btn-file">
                        <img
                          src="../images/patient/img/Profile/edit.svg"
                          onClick={this.fetchDoctorSlots}
                        />
                        Fetch Doctor Slots
                      </span>
                    </span>
                  </div> */}

                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-12">
                  <div className="create_sch_box">
                    <div className="slot_box">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 slot_mid">
                          <p>
                            <input
                              type="checkbox"
                              name="morning_slot"
                              className="slot_check"
                              checked={this.state.fields["isMorningChecked"]}
                              onChange={this.toggleMorningChange}
                            />{" "}
                            Morning
                          </p>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 slot_mid">
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="04:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["morning_from"]}
                            onChange={this.handleChange.bind(
                              this,
                              "morning_from"
                            )}
                            className="form-control"
                          >
                            {morning_slots.map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                          <span className="slot_or">
                            <img src="https://cdn2.iconfinder.com/data/icons/interface-line-arrows/24/icn-arrow-forward-512.png" />
                          </span>
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="08:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["morning_to"]}
                            onChange={this.handleChange.bind(
                              this,
                              "morning_to"
                            )}
                            className="form-control"
                          >
                            {morning_slots.slice(1).map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="slot_days">
                      {this.state.day_categories.map((item) => (
                        <label>
                          <input
                            type="checkbox"
                            name={item.name}
                            id={item.id}
                            value={item.displayName}
                            onChange={this.checkMorningButtom}
                          />
                          {item.id} &nbsp;&nbsp;
                        </label>
                      ))}
                    </div>
                    <div className="toggle_slot">
                      <p>Repeat</p>
                      <label className="switch">
                        <input
                          className="doc_blue_check"
                          type="checkbox"
                          checked={this.state.fields["isMrngRepeat"]}
                          onChange={this.isRepeatMorningChange}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="create_sch_box">
                    <div className="slot_box">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 slot_mid">
                          <p>
                            <input
                              type="checkbox"
                              className="slot_check"
                              checked={this.state.fields["isAfternoonChecked"]}
                              onChange={this.toggleAfternoonChange}
                            />{" "}
                            Afternoon
                          </p>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 slot_mid">
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="04:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["noon_from"]}
                            onChange={this.handleChange.bind(this, "noon_from")}
                            className="form-control"
                          >
                            {noon_slots.map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                          <span className="slot_or">
                            <img src="https://cdn2.iconfinder.com/data/icons/interface-line-arrows/24/icn-arrow-forward-512.png" />
                          </span>
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="08:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["noon_to"]}
                            onChange={this.handleChange.bind(this, "noon_to")}
                            className="form-control"
                          >
                            {noon_slots.slice(1).map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="slot_days">
                      {this.state.day_categories.map((item) => (
                        <label>
                          <input
                            type="checkbox"
                            name={item.name}
                            id={item.id}
                            value={item.displayName}
                            onChange={this.checkAfternoonButtom}
                          />
                          {item.id} &nbsp;&nbsp;
                        </label>
                      ))}
                    </div>
                    <div className="toggle_slot">
                      <p>Repeat</p>
                      <label className="switch">
                        <input
                          className="doc_blue_check"
                          type="checkbox"
                          checked={this.state.fields["isAftrnRepeat"]}
                          onChange={this.isRepeatAfternoonChange}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="create_sch_box">
                    <div className="slot_box">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 slot_mid">
                          <p>
                            <input
                              type="checkbox"
                              className="slot_check"
                              checked={this.state.fields["isEveningChecked"]}
                              onChange={this.toggleEveningChange}
                            />
                            Evening
                          </p>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 slot_mid">
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="04:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["evening_from"]}
                            onChange={this.handleChange.bind(
                              this,
                              "evening_from"
                            )}
                            className="form-control"
                          >
                            {evening_slots.map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                          <span className="slot_or">
                            <img src="https://cdn2.iconfinder.com/data/icons/interface-line-arrows/24/icn-arrow-forward-512.png" />
                          </span>
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="08:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["evening_to"]}
                            onChange={this.handleChange.bind(
                              this,
                              "evening_to"
                            )}
                            className="form-control"
                          >
                            {evening_slots.slice(1).map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="slot_days">
                      {this.state.day_categories.map((item) => (
                        <label>
                          <input
                            type="checkbox"
                            name={item.name}
                            id={item.id}
                            value={item.displayName}
                            onChange={this.checkEveningButtom}
                          />
                          {item.id} &nbsp;&nbsp;
                        </label>
                      ))}
                    </div>
                    <div className="toggle_slot">
                      <p>Repeat</p>
                      <label className="switch">
                        <input
                          className="doc_blue_check"
                          type="checkbox"
                          checked={this.state.fields["isEvngRepeat"]}
                          onChange={this.isRepeatEveningChange}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="create_sch_box">
                    <div className="slot_box">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-4 slot_mid">
                          <p>
                            <input
                              type="checkbox"
                              className="slot_check"
                              checked={this.state.fields["isNightChecked"]}
                              onChange={this.toggleNightChange}
                            />{" "}
                            Night
                          </p>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 slot_mid">
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="04:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["night_from"]}
                            onChange={this.handleChange.bind(
                              this,
                              "night_from"
                            )}
                            className="form-control"
                          >
                            {night_slots.map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                          <span className="slot_or">
                            <img src="https://cdn2.iconfinder.com/data/icons/interface-line-arrows/24/icn-arrow-forward-512.png" />
                          </span>
                          {/* <input
                            type="text"
                            className="slot_input"
                            value="08:00 AM"
                          /> */}
                          <select
                            value={this.state.fields["night_to"]}
                            onChange={this.handleChange.bind(this, "night_to")}
                            className="form-control"
                          >
                            {night_slots.slice(1).map((option) => {
                              return (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="slot_days">
                      {this.state.day_categories.map((item) => (
                        <label>
                          <input
                            type="checkbox"
                            name={item.name}
                            id={item.id}
                            value={item.displayName}
                            onChange={this.checkNightButtom}
                          />
                          {item.id} &nbsp;&nbsp;
                        </label>
                      ))}
                    </div>
                    <div className="toggle_slot">
                      <p>Repeat</p>
                      <label className="switch">
                        <input
                          className="doc_blue_check"
                          type="checkbox"
                          checked={this.state.fields["isNghtRepeat"]}
                          onChange={this.isRepeatNightChange}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="standard_box">
                    <h2>
                      <img src="https://cdn0.iconfinder.com/data/icons/octicons/1024/globe-512.png" />
                      Indian Standard Time
                    </h2>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="standard_slot">
                          <h3>Each Time Slot</h3>
                          <p>
                            <input
                              type="text"
                              className="standard_input"
                              defaultValue={this.state.fields["slot_hours"]}
                              onChange={this.handleChange.bind(
                                this,
                                "slot_hours"
                              )}
                            />{" "}
                            Hours
                            <br />
                            <span className="cRed">
                              {this.state.errors["slot_hours"]}
                            </span>
                          </p>
                          <p>
                            <input
                              type="text"
                              className="standard_input"
                              defaultValue={this.state.fields["slot_minutes"]}
                              onChange={this.handleChange.bind(
                                this,
                                "slot_minutes"
                              )}
                            />{" "}
                            Minutes
                            <br />
                            <span className="cRed">
                              {this.state.errors["slot_minutes"]}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="standard_slot">
                          <h3>Break Time between Consultation</h3>
                          <p>
                            <input
                              type="text"
                              className="standard_input"
                              defaultValue={this.state.fields["break_minutes"]}
                              onChange={this.handleChange.bind(
                                this,
                                "break_minutes"
                              )}
                            />{" "}
                            Minutes
                            <br />
                            <span className="cRed">
                              {this.state.errors["break_minutes"]}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="standard_btn">
                      <button type="submit">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>
    );
  }
}
