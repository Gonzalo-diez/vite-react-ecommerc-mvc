const Product = require("../models/product");
const Shop = require("../models/shop");
const User = require("../models/user");

const ShopController = {
    purchase: async (req, res) => {
        const { productId, country, state, city, street, phone, card_bank, security_number } = req.body;

        try {
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            if (product.stock === 0) {
                return res.status(400).json({ error: "Producto agotado" });
            }

            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            product.stock -= 1;
            await product.save();

            const shop = new Shop({
                user: user._id, 
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

            await shop.save();

            return res.json({ message: "Compra exitosa, stock actualizado", Product: product });
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    obtainPurchaseByUser: async (req, res) => {
        const userId = req.user._id;

        try {
            const shops = await Shop.find({ user: userId }).populate('Products.Product').exec();
            return res.json(shops);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
};

module.exports = ShopController;