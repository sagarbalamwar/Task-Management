import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {
    User
} from "../Model/user.model.js";

const registerUser = async function (req, res) {
    // console.log(req.headers["content-type"]);
    // console.log(req.body);
    const {
        Username,
        Email,
        Password
    } = req.body;
    try {
        if (!Username || !Email || !Password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const userExists = await User.findOne({
            Email
        });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists."
            });
        }
        const user = await User.create({
            Username,
            Email,
            Password
        });
        res.status(201).json(user)


    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
}

const loginUser = async function (req, res) {

    try {
        const {
            Email,
            Password
        } = req.body;
        console.log(req.body)
        const user = await User.findOne({
            Email
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }
        const comparePass = await bcrypt.compare(Password, user.Password);
        if (!comparePass) {
            return res.status(400).json({
                message: "Password is incorrect"
            });
        }
        const token = jwt.sign({
            userId: user._id,
            email: user.Email
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })
        return res.status(200).json({
            message: "Login Successful",
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            error: error
        })
    }
}
const updatePassword = async function (req, res) {

    try {
        const {
            oldPassword,
            newPassword
        } = req.body;

        const user = await User.findById(req.user.userId)
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(oldPassword, user.Password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Wrong old password"
            });
        }

        user.Password = newPassword;
        await user.save();
        res.status(200).json({
            message: "Password Updated Successfully"
        })
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(400).json({
            error: error.message
        })
    }

}
export {
    registerUser,
    loginUser,
    updatePassword
}