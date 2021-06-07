import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";

export default class Viewretailers extends Component {
   constructor(props) {
      super(props);
      this.state = {
         page_data: '',
         datatable: {
            columns: [
               {
                  label: 'Name',
                  field: 'storename',
                  sort: 'asc',
                  width: 150
               },
               {
                label: 'Mobile Number ',
                field: 'mobile_number ',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Email ',
                field: 'email ',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Registration Number',
                field: 'registration_number',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Registration Expiry',
                field: 'registration_expirity',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Status',
                field: 'status',
                sort: 'asc',
                width: 150
             },
               {
                  label: 'Actions',
                  field: 'actions',
                  sort: 'asc',
                  width: 10
               }
            ], rows: []
         }
      }
      this.deleteRetailer = this.deleteRetailer.bind(this);
   }


   // To get detais after first render
   componentDidMount = () => {
      this.fetchpagesdata()
   }

   // When value changes of the fields
   handleChange = (event) => {
      this.setState({ [event.target.name]: event.target.value });
   }

   fetchpagesdata() {
      Httpconfig.httptokenget(Constant.siteurl + "api/retailer/").then((response) => {

         this.setState({
            page_data: response.data.data,
         })
         let assignvalues = [];

         this.items = (response.data.data).map((item, key) =>
            // console.log("coupon_name "+item.coupon_name),
            assignvalues.push({
               'storename': item.storename,
               'mobile_number ': item.mobile_number ,
               'email ': item.email ,
               'registration_number': item.registration_number,
               'registration_expirity': item.registration_expirity,
               'status': (item.is_active == "1") ? "Active" : "In Active",
               'actions': <div>
                  <span><Link to={'/admin/Createretailers/' + item.id} className="fa fa-edit point-cursor" title={"Update " + item.storename}></Link></span> &nbsp;
					<span><i onClick={() => this.deleteRetailer(item.id, item.storename)} className="fa fa-trash point-cursor" title={"Delete " + item.storename}></i></span> &nbsp;
				</div>
            })
         );
         // console.log(assignvalues);
         // console.log("Hai Avinash");
         // return;
         let retailerState = Object.assign({}, this.state);
         // console.log(datatable.rows.length+" datatable.rows.length");
         retailerState.datatable.rows = assignvalues;
         this.setState(retailerState);
      }).catch((error) => {
         console.log(error);
      });
   }



   //delete controller
   deleteRetailer(userId, name) {
      var isConfirm = window.confirm("Are you sure to delete " + name + "?");
      if (isConfirm) {
         Httpconfig.httptokendelete(Constant.siteurl + 'api/retailer/' + userId)
            //axios.delete(Constant.siteurl+'api/Users/'+userId)
            .then((response) => {
               toast.success("Successfully Deleted retailer");
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
   render() {
      const { datatable } = this.state;
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
                                 Retailers
										</li>
                           </ol>
                        </div>
                     </div>

                     <section id="CMS_tab">
                        <div className="CMS_content">
                           <div className="container">
                              <div className="row">
                                 <div className="tab-header">
                                    <h3> Create Retailer</h3>
                                 </div>
                                 <div id="reg_form">
                                    <form>
                                       <div className="row">
                                          <div className="form-group col-md-12">
                                             <Link to="/admin/Createretailers" className="btn  btn-primary fright" >Create Retailers</Link>
                                          </div>
                                       </div>
                                    </form>
                                    {
                                       datatable.rows.length === 0 ? <p>Loading............</p> :
                                          <MDBDataTable striped bordered small data={datatable} />
                                    }
                                    <div className="row">
                                       <div className="col-md-12">
                                          <div className="update_btn" style={{ 'textAlign': 'right' }}></div>
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