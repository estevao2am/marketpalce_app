import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
export const getOneUser = async(req:Request,res:Response) => {
    try {
        const {id} = req.user
        const user = await prisma.user.findUnique({
            where:{
                id
            },
            select:{
                id:true,
                name:true,
                email:true,
                userAccess:{
                    select:{
                        Access:{
                            select:{
                                name:true
                            }
                        }
                    }
                },
                store:{
                    select:{
                        id:true,
                        name:true
                        
                    }
                }
                
            }
            
        })

        if(!user){
            return res.status(204).json({message:"User Not Found"})
        }

        return res.status(200).json(user)
    }catch(error){
        return res.status(400).json({message:"Try Latter"})
    }
    
} 