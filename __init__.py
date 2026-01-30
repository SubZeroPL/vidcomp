from .vidcomp import VideoComparator

__author__ = """SubZero"""
__email__ = "subzeropl@gmail.com"
__version__ = "0.0.1"

# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {
    "VideoComparator": VideoComparator
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoComparator": "Video Comparator"
}

WEB_DIRECTORY = "./js"

__all__ = [
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
    "WEB_DIRECTORY",
]
