import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class Createlanguages extends Component {

    constructor(props) {
        super(props);
        this.state = {
          fields: {},
          errors: {},
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
      }

      onChange(e) {
        
        this.setState({file:e.target.files[0]});
    }
    
      // To get detais after first render
      componentDidMount = () => {
        const { handle } = this.props.match.params;
        
      };
    
      // When value changes of the fields
      handleChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
      };
      
 
 
   
    
    
      onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('myImage',this.state.file);
       
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        const { handle } = this.props.match.params;
        Httpconfig.httptokenpost(Constant.siteurl + "api/Languages/myImage/"+  handle, formData,config)
            .then((response) => {
                //alert("The file is successfully uploaded");
                toast.success("Successfully Language Image Uploaded.");
            setTimeout(
              () => this.props.history.push("/admin/Viewlanguages"),
              2000
            );
            }).catch((error) => {
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
                                <form  onSubmit={this.onFormSubmit}> 
                              
                               
                               <div className="row">
													<div className="col-md-4">
														<div className="form-group col-md-12">
                            <input type="file" name="myImage" accept="image/*" onChange= {this.onChange} />
														</div>
													</div>
												</div>
                               
                               
                               <div className="row">
                                <div className="form-group col-md-8">
                                  <button
                                    type="submit" className="btn  btn-primary padTopCategorySave fright">
                                    Save Languages
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewlanguages" className="padTopCategorySave hrefCategory fright">
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

