const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/morningstar";

main().then(() => {
    console.log("MongoDB has started!");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '67c3d389d9e2d564c9b5daf1'}) );
    await Listing.insertMany(initData.data);
    console.log("Data has been initialized!");
};

initDB();