import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

export default class ViewMasterModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_data: "",
      datatable: {
        columns: [
          {
            label: "Module Name",
            field: "module_name",
            sort: "asc",
            width: 150,
          },
          {
            label: "Module Sequence",
            field: "sequence_id",
            sort: "asc",
            width: 150,
          },
          {
            label: "Module Status",
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
    this.deleteMasterModule = this.deleteMasterModule.bind(this);
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
    Httpconfig.httptokenget(Constant.siteurl + "api/masterModules")
      .then((response) => {
        this.setState({
          page_data: response.data.data,
        });
        let assignvalues = [];
        this.items = response.data.data.map((item, key) =>
          
          assignvalues.push({
            module_name: item.module_name,
            sequence_id: item.sequence_id,
            'status': (item.status == "1") ? "Active" : "In Active",
            actions: (
              <div>
                <span>
                  <Link
                    to={"/admin/Createmastermodule/" + item.id}
                    className="fa fa-edit point-cursor"
                    title={"Update " + item.module_name}
                  ></Link>
                </span>{" "}
                &nbsp;
                <span>
                  <i
                    onClick={() => this.deleteMasterModule(item.id, item.module_name)}
                    className="fa fa-trash point-cursor"
                    title={"Delete " + item.module_name}
                  ></i>
                </span>{" "}
                &nbsp;
              </div>
            ),
          })
        );
        // console.log(assignvalues);
        // console.log("Hai Avinash");
        // return;
        let masterRoleState = Object.assign({}, this.state);
        // console.log(datatable.rows.length+" datatable.rows.length");
        masterRoleState.datatable.rows = assignvalues;
        this.setState(masterRoleState);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //delete controller
  deleteMasterModule(masterModuleId, name) {
    var isConfirm = window.confirm("Are you sure to delete " + name + "?");
    if (isConfirm) {
      Httpconfig.httptokendelete(Constant.siteurl + "api/masterModules/" + masterModuleId)
        //axios.delete(Constant.siteurl+'api/Users/'+masterModuleId)
        .then((response) => {
          toast.success("Successfully Deleted Master module");
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
                      <Link to="/admin"> Dashboard</Link> &gt; Master roles
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3> Create Master module </h3>
                      </div>
                      <div id="reg_form">
                        <form>
                          <div className="row">
                            <div className="form-group col-md-12">
                              <Link
                                to="/admin/Createmastermodule"
                                className="btn  btn-primary fright"
                              >
                                Create Master module
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
