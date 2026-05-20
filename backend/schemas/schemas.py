from pydantic import BaseModel
from models.models import ApplicationStatus


class JobApplicationCreateSchema(BaseModel): 
    title: str
    company: str
    location: str
    salary: int | None = None
    description: str | None = None
    category_id: int | None = None
    logo: str | None = None
    status: ApplicationStatus


class JobApplicationUpdateSchema(BaseModel):
    title: str | None = None
    company: str | None = None
    location: str | None = None
    salary: int | None = None
    description: str | None = None
    category_id: int | None = None
    logo: str | None = None
    status: ApplicationStatus | None = None


class JobApplicationSchema(BaseModel):
    id: int
    title: str
    company: str
    location: str
    salary: int | None
    description: str | None
    category_id: int | None
    logo: str | None
    status: ApplicationStatus


class CategoryCreateSchema(BaseModel):
    title: str


class CategorySchema(BaseModel): 
    id: int
    title: str


class LogoResponseSchema(BaseModel): 
    message: str


class UserCreateSchema(BaseModel):
    name: str
    username: str
    email: str
    password: str


class UserSchema(BaseModel): 
    id: int
    username: str
    name: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

