const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const BoughtProduct = require("../models/boughtProduct");
const SoldProduct = require("../models/soldProduct");

const CartController = {
  purchase: async (req, res) => {
    const { productId, country, state, city, street, phone, card_bank, security_number, userId, quantity } = req.body;

    try {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ error: "Cantidad solicitada superior al stock disponible" });
      }

      const user = await User.findById(userId).exec();

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      product.stock -= quantity;
      await product.save();

      // Buscar venta activa existente
      let soldProduct = await SoldProduct.findOne({
        seller: product.user, // Cambiado a 'seller' en lugar de 'user'
        product: productId,
        status: 'activo',
      });

      if (soldProduct) {
        // Verificar el status antes de actualizar
        if (soldProduct.status === 'activo') {
          // Actualizar el producto vendido existente
          soldProduct.quantity += quantity;
          soldProduct.price += quantity * product.price;
        } else {
          // Crear un nuevo SoldProduct si no está activo
          soldProduct = new SoldProduct({
            user: userId,
            seller: product.user, // Cambiado a 'seller' en lugar de 'user'
            product: productId,
            title: product.title,
            quantity: quantity,
            price: product.price * quantity,
            status: 'activo',
          });
        }
      } else {
        // Crear una nueva venta solo si no existe una activa
        soldProduct = new SoldProduct({
          user: userId,
          seller: product.user, // Cambiado a 'seller' en lugar de 'user'
          product: productId,
          title: product.title,
          quantity: quantity,
          price: product.price * quantity,
          status: 'activo',
        });
      }

      await soldProduct.save();

      const cart = new Cart({
        user: userId,
        product: productId,
        quantity: quantity,
        country,
        state,
        city,
        street,
        phone,
        card_bank,
        security_number,
        total: product.price * quantity,
      });

      await cart.save();

      const boughtProduct = new BoughtProduct({
        user: userId,
        product: productId,
        title: product.title,
        quantity: quantity,
        price: product.price,
        completed: true,
      });

      await boughtProduct.save();

      return res.json({ message: "Compra exitosa, stock actualizado", Product: product });
    } catch (err) {
      return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
  },
};

module.exports = CartController;