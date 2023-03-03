import Express, { response } from 'express'
import { getProducts, writeProducts } from '../../lib/fs-tools.js'
import { checkProductSchema, generateBadRequest } from './validators.js'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'

const productsRouter = Express.Router()

productsRouter.get("/", async (request, response, next) => {
    try {
        const products = await getProducts()
        response.send(products)
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
            next(createHttpError(400, { message: `Product with id ${request.params.productId} does not exist!` }))
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
            response.status(204).send()
        } else {
            next(createHttpError(404, { message: `Product with id ${request.params.productId} does not exist!` }))
        }
    } catch (error) {
        next(error)
    }
})



export default productsRouter