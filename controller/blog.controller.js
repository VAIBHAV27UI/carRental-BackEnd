import blogModel from "./../model/blog.model";
import cloudinary from "./../utils/cloudinary";

export const createBlog = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const { title, information } = req.body;

    if (!title || !information) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let imageUrl = "";

    if (req.files && req.files.image) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog/image" },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult.secure_url);
          }
        );
        stream.end(req.files.image.data);
      });
    }

    const newBlog = await blogModel.create({
      title,
      information,
      image: imageUrl || "",
    });

    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};


