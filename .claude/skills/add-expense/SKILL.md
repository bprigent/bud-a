---
name: add-expense
description: Add a new expense entry to the spending data
user-invocable: true
---

# Add Expense

When the user wants to log a new expense:

1. Read reference data:
   - `data/categories.csv` for available categories
   - `data/members.csv` for family members
   - `data/accounts.csv` for bank accounts

2. Ask for any missing information:
   - **Date** (default: today, YYYY-MM-DD)
   - **Amount** (in dollars — will be stored as cents)
   - **Currency** (default: USD, ISO 4217)
   - **Label** (description of the expense)
   - **Category** (use the `expense-matching` skill to auto-categorize from the label — apply matching rules first, then category descriptions; if no confident match, use Uncategorised)
   - **Member** (who made this purchase — from `data/members.csv`)
   - **From account** (which account the money left — from `data/accounts.csv`, stored as `from_account_id`)

3. Validate the input:
   - Date is valid ISO 8601
   - Amount is a positive number
   - `category_id` exists in categories.csv (or user confirms creating a new one)
   - `member_id` exists in members.csv
   - `from_account_id` exists in accounts.csv

4. Show a summary and ask for confirmation

5. Generate a UUID for the `id` column and append the row to `data/operations.csv` with `type: expense`, setting `from_account_id` and leaving `to_account_id` empty

6. Trigger a backup update
