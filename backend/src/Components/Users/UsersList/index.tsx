import { Fragment, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { Button, Card, CardBody, CardHeader, Container } from "reactstrap";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import Datatable from "@/CommonComponents/DataTable";
import { RootState } from "@/Redux/Store";
import { getUsers } from "@/Redux/User";
import { useRouter } from "next/navigation";

const UserList = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isLoading, error, users } = useAppSelector((state: RootState) => state.UserReducer);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleCreateUser = () => {
    if (router) {
      router.push("/users/create-user");
    }
  };

  const fieldsToShow = ['email', "username", "firstName", "lastName", "mfvUser", "emailVerified", "phone", "createdAt"];

  return (
    <Fragment>
      <CommonBreadcrumb title="User List" parent="Users" />
      <Container fluid>
        <Card>
          <CardHeader>
            <h5>User Details</h5>
          </CardHeader>
          <CardBody>
            <div className="btn-popup pull-right">
              <Button color="secondary" onClick={handleCreateUser}>
                Create User
              </Button>
            </div>
            <div className="clearfix"></div>
            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete">
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <Datatable
                  multiSelectOption={true}
                  myData={users}
                  pageSize={10}
                  pagination={true}
                  className="-striped -highlight"
                  fieldsToShow={fieldsToShow}
                />
              )}
            </div>
          </CardBody>
        </Card>
      </Container>
    </Fragment>
  );
};

export default UserList;
