import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/Httpconfig';
import Constant from '../constants';
import { Multiselect } from "multiselect-react-dropdown";
import { Link } from "react-router-dom";

export default class Create_view_masterconfigurations extends Component {

    constructor(props) {
        super(props);
        this.state = {
          fields: {},
          errors: {},
          options: [],
          languagearray:[],
        //  timezonedata:"",
          selectedList: {},
          selectedValue: [],
        };
      }
    
      // To get detais after first render
      componentDidMount = () => {
        const { handle } = this.props.match.params;
        this.fetchlanguagesdata();
        this.getMasterConfigurationsInfo(handle);
        this.fetchtimezones();
      };
     
      onSelect = (selectedListdata, selectedItem) => {
        this.setState({
          selectedList: selectedListdata.map((x) => x.id),
        });
    
      };
    
      onRemove = (deselectedList, removedItem) => {
        this.setState({
          selectedList: deselectedList.map((x) => x.id),
        });
        console.log(Object.assign({},this.state.selectedList))
      };

      fetchlanguagesdata() { 
		Httpconfig.httptokenget(Constant.siteurl + "api/Languages/findname").then((response) => {	
               //  let languagearray = [];
                this.setState({
                    options:response.data,
                    languagearray :response.data
                })
         });
        }       
    
        fetchtimezones(){
            Httpconfig.httptokenget(Constant.siteurl + "api/Timezones").then((response) => {
                console.log(response.data)
                this.setState({
                    timezonedata:response.data
                })
             });
        }
      // When value changes of the fields
      handleChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
       
      };
      
        // To get all the ResponderInfo
        getMasterConfigurationsInfo(handle) {
          Httpconfig.httptokenget(Constant.siteurl + "api/MasterConfigurations/1")
            .then((response) => {
                console.log(response)
                var languagesdata = this.state.languagearray;
                let editLanguagesData = [];
                let editlangugaeslist = response.data[0].language.split(",");
                editlangugaeslist.forEach(function (item, index) {
                    languagesdata.forEach(function (obj, i) {
                      if (obj.id == item) {
                        return editLanguagesData.push(obj);
                      }
                    });
                  });
             
            this.setState({
               selectedValue: editLanguagesData,
                selectedList: editlangugaeslist,
                fields: {
                    country: response.data[0].country,
                    currency: response.data[0].currency,
                    timezone: response.data[0].timezone
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
       if (this.handleValidation()) {
          this.updateMasterConfigurations(event);
       }else {
           console.log(this.state.fields);
          toast.warn("Form has errors.");
        }
      }

    
      // updates controller
      updateMasterConfigurations = (event) => {
        event.preventDefault();
        const { handle } = this.props.match.params;
        const { fields, errors } = this.state;
      //  console.log(this.state.selectedList)
    
        Httpconfig.httptokenput(
          Constant.siteurl + "api/MasterConfigurations/1",
          {
            country: fields["country"],
            language: this.state.selectedList.toString(),
            currency: fields["currency"],
            timezone: fields["timezone"]
          }
        )
          .then((response) => {
            toast.success("Successfully Updated MasterConfigurations");
            setTimeout(
              () => this.props.history.push("/admin/Updateviewmasterconfigurations"),
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
        
        if (!fields["country"]) {
          formIsValid = false;
          errors["country"] = "Country name cannot be empty";
        } 
       
        if (!fields["currency"]) {
        formIsValid = false;
        errors["currency"] = "Currency  cannot be empty";
        } 
        if (!fields["timezone"]) {
        formIsValid = false;
        errors["timezone"] = "Timezone  cannot be empty";
        } 
        this.setState({ errors: errors });
        return formIsValid;
      }
    
      render(){
        const {  timezonedata, errors } = this.state;
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
                              <a> Master Configurations </a>
                            </li>
                          </ol>
                        </div>
                      </div>
                    
                      <section id="CMS_tab">
                        <div className="CMS_content">
                          <div className="container">
                            <div className="row">
                              <div className="tab-header">
                                <h3>Update  Master Configurations</h3>
                              </div>
                              <div id="reg_form">
                                <form  onSubmit={this.checkSubmit.bind(this)}> 
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className="form-group col-md-12">
                                        <input
                                          type="ftext"
                                          name="country"
                                          className="form-control"
                                          value={this.state.fields["country"] || ""}
                                          onChange={this.handleChange.bind(
                                            this,
                                            "country"
                                          )}
                                          placeholder="country"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["country"]}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">             
                                  <div className="col-md-4">
                              <div className="form-group col-md-12">
                              <Multiselect
                               onChange={this.handleChange.bind(
                                this,
                                "languages"
                              )}
                              name="languages"
                                    options={this.state.options} // Options to display in the dropdown
                                    value={this.state.selectedList || ""}
                                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                                    onSelect={this.onSelect} // Function will trigger on select event
                                    placeholder="Select Languages"
                                    onRemove={this.onRemove} // Function will trigger on remove event
                                    displayValue="name" // Property name to display in the dropdown options
                                    />
                                <span className="cRed">
                                  {this.state.errors["languages"]}
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
                                          value={this.state.fields["currency"] || ""}
                                          onChange={this.handleChange.bind(
                                            this,
                                            "currency"
                                          )}
                                          placeholder="Currency"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["currency"]}
                                        </span>
                                      </div>
                               </div>
                               </div>
                               
                               <div className="row">             
                                <div className="col-md-4">
                                <div className="form-group col-md-12">
                                <select
                                  name="timezone"
                                  onChange={this.handleChange.bind(
                                    this,
                                    "timezone"
                                  )}
                                  value={this.state.fields["timezone"] || ""}
                                  className="form-control"
                                >
									<option value="">Select Timezone</option>
                                  {timezonedata &&
                                    timezonedata.map((timezonedata, i) => {
                                      return (
                                        <option value={timezonedata.id}>
                                          {timezonedata.timezone}
                                        </option>
                                      );
                                    })}
                                </select>
                                         <span className="cRed">
                                            {this.state.errors["timezone"]}
                                        </span>
                                      </div>
                               </div>
                               </div>
                               <div className="row">
                                <div className="form-group col-md-8">
                                  <button
                                    type="submit" className="btn  btn-primary padTopCategorySave fright">
                                    Update MasterConfigurations
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin" className="padTopCategorySave hrefCategory fright">
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

