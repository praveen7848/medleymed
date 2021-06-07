import React,{Component} from 'react';
import VideoComponent from './VideoComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
export default class Vediorender extends Component {
  render(){
      return(
        <MuiThemeProvider>
        <div>
               
                <VideoComponent />
            </div>
        </MuiThemeProvider>
      )
    
    
  }
  
    
}