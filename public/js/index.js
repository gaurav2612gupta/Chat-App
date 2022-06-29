let socket = io();

socket.on('connect', () => {
    console.log("Connected to server");

})
socket.on('disconnect', () => {
    console.log("Disonnected to server");
})

socket.on('newMessage', (message) => {
    console.log("newMessage",message);
})

socket.emit( 'createMessage',{
    from: 'John',
    text : 'Hi'
},(message)=>{
    console.log("Got it",message)
} )