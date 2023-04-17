import {Response,Request} from "express"
import {prisma} from "../prisma/client"
export const GetAllStore = async (req:Request,res:Response) =>{
    
    const stores = await prisma.store.findMany({
        select: {
            id:true,
            name:true,
            User :{
                select:{
                    name:true
                }
            }
        }
    })
    return res.json(stores)
}