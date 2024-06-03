import React, { useState, useEffect } from "react";
import Context from "./index";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { getConfig } from "../utils";

const WishlistProvider = (props) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (user) {
      displayWishlistProduct();
    }
  }, [user]);

  const displayWishlistProduct = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/v1/wishlist/get-wishlist-item`, getConfig());
      setWishlistItems(response.data.data.items);
    } catch (error) {
      console.error("Error while fetching wishlist products from API", error);
      toast.error("Failed to load wishlist products");
    }
  };

  const addToWishlist = async (product, colors, sizes) => {
    try {
      const newWishlistItem = {
        userId: user._id,
        productId: product.Product_id,
        skuId: product.Sku_id,
        title: product.Title,
        description: product.Description,
        price: product.Price,
        image: product.Medium_file,
        sizeId: sizes.Size_id,
        colorId: colors.Color_id,
      };
  
      // Check if the product is already in the wishlist
      const isAlreadyInWishlist = wishlistItems.some(
        (item) => item.productId === newWishlistItem.productId
      );
  
      if (isAlreadyInWishlist) {
        toast.error("Product is already in wishlist!");
        return;
      }
  
   
      setWishlistItems((prevItems) => [...prevItems, newWishlistItem]);
  
     
      const response = await axios.post(
        `${process.env.API_URL}/api/v1/wishlist/add-wishlist-item`,
        newWishlistItem,
        getConfig()
      );
  
      if (response.data.success) {
        toast.success("Product added to wishlist successfully!");
        displayWishlistProduct();
      } else {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.productId !== newWishlistItem.productId)
        );
        toast.error("Failed to add product to wishlist");
      }
    } catch (error) {
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.productId !== newWishlistItem.productId)
      );
      console.error("Error adding product to wishlist:", error);
      toast.error("Failed to add product to wishlist");
    }
  };
  

  const removeFromWishlist = async (item) => {
    try {
      
      const originalWishlist = [...wishlistItems];
      setWishlistItems((prevItems) => prevItems.filter((wishlistItem) => wishlistItem.productId !== item.productId));

      const response = await axios.delete(`${process.env.API_URL}/api/v1/wishlist/remove-wishlist-item/${item.productId}`, getConfig());

      if (response.data.success) {
        toast.success("Product removed from wishlist successfully!");
        displayWishlistProduct();
      } else {
        
        setWishlistItems(originalWishlist);
        toast.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      
      setWishlistItems((prevItems) => [...originalWishlist]);
      console.error("Error removing product from wishlist:", error);
      toast.error("Failed to remove product from wishlist");
    }
  };

  return (
    <Context.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default WishlistProvider;
