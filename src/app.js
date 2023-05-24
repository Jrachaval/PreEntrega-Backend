import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';


const app = express ();

app.use(express.json()); //leer
app.use(express.urlencoded({extended:true})); //codificar
app.use('/api/products', productsRouter); //conectar
app.use('/api/carts', cartsRouter);


app.listen(8080, () => console.log ("Listening 8080"))