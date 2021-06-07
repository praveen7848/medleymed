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
                  label: 'Medicine Id',
                  field: 'medicineid',
                  sort: 'asc',
                  width: 150
               },
               {
                label: 'Medicine Name ',
                field: 'medicine_name ',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Medicine Main ',
                field: 'medicine_main ',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Medicine Type',
                field: 'medicine_type',
                sort: 'asc',
                width: 150
             },
             {
                label: 'UOM',
                field: 'uom',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Description',
                field: 'description',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Compositions',
                field: 'compositions',
                sort: 'asc',
                width: 150
             },
             {
                label: 'Retailer',
                field: 'retailer',
                sort: 'asc',
                width: 150
             },
            //  {
            //     label: 'status',
            //     field: 'status',
            //     sort: 'asc',
            //     width: 150
            //  },
               {
                  label: 'Actions',
                  field: 'actions',
                  sort: 'asc',
                  width: 10
               }
            ], rows: []
         }
      }
      this.deleteproductRequest = this.deleteproductRequest.bind(this);
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
      Httpconfig.httptokenget(Constant.siteurl + "api/OM/productRequest/").then((response) => {
         this.setState({
            page_data: response.data.data,
         })
         let assignvalues = [];

         this.items = (response.data.data).map((item, key) =>
            // console.log("coupon_name "+item.coupon_name),
          item.status!=4 ?
            assignvalues.push({
               'medicineid': key+1,
               'medicine_name ': item.medicine_name ,
               'medicine_main ': item.medicine_main ,
               'medicine_type': item.medicine_type,
               'uom': item.uom,
               'description': item.description,
               'compositions': item.compositions,
               'retailer': item.retailer,
               //'status': (item.status == "3") ? "Pending" : "Completed",
               'actions': <div>
                  {/* <span><Link to={'/admin/Createretailers/' + item.id} className="fa fa-edit point-cursor" title={"Update " + item.storename}></Link></span> &nbsp; */}
					
                   
                    <span><i onClick={() => this.requestaccpted(item.id, item.medicine_name)} className="fa fa-check-square point-cursor" title={"Accepted " + item.medicine_name}></i></span> &nbsp;
                    <span><i onClick={() => this.requestrejected(item.id, item.medicine_name)} className="fa fa-window-close point-cursor" title={"Rejected " + item.medicine_name}></i></span> &nbsp;
                    <span><i onClick={() => this.deleteproductRequest(item.id, item.medicine_name)} className="fa fa-trash point-cursor" title={"Delete " + item.id}></i></span> &nbsp;
            	</div>
            })
            :""
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

 //Accepted controller
 requestaccpted(Id, name) {
    var isConfirm = window.confirm("Are you sure to Add Medicine " + name + "?");
    if (isConfirm) {
       Httpconfig.httptokenput(Constant.siteurl + 'api/OM/productRequest/productReqStatusUpdate/' + Id,  {
        status:1
      })
          //axios.delete(Constant.siteurl+'api/Users/'+userId)
          .then((response) => {
             toast.success("Successfully Active Product Request");
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

  //Reject controller
  requestrejected(Id,medicine_name) {
    var isConfirm = window.confirm("Are you sure to Rejected " + medicine_name + "?");
    if (isConfirm) {
       Httpconfig.httptokenput(Constant.siteurl + 'api/OM/productRequest/productReqStatusUpdate/' + Id,  {
        status:0
      })
          //axios.delete(Constant.siteurl+'api/Users/'+userId)
          .then((response) => {
             toast.success("Successfully Rejected Product Request");
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
   //delete controller
   deleteproductRequest(Id, name) {
      var isConfirm = window.confirm("Are you sure to delete " + name + "?");
      if (isConfirm) {
         Httpconfig.httptokendelete(Constant.siteurl + 'api/OM/productRequest/' + Id)
            //axios.delete(Constant.siteurl+'api/Users/'+userId)
            .then((response) => {
               toast.success("Successfully Deleted Product Request");
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
                                 Product Request
										</li>
                           </ol>
                        </div>
                     </div>

                     <section id="CMS_tab">
                        <div className="CMS_content">
                           <div className="container">
                              <div className="row">
                                 {/* <div className="tab-header">
                                    <h3> Create Retailer</h3>
                                 </div> */}
                                 <div id="reg_form">
                                    <form>
                                       <div className="row">
                                          {/* <div className="form-group col-md-12">
                                             <Link to="/admin/Createretailers" className="btn  btn-primary fright" >Create Retailers</Link>
                                          </div> */}
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