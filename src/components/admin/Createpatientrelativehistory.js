import React ,{Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class Createpatientrelativehistory extends Component {
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
        this.getrelativehistory(handle);
    		this.getPatientList();
     };

     	// To get all the categories
  getPatientList() {
	  Httpconfig.httptokenget(Constant.siteurl+'api/Users/?user_type=patient')
		.then((response) => {
      console.log(response)
			this.setState({
				patients: response.data
			});
			console.log(this.state.patients);
		})
		.catch((error) => {
			console.log(error);
		})
	}
    
      // When value changes of the fields
      handleChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
        console.log(this.state)
      };
      
    // To get all the ResponderInfo
    getrelativehistory(handle) {
        Httpconfig.httptokenget(Constant.siteurl + "api/Patientrelativehistory/" + handle)
        .then((response) => {
        this.setState({
            fields: {
                patient_id : response.data[0].patient_id, 
                relative_name : response.data[0].relative_name,
                relation : response.data[0].relation,
                relative_diseases : response.data[0].relative_diseases,
                relative_chronic_diseases : response.data[0].relative_chronic_diseases,
                relative_lifestyle_of_food : response.data[0].relative_lifestyle_of_food,
                hereditary_diseases : response.data[0].hereditary_diseases,
                comments: response.data[0].comments
            },
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }
      
    // create or update   
    checkSubmit(event)
   {
        event.preventDefault();
        const { handle } = this.props.match.params;
        console.log(this.handleValidation())
        if (this.handleValidation() && handle) {
            this.updaterelativehistory(event);
        } else if (this.handleValidation() && handle == undefined) {
            this.createrelativehistory(event);
        } else {
            toast.warn("Form has errors.");
        }
    }
      // creates new controller
      createrelativehistory = (event) =>{
        event.preventDefault();
        const { fields, errors } = this.state;
        Httpconfig.httptokenpost(Constant.siteurl + "api/Patientrelativehistory", {
            patient_id : fields["patient_id"], 
            relative_name : fields["relative_name"],
            relation : fields["relation"],
            relative_diseases : fields["relative_diseases"],
            relative_chronic_diseases : fields["relative_chronic_diseases"],
            relative_lifestyle_of_food : fields["relative_lifestyle_of_food"],
            hereditary_diseases : fields["hereditary_diseases"],
            comments: fields["comments"],
        })
          .then((response) => {
            toast.success("Successfully Created patient relative history");
            setTimeout(
              () => this.props.history.push("/admin/Patientrelativehistory"),
              2000
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    
      // updates controller
      updaterelativehistory = (event) => {
        event.preventDefault();
        const { handle } = this.props.match.params;
        const { fields, errors } = this.state;
        Httpconfig.httptokenput(
          Constant.siteurl + "api/Patientrelativehistory/" + handle,
          {
            patient_id : fields["patient_id"], 
            relative_name : fields["relative_name"],
            relation : fields["relation"],
            relative_diseases : fields["relative_diseases"],
            relative_chronic_diseases : fields["relative_chronic_diseases"],
            relative_lifestyle_of_food : fields["relative_lifestyle_of_food"],
            hereditary_diseases : fields["hereditary_diseases"],
            comments: fields["comments"],
          }
        )
          .then((response) => {
            toast.success("Successfully Updated patient relative history");
            setTimeout(
              () => this.props.history.push("/admin/Patientrelativehistory"),
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
        
        if (!fields["patient_id"]) {
          formIsValid = false;
          errors["patient_id"] = "Please select patient";
        } 
       
        if (!fields["relative_name"]) {
            formIsValid = false;
            errors["relative_name"] = "Relative name  cannot be empty";
        }
        
        if (!fields["relation"]) {
            formIsValid = false;
            errors["relation"] = "Relation cannot be empty";
        } 
         
        if (!fields["relative_diseases"]) {
            formIsValid = false;
            errors["relative_diseases"] = "Relative diseases  cannot be empty";
        }
        
        if (!fields["relative_chronic_diseases"]) {
            formIsValid = false;
            errors["relative_chronic_diseases"] = "Relative chronic diseases name cannot be empty";
        } 
         
        if (!fields["relative_lifestyle_of_food"]) {
            formIsValid = false;
            errors["relative_lifestyle_of_food"] = "Relative lifestyle of food  cannot be empty";
        }
        
        if (!fields["comments"]) {
            formIsValid = false;
            errors["comments"] = "Comments cannot be empty";
        }

        if (!fields["hereditary_diseases"]) {
            formIsValid = false;
            errors["hereditary_diseases"] = "Hereditary Diseases cannot be empty";
        }
        console.log(this.state.fields)
    
        this.setState({ errors: errors });
        return formIsValid;
      }
    
      render(){
        const { fields, errors, patients } = this.state;
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
                              <a> Patient Relation </a>
                            </li>
                          </ol>
                        </div>
                      </div>
        
                      <section id="CMS_tab">
                        <div className="CMS_content">
                          <div className="container">
                            <div className="row">
                              <div className="tab-header">
                                <h3>Create Patient Relation</h3>
                              </div>
                              <div id="reg_form">
                                <form  onSubmit={this.checkSubmit.bind(this)}> 
                                  <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group col-md-12">
                                        <select
                                  name="patient_id"
                                  onChange={this.handleChange.bind(
                                    this,
                                    "patient_id"
                                  )}
                                  value={this.state.fields["patient_id"] || ""}
                                  className="form-control"
                                > <option value="">Select</option>
                                  {patients &&
                                    patients.map((patients, i) => {
                                      return (
                                        <option value={patients.patient_tbl.id}>
                                          {patients.patient_tbl.name+" "+patients.patient_tbl.last_name}
                                        </option>
                                      );
                                    })}
                                </select>     
                                  <span className="cRed">
                                                {this.state.errors["patient_id"]}
                                                </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group col-md-12">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["relative_name"] || ""}
                                          onChange={this.handleChange.bind(this, "relative_name")}   placeholder="Relative Name"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["relative_name"]}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="form-group col-md-12">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["relation"] || ""}
                                          onChange={this.handleChange.bind(this, "relation")}   placeholder="Relation"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["relation"]}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">             
                                    <div className="col-md-4">
                                        <div className="form-group col-md-12">
                                            <textarea class="form-control"  value =  {this.state.fields["relative_diseases"] || ""}
                                            onChange={this.handleChange.bind(this, "relative_diseases")} id="inputExperience" placeholder="Relative Diseases">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["relative_diseases"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group col-md-12">
                                            <textarea class="form-control" value={this.state.fields["relative_lifestyle_of_food"] || ""}
                                            onChange={this.handleChange.bind(this, "relative_lifestyle_of_food")} id="inputExperience" placeholder="Relative lifestyle of food">
                                                
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["relative_lifestyle_of_food"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group col-md-12">
                                            <textarea class="form-control"  value={this.state.fields["relative_chronic_diseases"] || ""}
                                            onChange={this.handleChange.bind(this, "relative_chronic_diseases")} id="inputExperience" placeholder="Relative Chronic Diseases">
                                                 
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["relative_chronic_diseases"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group col-md-12">
                                            <textarea class="form-control"  value = {this.state.fields["hereditary_diseases"] || ""}
                                            onChange={this.handleChange.bind(this, "hereditary_diseases")} id="inputExperience" placeholder="Hereditary Diseases">
                                            
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["hereditary_diseases"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group col-md-12">
                                            <textarea class="form-control" value = {this.state.fields["comments"] || ""}
                                            onChange={this.handleChange.bind(this, "comments")} id="inputExperience" placeholder="Comments">
                                                
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["comments"]}
                                            </span>
                                        </div>
                                    </div>
                                 </div>
                               <div className="row">
                                <div className="form-group col-md-8">
                                  <button
                                    type="submit" className="btn  btn-primary padTopCategorySave fright">
                                    Save Patient Relation
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Patientrelativehistory" className="padTopCategorySave hrefCategory fright">
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