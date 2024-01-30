import { errorHandler } from '../Utils/error.js';
import user from '../model/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup =  async(req, res, next) => {
 const{username, email, password} = req.body;
 const hashedPassword = bcryptjs.hashSync(password, 10);
 const newUser = new user ({username,email,password: hashedPassword});
try{
   await newUser.save();
    res.status(201).json('user created successfully!');
}  catch (error){
    next(error);
}

};
export const signin = async (rreq, rec, next) => {
    const {email, password} = req.body;
    try{ 
const validUser = await user.findOne({email});
if (!validUser) return next(errorHandler(404,'User not found!'));
const validPassword = bcryptjs.compareSync(password, validUser.password);
if (!validPassword) return next (errorHandler(401,'wrong credentials!'));
  const token = jwt.sign({id: validUser._id },process.env.JWT_SECRET);
  const {password: pass, ...rest} = validUser._doc;  
  res.
    cookie('access_token',token, { httpOnly: true})
    .status(200)
    .json(rest);
}catch(error){
        next(error);
    }
};