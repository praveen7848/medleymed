import React from 'react';
import Httpconfig from "../helpers/Httpconfig";
import { reactLocalStorage } from 'reactjs-localstorage';
import Constant from "../../constants";
   // import logo from './logo.svg';
import { usePaystackPayment, PaystackButton, PaystackConsumer } from 'react-paystack';
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
   // import './App.css';
    
   
    var data=[];
    // const PaystackHookExample = () => {
    //     const initializePayment = usePaystackPayment(config);
    //     return (
    //       <div class="terms"><a href="#" onClick={() => { initializePayment() }}><span>Pay</span></a></div>
          
    //     );
    // };
    
    // you can call this function anything
    const handleSuccess = (reference) => {
      // Implementation for whatever you want to do with reference and after success call.
      data.transaction_id=reference.reference;


    Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/", data)
.then((response) => {

  if(response.data.status=="200" && response.data.error==false){
    reactLocalStorage.remove("appointmentId");
    reactLocalStorage.remove("SelectedPatientId");
      toast.success("Thankyou for Payment, you can view your appointment details", {
          position: "bottom-center",
        });
  toast.success(response.data.message, {
      position: "top-center",
    });
    setTimeout(() => window.location.href="/Patientdashboard" ,2000);
    
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
        let emailId="";
        console.log(data);
        tobepaid=data.consultation_fee*100;
        emailId=data.email;
        
     config1 = { 
        reference: (new Date()).getTime(),
        email: emailId,//"rakesh.n@medleymed.com",
        amount: tobepaid,
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
                {({initializePayment}) =>  <div class="terms"><a href="#" onClick={() => { initializePayment() }}><button type="button" class="fee_book">Pay</button></a></div>}
                
            </PaystackConsumer> 
        </div>
      );
    }
    
    export default App;