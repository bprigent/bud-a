"""Main FastAPI application for the household budget app."""

import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from csv_utils import DATA_DIR, HEADERS, ensure_file
from budget_plan_service import ensure_budget_data_migrated
from routers import (
    accounts,
    budget_plans,
    budgets,
    categories,
    matching_rules,
    members,
    operations,
    preferences,
    reports,
)
from watcher import connected_clients, set_event_loop, start_watcher

# Bank logos live next to CSVs: data/images/bank-logos/<filename> → GET /api/data-images/bank-logos/<filename>
BANK_LOGOS_DIR = DATA_DIR / "images" / "bank-logos"
BANK_LOGOS_DIR.mkdir(parents=True, exist_ok=True)

def _init_data_files() -> None:
    """Create all CSV files with headers if they don't exist yet."""
    for filename in HEADERS:
        ensure_file(filename)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup tasks, then yield control to the application."""
    _init_data_files()
    ensure_budget_data_migrated()
    loop = asyncio.get_event_loop()
    set_event_loop(loop)
    start_watcher()
    yield


app = FastAPI(title="Household Budget API", lifespan=lifespan)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

# CORS: set CORS_ORIGINS to comma-separated origins (see backend/.env.example)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(members.router)
app.include_router(accounts.router)
app.include_router(categories.router)
app.include_router(operations.router)
app.include_router(budget_plans.router)
app.include_router(budgets.router)
app.include_router(reports.router)
app.include_router(matching_rules.router)
app.include_router(preferences.router)

app.mount(
    "/api/data-images/bank-logos",
    StaticFiles(directory=str(BANK_LOGOS_DIR)),
    name="bank_logos",
)



@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """WebSocket endpoint that notifies clients when CSV files change."""
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            # Keep connection alive; wait for client messages (e.g. pings)
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_clients.discard(websocket)
    except Exception:
        connected_clients.discard(websocket)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
