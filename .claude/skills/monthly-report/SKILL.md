---
name: monthly-report
description: Generate a monthly spending report with category breakdowns and trends
user-invocable: true
---

# Monthly Report

Generate a comprehensive monthly spending report:

1. Read data files for the requested month (default: current month):
   - `data/operations.csv` — filter by date, split by type (expense/income/money_movement)
   - `data/categories.csv` — join on category_id for names
   - `data/members.csv` — join on member_id for names
   - `data/budgets.csv` — current budgets (where end_date is empty)

2. Calculate:
   - Total spending and total income
   - Net (income minus expenses)
   - Spending by category (sorted highest to lowest, with category names)
   - Spending by family member
   - Budget vs. actual per category (% used)
   - Average daily spend
   - Comparison to previous month (% change)
   - Top 5 largest transactions

3. Present the report with:
   - Clear totals and percentages (amounts in dollars, 2 decimal places)
   - Category breakdown table with budget comparison
   - Per-member breakdown
   - Month-over-month trends
   - Categories over budget highlighted
   - Any notable patterns or anomalies

4. Offer to drill into any specific category or member if the user wants more detail
