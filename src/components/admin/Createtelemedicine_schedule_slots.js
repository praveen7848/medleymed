import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

export default class Createtelemedicine_schedule_slots extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      morningdays: [
        { id: 1, value: "Monday", isChecked: false },
        { id: 2, value: "Tuesday", isChecked: false },
        { id: 3, value: "Wednesday", isChecked: false },
        { id: 4, value: "Thursday", isChecked: false },
        { id: 5, value: "Friday", isChecked: false },
        { id: 6, value: "Saturday", isChecked: false },
        { id: 7, value: "Sunday", isChecked: false }
      ],
      afternoondays: [
        { id: 1, value: "Monday", isChecked: false },
        { id: 2, value: "Tuesday", isChecked: false },
        { id: 3, value: "Wednesday", isChecked: false },
        { id: 4, value: "Thursday", isChecked: false },
        { id: 5, value: "Friday", isChecked: false },
        { id: 6, value: "Saturday", isChecked: false },
        { id: 7, value: "Sunday", isChecked: false }
      ],
      eveningdays: [
        { id: 1, value: "Monday", isChecked: false },
        { id: 2, value: "Tuesday", isChecked: false },
        { id: 3, value: "Wednesday", isChecked: false },
        { id: 4, value: "Thursday", isChecked: false },
        { id: 5, value: "Friday", isChecked: false },
        { id: 6, value: "Saturday", isChecked: false },
        { id: 7, value: "Sunday", isChecked: false }
      ],
      nightdays: [
        { id: 1, value: "Monday", isChecked: false },
        { id: 2, value: "Tuesday", isChecked: false },
        { id: 3, value: "Wednesday", isChecked: false },
        { id: 4, value: "Thursday", isChecked: false },
        { id: 5, value: "Friday", isChecked: false },
        { id: 6, value: "Saturday", isChecked: false },
        { id: 7, value: "Sunday", isChecked: false }
      ],
    };
  }


  handleMorningAllChecked = (event) => {
    let morningdays = this.state.morningdays
    console.log(morningdays)
    morningdays.forEach(day => day.isChecked = event.target.checked)
    this.setState({ days: morningdays })
  }

  handleAfternoonAllChecked = (event) => {
    let afternoondays = this.state.afternoondays
    console.log(afternoondays)
    afternoondays.forEach(day => day.isChecked = event.target.checked)
    this.setState({ days: afternoondays })
  }

  handleEveningAllChecked = (event) => {
    let eveningdays = this.state.eveningdays
    console.log(eveningdays)
    eveningdays.forEach(day => day.isChecked = event.target.checked)
    this.setState({ days: eveningdays })
  }

  handleNightAllChecked = (event) => {
    let nightdays = this.state.nightdays
    console.log(nightdays)
    nightdays.forEach(day => day.isChecked = event.target.checked)
    this.setState({ days: nightdays })
  }

  handleMorningCheckChieldElement = (event) => {
    let morningdays = this.state.morningdays
    console.log(morningdays)
    morningdays.forEach(day => {
      if (day.value === event.target.value)
        day.isChecked = event.target.checked
    })
    this.setState({ days: morningdays })
  }

  handleAfternoonCheckChieldElement = (event) => {
    let afternoondays = this.state.afternoondays
    console.log(afternoondays)
    afternoondays.forEach(day => {
      if (day.value === event.target.value)
        day.isChecked = event.target.checked
    })
    this.setState({ days: afternoondays })
  }

  handleEveningCheckChieldElement = (event) => {
    let eveningdays = this.state.eveningdays
    console.log(eveningdays)
    eveningdays.forEach(day => {
      if (day.value === event.target.value)
        day.isChecked = event.target.checked
    })
    this.setState({ days: eveningdays })
  }

  handleNightCheckChieldElement = (event) => {
    let nightdays = this.state.nightdays
    console.log(nightdays)
    nightdays.forEach(day => {
      if (day.value === event.target.value)
        day.isChecked = event.target.checked
    })
    this.setState({ days: nightdays })
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    //    this.getsettingInfo(handle);
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  setStartTimeOnChange = (value) => {
    this.setState({ fromDate: value });
  };

  setEndTimeOnChange = (value) => {
    this.setState({ endDate: value });
  };


  checkSubmit(event) {
    event.preventDefault();
    console.log(this.props.match.params);
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
                              <a> Schedule Slots </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Doctor Schedule Slots</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <DatePicker name="fromDate" autoComplete="off" className="dateInput" placeholderText="Click to select From Date" selected={this.state.fromDate} onChange={this.setStartTimeOnChange} dateFormat="MMMM d, yyyy" calendarIcon showMonthDropdown showYearDropdown adjustDateOnChange /><br />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <DatePicker name="toDate" autoComplete="off" className="dateInput" placeholderText="Click to select To Date" selected={this.state.endDate} onChange={this.setEndTimeOnChange} dateFormat="MMMM d, yyyy" calendarIcon showMonthDropdown showYearDropdown adjustDateOnChange /><br />
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <select name="Choose Doctor" onChange={this.handleChange.bind(this, "choose_doctor")} value={this.state.fields["choose_doctoe"] || ""} className="form-control" >
                                  <option value="">Select Doctor</option>
                                  <option value="1">Anil</option>
                                  <option value="2">Avinash</option>
                                  <option value="3">chakri</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group col-md-12">
                                <input type="checkbox" onClick={this.handleMorningAllChecked} value="checkedall" /> Morning
                                  {
                                    this.state.morningdays.map((morningday) => {
                                      return (<li><input key={morningday.id} onClick={this.handleMorningCheckChieldElement} type="checkbox"
                                        checked={morningday.isChecked}
                                        value={morningday.value} /> {morningday.value}</li>)
                                    })
                                  }
                              </div>
                            </div>

                            <div className="col-md-3">
                              <div className="form-group col-md-12">
                                <input type="checkbox" onClick={this.handleAfternoonAllChecked} value="checkedall" /> Afternoon
                                  {
                                    this.state.afternoondays.map((afternoonday) => {
                                      return (<li><input key={afternoonday.id} onClick={this.handleAfternoonCheckChieldElement} type="checkbox"
                                        checked={afternoonday.isChecked}
                                        value={afternoonday.value} /> {afternoonday.value}</li>)
                                    })
                                  }
                              </div>
                            </div>

                            <div className="col-md-3">
                              <div className="form-group col-md-12">
                                <input type="checkbox" onClick={this.handleEveningAllChecked} value="checkedall" /> Evening
                                  {
                                    this.state.eveningdays.map((eveningday) => {
                                      return (<li><input key={eveningday.id} onClick={this.handleEveningCheckChieldElement} type="checkbox"
                                        checked={eveningday.isChecked}
                                        value={eveningday.value} /> {eveningday.value}</li>)
                                    })
                                  }
                              </div>
                            </div>

                            <div className="col-md-3">
                              <div className="form-group col-md-12">
                                <input type="checkbox" onClick={this.handleNightAllChecked} value="checkedall" /> Night
                                
                                  {
                                    this.state.nightdays.map((nightday) => {
                                      return (<li><input key={nightday.id} onClick={this.handleNightCheckChieldElement} type="checkbox"
                                        checked={nightday.isChecked}
                                        value={nightday.value} /> {nightday.value}</li>)
                                    })
                                  }
                                
                              </div>
                            </div>
                          </div>
                         
                        <div className="row">
                          <div className="form-group col-md-12">
                            <button
                              type="submit" className="btn  btn-primary padTopCategorySave fright">
                              Save Schedule
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewsettings" className="padTopCategorySave hrefCategory fright">
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
      </section >
    )
  }
}