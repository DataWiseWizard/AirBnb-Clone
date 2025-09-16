const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config({ path: '../.env' });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});

const MONGO_URL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    for (let listing of initData.data) {
        let response = await geocodingClient
            .forwardGeocode({
                query: `${listing.location}, ${listing.country}`,
                limit: 1,
            })
            .send();
        if (response.body.features[0]) {
            listing.geometry = response.body.features[0].geometry;
        } else {
            console.log(`Location not found for: ${listing.location}, ${listing.country}`);
            listing.geometry = { type: 'Point', coordinates: [0, 0] }; 
        }
    }

    const listingsWithOwner = initData.data.map((obj) => ({...obj, owner: "674df3a6278303095717befd"}));
    await Listing.insertMany(listingsWithOwner);
    console.log("data was initialized");
}

initDB();
