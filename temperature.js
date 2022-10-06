let express = require("express");
const path = require('path');
let app = express();
let port  = 1717;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

/* mongoose.connect("mongodb://localhost:27017/IoTdevice"); */

// Mongo Atlas connect
const url = `mongodb+srv://Razvan:Razvy890817@newcluster.ev11z.mongodb.net/NewCluster?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(url, connectionParams).then(() => {
    console.log('Connected to database')
}).catch((err) => {
console.error(`Error connecting to the database. \n${err}`);
})

// Models
var myDataSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number
});
var newData = mongoose.model("NewData", myDataSchema);

// Controls
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'temperature.html'));
    console.log("connected to database");
});

app.get("/getdata", (req, res) => {
	mongoose.model("NewData").find().sort({_id: -1}).limit(1).exec(function(err, result)
    {
        if(err){
            console.log(err);
        }
        else {
            console.log(JSON.stringify(result));
            res.end(JSON.stringify(result));
        }
    });
});


app.post("/adddata", (req, res) => {
	var latestData = new newData(req.body);
	latestData.save().then(item => {
		res.send("Data saved to database");
	}).catch(err => {
		res.status(400).send("Unable to save to database");
	});
});

app.delete('/deletedata', function (req, res) {
    res.send('Got a DELETE request at /deletedata');
    mongoose.model("NewData").findOneAndDelete({},{"sort": { "_id": -1 }}).exec(function(err, result)
    {
        if(err){
            console.log(err);
        }
        else {
            console.log(result);
        }
    });;
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});