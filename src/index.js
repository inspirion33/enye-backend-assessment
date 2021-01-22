const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getExchangeRates = async (base, currency) => {
  if (base && !currency) {
    const res = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${base}`
    );
    return res;
  } else if (base && currency) {
    const res = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${base}&symbols=${currency}`
    );
    return res;
  } else {
    const res = await axios.get("https://api.exchangeratesapi.io/latest");
    return res;
  }
};

// Function to handle the root path
app.get("/", async function (req, res) {
  res.send("Server Working Fine!");
});

app.get("/api/rates", async (req, res) => {
  const base = req.query.base;
  const currency = req.query.currency;

  try {
    if (base && !currency) {
      const { data } = await getExchangeRates(base);

      res.status(200).json({
        status: "success",
        results: data
      });
    } else if (base && currency) {
      const { data } = await getExchangeRates(base, currency);

      res.status(200).json({
        status: "success",
        results: data
      });
    } else {
      const { data } = await getExchangeRates();

      res.status(200).json({
        status: "success",
        results: data
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      error: error.message
    });
  }
});

app.listen(8080, function () {
  console.log("Server is listening on port 8080");
});
