import Express from 'express'
import { getProducts, getReviews, saveProductImage, writeProducts, writeReviews } from '../../lib/fs-tools.js'
import { checkProductSchema, checkReviewSchema, generateBadRequest } from './validators.js'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'
import multer from 'multer'
import { extname } from 'path'

const productsRouter = Express.Router()

productsRouter.get("/", async (request, response, next) => {
    try {
        const products = await getProducts()
        if (request.query && request.query.category) {
            const productsPerCategory = products.filter(product => product.category === request.query.category)
            response.send(productsPerCategory)
        } else {
            response.send(products)
        }
    } catch (error) {

    }
})
productsRouter.post("/", checkProductSchema, generateBadRequest, async (request, response, next) => {
    try {
        const newProduct = { _id: uniqid(), ...request.body, createdAt: new Date(), updatedAt: new Date() }

        const products = await getProducts()
        products.push(newProduct)
        await writeProducts(products)

        response.status(201).send({ _id: newProduct._id })

    } catch (error) {
        next(error)
    }
})



productsRouter.get("/:productId", async (request, response, next) => {
    try {
        const products = await getProducts()
        const foundProduct = products.find(product => product._id === request.params.productId)
        if (foundProduct) {
            response.send(foundProduct)
        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }
    } catch (error) {
        next(error)
    }
})


productsRouter.put("/:productId", async (request, response, next) => {
    try {
        const products = await getProducts()
        const index = products.findIndex(product => product._id === request.params.productId)
        if (index !== -1) {
            const oldProduct = products[index]
            const updatedProduct = { ...oldProduct, ...request.body, updatedAt: new Date() }
            products[index] = updatedProduct

            await writeProducts(products)

            response.send(updatedProduct)

        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }

    } catch (error) {
        next(error)
    }
})


productsRouter.delete("/:productId", async (request, response, next) => {
    try {
        const products = await getProducts()
        const filteredProducts = products.filter(product => product._id !== request.params.productId)

        if (products.length !== filteredProducts.length) {
            await writeProducts(filteredProducts)
            response.status(204).send()
        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }
    } catch (error) {
        next(error)
    }
})


productsRouter.post("/:productId/upload", multer().single("product"), async (request, response, next) => {
    try {
        if (request.file) {
            const fileExtension = extname(request.file.originalname)
            const fileName = request.params.productId + fileExtension
            await saveProductImage(fileName, request.file.buffer)

            const products = await getProducts()
            const index = products.findIndex(product => product._id === request.params.productId)
            if (index !== -1) {
                const oldProduct = products[index]
                const updatedProduct = { ...oldProduct, imageUrl: `http://localhost:3000/images/products/${fileName}` }
                products[index] = updatedProduct

                await writeProducts(products)
                response.send({ message: "Image uploaded" })
            } else {
                next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
            }
        }
        else {
            next(createHttpError(400, { message: `Upload an image!` }))
        }

    } catch (error) {
        next(error)
    }
})


productsRouter.post("/:productId/reviews", checkReviewSchema, generateBadRequest, async (request, response, next) => {
    try {
        const newReview = { _id: uniqid(), ...request.body, productId: request.params.productId, createdAt: new Date(), updatedAt: new Date() }
        const reviews = await getReviews()

        reviews.push(newReview)

        await writeReviews(reviews)

        response.status(201).send({ _id: newReview._id })


    } catch (error) {
        next(error)
    }
})


productsRouter.get("/:productId/reviews", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validProductId = reviews.some(review => review.productId === request.params.productId)
        if (validProductId) {
            const productReviews = reviews.filter(review => review.productId === request.params.productId)
            response.send(productReviews)
        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }
    } catch (error) {
        next(error)
    }
})


productsRouter.get("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validProductId = reviews.some(review => review.productId === request.params.productId)
        if (validProductId) {
            const foundReview = reviews.find(review => review._id === request.params.reviewId && review.productId === request.params.productId)
            if (foundReview) {
                response.send(foundReview)
            } else {
                next(createHttpError(404, { message: `Review with id ${request.params.reviewId} does not exist!` }))
            }
        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }

    } catch (error) {
        next(error)
    }
})


productsRouter.put("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validProductId = reviews.some(review => review.productId === request.params.productId)
        if (validProductId) {
            const index = reviews.findIndex(review => review._id === request.params.reviewId && review.productId === request.params.productId)
            if (index !== -1) {
                const oldReview = reviews[index]
                const updatedReview = { ...oldReview, ...request.body, updatedAt: new Date() }
                reviews[index] = updatedReview

                await writeReviews(reviews)

                response.send(updatedReview)
            } else {
                next(createHttpError(404, { message: `Review with id ${request.params.reviewId} does not exist!` }))

            }

        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }

    } catch (error) {
        next(error)
    }
})


productsRouter.delete("/:productId/reviews/:reviewId", async (request, response, next) => {
    try {
        const reviews = await getReviews()
        const validProductId = reviews.some(review => review.productId === request.params.productId)
        if (validProductId) {
            const filteredReviews = reviews.filter(review => review._id !== request.params.reviewId)

            if (reviews.length !== filteredReviews.length) {
                await writeReviews(filteredReviews)
                response.status(204).send()
            } else {
                next(createHttpError(404, { message: `Review with id ${request.params.reviewId} does not exist!` }))
            }

        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }

    } catch (error) {
        next(error)
    }
})

export default productsRouter