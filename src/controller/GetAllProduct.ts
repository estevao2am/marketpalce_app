import {Request,Response} from "express"
import { prisma } from '../prisma/client';

export const GetAllProduct = async (req:Request,res:Response) => {
    const product = await prisma.product.findMany({
        select:{
            id:true,
            name:true,
            price:true,
            amount:true,
            Store:{
                select:{
                    name:true,
                    User:{
                        select:{
                            id:true,
                            name:true
                        }
                    }
                }
            }
            
        }
    })
    return res.json(product)
}