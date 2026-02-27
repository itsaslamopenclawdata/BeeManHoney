"""
Email Service for BeeManHoney
Handles sending transactional emails for orders, alerts, and reports.
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.core.config import settings


class EmailService:
    """Email service for sending transactional emails."""
    
    def __init__(self):
        self.smtp_host = getattr(settings, 'SMTP_HOST', os.getenv('SMTP_HOST', ''))
        self.smtp_port = int(getattr(settings, 'SMTP_PORT', os.getenv('SMTP_PORT', '587')))
        self.smtp_user = getattr(settings, 'SMTP_USER', os.getenv('SMTP_USER', ''))
        self.smtp_pass = getattr(settings, 'SMTP_PASS', os.getenv('SMTP_PASS', ''))
        self.smtp_from_email = getattr(settings, 'SMTP_FROM_EMAIL', os.getenv('SMTP_FROM_EMAIL', ''))
        self.from_name = getattr(settings, 'SMTP_FROM_NAME', 'BeeManHoney')
    
    def is_configured(self) -> bool:
        """Check if SMTP is properly configured."""
        return bool(self.smtp_host and self.smtp_user and self.smtp_pass and self.smtp_from_email)
    
    def _get_config_status(self) -> Dict[str, Any]:
        """Get email configuration status (without exposing passwords)."""
        return {
            "configured": self.is_configured(),
            "smtp_host": self.smtp_host if self.smtp_host else None,
            "smtp_port": self.smtp_port,
            "smtp_from_email": self.smtp_from_email if self.smtp_from_email else None,
        }
    
    def _render_template(self, template_name: str, context: Dict[str, Any]) -> tuple[str, str]:
        """Render email template with context."""
        templates = {
            "order_confirmation": {
                "subject": "Order Confirmation - BeeManHoney",
                "body": f"""
Dear {context.get('customer_name', 'Valued Customer')},

Thank you for your order! We're delighted to confirm your order has been received.

Order Details:
- Order ID: {context.get('order_id', 'N/A')}
- Total Amount: ${context.get('total_amount', 0):.2f}
- Items: {context.get('items_count', 0)}

Your order is now being processed. We'll send you another email once it ships.

Thank you for choosing BeeManHoney!

Best regards,
The BeeManHoney Team
                """
            },
            "order_shipped": {
                "subject": "Your Order Has Shipped! - BeeManHoney",
                "body": f"""
Dear {context.get('customer_name', 'Valued Customer')},

Great news! Your order has shipped.

Order Details:
- Order ID: {context.get('order_id', 'N/A')}
- Tracking Number: {context.get('tracking_number', 'N/A')}
- Shipping Method: {context.get('shipping_method', 'Standard')}

You can track your package using the tracking number above.

Thank you for your purchase!

Best regards,
The BeeManHoney Team
                """
            },
            "order_delivered": {
                "subject": "Your Order Has Been Delivered - BeeManHoney",
                "body": f"""
Dear {context.get('customer_name', 'Valued Customer')},

Your order has been delivered!

Order Details:
- Order ID: {context.get('order_id', 'N/A')}

We hope you enjoy your purchase. If you have any questions or concerns, please don't hesitate to reach out.

Thank you for choosing BeeManHoney!

Best regards,
The BeeManHoney Team
                """
            },
            "low_stock_alert": {
                "subject": "Low Stock Alert - BeeManHoney",
                "body": f"""
Dear Admin,

This is an automated alert from BeeManHoney.

The following products are running low on stock:

{context.get('products_list', 'No products listed')}

Please restock these items soon to avoid overselling.

Best regards,
BeeManHoney System
                """
            },
            "monthly_report": {
                "subject": "Monthly KPI Report - BeeManHoney",
                "body": f"""
Dear Admin,

Here is your monthly KPI report for {context.get('month', 'this month')}.

SALES SUMMARY:
- Total Orders: {context.get('total_orders', 0)}
- Total Revenue: ${context.get('total_revenue', 0):.2f}
- Average Order Value: ${context.get('avg_order_value', 0):.2f}

