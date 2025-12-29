from fastapi import FastAPI

app = FastAPI(title = "Stryker MVP API")

@app.get("/health")
def health():
    return {"status":"ok"}
