const express =require('express');
const bodyParser =require('body-parser');
const cors =require('cors');
const fileUpload = require('express-fileupload');
const fs=require('fs-extra')
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
const uri = "mongodb+srv://doctors:doctors@cluster0.r2lzi.mongodb.net/doctors-app?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
require('dotenv').config();





const app =express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port=5000;


app.get('/',(req,res)=>{

    res.send("দাঁত")
})




 client.connect(err => {
  const doctorsCollection = client.db("doctors-app").collection("booking");
  const AllDoctors = client.db("doctors-app").collection("doctors");
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


app.post('/adddoctor',(req,res)=>{
    const file=req.files.file;
    const name=req.body.name;
    const email= req.body.email;
        const newImage=file.data;
        const encImg=newImage.toString('base64');

        const image={
            contentType:file.mimetype,
            size:file.size,
            img:Buffer.from(encImg,'base64')
        }
        AllDoctors.insertOne({name,email,image})
        .then(result=>{
            res.send(result.insertedCount>0)
        })
      
})

app.get('/doctors',(req,res)=>{
    AllDoctors.find({})
    .toArray((err,document)=>{
        res.send(document)
    })
})
  console.log("Connection paiche");
 
});






app.listen(process.env.PORT || port)