"""CRUD endpoints for categories."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from csv_utils import delete_row, generate_id, get_row_by_id, read_csv, update_row, write_row

def _count_references(category_id: str) -> dict[str, int]:
    """Count how many operations and budgets reference this category."""
    counts: dict[str, int] = {}
    for filename, label in [("operations.csv", "operations"), ("budgets.csv", "budgets")]:
        rows = read_csv(filename)
        n = sum(1 for r in rows if r.get("category_id") == category_id)
        if n > 0:
            counts[label] = n
    return counts

router = APIRouter(prefix="/api/categories", tags=["categories"])

CSV_FILE = "categories.csv"

class CategoryCreate(BaseModel):
    name: str = Field(max_length=200)
    emoji: str = Field(default="", max_length=10)
    description: str = Field(default="", max_length=500)


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=200)
    emoji: str | None = Field(default=None, max_length=10)
    description: str | None = Field(default=None, max_length=500)


@router.get("/")
def list_categories() -> list[dict[str, str]]:
    """List all categories."""
    return read_csv(CSV_FILE)


@router.get("/{category_id}")
def get_category(category_id: str) -> dict[str, str]:
    """Get a single category by id."""
    row = get_row_by_id(CSV_FILE, category_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return row


@router.post("/", status_code=201)
def create_category(category: CategoryCreate) -> dict[str, str]:
    """Create a new category."""
    row = {
        "id": generate_id(),
        "name": category.name,
        "emoji": category.emoji,
        "description": category.description,
    }
    return write_row(CSV_FILE, row)


@router.put("/{category_id}")
def update_category(category_id: str, category: CategoryUpdate) -> dict[str, str]:
    """Update a category by id."""
    updates = category.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = update_row(CSV_FILE, category_id, updates)
    if result is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return result


@router.delete("/{category_id}")
def delete_category(category_id: str) -> dict[str, str]:
    """Delete a category by id, unless it is still referenced."""
    if get_row_by_id(CSV_FILE, category_id) is None:
        raise HTTPException(status_code=404, detail="Category not found")
    refs = _count_references(category_id)
    if refs:
        parts = [f"{n} {label}" for label, n in refs.items()]
        raise HTTPException(
            status_code=409,
            detail=f"Cannot delete: category is used by {' and '.join(parts)}",
        )
    delete_row(CSV_FILE, category_id)
    return {"detail": "Category deleted"}
