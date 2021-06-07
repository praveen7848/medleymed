import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigAdmin";
//var Constant = require("../../constants");
import Constant from "../../constants";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
        doctor_count:0,
		patient_count:0,
		clinic_count:0
    };
  }

  // 1.To get detais after first render
  componentDidMount = () => {
   
    this.getClinicsCount();
    this.getDoctorCount();
    this.getPatientCount();
  };

  // 2.To get all Controllers Count
//   getControllerCount() {
//     Httpconfig.httptokenget(
//       Constant.siteurl + "api/Mastercontrollers/getControllerCount"
//     )
//       .then((response) => {
//         var count = response.data.activeData;
//         var total = response.data.totalData;
//         this.setState({
//           controller_count: count,
//           controller_total: total,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   //3. To get all Controllers Count
//   getModuleCount() {
//     Httpconfig.httptokenget(
//       Constant.siteurl + "api/Mastermodule/getModuleCount"
//     )
//       .then((response) => {
//         console.log(response);
//         var count = response.data.activeData;
//         var total = response.data.totalData;
//         this.setState({
//           module_count: count,
//           module_total: total,
//         });
//         console.log(count);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

  // 4.To get all count of Clinics
  getClinicsCount() {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/Mastercontrollers/count/clinics"
    )
      .then((response) => {
        console.log(response);
        var count = response.data.data;

        this.setState({
          clinic_count: count,
        });
        console.log(count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //5.To get all count of Doctors
  getDoctorCount() {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/Mastercontrollers/count/doctors"
    )
      .then((response) => {
        console.log(response);
        var count = response.data.data;
        this.setState({
          doctor_count: count,
        });
        console.log(count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // 6. To get all count of Users
  getPatientCount() {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/Mastercontrollers/count/patients"
    )
      .then((response) => {
        console.log(response);
        var count = response.data.data;

        this.setState({
          patient_count: count,
        });
        console.log(count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      controller_count,
      controller_total,
      module_count,
      module_total,
      pages,
    } = this.state;

    return (
      <section id="main_dashboard">
        <div className="container" id="main_front">
          <div className="row">
            <div className="col-md-12">
              <div className="dash-section">
                <div className="section-header">
                  <h3>Dashboard</h3>
                </div>
              </div>
              {/* -------------------------------------- 1. Below List of  Modules ----------------------------------------------*/}

              <div className="dash_content">
                <div className="row">
                  {/* <div className="col-md-6">
                    <div className="doc_info_box">
                      <span className="info-box-icon bg-red">
                        <i className="fa fa-user-md"></i>
                      </span>
                      <div className="info_box_content">
                        <Link
                          to="/admin/Viewmastermodules"
                          className="dash_content_item"
                        >
                          <span className="info-box-text">Modules</span>
                          <span className="info-box-number">
                            {this.state.controller_count} /{" "}
                            {this.state.controller_total}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* --------------------------------------2.  Below List of  Sub Modules ----------------------------------------------*/}

                  {/* <div className="col-md-6">
                    <div className="doc_info_box">
                      <span className="info-box-icon bg-aqua">
                        <i className="fa fa-user-md"></i>
                      </span>
                      <div className="info_box_content">
                        <Link
                          to="/admin/Viewmastersubmodules"
                          className="dash_content_item"
                        >
                          <span className="info-box-text">Sub Modules</span>
                          <span className="info-box-number">
                            {this.state.module_count} /{" "}
                            {this.state.module_total}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div> */}

                  {/* --------------------------------------3.  Below List of  Clinins ----------------------------------------------*/}

                  <div className="col-md-6">
                    <div className="doc_info_box">
                      <span className="info-box-icon bg-aqua">
                        <i className="fa fa-user-md"></i>
                      </span>
                      <div className="info_box_content">
                        <Link
                          to="/admin/Viewclinics"
                          className="dash_content_item"
                        >
                          <span className="info-box-text">No Of Clinics</span>
                          <span className="info-box-number">
                            {this.state.clinic_count}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* --------------------------------------4.  Below List of  Doctors ----------------------------------------------*/}

                  <div className="col-md-6">
                    <div className="doc_info_box">
                      <span className="info-box-icon bg-red">
                        <i className="fa fa-user-md"></i>
                      </span>
                      <div className="info_box_content">
                        <Link
                          to="/admin/Viewdoctors"
                          className="dash_content_item"
                        >
                          <span className="info-box-text">No Of Doctors</span>
                          <span className="info-box-number">
                            {this.state.doctor_count}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* --------------------------------------5.  Below List of  Patients ----------------------------------------------*/}
                  <div className="col-md-6">
                    <div className="doc_info_box">
                      <span className="info-box-icon bg-red">
                        <i className="fa fa-user-md"></i>
                      </span>
                      <div className="info_box_content">
                        <Link
                          to="/admin/Viewpatients"
                          className="dash_content_item"
                        >
                          <span className="info-box-text">No Of Patients</span>
                          <span className="info-box-number">
                            {this.state.patient_count}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
