import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';


class SideBar extends Component {
  closeNav = () => {
    if (document.getElementById("mySidenav")) {
      document.getElementById("mySidenav").style.width = "0";
    }
  };

  showmenu = () => {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        }
        else {
          dropdownContent.style.display = "block";
        }
      });
    }
  }

  render() {
    return (
      <div id="mySidenav" className="sidenav">
        <a href="#" className="closebtn" onClick={this.closeNav}>&times;</a>
        <div className="side_box">
          <Link className="side_txt active" to="/admin" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Dashboard</Link>
         

         
          {/* <a className="dropdown-btn side_txt" onClick={this.showmenu}>
            <i className="fa fa-user-plus"></i>Modules / SubModules
                     <i className="fa fa-caret-down"></i>
          </a>
          <div className="dropdown-container">
            <Link className="side_txt active" to="../admin/Updateviewmasterconfigurations" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Master Configurations</Link>
            <Link className="side_txt active" to="../admin/Viewmastercontrollers" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Modules</Link>
            <Link className="side_txt active" to="../admin/Viewmastermodules" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Sub Modules</Link>
          </div> */}


          {/* <a className="dropdown-btn side_txt" onClick={this.showmenu}>
            <i className="fa fa-user-plus"></i> Master Modules
                     <i className="fa fa-caret-down"></i>
          </a>
          <div className="dropdown-container">
            <Link className="side_txt active" to="../admin/Viewmastermodules" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Master Modules</Link>
            <Link className="side_txt active" to="../admin/Viewmastersubmodules" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Sub Modules</Link> 
            <Link className="side_txt active" to="../admin/Viewmastersubpagemodules" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Page Modules</Link>
          
          </div> */}

          <a className="dropdown-btn side_txt" onClick={this.showmenu}>
            <i className="fa fa-user-plus"></i>Configurations
                    <i className="fa fa-caret-down"></i>
          </a>
          <div className="dropdown-container">
          <Link className="side_txt active" to="../admin/Viewcategory" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Category</Link>
          <Link className="side_txt active" to="../admin/Viewlanguages" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Languages</Link>
          <Link className="side_txt active" to="../admin/Createviewrelationships" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Relation Ships</Link>
          <Link className="side_txt active" to="../admin/Viewspecializations" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Specializations</Link>
            {/* <Link className="side_txt active" to="../admin/Viewspecialities" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Specialities</Link> */}
            {/* <Link className="side_txt active" to="../admin/Viewpurposeconsultation" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Purpose Consultations</Link> */}
            
            {/* <Link className="side_txt active" to="../admin/Viewcountries" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Countries</Link> */}
            {/* <Link className="side_txt active" to="../admin/Createviewcouncils" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Councils List</Link> */}
           
            
            {/* <Link className="side_txt active" to="../admin/CategoryType" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Category Type</Link> */}
            {/* <Link className="side_txt active" to="../admin/Viewpages" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Pages</Link> */}
            {/* <Link className="side_txt active" to="../admin/ViewCoupons" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Coupons</Link> */}
            {/* <Link className="side_txt active" to="../admin/Viewupdatevitals" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Vitals</Link> */}
          </div>
          <a className="dropdown-btn side_txt" onClick={this.showmenu}>
            <i className="fa fa-users"></i>Clinic Setup <i className="fa fa-caret-down"></i>
          </a>
          <div className="dropdown-container">
          <Link className="side_txt active" to="../admin/Viewmastersubclinicpagemodules" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Clinic Page Modules</Link>
          <Link className="side_txt active" to="../admin/ViewClinics" onClick={this.closeNav}><i className="fa fa-dashboard"></i>View Clinics</Link>
          <Link className="side_txt active" to="../admin/ViewDoctors" onClick={this.closeNav}><i className="fa fa-dashboard"></i>View Doctors</Link>
          {/* <Link to="../admin/Createdoctorslots"><i className="fa fa-cog"></i> Create Slots</Link> */}
          <Link to="../admin/ViewDoctorSlots"><i className="fa fa-cog"></i> View Slots</Link>
          
          {/* <Link className="side_txt active" to="../admin/Assessments" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Assessments</Link> */}
         
          </div>
          <a className="dropdown-btn side_txt" onClick={this.showmenu}>
            <i className="fa fa-users"></i>Appointments <i className="fa fa-caret-down"></i>
          </a>
          <div className="dropdown-container">
            <Link to="../admin/Viewappointments" onClick={this.closeNav}>View Appointments</Link>
            {/* <Link to="../admin/Patientrelativehistory" onClick={this.closeNav}> Patient Relative History</Link> */}
          </div>
          
          {/* <Link className="side_txt active" to="../admin/ViewMasterRoles" onClick={this.closeNav}><i className="fa fa-dashboard"></i>View Master Roles</Link> */}
          {/* <a className="dropdown-btn side_txt" onClick={this.showmenu}>
            <i className="fa fa-users"></i>Settings <i className="fa fa-caret-down"></i>
          </a> */}
          {/* <div className="dropdown-container">
          <Link to="../admin/Viewsettings"><i className="fa fa-cog"></i> Settings</Link>
          <Link to="../admin/Viewhealthmedicine"><i className="fa fa-cog"></i> Health medicine</Link>
          <Link className="side_txt active" to="../admin/Viewcancellationreasons" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Order Cancellation Reasons</Link>
          </div> */}

          {/* <a className="dropdown-btn side_txt" onClick={this.showmenu}>
            <i className="fa fa-user-plus"></i>Order Medicine
                    <i className="fa fa-caret-down"></i>
          </a>
          <div className="dropdown-container">
          <Link className="side_txt active" to="../admin/Vieworders" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Orders</Link>
          <Link className="side_txt active" to="../admin/ViewRetailers" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Retailers</Link>
          <Link className="side_txt active" to="../admin/Viewrevenue" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Revenue & Commissions</Link>
          <Link className="side_txt active" to="../admin/ViewProductrequest" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Product Request</Link>
          
          
          </div> */}
         
          {/* <Link className="side_txt active" to="../admin/Createtelemedicinescheduleslots" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Create slots</Link> */}
          {/* <Link className="side_txt active" to="../admin/Facilitator" onClick={this.closeNav}><i className="fa fa-dashboard"></i>Facilitator</Link> */}
        </div>
      </div>
    )
  }
}

export default withRouter(SideBar)