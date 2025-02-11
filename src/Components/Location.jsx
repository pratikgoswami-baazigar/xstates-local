import { useState, useEffect } from "react";
import axios from "axios";

const Location = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [info, setInfo] = useState({ co: "", st: "", ci: "" });
    const [error, setError] = useState(""); // Error state

    // Utility function to fetch and clean data
    const fetchData = async (url, setter) => {
        try {
            const response = await axios.get(url);
            const uniqueData = [...new Set(response.data.map(item => item.trim()))];
            setter(uniqueData);
            setError(""); // Reset error on success
        } catch (error) {
            setError(`Error fetching data: ${error.message || error}`);
            setter([]); // Reset state on failure
        }
    };

    useEffect(() => {
        fetchData("https://crio-location-selector.onrender.com/countries", setCountries);
    }, []);

    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setInfo({ co: selectedCountry, st: "", ci: "" }); // Reset state & city
        fetchData(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`, setStates);
        setCities([]); // Reset city options
    };

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setInfo(prev => ({ ...prev, st: selectedState, ci: "" })); // Reset city
        fetchData(`https://crio-location-selector.onrender.com/country=${info.co}/state=${selectedState}/cities`, setCities);
    };

    const handleCityChange = (e) => {
        setInfo(prev => ({ ...prev, ci: e.target.value }));
    };

    return (
        <>
            <h1>Select Location</h1>

            {/* Country Dropdown */}
            <select onChange={handleCountryChange} disabled={!countries.length}>
                <option>Select Country</option>
                {countries.map((country, index) => (
                    <option key={index}>{country}</option>
                ))}
            </select>

            {/* State Dropdown */}
            <select onChange={handleStateChange} disabled={!info.co || !states.length}>
                <option>Select State</option>
                {states.map((state, index) => (
                    <option key={index}>{state}</option>
                ))}
            </select>

            {/* City Dropdown */}
            <select onChange={handleCityChange} disabled={!info.st || !cities.length}>
                <option>Select City</option>
                {cities.map((city, index) => (
                    <option key={index}>{city}</option>
                ))}
            </select>

            {/* Display Selected Location */}
            {info.ci && info.st && info.co && <h1>You selected {info.ci}, {info.st}, {info.co}</h1>}

            {/* Display API Errors if any */}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </>
    );
};

export default Location;
