const axios = require('axios');
module.exports.getCompleteSuggestions = async (input) => {
  const tokenResponse = await axios.post(`https://outpost.mappls.com/api/security/oauth/token?grant_type=${process.env.TOKEN_GRANT_TYPE}&client_id=${process.env.TOKEN_CLIENT_ID}&client_secret=${process.env.TOKEN_CLIENT_SECRET}`);

  const token = tokenResponse.data.access_token;

  try{

    const response = await axios.get(`https://atlas.mappls.com/api/places/search/json?query=${input}`, {

      headers: {
        Authorization: `Bearer ${token}`
      }
  
    });
    console.log(response.data)
    if(response.status===200){
      return response.data;
    }
  
  else{
    
    throw new Error('No Results Found');
  }

}
catch(err){
  console.error(err);
  throw err
}};


module.exports.getDistanceTime = async (origin, destination) => {

  try{
    const api = process.env.MAP_MY_INDIA_API_KEY;
    const response = await axios.get(`https://apis.mapmyindia.com/advancedmaps/v1/${api}/distance_matrix/biking/${origin};${destination}`);
    if (response.status === 200) {
      let distance = response.data.results.distances[0][1];
      let time = response.data.results.durations[0][1];
    
      // Convert distance to km if greater than 1000m
      if (distance > 1000) {
        distance = (distance / 1000).toFixed(2) + " km";
      } else {
        distance = distance + " m";
      }
    
      // Convert time to minutes and hours
      let minutes = Math.floor(time / 60);
      let seconds = Math.floor(time % 60);
    
      if (minutes > 59) {
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        time = `${hours} hr ${minutes} min`;
      } else if (minutes > 0) {
        time = `${minutes} min ${seconds} sec`;
      } else {
        time = `${seconds} sec`;
      }
    
      return { distance, time };
    }
    
  
  else{
    
    throw new Error('No Results Found');
  }

}
catch(err){
  console.error(err);
  throw err
}}