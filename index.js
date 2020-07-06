const express = require("express");
const { reset } = require("nodemon");

const server = express();

server.use(express.json()) //Middleware required for post requests.

const port = 8000;
server.listen(port, () => console.log(`Server is running on port ${port}`));

server.get("/", (req, res) => {
    res.send("<h1>Hello</h1>")
});

let users = [
    {
        id: 1,
        name: "Jane Doe",
        bio: "Not Tarzan wif"
    },
    {
        id: 2,
        name: "Tarzan Monkeyman",
        bio: "the real tarzan"
    }
]

let wrongDataBase = [
    {        // Used to test if data base fails
        id: 1,
        name: "history"
    }
]

server.get("/api/users", (req, res) => {
    if(users){
        res.status(200).json(users)
    }else{
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
    
});

server.get("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let user=users.find(user => user.id === id);
    if(users.length<1){
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }
    if(typeof user === 'undefined'){
        res.status(404).json({ message: `The user with the specified ID of ${id} does not exist.` });
    }
    if(typeof user !== 'undefined'){
        res.status(200).json(user);
    }
});

let nextID=3; // Assigns the next empty ID to new user.

server.post("/api/users", (req, res) => {
    let newUser=req.body; //NEEDS express.json() middleware
    if(typeof newUser.name === 'undefined'|| typeof newUser.bio === 'undefined'){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    else{
        newUser.id=nextID;
        
        users.push(newUser); //change "users" to "wrongDataBase" to test what happens when data base fails

        addedUser=users.find(user => user.id === newUser.id); //Finds the newly created user and saves it to variable
        if(typeof addedUser === 'undefined'){
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
        }
        if(typeof addedUser !== 'undefined'){
            res.status(201).json(newUser)
            nextID++;
        }
        
    }
    
});

server.delete("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const deletedUser=users.find(user => user.id === id)
    console.log(deletedUser)
    
    if(typeof deletedUser === 'undefined'){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }else{
        users = users.filter(user => user.id !== id) //swap "users" with "wrongDataBase" to force database error
        if(typeof users.find(user => user.id === id) === 'undefined'){
            res.status(200).json(deletedUser)
        }else{
            res.status(404).json({ errorMessage: "The user could not be removed" })
        }
    }
})

server.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const edittedUser = req.body;
    if(typeof edittedUser.name === 'undefined'|| typeof edittedUser.bio === 'undefined'){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }else{
        let userFound=users.find(user => user.id === id);
        console.log(userFound)
    
        if(userFound){
            Object.assign(userFound, edittedUser)
            res.status(200).json(userFound)
        }else{
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }
})