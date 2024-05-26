import React from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import CheckoutPage from './common/checkout-page';
import Login from '../../page/account/login-auth'
import { useAuth } from '../../../helpers/auth/AuthContext';

const Checkout = () => {
    
    const {user} = useAuth()

    return (
        <>
            {user !== null ?
                <CommonLayout parent="home" title="checkout">
                    <CheckoutPage />
                </CommonLayout>
                :
                <Login />
            }
        </>
    )
}

export default Checkout;