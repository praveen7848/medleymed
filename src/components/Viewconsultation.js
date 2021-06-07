import React, {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/Httpconfig';
import Constant from '../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewconsultation extends Component { 
    constructor(props) {
		super(props);
		this.state = { datatable : {
			columns: [
             {
                label: 'Controller Name',
                field: 'name',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Name',
                field: 'email',
                sort: 'asc',
                width: 270
             }, 
             {
                label: 'Sequence',
                field: 'phone',
                sort: 'asc',
                width: 270
             },
    		 {
				label: 'Actions',
				field: 'actions',
				sort: 'asc',
				width: 10 
			  }
			], rows : []
		}	
     }
		//this.deleteUser = this.deleteUser.bind(this);
	}

	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}
    render(){
        const {datatable } = this.state;
        
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
											Modules
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Module</h3>
											</div>
											<div id="reg_form">
												<form>
													<div className="row">
														<div className="form-group col-md-12">
															<Link  to="/CreateModule"  className="btn  btn-primary fright" >Create Module</Link>
														</div>
													</div>
												</form>
												{
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