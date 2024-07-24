import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { deleteProduct, getProducts } from "../admin/helper/adminapicall";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const { user, token } = isAuthenticated();
  const preload = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };
  useEffect(() => {
    preload();
  }, []);

  const deleteThisProduct = (productId) => {
    deleteProduct(productId, user._id, token)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          preload();
        }
      })
      .catch();
  };

  return (
    <Base title="Welcome admin" description="Manage products here">
      <Link className="btn btn-info mb-2" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <h2 className="mb-4">All products:</h2>

      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">{`Total ${products.length} products`}</h2>

          {products.map((product, index) => (
            <div key={index} className="row bg-heading text-center mb-2 ">
              <div className="col-4">
                <h3>
                  {`${product.name}`}{" "}
                  <span className="badge badge-secondary">{`Rs.${product.price}`}</span>
                </h3>
              </div>
              <div className="col-4">
                <Link
                  className="btn btn-success autoMargin-TB"
                  to={`/admin/product/update/${product._id}`}
                >
                  <span className="">Update</span>
                </Link>
              </div>
              <div className="col-4">
                <button
                  onClick={() => {
                    deleteThisProduct(product._id);
                  }}
                  className="btn btn-danger autoMargin-TB"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Base>
  );
};

export default ManageProducts;
