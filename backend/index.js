const express = require("express");
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;
// nsu-complaint-firebase-adminsdk-q5c1l-eb0fbd3ffd.json



const serviceAccount = require("./nsu-complain-box-firebase-adminsdk-kvcfb-25b3076e83.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wjof8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// console.log(uri);
async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decodatedUser = await admin.auth().verifyIdToken(token);
      req.decodatedEmail = decodatedUser.email;
    }
    catch {

    }

  }
  next();
}
async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");
    const database = client.db('complaint_nsu');
    const complaintCollection = database.collection('complaints');
    const usersCollection = database.collection('users');
    const reviewersCollection = database.collection('reviewers');

    app.get('/complaints', async (req, res) => {
      const email = req.query.complainerEmail;
      const subject = req.query.subjectText;
      const query = { complainerEmail: email }
      console.log(query);
      const cursor = complaintCollection.find({});
      const complaints = await cursor.toArray();
      res.json(complaints);
    })

    // app.post('/complaints', async (req, res) => {
    //   const complaint = req.body;
    //   const result = await complaintCollection.insertOne(complaint);
    //   console.log(result);
    //   res.json({ result })

    // });
    app.post('/complaints', async (req, res) => {
      const complainerName = req.body.complainerName;
      const complainerEmail = req.body.complainerEmail;
      const subjectText = req.body.subjectText;
      const descriptionText = req.body.descriptionText;
      const assignTo = req.body.assignTo;
      const aggainstWhom = req.body.aggainstWhom;
      const proofText = req.files.proofText;
      const picData = proofText.data;
      const encodedPic = picData.toString('base64');
      const imageBuffer = Buffer.from(encodedPic, 'base64');
      const complaint = {
        complainerName,
        complainerEmail,
        subjectText,
        descriptionText,
        assignTo,
        aggainstWhom,
        proofText: imageBuffer
      }
      const result = await complaintCollection.insertOne(complaint);
      res.json({ result });

    });
    app.get('/complaintsSingle/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const cursor = await complaintCollection.findOne(query);
      // const complaintsSingle = await cursor.toArray();
      res.json(cursor);
    })
    app.get('/reviewers', async (req, res) => {
      const cursor = reviewersCollection.find({});
      const reviewers = await cursor.toArray();
      res.json(reviewers);
    });
    app.post('/reviewers', async (req, res) => {
      const name = req.body.name;
      const email = req.body.email;
      const designation = req.body.designation;
      const department = req.body.department;
      const picture = req.files.image;
      const picData = picture.data;
      const encodedPic = picData.toString('base64');
      const imageBuffer = Buffer.from(encodedPic, 'base64');
      const reviewer = {
        name,
        email,
        designation,
        department,
        image: imageBuffer
      }
      const result = await reviewersCollection.insertOne(reviewer);
      res.json({ result });

    });

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json({ result })

    });
    app.put('users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })
    app.put('/users/admin', verifyToken, async (req, res) => {
      const user = req.body;
      const requester = req.decodatedEmail;
      if (requester) {
        const requesterAccount = await usersCollection.findOne({ email: requester });
        if (requesterAccount.role === 'admin') {
          const filter = { email: user.email };
          const updateDoc = { $set: { role: 'admin' } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      }
      else {
        res.status(403).json({ message: 'you do not have access to make admin' });
      }

    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
