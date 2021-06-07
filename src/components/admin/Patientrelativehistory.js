import React , {Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";
import Doc from '../DocService';
import PdfContainer from '../PdfContainer';

export default class Patientrelativehistory extends Component{
    constructor(props) {
		super(props);
		this.state = {relativehistory_data:'', datatable : {
			columns: [
             {
                label: 'Patient Name',
                field: 'patientname',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Relative Name',
                field: 'relativename',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Relation',
                field: 'relation',
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
	    this.fetchpatientrelativehistory()
  }
 //fetch total records
 fetchpatientrelativehistory() { 
    Httpconfig.httptokenget(Constant.siteurl + "api/Patientrelativehistory/").then((response) => {
	     this.setState({
            relativehistory_data: response.data,
            })
            let assignvalues = [];
            this.items = response.data.map((item, key) =>
                assignvalues.push({
                'patientname': item.patient_tbl.first_name+" "+item.patient_tbl.last_name, //item.patient_id,
                'relativename': item.relative_name,
                'relation': item.relation,    
                'actions': <div>
                <span><Link  to={'/admin/Createpatientrelativehistory/'+item.id}  className="fa fa-edit point-cursor" title={"Update " + item.relative_name}></Link></span> &nbsp; 
                <span><i onClick={() => this.deleterelativehistory(item.id, item.relative_name)} className="fa fa-trash point-cursor" title={"Delete "+item.relative_name}></i></span> &nbsp; 
            </div>
            
                })
            );   
            
            let historyState = Object.assign({}, this.state);
            historyState.datatable.rows = assignvalues;
            this.setState(historyState);
        }).catch((error) => {
            console.log(error);
        });
}

 //delete controller
 deleterelativehistory(userId,name) {
	var isConfirm = window.confirm("Are you sure to delete "+name+"?");
	if(isConfirm) {
		Httpconfig.httptokendelete(Constant.siteurl+'api/Patientrelativehistory/'+userId)
		.then((response) => {
			toast.success("Successfully Deleted Patientrelativehistory");
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

createPdf = (html) => Doc.createPdf(html);
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
											Patient Relations
										</li>
									</ol>
								</div>
							</div>
							<PdfContainer createPdf={this.createPdf}>
							<section id="CMS_tab">
								<div className="CMS_content">
									<div className="container">
										<div className="row">
											<div className="tab-header">
												<h3>Patient Relations</h3>
											</div>
											<div id="reg_form">
											
												<form>				
													<div className="row">
														<div className="form-group col-md-12">
															<Link  to="/admin/Createpatientrelativehistory"  className="btn  btn-primary fright" >Create Patient Relation</Link>
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
							</PdfContainer>
						</div>
					</div>
				</div>
			</section>
        )
    }
}