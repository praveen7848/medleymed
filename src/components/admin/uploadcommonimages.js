import React, {Component} from 'react';
import { ToastContainer } from 'react-toastify';
import toast from '../toast';
import {Link} from 'react-router-dom';
import  Httpconfig  from '../helpers/HttpconfigAdmin';
var Constant = require('../../constants');

export default class Uploadcommonimages extends Component {
	constructor(props) {
		super(props);
		this.state = {
            file: null,
            fields: {},	
            image:null		
        }
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        
	}

	// When value changes of the fields
    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        const { handle } = this.props.match.params;
        let redirectpage='';
        formData.append('myImage',this.state.file);
        formData.append('type', this.props.match.params.type);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        if (this.props.match.params.type == "problemimages"){
            redirectpage = "CategoryType";
        }  
      //   redirectpage = "PatientRegistration,DoctorRegistration,ResponderRegistration,Facilities";
        // }else if(this.props.match.params.type == "patient"){
        //     redirectpage = "PatientRegistration";
        // }else if(this.props.match.params.type == "doctor"){
        //     redirectpage = "DoctorRegistration";
        // } else if(this.props.match.params.type == "pharmacy"){
        //     redirectpage = "Pharmacy";
        // } else if(this.props.match.params.type == "Signatures") {
        //     redirectpage = "DoctorRegistration";
        // }
        // else if(this.props.match.params.type == "Genderimages") {
        //     redirectpage = "CategoryType";
        // }
        // else {
        //     redirectpage = "Facilities";
        //  }
       
       
        Httpconfig.httptokenput(Constant.siteurl+"api/Users/uploadAdminImages/"+this.props.match.params.type+'/'+handle, formData,config)
        .then((response) => {
            console.log(response);
			alert("The file is successfully uploaded");
             this.props.history.push('/admin/'+redirectpage);
            toast.success("successfully uploaded content");
        
        }).catch((error) => { });
    
    }

    onChange(e) {
        this.setState({file:e.target.files[0]});
    }

    handleChange = (field, event) => {
		let fields = this.state.fields;
        fields[field] = event.target.value;
       
		this.setState({fields});
    }

    componentDidMount = () => {
        const { handle } = this.props.match.params;
        const { type } = this.props.match.params;
    }

    render(){
        

        const { type } = this.props.match.params;
        return (
            <section id="main_dashboard">
				<div className="container" id="main_front">
					<div className="row">
						<div className="col-md-12">
							<div className="dash-section">
								<div className="section-header">
									<ol className="breadcrumb">
										<li className="active">
											<Link to="/Dashboard"> Dashboard</Link> &gt; 
											{type}
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
                                            <form onSubmit={this.onFormSubmit}>
													<div className="row">
														<div className="col-md-4">
															<div className="form-group col-md-12">
																<h4>Upload {this.props.match.params.type == "Signatures" ? "Doctor Singature": "Image" }</h4><br />
                                                                <input type="file" name="myImage" accept="image/*" onChange= {this.onChange}  className="form-control"/>
                                                                <button type="submit" className="btn  btn-primary padTopCategorySave">Upload Image</button>
                                                            </div>
														</div>
                                                    </div>
                                            </form>
                                       </div>
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