"""Tests for csv_utils.py — the core CSV data layer."""

import csv
import uuid

import pytest

import csv_utils
from csv_utils import (
    _write_all,
    delete_row,
    generate_id,
    get_row_by_id,
    read_csv,
    safe_int,
    update_row,
    validate_foreign_key,
    write_row,
)

CSV = "members.csv"
HEADERS = csv_utils.HEADERS[CSV]


@pytest.fixture(autouse=True)
def _isolated_data_dir(tmp_path, monkeypatch):
    """Point csv_utils.DATA_DIR at a temp directory for every test."""
    monkeypatch.setattr(csv_utils, "DATA_DIR", tmp_path)


# ── generate_id ──────────────────────────────────────────────────────


class TestGenerateId:
    def test_returns_valid_uuid(self) -> None:
        val = generate_id()
        uuid.UUID(val)  # raises if invalid

    def test_unique_across_calls(self) -> None:
        ids = {generate_id() for _ in range(50)}
        assert len(ids) == 50


# ── safe_int ─────────────────────────────────────────────────────────


class TestSafeInt:
    @pytest.mark.parametrize(
        "inp,expected",
        [
            ("42", 42),
            (42, 42),
            ("-7", -7),
            ("0", 0),
            (0, 0),
        ],
    )
    def test_valid_values(self, inp, expected) -> None:
        assert safe_int(inp) == expected

    @pytest.mark.parametrize("inp", [None, "", "abc", "3.14", "12.0"])
    def test_invalid_values_return_zero(self, inp) -> None:
        assert safe_int(inp) == 0


# ── read_csv ─────────────────────────────────────────────────────────


class TestReadCsv:
    def test_missing_file_creates_with_headers(self, tmp_path) -> None:
        rows = read_csv(CSV)
        assert rows == []
        filepath = tmp_path / CSV
        assert filepath.exists()
        with open(filepath) as f:
            reader = csv.reader(f)
            assert next(reader) == HEADERS

    def test_header_only_file(self, tmp_path) -> None:
        filepath = tmp_path / CSV
        with open(filepath, "w", newline="") as f:
            csv.writer(f).writerow(HEADERS)
        assert read_csv(CSV) == []

    def test_reads_rows(self, tmp_path) -> None:
        filepath = tmp_path / CSV
        with open(filepath, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=HEADERS)
            w.writeheader()
            w.writerow({"id": "1", "first_name": "Alice", "last_name": "A"})
        rows = read_csv(CSV)
        assert len(rows) == 1
        assert rows[0]["id"] == "1"
        assert rows[0]["first_name"] == "Alice"

    def test_pads_missing_columns(self, tmp_path) -> None:
        filepath = tmp_path / CSV
        with open(filepath, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=HEADERS)
            w.writeheader()
            w.writerow({"id": "1", "first_name": "Bob"})
        row = read_csv(CSV)[0]
        for h in HEADERS:
            assert h in row
        assert row["last_name"] == ""
        assert row["email"] == ""

    def test_ignores_extra_columns(self, tmp_path) -> None:
        filepath = tmp_path / CSV
        extended = HEADERS + ["extra_col"]
        with open(filepath, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=extended)
            w.writeheader()
            w.writerow({"id": "1", "first_name": "Eve", "extra_col": "junk"})
        row = read_csv(CSV)[0]
        assert "extra_col" not in row

    def test_none_values_become_empty_string(self, tmp_path) -> None:
        filepath = tmp_path / CSV
        with open(filepath, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=HEADERS)
            w.writeheader()
            w.writerow({"id": "1"})
        row = read_csv(CSV)[0]
        assert all(isinstance(v, str) for v in row.values())


# ── write_row ────────────────────────────────────────────────────────


class TestWriteRow:
    def test_appends_row_and_returns_it(self) -> None:
        result = write_row(CSV, {"id": "r1", "first_name": "Zoe"})
        assert result["id"] == "r1"
        assert result["first_name"] == "Zoe"
        rows = read_csv(CSV)
        assert len(rows) == 1
        assert rows[0]["id"] == "r1"

    def test_sanitizes_to_header_keys(self) -> None:
        result = write_row(CSV, {"id": "r2", "bogus": "val"})
        assert "bogus" not in result
        assert set(result.keys()) == set(HEADERS)

    def test_missing_fields_default_to_empty(self) -> None:
        result = write_row(CSV, {"id": "r3"})
        assert result["first_name"] == ""
        assert result["email"] == ""

    def test_multiple_writes_accumulate(self) -> None:
        write_row(CSV, {"id": "a"})
        write_row(CSV, {"id": "b"})
        write_row(CSV, {"id": "c"})
        assert len(read_csv(CSV)) == 3


