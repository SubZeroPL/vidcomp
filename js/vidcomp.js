import { app } from "../../scripts/app.js";
app.registerExtension({
    name: "vidcomp",
    async setup() {
        console.log("Setup complete!")
    },
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType.comfyClass !== "VideoComparator") return;
        console.log("beforeRegisterNodeDef")
        console.log(nodeType)
        console.log(nodeData)
    },
    async nodeCreated(node) {
        if (node.comfyClass !== "VideoComparator") return;
        console.log('node created');
        let isDragging = false;
        let posX = 0;
        let posY = 0;
        const previewDiv = document.createElement("div");
        previewDiv.style.width = "100%";
        previewDiv.style.height = "100%";
        previewDiv.style.top = "0px";
        previewDiv.style.left = "0px";
        previewDiv.style.position = "absolute";
        const vid1_div = document.createElement("div");
        vid1_div.style.position = "absolute";
        vid1_div.onmousemove = function (e) {
            if (!isDragging) return;
            e.preventDefault();
            posX = e.clientX;
            posY = e.clientY;
            console.log(`dragging: X=${posX}, Y=${posY}`);
            console.log(`resizing video: X=${posX}, Y=${posY}`);
            console.log(`video pos: X=${vid1_div.getBoundingClientRect().left}, Y=${vid1_div.getBoundingClientRect().top}`);
            vid1_div.style.width = posX + "px";
            splitter_div.style.left = (vid1_div.getBoundingClientRect().left + posX) + "px";
        }
        vid1_div.onmouseup = function (e) {
            console.log("stop drag")
            e.preventDefault();
            isDragging = false;
        }
        const vid2_div = document.createElement("div");
        const splitter_div = document.createElement("div");
        splitter_div.style.width = "3px";
        splitter_div.style.backgroundColor = "black";
        splitter_div.style.height = "100%";
        splitter_div.style.position = "absolute";
        splitter_div.style.left = "50%";
        splitter_div.style.top = "0px";
        splitter_div.style.cursor = "col-resize";
        splitter_div.onmousedown = function (e) {
            console.log("start drag")
            e.preventDefault();
            isDragging = true;
        }
        splitter_div.onmouseup = function (e) {
            console.log("stop drag")
            e.preventDefault();
            isDragging = false;
        }
        const vid1 = document.createElement("video");
        setup_video(vid1);
        const vid2 = document.createElement("video");
        setup_video(vid2);
        vid1_div.appendChild(vid1);
        vid2_div.appendChild(vid2);
        previewDiv.appendChild(vid2_div);
        previewDiv.appendChild(vid1_div);
        previewDiv.appendChild(splitter_div);
        node.addDOMWidget("preview-widget", "VIDEO", previewDiv);

        node.onExecuted = function (output) {
            const url1_segments = output.video1_url[0].split('/');
            const url1 = encodeURIComponent(url1_segments[url1_segments.length - 1]);
            const url2_segments = output.video2_url[0].split('/');
            const url2 = encodeURIComponent(url2_segments[url2_segments.length - 1]);
            const video1_url = `/api/view?type=input&filename=${url1}`;
            const video2_url = `/api/view?type=input&filename=${url2}`;
            const split_value = output.split_value[0];
            vid1.src = video1_url;
            vid1.style.width = "50%";
            vid2.src = video2_url;
        }
    }
})

function setup_video(vid) {
    vid.controls = false;
    vid.muted = true;
    vid.style.position = "absolute";
    vid.style.width = "100%";
    vid.style.height = "100%";
    vid.style.top = "0px";
    vid.style.left = "0px";
    vid.style.objectFit = "cover";
    vid.style.border = "1px solid black";
    vid.autoplay = false;
    vid.loop = true;
    vid.overflow = "hidden";
}