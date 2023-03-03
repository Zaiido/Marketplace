import fs from 'fs-extra'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const productsJSONPath = join(dataFolderPath, "products.json")
const productsImagesFolderPath = join(process.cwd(), "./public/images/products")

export const getProducts = () => readJSON(productsJSONPath)
export const writeProducts = (productsArray) => writeJSON(productsJSONPath, productsArray)
export const saveProductImage = (fileName, fileContent) => writeFile(join(productsImagesFolderPath, fileName), fileContent)



const reviewsJSONPath = join(dataFolderPath, "reviews.json")

export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReviews = (reviewsArray) => writeJSON(reviewsJSONPath, reviewsArray)