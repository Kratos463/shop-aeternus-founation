import React, { useState, useEffect } from "react";
import Context from "./index";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { getConfig } from "../utils";


const CartProvider = (props) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemsQuantity: 0 });
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState("InStock");

  useEffect(() => {

    if (user) {

      displayCartProduct();
    }
  }, [user]);


  const getcartProductById = async (productId) => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/v1/cart/get-cart-itemByid/${productId}`, getConfig());

      const ProductinCart = response.data.data.productInCart;
      return ProductinCart;
    } catch (error) {
      console.log("Error in fetching cart product by id", error)
      return false;
    }
  }




  const displayCartProduct = async () => {
    try {

      const response = await axios.get(`${process.env.API_URL}/api/v1/cart/get-cart-item`, getConfig());
      setCart(response.data.data);


    } catch (error) {
      console.error("Error fetching cart products:", error);
      toast.error("Failed to load cart products");
    }
  };

  const addToCart = async (product, colors, sizes, quantity) => {

    try {
      // Normalize product object structure


      const newCartItem = {

        productId: product.Product_id || product.productId,
        skuId: product.Sku_id || product.skuId,
        title: product.Title || product.title,
        description: product.Description || product.description,
        price: product.Price || product.price,
        image: product.Medium_file || product.image,
        sizeId: sizes.Size_id || product.sizeId || sizes,
        colorId: colors.Color_id || product.colorId || colors,
        quantity: quantity || 1,
      };



      // Update cart state with newCartItem
      setCart((prevCart) => {
        let itemExists = false;

        const updatedItems = prevCart.items.map((item) => {
          if (item.productId === newCartItem.productId && item.sizeId === newCartItem.sizeId && item.colorId === newCartItem.colorId) {
            itemExists = true;
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });

        if (!itemExists) {
          updatedItems.push(newCartItem);
        }

        return {
          ...prevCart,
          items: updatedItems,
          total: prevCart.total + newCartItem.price * quantity,
          itemsQuantity: prevCart.itemsQuantity + quantity,
        };
      });



      // Make API call to add item to cart
      const response = await axios.post(`${process.env.API_URL}/api/v1/cart/add-cart-item`, newCartItem, getConfig());


      if (response.data.success) {
        toast.success("Product added to cart");
        displayCartProduct();
        return "Product successfully added to cart"
      } else {
        toast.error("Failed to add product to cart");
        return "failed to add product to cart"
      }


    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };





  const removeFromCart = async (item) => {
    try {

      const originalCart = { ...cart };
      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter((cartItem) => cartItem.productId !== item.productId);
        const updatedTotal = prevCart.total - item.price * item.quantity;
        const updatedItemsQuantity = prevCart.itemsQuantity - item.quantity;
        return { ...prevCart, items: updatedItems, total: updatedTotal, itemsQuantity: updatedItemsQuantity };
      });

      const response = await axios.delete(`${process.env.API_URL}/api/v1/cart/remove-cart-item/${item.productId}`, getConfig());

      if (response.data.success) {
        toast.success("Product removed from cart");
        displayCartProduct();
      } else {

        setCart(originalCart);
        toast.error("Failed to remove product from cart");
      }
    } catch (error) {

      setCart((prevCart) => ({
        ...prevCart,
        items: [...originalCart.items],
        total: originalCart.total,
        itemsQuantity: originalCart.itemsQuantity,
      }));
      console.error("Error removing product from cart:", error);
      toast.error("Failed to remove product from cart");
    }
  };

  const updateQty = async (item, quantity) => {
    try {

      const originalCart = { ...cart };
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: parseInt(quantity) }
            : cartItem
        );
        const updatedTotal = updatedItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
        const updatedItemsQuantity = updatedItems.reduce((acc, cur) => acc + cur.quantity, 0);
        return { ...prevCart, items: updatedItems, total: updatedTotal, itemsQuantity: updatedItemsQuantity };
      });

      const response = await axios.patch(
        `${process.env.API_URL}/api/v1/cart/update-cart-item/${item.productId}`,
        { quantity: parseInt(quantity) },
        getConfig()
      );




      if (response.data.success) {
        toast.success("Product quantity updated");
        displayCartProduct();
      } else {

        setCart(originalCart);
        toast.error("Failed to update product quantity");
      }
    } catch (error) {

      setCart(originalCart);
      console.error("Error updating product quantity:", error);
      toast.error("Failed to update product quantity");
    }
  };

  return (
    <Context.Provider
      value={{
        cart,
        setQuantity,
        quantity,
        stock,
        addToCart,
        removeFromCart,
        updateQty,
        getcartProductById,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;
