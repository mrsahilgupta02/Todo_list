const express =require("express");
const app = express();
const mongoose =require("mongoose");
const _ = require("lodash");
const dates = require(__dirname + "/date.js");

//console.log(dates());


app.set('view engine', "ejs");//there are many tools for templating this line tell serevr to use ejs

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//this line of code is written to make express access css file

mongoose.connect("mongodb+srv://admin-sahil:14243444@cluster0.jbaxy.mongodb.net/todolistDB");

const itemSchema =mongoose.Schema(
{  name: String}
);

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name: "Welcome to our todo /list."
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});


const defaultItems =[item1,item2,item3];

const listSchema =mongoose.Schema({
    name: String,
    items: [itemSchema]
  });

  const List = mongoose.model("List",listSchema);




var a= true;
app.get("/",function(req,res){

let day =dates.getDay();//instead of this if we use dates.getDay we will only get the weekday


  Item.find({},function(err,foundItems){//foundItems will contain the finded items

  if(foundItems.length === 0 && a){//we did this because we want to save our defaults  only once
    a= false;
    Item.insertMany(defaultItems,function(err){
      if(err)
      {
        console.log(err);
      }
      else{

        console.log("Successfully done");
      }
      res.redirect("/");
    });

  }
else{

    res.render("list",{listTitle: day , newListItems: foundItems});//render is to use ejs
                                            //ListTitle come from ejs file where we defined it
}
  });





});

app.get("/:customListName",function(req,res){
//  console.log(req.params.customListName);
const customListName = _.capitalize(req.params.customListName);//it gives us the value which user entered after localhost:3000/

List.findOne({name:customListName}, function(err,foundList){
  if(!err){
    if(!foundList){//create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
    }
else{
       res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
    }
  }
})





});







app.post("/",function(req,res){

let day =dates.getDay();


  let itemName=req.body.input;
  const listName=req.body.button;
  //console.log(listName);
   //console.log(req.body);
   //  we are going to check that the bitton pressed was on work page or home page
                                //if it is on work we wwill add items to new array
  const item = new Item({
    name:itemName
  });
  // console.log(day);
   console.log(listName);

if(listName ===  day){
  item.save();
  res.redirect("/");
}
else{
  List.findOne({name: listName}, function(err, foundList){
     foundList.items.push(item);
    console.log(foundList);
    foundList.save();
    res.redirect("/"+listName);
  });
}

});

app.post("/delete",function(req,res){
  let item_id=req.body.deleteItem;
  let listName = req.body.listName;
  let day =dates.getDay();

  if(listName ===  day){
    Item.findByIdAndRemove(item_id,function(err){
       if(!err)
      {
        res.redirect("/");
      }


    });

  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:item_id}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }




});




// app.get("/work",function(req,res){
//   res.render("list",{listTitle: "Work List",newListItems:workItems});
// });


app.get("/about",function(req,res){
  res.render("about");
});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started Successfully");
})
