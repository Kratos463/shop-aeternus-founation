import React, { useContext, useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import ProductItems from "../product-box/ProductBox1";
import { Row, Col, Container } from "reactstrap";
import CartContext from "../../../helpers/cart";
import PostLoader from "../PostLoader";
import axios from "axios";
import WishlistContext from "../../../helpers/wishlist";

const CategoryCollection = ({ title, subtitle, designClass, noSlider, cartClass, productSlider, titleClass, noTitle, innerClass, inner, backImage, categories }) => {
    const context = useContext(CartContext);
    const contextWishlist = useContext(WishlistContext);
    const quantity = context.quantity;
    const [loading, setLoading] = useState(false);
    const [categoryProducts, setCategoryProducts] = useState({});

    const fetchDataForCategories = useCallback(async () => {
        setLoading(true);
        const categoryData = {};
        for (const category of categories) {
            try {
                const response = await axios.get(`/api/getFrontCategoryProductsList?categoryId=${category}`);
                categoryData[category] = Array.isArray(response.data.Records) ? response.data.Records : [response.data.Records];
            } catch (error) {
                console.log(`Error while fetching category ${category} products:`, error);
                categoryData[category] = [];
            }
        }
        setCategoryProducts(categoryData);
        setLoading(false);
    }, [categories]);

    useEffect(() => {
        fetchDataForCategories();
    }, [fetchDataForCategories]);

    return (
        <section className={designClass}>
            {noSlider ? (
                <Container>
                    {categories.map((category, index) => (
                        <Row key={index}>
                            {noTitle === "null" ? (
                                ""
                            ) : (
                                <div className={innerClass}>
                                    {subtitle ? <h4>{subtitle}</h4> : ""}
                                    <h2 className={inner}>{title}</h2>
                                    {titleClass ? (
                                        <hr role="tournament6" />
                                    ) : (
                                        <div className="line">
                                            <span></span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {loading ? (
                                <div className="row mx-0 margin-default">
                                    <div className="col-xl-3 col-lg-4 col-6">
                                        <PostLoader />
                                    </div>
                                    <div className="col-xl-3 col-lg-4 col-6">
                                        <PostLoader />
                                    </div>
                                    <div className="col-xl-3 col-lg-4 col-6">
                                        <PostLoader />
                                    </div>
                                    <div className="col-xl-3 col-lg-4 col-6">
                                        <PostLoader />
                                    </div>
                                </div>
                            ) : (
                                <Slider {...productSlider} className="product-m no-arrow" key={index}>
                                    {categoryProducts[category]?.map((product, productIndex) => (
                                        <div key={productIndex}>
                                            <ProductItems
                                                product={product}
                                                backImage={backImage}
                                                addWishlist={() => contextWishlist.addToWish(product)}
                                                title={title}
                                                cartClass={cartClass}
                                                addCart={() => context.addToCart(product, quantity)}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </Row>
                    ))}
                </Container>
            ) : (
                // Render without slider
                <>
                    {title && (
                        <div className="title1 title-gradient section-t-space">
                            <h4>{subtitle}</h4>
                            <h2 className="title-inner1">{title}</h2>
                            <hr role="tournament6" />
                        </div>
                    )}
                    <Container>
                        {categories.map((category, index) => (
                            <Row className="margin-default" key={index}>
                                {loading ? (
                                    <div className="row margin-default">
                                        <div className="col-xl-3 col-lg-4 col-6">
                                            <PostLoader />
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-6">
                                            <PostLoader />
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-6">
                                            <PostLoader />
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-6">
                                            <PostLoader />
                                        </div>
                                    </div>
                                ) : (
                                    categoryProducts[category].slice(0, 12).map((product, productIndex) => (
                                        <Col xl="3" sm="6" key={productIndex}>
                                            <div>
                                                <ProductItems
                                                    product={product}
                                                    backImage={backImage}
                                                    addWishlist={() => contextWishlist.addToWish(product)}
                                                    title={title}
                                                    cartClass={cartClass}
                                                    addCart={() => context.addToCart(product, quantity)}
                                                />
                                            </div>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        ))}
                    </Container>
                </>
            )}
        </section>
    );
};

export default CategoryCollection;
