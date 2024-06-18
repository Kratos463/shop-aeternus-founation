import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { getOrders } from "@/Redux/payment-orders";

const SalesOrders = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, orders } = useAppSelector((state) => state.PayOrdReducer);

  const fieldsToShow = ['orderId', 'image', 'status', 'payment_method', 'order_status', 'date', 'totalPayAmount'];

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const mappedOrders = orders.map(order => ({
    ...order,
    orderId: order.orderId,
    image: order.items.Medium_file,
    status: order.status,
    payment_method: order.payment_method,
    order_status: order.order_status,
    date: order.date,
    total: order.total,
  }));

  return (
    <Fragment>
      <CommonBreadcrumb title="Orders" parent="Sales" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Manage Orders" />
              <CardBody className="order-datatable">
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <Datatable
                    multiSelectOption={false}
                    myData={mappedOrders}
                    pageSize={10}
                    pagination={true}
                    className="-striped -highlight"
                    fieldsToShow={fieldsToShow}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default SalesOrders;
