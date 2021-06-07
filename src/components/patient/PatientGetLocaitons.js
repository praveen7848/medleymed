import React, { useState } from "react";
import ReactDOM from "react-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
//import { geocodeByPlaceId } from 'react-places-autocomplete';
// import { CopyToClipboard } from "react-copy-to-clipboard";

// import "./styles.css";

//import "react-google-places-autocomplete/dist/assets/index.css";

// autocomplete.addListener('place_changed', function() {});
//  var place = autocomplete.getPlace();
//  autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);
//  var lng = place.geometry.location.lng();
//  var lat = place.geometry.location.lat();
//  var latlng = {lat , lng};
//  console.log(latlng);


const PatientGetLocations=()=> {
  const [rows, setRows] = useState([]); 

  return (
    <div className="App">
      <GooglePlacesAutocomplete
        placeholder="Type in an address"
        inputStyle={{
          height: 40,
          fontSize: 28
        }}
        suggestionsStyles={{
          container: {
            padding: 16,
            background: "#efefef"
          },
          suggestion: {
            background: "#eee",
            cursor: "pointer"
          },
          suggestionActive: {
            background: "#bbb"
          }
        }}
        onSelect={result => {
            //console.log(result);
            alert(result);
            
          const { description, place_id } = result;

          setRows([{ description, place_id }, ...rows]);
          
        }}
      />
      <br />

      <div
        style={{
          textAlign: "left"
        }}
      >
        {rows.map(row => (
          <div key={row.place_id} style={{ padding: "8px 0" }} id="rakesh">
            <div style={{ fontSize: 12, color: "#bbb" }}>{row.description}</div>
            <div>
              {row.place_id}&nbsp;
              {/* <CopyToClipboard text={row.place_id}>
                <button>Copy</button>
              </CopyToClipboard> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PatientGetLocations;

