import React, {Component} from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import Login from './login';
import axios from 'axios';
import $ from "jquery";
import {Link} from 'react-router-dom';
import  Httpconfig  from './helpers/Httpconfig';

var Constant = require('../constants');

export default class SetAppointment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			patient: '',
			startDate: new Date(),
			endDate: new Date(),
			chat: '',
			audio: '',
			video: ''
		}
	}

	// When value changes of the fields
	handleChange = (event) => {
		if(event.target.name == 'chat' || event.target.name == 'audio' || event.target.name == 'video') {
			this.setState({ [event.target.name]: event.target.checked });
		} else {
			this.setState({ [event.target.name]: event.target.value });
		}
	}

	// When value changes of the fields
	setStartTimeOnChange = value => {
		this.setState({ startDate: value });
	}

	// When value changes of the fields
	setEndTimeOnChange = value => {
		this.setState({ endDate: value });
	}

	// To get detais after first render
	componentDidMount = () => {
		const { handle } = this.props.match.params
		this.getDoctorInfo(handle);
		this.getAppointment(handle);
		this.getPatientList();
	}

	// To get all doctor
	getDoctorInfo(handle) {
		Httpconfig.httptokenget(Constant.siteurl+'api/Doctors/'+handle)
		//axios.get(Constant.siteurl+'api/Doctors/'+handle)
		.then((response) => {
			var name = response.data.first_name+' '+response.data.last_name;
			this.setState({
				name: name,
			});
		})
		.catch((error) => {
			console.log(error);
		})
	}

	// To get all the patients
	getPatientList() {
		Httpconfig.httptokenget(Constant.siteurl+'api/Users/?user_type=patient')
		//axios.get(Constant.siteurl+'api/Users/?user_type=patient')
		.then((response) => {
			this.setState({
				patients: response.data
			});
		})
		.catch((error) => {
			console.log(error);
		})
	}

	// To get all doctor
	getAppointment(handle) {
		Httpconfig.httptokenget(Constant.siteurl+'api/Appointments/?doctor='+handle)
		//axios.get(Constant.siteurl+'api/Appointments/?doctor='+handle)
		.then((response) => {
			this.setState({
				appointmentdetails: response.data,
			});
		})
		.catch((error) => {
			console.log(error);
		})
	}

	// To add new category when user submits the form
	setAppointment = (event) => {
		event.preventDefault();
		var handle = this.props.match.params.handle;
		const { patient, name } = this.state;
		var patientVal = patient.split('@');
		var patientId = patientVal[0];
		var patientName = patientVal[1];
		Httpconfig.httptokenpost(Constant.siteurl+'api/Appointments/', {
		//axios.post(Constant.siteurl+'api/Appointments/', {
			doctor_id: handle,
			doctor_name: name,
			patient_id: patientId,
			patient_name: patientName
		})
		.then((response) => {
			window.location.reload();
			//this.props.history.push('/SetDoNotDisturb/'+handle);
		})
		.catch((error) => {
			console.log(error);
		});
		this.getDoctorInfo(handle);
	}

	// To delete any category
	deleteAppointment(appointmentId) {
		var isConfirm = window.confirm("Are you sure to delete this appointment?");
		if(isConfirm) {
			Httpconfig.httptokendelete(Constant.siteurl+'api/Appointments/'+appointmentId)
		//	axios.delete(Constant.siteurl+'api/Appointments/'+appointmentId)
			.then((response) => {
				window.location.reload();
				//this.props.history.push('/PatientRegistration');
			})
			.catch((error) => {
				console.log(error);
			});
			this.getUserList();
		}
	}

    render(){
		const { name, patients, appointmentdetails, startDate, endDate, chat, audio, video } = this.state;
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
											<Link to="/DoctorRegistration"> Practitioners</Link>
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Send Assessment for {name}</h3>
											</div>
											<div id="reg_form">
												<form onSubmit={this.setAppointment}>
													<div className="row">
														<div className="col-md-3">
															<div className="form-group col-md-12">
																<label>Select Patient <span className="mandatory_id">*</span></label>
																<select name="patient" className="form-control" value={this.state.patient} onChange={this.handleChange}>
																	{
																		patients && patients.map((patient, i) => {
																			return (
																				<option value={patient.patient_tbl.id+'@'+patient.patient_tbl.first_name+' '+patient.patient_tbl.last_name}>{patient.patient_tbl.first_name+' '+patient.patient_tbl.last_name}</option>
																			)
																		})
																	}
																</select>
															</div>
														</div>
														<div className="form-group col-md-1">
															<button type="submit" className="btn btn-primary padTopCategoryAppSave" >Send Assessment</button>
														</div>
													</div>
												</form>
												<div id="role_table">
													<div className="table-responsive">
														<table className="table table-responsive table-list" data-currentpage="1">
															<thead>
																<th>S.No.</th>
																<th>Patient <i className="caret"></i></th>
																<th>Assessment Type <i className="caret"></i></th>
																<th>Appointment Ends at <i className="caret"></i></th>
																<th>Sent on <i className="caret"></i></th>
																<th>Action <i className="caret"></i></th>
															</thead>
															<tbody className="list">
																{
																	appointmentdetails && appointmentdetails.map((appointment, i) => {
																		return (
																			<tr key={i+1}>
																				<td className="minify sortID">{i+1}</td>
																				<td className="minify  sortID3">{appointment.patient_name}</td>
																				<td className="minify  sortID3">{appointment.appointment_start_date}</td>
																				<td className="minify  sortID3">{appointment.appointment_end_date}</td>
																				<td className="minify  sortID3">
																					{(appointment.chat == 1)? 'Chat ': ''}
																					{(appointment.audio == 1)? 'Audio ': ''}
																					{(appointment.video == 1)? 'Video ': ''}
																				</td>
																				<td className="minify sortID7">
																					<span><i onClick={() => this.deleteAppointment(appointment.id)} className="fa fa-trash point-cursor" title={"Delete Appointment"}></i></span>
																				</td>
																			</tr>
																		)
																	})
																}
															</tbody>
														</table>
													</div>
												</div>
												<div className="row">
													<div className="col-md-12">
														<div className="update_btn" style={{'textAlign' : 'right'}}></div>
													</div>
												</div>
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