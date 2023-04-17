import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export const CreateUser = async (req: Request, res: Response) => {
  const { name, email, password, accessName } = req.body;

  // Verify if user already exists
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExists) {
    return res.status(400).json({ Error: "User Already Exists" });
  }

  // Verify if access curryctly already exists

  const AccessExists = await prisma.access.findUnique({
    where: {
      name:accessName,
    },
  });

  if (!AccessExists) {
    return res.status(400).json({ Error: "Access Does Not Exist" });
  }

  const hashPassword = await hash(password, 8);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,userAccess:{
        create:{
          Access:{
            connect:{
              name:accessName
            }
          }
        }
      }
      
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
      }
    }
   
  });
  return res.json(user);
};
