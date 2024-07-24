import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { deleteThisCategory, getCategories } from "./helper/adminapicall";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const { user, token } = isAuthenticated();

  const preload = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    preload();
  });

  const deleteCategory = (categoryId) => {
    deleteThisCategory(user._id, categoryId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base
      title="Welcome admin"
      description="Manage categories here"
      className="container  p-4"
    >
      <Link className="btn btn-info mb-2" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <h2 className="mb-4">
        <u>All categories:</u>
      </h2>

      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">
            Total {`${categories.length}`} category found!
          </h2>

          {categories.map((category, index) => {
            return (
              <div key={index} className="row text-center mb-2 ml-4">
                <div className="col-sm  ">
                  <h3 className="text-white text-left">{category.name}</h3>
                </div>
                {/* <div className="col-sm">
                  <Link
                    className="btn btn-success"
                    to={`/admin/cateory/update/${category._id}/${user._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div> */}
                <div className="col-sm">
                  <button
                    onClick={() => {
                      deleteCategory(category._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageCategories;
