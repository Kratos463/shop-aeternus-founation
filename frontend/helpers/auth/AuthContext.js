import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getConfig } from '../utils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState([]);
  const [token, setToken] = useState(null);
  const [wallet, setWallet] = useState({})

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      getAddressDetails()
    }
    if (user?.mfvUser === true) {
      getWalletDetails()
    }
  }, [user]);



  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.API_URL}/api/v1/user/current-user`, getConfig());
      const user = response.data.data;
      setUser(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const getAddressDetails = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/v1/user/get-shipping-address`, getConfig());
      if (response.data.success) {
        setUserAddress(response.data.data.address);
      }
    } catch (error) {
      console.error("Error getting user address:", error.message);
      toast.error("Error getting address");
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    try {

      const response = await axios.post(`${process.env.API_URL}/api/v1/user/login`, { identifier, password }, getConfig());

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        fetchUserDetails();
        router.push("/");
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.API_URL}/api/v1/user/logout`, {}, getConfig());
      localStorage.removeItem('token');
      router.push("/");
      setToken(null);
      setUser(null);
      toast.success("Logout successful");
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("Error logging out");
    }
  };

  const updateUserDetails = async (userInfo) => {
    try {
      const response = await axios.patch(`${process.env.API_URL}/api/v1/user/update-user-profile`, userInfo, getConfig());
      if (response.data.success) {
        toast.success("User updated");
        setUser(prevUser => ({ ...prevUser, ...userInfo }));
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error while updating user details:", error);
      toast.error("Error updating user details");
    }
  };

  const updateUserPassword = async (password) => {
    try {
      const response = await axios.post(`${process.env.API_URL}/api/v1/user/change-password`, {
        oldPassword: password.oldPassword,
        newPassword: password.newPassword
      }, getConfig());
      if (response.data.success) {
        toast.success("Password updated");
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      console.error("Error while updating password:", error);
      toast.error("Error updating password");
    }
  };

  const addAddress = async (address) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/api/v1/user/add-shipping-address`, { address }, getConfig());
      if (response.data.success) {
        toast.success("Address Saved");
        getAddressDetails();
      } else {
        toast.error("Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(error.response?.data?.error || "Error in address saved");
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (addressId) => {
    try {
      const response = await axios.delete(`${process.env.API_URL}/api/v1/user/remove-shipping-address/${addressId}`, getConfig());
      if (response.data.success) {
        toast.success("Address Removed");
        getAddressDetails();
      } else {
        toast.error("Failed to remove address");
      }
    } catch (error) {
      console.error("Error removing address:", error);
      toast.error(error.response?.data?.error || "Error in address removed");
    }
  };

  const editAddress = async (address) => {
    try {
      const response = await axios.patch(`${process.env.API_URL}/api/v1/user/update-shipping-address`, { address }, getConfig());

      if (response.data.success) {
        toast.success("Address updated..")
        getAddressDetails();
      } else {
        // toast.error("Failed to update address..")
      }

    } catch (error) {
      console.error("Error in updating address", error)
      toast.error(error.response?.data?.error || "Error in updating addres...")
    }

  }

  const getWalletDetails = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/api/v1/wallet`, getConfig())
      setWallet(response.data.data)
    } catch (error) {
      console.error("Error in updating address", error)
    }
  }



  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, updateUserDetails, updateUserPassword,
      userAddress, addAddress, removeAddress, editAddress,
      getWalletDetails, wallet, setWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
