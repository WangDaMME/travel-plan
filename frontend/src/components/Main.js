import React, { useState, useEffect } from "react";
import CollapseList from "./RecommendAndSelect/Collapse";
import MapView from "./MapView";
import SearchAndAdd from "./SearchAndAdd";
import EnterDestination from "./EnterDestination";
import { Button, message } from "antd";
import OptimizeRoute from "./RecommendAndSelect/OptimizeRoute"
import SavePath from "./RecommendAndSelect/SavePath";
import SavedRecords from "./SavedRecords";
import LogIn from "./LogIn";
import LogOut from "./LogOut";
import Register from "./Register";
import FilterList from "./FilterList";




const Main = () => {


    /***  Lifted State Sourth of Truth ***/
    // 1. <EnterDestination />
    const [cityText,   setCityText]= useState("Boston"); 
    const [cityResult, setcityResult]= useState(undefined);  
    const [enterVisible, setEnterVisible] = useState(true);
    const [recomendLoading,setRecomendLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    
    // 2. <Collapse />
    const [recomendCityList, setRecomendCityList] = useState([]);

    //3. Optimize Routes
    // const [placeID, setPlaceID] = useState("ChIJj2tUC2bGwoARwqdCDE37YD0 ChIJkyPnxsO_woARXQl-tdWAFi8 ChIJzzgyJU--woARcZqceSdQ3dM ChIJdZbSPDg23YAR6yR-akC2g4E");
    const [encodedRoute, setEncodedRoute] = useState('');

    /*** -----  Lifted State Sourth of Truth  ----- ***/

    //4.Save Path

    //5.Load Plan
    const [records, setRecords] = useState([]);

    //6. Login and Logout
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUserName] = useState("000");

    // useEffect(  ()=>
    //     {
    //         console.log(cityResult);  // cityResult works
    //         console.log(`City Text: ${cityText}`);  // cityText works
    //     }

    // );
        


    /*** Func Declaration   ***/ 
    // 1. Enter Destination to Use
    const findCityLocation=() =>{

        fetch(`api/place/find-city?city=${cityText}`).then(res=>res.json()).then(
            data=>{
              if (data.statusCode===200)
              {
                // console.log(`<Main /> : ${data.body}`);
                setcityResult(data.body);
              }
            //   console.log(cityResult);
            }
          )
    }

    const changeCity=() => {    //pop out window
      setEnterVisible(true);
      console.log("open enter destination");
    }

    const closeCity=() => {   //close the window
      setEnterVisible(false);
      console.log("close enter destination")
    }


    // 2. Collapsed List
    const findRecommendCityList=() =>{

        //api/place/find-tourist-attractions?city=houston   !!! &pagetoken
        // response: got 20 arrays in data.body.results

        fetch(`api/place/find-tourist-attractions?city=${cityText}`).then(res=>res.json()).then(
            data=>{

              // As of Now, I only need { Name & photo_reference & location & place_id} shown below.

              if (data.statusCode===200)
              {  
                // setRecomendCityList( data.body.results.map( (cityInfo)=>{
                //     let {location, name, photo_reference,place_id} =cityInfo;     // destructing
                //     let newElement = {location, name, photo_reference,place_id};  // concate the summary info
                // }



                setRecomendCityList( data.body.results);
                
                // setRecomendCityList( data.body.results.map( (cityInfo)=>{
                    
                //     let {location, name, photo_reference,place_id} =cityInfo;     // destructing
                //     let newElement = {location, name, photo_reference,place_id};  // concate the summary info

                //     console.log("new Element City Recommended");
                //     console.log(JSON.stringify(newElement));  // works
                    
                //     return{
                //         ...cityInfo
                //     }
                
                // }));
              }

            //   console.log("=== here comes recommendation list ===")
            //   console.log(recomendCityList);  //empty
            }
          )
    }

    //3. Optimize Routes
    // console.log("placeID is here" + placeID);
    const findOptimizeRoutes=(placeID) =>{
      fetch(`api/direction/get-route?places=${placeID}&optimize=true`).then(res=>res.json()).then(
          data=>{
            if (data.statusCode===0) {
              setEncodedRoute(data.body.overviewPolyline.points);
            }
            // console.log("this is encoded route: " + data.statusCode);
            // console.log("this is url: " + "api/direction/get-route?places=" + placeID + "&optimize=true");
          })
    }


    //4. save path
    let today = new Date().toDateString().replace(/\s/g , "-");
    let seconds = Math.floor(Date.now() / 1000);
    let planID = seconds;
    let planName = "My-" + cityText + "-plan-" + today;
    // console.log("today " + planName);
    const planInfo = {
        "userID": username,
        "plan_id": planID,
        "planName": planName,
        "cityName": cityText,
        "placesListString": encodedRoute,
        "placesList":[]
    };
    // console.log("today " + JSON.stringify(planInfo));
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin', 
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(planInfo)
    }
    const savePlan = () => {
      fetch('api/save/savePlans', requestOptions)
        .then(res => res.json())
        .then(
          data => console.log(data),
          // console.log("today " + JSON.stringify(planInfo)),
          // console.log("today2"  + username)
        )
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    //5. load all plans - Saved Records
    const loadAllPlans = () => {
      fetch(`api/save/loadPlansByUserID?userID=${username}`).then(res=>res.json()).then(
        data=>{
          if (data.statusCode===200) {
            setRecords(data.body);
            console.log(data.body);
          }
        })
    }

     //6. Login and Logout
    const showLogout = () =>{
      setIsLogin(true);
    }

    const showLogin = () =>{
      setIsLogin(false);
    }
    
    const getLogin = (values) => {
      console.log("username" + values)
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify(values);
      setUserName(values.user_id);
      // console.log("today3"  + values.user_id)
      // console.log("raw" + raw)

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      console.log(values)
      fetch(`api/user/login`,requestOptions)
      .then(res=>res.json()).then(
        data=>{
          if (data.statusCode===200)
          {
            showLogout();
            message.success('Login success');
            // console.log(`<Main /> : ${data.body}`);
          }
          else {
            message.error('Login error');
          }
        //   console.log(cityResult);
        }
      )
    }

    //Register
    const postRegister = (values) => {
      const {username, password} = values;
      const updateValues = {
        "user_id":username,
        "password":password
      };
      console.log(updateValues);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify(updateValues);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      console.log(updateValues)
      fetch(`api/user/registration`,requestOptions)
      .then(res=>res.json()).then(
        data=>{
          if (data.statusCode===200)
          {
            message.success('Successfully Registered');
            // console.log(`<Main /> : ${data.body}`);
          }
          else {
            message.error('Registration error');
          }
        //   console.log(cityResult);
        }
      )
    }

    return (

        
        <div>
            <SearchAndAdd
                    selected = {selected}
                    updateSelected = {setSelected}
            />
            <EnterDestination 
                     findCityLocation={findCityLocation} 
                     setCityText={setCityText} 
                     findRecommendCityList={findRecommendCityList}
                     enterVisible={enterVisible}
                     closeCity={closeCity}
                     recomendLoading = {recomendLoading}
            /> 

            <FilterList 
            recomendCityList = {recomendCityList}
            updateRecomendCityList = {setRecomendCityList}
            />
            
            <CollapseList 
                    style={{position:"fixed" } }
                    recomendCityList={recomendCityList}
            />

            {/* <Button type="primary" onClick={loadAllPlans}>
              Load All Plans
            </Button> */}

            <MapView style={{position: "absolute"}} 
                cityResult={cityResult}
                recomendCityList={recomendCityList}
                encodedRoute={encodedRoute}
            />

            {isLogin?
                <span>
                  <LogOut showLogin = {showLogin} />
                  <Button type="link" onClick={savePlan}>
                    Save Plan
                  </Button>
                  <SavedRecords
                      loadAllPlans={loadAllPlans}
                      records={records}
                      findCityLocation={findCityLocation}
                      setCityText = {setCityText}
                  />
                </span>
                :
                <span>
                  <LogIn showLogout = {showLogout} getLogin = {getLogin} postRegister = {postRegister}/>
                </span>
            } 

            <Button type="link" onClick={changeCity}>
                Change City
            </Button>

            <OptimizeRoute
                recomendCityList={recomendCityList}
                findOptimizeRoutes={findOptimizeRoutes}
            />


        </div> 

        
    );
}

