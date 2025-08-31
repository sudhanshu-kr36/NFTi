import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const upload = multer();

app.use(cors()); // allow frontend to call backend

// Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    res.json({ cid: response.data.IpfsHash });
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(5000, () => console.log("🚀 Backend running at http://localhost:5000"));
