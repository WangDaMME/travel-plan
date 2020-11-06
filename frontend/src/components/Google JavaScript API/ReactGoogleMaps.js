import React, { useState } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { Button } from 'antd';
// import { GoogleMap, LoadScript, Marker } from "google-maps-react";


const containerStyle = {
  height: '95vh'
};

const centerFake = { lat: 37.7857, lng: -122.4011 };
const neFake = { lat:37.812, lng: -122.3482 };
const swFake = { lat:37.70339999999999, lng: -122.527 };

const positionsFake = [
  { lat: 37.7857, lng: -122.4011 },
  { lat: 37.7947, lng: -122.4117 },
  { lat: 37.8087, lng: -122.4098 },
  { lat: 37.7958, lng: -122.3938 }
]

const onLoad1 = marker => {
  console.log('marker: ', marker)
}
const onLoad2 = polyline => {
  console.log('polyline: ', polyline)
}
const options = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

const MyComponent = ({cityResult, recomendCityList, encodedRoute}) => {

  //info window open/close & selected places
  // const [infoOpen, setInfoOpen] = useState(false);
  // const [selectedPlace, setSelectedPlace] = useState(null);
  // const markerClickHandler = () => {
  //   // setSelectedPlace(place);
  //   if (infoOpen) {
  //     setInfoOpen(false);
  //   }else {
  //     setInfoOpen(true);
  //   }
  // }

  //test markers with recomendCityList
  let positions = [ ];
  positions = positionsFake;
  if (recomendCityList !== undefined) {
    console.log("I got the list!")
    positions = [];   //empty the selected list
    recomendCityList.map(pos => positions.push(pos));   //get the new list
  }

  // function getPositions(input,list) {
  //   console.log("hello" + JSON.stringify(input.location))
  //   return input.map(pos => list.push(pos.location))
  // }

  const decodePolyline = require('decode-google-map-polyline');
  // var polylineCode = 'neuaEejkbUEGc@j@PXl@p@P\\a@f@GHyDtEgC`DoCfDzHbQp@rAbH`JdBtBrCjDn@p@dDbDfIvHfD~CrK~Jo@z@uCrDmJnL}^ld@mVjZmQrTgArAFJ';
  var polylineCode = encodedRoute;
  const polyline = decodePolyline(polylineCode);
  // console.log("POLYLINE IS HERE" + JSON.stringify(polyline));
  var path = positions;
  if (polyline!==undefined) {
    path = polyline;
  }
  console.log("PATH IS HERE" + JSON.stringify(path));


  let center;
  let ne;
  let sw;
  if (cityResult===undefined)
  {
    center=centerFake; 
    ne = neFake;
    sw = swFake;
  }
  else{
    center = cityResult.location;
    ne = cityResult.viewport.northeast;
    sw = cityResult.viewport.southwest;
    console.log(JSON.stringify(ne) + JSON.stringify(sw));
  }

  const [map, setMap] = React.useState(null)
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    const viewport = [sw, ne];
    viewport.forEach(bound => bounds.extend(new window.google.maps.LatLng(bound.lat, bound.lng)))
    map.fitBounds(bounds);
    console.log("bounds" + JSON.stringify(bounds))
    setMap(map)
  }, [])
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onMapClick = (...args) => {
    console.log('onClick args: ', args)
  }

  const divStyle = {
    background: `rgba(255,255,255, 0.5)`,
    border: `0px solid #ccc`,
    padding: 0,
  }

  // const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // let labelIndex = 0;

  // const [center, setCenter] = useState({lat: 37.7857, lng: -122.4011});
  // const [ne, setNE] = useState({lat:37.812, lng: -122.3482});
  // const [sw, setSW] = useState({lat:37.70339999999999, lng: -122.527});
  // // const viewport = [{lat:37.70339999999999, lng: -122.527}, {lat:37.812, lng: -122.3482}];

  return (
    <>
    {/* <Button type="primary" onClick={findOptimizeRoutes()}>Primary Button</Button> */}
    <LoadScript
      googleMapsApiKey="AIzaSyDNJpRDz7c_p0kP3YzS0iRonyWoWKdU5ns"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDblClick={onMapClick}
        options={{gestureHandling:'greedy'}}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {positions.map(pos => 
        <>
          <Marker 
            key={pos.name}
            position={pos.location}
            onLoad={onLoad1}  
            // onClick={event => markerClickHandler(event, pos)}
            // label= {labels[labelIndex++ % labels.length]}
          />
          
          <InfoWindow
            position={pos.location}
          >
            <div style={divStyle}>
              <h6>{pos.name}</h6>
            </div>
          </InfoWindow>

        </>
        )}

        <Polyline
            onLoad={onLoad2}
            path={path}
            options={options}
        />

      </GoogleMap>
    </LoadScript>
    </>
  )
}

export default React.memo(MyComponent);


// "body":{"location":{"lat":34.0522342,"lng":-118.2436849},
// "viewport":{"northeast":{"lat":34.3373061,"lng":-118.1552891},"southwest":{"lat":33.7036519,"lng":-118.6681759}} 