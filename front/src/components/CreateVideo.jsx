import { useState } from "react";
import axios from "axios";

const CreateVideo = ({ setVideos }) => {
    const [videoTitle, setVideoTitle] = useState("");
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (!file || !videoTitle) {
            alert("Please provide a title and select a video.");
            return;
        }

        const formData = new FormData();
        formData.append("title", videoTitle);
        formData.append("video", file);

        try {
            const res = await axios.post(
                "http://localhost:3000/create-video",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setVideos((prevVideos) => [...prevVideos, res.data]);
            setVideoTitle("");
            setFile(null);
        } catch (err) {
            console.error("Error uploading video:", err);
        }
    };

    return (
        <div className="upload-box">
            <input
                type="text"
                placeholder="Enter video title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
            />
            <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Create Video</button>
        </div>
    );
};

export default CreateVideo;
