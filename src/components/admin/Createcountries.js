import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class Createcountries extends Component {

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
    this.getcountryInfo(handle);
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };   
  
  checkSubmit(event){
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleValidation() && handle) {
        this.updateCountrieslist(event);
        } else if (this.handleValidation() && handle == undefined) {
        this.createCountrieslist(event);
        } else {
        toast.warn("Form has errors.");
        }
  }
  
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    
    if (!fields["shortname"]) {
      formIsValid = false;
      errors["shortname"] = "Short  name cannot be empty";
    } 
    if (!fields["name"]) {
        formIsValid = false;
        errors["name"] = "Name cannot be empty";
    }
    if (!fields["isd_code"]) {
        formIsValid = false;
        errors["isd_code"] = "ISD  code cannot be empty";
    }
  
    this.setState({ errors: errors });
    return formIsValid;
  }
  
   // To get all the ResponderInfo
   getcountryInfo(handle) {
    Httpconfig.httptokenget(Constant.siteurl + "api/Country/" + handle)
      .then((response) => {
      this.setState({
          fields: {
            name: response.data[0].name,
            shortname: response.data[0].shortname,
            isd_code: response.data[0].isd_code,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  createCountrieslist(event){
    event.preventDefault();
    const { fields, errors } = this.state;
    Httpconfig.httptokenpost(Constant.siteurl + "api/Country", {
      name: fields["name"],
      shortname: fields['shortname'],
      isd_code: fields['isd_code'],
    })
      .then((response) => {
        toast.success("Successfully Created Country");
        setTimeout(
          () => this.props.history.push("/admin/Viewcountries"),
          2000
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateCountrieslist(event){
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/Country/" + handle,
      {
        name: fields["name"],
        shortname: fields['shortname'],
        isd_code: fields['isd_code'],
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Country");
        setTimeout(
          () => this.props.history.push("/admin/Viewcountries"),
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
                      <a> Countries </a>
                    </li>
                  </ol>
                </div>
              </div>

              <section id="CMS_tab">
                <div className="CMS_content">
                  <div className="container">
                    <div className="row">
                      <div className="tab-header">
                        <h3>Create Country</h3>
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
                                  value={this.state.fields["shortname"] || ""}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "shortname"
                                  )}
                                  placeholder="Short Name"
                                />
                                 <span className="cRed">
                                     {this.state.errors["shortname"]}
                                 </span>
                              </div>
                            </div>
                         
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
                                        value={this.state.fields["isd_code"] || ""}
                                        onChange={this.handleChange.bind(
                                            this,
                                            "isd_code"
                                        )}
                                        placeholder="ISD Code"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["isd_code"]}
                                        </span>
                                    </div>
                              </div>
                          </div>
                         <div className="row">
                                <div className="form-group col-md-8">
                                <button
                                    type="submit" className="btn  btn-primary save_btn">
                                    Save Country
                                </button>{" "}
                                &nbsp;
                                <Link to="/admin/Viewcountries" className="cancel_btn">
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