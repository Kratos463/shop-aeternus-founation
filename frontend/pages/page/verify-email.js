import React from 'react';
import CommonLayout from '../../components/shop/common-layout';
import { Container, Row, Col } from 'reactstrap';
import { useAuth } from '../../helpers/auth/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import emailVerificationImage from '../../public/assets/images/email-verification.png';

const VerifyEmail = () => {
    const { user } = useAuth();

    return (
        <CommonLayout parent="home" title="Verify Email">
            <Container className="py-5" style={styles.container}>
                <Row className="align-items-center">
                    <Col md="6" className="text-center" style={styles.imageCol}>
                        <Image src={emailVerificationImage} alt="Email Verification" layout="responsive" style={styles.image} />
                    </Col>
                    <Col md="6" style={styles.textCol}>
                        <h3 className="mb-3" style={styles.header}>Confirm Your Email</h3>
                        <div className='details' style={styles.details}>
                            <p className="mb-3" style={styles.paragraph}>
                                To ensure the security and privacy of your account, we need you to confirm your email address. 
                                A confirmation email has been sent to
                            </p>
                            <h5 className="mb-3" style={styles.email}>{user?.email}</h5>
                            <p className="mb-3" style={styles.message}>
                                Please click the link in the email to complete your registration. If you didn't receive the email, 
                                click the button below to resend the confirmation email.
                            </p>
                            <Link href="#">
                                <button className="btn btn-primary" style={styles.button}>Resend Confirmation Email</button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </CommonLayout>
    );
};

// Inline CSS styles
const styles = {
    container: {
        paddingTop: '50px',
        paddingBottom: '50px',
    },
    imageCol: {
        marginBottom: '20px', // For better spacing on smaller screens
    },
    textCol: {
        textAlign: 'left',
        paddingLeft: '30px',
        paddingRight: '30px',
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
    },
    header: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#333',
    },
    details: {
        marginTop: '20px',
    },
    paragraph: {
        fontSize: '1.1rem',
        marginBottom: '20px',
        color: '#555',
    },
    email: {
        fontWeight: 'bold',
        color: '#ff4c3b',
    },
    message: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#ff4c3b',
        borderColor: '#ff4c3b',
        color: '#fff',
        padding: '10px 20px',
        textDecoration: 'none',
        borderRadius: '5px',
    },
};

// Responsive Font and Padding Styles
const responsiveStyles = `
    @media (max-width: 768px) {
        ${styles.header} {
            font-size: 1.5rem;
        }
        ${styles.paragraph} {
            font-size: 1rem;
        }
        ${styles.button} {
            padding: 8px 16px;
        }
    }
    @media (max-width: 576px) {
        ${styles.textCol} {
            text-align: center;
            padding-left: 15px;
            padding-right: 15px;
        }
        ${styles.email} {
            font-size: 1rem;
        }
    }
`;

// Inject responsive styles into the document head
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = responsiveStyles
    document.head.appendChild(styleSheet)
}

export default VerifyEmail;