export default Main;



// *** City Info ***//
//
//     "business_status": "OPERATIONAL",
//     "formatted_address": "2800 Post Oak Blvd, Houston, TX 77056, United States",
//     "location": {
//       "lat": 29.736342,
//       "lng": -95.461322
//     },
//     "name": "Gerald D. Hines Waterwall Park",
//     "opening_hours": [
//       "Monday: 8:00 AM – 9:00 PM",
//       "Tuesday: 8:00 AM – 9:00 PM",
//       "Wednesday: 8:00 AM – 9:00 PM",
//       "Thursday: 8:00 AM – 9:00 PM",
//       "Friday: 8:00 AM – 9:00 PM",
//       "Saturday: 8:00 AM – 9:00 PM",
//       "Sunday: 8:00 AM – 9:00 PM"
//     ],
//     "photo_reference": "CmRaAAAA9bykg6DmZHES49dwOO_pqQpODrkKREm9hDOHpHqMGvxGC8al77xZrHgTUJ0o_0vntt_tEhnEQp0ooLUqEOBTft_FRb8SSzt_lbkZ6sRYuNUpexNwsbjHhurwzO_bT6exEhAg0Hial0bqSCxhaCZBg0gvGhT5p5tWoQ6l_TNME3u1xUkFVe5ajA",
//     "place_id": "ChIJpTwf6G3BQIYRyZpTrmALPvQ",
//     "rating": 4.7,
//     "user_ratings_total": 3824
//   },
