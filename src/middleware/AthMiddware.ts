import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { prisma } from '../prisma/client';
 
interface DecodedToken {
    userId : string
}

export function authMiddware (permissions?:string[]) {
    return async (req: Request,res:Response,next:NextFunction) => {

        const authHead = req.headers.authorization
        if(!authHead || !authHead.startsWith("Bearer")){
            return res.status(401).json({message:"Token is Missing"})
        }
        const token = authHead.substring(7)

        try{
            const SECRET_KEY = process.env.SECRET_KEY_API
            if(!SECRET_KEY){
                throw new Error("API KEY Missing")
            }

            const decodedToken = verify(token,SECRET_KEY) as DecodedToken
            
            req.user = { id: decodedToken.userId}

            if(permissions){
                const user = await prisma.user.findUnique({
                    where: {
                        id:decodedToken.userId
                    },
                    include:{
                        userAccess:{
                            select:{
                                Access:{
                                    select:{
                                        name:true
                                    }
                                }
                            }
                        }
                    }
                })

                const userPermissions = user?.userAccess.map((na)=>na.Access?.name) ?? []
                const hashPermissions = permissions.some((p) => userPermissions.includes(p))
                if(!hashPermissions) {

                    return res.status(403).json({message:"Permission Dont Accepted" })
                }
                
            }
            return next()

        }catch(error){
            return res.status(401).json({message:"Token Invalid !"})
        }
    }
}