import React, {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../../helpers/Httpconfig';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewmastermodules extends Component { 
    constructor(props) {
		super(props);
		this.state = {controller_data:'', datatable : {
			columns: [
             {
                label: 'Name',
                field: 'name',
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
		this.deleteController = this.deleteController.bind(this);
  }
	
	
  // To get detais after first render
  componentDidMount = () =>{
		const { handle } = this.props.match.params;
	    this.fetchcontrollerdata()
  }
	
	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	fetchcontrollerdata() {
		Httpconfig.httptokenget(Constant.siteurl + "api/Mastercontrollers").then((response) => {	
			this.setState({
					controller_data: response.data,
				})
				let assignvalues = [];
				console.log(response)
				this.items = response.data.map((item, key) =>
					assignvalues.push({
					'name': item.module_name,
					'sequence': item.module_sqequence,
					'required': (item.module_required) ? "True": "False",
					'actions': <div>
					<span><Link  to={'/admin/CreateController/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.module_name}></Link></span> &nbsp; 
					<span><i onClick={() => this.deleteController(item.id, item.module_name)} className="fa fa-trash point-cursor" title={"Delete "+item.module_name}></i></span> &nbsp; 
				</div>
				
					})
				);   
				let controllerState = Object.assign({}, this.state);
				controllerState.datatable.rows = assignvalues;
				this.setState(controllerState);
			}).catch((error) => {
				console.log(error);
			});
	}

	

 //delete controller
 deleteController(userId, controllername) {
	var isConfirm = window.confirm("Are you sure to delete "+controllername+"?");
	if(isConfirm) {
		Httpconfig.httptokendelete(Constant.siteurl+'api/Mastercontrollers/'+userId)
		//axios.delete(Constant.siteurl+'api/Users/'+userId)
		.then((response) => {
			toast.success("Successfully Deleted Controller");
			setTimeout(
				() => window.location.reload(),
				2000
			  );
			
		})
		.catch((error) => {
			console.log(error);
		});
	}
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
											Master Modules
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Modules</h3>
											</div>
											<div id="reg_form">
												<form>
													<div className="row">
														<div className="form-group col-md-12">
															<Link  to="/admin/CreateController"  className="btn  btn-primary fright" >Create Module</Link>
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