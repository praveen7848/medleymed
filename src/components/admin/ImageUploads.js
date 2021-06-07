import React ,{ Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";
import Header from './Header'; 
import Sidebar from './sidebar';
import PatientFooter from '../patient/Patientfooter';

export default class UploadImages extends Component {

    constructor(props) {
        super(props);
        this.state = {
          fields: {},
          errors: {},
          controller_data: '',
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
      }

      onChange(e) {
        
        //this.setState({file: e.target.files[0]});
        this.setState({
          fields: { file: e.target.files[0], category_type: this.state.fields["category_type"],
            category: this.state.fields["category"]  }  });
    
    }
    
      // To get detais after first render
      componentDidMount = () => {
        const { handle } = this.props.match.params;
        const { type } = this.props.match.params;
        if(handle != undefined)
        {
        this.getCategorytypedata();
        this.getControllerInfo();
        
        }
        else
        {
         this.getCategorytypedata();
        }
        
      };
      // fetches all controllers
      getCategorytypedata() {
        const { handle } = this.props.match.params;
        //Httpconfig.httptokenget(Constant.siteurl + "api/CategoryType")
        Httpconfig.httptokenget(Constant.siteurl + "api/Specilization")
           //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
           .then((response) => {
            //console.log(response.data)         
              this.setState({
                controller_data: response.data,
                fields: {
                  categorytype: response.data,
                  // status: response.data[0].status,
                },
              })
           })
     }     
   getControllerInfo() {
    const { handle } = this.props.match.params;
    Httpconfig.httptokenget(Constant.siteurl + "api/Category/Findone/"+handle)
       //axios.get(Constant.siteurl+'api/Users/Responder/'+handle)
       .then((response) => {
       // console.log([response.data.data])         
          this.setState({
            // controller_data: [response.data.data],
            fields: {
               name: response.data.data.category_type,
               category: response.data.data.category,
               category_image:response.data.data.category_image,
              // status: response.data[0].status,
               name:response.data.data.category_type,
            },
          })
       })
 }      
 // When value changes of the fields
  handleChange = (field, event) => {
  let fields = this.state.fields;
  fields[field] = event.target.value;
  this.setState({ fields });
  };
  onFormSubmit(e){
        e.preventDefault();
        // console.log("-----------", this.state.fields.file)
        const { handle } = this.props.match.params;
        if (handle) {
          this.updateCategory(handle);
        } else if (handle == undefined) {
          this.createCategory();
        } else {
          toast.warn("Form has errors.");
        }
    }
    updateCategory =(event)=>{
      const formData = new FormData();
        formData.append('myImage', this.state.fields.file);
        formData.append('category', this.state.fields.category);
       
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        const { handle } = this.props.match.params;
        const { type } = this.props.match.params;
        
        //Httpconfig.httptokenpost(Constant.siteurl + "api/"+type+"/myImage/"+  handle, formData,config)
        Httpconfig.httptokenpost(Constant.siteurl + "api/Category/myImage/"+handle, formData, config)
            
        .then((response) => {
                //alert("The file is successfully uploaded");
                toast.success("Successfully "+type+" Image Uploaded.");
            setTimeout(
              () => this.props.history.push("/admin/ViewCategory"),
              2000
            );
            }).catch((error) => {
        });
    }
createCategory =(event)=>{
  const formData = new FormData();
  formData.append('myImage', this.state.fields.file);
  formData.append('category_type', this.state.fields.category_type);
  formData.append('category', this.state.fields.category);
 
  const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
  };
  const { handle } = this.props.match.params;
  const { type } = this.props.match.params;
  
  //Httpconfig.httptokenpost(Constant.siteurl + "api/"+type+"/myImage/"+  handle, formData,config)
  Httpconfig.httptokenpost(Constant.siteurl + "api/Category/myImage", formData, config)
      
  .then((response) => {
          //alert("The file is successfully uploaded");
          toast.success("Successfully "+type+" Image Uploaded.");
      setTimeout(
        () => this.props.history.push("/admin/ViewCategory"),
        2000
      );
      }).catch((error) => {
  });
}    
      render(){
        const { fields, errors, controller_data } = this.state;
        //console.log("----  controller_data  ----", controller_data);
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
                              <a> UploadImages </a>
                            </li>
                          </ol>
                        </div>
                      </div>
        
                      <section id="CMS_tab">
                        <div className="CMS_content">
                          <div className="container">
                            <div className="row">
                              <div className="tab-header">
                                <h3>Upload Image</h3>
                              </div>
                              <div id="reg_form">
                                <form  onSubmit={this.onFormSubmit}> 
                                <div className="row">
                               

                                {/* <div className="form-group col-md-12">
                                <input
                                  type="ftext"
                                  name="category_type"  
                                  className="form-control"
                                  value={this.state.fields["category_type"] || ""}
                                  
                                  placeholder="Category Type" readonly
                                />
                                <span className="cRed">
                                  {this.state.errors["category_type"]}
                                </span>
                              </div> */}

                                             <div className="form-group col-md-4">
                                             
                                                <select
                                                   name="category_type"
                                                   className="form-control" value={this.state.fields["name"] || ""}
                                                   onChange={this.handleChange.bind(this, "category_type")}                                                >
                                                   <option value="">Select Category Type</option>
                                                   {controller_data &&
                                                      controller_data.map((controller_data, i) => {
                                                         return (
                                                            <option value={controller_data.name}>
                                                               {controller_data.name}
                                                            </option>
                                                         );
                                                      })}
                                                </select>
                                                <span className="cRed">
                                                   {this.state.errors["id"]}
                                                </span>
                                             </div>

                                          </div>
                              <div className="row">
                                        
                              <div className="form-group col-md-4">
                                <input
                                  type="ftext"
                                  name="category"  onChange={this.handleChange.bind(
                                    this,
                                    "category"
                                  )}
                                  className="form-control"
                                  value={this.state.fields["category"] || ""}
                                  
                                  placeholder="Category Name"
                                />
                                <span className="cRed">
                                  {this.state.errors["category"]}
                                </span>
                              </div>
                             
                            </div>
                               <div className="row">
                               
                                  <div className="form-group col-md-4">
                                  <input type="file" name="myImage" accept="image/*" onChange= {this.onChange} />
                                  </div>
                                  <div>
                                    {this.state.fields.category_image ?
                                    <img src={Constant.imgurl+this.state.fields.category_image}/>
                                    :""}
                                  </div>
                              
											      	</div>
                               
                               
                               <div className="row">
                                <div className="form-group col-md-8">
                                  <button
                                    type="submit" className="btn  btn-primary save_btn">
                                    Save
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/ViewCategory" className="cancel_btn">
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

