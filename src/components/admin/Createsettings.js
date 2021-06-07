import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class Createsettings extends Component {

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
        this.getsettingInfo(handle);
      };
    
      // When value changes of the fields
      handleChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
      };
      
        // To get all the ResponderInfo
        getsettingInfo(handle) {
          Httpconfig.httptokenget(Constant.siteurl + "api/Mastersettings/" + handle)
            .then((response) => {
            this.setState({
                fields: {
                  type: response.data[0].type,
                  type_value: response.data[0].type_value,
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
          this.updateSettings(event);
        } else if (this.handleValidation() && handle == undefined) {
          this.createSettings(event);
        } else {
          toast.warn("Form has errors.");
        }
      }
      // creates new controller
      createSettings = (event) =>{
        event.preventDefault();
        const { fields, errors } = this.state;
        Httpconfig.httptokenpost(Constant.siteurl + "api/Mastersettings", {
          type: fields["type"],
          type_value: fields["type_value"],
        })
          .then((response) => {
            toast.success("Successfully Created Settings");
            setTimeout(
              () => this.props.history.push("/Viewsettings"),
              2000
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    
      // updates controller
      updateSettings = (event) => {
        event.preventDefault();
        const { handle } = this.props.match.params;
        const { fields, errors } = this.state;
        Httpconfig.httptokenput(
          Constant.siteurl + "api/Mastersettings/" + handle,
          {
            type: fields["type"],
            type_value: fields["type_value"],
          }
        )
          .then((response) => {
            toast.success("Successfully Updated Settings");
            setTimeout(
              () => this.props.history.push("/admin/Viewsettings"),
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
        
        if (!fields["type"]) {
          formIsValid = false;
          errors["type"] = "Type  cannot be empty";
        } 
       
        if (!fields["type_value"]) {
            formIsValid = false;
            errors["type_value"] = "Type value cannot be empty";
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
                              <a> Settings </a>
                            </li>
                          </ol>
                        </div>
                      </div>
        
                      <section id="CMS_tab">
                        <div className="CMS_content">
                          <div className="container">
                            <div className="row">
                              <div className="tab-header">
                                <h3>Create Settings</h3>
                              </div>
                              <div id="reg_form">
                                <form  onSubmit={this.checkSubmit.bind(this)}> 
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className="form-group col-md-12">
                                        <input
                                          type="ftext"
                                          name="type"
                                          className="form-control"
                                          value={this.state.fields["type"] || ""}
                                          onChange={this.handleChange.bind(
                                            this,
                                            "type"
                                          )}
                                          placeholder="Type"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["type"]}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">             
                                <div className="col-md-4">
                                <div className="form-group col-md-12">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["type_value"] || ""}
                                          onChange={this.handleChange.bind(
                                            this,
                                            "type_value"
                                          )}
                                          placeholder="Type Value"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["type_value"]}
                                        </span>
                                      </div>
                               </div>
                               </div>
                               <div className="row">
                                <div className="form-group col-md-8">
                                  <button
                                    type="submit" className="btn  btn-primary padTopCategorySave fright">
                                    Save Settings
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewsettings" className="padTopCategorySave hrefCategory fright">
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