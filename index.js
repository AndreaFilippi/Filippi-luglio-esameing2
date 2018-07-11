var express = require('express');
var bodyParser = require('body-parser');
//var Data = require('./data');
/*const router = require ('./apiRest.js');
const routerGetPost = require ('./getPostNode.js');
// instantiate express*/
var uuid = require('uuid-v4');
const app = express();

const teams = []


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;


// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

/*// register our router on /api
//app.set('db',db);
app.use('/api', router);
app.use('/getPost', routerGetPost)*/
app.get('/', function (req, res) {
    res.send({message:'api funzionante'});
});
app.get('/team', function (req, res) {
    if(teams.length!=0){
        res.send(teams);
    }else{
        res.sendStatus(404)
    }
});
app.post('/team', function (req, res) {
    const newTeam = req.body
    newTeam.teamID = uuid()
    newTeam.matches = []
    teams.push(newTeam)
    res.send(newTeam);
});
app.put('/team', function (req, res) {
    var presente = false;
    for(var i = 0; i < teams.length;i++){
        if(teams[i].nome === req.body.nome){
            presente = true;
        }
    }
    if(presente){
        res.send({message:'squadra già presente'});
    }else{
    const newTeam = req.body
    newTeam.teamID = uuid()
    teams.push(newTeam)
    res.send(newTeam);
    }
    //res.send('put Page2');
});

app.get('/team/:team_id', function (req, res) {
    console.log(req.params.team_id)
    for(var i = 0; i < teams.length;i++){
        if(teams[i].teamID === req.params.team_id){
            res.send(teams[i]);
        }
        res.send({message:'id non presente'});
    }
});
app.post('/team/:team_id', function (req, res) {
    for(var i = 0; i < teams.length;i++){
        if(teams[i].teamID === req.params.team_id){
            teams[i].matches[0] = {opponent_id:req.body.opponent_id,result:req.body.result} //aggiunge solo la prima partita
            if(req.body.result==="l"){
                teams[i].isStillIn = false
            }
            for(var i = 0; i < teams.length;i++){ // aggiorno lista oppositore
                if(teams[i].teamID === req.body.opponent_id){
                    var resOp = req.body.result;
                    if (resOp==="w") resOp="l"
                    if (resOp==="l") resOp="w"
                    teams[i].matches[0] = {opponent_id:req.params.team_id,result:resOp}
                    if(resOp==="l"){
                        teams[i].isStillIn = false 
                    }

                }
            }
            res.send(teams[i]);
        }
        res.send({message:'id non presente'});
    }
    
    
});
app.put('/team/:team_id', function (req, res) {
    //to do
    res.send({message:'non ancora implementato'});
});








// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);