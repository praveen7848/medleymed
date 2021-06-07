import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Link } from "react-router-dom";
import Iframe from "react-iframe";
import Frame from "react-frame-component";

import 'bootstrap/dist/css/bootstrap.css';
import { Button, Modal } from 'react-bootstrap';


import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBCollapse,
} from "mdbreact";
import { Collapse } from "react-collapse";

import Patnewcss from "../../public/css/facilitator/manage.css";
import Chat from "../admin/ChatFacilitator";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
const moment = require("moment");

export default class Facilitator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      collapseID: "",
      modal: false,
      show: false,
    };
    this.handleScheduleShow = this.handleScheduleShow.bind(this);
    this.handleScheduleClose = this.handleScheduleClose.bind(this);
  }

  toggleCollapse = (collapseID) => () => {
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));
  };

  setGender(event) {
    console.log(event.target.value);
  }

  setStartTime = (value) => {
    alert("Selected Date" + value);
    this.setState({ start_date: value });
    console.clear();
    console.log(this.state.start_date);
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  handleScheduleClose() {
    this.setState({ show: false });
  }

  handleScheduleShow() {
    this.setState({ show: true });
  }

  render() {
    const { fields, errors } = this.state;
    const styleObject = {
      height: "200px",
      width: "100%",
    };

    var currentDate = new Date();
    var numberOfDaysToAdd = 45;
    const daysHighlighted = new Array(numberOfDaysToAdd).fill(currentDate);

    return (
      <section id="main_dashboard">

            <div className="content-wrapper col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <section className="content" id="manage">
                        <div className="manage_main">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="manage_date">
                                        <h5>10 April, 2020, Friday</h5>
                                        <select className="manage_round">
                                            <option>02:00&nbsp;PM&nbsp;-&nbsp;03:00&nbsp;PM</option>
                                            <option>02:00&nbsp;PM&nbsp;-&nbsp;03:00&nbsp;PM</option>
                                            <option>02:00&nbsp;PM&nbsp;-&nbsp;03:00&nbsp;PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <select className="manage_doc_round">
                                        <option>All Doctors</option>
                                        <option>Dr. Rohit</option>
                                        <option>Dr. Suhas</option>
                                    </select>
                                    <span className="all_doc"> <img src="../images/facilitator/icons/allDoctors_icon.svg" /></span>
                                </div>
                            </div>

                            <div className="manage_doc_main">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="manage_doc_box">
                                            <div className="doc_head">
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h2 className="doc_name">
                                                            Dr. Rohit Sharma
                                               </h2>
                                                        <p>General Physician, 998855212 </p>
                                                        <p>Assistant 1 - 9988990053</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h3 className="doc_on"><i className="fa fa-circle" aria-hidden="true"></i>online</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="panel-group wrap doc_pan" id="bs-collapse">
                                                <div className="doc_body">
                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("one")} className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Ajay Sharma</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                <p className="doc_comp"><img src="../images/facilitator/icons/completed_tick_icon.svg" /><span>Completed</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="one" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" onClick={this.handleScheduleShow}><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> React Reschedule </span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("two")} href="#two" className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Ajay Sharma</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                <p className="doc_comp"><img src="../images/facilitator/icons/completed_tick_icon.svg" /><span>Completed</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="two" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>


                                                    <div className="panel">
                                                        <div className="panel-heading active">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  className="collapse show" onClick={this.toggleCollapse("three")} href="#three" aria-expanded="true">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Ajay Sharma</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                <p className="doc_wait"><img src="../images/facilitator/icons/pending_icon.svg" /><span>Patient Waiting</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="three" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div className="manage_doc_box">
                                            <div className="doc_head">
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h2 className="doc_name">
                                                            Dr. Ankhit Sharma
                                               </h2>
                                                        <p>Cardiologist, 9874563258 </p>
                                                        <p>Assistant 1 - 896547852</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h3 className="doc_on"><i className="fa fa-circle" aria-hidden="true"></i>online</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="panel-group wrap doc_pan" id="bs-collapse">
                                                <div className="doc_body">
                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("four")} href="#four" className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Ramesh Rao</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                 <h2 className="doc_incomp"><img src="../images/facilitator/icons/incomplete_icon.svg" /><span>Incomplete</span></h2>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="four" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("five")} href="#five" className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Ajay Sharma</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                            <h2 className="doc_incomp"><img src="../images/facilitator/icons/incomplete_icon.svg" /><span>Incomplete</span></h2>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="five" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>


                                                    <div className="panel">
                                                        <div className="panel-heading active">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  className="collapse show" onClick={this.toggleCollapse("exampleSix")} href="#exampleSix" aria-expanded="true">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Bipin Raj</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                            <h2 className="doc_incomp"><img src="../images/facilitator/icons/incomplete_icon.svg" /><span>Incomplete</span></h2>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="exampleSix" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>






                                </div>
                            </div>



                            <div className="manage_doc_main">
                                <div className="row">
                                    


                                    <div className="col-md-6">
                                        <div className="manage_doc_box">
                                            <div className="doc_head">
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h2 className="doc_name">
                                                            Dr. Anil Kumar
                                               </h2>
                                                        <p>Cardiologist, 9874563258 </p>
                                                        <p>Assistant 1 - 896547852</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h3 className="doc_on"><i className="fa fa-circle" aria-hidden="true"></i>online</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="panel-group wrap doc_pan" id="bs-collapse">
                                                <div className="doc_body">
                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("Exfour")} href="#Exfour" className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Pavan Kumar</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                 <h2 className="doc_incomp"><img src="../images/facilitator/icons/incomplete_icon.svg" /><span>Incomplete</span></h2>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="Exfour" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("Exfive")} href="#Exfive" className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Vinay Sharma</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                <p className="doc_comp"><img src="../images/facilitator/icons/completed_tick_icon.svg" /><span>Completed</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="Exfive" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>


                                                    <div className="panel">
                                                        <div className="panel-heading active">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  className="collapse show" onClick={this.toggleCollapse("exampleSixty")} href="#exampleSixty" aria-expanded="true">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Vinay Kumar</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                <p className="doc_wait"><img src="../images/facilitator/icons/pending_icon.svg" /><span>Patient Waiting</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="exampleSixty" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div className="manage_doc_box">
                                            <div className="doc_head">
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h2 className="doc_name">
                                                            Dr. Nirvan Sharma
                                               </h2>
                                                        <p>General Physician, 998855212 </p>
                                                        <p>Assistant 1 - 9988990053</p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <h3 className="doc_on"><i className="fa fa-circle" aria-hidden="true"></i>online</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="panel-group wrap doc_pan" id="bs-collapse">
                                                <div className="doc_body">
                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("Exone")} className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Ajay Malhotra</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                <p className="doc_comp"><img src="../images/facilitator/icons/completed_tick_icon.svg" /><span>Completed</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="Exone" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                    <div className="panel">
                                                        <div className="panel-heading">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  onClick={this.toggleCollapse("Extwo")} href="#Extwo" className="collapsed" aria-expanded="false">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>Sharma</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                                <p className="doc_comp"><img src="../images/facilitator/icons/completed_tick_icon.svg" /><span>Completed</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="Extwo" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>


                                                    <div className="panel">
                                                        <div className="panel-heading active">
                                                            <h4 className="panel-title">
                                                                <a data-toggle="collapse"  className="collapse show" onClick={this.toggleCollapse("Exthree")} href="#Exthree" aria-expanded="true">
                                                                    <div className="doc_det">
                                                                        <div className="row">
                                                                            <div className="col-md-7">
                                                                                <div className="doc_infor">
                                                                                    <p>01:55PM - 02:00 PM</p>
                                                                                    <h3>kiran</h3>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-5 text-right">
                                                                            <p className="doc_comp"><img src="../images/facilitator/icons/completed_tick_icon.svg" /><span>Completed</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </h4>
                                                        </div>

                                                        <MDBCollapse id="Exthree" isOpen={this.state.collapseID}>
                                                            <div className="panel-body">
                                                                <div className="doc_det_acc">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="doc_schdle">
                                                                                <h6><img src="../images/facilitator/icons/call_icon.svg" /> 9988999888</h6>
                                                                                <p className="resch" data-toggle="modal" data-target="#schduleModal"><img src="../images/facilitator/icons/reschedule_icon.svg" /><span> Reschedule</span></p>
                                                                                <p className="resch" data-toggle="modal" data-target="#processModal"><img src="../images/facilitator/icons/process.svg" /><span> Process Refund</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            {/* <iframe id="myFrame" src="../Chat.html" style={styleObject}></iframe> */}
                                                                            <Frame>
                                                                                <Chat />
                                                                            </Frame>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </MDBCollapse>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>






                                </div>
                            </div>




                        </div>
                    </section>
                </div>





                <Modal show={this.state.show} onHide={this.handleScheduleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Reschedule Appointment</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="schdule_body">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-6">
                                            <div className="sch_mod_doc">
                                                <p>01:15 PM - 02:00 PM</p>
                                                <h2>Ramesh Rao</h2>

                                            </div>
                                            <div id="doc_cal">
                                               
                                            <DatePicker name="start_date" autoComplete="off" 
                                            className="dateInput" placeholderText="Start Date" 
                                            selected={this.state.start_date} 
                                            onChange={this.setStartTime} 
                                            dateFormat="d-MM-yyyy" 
                                            highlightDates={[{
                                                "react-datepicker__day--highlighted": new Array(numberOfDaysToAdd).fill().map((_, i) => {  
                                                  const d = new Date();
                                                  d.setDate(d.getDate() + i);
                                                  return d;
                                              })
                                            }]}
                                            inline
                                            calendarIcon 
                                            minDate={new Date()}
                                            maxDate={moment().add(5, "days")}
                                             />
                                            <br />

                                            </div>
                                        </div>

                                        <div className="col-md-6 col-sm-6">

                                            <div className="sch_appoint">
                                                <div>
                                                    <h3>Morning</h3>
                                                    <div className="row ">
                                                        <div className="col-md-12">
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3>Afternoon</h3>
                                                    <div className="row ">
                                                        <div className="col-md-12">
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3>Evening</h3>
                                                    <div className="row ">
                                                        <div className="col-md-12">
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={this.handleScheduleClose}>
      Close
    </Button>
    <Button variant="primary" onClick={this.handleScheduleClose}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>






                <div id="schduleModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content" id="schdule_main">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Reschedule Appointment</h4>
                            </div>
                            <div className="modal-body">
                            <div className="schdule_body">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-6">
                                            <div className="sch_mod_doc">
                                                <p>01:15 PM - 02:00 PM</p>
                                                <h2>Ramesh Rao</h2>
                                            </div>
                                            <div id="doc_cal">
                                                                                           <DatePicker name="start_date" autoComplete="off" 
                                            className="dateInput" placeholderText="Start Date" 
                                            selected={this.state.start_date} 
                                            onChange={this.setStartTime} 
                                            dateFormat="d-MM-yyyy" 
                                            highlightDates={[{
                                                "react-datepicker__day--highlighted": new Array(numberOfDaysToAdd).fill().map((_, i) => {  
                                                  const d = new Date();
                                                  d.setDate(d.getDate() + i);
                                                  return d;
                                              })
                                            }]}
                                            inline
                                            calendarIcon 
                                            minDate={new Date()}
                                            maxDate={moment().add(5, "days")}
                                             />
                                            <br />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6">
                                            <div className="sch_appoint">
                                                <div>
                                                    <h3>Morning</h3>
                                                    <div className="row ">
                                                        <div className="col-md-12">
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3>Afternoon</h3>
                                                    <div className="row ">
                                                        <div className="col-md-12">
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3>Evening</h3>
                                                    <div className="row ">
                                                        <div className="col-md-12">
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                            <div className="col-md-4 col-sm-4 sch_time">
                                                                <p>02:00 PM</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn_clse" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn_aply">Apply</button>
                            </div>
                        </div>
                    </div>
                </div>






                <div id="processModal" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content" id="refund_main">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Select the Reason</h4>
                            </div>
                            <div class="modal-body">
                                <div class="refund_body">
                                    <div class="ref_mod_doc">
                                        <p>01:15 PM - 02:00 PM</p>
                                        <h3>Ramesh Rao</h3>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h2><img src="../images/facilitator/icons/select_tick_icon.svg"/>Select Reason For Refund</h2>

                                                 <div class="funkyradio" onChange={this.setGender.bind(this)}>
                                                    <div class="funkyradio-success">
                                                        <input type="radio" name="radio" value="1" id="radio1" />
                                                        <label for="radio1">The doctor was late</label>
                                                    </div>
                                                    <div class="funkyradio-success">
                                                        <input type="radio" name="radio" value="2" id="radio2" />
                                                        <label for="radio2">Call disconnected</label>
                                                    </div>
                                                    <div class="funkyradio-success">
                                                        <input type="radio" name="radio" value="2" id="radio3" />
                                                        <label for="radio3">Appointment cancelled</label>
                                                    </div>
                                                    <div class="funkyradio-success">
                                                        <input type="radio" name="radio" id="radio4" />
                                                        <label for="radio4">Patient don't want reschedule</label>
                                                    </div>
                                                </div> 

                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn_aply">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
      </section>
    );
  }
}
