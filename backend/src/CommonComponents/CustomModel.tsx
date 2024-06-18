//@ts-nocheck
import React from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomModel = ({ isOpen, toggle, title, content, handleSubmit }) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h5 className="modal-title f-w-600">{title}</h5>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleFormSubmit}>
          {content.map((field) => (
            <FormGroup key={field.name}>
              <Label htmlFor={field.name} className="col-form-label">
                {field.label}:
              </Label>
              <Input
                id={field.name}
                type={field.type}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormGroup>
          ))}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleFormSubmit}>
          Save Changes
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
      <ToastContainer />
    </Modal>
  );
};

export default CustomModel;
