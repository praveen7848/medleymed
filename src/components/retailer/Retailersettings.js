import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigRetailer";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import RetailerCss from "../../public/css/retailer/retailer_style.css";
import RetailerHeader from "../retailer/RetailerHeader";
import RetailerSideMenu from "../retailer/RetailerSideMenu";
import Footer from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";

export default class Retailertransactionhistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      vat: "",
    };
  }

  componentDidMount = () => {
    let userData = reactLocalStorage.getObject("retuserObj");
    if (userData) {
      if (userData != "") {
        this.setState({
          retailerId: userData.retailer_id,
        });
        this.forceUpdate();
      }
    } else {
      window.location.href = "/login";
    }
    this.getRetailerDetails(userData.retailer_id);
  };

  // Get the Retailer Details
  getRetailerDetails = (retailerId) => {
    Httpconfig.httptokenget(Constant.siteurl + "api/retailer/" + retailerId)
      .then((response) => {
        if ((response.data.status = 200)) {
          // alert(response.data.data[0].discount_type);
          this.setState({
            slabvalue: response.data.data[0].discount_type,
            slabdiscount: response.data.data[0].discount_slab,
            set_delivery_type: response.data.data[0].set_delivery_type,
            set_delivery_slab: response.data.data[0].set_delivery_slab,
            set_delivery_days: response.data.data[0].set_delivery_days,
            vat: response.data.data[0].vat_tax,
            mobile: response.data.data[0].tbl_user.mobile_number,
          });
          this.forceUpdate();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // Update Vat Details
  saveRetailerDiscountDetails = (event) => {
    let retailerId = this.state.retailerId;
    let slabtype = this.state.slabvalue;
    let discount = this.state.slabdiscount;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/retailer/orderDiscountSlabUpdate/" + retailerId,
      {
        discount_type: discount,
        discount_slab: slabtype,
      }
    )
      .then((response) => {
        if ((response.data.status = 200)) {
          toast.success(response.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // Update Discounts Details
  saveRetailerVatDetails = (event) => {
    let retailerId = this.state.retailerId;
    let vat = this.state.vat;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/retailer/taxUpdate/" + retailerId,
      { vat_tax: vat }
    )
      .then((response) => {
        if ((response.data.status = 200)) {
          toast.success(response.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // Update Delivery Details
  saveDeliveryDeliveryDetails = (event) => {
    let retailerId = this.state.retailerId;
    // let vat=this.state.deliverySlab;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/retailer/setDeliveryChargesUpdate/" + retailerId,
      {
        "set_delivery_type ": this.state.set_delivery_type,
        set_delivery_slab: this.state.set_delivery_slab,
      }
    )
      .then((response) => {
        if ((response.data.status = 200)) {
          toast.success(response.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // update vat state
  handleVat = (event) => {
    this.state.vat = event.target.value;
  };

  // update discount slab state
  handlediscount = (event) => {
    this.state.slabdiscount = event.target.value;
  };

  // update discount value state
  handlediscountValue = (event) => {
    this.state.slabvalue = event.target.value;
  };

  // update Delivery slab state
  handledelivery = (event) => {
    this.state.set_delivery_type = event.target.value;
  };

  // update delivery value state
  handledeliveryValue = (event) => {
    this.state.set_delivery_slab = event.target.value;
  };

  handledeliverydate = (event) => {
    let retailerId = this.state.retailerId;
    let deliverydate = $("#defaultdeliveryDate").val();

    if (deliverydate == "") {
      toast.error("delivery date should not be empty");
      return;
    }
    if (deliverydate > 9) {
      toast.error("delivery date should not more than 9 days");
      return;
    }
   //  return;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/retailer/SetOrderDeliveryDate/" + retailerId,
      {
         set_delivery_days : this.state.set_delivery_date,
      }
    ).then((response) => {
        if ((response.data.status = 200)) {
            toast.success(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  handleDeliveryDateValue = (event) => {
    let noDays = event.currentTarget.value;
    if (noDays > 9) {
      toast.error("Invalid Delivery days");
      $("#defaultdeliveryDate").val('');
      return;
    } else {
      this.state.set_delivery_date = noDays;
    }
  };

  render() {
    return (
      <main id="main">
        <RetailerHeader />
        <RetailerSideMenu />
        <section id="Pharmacy_dashboard">
          <div class="col-lg-10 col-md-10 Pharma_Content">
            <section id="ret_settings">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="set_main">
                      <div class="set_head">
                        <h2>Set Tax</h2>
                      </div>
                      <div class="setting_box">
                        <div class="set_content">
                          <div class="set_form">
                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Set Vat %"
                                defaultValue={this.state.vat}
                                onKeyUp={this.handleVat}
                              />
                            </div>
                            {/* <div class="form-group">
                                            <input type="text" class="form-control" placeholder="Set Vat %" />
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control" placeholder="Set Vat %" />
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control" placeholder="Set Vat %" />
                                        </div> */}
                            <div class="set_save_btn">
                              <button
                                type="button"
                                onClick={this.saveRetailerVatDetails}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="set_main">
                      <div class="set_head">
                        <h2>Order Discount Slab</h2>
                      </div>
                      <div class="setting_box">
                        <div class="set_content">
                          <div class="set_form">
                            <div class="form-group">
                              <select class="form-control">
                                <option>upto</option>
                                {/* <option>Above</option> */}
                              </select>
                            </div>

                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control"
                                defaultValue={this.state.slabvalue}
                                placeholder="Set Slab %"
                                onKeyUp={this.handlediscount}
                              />
                            </div>
                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control"
                                defaultValue={this.state.slabdiscount}
                                placeholder="% Discount"
                                onKeyUp={this.handlediscountValue}
                              />
                            </div>
                          </div>
                          {/* <div class="set_order_next">
                                         <div class="plus_icon">+</div>
                                        </div> */}
                          <div class="set_order_btn">
                            <button
                              type="button"
                              onClick={this.saveRetailerDiscountDetails}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="set_main">
                      <div class="set_head">
                        <h2>Set Delivery Charges</h2>
                      </div>
                      <div class="setting_box">
                        <div class="set_content">
                          <div class="set_form">
                            <div class="form-group">
                              <select class="form-control">
                                <option>upto</option>
                                {/* <option>Above</option> */}
                              </select>
                            </div>

                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Set Slab %"
                                defaultValue={this.state.set_delivery_type}
                                onKeyUp={this.handledelivery}
                              />
                            </div>
                            {/* <div class="form-group">
                                           <input type="radio" class="set_radio" />
                                            <input type="text" class="form-control" placeholder="Km Distance" />
                                        </div> */}
                            <div class="form-group">
                              <input type="radio" class="set_radio" />
                              <input
                                type="text"
                                class="form-control"
                                placeholder="₹ Charges"
                                defaultValue={this.state.set_delivery_slab}
                                onKeyUp={this.handledeliveryValue}
                              />
                            </div>
                          </div>
                          {/* <div class="set_delivery_next">
                                         <div class="plus_icon">+</div>
                                        </div> */}
                          <div class="set_delivery_btn">
                            <button
                              type="button"
                              onClick={this.saveDeliveryDeliveryDetails}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="set_main">
                      <div class="set_head">
                        <h2>Set Delivery Date</h2>
                      </div>
                      <div class="setting_box">
                        <div class="set_content">
                          <div class="set_form">
                            <div class="form-group">
                              <select class="form-control">
                                <option>Order date</option>
                                {/* <option>Above</option> */}
                              </select>
                            </div>

                            <div class="form-group">
                              <input
                                type="number"
                                class="form-control"
                                placeholder="1"
                                id="defaultdeliveryDate"
                              //   defaultValue="1"
                                defaultValue={this.state.set_delivery_days}
                                maxLength={1}
                                onKeyUp={this.handleDeliveryDateValue}
                                onBlur={this.handleDeliveryDateValue}
                              />
                            </div>
                            <div>Note:Order date +1 day </div>
                            {/* <div class="form-group">
                                           <input type="radio" class="set_radio" />
                                            <input type="text" class="form-control" placeholder="Km Distance" />
                                        </div> */}
                            {/* <div class="form-group">
                                            <input type="radio" class="set_radio" />
                                             <input type="text" class="form-control" placeholder="₹ Charges"  defaultValue={this.state.set_delivery_slab} onKeyUp={this.handledeliveryValue}/>
                                         </div> */}
                          </div>
                          {/* <div class="set_delivery_next">
                                         <div class="plus_icon">+</div>
                                        </div> */}
                          <div class="set_delivery_btn">
                            <button
                              type="button"
                              onClick={this.handledeliverydate}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="set_main">
                      <div class="set_head">
                        <h2>Reset Password</h2>
                      </div>
                      <div class="setting_box">
                        <div class="set_content">
                          <div class="set_form">
                            <div class="form-group">
                              <input
                                type="Password"
                                class="form-control"
                                placeholder="Type Old Password"
                              />
                            </div>
                            <div class="form-group">
                              <input
                                type="Password"
                                class="form-control"
                                placeholder="Type New Password"
                              />
                            </div>

                            <div class="set_verify_btn">
                              <button type="button">Verify</button>
                            </div>
                          </div>
                        </div>

                        <div class="set_otp">
                          <div class="form-group">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Enter OTP"
                            />
                          </div>
                          <div class="resend_otp">
                            {/* <h6>Resend otp in <span>08:45</span></h6> */}
                          </div>
                          <p class="otp_num">
                            Otp Sent to <span>{this.state.mobile}</span>
                          </p>
                          <div class="setting_btns">
                            <div class="set_save_btn">
                              <button type="button">Save</button>
                            </div>
                            <div class="set_cancel_btn">
                              <button type="button">Cancel</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <ToastContainer />
        </section>
        {/* <Footer /> */}
      </main>
    );
  }
}
