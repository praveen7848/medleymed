import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewupdatevitals extends Component {
    constructor(props) {
        super(props);
        this.state = {
          fields: {},
          errors: {},
          vitalsarray:''
        };
      }

   //default component
   componentWillMount() {
    this.getVitalInfo();

  }     
   
  getVitalInfo(){
    Httpconfig.httptokenget(Constant.siteurl + "api/Vitals/").then((response) => {
      console.log(response)
      this.setState({
        vitalsarray:response.data.data
      })
    })
  }
  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  }; 

   //on change
  fetchdefaultvalues = (event) => {
       var id = event.target.value;
       if(id!=''){
        Httpconfig.httptokenget(Constant.siteurl + "api/Vitals/"+id).then((response) => {
            console.log(response)
            this.setState({
                fields: {
                    vital_name: response.data[0].id,
                    default: response.data[0].default,
                    min: response.data[0].min,
                    mid: response.data[0].mid,
                    max: response.data[0].max,
                    dangerous_up:response.data[0].dangerous_up,
                    dangerous_down:response.data[0].dangerous_down,
                    status:response.data[0].status
                },
              });
              console.log(this.state.fields)
               }).catch((error) => {
            console.log(error);
        });
     } else {
        this.setState({
            fields: {
                vital_name: "",
                default: "",
                min: "",
                mid:"",
                max: "",
                dangerous_up:"",
                dangerous_down:"",
                status:""
            },
          });
     } 
   }
  
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    var pattern = /^[a-zA-Z0-9]{3,20}$/g;
   
  
    if (!fields["vital_name"]) {
      formIsValid = false;
      errors["vital_name"] = "Select vital";
    }
    if (!fields["default"]) {
      formIsValid = false;
      errors["default"] = "Default value cannot be empty";
    }
    if (!fields["min"]) {
      formIsValid = false;
      errors["min"] = "Min value cannot be empty";
    }
    if (!fields["mid"]) {
      formIsValid = false;
      errors["mid"] = "Mid value cannot be empty";
    }
    if (!fields["max"]) {
      formIsValid = false;
      errors["max"] = "Max value cannot be empty";
    }
    if (!fields["dangerous_up"]) {
      formIsValid = false;
      errors["dangerous_up"] = "Dangerous Up value cannot be empty";
    }
    if (!fields["dangerous_down"]) {
      formIsValid = false;
      errors["dangerous_down"] = "Dangerous Down value cannot be empty";
    }
    if (!fields["status"]) {
      formIsValid = false;
      errors["status"] = "Status cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  checkSubmit(event){
    event.preventDefault();
    if (this.handleValidation()) {
        this.updateVitals(event);
        }  else {
        toast.warn("Form has errors.");
        }
  }

  onKeyPress(event) {
      //  alert()
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!(/^[0-9\b]+$/.test(keyValue))){
        event.preventDefault();
    } else {
        return true
    }
  }

  updateVitals(event) {
    const { fields, errors } = this.state;
    Httpconfig.httptokenput(
        Constant.siteurl + "api/Vitals/"+this.state.fields['vital_name'],
        {
          default: fields["default"],
          min: fields['min'],
          max: fields['max'],
          mid: fields['mid'],
          dangerous_up:fields['dangerous_up'],
          dangerous_down:fields['dangerous_down'],
          status:fields['status'],
        }
      )
        .then((response) => {
          toast.success("Successfully Updated Vital");
          setTimeout(
            () => this.props.history.push("/admin/Viewupdatevitals"),
            2000
          );
      })
        .catch((error) => {
          console.log(error);
          toast.error(error);
        });
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
										                	Vitals
										            </li>
                           </ol>
                        </div>
                     </div>

                     <section id="CMS_tab">
                        <div className="CMS_content">
                           <div className="container">
                              <div className="row">
                                 <div className="tab-header">
                                    <h3>Vitals</h3>
                                 </div>
                                 <div id="reg_form">
                                    <form onSubmit={this.checkSubmit.bind(this)}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group col-md-12">
                                                    <select name="vital_name"  value={this.state.fields["vital_name"] || ""}  onChange={this.handleChange.bind(this, "vital_name")} onChange={this.fetchdefaultvalues.bind(this)}  className="form-control" >
                                                    <option value="">Select Vital Type</option>
                                                    {
                                                      this.state.vitalsarray && this.state.vitalsarray.map((vitals, i) => {
                                                        return (
                                                          <option value={vitals.id}>{vitals.vital_name}</option>
                                                        )
                                                      })
                                                    }
                                                    </select>
                                                    <span className="cRed">
                                                    {this.state.errors["vital_name"]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group col-md-12">
                                                <label>Default Value</label>
                                                    <input type="text"    value={this.state.fields["default"]  || ""} 
                                                    onChange={this.handleChange.bind(this, "default")} onKeyPress={this.onKeyPress.bind(this)} className="form-control" placeholder="Default" />
                                                    <span className="cRed">
                                                    {this.state.errors["default"]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                            <label>Min</label>
                                                <div className="form-group col-md-12">
                                                    <input type="text" onKeyPress={this.onKeyPress.bind(this)} name="min" value={this.state.fields["min"] || ""} 
                                                    onChange={this.handleChange.bind(this, "min")} className="form-control" placeholder="Min" />
                                                    <span className="cRed">
                                                    {this.state.errors["min"]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <label>Mid</label>
                                                <div className="form-group col-md-12">
                                                    <input type="text" name="mid" onKeyPress={this.onKeyPress.bind(this)} value={this.state.fields["mid"] || ""} 
                                                    onChange={this.handleChange.bind(this, "mid")} className="form-control" placeholder="Mid" />
                                                    <span className="cRed">
                                                    {this.state.errors["mid"]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <label>Max</label>
                                                <div className="form-group col-md-12">
                                                    <input type="text" name="max" onKeyPress={this.onKeyPress.bind(this)} value={this.state.fields["max"] || ""} 
                                                    onChange={this.handleChange.bind(this, "max")} className="form-control" placeholder="Max" />
                                                    <span className="cRed">
                                                    {this.state.errors["max"]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                            <label>Dangerous Up</label>
                                                <div className="form-group col-md-12">
                                                    <input type="text" name="dangerous_up" onKeyPress={this.onKeyPress.bind(this)} value={this.state.fields["dangerous_up"] || ""}
                                                     onChange={this.handleChange.bind(this, "dangerous_up")} className="form-control" placeholder="Dangerous Up" />
                                                    <span className="cRed">
                                                    {this.state.errors["dangerous_up"]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                            <label>Dangerous Down</label>
                                                <div className="form-group col-md-12">
                                                    <input type="text" name="dangerous_down" onKeyPress={this.onKeyPress.bind(this)}  value={this.state.fields["dangerous_down"] || ""} onChange={this.handleChange.bind(this, "dangerous_down")} className="form-control" placeholder="Dangerous Down" />
                                                    <span className="cRed">
                                                    {this.state.errors["dangerous_down"]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group col-md-12">
                                                    <label  class="">Status</label>
                                                <div class="custom-control custom-radio" onChange={this.handleChange.bind(
                                                    this,"status")}>
                                                    <input type="radio" value="1" checked={this.state.fields["status"] == "1"}  name = "required" /> Yes
                                                    &nbsp;&nbsp;&nbsp;
                                                    <input type="radio" value="0" checked={this.state.fields["status"] == "0"} name = "required" /> No
                                                </div>
                                                </div>
                                                <span className="cRed">
                                  {this.state.errors["status"]}
                                </span>
                                </div>
                                        </div>

                                        <div className="row">
                                                <div className="form-group col-md-8">
                                                <button
                                                    type="submit" className="btn  btn-primary padTopCategorySave fright">
                                                    Update Vitals
                                                </button>{" "}
                                                &nbsp;
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

