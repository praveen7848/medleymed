import React, {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/Httpconfig';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewconsultation extends Component { 
    constructor(props) {
		super(props);
		this.state = { modules_data:'', datatable : {
			columns: [
             {
                label: 'Module',
                field: 'name',
                sort: 'asc',
                width: 270
             }, 
             {
                label: 'Controller',
                field: 'module_name',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Sequence',
                field: 'sequence',
                sort: 'asc',
                width: 270
             },
             {
                label: 'Required',
                field: 'required',
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
		 this.deleteModules = this.deleteModules.bind(this);
  	}

	// To get detais after first render
	componentDidMount = () =>{
		this.fetchmodulesdata()
    }
   
   fetchmodulesdata = () => {
	Httpconfig.httptokenget(Constant.siteurl + "api/Mastermodule").then((response) => {	
		this.setState({
				modules_data: response.data,
			})
			let assignvalues = [];
			this.items = response.data.map((item, key) =>
				assignvalues.push({
				'name': item.name,
				'module_name': item.master_controller.module_name,
				'sequence': item.sequence,
				'required': (item.required) ? "True" : "False",
				'actions': <div>
				<span><Link  to={'/admin/CreateModule/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.name}></Link></span> &nbsp; 
				<span><i onClick={() => this.deleteModules(item.id, item.name)} className="fa fa-trash point-cursor" title={"Delete "+item.name}></i></span> &nbsp; 
			</div>
			
				})
			);   
			let moduleState = Object.assign({}, this.state);
			moduleState.datatable.rows = assignvalues;
			this.setState(moduleState);
		}).catch((error) => {
			console.log(error);
		});
   }
  
   //delete modules
    //delete controller
	deleteModules(userId, modulename) {
		var isConfirm = window.confirm("Are you sure to delete "+modulename+"?");
		if(isConfirm) {
			Httpconfig.httptokendelete(Constant.siteurl+'api/Mastermodule/'+userId)
			//axios.delete(Constant.siteurl+'api/Users/'+userId)
			.then((response) => {
				toast.success("Successfully Deleted Module");
				setTimeout(
					() => window.location.reload(),
					2000
				  );
			})
			.catch((error) => {
				console.log(error);
			});
		//	this.fetchcontrollerdata();
		}
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
											<Link to="/admin"> Dashboard</Link> &gt; 
											Sub Modules
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Sub Modules</h3>
											</div>
											<div id="reg_form">
												<form>
													<div className="row">
														<div className="form-group col-md-12">
															<Link  to="/admin/CreateModule"  className="btn  btn-primary fright" >Create Sub Module</Link>
														</div>
													</div>
												</form>
												{
													datatable.rows.length === 0 ?   <p>Loading............</p> : 	
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