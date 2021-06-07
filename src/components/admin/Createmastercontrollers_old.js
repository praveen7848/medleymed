import React, {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../../helpers/Httpconfig';
// import Constant from '../../constants';
import Constant from '../../constants';
import { Link } from "react-router-dom";


export default class Createmastercontrollers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
    };
  }

  // To get detais after first render
  componentDidMount = () => {
    const { handle } = this.props.match.params;
    this.getControllerInfo(handle);
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };
  
    // To get all the ResponderInfo
    getControllerInfo(handle) {
      Httpconfig.httptokenget(Constant.siteurl + "api/Mastercontrollers/" + handle)
        //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
        .then((response) => {
          console.log(response)
          this.setState({
            fields: {
              module_name: response.data[0].module_name,
              module_sequence: response.data[0].module_sqequence,
              module_required: response.data[0].module_required,
              module_status: response.data[0].module_status,
              
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  
  // create or update   
  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
   if (this.handleValidation() && handle) {
      this.updateController(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createController(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  // creates new controller
  createController = (event) =>{
    event.preventDefault();
    const { fields, errors } = this.state;
    console.log(Constant.siteurl + "api/Mastercontrollers")
    Httpconfig.httptokenpost(Constant.siteurl + "api/Mastercontrollers", {
      module_name: fields["module_name"],
      module_sqequence: fields["module_sequence"],
      module_required: fields["module_required"],
      module_status: fields["module_status"],
      
    })
      .then((response) => {
        toast.success("Successfully Created Module");
        setTimeout(
          () => this.props.history.push("/admin/Viewmastercontrollers"),
          2000
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // updates controller
  updateController = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/Mastercontrollers/" + handle,
      {
        module_name: fields["module_name"],
        module_sqequence: fields["module_sequence"],
        module_required: fields["module_required"],
        module_status: fields["module_status"],
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Controller");
        setTimeout(
          () => this.props.history.push("/admin/Viewmastercontrollers"),
          2000
        );
    })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    
    if (!fields["module_name"]) {
      formIsValid = false;
      errors["module_name"] = "Module name cannot be empty";
    } 
   
    if (!fields["module_sequence"]) {
      formIsValid = false;
      errors["module_sequence"] = "Module Sequence cannot be empty";
    }
   

    this.setState({ errors: errors });
    return formIsValid;
  }

  render(){
        return(
            <section id="main_dashboard">
            <div className="container" id="main_front">
              <div className="row">
                <div className="col-md-12">
                  <div className="dash-section">
                    <div className="section-header">
                      <ol className="breadcrumb">
                        <li className="active">
                          <Link to="/admin"> Dashboard</Link> &gt;
                          <a> Master Modules</a>
                        </li>
                      </ol>
                    </div>
                  </div>
    
                  <section id="CMS_tab">
                    <div className="CMS_content">
                      <div className="container">
                        <div className="row">
                          <div className="tab-header">
                            <h3>Create Master Modules</h3>
                          </div>
                          <div id="reg_form">
                            <form  onSubmit={this.checkSubmit.bind(this)}> 
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group col-md-12">
                                    <input
                                      type="ftext"
                                      name="module_name"
                                      className="form-control"
                                      value={this.state.fields["module_name"] || ""}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "module_name"
                                      )}
                                      placeholder="Module Name"
                                    />
                                     <span className="cRed">
                                        {this.state.errors["module_name"]}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group col-md-12">
                                    <input
                                      type="text"
                                      name="module_sequence"
                                      className="form-control"
                                      value={this.state.fields["module_sequence"] || ""}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "module_sequence"
                                      )}
                                      placeholder="Module Sequence"
                                    />
                                    <span className="cRed">
                                        {this.state.errors["module_sequence"]}
                                    </span>
                                  </div>
                                </div>
                             </div>
                            <div className="row">
                            <div className="col-md-4">
                                  <div className="form-group col-md-12">
                                  <label for="customRadio2" class="custom-control-label">Module Required</label>
                                  <div class="custom-control custom-radio" onChange={this.handleChange.bind(
                                      this,"module_required")}>
                                  <input type="radio" value="1" checked={this.state.fields["module_required"] == "1"} name="module_required" /> Yes
                                   &nbsp;&nbsp;&nbsp;
                                  <input type="radio" value="0" checked={this.state.fields["module_required"] == "0"} name="module_required" /> No
                                   </div>
                                  </div>
                                </div>
                       
                            </div>
                              <div className="row">
                              <div className="col-md-4">
                                  <div className="form-group col-md-12" onChange={this.handleChange.bind(
                                      this,"module_status")}>
                                  <label for="customRadio2" class="custom-control-label" >Module Status</label>
                                  <div class="custom-control custom-radio">
                                            <input type="radio" value="1" checked={this.state.fields["module_status"] == "1"} name="module_status" /> Active
                                            &nbsp;&nbsp;&nbsp;
                                            <input type="radio" value="0" checked={this.state.fields["module_status"] == "0"} name="module_status" /> In Active
                                   </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                            <div className="form-group col-md-8">
                              <button
                                type="submit"
                                className="btn  btn-primary padTopCategorySave fright"
                              >
                                Save Module
                              </button>{" "}
                              &nbsp;
                              <Link to="/admin/Viewmastercontrollers" className="padTopCategorySave hrefCategory fright">
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
          </section>
        )
  }
}