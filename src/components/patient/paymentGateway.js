import React from 'react';
import Httpconfig from "../helpers/Httpconfig";
import { reactLocalStorage } from 'reactjs-localstorage';
import Constant from "../../constants";
   // import logo from './logo.svg';
import { usePaystackPayment, PaystackButton, PaystackConsumer } from 'react-paystack';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
   // import './App.css';
    
    const config = {
        reference: (new Date()).getTime(),
        email: "rakesh.n@medleymed.com",
        amount: 100,
        publicKey: 'pk_test_b503e67b2f26e761101121c9704e9e06bc4c5b79',
    };
    var data=[];
    const PaystackHookExample = () => {
        const initializePayment = usePaystackPayment(config);
        return (
          <div class="terms"><a href="#" onClick={() => { initializePayment() }}><span>Pay</span></a></div>
          
        );
    };
    
    // you can call this function anything
    const handleSuccess = (reference) => {
      // Implementation for whatever you want to do with reference and after success call.
      data.transaction_id=reference.reference;
      Httpconfig.httptokenpost(Constant.siteurl +"api/OM/orderProcess",data)
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        toast.success(response.data.message);
        localStorage.setItem("cartId","");
        setInterval(() => {
          window.location.href = "./myOrders";
        }, 1000);
      }
    })
    .catch((error) => {
      toast.error(error);
    });
    };

    // you can call this function anything
    const handleClose = () => {
      // implementation for  whatever you want to do when the Paystack dialog closed.
      //console.log('closed')
    }

    function App(props) {
      data=props;
      var config1="";
      
      if(Object.keys(data).length>0){
        let tobepaid="";
        tobepaid=data.payable_amount*100;
     config1 = {
        reference: (new Date()).getTime(),
        email: "rakesh.n@medleymed.com",
        amount: tobepaid,
        publicKey: Constant.paymentkey,
    };
  }else{
     config1 = {
      reference: (new Date()).getTime(),
      email: "rakesh.n@medleymed.com",
      amount: 0.00,
      publicKey: Constant.paymentkey,
  };

  }
        const componentProps = {
            ...config1,
            text: 'Paystack Button Implementation',
            onSuccess: (reference) => handleSuccess(reference),
            onClose: () => handleClose
        };
    
      return (
        <div className="App">
            {/* <PaystackHookExample />
              <PaystackButton {...componentProps} />  */}
            <PaystackConsumer {...componentProps} >
                {({initializePayment}) =>  <div class="terms"><a href="#" onClick={() => { initializePayment() }}><span>Pay</span></a></div>}
                
            </PaystackConsumer> 
        </div>
      );
    }
    
    export default App;