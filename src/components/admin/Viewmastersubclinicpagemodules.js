import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

export default class ViewMasterSubModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_data: "",
      datatable: {
        columns: [
          {
            label: "Clinic Name",
            field: "clinic_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "Master Module",
            field: "module_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "Sub Module",
            field: "sub_module_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "Page Name",
            field: "page_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "Page Sequence",
            field: "page_module_sequence_id",
            sort: "asc",
            width: 150,
          },
          {
            label: "Status",
            field: "status",
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
    this.deleteSubMasterPageModule = this.deleteSubMasterPageModule.bind(this);
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
    Httpconfig.httptokenget(Constant.siteurl + "api/masterSubModuleClinicPage")
      .then((response) => {
        this.setState({
          page_data: response.data.data,
        });
        let assignvalues = [];
        let responseLength = Object.keys(response.data.data).length;

        if (responseLength > 0 && responseLength != null) {
          for (let count = 0; count < responseLength; count++) {
            let pageName = "N/A";
            let subModuleName = "N/A";
            if (response.data.data[count].master_sub_module_pages_tbl != null) {
              pageName =
                response.data.data[count].master_sub_module_pages_tbl.page_name;
            }
            if (response.data.data[count].master_sub_module_tbl != null) {
              subModuleName =
                response.data.data[count].master_sub_module_tbl.sub_module_name;
            }
            assignvalues.push({
              page_name: pageName,
              module_name:
                response.data.data[count].master_modules_tbl.module_name,
              sub_module_name: subModuleName,
              page_module_sequence_id:response.data.data[count].page_module_sequence_id,
              clinic_name : response.data.data[count].clinic_tbl.clinic_name,
              status:
                response.data.data[count].status == "1"
                  ? "Active"
                  : "In Active",
              actions: (
                <div>
                  <span>
                    <Link
                      to={
                        "/admin/Createmastersubclinicpagemodule/" +
                        response.data.data[count].id
                      }
                      className="fa fa-edit point-cursor"
                      title={"Update " + pageName}
                    ></Link>
                  </span>{" "}
                  &nbsp;
                  <span>
                    <i
                      onClick={() =>
                        this.deleteSubMasterPageModule(
                          response.data.data[count].id,
                          pageName
                        )
                      }
                      className="fa fa-trash point-cursor"
                      title={"Delete " + pageName}
                    ></i>
                  </span>{" "}
                  &nbsp;
                </div>
              ),
            });
          }
        }
        let masterSubPageModuleState = Object.assign({}, this.state);
        masterSubPageModuleState.datatable.rows = assignvalues;
        this.setState(masterSubPageModuleState);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //delete controller
  deleteSubMasterPageModule(masterSubPageModuleId, name) {
    var isConfirm = window.confirm("Are you sure to delete " + name + "?");
    if (isConfirm) {
      Httpconfig.httptokendelete(
        Constant.siteurl +
          "api/masterSubModuleClinicPage/" +
          masterSubPageModuleId
      )
        //axios.delete(Constant.siteurl+'api/Users/'+masterSubPageModuleId)
        .then((response) => {
          toast.success("Successfully Deleted Master Sub Clinic page module");
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
                      <Link to="/admin"> Dashboard</Link> &gt; Master Sub clinic
                      page module
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3> Create Master sub clinic page module </h3>
                      </div>
                      <div id="reg_form">
                        <form>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <Link
                                to="/admin/Createmastersubclinicpagemodule"
                                className="btn  btn-primary fright"
                              >
                                Create Master Page module
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
