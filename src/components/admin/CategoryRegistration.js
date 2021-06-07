import React, {Component} from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { ToastContainer } from 'react-toastify';
import toast from '../toast';
import  Httpconfig  from '../helpers/HttpconfigAdmin';
import { MDBDataTable } from 'mdbreact';
import {Link} from 'react-router-dom';

var Constant = require('../../constants');

export default class CategoryRegistration extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: '',
			category_type: '',
		    category_type_name :'',
			datatable : {
				columns: [
				  {
					label: 'Category',
					field: 'category',
					sort: 'asc',
					width: 150
				  }, {
					label: 'Actions',
					field: 'actions',
					sort: 'asc',
					width: 10 
				  }
				
				],rows : []
			}		
		}
	
		this.deleteCategory = this.deleteCategory.bind(this);
	}

	// When value changes of the fields
	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	// To add new category when user submits the form
	createCategory = (event) => {
		event.preventDefault();
		const { category, category_type_name } = this.state;
		Httpconfig.httptokenpost(Constant.siteurl+'api/Category', {
			category_type: category_type_name,
			category: category,
		})
		.then((response) => {
			toast.success("Successfully Created Category Type");		
    	})
		.catch((error) => {
			console.log(error);
		});
		
	}
	checkSubmit(event){
		event.preventDefault();
		const { editid } = this.props.match.params;
		if(editid){
			this.updateCategory(event);
		}
		 else  {
			this.createCategory(event);
		} 
	}
	// To get detais after first render
	componentDidMount = () => {
		const { handle } = this.props.match.params;
		if(handle){
			this.getCategoryName(this.props.match.params.handle)
			this.editCategoryInfo(this.props.match.params.editid);
		}	
	}
	//get category name
	getCategoryName(category_type_id){
		Httpconfig.httptokenget(Constant.siteurl+'api/CategoryType/'+category_type_id)
		.then((response) => {
			this.setState({
				category_type_name: response.data.category_type
			});
			this.getCategoryList();
		})
		.catch((error) => {
			console.log(error);
		})
	}
	// To get all the categories
	getCategoryList() {
		let items;
		const { handle } = this.props.match.params;
		Httpconfig.httptokenget(Constant.siteurl+'api/Category?category_type='+ this.state.category_type_name)
		.then((response) => {
			console.log(response)
			this.setState({
				categories: response.data.data
			});
			let categoryArray = [];
			this.items = this.state.categories.map((item, key) =>
				categoryArray.push({
					'category': item.category,
				     'actions': 
						<div>
							<span><i onClick={() => this.editCategory(item.id)} className="fa fa-edit point-cursor" title={"Update " + item.category}></i></span> &nbsp;&nbsp; 

							<span><i onClick={() => this.deleteCategory(item.id, item.category)} className="fa fa-trash point-cursor" title={"Delete " + item.category}></i></span>
							{this.state.category_type_name == "Purpose of consultation" ? (
						
						<span>
						&nbsp;&nbsp;
						<Link to={"/admin/uploadcommonimages/" + "problemimages/" + item.id} className="fa fa-upload point-cursor" title={"Update " + item.category} ></Link>
						</span> ) : ""}

						</div>,
		    	})
		    );

			let categoryState = Object.assign({}, this.state);
			categoryState.datatable.rows = categoryArray;
			this.setState(categoryState);
		})
		.catch((error) => {
			console.log(error);
		})
	}

   // To delete any category
	deleteCategory(catId, catName) {
		var isConfirm = window.confirm("Are you sure to delete "+catName+"?");
		if(isConfirm) {
			Httpconfig.httptokendelete(Constant.siteurl+'api/Category/'+catId)
			.then((response) => {
				toast.success("Successfully Deleted Category Type");	
				//this.props.history.push('/CategoryRegistration');
				setTimeout( () => window.location.reload(false), 2000 );
			
				//this.getCategoryList();
			})
			.catch((error) => {
				console.log(error);
			});
			
		}
	}

	// To Edit any Patient
	editCategory(categoryId) {
		const { handle } = this.props.match.params;
		window.location.href = '/admin/CategoryRegistration/'+handle+'/'+categoryId;
	}

	// To Edit any Category
	editCategoryInfo(categoryId) {	
		Httpconfig.httptokenget(Constant.siteurl+'api/Category/'+categoryId)
		.then((response) => {	
			this.setState({
				category:response.data.category,
				category_type:response.data.category_type
			
			});
		})
		.catch((error) => {
			console.log(error);
		})
	 }

	// To add new Responder when user submits the form
	updateCategory = (event) => {
		event.preventDefault();
		const { category, category_type_name } = this.state;
		Httpconfig.httptokenput(Constant.siteurl+'api/Category/'+this.props.match.params.editid, {
			category_type: category_type_name,
			category: category,
		})
		.then((response) => {
			this.props.history.push('/admin/CategoryRegistration/'+ this.props.match.params.handle);  
			toast.success("Successfully Updated Category Type");
			setTimeout( () => window.location.reload(false), 2000 );
		})
		.catch((error) => {
			console.log(error);
			toast.error(error)
		});
		
	}

    render(){
		const { categories, category_types,datatable,category_type_name } = this.state;
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
											<Link to="/admin/CategoryType"> Category</Link>
										</li>
									</ol>
								</div>
							</div>

							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Category Type - {category_type_name}</h3>
											</div>
											<div id="reg_form">
												<form onSubmit={this.checkSubmit.bind(this)}>
													<div className="row">
														<div className="col-md-4">
															<div className="form-group col-md-12">
																<label>Category Name <span className="mandatory_id">*</span></label>
																<input type="text" name="category" value={this.state.category} onChange={this.handleChange} className="form-control" placeholder="Enter category name" />
															</div>
														</div>
														
														<div className="form-group col-md-2">
															<button type="submit" className="btn btn-primary padTopCategorySave" >Add Category</button>
														</div>
													</div>
												</form>

												{
													datatable.rows.length === 0 ? 
														<div className="row">
															<div className="col-md-12">
																<div className="form-group col-md-12 padErrorBG">
																	No Records Found
																</div>
															</div>
														</div> : 
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