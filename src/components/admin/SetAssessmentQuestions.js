import React, {Component, useState, Fragment  } from 'react';
import { Button, FormGroup, FormControl, FormLabel, FormInput } from "react-bootstrap";
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

export default class SetAssessmentQuestions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			assessmentQuestion: [{assessment_question: "", assessment_answers: [{answer: "", score: 0}]}]
		}
	}

	checkSubmit(event){
		event.preventDefault();
		const { handle } = this.props.match.params;
		this.updateAssessment(event);
	}

	// To get detais after first render
	componentDidMount = () => {
		const { handle } = this.props.match.params;
		this.getAssessmentInfo(handle);
	}

	// To get all the AssessmentInfo
	getAssessmentInfo(handle) {
		Httpconfig.httptokenget(Constant.siteurl+'api/Assessments/'+handle)
		.then((response) => {
			if(response.data.assessments.length) {
				this.setState({
					assessmentQuestion: response.data.assessments
				});
			}
		 })
		 .catch((error) => {
			 console.log(error);
		 })
	 }

	addClick(){
		this.setState(prevState => ({ 
			assessmentQuestion: [...prevState.assessmentQuestion, { assessment_question: "", assessment_answers: [{answer: "", score: 0}] }]
		}))
	}

	addClickAnswer(i){
		var assessmentQuestion = {...this.state.assessmentQuestion};
		let assessmentQuestion1 = assessmentQuestion[i].assessment_answers.push({answer: "", score: 0});
		this.setState({ 
			assessmentQuestion1
		})
	}

	createUI(){
		return this.state.assessmentQuestion.map((el, i) => (
			<div key={i}>
				<div className="row">
					<div className="col-md-12">
						<div className="form-group col-md-1">
							<strong>Ques. {i+1}</strong>
						</div>
						<div className="form-group col-md-9 quesMarginLeft">
							<input placeholder="First Name" name="assessment_question" value={el.assessment_question || ''} onChange={this.handleChange.bind(this, i)} className="questionInput" />
						</div>
						<div className="col-md-1">
							<div className="form-group col-md-2">
								<input type='button' value='Remove' onClick={this.removeClick.bind(this, i)} />
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-1"> &nbsp; </div>
					<div className="form-group col-md-4 quesMarginLeft">
						<input type='button' className="margin15" value='Add Answer / Score' onClick={this.addClickAnswer.bind(this, i)}/>
					</div>
				</div>
				{this.createAnswer(i)}
				<div>&nbsp;</div>
			</div>
		))
	}

	handleChange(i, e) {
		const { name, value } = e.target;
		let assessmentQuestion = [...this.state.assessmentQuestion];
		assessmentQuestion[i] = {...assessmentQuestion[i], [name]: value};
		this.setState({ assessmentQuestion });
	}

	handleChangeAnswer(i, j, e) {
		const { name, value } = e.target;
		let assessmentQuestion = [...this.state.assessmentQuestion];
		assessmentQuestion[i].assessment_answers[j] = {...assessmentQuestion[i].assessment_answers[j], [name]: value};
		this.setState({ assessmentQuestion });
	}

	removeClick(i){
		let assessmentQuestion = [...this.state.assessmentQuestion];
		assessmentQuestion.splice(i, 1);
		this.setState({ assessmentQuestion });
	}

	removeClickAnswer(i, j){
		let assessmentQuestion = [...this.state.assessmentQuestion];
		assessmentQuestion[i].assessment_answers.splice(j, 1);
		this.setState({ assessmentQuestion });
	}

	createAnswer(i){
		return this.state.assessmentQuestion[i].assessment_answers.map((em, j) => (
			<div key={j}>
				<div className="row">
					<div className="col-md-12">
						<div className="form-group col-md-1">
							&nbsp;
						</div>
						<div className="form-group col-md-2 quesMarginLeft">
							<input placeholder="Answer" name="answer" value={em.answer || ''} onChange={this.handleChangeAnswer.bind(this, i, j)} />
						</div>
						<div className="form-group col-md-2">
							<input placeholder="Score" name="score" value={em.score || 0} onChange={this.handleChangeAnswer.bind(this, i, j)} />
						</div>
						<div className="form-group col-md-2">
							<input type='button' value='X' onClick={this.removeClickAnswer.bind(this, i, j)} />
						</div>
					</div>
				</div>
			</div>
		))
	}

	// To add new Assessment when user submits the form
	updateAssessment = (event) => {
		event.preventDefault();
		const { handle } = this.props.match.params;
		this.state.assessmentQuestion = this.state.assessmentQuestion.map(function(currentValue, Index) { currentValue.aqid = Index+1; return currentValue })
		const data = this.state.assessmentQuestion;
		Httpconfig.httptokenput(Constant.siteurl+'api/Assessments/'+handle, {
			assessments: data
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
		const { assessmentQuestion } = this.state;
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
											<Link to="/Assessments"> Assessments</Link>
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Set Assessment Question</h3>
											</div>
											<div id="reg_form">
												<form onSubmit={this.checkSubmit.bind(this)}>
													<div className="row">
														<div className="form-group col-md-4">
															<input type='button' className="margin15 txtBold" value='Add Question' onClick={this.addClick.bind(this)}/>
														</div>
													</div>
													<div className="row">
														<div className="form-group col-md-1">
															&nbsp;
														</div>
													</div>
													{this.createUI()}
													<div className="row">
														<div className="form-group col-md-11">
															<button type="submit" className="btn  btn-primary padTopCategorySave fright" >Save Assessment Question</button> &nbsp; 
															<Link to="/admin/Assessments" className="padTopCategorySave hrefCategory fright">Cancel</Link> &nbsp; &nbsp; 
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