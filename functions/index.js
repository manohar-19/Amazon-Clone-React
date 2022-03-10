const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

// const { response } = require("express");

const stripe = require("stripe")(
  "sk_test_51KXmUESAamaGzjNj5fPiajoSG7OZxiZUAWSaTfujg4xDgas6YCg5wOxk1VnBsTaPpjRfc0yESYSbwILT0gCe0OPZ00cVmBJmHJ"
);
//API

// App config
const app = express();

//Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// API routes
app.get("/", (request, response) => {
  response.status(200).send("hello world");
});

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log("Payment request received >>>", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "INR",
  });
  //ok ctreated
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

//Listen Command
exports.api = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
