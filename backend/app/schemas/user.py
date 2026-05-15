from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    token: str | None = None

    model_config = {"from_attributes": True}
