const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const {isRealString} = require('./utils/isRealString')
const {generateMessage,generateLocationMessage} = require('./utils/message');
const { callbackify } = require('util');
const { copyFileSync } = require('fs')
const publicPath = path.join(__dirname,'/../public');

const {Users} = require('./utils/users')

const port = process.env.PORT || 3000 ;

let app =express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users()

app.use(express.static(publicPath))

io.on('connection',(socket)=>{
    console.log("A new User just Connected");

    

    socket.on('join',(params,callback) =>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and Room are Required')
        }

        socket.join(params.room)

        users.removeUser(socket.id)

        users.addUser(socket.id,params.name,params.room)

        io.to(params.room).emit('updateUsersList',users.getUserList(params.room))

        socket.emit('newMessage',generateMessage('Admin',`Welcome to ${params.room} `))
        socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'))

        callback()
    })
    
    socket.on('createMessage',(message,callback)=>{
        // console.log("createMessage", message);

        let user = users.getUser(socket.id)
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name,message.text) )
        }

        callback('This is Server')
    })

    socket.on('createLocationMessage',(coords) => {
        let user = users.getUser(socket.id)

        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.lat,coords.lng))
        // console.log(`${coords.lat},${coords.lng}`)
    })

    socket.on('disconnect',()=>{
        let user = users.removeUser(socket.id)
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room))
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left ${user.room} `))
        }
        // console.log("User was disonnected");
    })
})



server.listen(port ,() =>{
    console.log(`Server is running on ${port}`)
})