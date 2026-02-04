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
                "split": (["vertical", "horizontal"], {"default": "vertical", "tooltip": "Split direction for comparison"}),
                "layout": (["overlap", "side_by_side"], {"default": "overlap", "tooltip": "Layout style for comparison"}),
            },
        }

    def compare(self, video1, video2, split, layout):
        print("Passing data to UI...")
        return {
            "ui": {
                "video1_url": [video1.get_stream_source()],
                "video1_size": [video1.get_dimensions()],
                "video1_format": [video1.get_container_format()],
                "video2_url": [video2.get_stream_source()],
                "video2_size": [video2.get_dimensions()],
                "video2_format": [video2.get_container_format()],
                "split_value": [split],
                "layout_value": [layout]
            }
        }
