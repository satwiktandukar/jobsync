from fastapi import FastAPI, Response, status
from services import sql_engine
from models.models import *

import os

from pydantic import BaseModel

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
from schemas.schemas import *

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


@app.get("/applications/{id}")
async def get_applications(id: int, session: sql_engine.SessionDep) -> JobApplicationSchema: 
    application = session.get(JobApplication, id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application



@app.post("/applications")
async def create_application(application: JobApplication, session: sql_engine.SessionDep) -> JobApplicationSchema: 
    #check if category exists in the Category table. 

    category = session.get(Category, application.category)
    if not category: 
        category_table = Category()
        category_table.id = application.category
        session.add(category_table)
        
    session.add(application)
    session.commit()
    session.refresh(application)
    return application


@app.get("/category")
async def get_category(session: sql_engine.SessionDep): 
    return session.exec(select(Category)).all()