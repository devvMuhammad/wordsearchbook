'use server'

import puppeteer from 'puppeteer';

export async function generatePDF(html: string, paperSize: "A4" | "A5") {
  try {
    const browser = await puppeteer.launch({"headless":true});
    
    const page = await browser.newPage();
    
    // Set viewport to ensure proper rendering
    await page.setViewport({
      width: 1024,
      height: 1024,
      deviceScaleFactor: 2,
    });

    // Set content with proper styling
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout:500 * 1000,
    });

    // Generate PDF with custom settings
    const pdf = await page.pdf({
      format: paperSize,
      printBackground: true,
      margin: {
        right: '10px',
        bottom: '10px',
        left: '10px'
      },
      timeout: 500 * 1000,
    });

    await browser.close();

    // Return base64 encoded PDF
    return Buffer.from(pdf).toString('base64');
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
}