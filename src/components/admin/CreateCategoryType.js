import React, { Component } from "react";

import { ToastContainer } from "react-toastify";
import toast from "../toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

var Constant = require("../../constants");

export default class CreateCategoryType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_type: "",

      datatable: {
        columns: [
          {
            label: "Category Type",
            field: "categorytype",
            sort: "asc",
            width: 270,
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
    this.deleteCategory = this.deleteCategoryType.bind(this);
  }

  // When value changes of the fields
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // To add new category when user submits the form
  createCategoryType = (event) => {
    event.preventDefault();

    const { category_type } = this.state;
    console.log(this.state.category_type);
    Httpconfig.httptokenpost(Constant.siteurl + "api/CategoryType", {
      category_type: category_type,
    })
      .then((response) => {
        toast.success("Successfully Created Category Type");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;

    if (handle) {
      this.updateCategoryType(event);
    } else if (handle == undefined) {
      this.createCategoryType(event);
    } else {
      alert("Form has errors.");
    }
  }
  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    //this.getCategoryList();
    this.getCategoryTypeList();
    this.editCategoryInfo(handle);
  };

  // To get all the category types
  getCategoryTypeList() {
    Httpconfig.httptokenget(Constant.siteurl + "api/CategoryType")
      .then((response) => {
        this.setState({
          category_types: response.data,
        });
        let categoryTypeArray = [];

        this.items = this.state.category_types.map((item, key) =>
          categoryTypeArray.push({
            categorytype: item.category_type,
            actions: (
              <div>
                <span>
                  <i
                    onClick={() =>
                      this.deleteCategoryType(item.id, item.category_type)
                    }
                    className="fa fa-trash point-cursor"
                    title={"Delete " + item.category_type}
                  ></i>
                </span>{" "}
                &nbsp;
                <span>
                  <Link
                    to={"/admin/CategoryRegistration/" + item.id}
                    className="fa fa-sitemap point-cursor cBlack"
                    title={"Set Categories for " + item.category_type}
                  ></Link>
                </span>
              </div>
            ),
          })
        );

        let categoryTypeState = Object.assign({}, this.state);
        categoryTypeState.datatable.rows = categoryTypeArray;
        this.setState(categoryTypeState);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // To delete any category
  deleteCategoryType(catId, catName) {
    var isConfirm = window.confirm(
      "Are you sure to delete " + catName + "Tyoe?"
    );
    if (isConfirm) {
      Httpconfig.httptokendelete(Constant.siteurl + "api/CategoryType/" + catId)
        .then((response) => {
          toast.success("Successfully Deleted Category Type");
          setTimeout(() => this.props.history.push("/CategoryType"), 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // To Edit any Patient
  editCategoryType(categoryId) {
    window.location.href = "/admin/CategoryType/" + categoryId;
  }

  // To Edit any Category
  editCategoryInfo(categoryId) {
    Httpconfig.httptokenget(Constant.siteurl + "api/CategoryType/" + categoryId)
      .then((response) => {
        this.setState({
          category_type: response.data.category_type,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // To add new Responder when user submits the form
  updateCategoryType = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { category_type } = this.state;
    Httpconfig.httptokenput(Constant.siteurl + "api/CategoryType/" + handle, {
      category_type: category_type,
    })
      .then((response) => {
        toast.success("Successfully Updated Category Type");
        setTimeout(() => window.location.reload(false), 2000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  render() {
    const { categories, category_types, datatable } = this.state;
    return (
      <section id="main_dashboard">
        <div className="container" id="main_front">
          <div className="row">
            <div className="col-md-12">
              <div className="dash-section">
                <div className="section-header">
                  <ol className="breadcrumb">
                    <li className="active">
                      <Link to="/admin"> Dashboard</Link> &gt; Category Type
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Category Type</h3>
                      </div>
                      <div id="reg_form">
                        <form onSubmit={this.checkSubmit.bind(this)}>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <label>
                                  Category Type{" "}
                                  <span className="mandatory_id">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="category_type"
                                  value={this.state.category_type}
                                  onChange={this.handleChange}
                                  className="form-control"
                                  placeholder="Enter category Type"
                                />
                              </div>
                            </div>

                            <div className="form-group col-md-2">
                              <button
                                type="submit"
                                className="btn btn-primary padTopCategorySave"
                              >
                                Add Category Type
                              </button>
                            </div>
                          </div>
                        </form>

                        {datatable.rows.length === 0 ? (
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group col-md-12 padErrorBG">
                                No Records Found
                              </div>
                            </div>
                          </div>
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
