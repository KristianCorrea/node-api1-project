//import express
const express=require('express');

//create a server
const server=express();

//middleware
server.use(express.json());

let users = [
    {
      id: "1",
      name: "Jane Doe", 
      bio: "Not Tarzan's Wife, another Jane",
    }
  ]

//a function to handle GET requests to /api/users
server.get('/api/users', (request, response)=>{
    if(users){
        response.status(200).json(users);
    }else{
        response.status(500).json({errorMessage: "The users information could not be retrieved."})
    }
    
})
// get request to /api/users/:id
server.get('/api/users/:id', (request, response)=>{
    const id=request.params.id
    const find=users.find(user=>user.id===id)

    response.status(200).json(find)
})
//POST request to /api/users
server.post('/api/users', (request, response)=>{
    let user = request.body;
    if(user.name == null || user.bio == null) {
        response.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } 
    else if(!user) {
        response.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    }
    else {
        users.push(user);
        response.status(201).json(users);
    }
})

//Delete request to /api/users/:id
server.delete('/api/users/:id', (request, response)=>{
    const id=request.params.id
    users=users.filter(h=>h.id!==id);
    
    response.status(200).json(users)
})

//put request to /api/users/:id
server.put('/api/users/:id',(req, res)=>{
    let id = req.params.id;
    let update = req.body;
    if(id) {
        search = [];
        users.map(user => user.id === id ? search.push(user) : null);
        if(search.length < 1) {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        else {
            if(update.name === '' || update.bio === '') {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
        } 
            else {
                search[0].name = update.name;
                search[0].bio = update.bio;
                users = users.filter(user => user.id !== search[0].id)
                users.push(search[0]);
                res.status(200).json(users);
            }
        };
    }
    else {
        res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
})
// Listen for incoming requests
const port=8000;

server.listen(port, ()=>console.log(`\n == API running on port ${port} == \n`));