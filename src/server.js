import Express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import productsRouter from "./api/products/index.js";
import { badRequestHandler, generalErrorHandler, notfoundHandler } from "./errorHandlers.js";


const server = Express()
const port = 3001

server.use(Express.json())
server.use("/products", productsRouter)

server.use(badRequestHandler)
server.use(notfoundHandler)
server.use(generalErrorHandler)


mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected!")
    server.listen(port, () => {
        console.log("Server running in port: " + port)
        console.table(listEndpoints(server))
    })
})

