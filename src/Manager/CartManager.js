const fs = require("fs");

class CartManager {
  constructor (path) {
    this.counterId = 0;
    this.cart = [];
    this.path = path || './src/mock/Cart.json';
    this.initiator();
  }

  async initiator() {
    await this.getCarts(-1, true);
    this.getId();
  }
// Método para crear un nuevo carrito
  async create() {
    const cart = {
      id: this.counterId,
      cart: []
    }
    this.cart.push(cart);
    
    this.counterId++;
    const jsonCart = JSON.stringify(this.cart);
    await fs.promises.writeFile(this.path, jsonCart);

    return (this.counterId - 1)
  }

   // Método para obtener carritos (asincrónico)
  async getCarts( id = -1, synchronize = false) {
    let getCarts;
    const exists = fs.existsSync(this.path);
    if (!exists) {
      getCarts = [];
    } else {
      getCarts = await fs.promises.readFile(this.path, 'utf-8')
      getCarts = JSON.parse(getCarts)
    }

    // Sincroniza la variable cart con los carritos obtenidos
    if (synchronize === true) this.cart = getCarts
    if(id === -1) return getCarts

    const cart = getCarts.find((crt) => crt.id === id);
    return cart ? cart : 'Carrito no encontrado';
  }

  // Método para agregar un producto a un carrito
  async addProduct(id, productId) {
    if (!this.cart[id]) return "Carrito no encontrado"
    const i = this.cart[id].cart.findIndex((elm)=>elm.productId === productId)
    if (i === -1) {
        // Si el producto no existe en el carrito, lo agrega con una cantidad de 1
        this.cart[id].cart.push({
          productId: productId,
          quantity: 1
        })
      } else {
        // Si el producto ya existe en el carrito, incrementa la cantidad
        this.cart[id].cart[i].quantity++
      }

    const jsonCart = JSON.stringify(this.cart);
    await fs.promises.writeFile(this.path, jsonCart);

    // Retorna el carrito actualizado
    return (this.cart[id])
}

 // Método para remover un producto de un carrito
async removeProduct(id, productId){
    if(!this.cart[id]) return 'carrito no encontrado'

    const i = this.cart[id].cart.findIndex((elm)=> elm.productId === productId)

    if(i === -1){
        return 'producto no encontrado'
    }else{
         // Si la cantidad es 1, elimina el producto del carrito; de lo contrario, disminuye la cantidad
        if(this.cart[id].cart[i].quantity === 1){
            this.cart[id].cart.splice(i,1)
        } else {
            this.cart[id].cart[i].quantity--
        }
    }
// Actualiza el archivo con la lista de carritos modificada
const jsonCart = JSON.stringify(this.cart);
await fs.promises.writeFile(this.path, jsonCart);
return (this.cart[id])
}
// Método auxiliar para obtener el ID máximo existente
getId() {
    const exists = fs.existsSync(this.path);
    if (!exists) {
      this.counterId = 0
    } else {
      // Obtiene el ID máximo de los carritos para iniciar su contador
      this.counterId = this.cart.reduce((maxId, crt) => { return Math.max(maxId, crt.id) } , 0)
      this.counterId ++;
    }
  };

}

exports.CartManager = CartManager;


