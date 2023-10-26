var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var companyRouter = require("./routes/company");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/product");
var categoryRouter = require("./routes/category");
var salesRouter = require("./routes/sales");
const { ConnectToDatabase } = require("./models");
const validateToken = require("./middlewares/auth-middleware");
const roleAuthentication = require("./middlewares/role-auth-middleware");

var app = express();

const http = require('http'); 
const socketIo = require('socket.io'); 
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  // You can handle events from the client here
});

ConnectToDatabase()
  .then(() => console.log("connected to database..."))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: [
      "https://c9vfvlh6-4200.inc1.devtunnels.ms",
      "http://localhost:4200",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));
app.use(validateToken);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});
// app.use("/", indexRouter);
app.use("/company", companyRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/categories", categoryRouter);
app.use("/sale", salesRouter);
module.exports = app;
