import { Fragment, useEffect } from "react";
import { Card, CardBody, Col, Container, Row, Spinner } from "reactstrap";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { getDiscounts } from "@/Redux/discount";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";

const ListCoupons = () => {
  const dispatch = useAppDispatch();
  const { discounts, isLoading, error } = useAppSelector((state) => state.DiscountReducer);

  useEffect(() => {
    dispatch(getDiscounts());
  }, [dispatch]);

  // Specify fields to show in the datatable, excluding fields like '__v'
  const fieldsToShow = ['startingPrice', 'endingPrice', 'discountPercentage'];

  return (
    <Fragment>
      <CommonBreadcrumb title="List Coupons" parent="Coupons" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Discount Category" />
              <CardBody>
                <div id="batchDelete" className="category-table order-table coupon-list-delete">
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <Datatable
                      multiSelectOption={false}
                      myData={discounts}
                      pageSize={10}
                      pagination={true}
                      className="-striped -highlight"
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

export default ListCoupons;
