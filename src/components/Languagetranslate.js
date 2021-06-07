import React, {Component} from 'react';
//import { DatePicker,TimePicker } from "antd";
//import "antd/dist/antd.css";

var enlanguage = require("../public/languages/en/En");
var jplanguage = require("../public/languages/Jp/Jp");
var hnlanguage = require("../public/languages/Hn/Hn");

export default class Languagetranslate extends Component {
 
    constructor(props){
      super(props)
    this.state = {
        selectedlang:'',
        langresp:''
   }
}

 componentWillMount(){
  this.setState({langresp: enlanguage.samplepage})
 }
  // When value changes of the fields
  handleChange = (field, event) => {
    //this.setState({ [event.target.name]: event.target.value });
   // alert(this.state.selectedlang)
    this.setState({langresp: ''})
    if(event.target.value == "jp"){
      this.setState({langresp: jplanguage.samplepage})
    }
    else if(event.target.value == "hn"){
      this.setState({langresp: hnlanguage.samplepage})
    } else {
      this.setState({langresp: enlanguage.samplepage})
    }
    console.log(event.target.value,this.state.langresp)
  };
    
    render() {
		return (
            <div>
                {
                  this.state.langresp.map((resp,i) => {
                    return (
                      <div key={i}>
                           <section id="main_dashboard">
            <div className="container" id="main_front">
              <div className="row">
                <form role="form">
                <div className="row">
                            <div className="col-md-4">
                <div className="form-group col-md-12">
                    <label for="email">{resp.name}:</label>
                    <input type="text" placeholder={resp.name} class="form-control" id="email" />
                </div>
                </div></div>
                {/* <div className="row">
                             <div className="col-md-4">
                              <div className="col-md-12">
                                    <DatePicker name="dob" autoComplete="off"
                                     className="dateInput" placeholder="Date of Birth"
                                     disabledDate={this.disabledDate}
                                      selected={this.state.dob} onChange={this.setDateOnChange}
                                        format="YYYY-MM-D HH:mm A"  calendarIcon    /><br />
                                    
                              </div>
                            </div>
                             </div> */}
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group col-md-12">
                            <label for="email">{resp.email}:</label>
                            <input type="email" placeholder={resp.email} class="form-control" id="email" />
                        </div>
                    </div>
                </div>
                <div className="row">
                            <div className="col-md-4">
                <div className="form-group col-md-12">
              
                    <label for="email">{resp.mobileNumber}:</label>
                    <input type="text" placeholder={resp.mobileNumber} class="form-control" id="email" />
                </div> </div></div>
                <div className="row">
                            <div className="col-md-4">
                <div className="form-group col-md-12">
                    <label for="email">{resp.address} :</label>
                    <input type="text" class="form-control" id="email" placeholder={resp.address} />
                </div></div></div>
                            <div className="form-group col-md-12">
                              <button type="button" className="btn  btn-primary padTopCategorySave fright" > {resp.save}  </button>{" "} &nbsp;
                            </div>
            
                </form>
            </div>
            </div>
            </section>
            <div className="col-md-4">
                              <div className="form-group col-md-12">
                                <select name="selectedlang" onChange={this.handleChange.bind(this, "selectedlang")}  className="form-control" >
                                  <option value="">{resp.selectlanguage}</option>
                                  <option value="en">English</option>
                                  <option value="jp">Japanesee</option>
                                  <option value="hn">Hindi</option>
                                </select>
                              </div>
                            </div>
                      </div>
                      
                    );
                  })
                } 

                        

            </div>
        );
    }
}
