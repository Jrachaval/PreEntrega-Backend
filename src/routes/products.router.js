import { Router } from 'express';
import fs from 'fs';
import Joi from 'joi';



const router = Router();
const pathProducts = 'src/files/products.json';



router.get ('/', async (req,res) => {
    try {
        const data = await fs.promises.readFile(pathProducts,'utf-8');
        const products = JSON.parse(data);
        const limit =req.query.limit;
        if (limit) {
            const limitedproducts = products.slice(0,limit);
            res.send(limitedproducts);
        }else{
            res.send(products);
        } 

    }  
    catch (error){
        console.error('No se puede leer el producto');
    } 
    

});

router.get('/:pid', async (req, res) => {
	try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(data);
	
		const { pid } = req.params;
		const productById = products.find((product) => product.id == pid);
		if (productById) return res.json(productById);
		res.status(404).json({ error: "Producto no encontrado" });
	} catch (error) {
	console.error('No se puede leer el producto', error);
	}
});

const schemaForPostMethod = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    code: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.boolean().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
	thumbnails: Joi.array().items(Joi.string()),
});

router.post ('/', async (req,res)=>{
    try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(data);
        const { error, value } = schemaForPostMethod.validate(req.body);
		if (error) {
			res.status(400).json({ error: error.details[0].message });
		} else {
			const { title, description, code, price, status, stock, category, thumbnails } = value;
		
		const ids = products.map(product => product.id);
		const id = Math.max(...ids) + 1;
		const productNew = { id, title, description, code, price, status, stock, category, thumbnails };
		products.push(productNew);
		await fs.promises.writeFile(pathProducts,JSON.stringify(products,null,'\t') )
		res.status(201).json(productNew);
    }
	} catch (error) {
		console.error('error', error);
		res.status(500).json({ error: 'error al leer el archivo' });
	}
	

});

	const schemaPutMethod = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    code: Joi.string(),
    price: Joi.number(),
    status: Joi.boolean(),
    stock: Joi.number(),
    category: Joi.string(),
	thumbnails: Joi.array().items(Joi.string()),
});




router.put ("/:pid", async (req,res)=>{
	try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		let products = JSON.parse(data);
	
		const { pid } = req.params;
		const productUpdated = products.find((product) => product.id == pid);
		if (productUpdated) {
		const { error, value } = schemaPutMethod.validate(req.body);
		if (error) {
			res.status(400).json({ error: error.details[0].message });
		} else {
			Object.assign(productUpdated, value);
			await fs.promises.writeFile(pathProducts, JSON.stringify(products, null, '\t'));
			return res.json(productUpdated);
		}
		} else {
		res.status(404).json({ error: "Producto no encontrado" });
		}
	} catch (error) {
		console.error('error al leer el archivo', error);
		res.status(500).json({ error: 'error al leer el archivo' });
	}

        
   
});

router.delete ("/:pid", async (req,res)=>{
	try {
		const data = await fs.promises.readFile(pathProducts, 'utf-8');
		const products = JSON.parse(data);
		
		const { pid } = req.params;
		const productDeleted = products.find((product) => product.id == pid );
		if (productDeleted) {
			products.splice(products.indexOf(productDeleted), 1);
			await fs.promises.writeFile(pathProducts, JSON.stringify(products, null, '\t'));
			return res.sendStatus(204);
		}
		res.status(404).json({ error: "Producto no encontrado" });
	} catch (error) {
		console.error('error al leer el archivo', error);
		res.status(500).json({ error: 'error al leer el archivo' });
}

    
  
});

export default router;