const express=require('express');
const bodyParser=require('body-parser');
const _ =require('lodash')
const app=express();
const mongoose=require('mongoose');
require('dotenv').config();
// mongoose.connect("mongodb://127.0.0.1:27017/todoListDB")
mongoose.connect(process.env.URL); 
//120.0.0.1 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
const listSchema=new mongoose.Schema({
    name:String
 })
const List=mongoose.model('List',listSchema);
const tabSchema=new mongoose.Schema({
      name:String,
       arr:[listSchema]
    })    
const Tab=mongoose.model("Tab",tabSchema);
const doc1=new List({
    name:"write yout task"
})
const doc2=new List({
    name:"add it to the list"
})
const doc3=new List({
    name:"delete it when done"
})
let defList=[doc1,doc2,doc3];

app.get('/',function(req,res){
List.find()
  .exec()
  .then((results) => {
    if(results.length===0){
          List.insertMany(defList);   
          res.redirect('/');
    }
    else{
        res.render('index',{val:"Today",item:results,value:"Today",delList:"Today"});
    }
    
  })
    
})
app.post('/',function(req,res){
    let x=req.body.todo;
    let y=req.body.add;
    const doc=new List({
        name:x
    })
    if(y=='Today'){
        doc.save();
        res.redirect('/');
    }
    else{
        Tab.findOne({ name:y })
  .then((result) => {
        result.arr.push(doc);
        result.save();
        res.redirect('/'+y);
     })
        
    }
    
})
app.post('/delete',function(req,res){
    let x=req.body.box;
    let y=req.body.del;
    // console.log(x);
    // console.log(y);
    if(y==="Today"){
        List.deleteOne({ _id: x})
        .then((result) => {
        //   console.log(result);
          res.redirect('/');
        })
    }
    else{
        Tab.findOneAndUpdate(
            { name:y}, 
            { $pull: { arr: {_id:x} } }, 
            { new: true } 
          )
            .then((updatedDocument) => {
              
              console.log("success");
            res.redirect('/'+y);
            })
            .catch((error) => {
              
              console.error(error);
            });
        
    }
})
app.get('/:paramName',function (req,res){
    let  y=_.capitalize(req.params.paramName); 
    Tab.findOne({ name:y })
  .then((result) => {
    if(!result){
        const doc=new Tab({
            name:y,
            arr:defList
        })
        doc.save();
        res.redirect('/'+y);
    }
    else{
        res.render('index',{val:result.name,item:result.arr,value:result.name,delList:result.name});
    }
  })
})
app.get('/about',function(req,res){
    res.render('about');
})
app.get('/work',function(req,res){
    res.render('index',{val:"work",item:worklist,value:"work"});
})


app.listen(process.env.PORT || 3000,function(){
    console.log("listen");
})