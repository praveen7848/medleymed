import React, { Component } from "react";
import axios from 'axios';
export default {
  
  httpPost(url,postdata){
    return axios.post(url, postdata)    
  },
  httptokenpost(url,postdata){
    const options = {   headers: {'Authorization': localStorage.getItem('doctorToken') ? JSON.parse(localStorage.getItem('doctorToken')) :"" } }
    return axios.post(url, postdata,options);
  },
  httptokenget(url){
    const options = {   headers: {'Authorization': localStorage.getItem('doctorToken') ? JSON.parse(localStorage.getItem('doctorToken')) :"" }} 
    return axios.get(url,options);
  },
  httptokendelete(url){
    const options = {   headers: {'Authorization': localStorage.getItem('doctorToken') ? JSON.parse(localStorage.getItem('doctorToken')) :"" } } 
    return axios.delete(url,options);
  },
  httptokenput(url,putdata){
    const options = {   headers: {'Authorization': localStorage.getItem('doctorToken') ? JSON.parse(localStorage.getItem('doctorToken')) :"" } }
    return axios.put(url,putdata,options);
  }

}

