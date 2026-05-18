from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from services import sql_engine
from models.models import JobApplication, Category, ApplicationStatus
from schemas.schemas import (
    JobApplicationSchema,
    JobApplicationCreateSchema,
    JobApplicationUpdateSchema,
    CategorySchema,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "the app works!"}


@app.get("/applications/{id}", response_model=JobApplicationSchema)
async def get_application(id: int, session: sql_engine.SessionDep):
    application = session.get(JobApplication, id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application

@app.get("/applications")
async def get_applications(
    session: sql_engine.SessionDep,
    status: ApplicationStatus | None = None,
    category: str | None = None,
):
    statement = select(JobApplication)

    if status:
        statement = statement.where(JobApplication.status == status)

    if category:
        statement = statement.where(
            JobApplication.category == category.strip().lower()
        )

    return session.exec(statement).all()


@app.post("/applications", response_model=JobApplicationSchema, status_code=201)
async def create_application(
    data: JobApplicationCreateSchema,
    session: sql_engine.SessionDep,
):
    if data.category:
        category_id = data.category.strip().lower()
        category = session.get(Category, category_id)

        if not category:
            session.add(Category(id=category_id))

    else:
        category_id = None

    application = JobApplication(
        title=data.title,
        company=data.company,
        location=data.location,
        salary=data.salary,
        description=data.description,
        category=category_id,
        logo=data.logo,
        status=data.status,
    )

    session.add(application)
    session.commit()
    session.refresh(application)

    return application


@app.patch("/applications/{application_id}", response_model=JobApplicationSchema)
async def update_application(
    application_id: int,
    data: JobApplicationUpdateSchema,
    session: sql_engine.SessionDep,
):
    job_application = session.get(JobApplication, application_id)

    if not job_application:
        raise HTTPException(status_code=404, detail="Application not found")

    if data.title is not None:
        job_application.title = data.title

    if data.company is not None:
        job_application.company = data.company

    if data.location is not None:
        job_application.location = data.location

    if data.salary is not None:
        job_application.salary = data.salary

    if data.description is not None:
        job_application.description = data.description

    if data.category is not None:
        category_id = data.category.strip().lower()

        category = session.get(Category, category_id)

        if not category:
            session.add(Category(id=category_id))

        job_application.category = category_id

    if data.logo is not None:
        job_application.logo = data.logo

    if data.status is not None:
        job_application.status = data.status

    session.add(job_application)
    session.commit()
    session.refresh(job_application)

    return job_application

@app.delete("/applications/{application_id}", response_model=JobApplicationSchema)
async def delete_application(application_id: int, session: sql_engine.SessionDep): 
    application = session.get(JobApplication, application_id)
    if (not application): 
        raise HTTPException(status_code=404, detail="Application not found")
    
    session.delete(application)
    session.commit()

    return application


@app.get("/category", response_model=list[CategorySchema])
async def get_category(session: sql_engine.SessionDep):
    return session.exec(select(Category)).all()


@app.post("/category", response_model=CategorySchema, status_code=201)
async def create_category(
    data: CategorySchema,
    session: sql_engine.SessionDep,
):
    category = Category(id=data.id.strip().lower())

    try:
        session.add(category)
        session.commit()
        session.refresh(category)

    except IntegrityError:
        session.rollback()

        raise HTTPException(
            status_code=409,
            detail="Category already exists",
        )

    return category


@app.delete("/category/{id}", response_model=CategorySchema)
async def delete_category(id: str, session: sql_engine.SessionDep):
    category = session.get(Category, id)
    if (not category): 
        raise HTTPException(status_code=404, detail="Category not found")
    
    session.delete(category)
    session.commit()

    return category
