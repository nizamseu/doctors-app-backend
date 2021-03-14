const express =require('express');
const bodyParser =require('body-parser');
const cors =require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
const uri = "mongodb+srv://doctors:doctors@cluster0.r2lzi.mongodb.net/doctors-app?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
require('dotenv').config();





const app =express();

app.use(bodyParser.json());
app.use(cors());

const port=5000;


app.get('/',(req,res)=>{

    res.send("দাঁত")
})




 client.connect(err => {
  const doctorsCollection = client.db("doctors-app").collection("booking");

 app.post('/addApoinment',(req,res)=>{
    const apointment =req.body;
    doctorsCollection.insertOne(apointment)
    .then(result=>{
        res.send(result)
    })
 
 })

app.get('/appointmentData',(req,res)=>{
    doctorsCollection.find({})
    .toArray((err,document)=>{
        res.send(document)
    })
})

app.post('/loadappointments',(req,res)=>{
    const date=req.body
    doctorsCollection.find({date:date.selectedDate})
    .toArray((err,document)=>{
        res.send(document)
    })
})

app.get('/allpatients',(req,res)=>{
    doctorsCollection.find({}).sort({_id:-1})
    .toArray((err,document)=>{
        res.send(document)
    })

})


app.post('/view',(req,res)=>{
    const id= req.body
    doctorsCollection.find({"_id":ObjectID(id.id)})
    .toArray((err,document)=>{
        res.send(document)
    })
})


app.post('/today',(req,res)=>{
    const date=req.body
    doctorsCollection.find({date:date.date})
    .toArray((err,document)=>{
        res.send(document)
    })
})

app.get('/recent',(req,res)=>{
    const recent=req.body;
    doctorsCollection.find({}).sort({_id:-1}).limit(5)
    .toArray((err,document)=>{
        res.send(document)
    })
})


app.patch('/action',(req,res)=>{
const id=req.body.id;
const value=req.body.actionValue;
if(id && value){
doctorsCollection.updateOne({_id:ObjectID(id)},{
    $set:{actionType:value}
})
.then(result=>{
    res.send(result.modifiedCount>0)
})
}
})



app.patch('/visited',(req,res)=>{
    const id=req.body.id;
    const isvisited=req.body.isVisited;
    doctorsCollection.updateOne({_id:ObjectID(id)},{
        $set:{isVisited:isvisited}
    })
    .then(result=>{
        res.send(result.modifiedCount>0)
    })
    })

  console.log("Connection paiche");
 
});






app.listen(process.env.PORT || port)