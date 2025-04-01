const VideoList = ({ videos, onSelectVideo, onDeleteVideo, onEditVideo }) => {
    return (
        <div>
            <h2>Videos</h2>
            <ul>
                {videos.map((video) => (
                    <li key={video.id}>
                        <span onClick={() => onSelectVideo(video)}>
                            {video.title}
                        </span>
                        <p>
                            <button onClick={() => onDeleteVideo(video.id)}>
                                Delete
                            </button>
                            <button onClick={() => onEditVideo(video.id)}>
                                Edit Title
                            </button>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VideoList;
