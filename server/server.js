const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const {generateMessage,generateLocationMessage} = require('./utils/message');
const { callbackify } = require('util');
const publicPath = path.join(__dirname,'/../public');

const port = process.env.PORT || 3000

let app =express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath))

io.on('connection',(socket)=>{
    console.log("A new User just Connected");

    socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'))
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'))
    
    socket.on('createMessage',(message,callback)=>{
        console.log("createMessage", message);
        io.emit('newMessage', generateMessage(message.from,message.text) )
        callback('This is Server')
    })

    socket.on('createLocationMessage',(coords) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.lat,coords.lng))
        // console.log(`${coords.lat},${coords.lng}`)
    })

    socket.on('disconnect',()=>{
        console.log("User was disonnected");
    })
})


server.listen(port,() =>{
    console.log(`Server is running on ${port}`)
})