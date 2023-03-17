import Express from 'express'
import createHttpError from 'http-errors'
import { ProductsModel, ReviewsModel } from "./model.js"

const productsRouter = Express.Router()

productsRouter.get("/", async (request, response, next) => {
    try {
        const products = await ProductsModel.find()
        response.send(products)

    } catch (error) {
        next(error)
    }
})


productsRouter.post("/", async (request, response, next) => {
    try {
        const newProduct = new ProductsModel(request.body)
        const { _id } = await newProduct.save()
        response.status(201).send({ _id })

    } catch (error) {
        next(error)
    }
})



productsRouter.get("/:productId", async (request, response, next) => {
    try {
        const foundProduct = await ProductsModel.findById(request.params.productId)
        if (!foundProduct) return next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        response.send(foundProduct)
    } catch (error) {
        next(error)
    }
})


productsRouter.put("/:productId", async (request, response, next) => {
    try {
        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            request.params.productId,
            request.body,
            { new: true, runValidators: true }
        )
        if (!updatedProduct) return next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        response.send(updatedProduct)
    } catch (error) {
        next(error)
    }
})


productsRouter.delete("/:productId", async (request, response, next) => {
    try {
        const deletedProduct = await ProductsModel.findByIdAndDelete(request.params.productId)
        if (!deletedProduct) return next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        response.status(204).send()
    } catch (error) {
        next(error)
    }
})


productsRouter.post("/:productId/reviews", async (request, response, next) => {
    try {
        const newReview = new ReviewsModel(request.body)
        const { _id } = await newReview.save()
        await ProductsModel.findByIdAndUpdate(
            request.params.productId,
            { $push: { reviews: _id } },
            { new: true, runValidators: true })
        response.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})


productsRouter.get("/:productId/reviews", async (request, response, next) => {
    try {
        const foundProduct = await ProductsModel.findById(request.params.productId).populate("reviews")
        if (!foundProduct) return next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))

        const { reviews } = foundProduct

        response.send({ reviews })
    } catch (error) {
        next(error)
    }
})


productsRouter.get("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const foundProduct = await ProductsModel.findById(request.params.productId).populate("reviews")
        if (!foundProduct) return next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))

        const foundReview = foundProduct.reviews.find(review => review._id.toString() === request.params.reviewId)
        if (!foundReview) return next(createHttpError(404, { message: `Review with id ${request.params.reviewId} does not exist!` }))

        response.send(foundReview)
    } catch (error) {
        next(error)
    }
})


productsRouter.put("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const updatedReview = await ReviewsModel.findByIdAndUpdate(
            request.params.reviewId,
            request.body,
            { new: true, runValidators: true }
        );

        if (!updatedReview) return next(createHttpError(404, `Review with id ${request.params.reviewId} not found`));

        const foundProduct = await ProductsModel.findById(request.params.productId).populate("reviews")
        if (!foundProduct) return next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))

        response.send(foundProduct)

    } catch (error) {
        next(error)
    }
})


productsRouter.delete("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const deletedReview = await ReviewsModel.findByIdAndDelete(request.params.reviewId)
        if (!deletedReview) return next(404, `Review with id ${request.params.reviewId} does not exist!`)

        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            request.params.productId,
            { $pull: { reviews: request.params.reviewId } },
            { new: true, runValidators: true })

        if (!updatedProduct) return next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))

        response.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default productsRouter