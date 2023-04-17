import {Router} from "express"
import { CreateUser } from './controller/CreateUse';
import { CreateAccess } from './controller/CreateAccess';
import { GetAllAcess } from './controller/GetAllAccesss';
import { GetAllUser } from "./controller/GetAllUser";
import { CreateStore } from './controller/CreateStrore';
import { GetAllStore } from './controller/GetAllStore';
import { CreateProduct } from "./controller/CreatePruduct";
import { GetAllProduct } from "./controller/GetAllProduct";
import { Sign } from "./controller/SessionController";
import { authMiddware } from "./middleware/AthMiddware";
import { getOneUser } from './controller/GetOneUser';
import { createSale } from "./controller/SallerController";

export const router = Router()

router.post("/user",CreateUser)
router.post("/access",CreateAccess)
router.post("/store/",authMiddware(["Admin"]),CreateStore)
router.get("/access",GetAllAcess)
router.get("/user",authMiddware(["Admin"]),GetAllUser)
router.get("/store",GetAllStore)
router.post("/product/:storeId",CreateProduct)
router.get("/product",GetAllProduct)
router.post("/session",Sign)
router.get("/myProfile",authMiddware(["Admin"]),getOneUser)

// Sell Routes
router.post("/sell",authMiddware(["Admin","Vendedor"]),createSale)






