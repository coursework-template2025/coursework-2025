from enum import Enum

class ParticipantRole(str, Enum):
    admin = "admin"
    member = "member"