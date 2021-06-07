import React, { Component } from 'react';
import FacebookLoginWithButton from 'react-facebook-login';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import Constant from "../constants";
import { reactLocalStorage } from 'reactjs-localstorage';

const componentClicked = () => {
    console.log("Clicked!")
}

const LoginButton = ({ facebookResponse }) => (
    <FacebookLoginWithButton
        publishPermissions={["publish_actions"]}
        appId="597290020940871"
        // appId="988649701652413 1"
        // autoLoad
        // autoLoad={false}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={facebookResponse}
        icon="fa-facebook" />
)

const UserCurrentScreen = ({ user }) => (
    <>
        <h1>Welcome {user.name}!</h1>
        <p>{user.email}</p>
        <img src={user.picture.data.url} height={user.picture.height} width={user.picture.width} alt="avatar" />
    </>
)

export default class Facebook extends Component {

    state = { user: false }
    facebookResponse = (response) => {
        // console.log(response);
        this.setState({ ...this.state, user: response })
        let fullName = this.state.user.name;
        let emailAddress = this.state.user.email;
        reactLocalStorage.setObject('isSocialObject', {'name': fullName, 'email': emailAddress});
        // setTimeout(
        //     () => this.createFacebookUser(),
        //     500
        //  );
        window.location.reload();
    }

    createFacebookUser = () => {
        // console.clear();
        // console.log(Constant.siteurl);
        // console.log(this.state);
        // console.log(this.state.user.accessToken);
        // return;
        let userEmail = this.state.user.email;
        let userName = this.state.user.name;
        // let userProfilePicture = this.state.user.picture.data.url;

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

    render() {
        return (
            <div style={{ margin: "auto", textAlign: "center", }}>
                { this.state.user ? <UserCurrentScreen user={this.state.user} /> :
                    <LoginButton facebookResponse={this.facebookResponse} />
                }
            </div>
        )
    }
}
