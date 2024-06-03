import React, { useContext,useState} from "react";
import { Container, Row, Col, Table, Media } from "reactstrap";
import CartContext from "../../../../helpers/cart/index";
import { useRouter } from "next/router";
import Link from "next/link";
import WishlistContext from "../../../../helpers/wishlist";
import { convertPrice } from "../../../../helpers/utils";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import axios from "axios";
import { htmlToText } from 'html-to-text';
import { toast } from "react-toastify";



const WishlistPage = () => {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, getcartProductById } = useContext(CartContext);
  const { state: selectedCurr } = useContext(CurrencyContext);


  const checkOut = () => {
    router.push("/page/account/checkout");
  };

  // Function to handle adding product to the cart


  const handleAddToCart = async (productId) => {
    try {
     
      const productInCart = await getcartProductById(productId);
     
      
      if (productInCart === true) {
        // Product is already in the cart, no need to add it again
        
        toast.error("Product is already in cart")
        return;
      }

      if(productInCart === false){
      // If the product is not in the cart, attempt to add it
      const response = await axios(`/api/getProductDetails?productId=${productId}`);
      const recordsArray = response.data.Records;

      // Ensure we get the first product from the array within the Records object
      const product = recordsArray && recordsArray.length > 0 ? recordsArray[0] : null;

      if (!product) {
        console.error("No product found in the response.");
        return;
      }

      // Convert HTML description to plain text
      const plainTextDescription = htmlToText(product.Description, {
        wordwrap: 130
      });

      // Update the product object with the plain text description
      product.Description = plainTextDescription;

      const Default_color = "1";
      const Default_size = "1";

      const color = product.colors && product.colors.length > 0 ? product.colors[0] : Default_color;
      const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : Default_size;
      const quantity = product.quantity || 1;

      // Attempt to add product to the cart
      const addToCartConfirmation = await addToCart(product, color, size, quantity);

      // Check if the addition to cart was successful
      if (addToCartConfirmation === "Product successfully added to cart") {
        // Remove product from wishlist
        removeFromWishlist({ productId });
      } else {
        console.error("Failed to add product to cart");
      }
    }

    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };






  return (
    <>
      {wishlistItems?.length >= 0 ? (
        <section className="wishlist-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <Table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">image</th>
                      <th scope="col">product name</th>
                      <th scope="col">price</th>
                      <th scope="col">availability</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  {wishlistItems?.map((item, index) => (
                    <tbody key={index}>
                      <tr>
                        <td>
                          <Link href={`/product-details/` + item.productId}>
                            <Media
                              src={`https://thebrandtadka.com/images_inventory_products/front_images/${item.image}`}
                              alt=""
                            />
                          </Link>
                        </td>
                        <td>
                          <a href={`/product-details/` + item.productId}>{item.title}</a>
                        </td>
                        <td>
                          <h2>{selectedCurr.symbol}{convertPrice(item.price, selectedCurr)}</h2>
                        </td>
                        <td>
                          {/* <p>{item.stock > 0 ? "In Stock" : "out of Stock"}</p> */}
                        </td>
                        <td>
                          <a
                            href="#"
                            className="icon me-3"
                            onClick={() => removeFromWishlist(item)}
                          >
                            <i className="fa fa-times"></i>
                          </a>
                          <a
                            href="#"
                            className="cart"
                            onClick={() => handleAddToCart(item.productId)} // Pass productId to handleAddToCart
                          >
                            <i className="fa fa-shopping-cart"></i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
              </Col>
            </Row>
            <Row className="wishlist-buttons">
              <Col sm="12">
                <Link href={"/"} className="btn btn-solid">
                  continue shopping
                </Link>
                <a href="#" className="btn btn-solid" onClick={checkOut}>
                  check out
                </a>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div className="col-sm-12 empty-cart-cls text-center">
                  <Media
                    src={cart}
                    className="img-fluid mb-4 mx-auto"
                    alt=""
                  />
                  <h3>
                    <strong>Your Wishlist is Empty</strong>
                  </h3>
                  <h4>Explore more and shortlist some items.</h4>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  );
};

export default WishlistPage;
