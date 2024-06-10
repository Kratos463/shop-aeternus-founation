import React, { useContext, useState, useEffect } from "react";
import { Media, Container, Form, Row, Col, Button } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import { generate15DigitNumber, getConfig } from "../../../../helpers/utils";
import { toast } from "react-toastify";
import { useAuth } from "../../../../helpers/auth/AuthContext";
import { useVoucher } from "../../../../helpers/voucher/VoucherContext";
import axios from "axios";

const CheckoutPage = () => {
    const cartContext = useContext(CartContext);
    const { vouchers, getVouchers } = useVoucher();
    const { addAddress, userAddress, user, wallet, getWalletDetails } = useAuth();
    const displayCartProduct = cartContext.displayCartProduct
    const cart = cartContext.cart;
    const { state: selectedCurr } = useContext(CurrencyContext);
    const [obj, setObj] = useState({});
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [newAddressFormVisible, setNewAddressFormVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [discountedTotal, setDiscountedTotal] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    // Initialize discountedTotal when cart.total changes
    useEffect(() => {
        setDiscountedTotal(cart.total);
    }, [cart.total]);


    const handleVoucherChange = (voucher) => {
        setSelectedVoucher(voucher);
        if (voucher && voucher.cost) {
            setDiscountedTotal(cart.total - voucher.cost);
        } else {
            setDiscountedTotal(cart.total);
        }
        if (voucher && user.mfvUser && voucher._id) {
            // If MFV user and voucher selected, set totalBV to 0
            cart.totalBV = 0;
        } else {
            // Recalculate totalBV if no voucher selected
            cart.totalBV = cart.items.reduce((total, item) => total + (parseFloat(item.bv) || 0), 0);
        }
    };



    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await addAddress(data); // Call the addAddress function with form data
            setLoading(false);
            setObj({});
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.error || "Error adding address");
            setLoading(false);
        }
    };

    const setStateFromInput = (event) => {
        obj[event.target.name] = event.target.value;
        setObj({ ...obj });
    };

    const handlePlaceOrder = async () => {
        try {
            // Check if address is selected
            if (!selectedAddress || !selectedAddress._id) {
                toast.error("Please select a shipping address.");
                return;
            }

            const paymentMethod = user.mfvUser ? "Wallet" : "Crypto";

            // Make the payment
            const paymentResponse = await axios.post(
                `${process.env.API_URL}/api/v1/payment/make-payment`,
                {
                    amount: discountedTotal,
                    method: paymentMethod,
                    transactionId: generate15DigitNumber()
                },
                getConfig()
            );

            if (paymentResponse.data.success) {
                // Make the order
                const orderResponse = await axios.post(
                    `${process.env.API_URL}/api/v1/order/make-order`,
                    {
                        paymentId: paymentResponse.data.payment._id,
                        voucherId: selectedVoucher?._id,
                        addressId: selectedAddress._id
                    },
                    getConfig()
                );

                if (orderResponse.data.success) {
                    displayCartProduct();
                    if (user.mfvUser) {
                        getVouchers()
                        getWalletDetails()
                    }
                    toast.success("Order placed successfully!");
                    router.push('/page/order-success');
                } else {
                    // If order fails after payment, initiate refund
                    const refundResponse = await axios.post(
                        `${process.env.API_URL}/api/v1/payment/refund`,
                        {
                            paymentId: paymentResponse.data.payment._id
                        },
                        getConfig()
                    );

                    if (refundResponse.data.success) {
                        getWalletDetails()
                        toast.error("Failed to place order. Refund initiated.");
                    } else {
                        toast.error("Failed to place order. Refund failed.");
                    }
                }
            } else {
                toast.error("Payment failed.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to place order.");
        }
    };


    return (
        <section className="section-b-space">
            <Container>
                <div className="checkout-page">
                    <div className="checkout-form">
                        <Row>
                            <Col>
                                <div className="balance-strip">
                                    <p className="balance">Current Balance: {selectedCurr.symbol}{wallet?.amount}</p>
                                    <Button className="refresh-btn" color="secondary" size="sm" onClick={() => getWalletDetails()}>Refresh</Button>
                                </div>
                            </Col>
                        </Row>


                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col lg="6" sm="12" xs="12" style={{ paddingLeft: '40px' }}>
                                    <div className="checkout-title">
                                        <h3>Billing & Shipping Details</h3>
                                    </div>
                                    {userAddress.length > 0 ? (
                                        <div>
                                            <h4 style={{ color: '#ff4c3b' }}>Select Address:</h4>
                                            {userAddress.map((address, index) => (
                                                <div key={index} style={{ paddingTop: '20px' }}>
                                                    <input
                                                        type="radio"
                                                        id={`address-${index}`}
                                                        name="selectedAddress"
                                                        value={address._id}
                                                        onChange={() => setSelectedAddress(address)}
                                                    />
                                                    <label style={{ paddingLeft: '30px' }} htmlFor={`address-${index}`}>
                                                        <div>{address.firstName} {address.lastName}</div>
                                                        <div>{address.houseNo}, {address.street}, {address.landmark}</div>
                                                        <div>{address.city}, {address.state}, {address.postalcode}</div>
                                                        <div>{address.country}</div>
                                                    </label>
                                                </div>
                                            ))}
                                            <div style={{ paddingTop: '40px' }}>
                                                <Button className="btn-solid btn" onClick={() => setNewAddressFormVisible(prev => !prev)}>
                                                    {newAddressFormVisible ? 'Close Form' : 'Add New Address'}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button className="btn-solid btn" onClick={() => setNewAddressFormVisible(prev => !prev)}>
                                            {newAddressFormVisible ? 'Close Form' : 'Add Address'}
                                        </Button>
                                    )}

                                    {newAddressFormVisible && (
                                        <div>
                                            <div className="row check-out" style={{ paddingTop: '30px' }}>
                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div className="field-label">First Name</div>
                                                    <input
                                                        type="text"
                                                        className={errors.firstName ? "error_border" : ""}
                                                        name="firstName"
                                                        {...register("firstName", { required: true })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.firstName && "First name is required"}</span>
                                                </div>
                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div className="field-label">Last Name</div>
                                                    <input
                                                        type="text"
                                                        className={errors.lastName ? "error_border" : ""}
                                                        name="lastName"
                                                        {...register("lastName")}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.lastName && "Last name is required"}</span>
                                                </div>
                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div className="field-label">Phone</div>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        className={errors.phone ? "error_border" : ""}
                                                        {...register("phone", { pattern: /\d+/ })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.phone && "Please enter number for phone."}</span>
                                                </div>
                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                    <div className="field-label">Alternative Phone</div>
                                                    <input
                                                        type="text"
                                                        name="alternativePhone"
                                                        className={errors.alternativePhone ? "error_border" : ""}
                                                        {...register("alternativePhone", { pattern: /\d+/ })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.alternativePhone && "Please enter number for phone."}</span>
                                                </div>
                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div className="field-label">Email Address</div>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        className={errors.email ? "error_border" : ""}
                                                        {...register("email", { pattern: /^\S+@\S+$/i })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.email && "Please enter proper email address."}</span>
                                                </div>
                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div className="field-label">House/Flat No</div>
                                                    <input
                                                        type="text"
                                                        name="houseNo"
                                                        className={errors.houseNo ? "error_border" : ""}
                                                        {...register("houseNo")}
                                                        onChange={setStateFromInput}
                                                    />
                                                </div>
                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div className="field-label">Street</div>
                                                    <input
                                                        type="text"
                                                        name="street"
                                                        className={errors.street ? "error_border" : ""}
                                                        {...register("street", { required: true, min: 5, max: 120 })}
                                                        placeholder="Street address"
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.street && "Please write your address."}</span>
                                                </div>
                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div className="field-label">Landmark</div>
                                                    <input
                                                        type="text"
                                                        name="landmark"
                                                        className={errors.landmark ? "error_border" : ""}
                                                        {...register("landmark")}
                                                        placeholder="Landmark"
                                                        onChange={setStateFromInput}
                                                    />
                                                </div>
                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div className="field-label">Town/City</div>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        className={errors.city ? "error_border" : ""}
                                                        {...register("city", { required: true })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.city && "Select one city"}</span>
                                                </div>
                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                    <div className="field-label">State / County</div>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        className={errors.state ? "error_border" : ""}
                                                        {...register("state", { required: true })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.state && "Select one state"}</span>
                                                </div>
                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                    <div className="field-label">Postal Code</div>
                                                    <input
                                                        type="text"
                                                        name="postalcode"
                                                        className={errors.postalcode ? "error_border" : ""}
                                                        {...register("postalcode", { pattern: /\d+/ })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.postalcode && "Required integer"}</span>
                                                </div>
                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                    <div className="field-label">Country</div>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        className={errors.country ? "error_border" : ""}
                                                        {...register("country", { required: true })}
                                                        onChange={setStateFromInput}
                                                    />
                                                    <span className="error-message">{errors.country && "Country is required"}</span>
                                                </div>
                                            </div>
                                            <br />
                                            <br />
                                            <Button type="submit" className="btn-solid btn">
                                                Save Address
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                                <Col lg="6" sm="12" xs="12">
                                    {cart?.items?.length > 0 && (
                                        <div className="checkout-details">
                                            <div className="order-box">

                                                <div className="title-box">
                                                    <div>
                                                        Product <span style={{ marginLeft: 'auto', paddingRight: '15px' }}>  <span> Total </span>  </span>
                                                    </div>
                                                </div>
                                                <ul className="qty" style={{ listStyleType: 'none', padding: 0 }}>
                                                    {cart?.items?.map((item, index) => (
                                                        <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img
                                                                    src={"https://thebrandtadka.com/images_inventory_products/front_images/" + item.mediumFile}
                                                                    alt={item.title}
                                                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                                                />
                                                                <div style={{ whiteSpace: 'pre-wrap', paddingRight: '55px' }}>
                                                                    {item.title} × {item.quantity}
                                                                </div>
                                                            </div>
                                                            <div style={{ whiteSpace: 'nowrap' }}>
                                                                {selectedCurr.symbol}
                                                                {(item.offerPrice * item.quantity).toFixed(2)}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <ul className="sub-total" style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                                                    <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        Subtotal{" "}
                                                        <span className="count" style={{ marginLeft: 'auto', paddingLeft: '110px' }}>
                                                            {selectedCurr.symbol}
                                                            {(cart.total).toFixed(2)}
                                                        </span>
                                                    </li>
                                                    <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        Shipping Fee
                                                        <span className="count" style={{ marginLeft: 'auto', paddingLeft: '110px', display: "flex" }}>
                                                            <del>
                                                                {selectedCurr.symbol}
                                                                50
                                                            </del> <span>Free</span>
                                                        </span>
                                                    </li>

                                                    {
                                                        user?.mfvUser && (
                                                            <>
                                                                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                                    Total BV{" "}
                                                                    <span className="count" style={{ marginLeft: 'auto', paddingLeft: '110px' }}>
                                                                        {selectedCurr.symbol}
                                                                        {(cart.totalBV).toFixed(2)}
                                                                    </span>
                                                                </li>
                                                                <div className="payment-box">
                                                                    <div className="upper-box">
                                                                        <div className="payment-options">
                                                                            <p style={{ color: "red", fontWeight: 700 }}>If you apply a coupon or voucher, your Business Volume getting 0</p>
                                                                            <div className="form-group">
                                                                                <div className="field-label">Select Voucher</div>
                                                                                <select
                                                                                    name="voucher"
                                                                                    onChange={(e) => {
                                                                                        const selectedVoucher = vouchers.find(voucher => voucher._id === e.target.value);
                                                                                        handleVoucherChange(selectedVoucher);
                                                                                    }}
                                                                                >
                                                                                    <option value="">Select Voucher</option>
                                                                                    {vouchers.filter(voucher => !voucher.isUsed).map((voucher, index) => (
                                                                                        <option key={index} value={voucher._id}>
                                                                                            {voucher.code} - {selectedCurr.symbol}{voucher.cost}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </ul>


                                                <ul className="sub-total" style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                                                    <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        Total{" "}
                                                        <span className="count" style={{ marginLeft: 'auto', paddingLeft: '110px' }}>
                                                            {selectedCurr.symbol}
                                                            {(discountedTotal).toFixed(2)}
                                                        </span>
                                                    </li>
                                                </ul>

                                            </div>
                                            <div className="payment-box">
                                                {cart.total !== 0 && (
                                                    <div className="text-end">
                                                        {user.mfvUser && wallet?.amount < discountedTotal ? (
                                                            <div>
                                                                <p style={{ color: "red", fontWeight: 700, textAlign: "start" }}>Oops! Your wallet balance is insufficient to place this order. Please add funds to your wallet.</p>
                                                                <button type="button" className="btn-solid btn" disabled>
                                                                    Place Order
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button type="button" className="btn-solid btn" onClick={handlePlaceOrder}>
                                                                Place Order
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                        </div>

                                    )}
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Container>
        </section >
    );
};

export default CheckoutPage;

