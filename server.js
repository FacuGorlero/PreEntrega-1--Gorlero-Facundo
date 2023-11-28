const express = require("express");
const ProductManager = require("./src/Manager/ProductManager.js");
const { productosrouter} = require("./src/routes/products.route.js");
const { cartsRouter } = require ("./src/routes/cart.route.js");


const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productosrouter)
app.use('/api/carts/', cartsRouter)
app.use(( err, req, res, next)=>{
  console.error(err.stack)
  res.status(500).send('Error de server')
})

app.listen(port, () => {
    console.log(`Server andando en port ${port}`);
  });