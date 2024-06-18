import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { getPayments } from "@/Redux/payment-orders";

const SalesTransaction = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, payments } = useAppSelector((state) => state.PayOrdReducer);


  const fieldsToShow = ['transactionId',  'method', 'status', 'amount','username', 'email', 'mfvUser', 'createdAt'];

  useEffect(() => {
    // Fetch payments when component mounts
    dispatch(getPayments());
  }, [dispatch]);

  // Map payments to include user details correctly
  const mappedPayments = payments.map(payment => ({
    ...payment,
    username: payment.user.username,
    email: payment.user.email,
    mfvUser: payment.user.mfvUser
  }));

  return (
    <Fragment>
      <CommonBreadcrumb title="Transactions" parent="Sales" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Transaction Details" />
              <CardBody>
                <div id="batchDelete" className="transactions">
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <Datatable 
                      multiSelectOption={true} 
                      myData={mappedPayments} 
                      pageSize={10} 
                      pagination={true} 
                      class="-striped -highlight"  
                      fieldsToShow={fieldsToShow} 
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default SalesTransaction;
