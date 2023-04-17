import {Request,Response} from "express"
import { prisma } from '../prisma/client';

export const GetAllAcess = async (req:Request,res:Response) => {
    const access = await prisma.access.findMany()
    return res.json(access)
}