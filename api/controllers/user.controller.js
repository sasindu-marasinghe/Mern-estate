import user from "../model/user.model.js";
import bcryptjs from 'bcryptjs';
export const test = (req, res)=> {
    res.json({
        message: 'api route is working!',
    });
};
export const updateUser = async(req, res, next) =>{
    if(req.user.id !== req.params.id ) return next(errorHandler(401,"You can only update your own account!"))
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)

        }
        const updateUser = await user.findByIdAndUpdate(req.params.id,{
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,

            }
        }, {new:true})

        const {password, ...rest} = updateUser._doc

        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));
    try {
        await user.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('Your account has been deleted!').clearCookie('access_token');
    } catch (error) {
        next(error)
    }
};

export const getUserListings = async (req, res, next) => {
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {
            next(error)
        }
    }else{
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
};