import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

export default class Viewpatients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_data: "",
      datatable: {
        columns: [
          // {
          //   label: "#",
          //   field: "id",
          //   sort: "asc",
          //   width: 150,
          // },
          // {
          //   label: "User_id",
          //   field: "user_id",
          //   sort: "asc",
          //   width: 150,
          // },
          {
            label: "Name",
            field: "name",
            sort: "asc",
            width: 10,
          },
          // {
          //   label: "Last_name",
          //   field: "last_name",
          //   sort: "asc",
          //   width: 10,
          // },
          {
            label: "DOB",
            field: "dob",
            sort: "asc",
            width: 10,
          },
          {
            label: "Gender",
            field: "gender",
            sort: "asc",
            width: 10,
          },
          {
            label: "PhoneNumber",
            field: "phone_number",
            sort: "asc",
            width: 10,
          },
          // {
          //   label: "Profile_Pic",
          //   field: "profile_pic",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Address",
          //   field: "address",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Area",
          //   field: "area",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Deseases",
          //   field: "chornic_diseases_list",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "State",
          //   field: "state",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Zip",
          //   field: "zip_code",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Lat_Long",
          //   field: "lat_long",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Relation",
          //   field: "relation_patient_id",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Relation",
          //   field: "relation",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Marital_Status",
          //   field: "marital_status",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Nationality",
          //   field: "nationality",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Occupation",
          //   field: "occupation",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Adhaar",
          //   field: "Adhaar_no",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Aarogyasri",
          //   field: "arogya_sri_no",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Related Medicin",
          //   field: "related_medication",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Allergies",
          //   field: "drug_allergies",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Status",
          //   field: "status",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Created",
          //   field: "createdAt",
          //   sort: "asc",
          //   width: 10,
          // },
          // {
          //   label: "Updated",
          //   field: "updatedAt",
          //   sort: "asc",
          //   width: 10,
          // },
        ],
        rows: [],
      },
    };
    this.deletePatient = this.deletePatient.bind(this);
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
    Httpconfig.httptokenget(Constant.siteurl + "api/Patients/")
      .then((response) => {
        console.log(response.data);
        console.log(response.data.data);

        this.setState({
          page_data: response.data
        });

        let assignvalues = [];
        this.items = response.data.map((item, key) =>{

            // let clinicName = "N/A";
            // if(item.clinic_tbl!= null){
            //    clinicNam = item.clinic_tbl.clinic_name;
            // }
          // console.log("doctor_name "+item.doctor_name),
          assignvalues.push({
            name: item.name,
            dob:item.dob,
            gender:item.gender,
            phone_number:item.phone_number,
            
            // 'status': (item.status == "1") ? "Active" : "In Active",
            actions: (
              <div>
                <span>
                  <Link
                    to={"/admin/CreatePatient/" + item.id}
                    className="fa fa-edit point-cursor"
                    title={"Update " + item.patient_name}
                  ></Link>
                </span>{" "}
                &nbsp;
                <span>
                  <i
                    onClick={() => this.deleteDoctor(item.id, item.patient_name)}
                    className="fa fa-trash point-cursor"
                    title={"Delete " + item.patient_name}
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
  deletePatient(doctorId, name) {
    var isConfirm = window.confirm("Are you sure to delete " + name + "?");
    if (isConfirm) {
      Httpconfig.httptokendelete(Constant.siteurl + "api/Doctor/" + doctorId)
        //axios.delete(Constant.siteurl+'api/Users/'+doctorId)
        .then((response) => {
          toast.success("Successfully Deleted patient");
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
                        <h3> Create Patient </h3>
                      </div>
                      <div id="reg_form">
                        <form>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <Link
                                to="/admin/CreatePatient"
                                className="btn  btn-primary fright"
                              >
                                Create patient
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
     