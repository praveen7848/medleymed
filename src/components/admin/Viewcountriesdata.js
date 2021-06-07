import React , {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewcountriesdata extends Component{
    constructor(props) {
		super(props);
		this.state = {countries_data:'', datatable : {
			columns: [
             {
                label: 'Name',
                field: 'name',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Short Name',
                field: 'shortname',
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
		//this.deletelangugages = this.deletelangugages.bind(this);
  }
	
	
  // To get detais after first render
  componentDidMount = () =>{
	    this.fetchcountriesdata()
  }
	
	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	fetchcountriesdata() { 
		Httpconfig.httptokenget(Constant.siteurl + "api/Country").then((response) => {	
			this.setState({
                languages_data: response.data,
				})
				let assignvalues = [];
	            this.items = response.data.map((item, key) =>
					assignvalues.push({
					'name': item.name,
					
					'actions': <div>
					<span><Link  to={'/admin/Createcountries/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.name}></Link></span> &nbsp; 
					<span><i onClick={() => this.deletecountry(item.id, item.name)} className="fa fa-trash point-cursor" title={"Delete "+item.name}></i></span> &nbsp; 
				</div>
				
					})
                );   
                
          		let countryState = Object.assign({}, this.state);
                  countryState.datatable.rows = assignvalues;
				this.setState(countryState);
			}).catch((error) => {
				console.log(error);
			});
	}

	

 //delete controller
 deletecountry(userId,name) {
	var isConfirm = window.confirm("Are you sure to delete "+name+"?");
	if(isConfirm) {
		Httpconfig.httptokendelete(Constant.siteurl+'api/Country/'+userId)
		.then((response) => {
			toast.success("Successfully Deleted Country");
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
											Countries 
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Countries</h3>
											</div>
											<div id="reg_form">
												<form>
													<div className="row">
														<div className="form-group col-md-12">
															<Link  to="/admin/Createcountries"  className="btn  btn-primary fright" >Create Country</Link>
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