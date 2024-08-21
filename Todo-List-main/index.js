const express=require('express');
const bp=require("body-parser");
const ejs=require("ejs");
const app= express();
const date=require(__dirname+"/date");
const mongoose = require('mongoose');
const _ = require("lodash");
const port=process.env.PORT ||55555;

app.use(bp.urlencoded({ extended:true }));
app.use(express.static("public"));
app.set('view engine','ejs');
mongoose.set("strictQuery",false);
mongoose
.connect("mongodb+srv://todoList:todoList@cluster0.fbj0ums.mongodb.net/todoDB")
.then(()=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log(err);
});


const schema=new mongoose.Schema({ 
    name1 : String
});
const Task=new mongoose.model("Task",schema);


const newtask_1=new Task({
    name1 : "wake up"
});
const newtask_2=new Task({
    name1 : "start grinding"
});
newtask1=[newtask_1,newtask_2];


const today=date();
app.get("/",function(req,res){
    Task.find(function(err,result){
        if(err){ 
            console.log(err.message);
        }else{
            if(result.length === 0){
                Task.insertMany(newtask1,function(err){
                    if(err){ 
                        console.log(err);
                    }else{
                        console.log("inserted sucessfully");
                    }
                });
            }else{
                
                res.render('lists',{weekday:today,task:result});
                //mongoose.connection.close();
                
            }
            
            
        }
    });
    
});


app.post("/",function(req,res){
    const a=req.body.task;
    const pagesname=req.body.button;


    const task=new Task({
        name1 : a
    });

    if(pagesname === today){
        task.save();
        res.redirect("/");
        console.log("connected");
    }else{
        custom.findOne({name : pagesname},function(err,result){
            result.page.push(task);
            result.save();
            res.redirect("/"+pagesname);
        });
    }


    
});

app.post("/delete",function(req,res){
    const id=req.body.check;
    const pname=req.body.pagename;
    
    if(pname === today){
        Task.findByIdAndRemove(id,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("removed"+id);
            }
        });
        res.redirect("/");
    }else{
        custom.findOneAndUpdate({name : pname},
            {
                $pull : {page : {_id :id}}
            },function(err,result){
                if(!err){
                    res.redirect("/"+pname);
                }
            });
    }
    
});


const custompage={
    name:String,
    page:[schema]
};
const custom = new mongoose.model("custom",custompage);


app.get("/:custom",function(req,res){
    const page_name = _.capitalize(req.params.custom);
    custom.findOne({name : req.params.custom},function(error,result){
        if(!error){
            if(!result){
                //create new one
                const page_names=req.params.custom;
                const pages=new custom({
                    name:req.params.custom,
                    page:newtask1
                });
                pages.save();
                res.redirect("/"+page_name)
            }else{
                //show existing one
                res.render('lists',{weekday:result.name,task:result.page});
            }
        }
    });
});

app.get("/work",function(req,res){ 
    res.render('lists',{weekday:"workitems",task:newtask1});
});
app.post("/work",function(req,res){
    const a = req.body.task;
    newtask1.push(a);
    res.redirect("/work");
});


app.get("/about",function(req,res){
    res.render("about");
});
app.post("/about",function(req,res){
    res.redirect("/about");
});


app.listen(port,function() {
    console.log("listening on port 55555");
});