import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { getUser, updateUser } from "../user/helper/userapicalls";
import { isAuthenticated, signout } from "../auth/helper";

const ProfileEdit = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });
  const [checkPass, setCheckPass] = useState("");
  const { user, token } = isAuthenticated();
  const { name, email, password, error, success } = values;

  const preload = () => {
    getUser(user._id, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: true });
      }
      setValues({ ...values, name: data.name, email: data.email });
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const handelChange = (name) => (event) => {
    if (name !== "pass") {
      setValues({ ...values, error: false, [name]: event.target.value });
    } else {
      setCheckPass(event.target.value);
    }
  };

  const signinRedirect = () => {
    if (success) {
      signout(() => <Redirect to="/signin" />);
    }
  };

  const warningMessage = () => {
    if (!checkPass) {
      return;
    } else if (checkPass !== password) {
      return <p className="text-danger">*Password Dosn't match</p>;
    } else {
      return <p className="text-success">*Password matched</p>;
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({
      ...values,
      error: false,
    });
    if (checkPass !== password) {
      alert("Enter Correct Password");
      return;
    }
    let body = {
      name: name,
      email: email,
    };
    if (password) {
      body.password = password;
    }
    updateUser(user._id, token, body).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
        return;
      }
      setValues({
        ...values,
        name: "",
        email: "",
        password: "",
        error: "",
        success: true,
      });
      setCheckPass("");
    });
  };

  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input
                onChange={handelChange("name")}
                value={name}
                className="form-control"
                type="text"
              />
            </div>

            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                onChange={handelChange("email")}
                value={email}
                className="form-control"
                type="email"
              />
            </div>

            <div className="form-group">
              <label className="text-light">New Password</label>
              <input
                onChange={handelChange("password")}
                value={password}
                className="form-control"
                type="password"
              />
            </div>

            <div className="form-group">
              <label className="text-light">Confirm Password</label>
              <input
                onChange={handelChange("pass")}
                value={checkPass}
                className="form-control"
                type="password"
              />
            </div>
            {warningMessage()}
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            Account Updated successfully.
            <Link to="/signin">Login Here</Link>
          </div>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base
      title="Edit Profile"
      description="A page to edit your profile details"
    >
      {successMessage()}
      {errorMessage()}
      {signUpForm()}
      {signinRedirect()}
    </Base>
  );
};

export default ProfileEdit;
