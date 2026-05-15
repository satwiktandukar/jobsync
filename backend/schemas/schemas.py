from pydantic import BaseModel
from models.models import ApplicationStatus

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


