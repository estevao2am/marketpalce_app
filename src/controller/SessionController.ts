import { Request, Response } from "express";
import { prisma } from '../prisma/client';
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const Sign = async(req:Request,res:Response) => {
try {
    const {email,password} = req.body
    const userVerify = await prisma.user.findUnique({
        where:{
            email
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
    if(!userVerify){
        return res.status(400).json({message:"User Not Found"})
    }
    const isPasswordValid = await compare(password,userVerify.password)

    if(!isPasswordValid){
        return res.status(400).json({message:"User Or Password Invalid"})
    }

    const SECRET_KEY = process.env.SECRET_KEY_API
    if(!SECRET_KEY) {
        throw new Error("Chave Não fornecida")
    }

    const token = sign({
        userId:userVerify.id, roles: userVerify.userAccess.map(role =>role.Access?.name)
    },SECRET_KEY,{
        algorithm:"HS256",
        expiresIn:"1h"
    })
    return res.status(200).json({token})

} catch(error){
    return res.status(400).json({message:"Ocorreu Um Erro, Tente Mais Tarde"})
}
}