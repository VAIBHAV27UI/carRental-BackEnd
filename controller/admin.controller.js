import adminModel from "../model/admin.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import vehicleModel from "../model/vehicle.model";


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await adminModel.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminModel.create({ name, email, password: hashedPassword });

    const token = jwt.sign({id:admin._id}, process.env.JWT_SECRET)

    return res.status(201).json({
      success: true,
      token,
      message: "New admin created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid Username",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if(!isMatch) {
        return res.status(400).json({
            success:false,
            message:"Invalid Password"
        })
    }

    const token = jwt.sign({id:admin._id}, process.env.JWT_SECRET)

    return res.status(200).json({
      success: true,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// API to get Dashboard Data

export const getDashboardData = async(req, res) => {
  try {

    const {_id} = req.body

    const cars = await vehicleModel.find({owner: _id})
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}