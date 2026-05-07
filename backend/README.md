# VaidyaAstra Backend (Hackathon Setup)

Use this quick setup to avoid global Python package conflicts on Windows.

## 1) Create and activate a local virtual environment

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 2) Upgrade pip and install dependencies

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip check
```

`pip check` should return no conflicts.

## 3) Run backend from terminal

```powershell
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Using `python -m uvicorn` avoids PATH warnings related to `uvicorn.exe`.

