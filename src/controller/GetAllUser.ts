import {Request,Response} from "express"
import { prisma } from '../prisma/client';

export const GetAllUser = async (req:Request,res:Response) => {
    const user = await prisma.user.findMany({
        select: {
            id:true,
            name:true,
            email:true,
            userAccess:{
                select:{
                    Access: {
                        
                        select:{ 
                            id:true,
                            name:true,

                        }
                    }
                }
            }
        }
    })
    return res.json(user)
}