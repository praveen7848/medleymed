import React , {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewsettings extends Component{
    constructor(props) {
		super(props);
		this.state = {settings_data:'', datatable : {
			columns: [
             {
                label: 'Type',
                field: 'type',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Type value',
                field: 'typevalue',
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
 }
	
	
  // To get detais after first render
  componentDidMount = () =>{
	    this.fetchsettingsdata()
  }
	
	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	fetchsettingsdata() { 
		Httpconfig.httptokenget(Constant.siteurl + "api/Mastersettings/").then((response) => {	
			this.setState({
                settings_data: response.data,
				})
				let assignvalues = [];
	            this.items = response.data.map((item, key) =>
					assignvalues.push({
					'type': item.type,
					'typevalue': item.type_value,
					'actions': <div>
					<span><Link  to={'/admin/Createsettings/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.type}></Link></span> &nbsp; 
					<span><i onClick={() => this.deletesettings(item.id, item.type)} className="fa fa-trash point-cursor" title={"Delete "+item.type}></i></span> &nbsp; 
				</div>
				
					})
                );   
                
          		let settingState = Object.assign({}, this.state);
                  settingState.datatable.rows = assignvalues;
				this.setState(settingState);
			}).catch((error) => {
				console.log(error);
			});
	}

	

 //delete controller
 deletesettings(userId,name) {
     alert(userId)
	var isConfirm = window.confirm("Are you sure to delete "+name+"?");
	if(isConfirm) {
		Httpconfig.httptokendelete(Constant.siteurl+'api/Mastersettings/'+userId)
		.then((response) => {
			toast.success("Successfully Deleted Settings");
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
											Settings 
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Settings</h3>
											</div>
											<div id="reg_form">
												<form>
													<div className="row">
														<div className="form-group col-md-12">
															<Link  to="/admin/Createsettings"  className="btn  btn-primary fright" >Create Settings</Link>
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