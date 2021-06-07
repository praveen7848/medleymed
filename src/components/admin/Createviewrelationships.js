import React , {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Createviewrelationships extends Component{
    constructor(props) {
        super(props);
        
		this.state = {fields: {},
                    errors: {},
                    status:"Create",
                    update_id:"",
            relations_data:'', datatable : {
			columns: [
             {
                label: 'Relationship Name',
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
  }
	
	
    // To get detais after first render
    componentDidMount = () =>{
        this.fetchrelationshipsdata()
    }

    getrelationshipsInfo(id){
        this.setState({
            status:"Update",
            update_id:id
        })
        Httpconfig.httptokenget(Constant.siteurl + "api/masterrealtionships/" + id)
        .then((response) => {
          this.setState({
            fields: {
              relation_name : response.data[0].relation_name,
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

    //fetches all masterrealtionships data
	fetchrelationshipsdata() { 
		Httpconfig.httptokenget(Constant.siteurl + "api/masterrealtionships/").then((response) => {	
			this.setState({
           relations_data: response.data.data,
        })
     //   console.log(response.data.data)
				let assignvalues = [];
	            this.items = response.data.data.map((item, key) =>
					assignvalues.push({
                    'name': item.relation_name,
                    'actions': <div>
					<span><a  onClick={() => this.getrelationshipsInfo(item.id)} href="javascript:void(0)"  className="fa fa-edit point-cursor" title={"Update " + item.relation_name}></a></span> &nbsp; 
					<span><i onClick={() => this.deleterelationships(item.id, item.relation_name)} className="fa fa-trash point-cursor" title={"Delete "+item.relation_name}></i></span> &nbsp; 
				</div>
				
					})
      );   
                
        let realtionsState = Object.assign({}, this.state);
        realtionsState.datatable.rows = assignvalues;
				this.setState(realtionsState);
			}).catch((error) => {
				console.log(error);
			});
	}

	 // checks validation  
     checkSubmit(event) {
        event.preventDefault();
        const { handle } = this.props.match.params;
       if (this.handleValidation() && this.state.status == "Update") {
          this.updaterelationships(event);
        } else if (this.handleValidation() && this.state.status == "Create") {
          this.createrelationships(event);
        } else {
          toast.warn("Form has errors.");
        }
      }

    //create relationships
    createrelationships= (event) => {
        event.preventDefault();
        const { fields, errors } = this.state;
        Httpconfig.httptokenpost(Constant.siteurl + "api/masterrealtionships", {
          relation_name: fields["relation_name"],
        })
          .then((response) => {
            toast.success("Successfully Created Relations");
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
    updaterelationships = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/masterrealtionships/" + this.state.update_id,
      {
        relation_name : fields["relation_name"],
      }
    )
      .then((response) => {
        toast.success("Successfully Updated Relation");
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
        
        if (!fields["relation_name"]) {
          formIsValid = false;
          errors["relation_name"] = "Realtion name cannot be empty";
        } 
        this.setState({ errors: errors });
        return formIsValid;
      }

    //delete controller
    deleterelationships(userId,name) {
        var isConfirm = window.confirm("Are you sure to delete "+name+"?");
        if(isConfirm) {
            Httpconfig.httptokendelete(Constant.siteurl+'api/masterrealtionships/'+userId)
            .then((response) => {
                toast.success("Successfully Deleted Relations");
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
											<Link to="/Dashboard"> Dashboard</Link> &gt; 
											relationships 
										</li>
									</ol>
								</div>
							</div>
							<section id="CMS_tab">
								<div className="CMS_content">
                    <div className="container">
                          <div className="row">
                              <div className="tab-header">
                                  <h3>{this.state.status} relationships</h3>
                                </div>
                                <div id="reg_form">
                                  <form  onSubmit={this.checkSubmit.bind(this)}> 
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <input
                                            type="ftext"
                                            name="relation_name"
                                            className="form-control"
                                            value={this.state.fields["relation_name"] || ""}
                                            onChange={this.handleChange.bind(
                                              this,
                                              "relation_name"
                                            )}
                                            placeholder="Realtion name"
                                          />
                                          <span className="cRed">
                                              {this.state.errors["relation_name"]}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="form-group col-md-12">
                                        <button
                                          type="submit" className="btn  btn-primary save_btn">
                                          Save Relation
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