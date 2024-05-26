
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../helpers/auth/AuthContext';

const Dashboard_LeftPart = () => {

const {logout}=useAuth()
const [accountInfo,setAccountInfo]= useState(false)

    return (
        <div>
            {window.innerWidth <=991?
          <div className="account-sidebar" onClick={()=>setAccountInfo(!accountInfo)}>
            <a className="popup-btn">my account</a> </div>: ""}
            <div className="dashboard-left" style={accountInfo ? { left: "0px" } : {}}>
                <div className="collection-mobile-back" onClick={() => setAccountInfo(!accountInfo)}>
                    <span className="filter-back">
                        <i className="fa fa-angle-left" aria-hidden="true"></i> back
                    </span>
                </div>
                <div className="block-content">
                    <ul>
                        <li className="active"><Link href="/page/account/dashboard">Account Info</Link></li>
                        <li><Link href="/page/account/address-book">Address Book</Link></li>
                        <li><Link href="#">My Orders</Link></li>
                        <li><Link href="/page/account/cart">My Cart</Link></li>
                        <li><Link href="/page/account/wishlist">My Wishlist</Link></li>
                        <li><Link href="/page/account/edit-profile">Edit Profile</Link></li>
                        <li><Link href="/page/account/change-pwd">Change Password</Link></li>
                        <li className="last" onClick={logout}><Link href="#">Log Out</Link></li>
                    </ul>
                </div>
            </div>
        </div>
        
        
    );
};

export default Dashboard_LeftPart;
