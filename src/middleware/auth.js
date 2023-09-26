import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";




const auth = (roles=[])=> {

    return async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return res.json({ message: "In-valid bearer key" })
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return res.json({ message: "In-valid token" })
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
       // console.log(decoded)
        if (!decoded?._id) {
            return res.json({ message: "In-valid token payload" })
        }
        const user = await userModel.findById(decoded._id).select('userName email role')
        if (!user) {
            return res.json({ message: "Not register account" })
        }
        if(!roles.includes(user.role))
        {
            return res.json({ message: "u are not authorized" })
        }
        req.user = user;
        return next()
    } catch (error) {
        return res.json({ message: "Catch error" , err:error?.message })
    }
}
}
export default auth