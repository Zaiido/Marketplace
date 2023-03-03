import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
    name: {
        in: ["body"],
        isString: {
            errorMessage: "Name is a mandatory field and needs to be a string!",
        },
        notEmpty: {
            errorMessage: "Name field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: "Description is a mandatory field and needs to be a string!",
        },
        notEmpty: {
            errorMessage: "Description field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
    brand: {
        in: ["body"],
        isString: {
            errorMessage: "Brand is a mandatory field and needs to be a string!",
        },
        notEmpty: {
            errorMessage: "Brand field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
    price: {
        in: ["body"],
        isNumeric: {
            errorMessage: "Price is a mandatory field and needs to be a number!",
        },
        notEmpty: {
            errorMessage: "Price field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
    category: {
        in: ["body"],
        isString: {
            errorMessage: "Category is a mandatory field and needs to be a string!",
        },
        notEmpty: {
            errorMessage: "Category field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
};


export const checkProductSchema = checkSchema(productSchema)



const reviewSchema = {
    comment: {
        in: ["body"],
        isString: {
            errorMessage: "Comment is a mandatory field and needs to be a string!",
        },
        notEmpty: {
            errorMessage: "Comment field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
    productId: {
        in: ["body"],
        isString: {
            errorMessage: "Product ID is a mandatory field and needs to be a string!",
        },
        notEmpty: {
            errorMessage: "Product ID field cannot be empty!",
            options: { ignore_whitespace: true },
        },
    },
    rate: {
        in: ["body"],
        isInt: {
            options: {
                min: 1,
                max: 5,
            },
            errorMessage: "Rate is a mandatory field and needs to be a number between 1 and 5!",
        },
    },
};

export const checkReviewSchema = checkSchema(reviewSchema)

export const generateBadRequest = (request, response, next) => {
    const errors = validationResult(request)
    if (errors.isEmpty()) {
        next()
    } else {
        next(createHttpError(400, "Errors during validation", { errorsList: errors.array() }))
    }
}

