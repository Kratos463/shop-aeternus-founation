import React, { useEffect, useState, useRef } from "react";
import CategoryContext from "./CategoryContext";
import axios from "axios";

const CategoryProvider = ({ children }) => {
    const [frontCategories, setFrontCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategoriesMap, setSubcategoriesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const isFetched = useRef({ categories: false, frontCategories: false }); // Ref to persist fetched state

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`/api/getCategoryList`);
                const categoryData = response.data.Records || [];
                setCategories(Array.isArray(categoryData) ? categoryData : [categoryData]);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError((prevError) => prevError + "Failed to fetch categories. ");
            } finally {
                setLoading(false);
            }
        };

        const fetchFrontCategories = async () => {
            try {
                const response = await axios.get(`/api/getFrontCategoryList`);
                if (response.data.Records) {
                    setFrontCategories(Array.isArray(response.data.Records) ? response.data.Records : [response.data.Records]);
                } else {
                    setFrontCategories([]);
                }
            } catch (err) {
                console.error("Error fetching front categories:", err);
                setError((prevError) => prevError + "Failed to fetch front categories. ");
            }
        };

        if (!isFetched.current.categories) {
            fetchCategories();
            isFetched.current.categories = true;
        }

        if (!isFetched.current.frontCategories) {
            fetchFrontCategories();
            isFetched.current.frontCategories = true;
        }
    }, []);

    useEffect(() => {
        const fetchSubcategories = async (categoryId) => {
            try {
                const response = await axios.get(`/api/getSubCategoryList?categoryId=${categoryId}`);
                const subcategories = response.data.Records || [];
                setSubcategoriesMap((prevMap) => ({
                    ...prevMap,
                    [categoryId]: subcategories,
                }));
            } catch (err) {
                console.error(`Error fetching subcategories for category ID ${categoryId}:`, err);
                setSubcategoriesMap((prevMap) => ({
                    ...prevMap,
                    [categoryId]: [],
                }));
            }
        };

        if (categories.length > 0) {
            categories.forEach((category) => {
                if (category.Have_child_categoryies === "Yes") {
                    fetchSubcategories(category.Category_id);
                }
            });
        }
    }, [categories]);

    return (
        <CategoryContext.Provider value={{ categories, frontCategories, loading, error, subcategoriesMap }}>
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryProvider;
