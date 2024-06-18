import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { login } from "@/Redux/Auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner } from "reactstrap";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((store) => store.AuthReducer);
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);

  const [showPassWord, setShowPassWord] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formValues; 
  const router = useRouter();

  const handleUserValue = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const formSubmitHandle = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await dispatch(login({ identifier: email, password })).unwrap();
      Cookies.set("token", response.token);
      router.push(`${process.env.PUBLIC_URL}/${i18LangStatus}/dashboard`);
      toast.success("Login successful");
    } catch (err) {
      toast.error("Please enter a valid email or password");
    }
  };

  return (
    <Form className="form-horizontal auth-form" onSubmit={formSubmitHandle}>
      <FormGroup>
        <Input
          required
          onChange={handleUserValue}
          type="email"
          value={formValues.email}
          placeholder="Email"
          id="exampleInputEmail1"
          name="email"
        />
      </FormGroup>
      <FormGroup>
        <InputGroup>
          <Input
            required
            onChange={handleUserValue}
            type={showPassWord ? "text" : "password"}
            value={formValues.password}
            placeholder="Password"
            name="password"
          />
          <InputGroupText onClick={() => setShowPassWord(!showPassWord)}>
            {showPassWord ? <Eye /> : <EyeOff />}
          </InputGroupText>
        </InputGroup>
      </FormGroup>
      <div className="form-terms">
        <div className="custom-control custom-checkbox me-sm-2">
          <Label className="d-block">
            <Input className="checkbox_animated" id="chk-ani2" type="checkbox" />
            Remember Me
            <span className="pull-right">
              <Button color="transparent" className="forgot-pass p-0">
                Lost your password?
              </Button>
            </span>
          </Label>
        </div>
      </div>
      <div className="form-button">
        <Button color="primary" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : "Login"}
        </Button>
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </Form>
  );
};

export default LoginForm;
