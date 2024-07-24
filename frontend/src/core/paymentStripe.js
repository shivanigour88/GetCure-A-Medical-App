import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import logo from "../tshirt_icon.png";
import { totalAmount } from "./helper/cartHelper";

const paymentStripe = (
  products,
  amount,
  address,
  setSuccess,
  success,
  photo
) => {
  const auth = isAuthenticated();
  const onToken = (token) => {
    // let amount = totalAmount();
    const body = {
      token,
      products,
      address,
      user: auth.user,
      amount: totalAmount(),
    };
    let headers = {
      "Content-Type": "application/json",

      Authorization: `Bearer ${auth.token}`,
    };
    fetch(`${API}/payment/gateway_stripe/${auth.user._id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }).then(async (response) => {
      if (response.status === 200) {
        let order = await response.json();
        let form = new FormData();
        form.set("photo", photo);
        headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        fetch(`${API}/order/prescription/${order._id}`, {
          method: "PUT",
          headers,
          body: form,
        }).then((res) => console.log("success", res.json()));
        setSuccess(!success);
      }
    });
  };
  const loadPayment = () => {
    return (
      <StripeCheckout
        image={logo}
        name={"Pandemic E-Pharma"}
        token={onToken}
        stripeKey={process.env.REACT_APP_STRIPEPK}
        amount={amount * 100}
      >
        <button className="btn btn-danger">Pay with stripe</button>
      </StripeCheckout>
    );
  };
  return <div className="m-4">{loadPayment()}</div>;
};

export default paymentStripe;
