from fastapi import FastAPI
from app.core import logging
from app.api.routes import matches

app = FastAPI(title = "Stryker MVP API")

@app.get("/health")
def health():
    return {"status":"ok"}

app.include_router(matches.router, prefix="/api/v1")

