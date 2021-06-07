import React, {Component, useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import Login from '../login';
import axios from 'axios';
import $ from "jquery";
import { ToastContainer } from 'react-toastify';
import toast from '../toast';
import {Link} from 'react-router-dom';
import  Httpconfig  from '../helpers/HttpconfigAdmin';
var Constant = require('../../constants');

export default class CreateAssessment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {},
			errors: {}
		}
	}

	// When value changes of the fields
	handleChange = (field, event) => {
		let fields = this.state.fields;
		fields[field] = event.target.value;
		this.setState({fields});
	}

	checkSubmit(event){
		event.preventDefault();
		const { handle } = this.props.match.params;
		
		if(this.handleValidation() && handle){
			this.updateAssessment(event);
		} else if(this.handleValidation() && handle == undefined) {
			this.createAssessment(event);
		} else {
			toast.warn("Form has errors.");
		}
	}

	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;
		var pattern = /^[a-zA-Z0-9]{4,10}$/g;

		if(!fields["assessment_type"]){
			formIsValid = false;
			errors["assessment_type"] = "Enter Assessment Name";
		} else if(!/^[a-zA-Z\s]+-*[a-zA-Z\s]*$/g.exec(fields["assessment_type"])) {
			errors["assessment_type"] = "Special characters not allowed";
		}
		if(!fields["assessment_category"]){
			formIsValid = false;
			errors["assessment_category"] = "Enter Assessment Note";
		} else if(!/^[a-zA-Z\s]+-*[a-zA-Z\s]*$$/g.exec(fields["assessment_category"])) {
			errors["assessment_category"] = "Special characters not allowed";
		}
		if(!fields["assessment_credits"]){
			formIsValid = false;
			errors["assessment_credits"] = "Enter Assessment Credits";
		}
		if(!fields["assessment_detail"]){
			formIsValid = false;
			errors["assessment_detail"] = "Enter Assessment Detail";
		}
		if(!fields["selection_type"]){
			formIsValid = false;
			errors["selection_type"] = "Select a Type";
		}

		this.setState({errors: errors});
		return formIsValid;
	}

	// To get detais after first render
	componentDidMount = () => {
		const { handle } = this.props.match.params;
		this.getAssessmentInfo(handle);
	}

	// To add new category when user submits the form
	createAssessment = (event) => {
		event.preventDefault();
		var handle = this.props.match.params.handle;
		const { fields, errors } = this.state;
		Httpconfig.httptokenpost(Constant.siteurl+'api/Assessments/', {
			assessment_type: fields['assessment_type'], 
			assessment_category: fields['assessment_category'],
			assessments: [],
			assessment_score_interpretation: [],
			assessment_credits: fields['assessment_credits'],
			assessment_detail: fields['assessment_detail'],
			selection_type: fields['selection_type']
		})
		.then((response) => {
			toast.success("Successfully Created Assessment");
			setTimeout( () => this.props.history.push('/admin/Assessments'), 2000 );
		})
		.catch((error) => {
			console.log(error);
		});
	}
	// To get all the AssessmentInfo
	getAssessmentInfo(handle) {
		Httpconfig.httptokenget(Constant.siteurl+'api/Assessments/'+handle)
		.then((response) => {
			this.setState({
				fields: {
					assessment_type: response.data.assessment_type,
					assessment_category: response.data.assessment_category,
					assessment_credits: response.data.assessment_credits,
					assessment_detail: response.data.assessment_detail,
					selection_type: response.data.selection_type
				}
			});
		 })
		 .catch((error) => {
			 console.log(error);
		 })
	 }

	// To add new Assessment when user submits the form
	updateAssessment = (event) => {
		event.preventDefault();
		const { handle } = this.props.match.params;
		const data = this.state.fields;
		Httpconfig.httptokenput(Constant.siteurl+'api/Assessments/'+handle, {
			data
		})
		.then((response) => {
			toast.success("Successfully Updated Assessment")
			setTimeout( () => this.props.history.push('/admin/Assessments'), 2000 );
		})
		.catch((error) => {
			console.log(error);
			toast.error(error)
		});
	}

    render(){
		const { fields, errors } = this.state;
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
											<Link to="/admin/Assessments"> Assessments</Link>
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Create Assessment</h3>
											</div>
											<div id="reg_form">
												<form onSubmit={this.checkSubmit.bind(this)}>
													<div className="row">
														<div className="col-md-4">
															 <div className="form-group ">
																<input type="text" name="assessment_type" value={this.state.fields['assessment_type'] || ''} onChange={this.handleChange.bind(this, "assessment_type")} className="form-control" placeholder="Assessment Name" />
																<span className="cRed">{this.state.errors["assessment_type"]}</span>
															</div>
														</div>
														<div className="col-md-4">
															 <div className="form-group ">
																<input type="text" name="assessment_category" value={this.state.fields['assessment_category'] || ''} onChange={this.handleChange.bind(this, "assessment_category")} className="form-control" placeholder="Assessment Note" />
																<span className="cRed">{this.state.errors["assessment_category"]}</span>
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-md-4">
															 <div className="form-group ">
																<input type="text" name="assessment_credits" value={this.state.fields['assessment_credits'] || ''} onChange={this.handleChange.bind(this, "assessment_credits")} className="form-control" placeholder="Credits" />
																<span className="cRed">{this.state.errors["assessment_credits"]}</span>
															</div>
														</div>
														<div className="col-md-4">
															 <div className="form-group ">
																<select name="selection_type" onChange={this.handleChange.bind(this, "selection_type")} value={this.state.fields['selection_type'] || ''} className="form-control">
																	<option value="">Selection Type</option>
																	<option value="button">Button</option>
																	<option value="checkbox">Checkbox</option>
																</select>
																<span className="cRed">{this.state.errors["selection_type"]}</span>
															</div>
														</div>
													</div>
													<div className="row">
														<div className="col-md-4">
															 <div className="form-group ">
																<input type="text" name="assessment_detail" value={this.state.fields['assessment_detail'] || ''} onChange={this.handleChange.bind(this, "assessment_detail")} className="form-control" placeholder="Detail" />
																<span className="cRed">{this.state.errors["assessment_detail"]}</span>
															</div>
														</div>
													</div>
													<div className="row">
														<div className="form-group col-md-12">
															<button type="submit" className="btn  btn-primary save_btn" >Save Assessment</button> &nbsp; 
															<Link to="/admin/Assessments" className="cancel_btn">Cancel</Link> &nbsp; &nbsp; 
														</div>
													</div>
												</form>
											</div>
											<ToastContainer />
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