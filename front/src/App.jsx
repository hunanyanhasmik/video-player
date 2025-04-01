import { useEffect, useState } from "react";
import axios from "axios";
import VideoList from "./components/VideoList";
import VideoPlayer from "./components/VideoPlayer";
import UploadVideo from "./components/CreateVideo";
import CreateVideo from "./components/UploadVideo";

const App = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get("http://localhost:3000/videos");
                setVideos(res.data);

                if (res.data.length > 0) {
                    setSelectedVideo(res.data[0]);
                }
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchVideos();
    }, []);

    const handleSelectVideo = (video) => {
        setSelectedVideo(video);
    };

    const handleDeleteVideo = async (videoId) => {
        try {
            await axios.delete(`http://localhost:3000/videos/${videoId}`);

            setVideos((prevVideos) => {
                const updatedVideos = prevVideos.filter(
                    (video) => video.id !== videoId
                );

                if (selectedVideo && selectedVideo.id === videoId) {
                    setSelectedVideo(
                        updatedVideos.length > 0 ? updatedVideos[0] : null
                    );
                }

                return updatedVideos;
            });
        } catch (err) {
            console.error("Error deleting video:", err);
        }
    };

    const handleEditVideo = async (videoId) => {
        const newTitle = prompt("Enter new title:");
        if (newTitle) {
            try {
                await axios.put(`http://localhost:3000/videos/${videoId}`, {
                    title: newTitle,
                });

                const updatedVideos = videos.map((video) =>
                    video.id === videoId ? { ...video, title: newTitle } : video
                );
                setVideos(updatedVideos);
            } catch (err) {
                console.error("Error editing video:", err);
            }
        }
    };

    return (
        <div className="app">
            <h1>Video Player App</h1>

            <div className="content">
                {selectedVideo && <VideoPlayer selectedVideo={selectedVideo} />}

                <div className="right-box">
                    <VideoList
                        videos={videos}
                        onSelectVideo={handleSelectVideo}
                        onDeleteVideo={handleDeleteVideo}
                        onEditVideo={handleEditVideo}
                    />

                    <CreateVideo
                        setVideos={setVideos}
                        videoTitle={videoTitle}
                        setVideoTitle={setVideoTitle}
                        file={file}
                        setFile={setFile}
                    />
                    <UploadVideo
                        setVideos={setVideos}
                        file={file}
                        setFile={setFile}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
