import { Router } from 'express';
import fs from 'fs';


const router = Router();
const pathProducts = 'src/files/products.json';
const pathCarts = 'src/files/carts.json';

router.get('/', async (req, res) => {
  try {
		const data = await fs.promises.readFile(pathCarts, 'utf-8');
		const carts = JSON.parse(data);
    res.send(carts);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ error: 'error' });
	}
});

router.get('/:cid', async(req, res) => {
  
});


router.post("/", async (req, res) => {
  
});

router.post("/:cid/product/:pid", async(req, res) => {
  
});



















export default router;