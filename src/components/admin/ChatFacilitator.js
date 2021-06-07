import React, { Component } from 'react';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigAdmin';
import Constant from '../../constants';
import { Link } from "react-router-dom";
import Iframe from 'react-iframe'
import manageFacilitator from "../../public/css/facilitator/manage.css";

export default class Facilitator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {},
        };
    }

    render() {
        const { fields, errors } = this.state;

        return (
            <section id="chat_bar">
                <div class="container_main">
                    <div class="chat">
                        <div class="chat-body">
                            <div class="chat-bubble chat-bubble--right">
                                <div class="message msg_right">
                                    Doctor will be available shortly
                            </div>
                            </div>
                            <div class="chat-bubble">
                                <div class="message msg_left">
                                    Ok
                            </div>
                            </div>
                        </div>
                        <div class="chat_footer">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="chat-input">
                                        <input type="text" placeholder="Enter your message" />
                                        <button><img src="../images/facilitator/icons/send_icons.svg" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
