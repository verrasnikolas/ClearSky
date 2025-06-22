<#
.SYNOPSIS
    Copies DEMO.env to DEMO.env in predefined microservice subdirectories.

.DESCRIPTION
    This script is designed to be run from the root directory of your project.
    It iterates through a pre-defined list of microservice subdirectory names
    and, for each directory, it attempts to:
    1. Navigate into that directory.
    2. Check if a DEMO.env file exists.
    3. If DEMO.env exists and a DEMO.env file does NOT exist, it copies DEMO.env to DEMO.env.
    4. If DEMO.env already exists, it informs the user and skips copying for that directory.

.EXAMPLE
    # Run the script from your project root:
    .\copy_demo_envs.ps1

.NOTES
    - Ensure this script is in the root directory of your project.
    - Ensure DEMO.env files exist in the specified microservice folders.
    - The DEMO.env file will NOT be overwritten if it already exists.
    - Designed for client demo setup where DEMO.env contains safe, non-sensitive values.
    - The list of microservice folders is hardcoded within the script for simplicity.
#>

# --- Predefined list of your microservice folders ---
# These folders must exist directly under the script's location (project root).
$MicroserviceFolders = @(
    "grades-service",
    "review_service",
    "statistics-service",
    "user-service"
)
# ----------------------------------------------------

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath # Ensure the script runs from its own directory (project root)

Write-Host "--- PowerShell .env Setup Script ---" -ForegroundColor Cyan

foreach ($folder in $MicroserviceFolders) {
    $folderPath = Join-Path -Path $scriptPath -ChildPath $folder

    Write-Host "`nProcessing folder: $folder" -ForegroundColor Yellow

    if (Test-Path -Path $folderPath -PathType Container) {
        Push-Location $folderPath # Go into the microservice folder

        if (Test-Path -Path "DEMO.env" -PathType Leaf) {
            if (Test-Path -Path "DEMO.env" -PathType Leaf) {
                Write-Host "  DEMO.env already exists in '$folder'. Skipping copy." -ForegroundColor Gray
            } else {
                try {
                    Copy-Item -Path "DEMO.env" -Destination "DEMO.env" -Force:$false -ErrorAction Stop
                    Write-Host "  Successfully copied DEMO.env to DEMO.env in '$folder'." -ForegroundColor Green
                }
                catch {
                    Write-Error "  Failed to copy DEMO.env to DEMO.env in '$folder': $($_.Exception.Message)"
                }
            }
        } else {
            Write-Host "  DEMO.env not found in '$folder'. Skipping." -ForegroundColor DarkYellow
        }

        Pop-Location # Go back to the original script directory
    } else {
        Write-Warning "  Folder '$folder' not found. Please check the folder name."
    }
}

Write-Host "`n--- .env setup complete ---" -ForegroundColor Cyan

# Optional: Add instructions for the client here, e.g., to run docker compose
# Write-Host "`nNow, you can proceed with starting your Docker Compose services:`n"
# Write-Host "  docker compose up --build -d"