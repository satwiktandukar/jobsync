from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from typing import Annotated

from fastapi.staticfiles import StaticFiles
from PIL import Image
import os
from pathlib import Path
import random
import string

from services import sql_engine

from auth.auth import oauth2_scheme, get_current_user, get_current_active_user
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


from models.models import JobApplication, Category, ApplicationStatus, User
from schemas.schemas import (
    JobApplicationSchema,
    JobApplicationCreateSchema,
    JobApplicationUpdateSchema,
    CategorySchema,
    CategoryCreateSchema,
    LogoResponseSchema,
    UserSchema, 
    UserCreateSchema
)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

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


@app.get("/applications/{application_id}", response_model=JobApplicationSchema)
async def get_application(current_user: Annotated[UserSchema, Depends(get_current_user)], application_id: int, session: sql_engine.SessionDep):
    application = session.get(JobApplication, application_id)

    print(current_user)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@app.get("/applications", response_model=list[JobApplicationSchema])
async def get_applications(
    session: sql_engine.SessionDep,
    status: ApplicationStatus | None = None,
    category_id: int | None = None,
):
    statement = select(JobApplication)

    if status is not None:
        statement = statement.where(JobApplication.status == status)

    if category_id is not None:
        statement = statement.where(JobApplication.category_id == category_id)

    return session.exec(statement).all()


@app.post("/applications", response_model=JobApplicationSchema, status_code=201)
async def create_application(
    data: JobApplicationCreateSchema,
    session: sql_engine.SessionDep,
):
    if data.category_id is not None:
        category = session.get(Category, data.category_id)

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

    application = JobApplication(
        title=data.title,
        company=data.company,
        location=data.location,
        salary=data.salary,
        description=data.description,
        category_id=data.category_id,
        logo=data.logo,
        status=data.status,
        user_id=1,  # temporary until auth exists
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

    if data.category_id is not None:
        category = session.get(Category, data.category_id)

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        job_application.category_id = data.category_id

    if data.logo is not None:
        job_application.logo = data.logo

    if data.status is not None:
        job_application.status = data.status

    session.add(job_application)
    session.commit()
    session.refresh(job_application)

    return job_application


@app.delete("/applications/{application_id}", response_model=JobApplicationSchema)
async def delete_application(
    application_id: int,
    session: sql_engine.SessionDep,
):
    application = session.get(JobApplication, application_id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    session.delete(application)
    session.commit()

    return application


@app.get("/category", response_model=list[CategorySchema])
async def get_category(session: sql_engine.SessionDep):
    return session.exec(select(Category)).all()


@app.post("/category", response_model=CategorySchema, status_code=201)
async def create_category(
    data: CategoryCreateSchema,
    session: sql_engine.SessionDep,
):
    category = Category(
        title=data.title.strip().lower(),
        user_id=1,  # temporary until auth exists
    )

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


@app.delete("/category/{category_id}", response_model=CategorySchema)
async def delete_category(
    category_id: int,
    session: sql_engine.SessionDep,
):
    category = session.get(Category, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    jobs_using_category = session.exec(
        select(JobApplication).where(JobApplication.category_id == category_id)
    ).all()

    for job in jobs_using_category:
        job.category_id = None
        session.add(job)

    session.delete(category)
    session.commit()

    return category


@app.post("/upload", response_model=LogoResponseSchema)
async def upload_logo(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type")

    characters = string.ascii_letters + string.digits
    file_name = "".join(random.choices(characters, k=12))

    size = (128, 128)
    output_dir = Path("static/thumbnails")
    output_dir.mkdir(parents=True, exist_ok=True)

    _, ext = os.path.splitext(file.filename)
    file_path = output_dir / f"{file_name}{ext}"

    im = Image.open(file.file)
    im.thumbnail(size)
    im.save(file_path)
    im.close()

    return {"message": f"{file_name}{ext}"}

@app.post("/register")
async def register(data: UserCreateSchema, session: sql_engine.SessionDep): 
    user_data = User(name = data.name.strip(), email = data.email.strip(), password = data.password)
    try:
        session.add(user_data)
        session.commit()
        session.refresh(user_data)

    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=409,
            detail="User already exists",
        )

    return {"message": "Succeeded"}


@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    user = UserInDB(**user_dict)
    hashed_password = fake_hash_password(form_data.password)
    if not hashed_password == user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.username, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user
