import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { getUserOrders } from "./helper/userapicalls";
import { Link } from "react-router-dom";
import { API } from "../backend";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const UserOrders = () => {
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, token, role } = isAuthenticated();
  const preload = () => {
    getUserOrders(user, token).then((data) => {
      if (data.error) {
        setLoading(false);
        return setError(data.error);
      }
      setOrders(data);
      console.log(orders);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    preload();
  }, []);

  const loadingComp = () => {
    return (
      loading && (
        <div className="d-flex align-items-center mb-3">
          <strong>Loading...</strong>
          <div
            className="spinner-border ml-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )
    );
  };
  const errorComp = () => {
    return (
      error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )
    );
  };
  const ImageHelper = ({ order, close }) => {
    const imageurl = order.prescription.data
      ? `${API}/order/prescription/${order._id}`
      : `https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif`;
    const date = new Date(order.createdAt);
    return (
      <div
        className="rounded text-white bg-dark border border-success p-2 "
        style={{ overflow: "auto", height: "90vh" }}
      >
        <div className="rounded border border-success p-2">
          <center>Prescription Image</center>
          <center>
            <img
              src={imageurl}
              alt="photo"
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              className="mb-3 rounded"
            />
          </center>
        </div>
        <div className="rounded border border-success p-2">
          <h3>User:</h3>
          <p>ID:{order.user._id}</p>
          <p>Name:{order.user.name}</p>
          <h3>Product ordered:</h3>
          <ol>
            {order.products.map((product) => (
              <li>{product.name}</li>
            ))}
          </ol>
          <p>Total Amount:Rs.{order.amount}</p>
          <p>
            Order Date:{date.getDate()}/{date.getMonth() + 1}/
            {date.getFullYear()}
          </p>
        </div>
        <button onClick={close} className="btn btn-danger ml-2">
          Close
        </button>
      </div>
    );
  };
  const loadRows = () => {
    if (orders) {
      return orders.map((order, index) => (
        <tr>
          <th scope="row" key={index + 1}>
            {index + 1}
          </th>
          <td>{order._id}</td>
          <td>{order.transaction_id}</td>
          <td>Rs. {order.amount}</td>
          <td>{order.status}</td>
          <td>
            <Popup
              trigger={
                <button className="btn btn-info ml-2">Open order Detail</button>
              }
              modal
            >
              {(close) => <ImageHelper order={order} close={close} />}
            </Popup>
          </td>
        </tr>
      ));
    }
  };
  return (
    <Base title="Your Orders" description="All your orders and their Status">
      {role === 0 ? (
        <Link
          to="/user/dashboard"
          classNameName="btn btn-md btn-info ml-3 mb-3"
        >
          Back
        </Link>
      ) : (
        <Link
          to="/admin/dashboard"
          classNameName="btn btn-md btn-info ml-3 mb-3"
        >
          Back
        </Link>
      )}
      {loadingComp()}
      {errorComp()}
      <table className="table table-hover table-dark">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Order ID</th>
            <th scope="col">Transaction ID</th>
            <th scope="col">Total Order Amount</th>
            <th scope="col">Order Status</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>{loadRows()}</tbody>
      </table>
    </Base>
  );
};
export default UserOrders;
