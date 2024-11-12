// backend/config/googleMapsConfig.js
const { Client } = require("@googlemaps/google-maps-services-js");

const googleMapsClient = new Client({});

module.exports = googleMapsClient;
