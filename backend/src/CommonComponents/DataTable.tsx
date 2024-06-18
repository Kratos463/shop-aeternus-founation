//@ts-nocheck
import dynamic from "next/dynamic";
import { Fragment, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
const DataTable = dynamic(() => import("react-data-table-component"), { ssr: false });

const Datatable = ({ myData, myClass, multiSelectOption, pagination, fieldsToShow }: any) => {
  const [open, setOpen] = useState(false);
  const [checkedValues, setCheckedValues] = useState([]);
  const [data, setData] = useState(myData);
  
  const selectRow = (e, i) => {
    if (!e.target.checked) {
      setCheckedValues(checkedValues.filter((item, j) => i !== item));
    } else {
      checkedValues.push(i);
      setCheckedValues(checkedValues);
    }
  };

  const handleRemoveRow = () => {
    const updatedData = myData.filter(function (el) {
      return checkedValues.indexOf(el.id) < 0;
    });
    setData([...updatedData]);
    toast.success("Successfully Deleted !");
  };

  const renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          data[cellInfo.index][cellInfo.index.id] = e.target.innerHTML;
          setData([...data]); // Update state correctly
        }}
        dangerouslySetInnerHTML={{
          __html: myData[cellInfo.index][cellInfo.index.id],
        }}
      />
    );
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you wish to delete this item?")) {
      const del = data;
      del.splice(index, 1);
      setData([...del]);
      toast.success("Successfully Deleted !");
    }
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
  };

  const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Generate columns based on fieldsToShow
  const columns = fieldsToShow?.map((key) => ({
    name: <b>{Capitalize(key)}</b>,
    header: <b>{Capitalize(key)}</b>,
    selector: (row) => {
      // Check if the value is boolean and return appropriate string or icon
      const value = row[key];
      if (typeof value === 'boolean') {
        return value ? "Yes" : "No";
      }
      return value;
    },
    style: {
      textAlign: "center",
    },
  }));

  // Add action column if not using multiSelectOption
  if (!multiSelectOption) {
    columns?.push({
      name: <b>Action</b>,
      id: "delete",
      accessor: (str) => "delete",
      cell: (row, index) => (
        <div>
          <span onClick={() => handleDelete(index)}>
            <i
              className="fa fa-trash"
              style={{
                width: 35,
                fontSize: 20,
                padding: 11,
                color: "#e4566e",
                cursor: "pointer",
              }}
            ></i>
          </span>

          <span>
            <i
              onClick={onOpenModal}
              className="fa fa-pencil"
              style={{
                width: 35,
                fontSize: 20,
                padding: 11,
                color: "rgb(40, 167, 69)",
                cursor: "pointer",
              }}
            ></i>
            <Modal isOpen={open} toggle={onCloseModal} style={{ overlay: { opacity: 0.1 } }}>
              <ModalHeader toggle={onCloseModal}>
                <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                  Edit Product
                </h5>
              </ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label htmlFor="recipient-name" className="col-form-label">
                      Category Name :
                    </Label>
                    <Input type="text" />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="message-text" className="col-form-label">
                      Category Image :
                    </Label>
                    <Input id="validationCustom02" type="file" />
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button type="button" color="primary" onClick={() => onCloseModal("VaryingMdo")}>
                  Update
                </Button>
                <Button type="button" color="secondary" onClick={() => onCloseModal("VaryingMdo")}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          </span>
        </div>
      ),
      style: {
        textAlign: "center",
      },
      sortable: false,
    });
  }

  return (
    <div>
      <Fragment>
        <DataTable data={data} columns={columns} className={myClass} pagination={pagination} striped={true} center={true} />

        <ToastContainer />
      </Fragment>
    </div>
  );
};

export default Datatable;
