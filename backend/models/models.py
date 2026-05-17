from enum import Enum
from sqlmodel import Field, SQLModel


class ApplicationStatus(str, Enum):
    wishlist = "wishlist"
    applied = "applied"
    interviewing = "interviewing"
    offers = "offers"
    rejected = "rejected"
    archived = "archived"


class JobApplication(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    company: str
    location: str
    salary: int | None
    description: str | None
    category: str | None = Field(default=None, foreign_key="category.id")
    logo: str | None
    status: ApplicationStatus = Field(default=ApplicationStatus.wishlist)

class Category(SQLModel, table=True): 
    id: str = Field(primary_key=True)


