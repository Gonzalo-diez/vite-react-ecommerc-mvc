const Product = require("../models/product");
const Shop = require("../models/shop");

const ShopController = {
    purchase: async (req, res) => {
        const { productId, country, state, city, street, phone, card_bank, security_number } = req.body;
        const userId = req.user._id;

        try {
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            if (product.stock === 0) {
                return res.status(400).json({ error: "Producto agotado" });
            }

            product.stock -= 1;
            await product.save();

            const shop = new Shop({
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

            await shop.save();

            req.app.io.emit("purchase", {
                message: "Nueva compra realizada",
                product: product,
                shop: shop,
            });

            return res.json({ message: "Compra exitosa, stock actualizado", Product: product });
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    obtainPurchaseByUser: async (req, res) => {
        const userId = req.user._id;

        try {
            const shops = await Shop.find({ usuario: userId }).populate('Products.Product').exec();
            return res.json(shops);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
};

module.exports = ShopController;