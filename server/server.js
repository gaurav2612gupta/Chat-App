const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const publicPath = path.join(__dirname,'/../public');

const port = process.env.PORT || 3000

let app =express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath))

io.on('connection',(socket)=>{
    console.log("A new User just Connected");

    socket.emit('newMessage',{
        name:"Admin",
        text: "Hi Welcome to Chat Room",
        cretedAt : new Date().getTime()
    })
    
    socket.broadcast.emit('newMessage',{
        name:"Admin",
        text: "New User Joined",
        cretedAt : new Date().getTime()

    })

    socket.on('createMessage',(message)=>{
        console.log("createMessage", message);
        io.emit('newMessage',{
            from : message.from,
            text : message.text,
            cretedAt : new Date().getTime()
        })
    })

    socket.on('disconnect',()=>{
        console.log("User was disonnected");
    })
})


server.listen(port,() =>{
    console.log(`Server is running on ${port}`)
})