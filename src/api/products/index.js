import Express from 'express'
import { getProducts, saveProductImage, writeProducts } from '../../lib/fs-tools.js'
import { checkProductSchema, generateBadRequest } from './validators.js'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'
import multer from 'multer'
import { extname } from 'path'

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


productsRouter.post("/:productId/upload", multer().single("product"), async (request, response, next) => {
    try {
        const fileExtension = extname(request.file.originalname)
        const fileName = request.params.productId + fileExtension
        console.log(request.file)
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


    } catch (error) {
        next(error)
    }
})


export default productsRouter