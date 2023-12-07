const express = require("express");
const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
}); //8000
const app = express();
app.use(express.json());

const emailToSocketMapping = new Map();
const socketToEmailMappiing = new Map();

io.on("connection", (socket) => {
  socket.on("room-join", (data) => {
    const { email, room } = data;
    emailToSocketMapping.set(email, socket.id);
    socketToEmailMappiing.set(socket.id, email);
    io.to(room).emit("user-joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room-join", data);
  });

  socket.on("call-user", ({ to, offer }) => {
    io.to(to).emit("Incoming-call", {
      from: socket.id,
      offer,
    });
  });

});

// app.listen(8000,()=>{
//     console.log('server is listening at port 8000')
// })
// io.listen(5000);
