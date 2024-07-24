import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { getcategory, updateCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  const [name, setName] = useState("");
  const [tempname, setTempname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { token } = isAuthenticated();

  const preload = () => {
    getcategory(match.params.categoryId)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setSuccess(false);
        } else {
          setTempname(data.name);
          setSuccess(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    preload();
  });

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    console.log(name);
    //backend request fired
    updateCategory(match.params.categoryId, match.params.userId, token, {
      name: name,
    }).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setError("");
        setSuccess(true);
        setName("");
      }
    });
  };
  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Created Successfully</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      console.log(error);
      return <h4 className="text-danger">Failed to Create</h4>;
    }
  };

  const myCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">
          Enter to change <u>{tempname}</u> Category
        </p>
        <input
          type="text"
          autoFocus
          required
          onChange={handleChange}
          value={name}
          placeholder="For eg. Summer"
          className="form-control my-3"
        />
        <button className="btn btn-outline-info" onClick={onSubmit}>
          Update Category
        </button>
      </div>
    </form>
  );

  return (
    <Base
      title="Create a category here"
      description="Add a new category for new tshirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {warningMessage()}
          {successMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
