import mongoose from "mongoose";

const { Schema, model } = mongoose

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
}, { timestamps: true })

export const ProductsModel = model("Product", productSchema)
export const ReviewsModel = model("Review", reviewSchema)