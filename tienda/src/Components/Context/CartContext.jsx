import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [hasPurchased, setHasPurchased] = useState(false);

    const addToCart = (producto) => {
        setCart([...cart, producto]);
    };

    const removeFromCart = (productId) => {
        const updatedCart = [...cart];
        const index = updatedCart.findIndex((producto) => producto._id === productId);

        if (index !== -1) {
            updatedCart.splice(index, 1);
            setCart(updatedCart);
        }
    };

    return (
        <CartContext.Provider value={{ cart, setCart, hasPurchased, setHasPurchased, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    )
}