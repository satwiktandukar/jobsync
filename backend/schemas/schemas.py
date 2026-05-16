from pydantic import BaseModel
from models.models import ApplicationStatus

class JobApplicationCreateSchema(BaseModel): 
    title: str
    company: str
    location: str
    salary: int | None
    description: str | None
    category: str | None
    logo: str | None
    status: ApplicationStatus

class JobApplicationUpdateSchema(BaseModel):
    title: str | None = None
    company: str | None = None
    location: str | None = None
    salary: int | None = None
    description: str | None = None
    category: str | None = None
    logo: str | None = None
    status: ApplicationStatus | None = None

class JobApplicationSchema(BaseModel):
    id: int | None
    title: str
    company: str
    location: str
    salary: int | None
    description: str | None
    category: str | None
    logo: str | None
    status: ApplicationStatus


class CategorySchema(BaseModel): 
    id: str


