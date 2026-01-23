from enum import Enum

class AttachmentType(str, Enum):
    image = "image"
    video = "video"
    file = "file"