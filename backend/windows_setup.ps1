# StudyNotes Hub — Windows Setup Script
  # Run this in PowerShell from the backend folder

  # Create needed folders (Windows compatible)
  if (-not (Test-Path uploads)) { New-Item -ItemType Directory -Name uploads | Out-Null }
  if (-not (Test-Path logs))    { New-Item -ItemType Directory -Name logs    | Out-Null }

  Write-Host "Folders created." -ForegroundColor Green

  # Remind about .env
  if (-not (Test-Path .env)) {
      Copy-Item .env.example .env
      Write-Host ".env created from .env.example — open it and fill in your values." -ForegroundColor Yellow
  } else {
      Write-Host ".env already exists." -ForegroundColor Cyan
  }

  Write-Host "Setup complete. Run: python app.py" -ForegroundColor Green
  