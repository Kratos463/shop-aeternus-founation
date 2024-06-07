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
      const response = await axios.get(
        `${process.env.API_URL}/api/v1/cart/get-cart-itemByid/${productId}`,
        getConfig()
      );
      return response.data.data.productInCart;
    } catch (error) {
      console.log("Error in fetching cart product by id", error);
      return false;
    }
  };

  const displayCartProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_URL}/api/v1/cart/get-cart-item`,
        getConfig()
      );
      setCart(response.data.data);
    } catch (error) {
      console.error("Error fetching cart products:", error);
      toast.error("Failed to load cart products");
    }
  };

  const addToCart = async (product, quantity, businessVolume, colors, sizes) => {
    try {
      let calculatedBusinessVolume = businessVolume;

      if (quantity !== 0) {
        calculatedBusinessVolume *= quantity;
      }

      const newCartItem = {
        productId: product.Product_id,
        skuId: product.Sku_id,
        title: product.Title,
        image: product.Medium_file,
        sizeId: sizes.Size_id || product.sizeId || sizes,
        colorId: colors.Color_id || product.colorId || colors,
        quantity: quantity || 1,
        categoryId: product.Category_id,
        productCode: product.Product_code,
        stockQty: product.Stock_qty,
        gstPerFirst: product.Gst_per_first,
        gstPerSecond: product.Gst_per_second,
        hsnCode: product.Hsn_code,
        regularPriceSelf: product.Regular_price_self,
        priceSelf: product.Price_self,
        pointsAdjustedSelf: product.Points_adjusted_self,
        shippingChargesSelf: product.Shipping_charges_self,
        bvSelf: businessVolume.toFixed(2).toString(),
        saveUptoSelf: product.Save_upto_self,
        regularPrice: product.Regular_price,
        price: product.Price || '',
        pointsAdjusted: product.Points_adjusted,
        shippingCharges: product.Shipping_charges,
        bv: calculatedBusinessVolume.toFixed(2).toString(),
        saveUpto: product.Save_upto,
        productUrl: product.Product_url,
      };

      const response = await axios.post(
        `${process.env.API_URL}/api/v1/cart/add-cart-item`,
        newCartItem,
        getConfig()
      );

      if (response.data.success) {
        toast.success("Product added to cart");
        displayCartProduct();
        return "Product successfully added to cart";
      } else {
        toast.error("Failed to add product to cart");
        return "Failed to add product to cart";
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const removeFromCart = async (item) => {
    try {
      const response = await axios.delete(
        `${process.env.API_URL}/api/v1/cart/remove-cart-item/${item.productId}`,
        getConfig()
      );

      if (response.data.success) {
        toast.success("Product removed from cart");
        displayCartProduct();
      } else {
        toast.error("Failed to remove product from cart");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Failed to remove product from cart");
    }
  };

  const updateQty = async (item, quantity) => {
    try {
      const response = await axios.patch(
        `${process.env.API_URL}/api/v1/cart/update-cart-item/${item.productId}`,
        { quantity: parseInt(quantity) },
        getConfig()
      );

      if (response.data.success) {
        toast.success("Product quantity updated");
        displayCartProduct();
      } else {
        toast.error("Failed to update product quantity");
      }
    } catch (error) {
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
