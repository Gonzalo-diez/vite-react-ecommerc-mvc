const express = require("express");
const session = require("express-session");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("./config/passport-jwt-middleware");
const cors = require("cors");
const configurePassport = require("./config/passport");


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST", "PUT", "DELETE"] 
    }
});

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
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})); 
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
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'avatar')));

const PORT = 8800

server.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("comentario-eliminado", (comentarioEliminado) => {
        io.emit("comentario-eliminado", comentarioEliminado);
    });

    socket.on("comentario-agregado", (comentarioAgregado) => {
        io.emit("comentario-agregado", comentarioAgregado);
    });

    socket.on("comentario-editado", (comentarioEditado) => {
        io.emit("comentario-editado", comentarioEditado);
    });

    socket.on("producto-eliminado", (productoEliminado) => {
        io.emit("producto-eliminado", productoEliminado);
    });

    socket.on("producto-editado", (productoEditado) => {
        io.emit("producto-editado", productoEditado);
    });

    socket.on("producto-agregado", (productoAgregado) => {
        io.emit("producto-agregado", productoAgregado);
    });
})