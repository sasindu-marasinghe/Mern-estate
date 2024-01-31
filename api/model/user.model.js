import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
       
    },
    avatar:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQICxfD-OKd7xoKOUmfau9JHOXhpmm8r3-UQQ&usqp=CAU"
    },

}, { timestamps: true});

const user = mongoose.model('user',userSchema);

export default user;