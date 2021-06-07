import React ,{Component} from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";

export default class Create_health_medicine_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
          fields: {},
          errors: {},
        };
      }
    
      // To get detais after first render
      componentDidMount = () => {
        const { handle } = this.props.match.params;
        this.getrelativehistory(handle);
     };

    
      // When value changes of the fields
      handleChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
        console.log(this.state)
      };
      
    // To get single record
    getrelativehistory(handle) {
        Httpconfig.httptokenget(Constant.siteurl + "api/Healthosmedicine/fetchdata/" + handle)
        .then((response) => {
        this.setState({
            fields: {
                medicineid : response.data[0].medicineid,
                medicinename : response.data[0].medicinename,
                manufacturer : response.data[0].manufacturer,
                unit_price : response.data[0].unit_price,
                package_form: response.data[0].package_form,
                drug_type: response.data[0].drug_type,
                product_group_name : response.data[0].product_group_name,
                standard_units : response.data[0].standard_units,
                form : response.data[0].form,
                size : response.data[0].size,
                per_unit: response.data[0].per_unit,
                mrp: response.data[0].mrp,
                schedule_category : response.data[0]['schedule-category'],
                schedule_description : response.data[0]['schedule-description'],
                constituents_name : response.data[0].constituents_name,
                constituents_strength : response.data[0]['constituents-strength'],
                interactions_food_show_alert: response.data[0]['interactions-food-show-alert'], 
                interactions_food_tag: response.data[0]['interactions-food-tag'],
                interactions_food_color_codes : response.data[0]['interactions-food-color_codes'],
                interactions_food_description : response.data[0]['interactions-food-description'],
                interactions_food_label : response.data[0]['interactions-food-label'],
                interactions_lactation_show_alert : response.data[0]['interactions-lactation-show-alert'],
                interactions_lactation_tag: response.data[0]['interactions-lactation-tag'],
                interactions_lactation_color_code: response.data[0]['interactions-lactation-color_code'],
                interactions_lactation_description : response.data[0]['interactions-lactation-description'],
                interactions_lactation_label : response.data[0]['interactions-lactation-label'],
                interactions_alcohol_show_alert : response.data[0]['interactions-alcohol-show-alert'],
                interactions_alcohol_tag : response.data[0]['interactions-alcohol-tag'],
                interactions_alcohol_color_code: response.data[0]['interactions-alcohol-color_code'],
                interactions_alcohol_description: response.data[0]['interactions-alcohol-description'],
                interactions_alcohol_description_label : response.data[0]['interactions-alcohol-description-label'],
                interactions_pregnancy_label : response.data[0]['interactions-pregnancy-label'],
                interactions_pregnancy_tag : response.data[0]['interactions-pregnancy-tag'],
                interactions_pregnancy_color_code : response.data[0]['interactions-pregnancy-color_code'],
                interactions_pregnancy_description: response.data[0]['interactions-pregnancy-description'],
                interactions_pregnancy_show_alert: response.data[0]['interactions-pregnancy-show_alert'],
                components: response.data[0].components
    
            },
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }
      
    // create or update   
    checkSubmit(event)
   {
        event.preventDefault();
        const { handle } = this.props.match.params;
        console.log(this.handleValidation())
        if (this.handleValidation() && handle) {
            this.updatehealthmedicine(event);
        } else if (this.handleValidation() && handle == undefined) {
            this.createhealthmedicine(event);
        } else {
            toast.warn("Form has errors.");
        }
    }
      // creates new controller
      createhealthmedicine = (event) =>{
        event.preventDefault();
        const { fields, errors } = this.state;
        
        Httpconfig.httptokenpost(Constant.siteurl + "api/Healthosmedicine", this.state.fields)
          .then((response) => {
            toast.success("Successfully Created health medicine");
            setTimeout(
              () => this.props.history.push("/admin/Viewhealthmedicine"),
              2000
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    
      // updates controller
      updatehealthmedicine = (event) => {
        event.preventDefault();
        const { handle } = this.props.match.params;
        const { fields, errors } = this.state;
        Httpconfig.httptokenput(
          Constant.siteurl + "api/Healthosmedicine/" + handle,this.state.fields
          
        )
          .then((response) => {
            toast.success("Successfully Updated health medicine");
            setTimeout(
              () => this.props.history.push("/admin/Viewhealthmedicine"),
              2000
            );
        })
          .catch((error) => {
            console.log(error);
            toast.error(error);
          });
      }
    
      handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        
        if (!fields["medicineid"]) {
          formIsValid = false;
          errors["medicineid"] = "Medicine Id cannot ne empty";
        } 
       
        if (!fields["medicinename"]) {
            formIsValid = false;
            errors["medicinename"] = "Medicine name  cannot be empty";
        }
        
        if (!fields["manufacturer"]) {
            formIsValid = false;
            errors["manufacturer"] = "Manufacturer cannot be empty";
        } 
         
        if (!fields["unit_price"]) {
            formIsValid = false;
            errors["unit_price"] = "Unit price  cannot be empty";
        }
        
        if (!fields["package_form"]) {
            formIsValid = false;
            errors["package_form"] = "Package form name cannot be empty";
        } 
         
        if (!fields["drug_type"]) {
            formIsValid = false;
            errors["drug_type"] = "Drug Type cannot be empty";
        }
        
       

      
        if (!fields["form"]) {
            formIsValid = false;
            errors["form"] = "form cannot be empty";
        }

        if (!fields["standard_units"]) {
            formIsValid = false;
            errors["standard_units"] = "Standard units cannot be empty";
        }
        if (!fields["product_group_name"]) {
            formIsValid = false;
            errors["product_group_name"] = "Product group Name cannot be empty";
        }

        if (!fields["size"]) {
            formIsValid = false;
            errors["size"] = "Size cannot be empty";
        }
        if (!fields["per_unit"]) {
            formIsValid = false;
            errors["per_unit"] = "Per unit cannot be empty";
        }

        if (!fields["mrp"]) {
            formIsValid = false;
            errors["mrp"] = "Mrp cannot be empty";
        }
        if (!fields["schedule_category"]) {
            formIsValid = false;
            errors["schedule_category"] = "Schedule Category cannot be empty";
        }

        if (!fields["constituents_name"]) {
            formIsValid = false;
            errors["constituents_name"] = "Constituents name cannot be empty";
        }
        if (!fields["schedule_description"]) {
            formIsValid = false;
            errors["schedule_description"] = "Schedule description cannot be empty";
        }

        if (!fields["constituents_strength"]) {
            formIsValid = false;
            errors["constituents_strength"] = "Constituents strength cannot be empty";
        }

        if (!fields["interactions_food_show_alert"]) {
            formIsValid = false;
            errors["interactions_food_show_alert"] = "Interactions food show alert cannot be empty";
        }

        if (!fields["interactions_food_tag"]) {
            formIsValid = false;
            errors["interactions_food_tag"] = "Interactions food tag cannot be empty";
        }
        if (!fields["interactions_food_color_codes"]) {
            formIsValid = false;
            errors["interactions_food_color_codes"] = "Interactions food color codes cannot be empty";
        }

        if (!fields["interactions_food_description"]) {
            formIsValid = false;
            errors["interactions_food_description"] = "Interactions food description cannot be empty";
        }

        if (!fields["interactions_food_label"]) {
            formIsValid = false;
            errors["interactions_food_label"] = "Interactions food label Name cannot be empty";
        }

        if (!fields["interactions_lactation_show_alert"]) {
            formIsValid = false;
            errors["interactions_lactation_show_alert"] = "Interactions lactation show alert cannot be empty";
        }
        if (!fields["interactions_lactation_tag"]) {
            formIsValid = false;
            errors["interactions_lactation_tag"] = "Interactions lactation tag cannot be empty";
        }

        if (!fields["interactions_lactation_color_code"]) {
            formIsValid = false;
            errors["interactions_lactation_color_code"] = "Interactions lactation color code cannot be empty";
        }
 

        if (!fields["interactions_lactation_label"]) {
            formIsValid = false;
            errors["interactions_lactation_label"] = "Interactions lactation label cannot be empty";
        }
      
        if (!fields["interactions_lactation_description"]) {
            formIsValid = false;
            errors["interactions_lactation_description"] = "Interactions lactation description cannot be empty";
        }

     
     
        if (!fields["interactions_lactation_description"]) {
            formIsValid = false;
            errors["interactions_lactation_description"] = "Interactions lactation description cannot be empty";
        }

       

        if (!fields["interactions_alcohol_show_alert"]) {
            formIsValid = false;
            errors["interactions_alcohol_show_alert"] = "Interactions alcohol show alert cannot be empty";
        }
        if (!fields["interactions_alcohol_tag"]) {
            formIsValid = false;
            errors["interactions_alcohol_tag"] = "Interactions alcohol tag cannot be empty";
        }
        if (!fields["interactions_alcohol_color_code"]) {
            formIsValid = false;
            errors["interactions_alcohol_color_code"] = "Interactions alcohol color code cannot be empty";
        }
        if (!fields["interactions_alcohol_description"]) {
            formIsValid = false;
            errors["interactions_alcohol_description"] = "interactions alcohol description cannot be empty";
        }
        if (!fields["interactions_alcohol_description_label"]) {
            formIsValid = false;
            errors["interactions_alcohol_description_label"] = "interactions alcohol description label cannot be empty";
        }
        
        if (!fields["interactions_pregnancy_tag"]) {
            formIsValid = false;
            errors["interactions_pregnancy_tag"] = "interactions pregnancy tag cannot be empty";
        }
        if (!fields["interactions_pregnancy_color_code"]) {
            formIsValid = false;
            errors["interactions_pregnancy_color_code"] = "interactions pregnancy color code cannot be empty";
        }
        if (!fields["interactions_pregnancy_show_alert"]) {
            formIsValid = false;
            errors["interactions_pregnancy_show_alert"] = "interactions pregnancy showa lert cannot be empty";
        }
        if (!fields["components"]) {
            formIsValid = false;
            errors["components"] = "components cannot be empty";
        }
        console.log(this.state.fields)
    
        this.setState({ errors: errors });
        return formIsValid;
      }
    
      render(){
        const { fields, errors, patients } = this.state;
            return(
                <section id="main_dashboard">
                <div className="container" id="main_front">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="dash-section">
                        <div className="section-header">
                          <ol className="breadcrumb">
                            <li className="active">
                              <Link to="/admin"> Dashboard</Link> &gt;
                              <a> Healthosmedicine </a>
                            </li>
                          </ol>
                        </div>
                      </div>
        
                      <section id="CMS_tab">
                        <div className="CMS_content">
                          <div className="container">
                            <div className="row">
                              <div className="tab-header">
                                <h3>Create Healthosmedicine</h3>
                              </div>
                              <div id="reg_form">
                                <form  onSubmit={this.checkSubmit.bind(this)}> 
                                  <div className="row">
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["medicineid"] || ""}
                                          onChange={this.handleChange.bind(this, "medicineid")}   placeholder="Medicine Id"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["medicineid"]}
                                        </span>
                                             
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                       <div className="form-group ">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["medicinename"] || ""}
                                          onChange={this.handleChange.bind(this, "medicinename")}   placeholder="Medicine Name"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["medicinename"]}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                       <div className="form-group ">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["manufacturer"] || ""}
                                          onChange={this.handleChange.bind(this, "manufacturer")}   placeholder="Manufacturer"
                                        />
                                         <span className="cRed">
                                            {this.state.errors["manufacturer"]}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">             
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                          type="ftext"
                                          name="name"
                                          className="form-control"
                                          value={this.state.fields["unit_price"] || ""}
                                          onChange={this.handleChange.bind(this, "unit_price")}   placeholder="Unit Price"
                                        />
                                            <span className="cRed">
                                                {this.state.errors["unit_price"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["package_form"] || ""}
                                            onChange={this.handleChange.bind(this, "package_form")}   placeholder="Package Form"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["package_form"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["drug_type"] || ""}
                                            onChange={this.handleChange.bind(this, "drug_type")}   placeholder="Drug Type"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["drug_type"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["standard_units"] || ""}
                                            onChange={this.handleChange.bind(this, "standard_units")}   placeholder="Standard Units"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["standard_units"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["product_group_name"] || ""}
                                            onChange={this.handleChange.bind(this, "product_group_name")}   placeholder="Product Group Name"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["product_group_name"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["form"] || ""}
                                            onChange={this.handleChange.bind(this, "form")} id="inputExperience" placeholder="Form">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["form"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["size"] || ""}
                                            onChange={this.handleChange.bind(this, "size")}   placeholder="Size"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["size"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["per_unit"] || ""}
                                            onChange={this.handleChange.bind(this, "per_unit")}   placeholder="Per Units"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["per_unit"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["mrp"] || ""}
                                            onChange={this.handleChange.bind(this, "mrp")}   placeholder="MRP"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["mrp"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["schedule_category"] || ""}
                                            onChange={this.handleChange.bind(this, "schedule_category")}   placeholder="Schedule Category"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["schedule_category"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["schedule_description"] || ""}
                                            onChange={this.handleChange.bind(this, "schedule_description")} id="inputExperience" placeholder="Schedule Description">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["schedule_description"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["constituents_name"] || ""}
                                            onChange={this.handleChange.bind(this, "constituents_name")} id="inputExperience" placeholder="Constituents Name">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["constituents_name"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["constituents_strength"] || ""}
                                            onChange={this.handleChange.bind(this, "constituents_strength")} id="inputExperience" placeholder="Constituents Strength">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["constituents_strength"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_food_show_alert"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_food_show_alert")}   placeholder="Interactions Food Show Alert"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_food_show_alert"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_food_tag"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_food_tag")}   placeholder="Interactions Food Tag"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_food_tag"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_food_color_codes"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_food_color_codes")}   placeholder="Interactions Food Color Codes"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_food_color_codes"]}
                                            </span>
                                        </div>
                                    </div>
                                   
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["interactions_food_description"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_food_description")} id="inputExperience" placeholder="Interactions Food Description">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["interactions_food_description"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_food_label"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_food_label")}   placeholder="Interactions Food Label"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_food_label"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["interactions_lactation_show_alert"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_lactation_show_alert")} id="inputExperience" placeholder="Interactions Lactation Show Alert">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["interactions_lactation_show_alert"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_lactation_tag"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_lactation_tag")}   placeholder="Interactions Lactation Tag"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_lactation_tag"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_lactation_color_code"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_lactation_color_code")}   placeholder="Interactions Lactation Color Code"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_lactation_color_code"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["interactions_lactation_description"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_lactation_description")} id="inputExperience" placeholder="Interactions Lactation Description">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["interactions_lactation_description"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_lactation_label"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_lactation_label")}   placeholder="Interactions Lactation Label"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_lactation_label"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["interactions_alcohol_show_alert"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_alcohol_show_alert")} id="inputExperience" placeholder="Interactions Alcohol Show Alert">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["interactions_alcohol_show_alert"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_alcohol_tag"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_alcohol_tag")}   placeholder="Interactions Alcohol Tag"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_alcohol_tag"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_alcohol_color_code"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_alcohol_color_code")}   placeholder="Interactions Alcohol Color Code"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_alcohol_color_code"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["interactions_alcohol_description"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_alcohol_description")} id="inputExperience" placeholder="Interactions Alcohol Description">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["interactions_alcohol_description"]}
                                            </span>
                                        </div>
                                    </div>
                             
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_alcohol_description_label"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_alcohol_description_label")}   placeholder="Interactions Alcohol Description Label"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_alcohol_description_label"]}
                                            </span>
                                        </div>
                                    </div>
  
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["interactions_pregnancy_label"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_pregnancy_label")} id="inputExperience" placeholder="Interactions Pregnancy Label">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["interactions_pregnancy_label"]}
                                            </span>
                                        </div>
                                    </div>
                             
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_pregnancy_tag"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_pregnancy_tag")}   placeholder="Interactions Pregnancy Tag"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_pregnancy_tag"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_pregnancy_color_code"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_pregnancy_color_code")}   placeholder="Interactions Pregnancy Color Code"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_pregnancy_color_code"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["interactions_pregnancy_description"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_pregnancy_description")} id="inputExperience" placeholder="Interactions Pregnancy Description">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["interactions_pregnancy_description"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                        <input
                                            type="ftext"
                                            name="name"
                                            className="form-control"
                                            value={this.state.fields["interactions_pregnancy_show_alert"] || ""}
                                            onChange={this.handleChange.bind(this, "interactions_pregnancy_show_alert")}   placeholder="Interactions Pregnancy Show_Alert"
                                            />
                                            <span className="cRed">
                                                {this.state.errors["interactions_pregnancy_show_alert"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                         <div className="form-group ">
                                            <textarea class="form-control"  value =  {this.state.fields["components"] || ""}
                                            onChange={this.handleChange.bind(this, "components")} id="inputExperience" placeholder="Components">
                                               
                                            </textarea>
                                            <span className="cRed">
                                                {this.state.errors["components"]}
                                            </span>
                                        </div>
                                    </div>
                                 </div>
                               <div className="row">
                                <div className="form-group col-md-12">
                                  <button
                                    type="submit" className="btn  btn-primary save_btn">
                                    Save Health Medicine Data
                                  </button>{" "}
                                  &nbsp;
                                  <Link to="/admin/Viewhealthmedicine" className="cancel_btn">
                                    Cancel
                                  </Link>{" "}
                                  &nbsp; &nbsp;
                                </div>
                              </div>
                                 </form>
                              </div>
                            </div>
                            <ToastContainer />
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