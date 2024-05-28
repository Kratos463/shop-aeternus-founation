import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "reactstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Dashboard_LeftPart from "./dashboard_leftpart";
import { useAuth } from "../../../../helpers/auth/AuthContext";

const AddressBookPage = () => {

    const { userAddress, addAddress, removeAddress } = useAuth()
    const [obj, setObj] = useState({});
    const [loading, setLoading] = useState(false)
    const [newAddressFormVisible, setNewAddressFormVisible] = useState(false);
    const [showOptions, setShowOptions] = useState(null);
    const [showExistingAddresses, setShowExistingAddresses] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const toggleNewAddressForm = () => {
        setNewAddressFormVisible(!newAddressFormVisible);
        setShowExistingAddresses(!showExistingAddresses);
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await addAddress(data); // Call the addAddress function with form data
            setLoading(false);
            reset();
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.error || "Error adding address");
            setLoading(false);
        }
    };


    const setStateFromInput = (event) => {
        obj[event.target.name] = event.target.value;
        setObj(obj);
    };


    const handleOptionsClick = (index) => {
        setShowOptions(index === showOptions ? null : index);
    };


    return (
        <section className="section-b-space">
            <Container>
                <Row>
                    <Col lg='3'>
                        <Dashboard_LeftPart />
                    </Col>

                    <Col lg="9">
                        <div className="dashboard-right">
                            <div className="dashboard">
                                <div className="checkout-page">
                                    <div className="checkout-form">
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>



                                                <Col lg="6" sm="12" xs="12" style={{ paddingLeft: '40px' }}>
                                                    <div className="checkout-title" >
                                                        <h3>Billing & Shipping Details</h3>
                                                    </div>
                                                    {userAddress && userAddress.length > 0 ? (
                                                        <div>
                                                            {userAddress.map((addressItem, index) => (
                                                                <div key={addressItem._id}>
                                                                    <div style={{ position: 'relative' }}>
                                                                        <div onClick={() => handleOptionsClick(index)} style={{ position: 'absolute', top: '0', right: '0', cursor: 'pointer' }}>
                                                                            &#10247;
                                                                        </div>
                                                                        {showOptions === index && (
                                                                            <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '20px', right: '0', background: '#fff', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)', zIndex: '100', padding: '5px', borderRadius: '5px' }}>
                                                                                <Button className='btn btn-sm' onClick={()=>editAddress(addressItem._id)}>Edit</Button>
                                                                                <Button className='btn btn-sm' onClick={() =>removeAddress(addressItem._id)}>Remove</Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <h5>{`${addressItem.firstName} ${addressItem.lastName}`}</h5>
                                                                    <p>Email: {addressItem.email}</p>
                                                                    <p>Phone: {addressItem.phone}</p>
                                                                    <p>Address: {`${addressItem.houseNo}, ${addressItem.street}, ${addressItem.city}, ${addressItem.state}, ${addressItem.country} - ${addressItem.postalcode}`}</p>
                                                                    <p>Landmark: {addressItem.landmark}</p>
                                                                    <hr />
                                                                </div>
                                                            ))}
                                                            <div style={{ paddingTop: '40px' }}>
                                                                <Button className="btn-solid btn" onClick={toggleNewAddressForm}>Add New Address</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button className="btn-solid btn" onClick={toggleNewAddressForm}>Add Address</Button>
                                                    )}
                                                </Col>
                                                <Col>
                                                    {newAddressFormVisible && (
                                                        <div>
                                                            <div className="row check-out" style={{ paddingTop: '30px' }}>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">First Name</div>
                                                                    <input type="text"
                                                                        className={`${errors.firstName ? "error_border" : ""}`}
                                                                        name="firstName"
                                                                        {...register("firstName", { required: true })}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.firstName && "First name is required"}</span>
                                                                </div>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Last Name</div>
                                                                    <input type="text"
                                                                        className={`${errors.lastName ? "error_border" : ""}`}
                                                                        name="lastName"
                                                                        {...register("lastName",)}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.lastName && "Last name is required"}</span>
                                                                </div>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Phone</div>
                                                                    <input type="text" onChange={setStateFromInput}
                                                                        name="phone" className={`${errors.phone ? "error_border" : ""}`} {...register("phone", { pattern: /\d+/ })} />
                                                                    <span className="error-message">{errors.phone && "Please enter number for phone."}</span>
                                                                </div>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Alternative Phone</div>
                                                                    <input type="text" name="phone"
                                                                        className={`${errors.alternativePhone ? "error_border" : ""}`}
                                                                        {...register("alternativePhone", { pattern: /\d+/ })}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.alternativePhone && "Please enter number for phone."}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Email Address</div>
                                                                    <input
                                                                        //className="form-control"
                                                                        className={`${errors.email ? "error_border" : ""}`}
                                                                        type="text"
                                                                        name="email"
                                                                        {...register("email", {
                                                                            pattern: /^\S+@\S+$/i,
                                                                        })}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.email && "Please enter proper email address ."}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">House/Flat No</div>
                                                                    <input type="text" className={`${errors.houseNo ? "error_border" : ""}`}
                                                                        name="houseNo"
                                                                        {...register("houseNo",)}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Street</div>
                                                                    <input
                                                                        //className="form-control"
                                                                        className={`${errors.street ? "error_border" : ""}`}
                                                                        type="text"
                                                                        name="street"
                                                                        {...register("street", { required: true, min: 5, max: 120 })}
                                                                        placeholder="Street address"
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.address && "Please right your address ."}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Landmark</div>
                                                                    <input
                                                                        //className="form-control"
                                                                        className={`${errors.landmark ? "error_border" : ""}`}
                                                                        type="text"
                                                                        name="landmark"
                                                                        {...register("landmark")}
                                                                        placeholder="Landmark"
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Town/City</div>
                                                                    <input
                                                                        //className="form-control"
                                                                        type="text"
                                                                        className={`${errors.city ? "error_border" : ""}`}
                                                                        name="city"
                                                                        {...register("city", { required: true })}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.city && "select one city"}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                                    <div className="field-label">State / County</div>
                                                                    <input
                                                                        //className="form-control"
                                                                        type="text"
                                                                        className={`${errors.state ? "error_border" : ""}`}
                                                                        name="state"
                                                                        {...register("state", { required: true })}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.state && "select one state"}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Postal Code</div>
                                                                    <input
                                                                        //className="form-control"
                                                                        type="text"
                                                                        name="pincode"
                                                                        className={`${errors.postalcode ? "error_border" : ""}`}
                                                                        {...register("postalcode", { pattern: /\d+/ })}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.postalcode && "Required integer"}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Country</div>
                                                                    <input type="text" className={`${errors.country ? "error_border" : ""}`}
                                                                        name="country"
                                                                        {...register("country", { required: true })}
                                                                        onChange={setStateFromInput}
                                                                    />
                                                                    <span className="error-message">{errors.country && "Country is required"}</span>
                                                                </div>

                                                            </div>
                                                            <br></br>
                                                            <br></br>
                                                            <Button type="submit" className="btn-solid btn" >
                                                                Save Address
                                                            </Button>
                                                        </div>

                                                    )}
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AddressBookPage;