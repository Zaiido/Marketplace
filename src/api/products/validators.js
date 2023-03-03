import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
    name: {
        in: ["body"],
        isString: {
            errorMessage: "Name is a mandatory field and needs to be a string!",
        },
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: "Description is a mandatory field and needs to be a string!",
        },
    },
    brand: {
        in: ["body"],
        isString: {
            errorMessage: "Brand is a mandatory field and needs to be a string!",
        },
    },
    price: {
        in: ["body"],
        isNumeric: {
            errorMessage: "Price is a mandatory field and needs to be a number!",
        },
    },
    category: {
        in: ["body"],
        isString: {
            errorMessage: "Category is a mandatory field and needs to be a string!"
        }
    }

}

export const checkProductSchema = checkSchema(productSchema)


export const generateBadRequest = (request, response, next) => {
    const errors = validationResult(request)

    if (errors.isEmpty()) {
        next()
    } else {
        next(createHttpError(400, "Errors during post validation", { errorsList: errors.array() }))
    }
}

