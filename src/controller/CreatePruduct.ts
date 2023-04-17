import {Request,Response} from "express"
import {prisma} from "../prisma/client"


export const CreateProduct = async(req:Request,res:Response) => {
    const {name,price,amount} = req.body
    const {storeId} = req.params


    const product = await prisma.product.create({
        data :{
            name,price,amount,
            Store : {
                connect:{
                    id:storeId
                }
            }
        }
    })
    return res.json(product)
}