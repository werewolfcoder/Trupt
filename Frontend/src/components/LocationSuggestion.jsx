import React from "react";

const LocationSuggestion =()=>{
    const dummyLocation = ["Location 1", "Location 2", "Location 3", "Location 4", "Location 5"];

    return(
        <div>
            <ul>
                {dummyLocation.map((location, index) => (
                    <li key={index}>{location}</li>
                ))}
            </ul>
        </div>
    )
}

export default LocationSuggestion;