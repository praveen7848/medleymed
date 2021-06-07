import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

export default class Viewdoctorslots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slots_data: "",
      datatable: {
        columns: [
          {
            label: "Doctor Name",
            field: "doctor_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "From Date",
            field: "from_date",
            sort: "asc",
            width: 150,
          },
          {
            label: "To Date",
            field: "to_date",
            sort: "asc",
            width: 150,
          },
          {
            label: "Actions",
            field: "actions",
            sort: "asc",
            width: 10,
          },
        ],
        rows: [],
      },
    };
    this.deleteDoctorSlots = this.deleteDoctorSlots.bind(this);
  }

  // To get detais after first render
  componentDidMount = () => {
    this.fetchDoctorSlotsdata();
  };

  // When value changes of the fields
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  fetchDoctorSlotsdata() {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/telemedicine/getDoctorsSlotListDetails"
    )
      .then((response) => {
        this.setState({
          slots_data: response.data.data,
        });
        let assignvalues = [];
        this.items = response.data.data.map((item, key) => {
          //   console.log("doctor_name "+item.doctor_name);
          assignvalues.push({
            doctor_name: item.doctor_name,
            from_date: item.doctor_appointment_schedule_tbls[0].from_date,
            to_date: item.doctor_appointment_schedule_tbls[0].to_date,
            // 'status': (item.status == "1") ? "Active" : "In Active",
            actions: (
              <div>
                <span>
                  <Link
                    to={"/admin/Createdoctorslots/" + item.id}
                    className="fa fa-edit point-cursor"
                    title={"Update " + item.doctor_name}
                  ></Link>
                </span>{" "}
                &nbsp;
                <span>
                  <i
                    onClick={() =>
                      this.deleteDoctorSlots(item.id, item.doctor_name)
                    }
                    className="fa fa-trash point-cursor"
                    title={"Delete " + item.doctor_name}
                  ></i>
                </span>{" "}
                &nbsp;
              </div>
            ),
          });
        });
        // console.log(assignvalues);
        // console.log("Hai Avinash");
        // return;
        let couponState = Object.assign({}, this.state);
        // console.log(datatable.rows.length+" datatable.rows.length");
        couponState.datatable.rows = assignvalues;
        this.setState(couponState);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //delete controller
  deleteDoctorSlots(doctorId, name) {
    var isConfirm = window.confirm(
      "Are you sure to delete " + name + " slots ?"
    );
    if (isConfirm) {
      Httpconfig.httptokendelete(
        Constant.siteurl +
          "api/telemedicine/deleteAllScheduledSlots/" +
          doctorId
      )
        .then((response) => {
          toast.success("Successfully Deleted Doctor Slots");
          setTimeout(() => window.location.reload(), 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  render() {
    const { datatable } = this.state;
    return (
      <section id="main_dashboard">
        <div className="container" id="main_front">
          <div className="row">
            <div className="col-md-12">
              <div className="dash-section">
                <div className="section-header">
                  <ol className="breadcrumb">
                    <li className="active">
                      <Link to="/admin"> Dashboard</Link> &gt; Doctor Slots
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3> Create Doctor Slots </h3>
                      </div>
                      <div id="reg_form">
                        <form>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <Link
                                to="/admin/Createdoctorslots"
                                className="btn  btn-primary fright"
                              >
                                Create Doctor Slots
                              </Link>
                            </div>
                          </div>
                        </form>
                        {datatable.rows.length === 0 ? (
                          <p>Loading............</p>
                        ) : (
                          <MDBDataTable
                            striped
                            bordered
                            small
                            data={datatable}
                          />
                        )}
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              className="update_btn"
                              style={{ textAlign: "right" }}
                            ></div>
                          </div>
                        </div>
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
