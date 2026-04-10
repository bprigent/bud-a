"""User preferences: default currency, backup password, and data export."""

import hashlib
import io
import json
import os
import secrets
import zipfile
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from csv_utils import DATA_DIR, HEADERS

router = APIRouter(prefix="/api/preferences", tags=["preferences"])

PREFS_FILE = DATA_DIR / "preferences.json"


def _read_prefs() -> dict:
    """Read preferences from disk, returning defaults if the file is missing."""
    if PREFS_FILE.exists():
        with open(PREFS_FILE, "r") as f:
            return json.load(f)
    return {"default_currency": os.getenv("DEFAULT_CURRENCY", "EUR")}


def _write_prefs(prefs: dict) -> None:
    """Write preferences to disk atomically."""
    tmp = PREFS_FILE.with_suffix(".tmp")
    with open(tmp, "w") as f:
        json.dump(prefs, f, indent=2)
    tmp.rename(PREFS_FILE)


def _hash_password(password: str, salt: bytes | None = None) -> tuple[str, str]:
    """Hash a password with PBKDF2-SHA256. Returns (hash_hex, salt_hex)."""
    if salt is None:
        salt = secrets.token_bytes(32)
    h = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations=600_000)
    return h.hex(), salt.hex()


def _verify_password(password: str, stored_hash: str, stored_salt: str) -> bool:
    """Verify a password against the stored hash and salt."""
    salt = bytes.fromhex(stored_salt)
    h = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations=600_000)
    return secrets.compare_digest(h.hex(), stored_hash)


# --- Models ---

class CurrencyUpdate(BaseModel):
    currency: str = Field(min_length=3, max_length=3)


class PasswordSet(BaseModel):
    new_password: str = Field(min_length=8, max_length=128)


class PasswordChange(BaseModel):
    old_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# --- Endpoints ---

@router.get("/")
def get_preferences() -> dict:
    """Return current preferences (password hash is never exposed)."""
    prefs = _read_prefs()
    return {
        "default_currency": prefs.get("default_currency", "EUR"),
        "has_backup_password": "backup_password_hash" in prefs,
    }


@router.put("/currency")
def update_currency(body: CurrencyUpdate) -> dict:
    """Update the default currency."""
    prefs = _read_prefs()
    prefs["default_currency"] = body.currency.upper()
    _write_prefs(prefs)
    return {"default_currency": prefs["default_currency"]}


@router.post("/backup-password")
def set_backup_password(body: PasswordSet) -> dict:
    """Set the backup password for the first time."""
    prefs = _read_prefs()
    if "backup_password_hash" in prefs:
        raise HTTPException(
            status_code=409,
            detail="Backup password already set. Use PUT to change it.",
        )
    h, s = _hash_password(body.new_password)
    prefs["backup_password_hash"] = h
    prefs["backup_password_salt"] = s
    _write_prefs(prefs)
    return {"detail": "Backup password set"}


@router.put("/backup-password")
def change_backup_password(body: PasswordChange) -> dict:
    """Change the backup password (requires the old password)."""
    prefs = _read_prefs()
    if "backup_password_hash" not in prefs:
        raise HTTPException(
            status_code=404,
            detail="No backup password set yet. Use POST to create one.",
        )
    if not _verify_password(
        body.old_password,
        prefs["backup_password_hash"],
        prefs["backup_password_salt"],
    ):
        raise HTTPException(status_code=403, detail="Current password is incorrect")
    h, s = _hash_password(body.new_password)
    prefs["backup_password_hash"] = h
    prefs["backup_password_salt"] = s
    _write_prefs(prefs)
    return {"detail": "Backup password updated"}


class ExportRequest(BaseModel):
    password: str = Field(min_length=1, max_length=128)


@router.post("/export")
def export_data(body: ExportRequest):
    """Export all CSV data files and preferences as a ZIP archive.

    Requires the backup password to be verified before downloading.
    """
    prefs = _read_prefs()
    if "backup_password_hash" not in prefs:
        raise HTTPException(status_code=404, detail="No backup password set")
    if not _verify_password(
        body.password,
        prefs["backup_password_hash"],
        prefs["backup_password_salt"],
    ):
        raise HTTPException(status_code=403, detail="Incorrect password")

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for filename in HEADERS:
            filepath = DATA_DIR / filename
            if filepath.exists():
                zf.write(filepath, filename)
        if PREFS_FILE.exists():
            zf.write(PREFS_FILE, "preferences.json")
        rules_file = DATA_DIR / "matching_rules.json"
        if rules_file.exists():
            zf.write(rules_file, "matching_rules.json")
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=bud-a-export.zip"},
    )
