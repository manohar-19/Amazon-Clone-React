import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Checkout from "./Checkout/Checkout";
import { StateProvider } from "./StateProvider";
import reducer, { initialState } from "./reducer";
import Login from "./Login/Login";
import Payment from "./Payment/Payment";
import Orders from "./Orders/Orders";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Headers from "./Header/Headers";

const promise = loadStripe(
  "pk_test_51KXmUESAamaGzjNjuw1ObgybrkhIyZo7kZllETWE4fESJN2VM3vEw2ylkLF23OShcIFpwzkBXRbDjmpzEvYEJfay00Gpieyun9"
);

const routing = (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/payment"
        element={
          <Elements stripe={promise}>
            <Payment />
          </Elements>
        }
      />
      <Route
        path="/orders"
        element={
          <>
            <Headers />
            <Orders />
          </>
        }
      />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Router>
);
ReactDOM.render(
  <StateProvider initialState={initialState} reducer={reducer}>
    {routing}
  </StateProvider>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
