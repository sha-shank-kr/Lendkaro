const express = require('express');
const path = require("path");
const app = express();
const hbs = require('hbs');
const mongoose = require('mongoose');
const lender = require('./src/models/lender.js');
const userModel = require('./src/models/userModel.js');

const port = process.env.PORT || 3000;

// // setting the path
const staticpath = path.join(__dirname, "./public");
const templatepath = path.join(__dirname, "./src/templates/views");
const partialpath = path.join(__dirname, "./src/templates/partials");

// middleware
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use(express.urlencoded({extended:false}));
app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);


app.get("/",(req,res)=>{
    res.render("index");
})


app.use(express.json());


app.get('/consumer', (req, res) => {
    res.render('consumer');
})

app.get('/lender', (req,res)=>{
    res.render('lender');
})
app.get('/consumer/:category&:product', async (req,res)=>{
    const requestedCategory1 = req.params.product;
    const requestedCategory2 = req.params.category;
    console.log(requestedCategory1);
    console.log(requestedCategory2);
    const test1 = await lender.find({product: requestedCategory1});
    const test2 = await lender.find({category: requestedCategory2, product:{$ne: requestedCategory1}});
    if(test1.length=== 0 && test2.length === 0){
        res.send("Nothing to show");
    }
    else{            
        res.render("amazon",{
            udata: test1,
            odata: test2,
        });
    }
});
app.post('/consumer', async(req,res)=>{
    try{
        const userData = new userModel(req.body);
        await userData.save();
        console.log(userData.category);
        res.status(201).render("page", {
            categ: userData.category,
            prod: userData.product,
            // Addr: userData.Address,
            // Cit: userData.City,
            // Stat: userData.State
        });
    } catch(error){
        res.status(500).send(error);
    }
})
app.post('/lender', async(req,res)=>{
    try{
        const lenderData = new lender(req.body);
        await lenderData.save();
        res.status(201).render("thankyoulender");
    } catch(error){
        res.status(500).send(error);
    }
})

app.get('/consumer/thankyou',(req,res)=>{
    res.render('thankyouuser');
})
mongoose.connect('mongodb://Hackathon:hack1234@cluster0-shard-00-00.kzlum.mongodb.net:27017,cluster0-shard-00-01.kzlum.mongodb.net:27017,cluster0-shard-00-02.kzlum.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-e42hkd-shard-0&authSource=admin&retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Succesfully connected to Database');
}).catch((err)=>{
    console.log(err);
})

// server create
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})
