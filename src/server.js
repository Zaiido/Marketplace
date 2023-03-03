import Express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import { badRequestHandler, generalErrorHandler, notfoundHandler } from "./errorHandlers.js";


const server = Express()
const port = 3000

server.use(Express.json())
server.use("/products", productsRouter)

server.use(badRequestHandler)
server.use(notfoundHandler)
server.use(generalErrorHandler)

server.listen(port, () => {
    console.log("Server running in port: " + port)
    console.table(listEndpoints(server))
})