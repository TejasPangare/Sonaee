import firebase_admin
from firebase_admin import credentials
from pathlib import Path

cred_path = Path(__file__).resolve().parent / "serviceAccountKey.json"
if not cred_path.exists():
    raise FileNotFoundError(
        f"Firebase service account key not found: {cred_path}"
    )

cred = credentials.Certificate(str(cred_path))
firebase_admin.initialize_app(cred)
