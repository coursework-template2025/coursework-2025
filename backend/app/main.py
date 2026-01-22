from fastapi import FastAPI
from app.application.settings import settings
from fastapi.middleware.cors import CORSMiddleware

from app.presentation.api.router import api_router
from app.presentation.websocket.router import ws_router
app = FastAPI(root_path="/api/chat", title="Unet Chat Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT",],
    allow_headers=['content-disposition', 'accept-encoding',
                  'content-type', 'accept', 'origin', 'authorization', 'dnt', 'x-csrftoken', 'x-requested-with',
                  'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin'],
)
app.include_router(api_router)
app.include_router(ws_router, prefix="/ws")

@app.get("/")
async def root():
    return {"message": "Hello World"}

