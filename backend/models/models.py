from enum import Enum
from sqlmodel import Field, SQLModel


class ApplicationStatus(str, Enum):
    wishlist = "wishlist"
    applied = "applied"
    interviewing = "interviewing"
    offers = "offers"
    rejected = "rejected"
    archived = "archived"


class User(SQLModel, table=True): 
    id: int | None = Field(default=None, primary_key=True)
    name: str
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    password: str


class Category(SQLModel, table=True): 
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    user_id: int = Field(foreign_key="user.id")


class JobApplication(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    company: str
    location: str
    salary: int | None = None
    description: str | None = None
    category_id: int | None = Field(default=None, foreign_key="category.id")
    logo: str | None = None
    status: ApplicationStatus = Field(default=ApplicationStatus.wishlist)
    user_id: int = Field(foreign_key="user.id")
    job_url: str | None = None
    employment_type: str | None = None
    work_mode: str | None = None
    source: str | None = None
    deadline: str | None = None
    applied_date: str | None = None