import io
import os
import logging
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.pagesizes import A4

logger = logging.getLogger(__name__)

def add_watermark(pdf_path, buyer_email):
    """Stamp each page with the buyer's email as a diagonal watermark."""
    try:
        reader = PdfReader(pdf_path)
        writer = PdfWriter()

        packet = io.BytesIO()
        c = rl_canvas.Canvas(packet, pagesize=A4)
        width, height = A4
        c.setFont("Helvetica", 14)
        c.setFillColorRGB(0.8, 0.8, 0.8, alpha=0.4)
        c.saveState()
        c.translate(width / 2, height / 2)
        c.rotate(45)
        c.drawCentredString(0, 0, f"Licensed to {buyer_email}")
        c.restoreState()
        c.save()
        packet.seek(0)

        from pypdf import PdfReader as PR
        watermark_page = PR(packet).pages[0]

        for page in reader.pages:
            page.merge_page(watermark_page)
            writer.add_page(page)

        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        return output
    except Exception as e:
        logger.error("Watermark failed: %s", e)
        # Fall back to raw file
        with open(pdf_path, "rb") as f:
            return io.BytesIO(f.read())
