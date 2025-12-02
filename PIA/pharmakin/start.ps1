# Script de inicio para PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PharmaKin - Inicio Rapido" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esté disponible
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker no encontrado"
    }
    Write-Host "Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker no esta disponible!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Abre Docker Desktop desde el menu de inicio"
    Write-Host "2. Espera a que inicie completamente (icono verde en la bandeja)"
    Write-Host "3. Ejecuta este script de nuevo"
    Write-Host ""
    Write-Host "O ejecuta manualmente sin Docker (ver GUIA_EJECUCION.md)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar que Docker esté corriendo
try {
    docker ps | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker no esta corriendo"
    }
    Write-Host "Docker esta corriendo. Iniciando aplicacion..." -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "ERROR: Docker Desktop no esta corriendo!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Abre Docker Desktop desde el menu de inicio"
    Write-Host "2. Espera a que inicie completamente"
    Write-Host "3. Ejecuta este script de nuevo"
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Ejecutar docker-compose
docker-compose up --build