# ── _write_all ───────────────────────────────────────────────────────


class TestWriteAll:
    def test_overwrites_file_atomically(self, tmp_path) -> None:
        write_row(CSV, {"id": "old"})
        _write_all(CSV, [{"id": "new", **{h: "" for h in HEADERS if h != "id"}}])
        rows = read_csv(CSV)
        assert len(rows) == 1
        assert rows[0]["id"] == "new"

    def test_no_temp_file_left_behind(self, tmp_path) -> None:
        _write_all(CSV, [])
        tmp_files = list(tmp_path.glob("*.tmp"))
        assert tmp_files == []

    def test_empty_rows_keeps_headers(self, tmp_path) -> None:
        write_row(CSV, {"id": "x"})
        _write_all(CSV, [])
        rows = read_csv(CSV)
        assert rows == []
        filepath = tmp_path / CSV
        with open(filepath) as f:
            assert next(csv.reader(f)) == HEADERS


# ── update_row ───────────────────────────────────────────────────────


class TestUpdateRow:
    def test_partial_update(self) -> None:
        write_row(CSV, {"id": "u1", "first_name": "Old", "last_name": "Name"})
        result = update_row(CSV, "u1", {"first_name": "New"})
        assert result is not None
        assert result["first_name"] == "New"
        assert result["last_name"] == "Name"

    def test_persists_to_disk(self) -> None:
        write_row(CSV, {"id": "u2", "first_name": "Before"})
        update_row(CSV, "u2", {"first_name": "After"})
        row = read_csv(CSV)[0]
        assert row["first_name"] == "After"

    def test_missing_row_returns_none(self) -> None:
        write_row(CSV, {"id": "exists"})
        assert update_row(CSV, "no-such-id", {"first_name": "X"}) is None

    def test_cannot_overwrite_id(self) -> None:
        write_row(CSV, {"id": "u3", "first_name": "A"})
        result = update_row(CSV, "u3", {"id": "hacked", "first_name": "B"})
        assert result is not None
        assert result["id"] == "u3"

    def test_ignores_unknown_fields(self) -> None:
        write_row(CSV, {"id": "u4"})
        result = update_row(CSV, "u4", {"nonexistent_field": "val"})
        assert result is not None
        assert "nonexistent_field" not in result


# ── delete_row ───────────────────────────────────────────────────────


class TestDeleteRow:
    def test_deletes_existing_row(self) -> None:
        write_row(CSV, {"id": "d1"})
        write_row(CSV, {"id": "d2"})
        assert delete_row(CSV, "d1") is True
        rows = read_csv(CSV)
        assert len(rows) == 1
        assert rows[0]["id"] == "d2"

    def test_missing_row_returns_false(self) -> None:
        write_row(CSV, {"id": "d3"})
        assert delete_row(CSV, "no-such-id") is False
        assert len(read_csv(CSV)) == 1

    def test_delete_only_row(self) -> None:
        write_row(CSV, {"id": "d4"})
        assert delete_row(CSV, "d4") is True
        assert read_csv(CSV) == []


# ── get_row_by_id ────────────────────────────────────────────────────


class TestGetRowById:
    def test_found(self) -> None:
        write_row(CSV, {"id": "g1", "first_name": "Found"})
        row = get_row_by_id(CSV, "g1")
        assert row is not None
        assert row["first_name"] == "Found"

    def test_not_found(self) -> None:
        write_row(CSV, {"id": "g2"})
        assert get_row_by_id(CSV, "missing") is None

    def test_empty_file(self) -> None:
        assert get_row_by_id(CSV, "anything") is None


# ── validate_foreign_key ─────────────────────────────────────────────


class TestValidateForeignKey:
    def test_valid_reference(self) -> None:
        write_row(CSV, {"id": "fk1"})
        assert validate_foreign_key(CSV, "id", "fk1") is True

    def test_invalid_reference(self) -> None:
        write_row(CSV, {"id": "fk2"})
        assert validate_foreign_key(CSV, "id", "no-match") is False

    def test_checks_arbitrary_field(self) -> None:
        write_row(CSV, {"id": "fk3", "first_name": "Alice"})
        assert validate_foreign_key(CSV, "first_name", "Alice") is True
        assert validate_foreign_key(CSV, "first_name", "Bob") is False

    def test_empty_table(self) -> None:
        assert validate_foreign_key(CSV, "id", "anything") is False
