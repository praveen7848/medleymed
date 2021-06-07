import React, {Component} from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

import $ from "jquery";
import { ToastContainer } from 'react-toastify';
import toast from '../toast';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom';
import  Httpconfig  from '../helpers/HttpconfigAdmin';
import { MDBDataTable } from 'mdbreact';

var Constant = require('../../constants');

export default class PatientRegistration extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datatable : {
				columns: [
				  {
					label: 'Name',
					field: 'name',
					sort: 'asc',
					width: 150
				  },
				  {
					label: 'Email',
					field: 'email',
					sort: 'asc',
					width: 150
				  }, 
				  {
					label: 'Gender',
					field: 'gender',
					sort: 'asc',
					width: 150 
				  },
				  {
					label: 'Action',
					field: 'actions',
					sort: 'asc',
					width: 150   
				  }
				],rows : []
			}	 
		}
		this.deleteUser = this.deleteUser.bind(this);
	}

	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	// To get detais after first render
	componentDidMount = () => {
		this.getUserList();
	}

	// To get all the categories
	getUserList() {
	  Httpconfig.httptokenget(Constant.siteurl+'api/Users/?user_type=patient')
		.then((response) => {
			this.setState({
				patients: response.data
			});
			let patientArray = [];
			this.items = response.data.map((item, key) =>		
			patientArray.push({
				'name': item.patient_tbl.name+" "+item.patient_tbl.last_name, //item.patient_id,
				'email': item.email,
				'gender':item.patient_tbl.gender, 
				'actions': <div>
				 <span><Link  to = {'/admin/CreatePatient/'+item.id}  className="fa fa-edit point-cursor cBlack" title={"Update " + item.patient_tbl.first_name}></Link></span> &nbsp; 
					<span><i onClick={() => this.deleteUser(item.id, item.patient_tbl.name+' '+item.patient_tbl.last_name)} className="fa fa-trash point-cursor" title={"Delete " + item.patient_tbl.first_name+' '+item.patient_tbl.last_name}></i></span> &nbsp; 
		  </div>
			
				})
		);
			let newState = Object.assign({}, this.state);
			newState.datatable.rows = patientArray;
			this.setState(newState);
		})
		.catch((error) => {
			console.log(error);
		})
	}

	// To delete any category
	deleteUser(userId, userName) {
		var isConfirm = window.confirm("Are you sure to delete "+userName+"?");
		if(isConfirm) {
			Httpconfig.httptokendelete(Constant.siteurl+'api/Users/'+userId)
			//	axios.delete(Constant.siteurl+'api/Users/'+userId)
			.then((response) => {
				toast.success("Successfully Deleted Patient");
				setTimeout(
                    () => window.location.reload(),
					2000
				)
				//this.props.history.push('/PatientRegistration');
			})
			.catch((error) => {
				console.log(error);
			});
			
		}
	}

	// To Edit any Patient
	updatePatient(patientId) {
		window.location.href = '/admin/CreatePatient/'+patientId;
	}
    render(){
	
		const { patients, datatable } = this.state;
        return (
            <section id="main_dashboard">
				<div className="container" id="main_front">
					<div className="row">
						<div className="col-md-12">
							<div className="dash-section">
								<div className="section-header">
									<ol className="breadcrumb">
										<li className="active">
											<Link to="/admin"> Dashboard</Link> &gt; 
											Patients
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Patients</h3>
											</div>
											<div id="reg_form">
												<div className="row">
													<div className="form-group col-md-12">
														<Link  to='/admin/CreatePatient'  className="btn  btn-primary fright" >Create Patient</Link>
													</div>
												</div>
												{
													datatable.rows.length === 0 ?   <p>Loading...........</p> : 	
													<MDBDataTable striped bordered small data={datatable} />
												}
												<div className="row">
													<div className="col-md-12">
														<div className="update_btn" style={{'textAlign' : 'right'}}></div>
													</div>
												</div>
												<ToastContainer />
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