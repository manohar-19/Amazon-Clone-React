
import React, { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import CheckoutProduct from "../CheckoutProduct/CheckoutProduct";
import Headers from "../Header/Headers";
import { useStateValue } from "../StateProvider";
import "./Payment.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "../reducer";
import axios from "../Axios/axios";
import { db } from "../Firebase/firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const navigate = useNavigate(); // useHistory() is change into useNavigate()
 
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSuccessed] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);


  useEffect(() => {
    //generate the special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      const response = await axios.post(
        `/payments/create?total=${getBasketTotal(basket)*100}`
      );
      // const response = await axios({
      //   method: "post",
      //   //Stripe expects the total in a currency format
      //   url: `/payments/create?total=${getBasketTotal(basket) }`,
      // });
      setClientSecret(response.data.clientSecret);
    }
    getClientSecret();
  }, [basket]);

  console.log('the client secret >>>',clientSecret)
  console.log('user ',user)

  const handleSubmit = async (event) => {
    // do all the fancy stripe stuff...
    event.preventDefault(); //Prevent refreshing
    setProcessing(true); //Disable the button after pressing it one time

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      })
      .then(({ paymentIntent }) => {
        //paymentIntent =payment confirmation

         db.collection("users")
           .doc(user?.uid)
           .collection("orders")
           .doc(paymentIntent.id)
           .set({
             basket: basket,
             amount: paymentIntent.amount,
             created: paymentIntent.created,
           })
           ;
        console.log("paymentIntent>>>>", paymentIntent);
        setSuccessed(true);
        setError(null);
        setProcessing(false);
        dispatch({
          type:'EMPTY_BASKET'
        })
        navigate("/orders", { replace: true });
      });
  };

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details

    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  return (
    <div>
      <Headers />
      <div className="payment">
        <div className="payment_container">
          <h1>
            Checkout ({<Link to={"/checkout"}>{basket?.length} items</Link>})
          </h1>

          <div className="payment__section">
            <div className="payment__title">
              <h3>Delivery Address</h3>
            </div>
            <div className="payment__address">
              <p>{user?.email}</p>
              <p>123 Davangere</p>
              <p>Karnataka, India</p>
            </div>
          </div>

          <div className="payment__section">
            <div className="payment__title">
              <h3>Review items and delivery</h3>
            </div>
            <div className="payment__items">
              {basket.map((item) => (
                <CheckoutProduct
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
              ))}
            </div>
          </div>

          <div className="payment__section">
            <div className="payment__title">
              <h3>Payment Method</h3>
            </div>
            <div className="payment__details">
              <form onSubmit={handleSubmit}>
                <CardElement onChange={handleChange} />
                <div className="payment__priceContainer">
                  <CurrencyFormat
                    renderText={(value) => (
                      <>
                        <h3>Order Total: {value}</h3>
                      </>
                    )}
                    decimalScale={2}
                    value={getBasketTotal(basket)} // Part of the homework
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                  <button disabled={processing || disabled || succeeded}>
                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                  </button>
                </div>

                {/* {Error} */}
                {error && <div>{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
