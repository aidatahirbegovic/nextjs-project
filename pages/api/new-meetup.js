//we dont create react components
// /api/new-meetup

import { MongoClient } from "mongodb";

async function handler(req, res) {
  //req - request contains data about incoming request
  //res - respons will be needed for sending back response

  if (req.method === "POST") {
    try {
      //which kind of request was send
      const data = req.body; //body of incoming request
      //const { title, image, address, description } = data; //object distracturing

      //store in database

      const client = await MongoClient.connect(
        "mongodb+srv://user-aida:aidaturska995.@cluster0.djm6g.mongodb.net/meetups?retryWrites=true&w=majority"
      );
      const db = client.db();

      const meetupsCollection = db.collection("meetups");
      const result = await meetupsCollection.insertOne(data); //inserting one new document in this collection
      //if we dont have database or collection it will be created here
      //collection is a javascript object

      console.log(result); //get generated id

      client.close(); //to close database connection
      //we need to use response object to send back response

      res.status(201).json({ message: "Meetup inserted" });
      //we will have status 201 that we wrote here if it was successfull
    } catch (err) {
      console.log(err.message);
    }
  }
}

//connect retruns promise

export default handler;
