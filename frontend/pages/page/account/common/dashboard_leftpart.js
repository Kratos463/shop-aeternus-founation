import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../helpers/auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';



const Dashboard_LeftPart = () => {
  const { user, logout } = useAuth();
  const [accountInfo, setAccountInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
      if (window.innerWidth > 991) {
        setAccountInfo(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleAccountInfo = () => {
    setAccountInfo(!accountInfo);
  };

  return (
    <div>
      {isMobile && (
        <div className="account-sidebar" onClick={toggleAccountInfo}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      )}
      <div className="dashboard-left" style={accountInfo ? { left: '0px' } : {}}>
        {isMobile && (
          <div className="collection-mobile-back" onClick={toggleAccountInfo}>
            <span className="filter-back">
              <i className="fa fa-angle-left" aria-hidden="true"></i> back
            </span>
          </div>
        )}
        <div className="block-content">
          <ul>
            <li className="active">
              <Link href="/page/account/dashboard">Account Info</Link>
            </li>
            <li>
              <Link href="/page/account/address-book">Address Book</Link>
            </li>
            <li>
              <Link href="/page/account/orders">My Orders</Link>
            </li>
            <li>
              <Link href="/page/account/cart">My Cart</Link>
            </li>
            <li>
              <Link href="/page/account/wishlist">My Wishlist</Link>
            </li>
            <li>
              <Link href="/page/account/edit-profile">Edit Profile</Link>
            </li>
            {
              user?.mfvUser && (
                <>
                  <li>
                    <Link href="/page/account/wallet">Wallet</Link>
                  </li>
                </>
              )
            }
            <li>
              <Link href="/page/account/vouchers">My Vouchers</Link>
            </li>
            <li>
              <Link href="/page/account/change-pwd">Change Password</Link>
            </li>
            <li className="last" onClick={logout}>
              <Link href="#">Log Out</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_LeftPart;
