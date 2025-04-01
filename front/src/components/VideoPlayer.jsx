const VideoPlayer = ({ selectedVideo }) => {
    return (
        <div>
            <h2>Playing: {selectedVideo.title}</h2>
            <video width="600" controls key={selectedVideo.id} autoPlay>
                <source
                    src={`http://localhost:3000/videos/${selectedVideo.id}`}
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
