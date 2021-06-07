import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/Httpconfig';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class Createmastermodules extends Component{
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      controller_data: '',
    };
  }

  //default component
  componentWillMount() {
    const { handle } = this.props.match.params;
    this.getControllerInfo();
    this.getModuleinfo(handle);
  }

  // fetches only record of modules
  getModuleinfo(handle){
    Httpconfig.httptokenget(Constant.siteurl + "api/Mastermodule/" + handle)
    //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
    .then((response) => {
      this.setState({
        fields: {
          master_module_id : response.data[0].master_module_id,
          name: response.data[0].name,
          sequence: response.data[0].sequence,
          required: response.data[0].required,
          status: response.data[0].status,
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // fetches all controllers
  getControllerInfo(){
    Httpconfig.httptokenget(Constant.siteurl + "api/Mastercontrollers/")
    //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
    .then((response) => {
      console.log(response)
       this.setState({
        controller_data: response.data
       })
    })
  }
  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };
  // update/create module
  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;

    if (this.handleValidation() && handle) {
      this.updateModule(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createModule(event);
    } else {
      console.log(this.state.fields)
      toast.warn("Form has errors.");
    }
  }
  // creation of new module 
  createModule = (event) =>{
    event.preventDefault();
    var handle = this.props.match.params.handle;
    const { fields, errors } = this.state;
    Httpconfig.httptokenpost(Constant.siteurl + "api/Mastermodule/", {
      master_module_id: fields["master_module_id"],
      name: fields["name"],
      sequence: fields["sequence"],
      required: fields["required"],
      status: fields["status"],
    })
      .then((response) => {
        toast.success("Successfully Created Sub Module");
        setTimeout(
          () => this.props.history.push("/admin/Viewmastermodules"),
          2000
        );
 
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
   // updates controller
   updateModule = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/Mastermodule/" + handle,
      {
        master_module_id : fields["master_module_id"],
        name: fields["name"],
        sequence: fields["sequence"],
        required: fields["required"],
        status: fields["status"],
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Sub Module");
        setTimeout(
          () => this.props.history.push("/admin/Viewmastermodules"),
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
    
    if (!fields["master_module_id"]) {
      formIsValid = false;
      errors["master_module_id"] = "Please select master module";
    } 
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Sub Module name cannot be empty";
    } 
    if (!fields["sequence"]) {
      formIsValid = false;
      errors["sequence"] = "Sub Module sequence id cannot be empty";
    }
    if (!fields["sequence"]) {
      formIsValid = false;
      errors["sequence"] = "Sub Module sequence id cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

    render(){
      const { fields, errors, controller_data } = this.state;
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
                          <a> Master Sub Module</a>
                        </li>
                      </ol>
                    </div>
                  </div>
    
                  <section id="CMS_tab">
                    <div className="CMS_content">
                      <div className="container">
                        <div className="row">
                          <div className="tab-header">
                            <h3>Create Master Sub Module</h3>
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
                                  {controller_data &&
                                    controller_data.map((controller_data, i) => {
                                      return (
                                        <option value={controller_data.id}>
                                          {controller_data.module_name}
                                        </option>
                                      );
                                    })}
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
                                      placeholder="Sub Module Name"
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
                                      this,"required")}>
                                      <input type="radio" value="1" checked={this.state.fields["required"] == "1"}  name = "required" /> Yes
                                      &nbsp;&nbsp;&nbsp;
                                      <input type="radio" value="0" checked={this.state.fields["required"] == "0"} name = "required" /> No
                                  </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group col-md-12">
                              <label for="customRadio2" class="custom-control-label">Module  Status</label>
                                  <div class="custom-control custom-radio" onChange={this.handleChange.bind(
                                      this,"status")}>
                                           <input type="radio" value="1" checked={this.state.fields["status"] == "1"} name="status" /> Active
                                            &nbsp;&nbsp;&nbsp;
                                            <input type="radio" value="0" checked={this.state.fields["status"] == "0"} name="status" /> In Active     
                                   </div>
                                  </div>
                                  <div className="form-group col-md-12">
                                    <input
                                      type="text"
                                      name="sequence"
                                      value={this.state.fields["sequence"] || ""}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "sequence"
                                      )}
                                      className="form-control"
                                      placeholder="Sub Module Sequence"
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
                                Save Sub Module
                              </button>{" "}
                              &nbsp;
                              <Link to="/admin/Viewmastermodules"  className="padTopCategorySave hrefCategory fright">
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