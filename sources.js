const STORAGE_KEY = "myVideoWebsiteVideos";

let videos = [];

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    videos = Array.isArray(parsed) ? parsed : [];
} catch {
    videos = [];
}

const form = document.getElementById("videoForm");
const titleInput = document.getElementById("videoTitle");
const linkInput = document.getElementById("videoLink");
const categoryInput = document.getElementById("videoCategory");
const searchInput = document.getElementById("search");
const videoList = document.getElementById("videoList");
const message = document.getElementById("message");

function getYouTubeID(url) {
    try {
        const parsed = new URL(url);
        const hosts = [
            "youtube.com",
            "www.youtube.com",
            "m.youtube.com",
            "youtu.be",
            "www.youtu.be",
            "youtube-nocookie.com",
            "www.youtube-nocookie.com"
        ];

        if (!hosts.includes(parsed.hostname)) return null;

        let id = "";

        if (parsed.hostname.includes("youtu.be")) {
            id = parsed.pathname.split("/")[1] || "";
        } else if (parsed.pathname === "/watch") {
            id = parsed.searchParams.get("v") || "";
        } else if (/^\/(shorts|embed|live)\//.test(parsed.pathname)) {
            id = parsed.pathname.split("/")[2] || "";
        }

        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    } catch {
        return null;
    }
}

function saveVideos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
        return true;
    } catch {
        message.textContent = "Video သိမ်းဆည်းမရပါ။";
        return false;
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const link = linkInput.value.trim();
    const category = categoryInput.value.trim() || "General";
    const id = getYouTubeID(link);

    if (!title || !link) {
        message.textContent = "အချက်အလက်များ ဖြည့်ပေးပါ။";
        return;
    }

    if (!id) {
        message.textContent = "YouTube Link မှန်ကန်မှုရှိမရှိ စစ်ပါ။";
        return;
    }

    videos.unshift({ id, title, category });

    if (!saveVideos()) {
        videos.shift();
        return;
    }

    form.reset();
    message.textContent = "Video ထည့်ပြီးပါပြီ။";
    renderVideos();
});

function deleteVideo(index) {
    if (!confirm("ဒီ Video ကို ဖျက်မှာ သေချာပါသလား?")) return;

    const previous = [...videos];
    videos.splice(index, 1);

    if (!saveVideos()) {
        videos = previous;
        return;
    }

    renderVideos();
}

function renderVideos() {
    const keyword = searchInput.value.toLowerCase().trim();

    const filtered = videos
        .map((video, index) => ({ video, index }))
        .filter(item =>
            item.video.title.toLowerCase().includes(keyword) ||
            item.video.category.toLowerCase().includes(keyword)
        );

    videoList.replaceChildren();

    if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = videos.length ?
            "Video မတွေ့ပါ။" :
            "Video မရှိသေးပါ။";
        videoList.appendChild(empty);
        return;
    }

    filtered.forEach(({ video, index }) => {
        const card = document.createElement("article");
        card.className = "video-card";

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}`;
        iframe.title = video.title;
        iframe.loading = "lazy";
        iframe.allowFullscreen = true;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture; web-share";

        const info = document.createElement("div");
        info.className = "video-info";

        const heading = document.createElement("h3");
        heading.textContent = video.title;

        const category = document.createElement("p");
        category.className = "category";
        category.textContent = "📁 " + video.category;

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "🗑 Delete Video";
        remove.addEventListener("click", () => deleteVideo(index));

        info.append(heading, category, remove);
        card.append(iframe, info);
        videoList.appendChild(card);
    });
}

searchInput.addEventListener("input", renderVideos);

renderVideos();