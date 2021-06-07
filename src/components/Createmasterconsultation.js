import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/Httpconfig';
import Constant from '../constants';
import { Link } from "react-router-dom";

export default class Createmasterconsultation extends Component{
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},

    };
    
  }

  //default component
  componentWillMount() {
    this.state.fields["is_required"] = "1";
 //   let fields = this.state.fields;
  }

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };
  
  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;

    if (this.handleValidation() && handle) {
     // this.updateResponder(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createConfiguration(event);
    } else {
      console.log(this.state.fields)
      toast.warn("Form has errors.");
    }
  }
  
  createConfiguration = (event) =>{
    event.preventDefault();
    var handle = this.props.match.params.handle;
    const { fields, errors } = this.state;
    //console.log(this.state.fields)
    Httpconfig.httptokenpost(Constant.siteurl + "api/Users/", {
      module_name: fields["module_name"],
      module_sequence: fields["module_sequence"],
      module_required: fields["module_required"],
      module_status: fields["module_status"],
      modified_by: "admin",
      
    })
      .then((response) => {
        toast.success("Successfully Created Module");
        setTimeout(
          () => this.props.history.push("/ResponderRegistration"),
          2000
        );
        //	window.location.reload();
        this.props.history.push('/SetDoNotDisturb/'+handle);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    
    if (!fields["master_module_id"]) {
      formIsValid = false;
      errors["master_module_id"] = "Please select master module";
    } 
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Module name cannot be empty";
    } 
    if (!fields["sequence"]) {
      formIsValid = false;
      errors["sequence"] = "Module sequence id cannot be empty";
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
                          <Link to="/dashboard"> Dashboard</Link> &gt;
                          <a> Master Module</a>
                        </li>
                      </ol>
                    </div>
                  </div>
    
                  <section id="CMS_tab">
                    <div className="CMS_content">
                      <div className="container">
                        <div className="row">
                          <div className="tab-header">
                            <h3>Create Master Module</h3>
                          </div>
                          <div id="reg_form">
                            <form onSubmit={this.checkSubmit.bind(this)}>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group col-md-12">
                                  <select
                                  name="master_module_id"
                                  className="form-control"  value={this.state.fields["master_module_id"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "master_module_id"
                                  )}
                                >
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                  <span className="cRed">
                                          {this.state.errors["master_module_id"]}
                                  </span>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                              <div className="col-md-4">
                                  <div className="form-group col-md-12">
                                    <input
                                      type="text"
                                      name="name"
                                      value={this.state.fields["name"] || ""}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "name"
                                      )}
                                      className="form-control"
                                      placeholder="Module Name"
                                    />
                                    <span className="cRed">
                                          {this.state.errors["name"]}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group col-md-12">
                                    
                                     <label for="customRadio2" class="custom-control-label">Module Required</label>
                                  <div class="custom-control custom-radio" onChange={this.handleChange.bind(
                                      this,"is_required")}>
                                      <input type="radio" value="1"  checked={this.state.fields["is_required"] === "1"}  name = "isrequired" /> Yes
                                      &nbsp;&nbsp;&nbsp;
                                      <input type="radio" value="0" checked={this.state.fields["is_required"] === "0"} name = "isrequired" /> No
                                  </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group col-md-12">
                              <label for="customRadio2" class="custom-control-label">Module  Status</label>
                                  <div class="custom-control custom-radio" onChange={this.handleChange.bind(
                                      this,"consultation_status")}>
                                           <input type="radio" value="1" checked={this.state.fields["consultation_status"] === "1"} name="consultation_status" /> Active
                                            &nbsp;&nbsp;&nbsp;
                                            <input type="radio" value="0" checked={this.state.fields["consultation_status"] === "0"} name="consultation_status" /> In Active     
                                   </div>
                                  </div>
                                  <div className="form-group col-md-12">
                                    <input
                                      type="text"
                                      name="sqequence"
                                      value={this.state.fields["sequence"] || ""}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "sequence"
                                      )}
                                      className="form-control"
                                      placeholder="Module Sequence"
                                    />
                                     <span className="cRed">
                                          {this.state.errors["sequence"]}
                                    </span>
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
                              <Link to="/Viewmasterconsultation"  className="padTopCategorySave hrefCategory fright">
                                Cancel
                              </Link>{" "}
                              &nbsp; &nbsp;
                            </div>
                          </div>
                    
                             </form>
                          </div>
                          <ToastContainer />
                        </div>
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