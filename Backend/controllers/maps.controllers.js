const mapService = require('../services/maps.services');
const {validationResult} = require('express-validator');


module.exports.getCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

   const {input} = req.query;
   try{
    const suggestions = await mapService.getCompleteSuggestions(input);
    res.status(200).json(suggestions);
   }catch(error){
    res.status(400).json({message:'Location not found'});
   }
}


module.exports.getDistanceTime = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {origin, destination} = req.query;
    try{
        const data = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(data);
    }catch(error){
        res.status(400).json({message:'No routes found'});
    }
}