class VideoComparator:
    CATEGORY = "Comparison"
    DESCRIPTION = "Compares two videos side by side."
    FUNCTION = "compare"
    RETURN_TYPES = ()
    OUTPUT_NODE = True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "video1": ("VIDEO", {"tooltip": "First video for comparison"}),
                "video2": ("VIDEO", {"tooltip": "Second video for comparison"}),
                "split": (["horizontal", "vertical"], {"default": "horizontal", "tooltip": "Split direction for comparison"}),
            },
        }

    def compare(self, video1, video2, split):
        print("Comparing videos...")
        print(video1.get_stream_source(), video2.get_stream_source(), split)
        return {"ui": {"video1_url": [video1.get_stream_source()], "video2_url": [video2.get_stream_source()], "split_value": [split]}}
