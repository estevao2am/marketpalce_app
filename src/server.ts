import express from "express"
const app = express()
import { router } from "./routes"
app.use(express.json())
app.use(router)

app.listen(1700,()=> console.log("Server is Running"))

