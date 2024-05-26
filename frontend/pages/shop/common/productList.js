import React, { useState, useContext, useEffect } from "react";
import { Col, Row, Media, Button, Spinner } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import ProductItem from "../../../components/common/product-box/ProductBox1";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import { useRouter } from "next/router";
import PostLoader from "../../../components/common/PostLoader";
import CartContext from "../../../helpers/cart";
import WishlistContext from "../../../helpers/wishlist";
import { ProductsContext } from "../../../helpers/product/ProductContext";

const ProductList = ({ colClass, layoutList, openSidebar, noSidebar }) => {
  const { loading, categoryProduct, fetchCategoriesProducts,products } = useContext(ProductsContext);
  const cartContext = useContext(CartContext);
  const quantity = cartContext.quantity;
  const wishlistContext = useContext(WishlistContext);
  const router = useRouter();
  const [limit, setLimit] = useState(8);
  const curContext = useContext(CurrencyContext);
  const [grid, setGrid] = useState(colClass);
  const symbol = curContext.state.symbol;
  const filterContext = useContext(FilterContext);
  const selectedBrands = filterContext.selectedBrands;
  const selectedColor = filterContext.selectedColor;
  const selectedPrice = filterContext.selectedPrice;
  const selectedSize = filterContext.selectedSize;
  const selectedCategoryId = filterContext.selectedCategoryId;
  const selectedCategory = filterContext.state;
  const selectedFilteredProducts = filterContext.selectedFilteredProducts;
  const [isLoading, setIsLoading] = useState(false);
  const [layout, setLayout] = useState(layoutList);
  const [url, setUrl] = useState();

  useEffect(() => {
    const pathname = window.location.pathname;
    setUrl(pathname);
    router.push(
      `${pathname}?${filterContext.state}&brand=${selectedBrands}&color=${selectedColor}&size=${selectedSize}&minPrice=${selectedPrice.min}&maxPrice=${selectedPrice.max}`,
      undefined,
      { shallow: true }
    );
  }, [selectedBrands, selectedColor, selectedSize, selectedPrice, selectedCategory]);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      fetchCategoriesProducts(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const handlePagination = () => {
    setIsLoading(true);
    setTimeout(() => {
      fetchMore({
        variables: {
          indexFrom: selectedFilteredProducts.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          setIsLoading(false);
          return {
            products: {
              __typename: prev.products.__typename,
              total: prev.products.total,
              items: [
                ...prev.products.items,
                ...fetchMoreResult.products.items,
              ],
              hasMore: fetchMoreResult.products.hasMore,
            },
          };
        },
      });
    }, 1000);
  };

  const removeBrand = (val) => {
    const temp = [...selectedBrands];
    temp.splice(selectedBrands.indexOf(val), 1);
    filterContext.setSelectedBrands(temp);
  };

  const removeSize = (val) => {
    const temp = [...selectedSize];
    temp.splice(selectedSize.indexOf(val), 1);
    filterContext.setSelectedSize(temp);
  };

  const removeColor = () => {
    filterContext.setSelectedColor("");
  };

  const productsToDisplay = selectedCategoryId ? categoryProduct : products;

  return (
    <Col className="collection-content">
      <div className="page-main-content">
        <Row>
          <Col sm="12">
            <Row>
              <Col xs="12">
                <ul className="product-filter-tags">
                  {selectedBrands.map((brand, i) => (
                    <li key={i}>
                      <a href={null} className="filter_tag">
                        {brand}
                        <i
                          className="fa fa-close"
                          onClick={() => removeBrand(brand)}
                        ></i>
                      </a>
                    </li>
                  ))}
                  {selectedColor ? (
                    <li>
                      <a href={null} className="filter_tag">
                        {selectedColor}
                        <i className="fa fa-close" onClick={removeColor}></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {selectedSize.map((size, i) => (
                    <li key={i}>
                      <a href={null} className="filter_tag">
                        {size}
                        <i
                          className="fa fa-close"
                          onClick={() => removeSize(size)}
                        ></i>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={null} className="filter_tag">
                      price: {selectedPrice.min} - {selectedPrice.max}
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
            <div className="collection-product-wrapper">
              <div className="product-top-filter">
                {!noSidebar ? (
                  <Row>
                    <Col xl="12">
                      <div
                        className="filter-main-btn"
                        onClick={() => openSidebar()}
                      >
                        <span className="filter-btn btn btn-theme">
                          <i className="fa fa-filter" aria-hidden="true"></i>{" "}
                          Filter
                        </span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
                <div className={`product-wrapper-grid ${layout}`}>
                  <Row>
                    {loading ? (
                      <Col xs="12">
                        <div className="row mx-0 margin-default mt-4">
                          {[1, 2, 3, 4].map((index) => (
                            <div className={colClass} key={index}>
                              <PostLoader />
                            </div>
                          ))}
                        </div>
                      </Col>
                    ) : (
                      <>
                        {productsToDisplay.length > 0 ? (
                          productsToDisplay.map((product, i) => (
                            <div className={grid} key={i}>
                              <div className="product">
                                <div>
                                  <ProductItem
                                    des={true}
                                    product={product}
                                    symbol={symbol}
                                    cartClass="cart-info cart-wrap"
                                    addWishlist={() =>
                                      wishlistContext.addToWish(product)
                                    }
                                    addCart={() =>
                                      cartContext.addToCart(product, quantity)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <Col xs="12">
                            <div className="col-sm-12 empty-cart-cls text-center">
                              {/* Display message for empty products */}
                              No products found.
                            </div>
                          </Col>
                        )}
                      </>
                    )}
                  </Row>

                </div>
                <div className="section-t-space">
                  <div className="text-center">
                    <Row>
                      <Col xl="12" md="12" sm="12">
                        {categoryProduct && categoryProduct.hasMore && (
                          <Button className="load-more" onClick={handlePagination}>
                            {isLoading && (
                              <Spinner animation="border" variant="light" />
                            )}
                            Load More
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ProductList;

