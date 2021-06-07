import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigRetailer";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import Patnewcss from "../../public/css/doctor/doctor.css";
import RetailerHeader from "../retailer/RetailerHeader";
import PatientFooter from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';

function Retaileruploadstock() {
 
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [showbutton, setbutton] = useState("upload_stock_btn collapse-hide");
  const excelData=[];
  const retailerId="";
  
  
  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
 
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
 
        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
 
    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));
    if(list.length>0){
      setbutton("upload_stock_btn collapse-show");
    }
    setData(list);
    setColumns(columns);
  }
 
  // handle file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  }
  const back=e=>{
    window.location.href="./Retailerstock";
  }
  
  const handleChange =(event) =>{
    let index=event.target.id.split(",");
    let key=index[0];
    let column=index[1];
   
    data[key][column]=event.target.value;
   
  }
  
  const uploadData=()=>{
    //let retailerId=this.state.retailerId;
   
    const userData=reactLocalStorage.getObject("retuserObj");
  if(userData){
      if(userData!=""){
         const retailerId=userData.retailer_id; 
      } else{
          window.location.href = "/login";
      }
    }   
    
    for(let i=0;i<data.length;i++){
      excelData.push( 
        {
        "retailer_id":userData.retailer_id,
        "product_id":data[i]['ProductId'],
        "medicine_id":data[i]['MedicineId'],
        "batch":data[i]['Batch'],
        "expiry_date":data[i]['Expirydate'],
        "quantity":data[i]['Quantity'],
        "mrp":data[i]['MRP'],
        "discount":data[i]['Discount'],
        "vat":data[i]['VAT'],
        "commission":"0",
        "CGST":"0",
        "SGST":"0",
        "IGST":"0",
      }

      )
    }
  
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/retailerProduct/uploadProductStockExcelData",
      {excelData}
    )
    .then((response) => { 
      if(response.data.status=200){
        toast.success(response.message);
        setTimeout(() => window.location.href="./RetailerDashboard" ,1000);
      }
     })
    .catch((error) => {
       toast.error(error);
       
    });
  }

  
  
  return (
    <main id="main">
    <section id="Pharmacy_dashboard">
    <div class="container-fluid">
        <div class="row">
   
      <RetailerHeader/>
      <div class="stock_update">
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      />
      <div class={showbutton}>
      <a href="#"><button type="button" onClick={uploadData}>Add to stock</button></a>
      </div>
      &nbsp;
      <div class="upload_stock_btn" onClick={back}>
      <a href="#"><button type="button">Back</button></a>
      </div>
      {/* <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}

      /> */}
      
      

      
      <div class="tab-pane fade" id="running_home" role="tabpanel" aria-labelledby="running_home-tab">
                                    <div class="">
                                        <div class="stock_body">
                                           <div class="col-md-12 no_padding">
                                        <div class="table-responsive">
                                        
                                            <table border ="1">
                                                <thead>
                                                 
                                       { data.length>0 ?
                                                 data.map((finalLoadedData,num)=>(
                                                  <React.Fragment>

                                                    {num==0 ?   <tr>
                                                    <th>Sno</th>
                                                    <th>Medicine Id</th>
                                                    <th>Product Id</th>
                                                    <th>Medicine Name</th>
                                                    <th>Manufacturer</th>
                                                    {/* <th>Medicine Form</th> */}
                                                    <th>Batch</th>
                                                    <th>Quantity</th>
                                                    <th>Expire Date</th>
                                                    <th>Discount</th>
                                                    <th>MRP</th>
                                                    <th>VAT</th>
                                                    </tr> : ""}
                                                    <tr>
                                                    <td>{num}</td>
                                                      <td>{finalLoadedData.MedicineId}</td>
                                                      <td>{finalLoadedData.productId}</td>
                                                      <td>{finalLoadedData.MedicineName}</td>
                                                      <td>{finalLoadedData.Manufacturer}</td>
                                                      {/* <td>{finalLoadedData.Form}</td> */}
                                                      <td><input type="text" class="form-control stock_inp" id={num +",Batch"} defaultValue={finalLoadedData.Batch}  onKeyUp={handleChange}/></td>
                                                      <td><input type="text" class="form-control stock_inp" id={num +",Quantity"} defaultValue={finalLoadedData.Quantity}  onKeyUp={handleChange}/></td>
                                                      <td><input type="text" class="form-control stock_inp date_inp" id={num +",Expirydate"} defaultValue={finalLoadedData.Expirydate} onKeyUp={handleChange}/></td>
                                                      <td><input type="text" class="form-control stock_inp" id={num +",Discount"} defaultValue={finalLoadedData.Discount} onKeyUp={handleChange}/></td>
                                                      <td><input type="text" class="form-control stock_inp" id={num +",MRP"} defaultValue={finalLoadedData.MRP} onKeyUp={handleChange}/></td>
                                                      <td><input type="text" class="form-control stock_inp" id={num +",VAT"} defaultValue={finalLoadedData.VAT} onKeyUp={handleChange}/></td>
                                                      
 
                                                      </tr>
                                                      </React.Fragment>
                                               ))
                                             :"" }
                                                </thead>
                                              <tbody >
                                                
                                              
                                       
                                              </tbody>
                                            </table>
                                          </div>
                                          </div>
                                          </div>
                                          </div>
                                   
                                    </div>
                                    
      </div>
      
      </div>
      <ToastContainer />
     
    </div>
    <PatientFooter/>
         
    </section>
    </main>
  )
}

export default Retaileruploadstock;