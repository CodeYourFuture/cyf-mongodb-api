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

  app.get("/films/:id", function (request, response) {
    const collection = db.collection("moveis");
    //get id
    //validate the id
    if (!mongodb.ObjectId.isValid(request.params.id)) {
      response.status(400).json("the id is not right!");
    }
    const id = new mongodb.ObjectID(request.params.id);

    const searchedObject = {
      _id: id,
    };
    collection.findOne(searchedObject, (err, result) => {
      if (err) {
        response.status(500).send(err);
      } else if (result) {
        response.status(200).send(result);
      } else {
        response.status(404).send("the object not found!");
      }
    });
  });

  app.post("/films/add", function (request, response) {
    // get collection (movies)
    const collection = db.collection("moveis");
    // get data from request.body (NOT the query...)
    const searchObject = request.body;
    // collection.insertOne(data, function(error, result))
    collection.insertOne(searchObject, (err, result) => {
      // if everything is not ok -> send error response (500)
      if (err) {
        response.status(500).send(err);
        // if everything is ok -> send returned record (a bit tricky to find it...)
      } else {
        response.send(result.ops[0]);
      }
    });
  });

  app.delete("/films/:id", function (request, response) {
    const collection = db.collection("moveis");
    if(!mongodb.ObjectID(request.params.id)){
      response.status(400).send("The 'id' is not correct");
    }
    const id = new mongodb.ObjectID(request.params.id);
    const searchedObject = {
      _id:id
    }
    collection.deleteOne(searchedObject, (err, result)=>{
      if(err){
        response.status(500).send(err)
      }else if(result){
        response.status(200).send(result);
      }else{
        response.status(404).send('the movie not found!')
      }
    })
  });


  app.listen(3000);
});
