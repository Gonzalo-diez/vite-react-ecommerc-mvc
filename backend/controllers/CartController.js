const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const BoughtProduct = require("../models/boughtProduct");
const SoldProduct = require("../models/soldProduct");

const CartController = {
    purchase: async (req, res) => {
        const { productId, country, state, city, street, phone, card_bank, security_number, userId } = req.body;

        try {
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            if (product.stock === 0) {
                return res.status(400).json({ error: "Producto agotado" });
            }

            const user = await User.findById(userId).exec();

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            product.stock -= 1;
            await product.save();

            const cart = new Cart({
                user: userId, 
                Products: [{ Product: productId, stock: 1 }],
                country,
                state,
                city,
                street,
                phone,
                card_bank,
                security_number,
                total: product.price,
            });

            await cart.save();

            const boughtProduct = new BoughtProduct({
                user: userId,
                product: productId,
                title: product.title,
                quantity: 1,
                price: product.price,
            });

            await boughtProduct.save();

            const soldProduct = await SoldProduct.findOne({ user: userId, product: productId }).exec();

            if (soldProduct) {
                soldProduct.status = "vendido";
                await soldProduct.save();
            }

            return res.json({ message: "Compra exitosa, stock actualizado", Product: product });
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
};

module.exports = CartController;