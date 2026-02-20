import { app } from "../../scripts/app.js";

const SPLIT_HORIZONTAL = "horizontal";
const SPLIT_VERTICAL = "vertical";

let Config = {
    video1_url: "",
    video1_size: [0, 0],
    video1_format: "",
    video2_url: "",
    video2_size: [0, 0],
    video2_format: "",
    split: SPLIT_VERTICAL
};

app.registerExtension({
    name: "vidcomp",
    async nodeCreated(node) {
        if (node.comfyClass !== "VideoComparator") return;
        const previewDiv = setup_preview(true);
        node.addDOMWidget("preview-widget", "VIDEO", previewDiv);

        node.onExecuted = nodeOnExecuted;
        node.resizable = false;

        // React to widget value changes
        if (node.widgets) {
            const splitWidget = node.widgets.find(w => w.name === "split");
            if (splitWidget) {
                const originalCallback = splitWidget.callback;
                splitWidget.callback = function (value) {
                    Config.split = value;
                    update_preview(node);
                    // Call original callback if it exists
                    if (originalCallback) {
                        originalCallback.call(this, value);
                    }
                };
            }
        }
    }
})

function setup_preview(first = false) {
    const horizontal = Config.split === SPLIT_HORIZONTAL;

    const video_preview = document.createElement("div");
    video_preview.id = "video-preview";

    const preview_container = document.createElement("div");
    preview_container.id = "preview-container";
    preview_container.style.position = "relative";
    preview_container.style.width = Config.video1_size[0] + "px";
    preview_container.style.height = Config.video1_size[1] + "px";
    video_preview.appendChild(preview_container);

    const vid_div_1 = document.createElement("div");
    vid_div_1.id = "vid-div-1";
    vid_div_1.style.position = "absolute";
    vid_div_1.style.top = "0";
    vid_div_1.style.left = "0";
    vid_div_1.style.cursor = horizontal ? "row-resize" : "col-resize";

    const vid_div_2 = document.createElement("div");
    vid_div_2.id = "vid-div-2";
    vid_div_2.style.position = "absolute";
    vid_div_2.style.top = "0";
    vid_div_2.style.left = "0";
    vid_div_2.style.cursor = horizontal ? "row-resize" : "col-resize";

    const video_1 = document.createElement("video");
    video_1.id = "video-1";
    video_1.loop = true;
    video_1.muted = true;
    video_1.autoplay = true;
    video_1.disablePictureInPicture = true;
    if (Config.split === SPLIT_HORIZONTAL) {
        video_1.width = Config.video1_size[0];
        video_1.height = Config.video1_size[1] / 2;
    } else {
        video_1.width = Config.video1_size[0] / 2;
        video_1.height = Config.video1_size[1];
    }
    video_1.style.objectFit = "cover";
    video_1.style.objectPosition = "left top";
    const source_1 = document.createElement("source");
    source_1.src = Config.video1_url;
    source_1.type = `video/${Config.video1_format}`;
    video_1.appendChild(source_1);
    
    const video_2 = document.createElement("video");
    video_2.id = "video-2";
    video_2.loop = true;
    video_2.muted = true;
    video_2.autoplay = true;
    video_2.disablePictureInPicture = true;
    video_2.width = Config.video1_size[0];
    video_2.height = Config.video1_size[1];
    video_2.style.objectFit = "cover";
    const source_2 = document.createElement("source");
    source_2.src = Config.video2_url;
    source_2.type = `video/${Config.video2_format}`;
    video_2.appendChild(source_2);
    
    vid_div_1.appendChild(video_1);
    vid_div_2.appendChild(video_2);
    preview_container.appendChild(vid_div_2);
    preview_container.appendChild(vid_div_1);

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
            if (Config.split === SPLIT_HORIZONTAL) {
                video_1.height = e.offsetY;
            } else {
                video_1.width = e.offsetX;
            }
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

function update_preview(node) {
    const vid_div_1 = document.getElementById("vid-div-1");
    const vid_div_2 = document.getElementById("vid-div-2");
    vid_div_1.style.cursor = Config.split === SPLIT_HORIZONTAL ? "row-resize" : "col-resize";
    vid_div_2.style.cursor = Config.split === SPLIT_HORIZONTAL ? "row-resize" : "col-resize";
    const video_1 = document.querySelector("video#video-1");
    const video_2 = document.querySelector("video#video-2");
    const source_1 = video_1.querySelector("source");
    const source_2 = video_2.querySelector("source");
    source_1.src = Config.video1_url;
    source_1.type = `video/${Config.video1_format}`;
    source_2.src = Config.video2_url;
    source_2.type = `video/${Config.video2_format}`;
    if (Config.split === SPLIT_HORIZONTAL) {
        video_1.width = Config.video1_size[0];
        video_1.height = Config.video1_size[1] / 2;
    } else {
        video_1.width = Config.video1_size[0] / 2;
        video_1.height = Config.video1_size[1];
    }
    video_2.width = Config.video1_size[0];
    video_2.height = Config.video1_size[1];
    const wasPlaying = !video_1.paused;
    video_1.load();
    if (!wasPlaying) {
        video_1.pause();
    }
    video_2.load();
    if (!wasPlaying) {
        video_2.pause();
    }
    node.setSize([video_2.width + 20, video_2.height + 100]);
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
    const video1_format = processVideoFormats(output.video1_format[0], video1_url);
    const video2_format = processVideoFormats(output.video2_format[0], video2_url);
    const split_value = output.split_value[0];
    Config = {
        video1_url: video1_url,
        video2_url: video2_url,
        video1_size: video1_size,
        video2_size: video2_size,
        video1_format: video1_format,
        video2_format: video2_format,
        split: split_value
    };
    update_preview(this);
}

function processVideoFormats(format, file) {
    if (format.indexOf(",") !== -1) {
        const formats = format.split(",").map(f => f.trim());
        const fileExtension = file.split('.').pop().toLowerCase();
        if (formats.includes(fileExtension)) {
            return fileExtension;
        }
        return formats[0];
    }
    return format.trim();
}