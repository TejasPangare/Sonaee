from fastapi import APIRouter, HTTPException

from .. import schemas
from ..notifications import notify_banquet_inquiry, notify_contact_inquiry

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.post("/contact", response_model=schemas.InquiryResponse)
def submit_contact_inquiry(inquiry: schemas.ContactInquiryRequest):
    sent = notify_contact_inquiry(inquiry)
    if not sent:
        raise HTTPException(status_code=503, detail="Unable to send contact inquiry right now")
    return schemas.InquiryResponse(success=True, message="Contact inquiry sent successfully")


@router.post("/banquet", response_model=schemas.InquiryResponse)
def submit_banquet_inquiry(inquiry: schemas.BanquetInquiryRequest):
    sent = notify_banquet_inquiry(inquiry)
    if not sent:
        raise HTTPException(status_code=503, detail="Unable to send banquet inquiry right now")
    return schemas.InquiryResponse(success=True, message="Banquet inquiry sent successfully")
