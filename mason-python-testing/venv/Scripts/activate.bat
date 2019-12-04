@echo off

rem This file is UTF-8 encoded, so we need to update the current code page while executing it
<<<<<<< HEAD
for /f "tokens=2 delims=:." %%a in ('"%SystemRoot%\System32\chcp.com"') do (
    set _OLD_CODEPAGE=%%a
=======
for /f "tokens=2 delims=:" %%a in ('"%SystemRoot%\System32\chcp.com"') do (
    set "_OLD_CODEPAGE=%%a"
>>>>>>> 6fa881f75740879be432c459b9cab8a7b7aa2895
)
if defined _OLD_CODEPAGE (
    "%SystemRoot%\System32\chcp.com" 65001 > nul
)

<<<<<<< HEAD
set VIRTUAL_ENV=C:\Users\melka\PCI-Efficiency-Project\mason-python-testing\venv

if not defined PROMPT set PROMPT=$P$G

if defined _OLD_VIRTUAL_PROMPT set PROMPT=%_OLD_VIRTUAL_PROMPT%
if defined _OLD_VIRTUAL_PYTHONHOME set PYTHONHOME=%_OLD_VIRTUAL_PYTHONHOME%

set _OLD_VIRTUAL_PROMPT=%PROMPT%
set PROMPT=(venv) %PROMPT%

if defined PYTHONHOME set _OLD_VIRTUAL_PYTHONHOME=%PYTHONHOME%
set PYTHONHOME=

if defined _OLD_VIRTUAL_PATH set PATH=%_OLD_VIRTUAL_PATH%
if not defined _OLD_VIRTUAL_PATH set _OLD_VIRTUAL_PATH=%PATH%

set PATH=%VIRTUAL_ENV%\Scripts;%PATH%
=======
set "VIRTUAL_ENV=C:\PCI-Efficiency-Project\mason-python-testing\venv"

if not defined PROMPT (
    set "PROMPT=$P$G"
)

if defined _OLD_VIRTUAL_PROMPT (
    set "PROMPT=%_OLD_VIRTUAL_PROMPT%"
)

if defined _OLD_VIRTUAL_PYTHONHOME (
    set "PYTHONHOME=%_OLD_VIRTUAL_PYTHONHOME%"
)

set "_OLD_VIRTUAL_PROMPT=%PROMPT%"
set "PROMPT=(venv) %PROMPT%"

if defined PYTHONHOME (
    set "_OLD_VIRTUAL_PYTHONHOME=%PYTHONHOME%"
    set PYTHONHOME=
)

if defined _OLD_VIRTUAL_PATH (
    set "PATH=%_OLD_VIRTUAL_PATH%"
) else (
    set "_OLD_VIRTUAL_PATH=%PATH%"
)

set "PATH=%VIRTUAL_ENV%\Scripts;%PATH%"
>>>>>>> 6fa881f75740879be432c459b9cab8a7b7aa2895

:END
if defined _OLD_CODEPAGE (
    "%SystemRoot%\System32\chcp.com" %_OLD_CODEPAGE% > nul
<<<<<<< HEAD
    set _OLD_CODEPAGE=
=======
    set "_OLD_CODEPAGE="
>>>>>>> 6fa881f75740879be432c459b9cab8a7b7aa2895
)
