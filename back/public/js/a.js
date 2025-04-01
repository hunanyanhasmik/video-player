const API_URL = "http://localhost:3000/videos";

/* 📌 Fetch all videos */
async function fetchVideos() {
    const res = await fetch(API_URL);
    const videos = await res.json();
    const list = document.getElementById("videoList");
    list.innerHTML = "";
    videos.forEach(video => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span onclick="playVideo('${video.id}')">${video.title}</span>
            <button onclick="editVideo('${video.id}')">Edit</button>
            <button onclick="deleteVideo('${video.id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}

/* 📌 Play Video */
function playVideo(id) {
    // Fetch video metadata (e.g., file path)
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(video => {
            const videoPlayer = document.getElementById("videoPlayer");
            videoPlayer.src = `http://localhost:3000/videos/${video.id}`;
            videoPlayer.load(); // Ensure reloading
            videoPlayer.play();
        });
}

/* 📌 Upload New Video */
async function uploadVideo() {
    const fileInput = document.getElementById("videoFile");
    if (!fileInput.files.length) return alert("Select a video!");

    const formData = new FormData();
    formData.append("video", fileInput.files[0]);
    formData.append("title", prompt("Enter video title:"));

    await fetch(API_URL, { method: "POST", body: formData });
    fetchVideos();
}

/* 📌 Delete Video */
async function deleteVideo(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchVideos();
}

/* 📌 Edit Video */
async function editVideo(id) {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;

    const formData = new FormData();
    formData.append("title", newTitle);

    await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
    fetchVideos();
}

/* 📌 Initialize */
document.addEventListener("DOMContentLoaded", fetchVideos);
