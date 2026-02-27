"""
Notification API endpoints for BeeManHoney
Handles email configuration and test endpoints.
"""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from app.api import deps
from app.core.config import settings
from app.services.email import email_service

router = APIRouter()


# --- Schemas ---
class TestEmailRequest(BaseModel):
    email: EmailStr


class EmailConfigUpdate(BaseModel):
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_pass: str
    smtp_from_email: EmailStr
    smtp_from_name: str = "BeeManHoney"
    admin_email: EmailStr


class EmailConfigResponse(BaseModel):
    configured: bool
    smtp_host: str | None
    smtp_port: int
    smtp_from_email: str | None


# --- Endpoints ---
@router.post("/test")
async def test_email(
    request: TestEmailRequest,
    current_user: deps.User = Depends(deps.get_current_user)
) -> Dict[str, Any]:
    """
    Send a test email to verify email configuration.
    Accessible to authenticated users.
    """
    result = email_service.send_email(
        to_email=request.email,
        template_name="test_email",
        context={}
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result


@router.get("/config", response_model=EmailConfigResponse)
async def get_email_config(
    current_user: deps.User = Depends(deps.get_current_admin)
) -> EmailConfigResponse:
    """
    Get email configuration status.
    Admin only - does not expose password.
    """
    return EmailConfigResponse(
        configured=email_service.is_configured(),
        smtp_host=email_service.smtp_host if email_service.smtp_host else None,
        smtp_port=email_service.smtp_port,
        smtp_from_email=email_service.smtp_from_email if email_service.smtp_from_email else None
    )


@router.put("/config")
async def update_email_config(
    config: EmailConfigUpdate,
    current_user: deps.User = Depends(deps.get_current_admin)
) -> Dict[str, Any]:
    """
    Update email configuration settings.
    Admin only.
    
    Note: This updates runtime settings only. For persistent changes,
    update the .env file.
    """
    # Update runtime settings
    email_service.smtp_host = config.smtp_host
    email_service.smtp_port = config.smtp_port
    email_service.smtp_user = config.smtp_user
    email_service.smtp_pass = config.smtp_pass
    email_service.smtp_from_email = config.smtp_from_email
    email_service.from_name = config.smtp_from_name
    
    # Update admin email in settings
    settings.ADMIN_EMAIL = config.admin_email
    
    return {
        "success": True,
        "message": "Email configuration updated successfully"
    }


@router.post("/test-config")
async def test_email_config(
    current_user: deps.User = Depends(deps.get_current_admin)
) -> Dict[str, Any]:
    """
    Send a test email to the admin email address to verify configuration.
    Admin only.
    """
    admin_email = settings.ADMIN_EMAIL
    
    if not admin_email:
        # Try to use the user's email as fallback
        admin_email = current_user.email
    
    result = email_service.send_email(
        to_email=admin_email,
        template_name="test_email",
        context={}
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return {
        "success": True,
        "message": f"Test email sent to {admin_email}"
    }
