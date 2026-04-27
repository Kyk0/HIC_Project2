from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models
from app.routers import auth
from app.routers import auth, recipes, cookbook, kitchen, comments, profile



Base.metadata.create_all(bind=engine)




app = FastAPI()

app.include_router(auth.router)
app.include_router(recipes.router)
app.include_router(cookbook.router)
app.include_router(kitchen.router)
app.include_router(comments.router)
app.include_router(profile.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"I'm": "workin'"}