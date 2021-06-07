import React , {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewcategory extends Component{
    constructor(props) {
		super(props);
		this.state = {category_data:'', datatable : {
			columns: [
                {
                    label: 'Clinic Id',
                    field: 'clinicid',
                    sort: 'asc',
                    width: 150
                 },
             {
                label: 'Category',
                field: 'category',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Category Type',
                field: 'categorytype',
                sort: 'asc',
                width: 270
             },
             {
                label: 'Image',
                field: 'image',
                sort: 'asc',
                width: 270
             },
             {
                label: 'Status',
                field: 'status',
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
		this.deletecategory = this.deletecategory.bind(this);
  }
	
	
  // To get detais after first render
  componentDidMount = () =>{
	    this.fetchcategorydata()
  }
	
	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	fetchcategorydata() { 
		//Httpconfig.httptokenget(Constant.siteurl + "api/Category/Findall").then((response) => {	
			Httpconfig.httptokenget(Constant.siteurl + "api/Category").then((response) => {
			this.setState({
                category_data: response.data,
				})
				let assignvalues = [];
			
                this.items = response.data.data.map((item, key) =>
					assignvalues.push({
                    'clinicid': item.clinic_id,
                    'category': item.category,
                    'categorytype': item.category_type,
                    'image':  <img src={item.category_image}  className="user-image" alt="Category Image"></img> ,
					'status': (item.status == "1") ? "Active": "In Active",
					'actions': <div>
					{/* <span><Link  to={'/admin/CreateCategory/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.category}></Link></span> &nbsp;  */}
                    <span><Link  to={'/admin/ImageUploads/'+'Category/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.category}></Link></span> &nbsp; 
				
                    <span><i onClick={() => this.deletecategory(item.id, item.category)} className="fa fa-trash point-cursor" title={"Delete "+item.category}></i></span> &nbsp; 
					{/* <span><Link  to = {'/admin/ImageUploads/'+'Category/'+item.id}  className="fa fa-upload point-cursor cBlack" title={"Upload Image for " + item.category}></Link></span> */}

                </div>
				
					})
                );   
                
				let categoryState = Object.assign({}, this.state);
				categoryState.datatable.rows = assignvalues;
				this.setState(categoryState);
			}).catch((error) => {
				console.log(error);
			});
	}

	

 //delete controller
 deletecategory(userId,name) {
	var isConfirm = window.confirm("Are you sure to delete "+name+"?");
	if(isConfirm) {
		Httpconfig.httptokendelete(Constant.siteurl+'api/Category/'+userId)
		//axios.delete(Constant.siteurl+'api/Users/'+userId)
		.then((response) => {
			toast.success("Successfully Deleted Category");
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
											Category 
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Category</h3>
											</div>
											<div id="reg_form">
												<form>
													<div className="row">
														<div className="form-group col-md-12">
															<Link  to="/admin/ImageUploads/Category"  className="btn  btn-primary fright" >Create Category</Link>
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