import mongoose from "mongoose";
import vehicleModel from "../model/vehicle.model.js";
import cloudinary from "../utils/cloudinary.js";

export const getAllVehicle = async (req, res) => {
  try {
    const vehicles = await vehicleModel.find();

    return res.status(200).json({
      success: true,
      data: vehicles,
      count: vehicles.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Vehicle ID",
      });
    }


    const vehicle = await vehicleModel.findById(id);

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      type,
      year,
      fuelType,
      transmission,
      seatingCapacity,
      rentalLocation,
      pricePerDay,
      availability,
      include,
      notInclude,
    } = req.body;

    let thumbnailUrl = "";

    if (req.files?.thumbnail) {
      thumbnailUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "vehicles/thumbnail" },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult.secure_url);
          }
        );
        stream.end(req.files.thumbnail[0].buffer);
      });
    }

    let imageUrls = [];
    if (req.files?.images) {
      for (const file of req.files.images) {
        const imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "vehicles/gallery" },
            (error, uploadResult) => {
              if (error) reject(error);
              else resolve(uploadResult.secure_url);
            }
          );
          stream.end(file.buffer);
        });
        imageUrls.push(imageUrl);
      }
    }

    const vehicle = new vehicleModel({
      brand,
      model,
      type,
      year,
      fuelType,
      transmission,
      seatingCapacity,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      rentalLocation,
      pricePerDay,
      availability,
      include,
      notInclude,
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    console.error("❌ Error creating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
