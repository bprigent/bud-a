"""File watcher module using watchdog to monitor CSV changes and notify WebSocket clients."""

import asyncio
import json
from pathlib import Path
from typing import Any

from watchdog.events import FileSystemEvent, FileSystemEventHandler
from watchdog.observers import Observer

from csv_utils import DATA_DIR

# Set of connected WebSocket clients
connected_clients: set[Any] = set()

# Reference to the running event loop (set from main.py on startup)
_loop: asyncio.AbstractEventLoop | None = None


def set_event_loop(loop: asyncio.AbstractEventLoop) -> None:
    """Store the asyncio event loop so the sync handler can schedule coroutines."""
    global _loop
    _loop = loop


class CSVChangeHandler(FileSystemEventHandler):
    """Handler that broadcasts CSV file changes to WebSocket clients."""

    def on_modified(self, event: FileSystemEvent) -> None:
        self._handle(event)

    def on_created(self, event: FileSystemEvent) -> None:
        self._handle(event)

    def _handle(self, event: FileSystemEvent) -> None:
        if event.is_directory:
            return
        path = Path(str(event.src_path))
        if path.suffix != ".csv":
            return
        filename = path.name
        if _loop is not None:
            _loop.call_soon_threadsafe(
                asyncio.ensure_future,
                broadcast({"type": "csv_changed", "file": filename}),
            )


async def broadcast(message: dict[str, str]) -> None:
    """Send a JSON message to all connected WebSocket clients."""
    if not connected_clients:
        return
    payload = json.dumps(message)
    stale: list[Any] = []
    for ws in connected_clients:
        try:
            await ws.send_text(payload)
        except Exception:
            stale.append(ws)
    for ws in stale:
        connected_clients.discard(ws)


def start_watcher() -> Observer:
    """Start watching the data directory for CSV changes."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    handler = CSVChangeHandler()
    observer = Observer()
    observer.schedule(handler, str(DATA_DIR), recursive=False)
    observer.daemon = True
    observer.start()
    return observer
