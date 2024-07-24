import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";

const UserDashBoard = () => {
  const {
    user: { name, email },
  } = isAuthenticated();

  const adminRightSide = () => {
    return (
      <div className="card mb-4">
        <h4 className="card-header">User Information</h4>

        <ul className="list-group">
          <li className="list-group-item">
            <span className="badge badge-success mr-2">Name:</span>
            {name}
          </li>

          <li className="list-group-item">
            <span className="badge badge-success mr-2">Email:</span>
            {email}
          </li>

          <li className="list-group-item">
            <span className="badge badge-danger">User Area</span>
          </li>
          <li className="list-group-item text-center">
            <Link className="btn btn-info mr-2" to="/user/profile/edit">
              Edit Profile
            </Link>
            <Link className="btn btn-info" to="/user/orders">
              View Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Base
      title="User Dashboard"
      description="Manage your orders and profile here"
      className="container bg-success p-4"
    >
      <div className="row">
        <div className="col-6 offset-3">{adminRightSide()}</div>
      </div>
    </Base>
  );
};

export default UserDashBoard;
