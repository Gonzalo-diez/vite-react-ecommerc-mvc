const User = require('../models/user');
const BoughtProduct = require('../models/BoughtProduct');

const BoughtProductController = {
  getBoughtProducts: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId).exec();

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const boughtProducts = await BoughtProduct.find({ user: userId })
        .populate({
            path: 'product',
            model: 'Product',
        })
        .exec();

      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          avatar: user.avatar,
        },
        boughtProducts: boughtProducts,
      });
    } catch (err) {
      console.error('Error al obtener los productos comprados del usuario:', err);
      return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
    }
  },
};

module.exports = BoughtProductController;
