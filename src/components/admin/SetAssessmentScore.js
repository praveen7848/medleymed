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

export default class SetAssessmentScore extends Component {
	constructor(props) {
		super(props);
		this.state = {
			assessmentScore: [{score: "", interpretation: ""}]
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
			this.setState({
				assessmentScore: response.data.assessment_score_interpretation
			});
		 })
		 .catch((error) => {
			 console.log(error);
		 })
	 }

	addClick(){
		this.setState(prevState => ({ 
			assessmentScore: [...prevState.assessmentScore, { score: "", interpretation: "" }]
		}))
	}
  
	createUI(){
		return this.state.assessmentScore.map((el, i) => (
			<div key={i}>
				<div class="row">
					<div className="col-md-2">
						<div className="form-group col-md-12">
							<input placeholder="Key" name="score" value={el.score ||''} onChange={this.handleChange.bind(this, i)} />
						</div>
					</div>
					<div className="col-md-2">
						<div className="form-group col-md-12">
							<input placeholder="Value" name="interpretation" value={el.interpretation ||''} onChange={this.handleChange.bind(this, i)} />
						</div>
					</div>
					<div className="col-md-2">
						<div className="form-group col-md-12">
							<input type='button' value='Remove' onClick={this.removeClick.bind(this, i)}/>
						</div>
					</div>
				</div>
			</div>
		))
	}

	handleChange(i, e) {
		const { name, value } = e.target;
		let assessmentScore = [...this.state.assessmentScore];
		assessmentScore[i] = {...assessmentScore[i], [name]: value};
		this.setState({ assessmentScore });
	}

	removeClick(i){
		let assessmentScore = [...this.state.assessmentScore];
		assessmentScore.splice(i, 1);
		this.setState({ assessmentScore });
	}

	// To add new Assessment when user submits the form
	updateAssessment = (event) => {
		event.preventDefault();
		const { handle } = this.props.match.params;
		const data = this.state.assessmentScore;
		Httpconfig.httptokenput(Constant.siteurl+'api/Assessments/'+handle, {
			assessment_score_interpretation: data
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
		const { assessmentScore } = this.state;
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
											<Link to="/admin/Assessments"> Assessments</Link></li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Set Assessment Score / Interpretation</h3>
											</div>
											<div id="reg_form">
												<form onSubmit={this.checkSubmit.bind(this)}>
													<div className="row">
														<div className="form-group col-md-4">
															<input type='button' className="margin15 txtBold" value='Add Score Interpretation' onClick={this.addClick.bind(this)}/>
														</div>
													</div>
													{this.createUI()}
													<div className="row">
														<div className="form-group col-md-5">
															<button type="submit" className="btn  btn-primary padTopCategorySave fright" >Save Score / Interpretation</button> &nbsp; 
															<Link to="/Assessments" className="padTopCategorySave hrefCategory fright">Cancel</Link> &nbsp; &nbsp; 
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