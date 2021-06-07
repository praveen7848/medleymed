import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";
import Header from './Header'; 
import Sidebar from './sidebar';
import PatientFooter from '../patient/Patientfooter';


export default class Createlanguages extends Component {

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
        this.getLanguageInfo(handle);
      };
    
      // When value changes of the fields
      handleChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
      };
      
        // To get all the ResponderInfo
        getLanguageInfo(handle) {
          Httpconfig.httptokenget(Constant.siteurl + "api/Languages/" + handle)
            .then((response) => {
              console.log("-- response---", response);
            this.setState({
                fields: {
                  name: response.data[0].name,
                  iso_name: response.data[0].iso_name,
                  iso_val: response.data[0].iso_val,
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
          this.updateLanguages(event);
        } else if (this.handleValidation() && handle == undefined) {
          this.createLanguages(event);
        } else {
          toast.warn("Form has errors.");
        }
      }
      // creates new controller
      createLanguages = (event) =>{
        event.preventDefault();
        const { fields, errors } = this.state;
        Httpconfig.httptokenpost(Constant.siteurl + "api/Languages", {
          name: fields["name"],
          iso_name: fields["iso_name"],
          iso_val: fields["iso_val"],
        })
          .then((response) => {
            toast.success("Successfully Created Language");
            setTimeout(
              () => this.props.history.push("/admin/Viewlanguages"),
              2000
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    
      // updates controller
      updateLanguages = (event) => {
        event.preventDefault();
        const { handle } = this.props.match.params;
        const { fields, errors } = this.state;
        Httpconfig.httptokenput(
          Constant.siteurl + "api/Languages/" + handle,
          {
            name: fields["name"],
            iso_name: fields["iso_name"],
            iso_val: fields["iso_val"],
          }
        )
          .then((response) => {
            toast.success("Successfully Updated Language");
            setTimeout(
              () => this.props.history.push("/admin/Viewlanguages"),
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
        
        if (!fields["name"]) {
          formIsValid = false;
          errors["name"] = "Language name cannot be empty";
        } 
       
        if (!fields["iso_name"]) {
            formIsValid = false;
            errors["iso_name"] = "Language iso name  cannot be empty";
        }
        if (!fields["iso_val"]) {
          formIsValid = false;
          errors["iso_val"] = "Language iso Value  cannot be empty";
      }
 
        this.setState({ errors: errors });
        return formIsValid;
      }
    
      render(){
            return(
              <React.Fragment>
              <Header/>
              <Sidebar/>
                <section id="main_dashboard">
                <div className="container" id="main_front">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="dash-section">
                        <div className="section-header">
                          <ol className="breadcrumb">
                            <li className="active">
                              <Link to="/admin"> Dashboard</Link> &gt;
                              <a> Languages </a>
                            </li>
                          </ol>
                        </div>
                      </div>
        
                      <section id="CMS_tab">
                        <div className="CMS_content">
                          <div className="container">
                            <div className="row">
                              <div className="tab-header">
                                <h3>Create Languages</h3>
                              </div>
                              <div id="reg_form">
                                <form  onSubmit={this.checkSubmit.bind(this)}> 
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className="form-group ">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["name"] || ""}
                                          onChange={this.handleChange.bind(
                                            this,
                                            "name"
                                          )}
                                          placeholder="Name"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["name"]}
                                        </span>
                                      </div>
                                    </div>
                                              
                                <div className="col-md-4">
                                <div className="form-group ">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["iso_name"] || ""}
                                          onChange={this.handleChange.bind(
                                            this,
                                            "iso_name"
                                          )}
                                          placeholder="Iso Name"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["iso_name"]}
                                        </span>
                                      </div>
                               </div>
                                        
                                <div className="col-md-4">
                                <div className="form-group ">
                                        <input
                                          type="ftext"
                                          name="iso_val"
                                          className="form-control"
                                          value={this.state.fields["iso_val"] || ""}
                                          onChange={this.handleChange.bind(
                                            this,
                                            "iso_val"
                                          )}
                                          placeholder="Iso Value"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["iso_val"]}
                                        </span>
                                      </div>
                               </div>
                               </div>
                             
                               
                               
                               <div className="row">
                                <div className="form-group col-md-12">
                                  <button
                                    type="submit" className="btn  btn-primary save_btn">
                                    Save Languages
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewlanguages" className="cancel_btn">
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
               <PatientFooter/>
               </React.Fragment>
            )
      }
}

