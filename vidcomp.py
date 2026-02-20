class VideoComparator:
    CATEGORY = "video"
    DESCRIPTION = "Video Comparer node for ComfyUI. Compares two input videos side by side or top and bottom, allowing to easily spot differences between them. Supports various video formats and customizable split options."
    FUNCTION = "compare"
    RETURN_TYPES = ()
    OUTPUT_NODE = True

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "video1": ("VIDEO", {"tooltip": "First video for comparison"}),
                "video2": ("VIDEO", {"tooltip": "Second video for comparison"}),
                "split": (["vertical", "horizontal"], {"default": "vertical", "tooltip": "Split direction for comparison"})
            },
        }

    def compare(self, video1, video2, split):
        print("Passing data to UI...")
        return {
            "ui": {
                "video1_url": [video1.get_stream_source()],
                "video1_size": [video1.get_dimensions()],
                "video1_format": [video1.get_container_format()],
                "video2_url": [video2.get_stream_source()],
                "video2_size": [video2.get_dimensions()],
                "video2_format": [video2.get_container_format()],
                "split_value": [split]
            }
        }
