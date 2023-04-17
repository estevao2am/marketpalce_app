import {Request,Response} from "express"
import {prisma} from "../prisma/client"

export const CreateAccess = async (req:Request,res:Response) => {
    const {name} = req.body;

    const access = await prisma.access.create({
        data: { name}
    })
    return res.json(access)
}