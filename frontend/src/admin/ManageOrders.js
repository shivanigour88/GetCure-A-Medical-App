import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { getOrders, updateStatus } from "./helper/adminapicall";
import { API } from "../backend";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sta, setSta] = useState([]);

  const { user, token } = isAuthenticated();
  const preload = (userId, token) => {
    getOrders(userId, token).then((data) => {
      if (data.error) {
        setLoading(false);
        setError(data.error);
      } else {
        setOrders(data);
        console.log(orders);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    preload(user._id, token);
  }, []);
  const errorComp = () => {
    return (
      error && (
        <div class="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )
    );
  };

  const loadingComp = () => {
    return (
      loading && (
        <div class="d-flex align-items-center mb-3">
          <strong>Loading...</strong>
          <div
            class="spinner-border ml-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )
    );
  };

  const changeStatus = (orderId) => (event) => {
    event.preventDefault();

    let i = sta.findIndex((s) => s.orderId === orderId);
    let val = event.target.value;
    if (i === -1) {
      let s = sta;
      s.push({
        orderId: orderId,
        status: val,
      });

      setSta(s);
    } else {
      let s = sta;
      s[i].status = val;
      setSta(s);
    }

    console.log("State:", sta);
  };

  const statusUpdate = (event) => {
    event.preventDefault();
    for (let index = 0; index < sta.length; index++) {
      updateStatus(sta[index], sta[index].orderId, user._id, token).then(
        (data) => {
          if (data.error) {
            setError(data.error);
            return data.error;
          }
          console.log(data);
        }
      );
    }
    alert(`${sta.length} Orders Status Updated!`);
    setSta([]);
    setLoading(false);
  };

  const loadOrders = () => {
    const status = [
      "Cancelled",
      "Delivered",
      "Shipped",
      "Processing",
      "Recieved",
    ];

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

    const options = (status, orderStatus, index) => {
      if (status === orderStatus) {
        return (
          <option key={index} value={status} selected>
            {status}
          </option>
        );
      } else {
        return (
          <option key={index} value={status}>
            {status}
          </option>
        );
      }
    };
    if (orders) {
      return orders.map((order, index) => (
        <tr>
          <th key={index + 1} scope="row">
            {index + 1}.
          </th>

          <td>
            <span>
              <p>
                <span class="badge badge-info">Name: </span>
                {order.user.name}
              </p>
              <br />
              <p>
                <span class="badge badge-info">ID: </span>
                {order.user._id}
              </p>
            </span>
          </td>
          <td>{order._id}</td>
          <td>
            <select
              class="custom-select mb-1"
              onChange={changeStatus(order._id)}
            >
              {status.map((status, index) =>
                options(status, order.status, index)
              )}
            </select>
          </td>
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
    <Base title="All User Orders" description="Manage your orders here!">
      {errorComp()}
      {loadingComp()}
      <p className="text-white">{sta}</p>
      <Link className="btn btn-info mb-2" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <h2 className="mb-4">
        <u>All Orders:</u>
      </h2>
      <table class="table table-hover table-dark">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User Name & ID</th>
            <th scope="col">Order ID</th>
            <th scope="col">
              <span>Update Status OR Remove order</span>

              <button className="btn btn-info ml-2" onClick={statusUpdate}>
                Click Update status
              </button>
            </th>
            <th scope="col">View Details</th>
          </tr>
        </thead>
        <tbody>{loadOrders()}</tbody>
      </table>
    </Base>
  );
};

export default ManageOrders;
