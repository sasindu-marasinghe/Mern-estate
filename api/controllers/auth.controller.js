import { errorHandler } from '../Utils/error.js';
import user from '../model/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup =  async(req, res, next) => {
 const{username, email, password} = req.body;
 const hashedPassword = bcryptjs.hashSync(password, 10);
 const newUser = new user ({username,email,password: hashedPassword});
try{
   await newUser.save();
    res.status(201).json('user created successfully!');
}  catch (error){
    next(errorHandler(550, 'error from the function '));
}

};