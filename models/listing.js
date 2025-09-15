const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Keep for post middleware

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: { // Adopt remote's image object structure
        url: String,
        filename: String,
        default: {
            url: "https://images.unsplash.com/photo-1726715245558-69afa5ded798?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            filename: "listingimage" // A generic filename for default
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: { // Keep geometry field for Mapbox
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    // category: { // Keep commented out for now
    //     type: String,
    //     enum: ["mountains", "arctic", "farms", "deserts"],
    // }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
