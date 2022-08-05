import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/electronchallenge")
.then(db => console.log("o bd esta conectado"))
.catch(err => console.log(err))