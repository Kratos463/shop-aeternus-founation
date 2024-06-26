import React, { useEffect, useState } from "react";
import ThemeSettings from "../components/customizer/theme-settings";
import "../public/assets/scss/app.scss";
import { ToastContainer } from "react-toastify";
import TapTop from "../components/common/widgets/Tap-Top";
import CartContextProvider from "../helpers/cart/CartContext";
import WishlistProvider from "../helpers/wishlist/WishlistContext";
import FilterProvider from "../helpers/filter/FilterProvider";
import SettingProvider from "../helpers/theme-setting/SettingProvider";
import { CurrencyContextProvider } from "../helpers/Currency/CurrencyContext";
import Helmet from "react-helmet";
import { ProductsProvider } from "../helpers/product/ProductContext";
import CategoryProvider from "../helpers/category/CategoryProvider";
import '../public/assets/style/categorymenu.css'
import '../public/assets/style/style.css'
import { AuthProvider } from "../helpers/auth/AuthContext";
import VoucherProvider from "../helpers/voucher/VoucherContext";

export default function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState();

  useEffect(() => {
    const path = window.location.pathname.split("/");
    const url = path[path.length - 1];
    document.body.classList.add("dark");

    let timer = setTimeout(function () {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>

      {isLoading ? (
        <div className="loader-wrapper">{url === "Christmas" ? <div id="preloader"></div> : <div className="loader"></div>}</div>
      ) : (
        <>
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Shop Atrno - Multi-purpopse E-commerce Website</title>
          </Helmet>
          <div>
            <AuthProvider>
              <VoucherProvider>
                <ProductsProvider>
                  <CategoryProvider>
                    <SettingProvider>

                      <CurrencyContextProvider>
                        <CartContextProvider>
                          <WishlistProvider>
                            <FilterProvider>
                              <Component {...pageProps} />
                            </FilterProvider>
                          </WishlistProvider>
                        </CartContextProvider>
                      </CurrencyContextProvider>
                      <ThemeSettings />

                    </SettingProvider>
                  </CategoryProvider>
                </ProductsProvider>
              </VoucherProvider>
            </AuthProvider>
            <ToastContainer />
            <TapTop />
          </div>
        </>
      )}
    </>
  );
}
