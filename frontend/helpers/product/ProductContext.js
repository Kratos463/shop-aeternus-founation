import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'querystring';
import { useRouter } from 'next/router';
import { getConfig } from '../utils';
import {parse} from 'flatted'

// Create context
const ProductsContext = createContext();

// Create provider component
const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [categoryProduct, setCategoryProduct] = useState([])
    const [productReviews, setProductReviews] = useState([])

    const router = useRouter();
    const { query } = router;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
    
                // Filter out empty query parameters
                const filteredQuery = Object.fromEntries(
                    Object.entries(query).filter(([key, value]) => value !== 'brand=&color=&size=&minPrice=500&maxPrice=10000')
                );
    
                // Create the search query string from filtered query parameters
                const searchQuery = queryString.stringify(filteredQuery);
    
                // Check if the search query is empty or only contains default values
                const isSearchQueryEmpty = searchQuery === '' || (searchQuery === 'brand=&color=&size=&minPrice=500&maxPrice=10000');
    
                if (!isSearchQueryEmpty) {
                    // Fetch data with the search query if it exists
                    const response = await axios.get(`/api/getProductList?${searchQuery}`);
    
                    // Handle the API response
                    if (response.data.Records && Array.isArray(response.data.Records) && response.data.Records.length > 0) {
                        setProducts(response.data.Records);

                    } else {
                        setProducts([]);
                        
                    }
                } else if (Object.keys(filteredQuery).length === 0) {
                    // Fetch all products only if the query object is empty (no search query)
                    const response = await axios.get('/api/getProductList');
                    console.log("response from the productcontext",response)
                    if (response.data.Records) {
                        setProducts(Array.isArray(response.data.Records) ? response.data.Records : [response.data.Records]);
                    } else {
                        setProducts([]);
                    }
                }
    
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error);
            }
        };
    
        fetchData();
    }, [query]); // Run effect only when query changes
    
    const fetchCategoriesProducts = async (categoryId) => {
        try {
           
            const response = await axios.get(`/api/getProductByCategory?categoryId=${categoryId}`);
            
            if (response.data.Records) {
                setCategoryProduct(Array.isArray(response.data.Records) ? response.data.Records : [response.data.Records]);
            } else {
                setCategoryProduct([]);
            }
        } catch (err) {
            console.error("Error fetching front categories:", err);
            setError((prevError) => prevError + "Failed to fetch front categories. ");
        }
    };

    const fetchProductReviews = async (productId) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/v1/review/get-reviews/${productId}`, getConfig());
            if(response.data.success){
                setProductReviews(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching product reviews:", error);
            setError((prevError) => prevError + "Failed to fetch product reviews. ");
        }
    }


    return (
        <ProductsContext.Provider value={{ products, loading, error ,fetchCategoriesProducts, categoryProduct, setCategoryProduct, fetchProductReviews, productReviews }}>
            {children}
        </ProductsContext.Provider>
    );
};

export { ProductsContext, ProductsProvider };