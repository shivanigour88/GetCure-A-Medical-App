import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import Base from "./Base";
import Card from "./Card";
import { loadcart, totalAmount, cartEmpty } from "./helper/cartHelper";
import paymentStripe from "./paymentStripe";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [photo, setPhoto] = useState("");
  const [reload, setReload] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addressSetter, setAddressSetter] = useState({
    name: "",
    address: "",
    state: "",
    country: "",
    zip: "",
  });
  // const { formData } = photo;
  const { name, address, state, country, zip } = addressSetter;

  const { user } = isAuthenticated();

  useEffect(() => {
    setProducts(loadcart());
  }, [reload, success]);

  const loadAllProducts = () => {
    return (
      products &&
      products.map((product, index) => (
        <div key={index} className="col-6 mb-4">
          <Card
            product={product}
            removeFromCart={true}
            addToCart={false}
            setReload={setReload}
            reload={reload}
          />
        </div>
      ))
    );
  };

  const handelChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    if (name === "photo") {
      setPhoto(value);
    } else setAddressSetter({ ...addressSetter, [name]: value });
  };

  const addressForm = () => {
    return (
      <div>
        <form className="row g-3">
          <h5 className="text-info">Shipping Address:</h5>
          <div className="col-12">
            <label for="inputAddress" className="form-label">
              Name
            </label>
            <input
              type="text"
              onChange={handelChange("name")}
              className="form-control"
              id="inputAddress"
              value={name}
              placeholder="Eg: Jhon Doe"
            />
          </div>
          <div className="col-12">
            <label for="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              onChange={handelChange("address")}
              className="form-control"
              id="inputAddress"
              value={address}
              placeholder="Apartment, studio, or floor"
            />
          </div>
          <div className="col-md-4">
            <label for="inputAddress" className="form-label">
              Country
            </label>
            <input
              type="text"
              onChange={handelChange("country")}
              className="form-control"
              id="inputAddress"
              value={country}
              placeholder="Eg: India, US, etc..."
            />
          </div>
          <div className="col-md-4">
            <label for="inputAddress" className="form-label">
              State
            </label>
            <input
              type="text"
              onChange={handelChange("state")}
              className="form-control"
              id="inputAddress"
              value={state}
              placeholder="Eg: Mumbai, New Delhi, etc..."
            />
          </div>
          <div className="col-md-4">
            <label for="inputZip" className="form-label">
              Zip
            </label>
            <input
              type="number"
              onChange={handelChange("zip")}
              className="form-control"
              placeholder="Eg: 110001"
              value={zip}
              id="inputZip"
            />
          </div>
          <div className="col-md-7">
            Upload Doctors Prescription
            <label className="btn btn-block btn-success">
              <input
                onChange={handelChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
        </form>
        <p className="text-danger">*Complete Address section to pay</p>
        <h3 className="text-info">
          Total Billing amount is Rs.{totalAmount()}
        </h3>
        {name &&
          address &&
          state &&
          country &&
          zip &&
          photo &&
          paymentStripe(
            products,
            totalAmount() / 70,
            addressSetter,
            setSuccess,
            success,
            photo
          )}
      </div>
    );
  };

  const loadCheckout = () => {
    if (!user) {
      return <h2 className="text-danger">Sign in or Sign Up To Checkout</h2>;
    } else if (products==undefined||products.length === 0) {
      return (
        <h2 className="text-info">No product Added to cart for Checkout</h2>
      );
    } else {
      return <div>{addressForm()}</div>;
    }
  };

  return (
    <Base title="Cart Page" description="Ready to checkout!">
      <div className="row ">
        <div className="col-8 text-center">
          <h3>This is product section</h3>
          <div className="row align-items-start border-info border-end">
            {loadAllProducts()}
          </div>
        </div>
        <div className="col-4">
          <h3 className="text-white text-center">Checkout Here</h3>
          {loadCheckout()}
        </div>
      </div>
      {success && cartEmpty()}
    </Base>
  );
};

export default Cart;
