import React , {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Createviewcouncils extends Component{
    constructor(props) {
        super(props);
        
		this.state = {fields: {},
                    errors: {},
                    status:"Create",
                    update_id:"",
            councils_data:'', datatable : {
			columns: [
             {
                label: 'Council Name',
                field: 'name',
                sort: 'asc',
                width: 150
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
        this.fetchcouncilsdata()
    }

    getCoucilInfo(id){
        this.setState({
            status:"Update",
            update_id:id
        })
        Httpconfig.httptokenget(Constant.siteurl + "api/Council" + id)
        .then((response) => {
          this.setState({
            fields: {
              council_name : response.data[0].council_name,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
	
	// When value changes of the fields
    handleChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
	}

    //fetches all councils data
	fetchcouncilsdata() { 
		Httpconfig.httptokenget(Constant.siteurl + "api/Council").then((response) => {	
			this.setState({
                councils_data: response.data,
				})
				let assignvalues = [];
	            this.items = response.data.map((item, key) =>
					assignvalues.push({
                    'name': item.council_name,
                    'actions': <div>
					<span><a  onClick={() => this.getCoucilInfo(item.id)} href="javascript:void(0)"  className="fa fa-edit point-cursor" title={"Update " + item.council_name}></a></span> &nbsp; 
					<span><i onClick={() => this.deletecouncildata(item.id, item.council_name)} className="fa fa-trash point-cursor" title={"Delete "+item.council_name}></i></span> &nbsp; 
				</div>
				
					})
      );   
                
        let CouncilsState = Object.assign({}, this.state);
        CouncilsState.datatable.rows = assignvalues;
				this.setState(CouncilsState);
			}).catch((error) => {
				console.log(error);
			});
	}

	 // checks validation  
     checkSubmit(event) {
        event.preventDefault();
        const { handle } = this.props.match.params;
       if (this.handleValidation() && this.state.status == "Update") {
          this.updatecouncildata(event);
        } else if (this.handleValidation() && this.state.status == "Create") {
          this.createcouncil(event);
        } else {
          toast.warn("Form has errors.");
        }
      }

    //create council
    createcouncil= (event) => {
        event.preventDefault();
        const { fields, errors } = this.state;
        Httpconfig.httptokenpost(Constant.siteurl + "api/Council", {
          council_name: fields["council_name"],
        })
          .then((response) => {
            toast.success("Successfully Created Council");
            setTimeout(
              () =>  window.location.reload(),
              2000
            );
          })
          .catch((error) => {
            console.log(error);
          });
    }

    //update coucnil
    updatecouncildata = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/Council/" + this.state.update_id,
      {
        council_name : fields["council_name"],
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Council");
        setTimeout(
          () =>  window.location.reload(),
          2000
        );
    })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

    }

    //validation code
    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        
        if (!fields["council_name"]) {
          formIsValid = false;
          errors["council_name"] = "Council  name cannot be empty";
        } 
        this.setState({ errors: errors });
        return formIsValid;
      }

    //delete controller
    deletecouncildata(userId,name) {
        var isConfirm = window.confirm("Are you sure to delete "+name+"?");
        if(isConfirm) {
            Httpconfig.httptokendelete(Constant.siteurl+'api/Council/'+userId)
            .then((response) => {
                toast.success("Successfully Deleted Council");
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
											Council 
										</li>
									</ol>
								</div>
							</div>
							<section id="CMS_tab">
								<div className="CMS_content">
                    <div className="container">
                          <div className="row">
                              <div className="tab-header">
                                  <h3>{this.state.status} Council</h3>
                                </div>
                                <div id="reg_form">
                                  <form  onSubmit={this.checkSubmit.bind(this)}> 
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-group col-md-12">
                                          <input
                                            type="ftext"
                                            name="council_name"
                                            className="form-control"
                                            value={this.state.fields["council_name"] || ""}
                                            onChange={this.handleChange.bind(
                                              this,
                                              "council_name"
                                            )}
                                            placeholder="Council name"
                                          />
                                          <span className="cRed">
                                              {this.state.errors["council_name"]}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="form-group col-md-8">
                                        <button
                                          type="submit" className="btn  btn-primary padTopCategorySave fright">
                                          Save Council
                                        </button>{" "}
                                        &nbsp;
                                        </div>
                                    </div>
                                  </form>
                                  <div id="reg_form">
                                      {
                                        datatable.rows.length === 0 ?   <p>No Data to display............</p> : 	
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
                   </div>
							</section>
						</div>
					</div>
				</div>
			</section>
        )
    }
}