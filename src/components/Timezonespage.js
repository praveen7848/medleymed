import React,{Component} from 'react';
//import DatePicker from "react-datepicker";
//import { DatePicker,TimePicker } from "antd";
//import "antd/dist/antd.css";

import "react-datepicker/dist/react-datepicker.css";

export default class Timezonespage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          dob: '',
    }    
  
}

    setDateOnChange = (value) => {
        this.setState({ dob: value });
        console.log(this.state.dob);
      };
      disabledDate(current) {
       // let customDate = moment.Date();
       // return current && current < moment(customDate, "YYYY-MM-DD");
      }

        // When value changes of the fields
  setStartTimeOnChange = (value) => {
    this.setState({ days_open_start_time: value });
  };
    render(){
    
         return(
            <div>
             <section id="main_dashboard">
                <div className="container" id="main_front">
                    <div className="row">
                          <form role="form">
                             <div className="row">
                             <div className="col-md-4">
                              <div className="col-md-12">
                                    <DatePicker name="dob" autoComplete="off"
                                     className="dateInput" placeholder="Date of Birth"
                                  //   disabledDate={this.disabledDate}
                                      selected={this.state.dob} onChange={this.setDateOnChange}
                                        format="YYYY-MM-D HH:mm A"  calendarIcon    /><br />
                                    
                              </div>
                            </div>
                             </div>
                            <div className="row">
                                 <div className="col-md-4">
                                    <div className="form-group col-md-12">
                                        <TimePicker
                                        name="days_open_start_time"
                                          selected={this.state.days_open_start_time}
                                        onChange={this.setStartTimeOnChange}
                                        format="HH:mm A"
                                       // minuteStep = "30" 
                                        className="form-control"
                                        />
                                        
                                    </div>
                                    </div>
                            </div>   
                         </form>
                    </div>
                </div>
            </section>
         </div>

         )


    }


}