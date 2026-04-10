---
name: backup
description: Create an encrypted backup of all financial data
user-invocable: true
---

# Create Backup

Create an encrypted backup of all financial data:

1. Verify the public key is available for encryption
2. List all CSV files in `data/` that will be included
3. Show the user what will be backed up (file names, sizes, record counts)
4. Create a timestamped archive of all data files
5. Encrypt the archive using the public key
6. Save to the backups directory with naming format: `backup_YYYY-MM-DD_HHMMSS.enc`
7. Verify the backup was created successfully
8. Report the backup file location and size
