from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.api.analysis import router as analysis_router
import uvicorn

app = FastAPI(
    title="TrustChain Pro API",
    version="1.0.0",
    description="AI-powered scam and fake news detection platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(analysis_router)

@app.get("/")
async def root():
    return {
        "message": "TrustChain Pro API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "operational"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)