TOP PRODUCTS:
{context.get('top_products', 'No data available')}

LOW STOCK ITEMS:
{context.get('low_stock_items', 'No low stock items')}

NEW CUSTOMERS:
- New Customers This Month: {context.get('new_customers', 0)}

Best regards,
BeeManHoney System
                """
            },
            "test_email": {
                "subject": "Test Email - BeeManHoney",
                "body": f"""
Dear Admin,

This is a test email from BeeManHoney.

If you're receiving this, your email configuration is working correctly!

Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}

Best regards,
BeeManHoney System
                """
            }
        }
        
        template = templates.get(template_name)
        if not template:
            raise ValueError(f"Unknown template: {template_name}")
        
        return template["subject"], template["body"]
    
    def send_email(
        self,
        to_email: str,
        template_name: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Send an email using a template.
        
        Args:
            to_email: Recipient email address
            template_name: Name of the template to use
            context: Dictionary of context variables for template rendering
            
        Returns:
            Dict with success status and message
        """
        if not self.is_configured():
            return {
                "success": False,
                "message": "Email service not configured. Please set SMTP environment variables."
            }
        
        if context is None:
            context = {}
        
        try:
            subject, body = self._render_template(template_name, context)
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = f"{self.from_name} <{self.smtp_from_email}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Attach body
            msg.attach(MIMEText(body.strip(), 'plain'))
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.sendmail(self.smtp_from_email, to_email, msg.as_string())
            
            return {
                "success": True,
                "message": f"Email sent successfully to {to_email}"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to send email: {str(e)}"
            }
    
    def send_order_confirmation(
        self,
        to_email: str,
        customer_name: str,
        order_id: str,
        total_amount: float,
        items_count: int
    ) -> Dict[str, Any]:
        """Send order confirmation email."""
        return self.send_email(
            to_email=to_email,
            template_name="order_confirmation",
            context={
                "customer_name": customer_name,
                "order_id": order_id,
                "total_amount": total_amount,
                "items_count": items_count
            }
        )
    
    def send_order_shipped(
        self,
        to_email: str,
        customer_name: str,
        order_id: str,
        tracking_number: Optional[str] = None,
        shipping_method: str = "Standard"
    ) -> Dict[str, Any]:
        """Send order shipped notification."""
        return self.send_email(
            to_email=to_email,
            template_name="order_shipped",
            context={
                "customer_name": customer_name,
                "order_id": order_id,
                "tracking_number": tracking_number or "N/A",
                "shipping_method": shipping_method
            }
        )
    
    def send_order_delivered(
        self,
        to_email: str,
        customer_name: str,
        order_id: str
    ) -> Dict[str, Any]:
        """Send order delivered notification."""
        return self.send_email(
            to_email=to_email,
            template_name="order_delivered",
            context={
                "customer_name": customer_name,
                "order_id": order_id
            }
        )
    
    def send_low_stock_alert(
        self,
        to_email: str,
        products: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Send low stock alert to admin."""
        products_list = "\n".join([
            f"- {p.get('name', 'Unknown')}: {p.get('stock_quantity', 0)} remaining"
            for p in products
        ])
        return self.send_email(
            to_email=to_email,
            template_name="low_stock_alert",
            context={"products_list": products_list}
        )
    
    def send_monthly_report(
        self,
        to_email: str,
        month: str,
        total_orders: int,
        total_revenue: float,
        avg_order_value: float,
        top_products: str,
        low_stock_items: str,
        new_customers: int
    ) -> Dict[str, Any]:
        """Send monthly KPI report."""
        return self.send_email(
            to_email=to_email,
            template_name="monthly_report",
            context={
                "month": month,
                "total_orders": total_orders,
                "total_revenue": total_revenue,
                "avg_order_value": avg_order_value,
                "top_products": top_products,
                "low_stock_items": low_stock_items,
                "new_customers": new_customers
            }
        )


# Singleton instance
email_service = EmailService()
