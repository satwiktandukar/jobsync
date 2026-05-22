from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, status, Header
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

from datetime import timedelta

from auth.auth import get_current_user, authenticate_user, password_hash, create_access_token, revoked_tokens
from fastapi.security import OAuth2PasswordRequestForm

from models.models import JobApplication, Category, ApplicationStatus, User
from schemas.schemas import (
    JobApplicationSchema,
    JobApplicationCreateSchema,
    JobApplicationUpdateSchema,
    CategorySchema,
    CategoryCreateSchema,
    LogoResponseSchema,
    UserCreateSchema,
    Token,
)

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 #7days expiry time 

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://jobsync-sigma.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CurrentUserDep = Annotated[User, Depends(get_current_user)]

@app.get("/")
async def root():
    return {"message": "the app works!"}


@app.get("/applications/{application_id}", response_model=JobApplicationSchema)
async def get_application(
    application_id: int,
    session: sql_engine.SessionDep,
    current_user: CurrentUserDep,
):
    application = session.exec(
        select(JobApplication).where(
            JobApplication.id == application_id,
            JobApplication.user_id == current_user.id,
        )
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@app.get("/applications", response_model=list[JobApplicationSchema])
async def get_applications(
    session: sql_engine.SessionDep,
    current_user: CurrentUserDep,
    status: ApplicationStatus | None = None,
    category_id: int | None = None,
):
    statement = select(JobApplication).where(
        JobApplication.user_id == current_user.id
    )

    if status is not None:
        statement = statement.where(JobApplication.status == status)

    if category_id is not None:
        statement = statement.where(JobApplication.category_id == category_id)

    return session.exec(statement).all()


@app.post("/applications", response_model=JobApplicationSchema, status_code=201)
async def create_application(
    data: JobApplicationCreateSchema,
    session: sql_engine.SessionDep,
    current_user: CurrentUserDep,
):
    if data.category_id is not None:
        category = session.exec(
            select(Category).where(
                Category.id == data.category_id,
                Category.user_id == current_user.id,
            )
        ).first()

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
        user_id=current_user.id,
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
    current_user: CurrentUserDep,
):
    job_application = session.exec(
        select(JobApplication).where(
            JobApplication.id == application_id,
            JobApplication.user_id == current_user.id,
        )
    ).first()

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
        category = session.exec(
            select(Category).where(
                Category.id == data.category_id,
                Category.user_id == current_user.id,
            )
        ).first()

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
    current_user: CurrentUserDep,
):
    application = session.exec(
        select(JobApplication).where(
            JobApplication.id == application_id,
            JobApplication.user_id == current_user.id,
        )
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    session.delete(application)
    session.commit()

    return application


@app.get("/category", response_model=list[CategorySchema])
async def get_category(
    session: sql_engine.SessionDep,
    current_user: CurrentUserDep,
):
    return session.exec(
        select(Category).where(Category.user_id == current_user.id)
    ).all()


@app.post("/category", response_model=CategorySchema, status_code=201)
async def create_category(
    data: CategoryCreateSchema,
    session: sql_engine.SessionDep,
    current_user: CurrentUserDep,
):
    category = Category(
        title=data.title.strip().lower(),
        user_id=current_user.id,
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
    current_user: CurrentUserDep,
):
    category = session.exec(
        select(Category).where(
            Category.id == category_id,
            Category.user_id == current_user.id,
        )
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    jobs_using_category = session.exec(
        select(JobApplication).where(
            JobApplication.category_id == category_id,
            JobApplication.user_id == current_user.id,
        )
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
    hashed_password = password_hash.hash(data.password)

    user = User(
        name=data.name.strip(),
        username=data.username.strip(),
        email=data.email.strip(),
        password=hashed_password,
    )

    #check if the user already exists

    try:
        session.add(user)
        session.commit()
        session.refresh(user)

    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=409,
            detail="Username already Taken.",
        )

    return user


@app.post("/token")
async def login_for_access_token(
    session: sql_engine.SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(form_data.username, form_data.password, session)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
    )

    return Token(access_token=access_token, token_type="bearer")


@app.get("/user/")
async def read_users_me(current_user: CurrentUserDep):
    return ({"name": current_user.name, "username": current_user.username, "email": current_user.email})

