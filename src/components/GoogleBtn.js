import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import Constant from "../constants";
import { reactLocalStorage } from 'reactjs-localstorage';

const CLIENT_ID = '815145207210-69jij0htb1o78mdif967mk9fvgahtq73.apps.googleusercontent.com';

class GoogleBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogined: false,
            accessToken: ''
        };
        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    }

    login(response) {
        if (response.accessToken) {

            let fullName = response.profileObj.familyName+' '+response.profileObj.givenName;
            let emailAddress = response.profileObj.email;
            this.setState(state => ({
                isLogined: true,
                accessToken: response.accessToken,
                email: response.profileObj.email,
                familyName: response.profileObj.familyName,
                givenName: response.profileObj.givenName,
                googleId: response.profileObj.googleId,
                imageUrl: response.profileObj.imageUrl,
                name: response.profileObj.name,
            }));
            reactLocalStorage.setObject('isSocialObject', {'name': fullName, 'email': emailAddress});
            // reactLocalStorage.setObject('userObj', response);
            // setTimeout(
            //     () => this.createGoogleUser(),
            //     500
            // );
            console.clear();
            console.log("Login Response");
            console.log(response);
            window.location.reload();
        }
    }

    createGoogleUser = () => {
        let userEmail = this.state.email;
        let userName = this.state.name;
        Httpconfig.httptokenpost(Constant.siteurl + "api/Users/", {
            email: userEmail,
            mobile_number: "8",
            user_type: "patient",
            name: userName,
            selected_language: "en",
            is_fingerprint_required: false,
        }).then((response) => {
            toast.success("Successfully Created Patient" + response);
            setTimeout(
                () => this.props.history.push("/"),
                1000
            );
        }).catch((error) => {
            console.log(error);
            toast.error(error);
        });
    };

    logout(response) {
        // this.setState(state => ({
        //     isLogined: false,
        //     accessToken: ''
        // }));
    }

    handleLoginFailure(response) {
        alert('Failed to log in');
    }

    handleLogoutFailure(response) {
        alert("Failed to log out");
    }

    render() {
        return (
            <div>
                {this.state.isLogined ?
                    <GoogleLogout
                        clientId={CLIENT_ID}
                        buttonText='Logout'
                        onLogoutSuccess={this.logout}
                        onFailure={this.handleLogoutFailure}
                    >
                    </GoogleLogout> : <GoogleLogin
                        clientId={CLIENT_ID}
                        buttonText='Login'
                        authMethod='https://accounts.google.com'
                        scope={[
                            "profile",
                            "email",
                            'https://www.googleapis.com/auth/userinfo.profile',
                        ].join(" ")}
                        onSuccess={this.login}
                        onFailure={this.handleLoginFailure}
                        responseType='code,token'
                    />
                }
                {this.state.accessToken ? <h5>Your Access Token: <br /><br /> {this.state.accessToken}</h5> : null}

            </div>
        )
    }
}

export default GoogleBtn;
