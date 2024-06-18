import React, { useState } from "react";
import CommonLayout from "../../components/shop/common-layout";
import {
    Collapse,
    Card,
    CardHeader,
    Container,
    Row,
    Col,
    Button,
} from "reactstrap";


const PrivacyPage = () => {
    return (
        <>
            <CommonLayout parent="home" title="Privacy Policy">
                <section className="privacy-page section-b-space">
                    <Container>
                        <Row>
                            <Col>
                                <h3>Privacy Policy</h3>
                                <div className="privacy-box">
                                    <p className="desc">
                                        We value the trust you placed on us, and we appreciate it. That's why we secure your information upon the highest standards for secure transactions and customer information privacy.
                                        Please read the following explanation to know about how collect and process your information gathering and dissemination practices.
                                    </p>
                                    <p className="bold-text">
                                        By using Aeternus Foundation Corporation Services, you are allowing to the practices described in this Privacy Declaration.
                                    </p>
                                    <h5>Note:</h5>
                                    <p className="desc">
                                        We may change our privacy policy at any time. To make sure you are aware of any changes, please review this policy often.
                                        <br />
                                        By visiting you agree to be bound by the terms and conditions of our Privacy Policy. If you're not, so please do not use or access our Website.
                                    </p>
                                    <div className="ques-box">
                                        <p className="ques">What personal and other information does Aeternus Foundation Corporation collects from you?</p>
                                        <p className="desc">We collect your personal and other information to provide and continually improve our products and services.
                                            <br />
                                            Here is the detailed description of the information we collect:</p>
                                        <p className="desc">
                                            Information you give us we receive and store any information you provide to Aeternus Foundation Corporation on time to time. Our initial goal in doing this is to provide you with a safe, efficient, quick and customized experience.
                                        </p>
                                        <p className="desc">
                                            We show which fields are required and which fields are optional. You always have the option not to provide information which is not required. We may automatically track certain information about you based upon your behaviour on Aeternus Foundation Corporation website. We use this information to do in-house research on our users' through analytics i.e demographics, interests, and behaviour to understand, protect and serve our users in a better way.
                                        </p>
                                        <p className="desc">
                                            This information is compiled and analysed on an aggregated basis. This information may include the URL that you just came from, which URL you next go to, your computer browser information, and your IP address.
                                        </p>
                                        <p className="desc">
                                            We use data collection devices such as "cookies" on certain pages of the Website to help analyse our web page flow, measure promotional effectiveness, and promote trust and safety. "Cookies" are small files placed on your hard drive that assist us in providing our services. We also use cookies to allow you to enter your password less frequently during a session. Cookies can also help us provide information that is targeted to your interests. Most cookies are "session cookies," meaning that they are automatically deleted from your hard drive at the end of a session. You are always free to decline our cookies if your browser permits, although in that case, you may not be able to use certain features on the Website and you may be required to re-enter your password more frequently during a session.
                                            If you wish to buy anything from the , we collect information about your buying product, preferences, and other such information that you choose to provide.
                                        </p>
                                        <p className="desc">
                                            If you wish to buy anything from the , we collect information about your buying product, preferences, and other such information that you choose to provide.
                                        </p>
                                        <p className="desc">
                                            If you transact with us, we collect some additional information, such as a billing address, a credit/debit card number and a credit/debit card expiration date and/ or other payment instrument details and tracking information.
                                        </p>
                                        <p className="desc">
                                            We retain this information as necessary to resolve conflicts, provide customer support and troubleshoot problems as permitted by law.
                                        </p>
                                        <p className="desc">
                                            If you send us personal correspondence, such as emails or letters, or if other users or third parties send us correspondence about your activities or postings on the Website, we may collect such information.
                                        </p>
                                        <p className="desc">
                                            We collect personally identifiable information (email address, name, phone number, credit card / debit card / other payment instrument details, etc.) from you when you set up a account with us. We do use your contact information to send you offers based on your previous orders and your interests.
                                        </p>
                                    </div>
                                    <div className="ques-box">
                                        <p className="ques">Use of Demographic / Profile Data / Your Information</p>
                                        <p className="desc">
                                            We use personal information to provide the services or products you request. To the extent, we use your personal information for re-marketing to you. We use your personal information to support sellers in handling and fulfilling orders, enhancing customer experience, resolve disputes, troubleshoot problems, help promote a safe service, collect money, measure consumer interest in our products and services, inform you about online and offline offers, products, services, and latest updates, customize and enhance your experience with Aeternus Foundation Corporation, detect and protect us against error, fraud and other criminal activity, enforce our terms and conditions, and as otherwise described to you at the time of collection.
                                        </p>
                                        <p className="desc">
                                            With your permission, we will have access to your SMS, contacts in your direct, location and device information and we may request you to provide your PAN and Know-Your-Customer (KYC) details to check your eligibility for certain products/services including to credit and payment products etc. to enhance your experience on the platform and provide you access to the services being offered by us, our members or lending partners. Access, storage and use of this data will be in consonance with applicable laws.
                                        </p>
                                        <p className="desc">
                                            In our efforts to continually improve our product and service offerings, we and our members collect and analyse demographic and profile data about our user's activity on Aeternus Foundation Corporation.
                                            We identify and use your IP address to help diagnose problems with our server and to administer our Website. Your IP address is also used to help identify you and to gather demographic information.
                                        </p>
                                    </div>
                                </div>

                                <h3>How Secured is your information with us?</h3>
                                <div className="secured-box">
                                    <p className="desc">
                                        We design our policies with your security and privacy.
                                    </p>
                                    <div className="ques-box">
                                        <ul style={{ listStyle: "disc" }}>
                                            <li>
                                                We work to protect the security of your personal information during transmission by using encryption protocols and software
                                            </li>
                                            <li>
                                            We follow the Payment Card Industry Data Security Standard when handling credit card data.
                                            </li>
                                            <li>
                                            We maintain physical, electronic, and procedural safeguards in connection with the collection, storage, and disclosure of personal customer information. Our security procedures mean that we may occasionally request proof of identity before we disclose personal information to you.
                                            </li>
                                            <li>
                                            Our devices offer security features to protect them against unauthorized access and loss of data. You can control these features and configure them based on your needs. 
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <h3>Cookies</h3>
                                <div className="cookies-box">
                                    <p className="desc">When you use our Services, we and some third parties may use cookies and similar technologies to provide you with a safer, more durable and better user experience. Cookies are short text files that are automatically created by your browser and stored on your device when you use the Services. Cookies are useful for enabling the browser to remember information specific to a given user. The cookies do not contain any of your personally identifiable information.</p>
                                    <div className="ques-box">
                                        <p className="ques">Links to another site</p>
                                        <p className="desc">Our Website links to other websites that may collect personally identifiable information about you. Aeternus Foundation Corporation is not responsible for the privacy practices or the content of those linked websites.</p>
                                        <p className="ques">Security Precautions</p>
                                        <p className="desc">Aeternus Foundation Corporation has powerful security measures to protect the loss, misuse, and modification of the information under our control. Whenever you change or access your account information, we offer the use of a secure server. Once your information is in our possession we adhere to strict security guidelines, protecting it against unauthorized access.</p>
                                        <p className="ques">Your Acquiescence</p>
                                        <p className="desc">By using the Aeternus Foundation Corporation website or by providing your data, you permit to the collection and use of the information you disclose on the Website by this Privacy Policy, including your permission for sharing your information as per this privacy policy. If you disclose any personal information related to other people to us, you represent that you have the authority to do so and to permit us to use the information by this Privacy Policy.</p>
                                    </div>
                                </div>

                                <p className="bold-text">If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it.</p>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </CommonLayout>
        </>
    );
};

export default PrivacyPage; 
