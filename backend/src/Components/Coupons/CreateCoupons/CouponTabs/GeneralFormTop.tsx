import { useState } from "react";
import { Button, Col, FormGroup, Input, Label, Row, Spinner } from "reactstrap";
import { useAppDispatch } from "@/Redux/Hooks";
import { createDiscount } from "@/Redux/discount";

const GeneFormTop = () => {
  const dispatch = useAppDispatch();

  const [formValues, setFormValues] = useState({
    startingPrice: 0,
    endingPrice: 0,
    discountPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state

  const handleInputChange = (e:any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateDiscount = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      await dispatch(
        createDiscount({
          startingPrice: formValues.startingPrice,
          endingPrice: formValues.endingPrice,
          discountPercentage: formValues.discountPercentage,
        })
      );
      // Reset form after successful creation
      setFormValues({
        startingPrice: 0,
        endingPrice: 0,
        discountPercentage: 0,
      });
    } catch (error) {
      console.error("Failed to create discount:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>* Starting Price</Label>
          </Col>
          <Col md="7">
            <Input
              type="number"
              name="startingPrice"
              value={formValues.startingPrice}
              onChange={handleInputChange}
              required
            />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>* Ending Price</Label>
          </Col>
          <Col md="7">
            <Input
              type="number"
              name="endingPrice"
              value={formValues.endingPrice}
              onChange={handleInputChange}
              required
            />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>* Discount Percentage</Label>
          </Col>
          <Col md="7">
            <Input
              type="number"
              name="discountPercentage"
              value={formValues.discountPercentage}
              onChange={handleInputChange}
              required
            />
          </Col>
        </Row>
      </FormGroup>
      <Button className="pull-right" onClick={handleCreateDiscount}>
        {isLoading ? (
          <Spinner size="sm" color="light" /> // Show spinner while saving
        ) : (
          "Save"
        )}
      </Button>
    </>
  );
};

export default GeneFormTop;
