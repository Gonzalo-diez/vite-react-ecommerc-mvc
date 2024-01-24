const express = require("express");
const session = require("express-session");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const passport = require("./config/passport-jwt-middleware");
const cors = require("cors");
const configurePassport = require("./config/passport");


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const routes = require("./routes");

mongoose.connect("mongodb://localhost:27017/commerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
    console.log("Conexión a MongoDB exitosa");
});

app.use(express.json());
app.use(cors());
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use("/", routes);

io.on("connection", (socket) => {
    console.log("Nuevo cliente se ha conectado");

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    })
})

const PORT = 8800

server.listen(PORT, () => {
    console.log(`Servidor y WebSocket conectados en el puerto ${PORT}`);
});