import React , {Component} from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import Httpconfig from '../helpers/Httpconfig';
import Constant from '../constants';
export default class Login extends Component {
    constructor(props){
        super(props)
    }
    state = {
        email:'',
        password: '',
    }
        // When value changes of the fields
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
	}
  
    userLogin = (event) => {
      event.preventDefault();
		let loginVal = {
			email: this.state.email,
			password: this.state.password,
			role: 'admin'
		};
		
    Httpconfig.httpPost(Constant.siteurl+'api/Users/loginAdmin/', loginVal)
      .then((response) => {

        if(response.data.data.notification.code == '200') {
          localStorage.setItem("validated", true);
          localStorage.setItem("UserName", response.data.data.data.userobj.email);
          localStorage.setItem("userID", response.data.data.data.userobj.userID);
          localStorage.setItem("token", response.data.data.data.userobj.accessToken);
          window.location.reload();
        } else {
          alert('Invalid User !!');
          window.history.pushState("","","/Login");
        }
      })
    
    }
    render(){
    return(
        <div className="Login">
        <form onSubmit={this.userLogin.bind(this)}>
          <FormLabel id="invalid"></FormLabel>  
          <FormGroup controlId="email" bsSize="large">
            <FormLabel>Email</FormLabel>
            <FormControl autoFocus type="email" name="email" value={this.state.email} onChange={this.handleChange} />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormLabel>Password</FormLabel>
            <FormControl name="password" value={this.state.password} onChange={this.handleChange} type="password" />
          </FormGroup>
          <Button block bsSize="large" type="submit"> Login </Button>
        </form>
      </div>
    )
  }
  
}
