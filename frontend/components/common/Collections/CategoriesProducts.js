import React, { useContext } from 'react';
import Paragraph from '../Paragraph';
import CategoryCollection from './Collection4';
import CategoryContext from '../../../helpers/category/CategoryContext';
import { Product4 } from '../../../services/script';

const descriptions = [
    {
        category: "Kids",
        desc: " Brighten your child's world with our unique and playful fashion and toys!"
    },
    {
        category: "Life Style",
        desc: "Elevate your everyday with our curated selection of stylish and functional lifestyle essentials!"
    },
    {
        category: "Men",
        desc: "Upgrade your wardrobe with our sleek and stylish men's fashion and accessories!"
    },
    {
        category: "Sports Club",
        desc: "Gear up with our premium sports equipment and apparel for peak performance!"
    },
    {
        category: "Backpack & Travel Bag",
        desc: "Embark on your next adventure with our durable and stylish backpacks and travel bags, designed for comfort and convenience on the go!"
    },
    {
        category: "Books and Stationery",
        desc: "Ignite your imagination and organize your thoughts with our diverse range of books and stationery essentials, curated to inspire creativity and productivity!"
    },
    {
        category: "Women",
        desc: "Indulge in timeless elegance and modern sophistication with our curated selection of women's fashion and accessories, designed to empower and inspire!"
    },
    {
        category: "Electronics & Home",
        desc: "Elevate your living space and stay connected with our cutting-edge electronics and innovative home essentials, designed to enhance comfort and convenience in every aspect of your life!"
    },
]

const CategoriesProducts = () => {
    const { frontCategories } = useContext(CategoryContext);

    return (
        <>
            {frontCategories?.map(category => (
                <div key={category.Category_id}>
                        <Paragraph
                            heading="Explore our"
                            category={category.Category_name}
                            title="title1 section-t-space"
                            inner="title-inner1"
                            hrClass={false}
                            desc={descriptions.find(desc => desc.category === category.Category_name)?.desc || ""}
                        />
                    <CategoryCollection
                        key={category.Category_id}
                        // type="fashion"
                        noTitle="null"
                        backImage={true}
                        title={category.Category}
                        subtitle="explore our"
                        productSlider={Product4}
                        designClass="section-b-space p-t-0 ratio_asos px-2"
                        noSlider="false"
                        cartClass="cart-info cart-wrap"
                        categories={[category.Category_id]}
                    />
                </div>
            ))}
        </>
    );
};

export default CategoriesProducts;
