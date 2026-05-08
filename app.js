const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
app.use("/uploads",express.static("uploads"));

const api = require("./routes/api");
app.use("/api",api);

app.listen(3000,()=>{
    console.log("Server jalan http://localhost:3000");
});