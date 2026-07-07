@echo off
setlocal

cd /d "%~dp0"

set "PROFILE=%SPRING_PROFILES_ACTIVE%"
if "%PROFILE%"=="" set "PROFILE=%~1"
if "%PROFILE%"=="" set "PROFILE=dev"

if exist "C:\Program Files\Java\jdk-21\" (
  set "JAVA_HOME=C:\Program Files\Java\jdk-21"
  set "PATH=%JAVA_HOME%\bin;%PATH%"
)

if not exist "%JAVA_HOME%\bin\java.exe" (
  echo [ERROR] Khong tim thay Java. Can cai JDK 21 va set JAVA_HOME dung.
  exit /b 1
)

if not exist "%JAVA_HOME%\release" (
  echo [ERROR] JAVA_HOME khong hop le: %JAVA_HOME%
  exit /b 1
)

powershell -NoProfile -Command ^
  "$release = Get-Content '%JAVA_HOME%\release' -Raw; if ($release -match 'JAVA_VERSION=""21') { exit 0 } else { exit 1 }"
if errorlevel 1 (
  echo [ERROR] Backend nay can JDK 21. JAVA_HOME hien tai: %JAVA_HOME%
  echo [HINT] Cai dat JDK 21 hoac sua JAVA_HOME ve dung thu muc JDK 21.
  exit /b 1
)

echo Starting backend with profile: %PROFILE%
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=%PROFILE%

endlocal
