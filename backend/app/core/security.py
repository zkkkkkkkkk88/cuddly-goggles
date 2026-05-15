from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import HTTPException
from jose import jwt, JWTError

from app.core.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        return None


def require_user(token: str | None = None) -> int:
    """FastAPI dependency — extract and verify JWT from request header.

    In route: user_id = require_user(authorization)
    The header value comes from: request.headers.get("Authorization", "").removeprefix("Bearer ")
    """
    if not token:
        raise HTTPException(status_code=401, detail="请先登录")
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="登录已过期，请重新登录")
    return user_id
