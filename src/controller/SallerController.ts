import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const createSale = async(req:Request, res:Response) => {

    const { products,userSeller} = req.body
    const {id} = req.user
    

    try{

        // Pegar todos os ids dos produtos selecionado pelo comprador
        const productsByDatabase = await prisma.product.findMany({
            where:{
                id:{in:products.map((product:any)=>product.id)}
            }
        })

    
        //  Pegar a quantidade do produto 
        const productWithQuantinty = productsByDatabase.map((product)=>{
            const {id,name,price} = product
            const quantity = products.find((p:any)=>p.id==product.id).quantity;
            return {
                id,name,price,quantity
            }
        })

        // calculando o valor de venda 

        let total = 0
        for (const product of productWithQuantinty){
            total+= product.price * parseInt(product.quantity)
        }

        // Verificar se o ID é do vendedor
        if(id == userSeller){
            return res.status(400).json({message:"Não É possivel fazer umavenda com o mesm AI"})
        }
        // Efectuar uma venda

        const venda = await prisma.sale.create({
            data:{
                total_value:total,
                sellerId:userSeller, 
                buyerId:id,// comprador é a pessoa que esta logado na app
                SaleProduct:{
                    create:productWithQuantinty.map((product)=>({
                    Product:{connect:{id:product.id}},
                    quantity:product.quantity
                    }))
                },
            },
            include:{
                SaleProduct:true
            }
        })

        // Descrementar os produtos 
        productWithQuantinty.map(async(product)=> {
            await prisma.product.updateMany({
                where:{id:product.id},
                data:{
                    amount:{
                        decrement: parseInt(product.quantity)
                    }
                }
            })
        })

        console.log(venda)
        return res.status(201).json({venda,message:"Compra realizado com sucesso"})
    } catch(error){
console.log(error)
    }
}