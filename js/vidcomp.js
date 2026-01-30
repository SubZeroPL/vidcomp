import { app } from "../../scripts/app.js";

const SPLIT_HORIZONTAL = "horizontal";
const SPLIT_VERTICAL = "vertical";
const LAYOUT_OVERLAY = "overlay";
const LAYOUT_SIDE_BY_SIDE = "side_by_side";

let Config = {
    video1_url: "",
    video2_url: "",
    split: SPLIT_VERTICAL,
    layout: LAYOUT_OVERLAY
};

app.registerExtension({
    name: "vidcomp",
    async setup() {
        console.log("Setup complete!")
    },
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType.comfyClass !== "VideoComparator") return;
        console.log(`${nodeType.comfyClass} beforeRegisterNodeDef`)
        console.log(nodeType)
        console.log(nodeData)
    },
    async nodeCreated(node) {
        if (node.comfyClass !== "VideoComparator") return;
        console.log(`${node.comfyClass} node created`);
        const previewDiv = setup_preview(true);
        node.addDOMWidget("preview-widget", "VIDEO", previewDiv);

        node.onExecuted = nodeOnExecuted;
    }
})

function setup_preview(first = false) {
    // main preview div
    const previewDiv = document.querySelector("#vidcomp-preview-div") ?? document.createElement("div");
    previewDiv.id = "vidcomp-preview-div";
    previewDiv.style.width = "100%";
    previewDiv.style.height = "100%";
    previewDiv.style.top = "0px";
    previewDiv.style.left = "0px";
    previewDiv.style.position = "absolute";
    if (first) return previewDiv;
    // video 1 div
    const vid1_div = document.querySelector("#vidcomp-vid1-div") ?? document.createElement("div");
    vid1_div.id = "vidcomp-vid1-div";
    vid1_div.style.position = "absolute";
    vid1_div.style.left = "0px";
    vid1_div.style.top = "0px";
    vid1_div.style.width = Config.split === SPLIT_VERTICAL ? "50%" : "100%";
    vid1_div.style.height = Config.split === SPLIT_VERTICAL ? "100%" : "50%";
    vid1_div.style.cursor = Config.split === SPLIT_VERTICAL ? "col-resize" : "row-resize";
    // video 2 div
    const vid2_div = document.querySelector("#vidcomp-vid2-div") ?? document.createElement("div");
    vid2_div.id = "vidcomp-vid2-div";
    vid2_div.style.position = "absolute";
    vid2_div.style.left = "0px";
    vid2_div.style.top = "0px";
    vid2_div.style.width = "100%";
    vid2_div.style.height = "100%";
    vid2_div.style.cursor = Config.split === SPLIT_VERTICAL ? "col-resize" : "row-resize";
    // video 1 element
    const vid1 = document.querySelector("#vidcomp-vid1") ?? document.createElement("video");
    vid1.id = "vidcomp-vid1";
    setup_video(vid1);
    vid1.src = Config.video1_url;
    // video 2 element
    const vid2 = document.querySelector("#vidcomp-vid2") ?? document.createElement("video");
    vid2.id = "vidcomp-vid2";
    setup_video(vid2);
    vid2.src = Config.video2_url;
    // connect elements
    vid1_div.appendChild(vid1);
    vid2_div.appendChild(vid2);
    previewDiv.appendChild(vid2_div);
    previewDiv.appendChild(vid1_div);
    return previewDiv;
}

function setup_video(vid, id = 1) {
    vid.controls = false;
    vid.muted = true;
    vid.style.position = "absolute";
    vid.style.width = "100%";
    vid.style.height = "100%";
    vid.style.top = "0px";
    vid.style.left = "0px";
    vid.style.objectFit = "contain";
    const v2_hpos = Config.split === SPLIT_VERTICAL ? "right" : "left";
    const v2_vpos = Config.split === SPLIT_VERTICAL ? "top" : "bottom";
    const v2_pos = Config.layout === LAYOUT_OVERLAY ? "left top" : `${v2_hpos} ${v2_vpos}`;
    vid.style.objectPosition = vid.id === "vidcomp-vid1" ? "left top" : `${v2_pos}`;
    vid.style.border = "1px solid black";
    vid.autoplay = true;
    vid.loop = true;
    vid.overflow = "hidden";
}

function nodeOnExecuted(output) {
    const url1_segments = output.video1_url[0].split('/');
    const url1 = encodeURIComponent(url1_segments[url1_segments.length - 1]);
    const url2_segments = output.video2_url[0].split('/');
    const url2 = encodeURIComponent(url2_segments[url2_segments.length - 1]);
    const video1_url = `/api/view?type=input&filename=${url1}`;
    const video2_url = `/api/view?type=input&filename=${url2}`;
    const split_value = output.split_value[0];
    const layout_value = output.layout_value[0];
    Config = {
        video1_url: video1_url,
        video2_url: video2_url,
        split: split_value,
        layout: layout_value
    };
    console.log("Data: ", Config);
    setup_preview();
}