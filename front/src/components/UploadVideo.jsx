import { useState } from "react";
import axios from "axios";

const UploadVideo = ({ setVideos }) => {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);

        try {
            const res = await axios.post(
                "http://localhost:3000/upload-video",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setVideos((prevVideos) => [...prevVideos, res.data]);
            setFile(null);
        } catch (err) {
            console.error("Error uploading video:", err);
        }
    };

    return (
        <div className="upload-box">
            <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload Video</button>
        </div>
    );
};

export default UploadVideo;
