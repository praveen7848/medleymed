import React, {Component} from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import Login from '../login';
import axios from 'axios';
import $ from "jquery";
import { ToastContainer } from 'react-toastify';
import toast from '../toast';
import { MDBDataTable } from 'mdbreact';
import {Link} from 'react-router-dom';
import  Httpconfig  from '../helpers/HttpconfigAdmin';

var Constant = require('../../constants');

export default class Assessments extends Component {
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
					label: 'Category',
					field: 'category',
					sort: 'asc',
					width: 650
				  },
				  {
					label: 'Type',
					field: 'type',
					sort: 'asc',
					width: 100 
				  },
				  {
					label: 'Action',
					field: 'actions',
					sort: 'asc',
					width: 100   
				  }
				], rows : []
			}
		}
		this.deleteAssessments = this.deleteAssessments.bind(this);
	}

	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	// To get detais after first render
	componentDidMount = () => {
		this.getAssessments();
	}

	// To get all the categories
	getAssessments() {
		Httpconfig.httptokenget(Constant.siteurl+'api/Assessments/')
		.then((response) => {
			this.setState({
				assessments: response.data
			});
			let assessmentArray = [];
			this.items = this.state.assessments.map((item, key) =>
			 assessmentArray.push({
				'name': item.assessment_type,
				'category': item.assessment_category,
				'type': this.capitalize(item.selection_type),
				'actions':
					<div>
						<span><Link  to={'/admin/CreateAssessment/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.assessment_type}></Link></span> &nbsp; &nbsp; 
	
						<span><i onClick={() => this.setAssessmentQuestions(item.id)} className="fa fa-question-circle point-cursor" title={"Set Questions for " + item.assessment_type}></i></span> &nbsp; &nbsp;

						<span><i onClick={() => this.setAssessmentScore(item.id)} className="fa fa-sort-numeric-asc point-cursor" title={"Set Assessment Score Interpretation for " + item.assessment_type}></i></span> &nbsp; &nbsp; 

						<span><i onClick={() => this.setAssessmentResponse(item.id)} className="fa fa-arrows-h point-cursor" title={"Set Assessment Response for " + item.assessment_type}></i></span> &nbsp; &nbsp; 

						<span><i onClick={() => this.deleteAssessments(item.id, item.assessment_type)} className="fa fa-trash point-cursor" title={"Delete " + item.assessment_type}></i></span>
					</div>
			 })
			)
			let assessmentState = Object.assign({}, this.state);
			assessmentState.datatable.rows = assessmentArray;
			this.setState(assessmentState);
		})
		.catch((error) => {
			console.log(error);
		})
	}

	// Captialize the Strong
	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Set Score Interpretation
	setAssessmentScore(handle) {
		this.props.history.push('/admin/SetAssessmentScore/'+handle);
    }

	// Set Score Response
	setAssessmentResponse(handle) {
		this.props.history.push('/admin/SetAssessmentResponse/'+handle);
    }

	// Set Questionnaire
	setAssessmentQuestions(handle) {
		this.props.history.push('/admin/SetAssessmentQuestions/'+handle);
    }

	// To delete any category
	deleteAssessments(assessmentId, assessmentName) {
		var isConfirm = window.confirm("Are you sure to delete "+assessmentName+"?");
		if(isConfirm) {
			Httpconfig.httptokendelete(Constant.siteurl+'api/Assessments/'+assessmentId)
			.then((response) => {
				toast.success("Successfully Deleted Assessment");
				this.props.history.push('/admin/Assessments');
			})
			.catch((error) => {
				console.log(error);
			});
			this.getAssessments();
		}
	}

    render(){
		const { assessments, datatable } = this.state;
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
											Assessments List
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Assessments</h3>
											</div>
											<div id="reg_form">
												<div className="row">
													<div className="form-group col-md-12">
														<Link  to="/admin/CreateAssessment"  className="btn  btn-primary fright" >Create Assessment</Link>
													</div>
												</div>
												{
													datatable.rows.length === 0 ?   <p>Loading...........</p> : 	
													<MDBDataTable striped bordered small data={datatable} />
												}
												<div className="row">
													<div className="col-md-12">
														<div className="update_btn" style={{'textAlign': 'right'}}></div>
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