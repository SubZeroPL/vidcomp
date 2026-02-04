import { app } from "../../scripts/app.js";

const SPLIT_HORIZONTAL = "horizontal";
const SPLIT_VERTICAL = "vertical";
const LAYOUT_OVERLAY = "overlay";
const LAYOUT_SIDE_BY_SIDE = "side_by_side";

let Config = {
    video1_url: "",
    video1_size: [0, 0],
    video1_format: "",
    video2_url: "",
    video2_size: [0, 0],
    video2_format: "",
    split: SPLIT_VERTICAL,
    layout: LAYOUT_OVERLAY
};

app.registerExtension({
    name: "vidcomp",
    async setup() {
        console.log("Setup complete!")
    },
    async nodeCreated(node) {
        if (node.comfyClass !== "VideoComparator") return;
        const previewDiv = setup_preview(true);
        node.addDOMWidget("preview-widget", "VIDEO", previewDiv);

        node.onExecuted = nodeOnExecuted;
    }
})

function setup_preview(first = false) {
    const video_preview = document.createElement("div");
    video_preview.id = "video-preview";

    const vid_div_1 = document.createElement("div");
    vid_div_1.id = "vid-div-1";
    vid_div_1.style.position = "absolute";
    vid_div_1.style.top = "0";
    vid_div_1.style.left = "0";
    vid_div_1.style.cursor = "col-resize";

    const vid_div_2 = document.createElement("div");
    vid_div_2.id = "vid-div-2";
    vid_div_2.style.position = "absolute";
    vid_div_2.style.top = "0";
    vid_div_2.style.left = "0";
    vid_div_2.style.cursor = "col-resize";

    const video_1 = document.createElement("video");
    video_1.id = "video-1";
    video_1.loop = true;
    video_1.muted = true;
    video_1.autoplay = true;
    video_1.disablePictureInPicture = true;
    video_1.width = 212;
    video_1.height = 240;
    video_1.style.objectFit = "cover";
    video_1.style.objectPosition = "left top";
    const source_1 = document.createElement("source");
    source_1.src = Config.video1_url;
    source_1.type = "video/mp4";
    video_1.appendChild(source_1);
    
    const video_2 = document.createElement("video");
    video_2.id = "video-2";
    video_2.loop = true;
    video_2.muted = true;
    video_2.autoplay = true;
    video_2.disablePictureInPicture = true;
    video_2.width = 424;
    video_2.height = 240;
    video_2.style.objectFit = "cover";
    const source_2 = document.createElement("source");
    source_2.src = Config.video2_url;
    source_2.type = "video/mp4";
    video_2.appendChild(source_2);
    
    vid_div_1.appendChild(video_1);
    vid_div_2.appendChild(video_2);
    video_preview.appendChild(vid_div_2);
    video_preview.appendChild(vid_div_1);

    video_preview.addEventListener("pointerclick", play_pause);

    let isDragging = false;
    let moved = false;
    video_preview.addEventListener("pointerdown", (e) => {
        if (e.isPrimary === false) return;
        if (e.button !== 0) return; // only left button
        e.stopPropagation();
        isDragging = true;
    });
    video_preview.addEventListener("pointerup", (e) => {
        if (e.isPrimary === false) return;
        if (e.button !== 0) return; // only left button
        e.stopPropagation();
        if (moved) {
            moved = false;
        } else {
            play_pause();
        }
        isDragging = false;
    });
    video_preview.addEventListener("pointermove", (e) => {
        if (e.isPrimary === false) return;
        if (e.button !== -1) return; // button still
        if (isDragging) {
            e.stopPropagation();
            video_1.width = e.offsetX;
            moved = true;
        }
    });

    function play_pause() {
        if (video_1.paused) {
            video_1.play();
        } else {
            video_1.pause();
        }
        if (video_2.paused) {
            video_2.play();
        } else {
            video_2.pause();
        }
    }

    return video_preview;
}

function update_preview() {
    const video_1 = document.querySelector("video#video-1");
    const video_2 = document.querySelector("video#video-2");
    video_1.querySelector("source").src = Config.video1_url;
    video_2.querySelector("source").src = Config.video2_url;
    video_1.load();
    video_2.load();
}

function nodeOnExecuted(output) {
    const url1_segments = output.video1_url[0].split('/');
    const url1 = encodeURIComponent(url1_segments[url1_segments.length - 1]);
    const url2_segments = output.video2_url[0].split('/');
    const url2 = encodeURIComponent(url2_segments[url2_segments.length - 1]);
    const video1_url = `/api/view?type=input&filename=${url1}`;
    const video2_url = `/api/view?type=input&filename=${url2}`;
    const video1_size = output.video1_size[0];
    const video2_size = output.video2_size[0];
    const video1_format = output.video1_format[0];
    const video2_format = output.video2_format[0];
    const split_value = output.split_value[0];
    const layout_value = output.layout_value[0];
    Config = {
        video1_url: video1_url,
        video2_url: video2_url,
        video1_size: video1_size,
        video2_size: video2_size,
        video1_format: video1_format,
        video2_format: video2_format,
        split: split_value,
        layout: layout_value
    };
    console.log("VideoComparator Config:", Config);
    update_preview();
}