import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "reactstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Dashboard_LeftPart from "./dashboard_leftpart";
import { useAuth } from "../../../../helpers/auth/AuthContext";

const AddressBookPage = () => {
    const { userAddress, addAddress, removeAddress, editAddress } = useAuth();
    const [editedAddress, setEditedAddress] = useState(null);
    const [editFormVisible, setEditFormVisible] = useState(false);
    const [newAddressFormVisible, setNewAddressFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (editedAddress) {
            for (const key in editedAddress) {
                setValue(key, editedAddress[key]);
            }
            setEditFormVisible(true);
        }
    }, [editedAddress, setValue]);

    const toggleEditForm = () => {
        setEditFormVisible(!editFormVisible);
    };

    const toggleNewAddressForm = () => {
        setNewAddressFormVisible(!newAddressFormVisible);
    };

    const handleEditClick = (address) => {
        setEditedAddress(address);
        setEditFormVisible(true);
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (editedAddress) {
                await editAddress({ addressId: editedAddress._id, address: data });
                toast.success("Address updated successfully.");
            } else {
                await addAddress(data);
                toast.success("Address added successfully.");
            }
            setLoading(false);
            reset();
            setEditedAddress(null);
            toggleEditForm();
            toggleNewAddressForm();
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.error || "Error adding/updating address");
            setLoading(false);
        }
    };

    const handleOptionsClick = (index) => {
        setShowOptions(index === showOptions ? null : index);
    };

    return (
        <section className="section-b-space">
            <Container>
                <Row>
                    <Col lg='3' style={{ position: 'sticky', left: 0, zIndex: 1 }}>
                        <Dashboard_LeftPart />
                    </Col>

                    <Col lg="9" className="dashboard-right"  style={{ overflowX: 'hidden' }}>
                        <div className="dashboard-right" style={{ overflowX: 'auto', paddingRight: '16px' }}>
                            <div className="dashboard">
                                <div className="checkout-page">
                                    <div className="checkout-form">
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col lg="9" sm="12" xs="12" style={{ paddingLeft: '40px' }}>
                                                    <div className="checkout-title">
                                                        <h3>Billing & Shipping Details</h3>
                                                    </div>
                                                    {userAddress && userAddress.length > 0 ? (
                                                        <div>
                                                            {userAddress.map((addressItem, index) => (
                                                                <div key={addressItem._id}>
                                                                    <div style={{ position: 'relative' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
                                                                            <Button color="info" className="btn btn-sm" onClick={() => handleEditClick(addressItem)}>Edit</Button>
                                                                            <Button color="danger" className="btn btn-sm" onClick={() => removeAddress(addressItem._id)}>Remove</Button>
                                                                        </div>
                                                                    </div>
                                                                    <h5>{`${addressItem.firstName} ${addressItem.lastName}`}</h5>
                                                                    <p>Email: {addressItem.email}</p>
                                                                    <p>Phone: {addressItem.phone}</p>
                                                                    <p>Address: {`${addressItem.houseNo}, ${addressItem.street}, ${addressItem.city}, ${addressItem.state}, ${addressItem.country} - ${addressItem.postalcode}`}</p>
                                                                    <p>Landmark: {addressItem.landmark}</p>
                                                                    <hr />
                                                                    {editFormVisible && editedAddress && editedAddress._id === addressItem._id && (
                                                                        <div>
                                                                            <div className="row check-out" style={{ paddingTop: '30px' }}>
                                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                                    <div className="field-label">First Name</div>
                                                                                    <input type="text"
                                                                                        className={`${errors.firstName ? "error_border" : ""}`}
                                                                                        name="firstName"
                                                                                        {...register("firstName", { required: true })}
                                                                                    />
                                                                                    <span className="error-message">{errors.firstName && "First name is required"}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                                    <div className="field-label">Last Name</div>
                                                                                    <input type="text"
                                                                                        className={`${errors.lastName ? "error_border" : ""}`}
                                                                                        name="lastName"
                                                                                        {...register("lastName")}
                                                                                    />
                                                                                    <span className="error-message">{errors.lastName && "Last name is required"}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                                    <div className="field-label">Phone</div>
                                                                                    <input type="text"
                                                                                        name="phone" className={`${errors.phone ? "error_border" : ""}`} {...register("phone", { pattern: /\d+/ })}
                                                                                    />
                                                                                    <span className="error-message">{errors.phone && "Please enter number for phone."}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                                    <div className="field-label">Alternative Phone</div>
                                                                                    <input type="text" name="alternativePhone"
                                                                                        className={`${errors.alternativePhone ? "error_border" : ""}`}
                                                                                        {...register("alternativePhone", { pattern: /\d+/ })}
                                                                                    />
                                                                                    <span className="error-message">{errors.alternativePhone && "Please enter number for phone."}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                                    <div className="field-label">Email Address</div>
                                                                                    <input
                                                                                        className={`${errors.email ? "error_border" : ""}`}
                                                                                        type="text"
                                                                                        name="email"
                                                                                        {...register("email", {
                                                                                            pattern: /^\S+@\S+$/i,
                                                                                        })}
                                                                                    />
                                                                                    <span className="error-message">{errors.email && "Please enter proper email address ."}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                                    <div className="field-label">House/Flat No</div>
                                                                                    <input type="text" className={`${errors.houseNo ? "error_border" : ""}`}
                                                                                        name="houseNo"
                                                                                        {...register("houseNo")}
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                                    <div className="field-label">Street</div>
                                                                                    <input
                                                                                        className={`${errors.street ? "error_border" : ""}`}
                                                                                        type="text"
                                                                                        name="street"
                                                                                        {...register("street", { required: true, min: 5, max: 120 })}
                                                                                        placeholder="Street address"
                                                                                    />
                                                                                    <span className="error-message">{errors.street && "Please enter your address."}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                                    <div className="field-label">Landmark</div>
                                                                                    <input
                                                                                        className={`${errors.landmark ? "error_border" : ""}`}
                                                                                        type="text"
                                                                                        name="landmark"
                                                                                        {...register("landmark")}
                                                                                        placeholder="Landmark"
                                                                                    />
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                                    <div className="field-label">Town/City</div>
                                                                                    <input
                                                                                        type="text"
                                                                                        className={`${errors.city ? "error_border" : ""}`}
                                                                                        name="city"
                                                                                        {...register("city", { required: true })}
                                                                                    />
                                                                                    <span className="error-message">{errors.city && "City is required"}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                                                    <div className="field-label">State / County</div>
                                                                                    <input
                                                                                        type="text"
                                                                                        className={`${errors.state ? "error_border" : ""}`}
                                                                                        name="state"
                                                                                        {...register("state", { required: true })}
                                                                                    />
                                                                                    <span className="error-message">{errors.state && "State is required"}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                                                    <div className="field-label">Postal Code</div>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="postalcode"
                                                                                        className={`${errors.postalcode ? "error_border" : ""}`}
                                                                                        {...register("postalcode", { pattern: /\d+/ })}
                                                                                    />
                                                                                    <span className="error-message">{errors.postalcode && "Postal code is required"}</span>
                                                                                </div>
                                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                                    <div className="field-label">Country</div>
                                                                                    <input type="text" className={`${errors.country ? "error_border" : ""}`}
                                                                                        name="country"
                                                                                        {...register("country", { required: true })}
                                                                                       
                                                                                    />
                                                                                    <span className="error-message">{errors.country && "Country is required"}</span>
                                                                                </div>
                                                                            </div>
                                                                            <br />
                                                                            <Button type="submit" className="btn-solid btn">
                                                                                Save Address
                                                                            </Button>
                                                                        </div>
                                                                    )}
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
                                                <Col lg="9" sm="12" xs="12" style={{ paddingLeft: '40px' }}>
                                                    {newAddressFormVisible && (
                                                        <div>
                                                            <div className="row check-out" style={{ paddingTop: '30px' }}>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">First Name</div>
                                                                    <input type="text"
                                                                        className={`${errors.firstName ? "error_border" : ""}`}
                                                                        name="firstName"
                                                                        {...register("firstName", { required: true })}
                                                                    />
                                                                    <span className="error-message">{errors.firstName && "First name is required"}</span>
                                                                </div>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Last Name</div>
                                                                    <input type="text"
                                                                        className={`${errors.lastName ? "error_border" : ""}`}
                                                                        name="lastName"
                                                                        {...register("lastName")}
                                                                    />
                                                                    <span className="error-message">{errors.lastName && "Last name is required"}</span>
                                                                </div>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Phone</div>
                                                                    <input type="text"
                                                                        name="phone" className={`${errors.phone ? "error_border" : ""}`} {...register("phone", { pattern: /\d+/ })}
                                                                    />
                                                                    <span className="error-message">{errors.phone && "Please enter number for phone."}</span>
                                                                </div>
                                                                <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Alternative Phone</div>
                                                                    <input type="text" name="alternativePhone"
                                                                        className={`${errors.alternativePhone ? "error_border" : ""}`}
                                                                        {...register("alternativePhone", { pattern: /\d+/ })}
                                                                    />
                                                                    <span className="error-message">{errors.alternativePhone && "Please enter number for phone."}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Email Address</div>
                                                                    <input
                                                                        className={`${errors.email ? "error_border" : ""}`}
                                                                        type="text"
                                                                        name="email"
                                                                        {...register("email", {
                                                                            pattern: /^\S+@\S+$/i,
                                                                        })}
                                                                    />
                                                                    <span className="error-message">{errors.email && "Please enter proper email address ."}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">House/Flat No</div>
                                                                    <input type="text" className={`${errors.houseNo ? "error_border" : ""}`}
                                                                        name="houseNo"
                                                                        {...register("houseNo")}
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Street</div>
                                                                    <input
                                                                        className={`${errors.street ? "error_border" : ""}`}
                                                                        type="text"
                                                                        name="street"
                                                                        {...register("street", { required: true, min: 5, max: 120 })}
                                                                        placeholder="Street address"
                                                                    />
                                                                    <span className="error-message">{errors.street && "Please enter your address."}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Landmark</div>
                                                                    <input
                                                                        className={`${errors.landmark ? "error_border" : ""}`}
                                                                        type="text"
                                                                        name="landmark"
                                                                        {...register("landmark")}
                                                                        placeholder="Landmark"
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Town/City</div>
                                                                    <input
                                                                        type="text"
                                                                        className={`${errors.city ? "error_border" : ""}`}
                                                                        name="city"
                                                                        {...register("city", { required: true })}
                                                                    />
                                                                    <span className="error-message">{errors.city && "City is required"}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                                    <div className="field-label">State / County</div>
                                                                    <input
                                                                        type="text"
                                                                        className={`${errors.state ? "error_border" : ""}`}
                                                                        name="state"
                                                                        {...register("state", { required: true })}
                                                                    />
                                                                    <span className="error-message">{errors.state && "State is required"}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                                                    <div className="field-label">Postal Code</div>
                                                                    <input
                                                                        type="text"
                                                                        name="postalcode"
                                                                        className={`${errors.postalcode ? "error_border" : ""}`}
                                                                        {...register("postalcode", { pattern: /\d+/ })}
                                                                    />
                                                                    <span className="error-message">{errors.postalcode && "Postal code is required"}</span>
                                                                </div>
                                                                <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                                                    <div className="field-label">Country</div>
                                                                    <input type="text" className={`${errors.country ? "error_border" : ""}`}
                                                                        name="country"
                                                                        {...register("country", { required: true })}
                                                                    />
                                                                    <span className="error-message">{errors.country && "Country is required"}</span>
                                                                </div>
                                                            </div>
                                                            <br />
                                                            <Button type="submit" className="btn-solid btn">
                                                                Add Address
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
