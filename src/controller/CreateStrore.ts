import {Request,Response} from "express"
import {prisma} from "../prisma/client"


export const CreateStore = async(req:Request,res:Response) => {
    const {name,email} = req.body
    const {id} = req.user

    const UserId = await prisma.user.findUnique({
        where:{
            id
        }
    })

    if(!UserId) {
        return res.status(400).json({Error:"User Does not Exist"})
    }

    const NameAlreadyExists = await prisma.store.findUnique({
        where:{
            name
        }
    })

    if(NameAlreadyExists) {
        return res.status(400).json({Error:"Alredy Exists a Store Name"})
    }

    const store = await prisma.store.create({
        data :{
            name,email,
            User : {
                connect:{
                    id
                }
            }
        }
    })
    return res.json(store)
}