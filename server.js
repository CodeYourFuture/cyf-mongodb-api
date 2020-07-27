const express = require("express");
const mongodb = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const uri = process.env.URI;
const mongoOptions = { useUnifiedTopology: true };
const client = new mongodb.MongoClient(uri, mongoOptions);

const app = express();
app.use(express.json());

client.connect(function () {
  const db = client.db("mongodb-week3");

  app.get("/films", function (request, response) {
    const collection = db.collection("moveis");
    collection.find({}).toArray((err, result) => {
      if (err) {
        response.status(500).send(err);
      } else {
        response.status(200).send(result);
      }
    });
  });

  app.listen(3000);
});
