import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

export default class ViewDoctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_data: "",
      datatable: {
        columns: [
          {
            label: "Name",
            field: "doctor_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "Clinic Name",
            field: "clinic_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "Actions",
            field: "actions",
            sort: "asc",
            width: 10,
          },
          {
            label: "registraion_no",
            field: "registraion_no",
            sort: "asc",
            width: 10,
          },
        ],
        rows: [],
      },
    };
    this.deleteDoctor = this.deleteDoctor.bind(this);
  }

  // To get detais after first render
  componentDidMount = () => {
    this.fetchpagesdata();
  };

  // When value changes of the fields
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  fetchpagesdata() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/getAllDoctors")
      .then((response) => {
        this.setState({
          page_data: response.data.data,
        });
        let assignvalues = [];
        this.items = response.data.data.map((item, key) =>{

            let clinicName = "N/A";
            if(item.clinic_tbl!= null){
               clinicName = item.clinic_tbl.clinic_name;
            }
          // console.log("doctor_name "+item.doctor_name),
          assignvalues.push({
            doctor_name: item.doctor_name,
            clinic_name: clinicName,
            registraion_no: item.registraion_no,
            // 'status': (item.status == "1") ? "Active" : "In Active",
            actions: (
              <div>
                <span>
                  <Link
                    to={"/admin/Createdoctor/" + item.id}
                    className="fa fa-edit point-cursor"
                    title={"Update " + item.doctor_name}
                  ></Link>
                </span>{" "}
                &nbsp;
                <span>
                  <i
                    onClick={() => this.deleteDoctor(item.id, item.doctor_name)}
                    className="fa fa-trash point-cursor"
                    title={"Delete " + item.doctor_name}
                  ></i>
                </span>{" "}
                &nbsp;
              </div>
            ),
          })
        }
        );
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
  deleteDoctor(doctorId, name) {
    var isConfirm = window.confirm("Are you sure to delete " + name + "?");
    if (isConfirm) {
      Httpconfig.httptokendelete(Constant.siteurl + "api/Doctor/" + doctorId)
        //axios.delete(Constant.siteurl+'api/Users/'+doctorId)
        .then((response) => {
          toast.success("Successfully Deleted Doctor");
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
                      <Link to="/admin"> Dashboard</Link> &gt; Doctors
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3> Create Doctor </h3>
                      </div>
                      <div id="reg_form">
                        <form>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <Link
                                to="/admin/Createdoctor"
                                className="btn  btn-primary fright"
                              >
                                Create Doctor
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
