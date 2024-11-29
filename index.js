const express = require('express')
const app = express()
const port = process.env.PORT || 5000
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors())
app.use(express.json())

// CoffeShop
// PyhgyJ5M49Ea0rQS

// console.log(process.env.USER_DB)



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_Pass}@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("coffeeDB");
    const haiku = database.collection("coffee");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    app.get("/user/:id",async(req,res)=>{
       
      let idx=req.params.id
      const query = { _id: new ObjectId(idx) };
      const result = await haiku.findOne(query);
      res.send(result)
    })

    app.put("/user/:id",async(req,res)=>{
      let idx=req.params.id
      const filter = { _id: new ObjectId(idx) };
      const options = { upsert: true };
      let data=req.body

      const UpdatedData= {
        $set: {
          name: data.name,
          chef:data.chef,
          supplier:data.supplier,
          taste:data.taste,
          category:data.category,
          details:data.details,
          photo:data.photo

         


        },
       
      };
      const result = await haiku.updateOne(filter, UpdatedData, options);
      res.send(result)

    })


    app.get("/user",async(req,res)=>{

        const cursor = haiku.find();

        let result= await cursor.toArray()
        res.send(result)

    })


    app.delete("/user/:id",async(req,res)=>{
        let idx= req.params.id
        const query = { _id: new ObjectId(idx) };
        const result = await haiku.deleteOne(query);
        res.send(result)
    })


    app.post("/user",async(req,res)=>{

        let user= req.body
        console.log(user)
        const result = await haiku.insertOne(user);
        res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})