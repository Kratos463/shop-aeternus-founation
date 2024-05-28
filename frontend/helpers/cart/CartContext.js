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
      const newCartItem = {
        productId: product.Product_id,
        skuId: product.Sku_id,
        title: product.Title,
        description: product.Description,
        price: product.Price,
        image: product.Medium_file,
        sizeId: sizes.Size_id,
        colorId: colors.Color_id,
        quantity: quantity,
      };
  
      let itemExists = false;
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          if (item.productId === product.Product_id && item.sizeId === sizes.Size_id && item.colorId === colors.Color_id) {
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
          total: prevCart.total + product.Price * quantity,
          itemsQuantity: prevCart.itemsQuantity + quantity,
        };
      });
  
      const response = await axios.post(`${process.env.API_URL}/api/v1/cart/add-cart-item`, newCartItem, getConfig());
  
      if (response.data.success) {
        toast.success("Product added to cart");
        displayCartProduct();
      } else {
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) => {
            if (item.productId === product.Product_id && item.sizeId === sizes.Size_id && item.colorId === colors.Color_id) {
              return {
                ...item,
                quantity: item.quantity - quantity,
              };
            }
            return item;
          }).filter((item) => item.quantity > 0);
  
          return {
            ...prevCart,
            items: updatedItems,
            total: prevCart.total - product.Price * quantity,
            itemsQuantity: prevCart.itemsQuantity - quantity,
          };
        });
        toast.error("Failed to add product to cart");
      }
    } catch (error) {
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          if (item.productId === product.Product_id && item.sizeId === sizes.Size_id && item.colorId === colors.Color_id) {
            return {
              ...item,
              quantity: item.quantity - quantity,
            };
          }
          return item;
        }).filter((item) => item.quantity > 0);
  
        return {
          ...prevCart,
          items: updatedItems,
          total: prevCart.total - product.Price * quantity,
          itemsQuantity: prevCart.itemsQuantity - quantity,
        };
      });
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
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;
