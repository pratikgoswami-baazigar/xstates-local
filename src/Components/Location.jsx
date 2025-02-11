import { useState, useEffect } from "react";
import axios from "axios";
const Location = () => {

    const [ countries, setcountries ] = useState([]);
    const [ states, setstates ] = useState([]);
    const [ cities, setcities ] = useState([]);
    const [info,setinfo] = useState({co:"",st:"",ci:""});
    
    const fetchCountry = async() => {

       let Countries = await axios.get("https://crio-location-selector.onrender.com/countries");
       setcountries(Countries.data);
    }

    const fetchState = async (countryName) => {
        try{
        let states = await axios.get(`https://crio-location-selector.onrender.com/country=${countryName}/states`);
        setstates(states.data);
        }
        catch(e){
            console.error(`Error fetching data: ${e.message || e}`);
        }
    }

    const fetchCity = async (countryName,stateName) => {
        try {
        let cities = await axios.get(`https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`)
        setcities(cities.data);
        }catch(e){
            console.error(`Error fetching data: ${e.message || e}`);
        }

    }
    

    
    useEffect(()=>{
       fetchCountry();
    },[])

    const handleChange = (e) => {

        const selectedCountry = e.target.value;
        fetchState(selectedCountry);
        setinfo((prevState)=>{
            return {
                ...prevState,
                co : selectedCountry,
            }
        })

    }

    const handleStateChange = async (e) => {
        const selectedState = e.target.value;
         setinfo((prevState)=>{
            return {
                ...prevState,
                st : selectedState,
            }
        })
        fetchCity(info.co, selectedState)
    }

    const handleCityChange  = async (e) => {
        const selectedCity = e.target.value;
        setinfo((prevState)=> {
             return {
                ...prevState,
                ci : selectedCity,
             }
        })

        
    }

    return (
        <>
        <h1>Select Location</h1>
        <select onChange={handleChange}>
        <option>Select Country</option>
        {countries.map((country, index)=>(
                <option key={index}>{country}</option>
        ))}
        </select>
        <select onChange={handleStateChange} disabled={!info.co}>
            <option >Select State</option>
            {states.map((state, index)=> (
                    <option key={index}>{state}</option>
                ))}
        </select>
        <select onChange={handleCityChange} disabled={!info.st}>
            <option>Select City</option>
            {
                cities.map((city,index)=> (
                        <option key={index}>{city}</option>
                    ))
            }
        </select>
        {info.ci && info.st && info.co &&
          <h1>You selected {info.ci}, {info.st}, {info.co}</h1>
        }
        </>
    )
}

export default Location;