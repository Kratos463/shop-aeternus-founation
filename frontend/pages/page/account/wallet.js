import React, { useContext, useState } from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';
import CommonLayout from '../../../components/shop/common-layout';
import Dashboard_LeftPart from './common/dashboard_leftpart';
import { useAuth } from '../../../helpers/auth/AuthContext';
import { extractDateFromISO } from '../../../helpers/utils';
import { CurrencyContext } from '../../../helpers/Currency/CurrencyContext';
import ReactPaginate from 'react-paginate';

const WalletPage = () => {

    const { state: selectedCurr } = useContext(CurrencyContext);
    const { user, getWalletDetails, wallet } = useAuth();
    const [filter, setFilter] = useState('all');
    const [pageNumber, setPageNumber] = useState(0);
    const transactionsPerPage = 6;
    const pagesVisited = pageNumber * transactionsPerPage;

    // Function to handle filter change
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setPageNumber(0); // Reset page number when filter changes
    };

    // Function to filter transactions based on filter option
    const filteredTransactions = filter === 'all' ? wallet?.transactions : wallet?.transactions.filter(transaction => transaction.type === filter);

    const displayTransactions = filteredTransactions?.slice(pagesVisited, pagesVisited + transactionsPerPage).map(transaction => (
        <tr key={transaction.id} className={transaction.type}>
            <td>{transaction.id}</td>
            <td>{transaction.type}</td>
            <td className={transaction.type === 'deposit' ? 'deposit' : 'withdrawal'}>{selectedCurr.symbol}{transaction?.amount}</td>
            <td>{extractDateFromISO(transaction.createdAt)}</td>
        </tr>
    ));

    const pageCount = Math.ceil(filteredTransactions?.length / transactionsPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <CommonLayout parent="home" title="profile">
            <section className="wallet-page section-b-space">
                <Container>
                    <Row>
                        <Col lg="3">
                            <Dashboard_LeftPart />
                        </Col>
                        <Col lg='9'>
                            <div className='dashboard-right'>
                                <div className='dashboard'>
                                    <Col sm="12">
                                        <div className="balance-strip">
                                            <p className="balance">
                                                Current Balance: {selectedCurr.symbol}
                                                {(wallet && wallet.amount !== undefined && wallet.amount !== 0) ? wallet.amount.toFixed(2) : "0.00"}
                                            </p>

                                            <Button className="refresh-btn" color="secondary" size="sm" onClick={() => getWalletDetails()}>Refresh</Button>
                                        </div>
                                        <div className="filter">
                                            <h5>Transaction History</h5>
                                            <select onChange={handleFilterChange} value={filter}>
                                                <option value="all">All Transactions</option>
                                                <option value="deposit">Deposits</option>
                                                <option value="withdrawal">Withdrawals</option>
                                            </select>
                                        </div>
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Transaction ID</th>
                                                    <th>Type</th>
                                                    <th>Amount</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayTransactions}
                                            </tbody>
                                        </Table>
                                        <div className="pagination-wrapper">
                                            <ReactPaginate
                                                previousLabel={'Previous'}
                                                nextLabel={'Next'}
                                                pageCount={pageCount}
                                                onPageChange={changePage}
                                                containerClassName={'pagination'}
                                                previousLinkClassName={'pagination__link'}
                                                nextLinkClassName={'pagination__link'}
                                                disabledClassName={'pagination__link--disabled'}
                                                activeClassName={'pagination__link--active'}
                                            />
                                        </div>
                                    </Col>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <style jsx>{`
                .wallet-page {
                    padding-top: 30px;
                    padding-bottom: 50px;
                }

                .balance-strip {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    background: green;
                    padding: 10px 5px;
                }
                
                .balance {
                    color: white;
                    font-size: 24px;
                    margin: 0;
                }

                .refresh-btn {
                    font-size: 14px;
                }

                .filter {
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                }

                .filter select {
                    padding: 5px;
                    font-size: 16px;
                }

                .deposit {
                    color: green; /* Green color for deposit amount */
                }

                .withdrawal {
                    color: red; /* Red color for withdrawal amount */
                }

                .pagination-wrapper {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20px;
                }

                @media (max-width: 768px) {
                    .balance-strip {
                        padding: 10px; 
                    }

                    .balance {
                        font-size: 18px; 
                    }

                    .refresh-btn {
                        font-size: 10px; 
                    }
                }
            `}</style>
        </CommonLayout>
    );
};

export default WalletPage;
