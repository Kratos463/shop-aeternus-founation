import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { getConfig } from '../utils';
import { useAuth } from '../auth/AuthContext';

const VoucherContext = createContext();

export const useVoucher = () => useContext(VoucherContext);

export const VoucherProvider = ({ children }) => {

    const { user } = useAuth();

    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        if (user?.mfvUser === true) {
            getVouchers();
        }
    }, [user]);

    const getVouchers = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/v1/voucher/get-vouchers?email=${user.email}`, getConfig());
            setVouchers(response.data.data.vouchers);
        } catch (error) {
            console.error("Error in fetching vouchers", error);
        }
    };

    return (
        <VoucherContext.Provider value={{ vouchers, getVouchers }}>
            {children}
        </VoucherContext.Provider>
    );
};

export default VoucherProvider;
