/**
 * Base Email Template
 * Provides consistent branding and styling for all EYF emails
 */

export interface EmailTemplateProps {
  content: string;
  title?: string;
  preheader?: string;
  footerText?: string;
}

/**
 * Generate base HTML email template with EYF branding
 */
export function baseEmailTemplate(props: EmailTemplateProps): string {
  const { content, title = 'Engage Youth Fund', preheader = '', footerText = '© 2024 Engage Youth Fund. All rights reserved.' } = props;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
      color: #fff;
      padding: 40px 20px;
      text-align: center;
      border-bottom: 4px solid #d4a574;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 20px;
    }
    .content h2 {
      color: #000;
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .content p {
      margin-bottom: 15px;
      line-height: 1.8;
    }
    .highlight {
      background-color: #f9f9f9;
      border-left: 4px solid #d4a574;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .button {
      display: inline-block;
      background-color: #d4a574;
      color: #000;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #c99565;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #d4a574;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .info-block {
      background-color: #f9f9f9;
      padding: 15px 20px;
      margin: 15px 0;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }
    .info-block strong {
      color: #000;
      display: block;
      margin-bottom: 5px;
    }
    @media (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .header {
        padding: 30px 15px;
      }
      .header h1 {
        font-size: 22px;
      }
      .content h2 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Engage Youth Fund</h1>
      <p>Empowering Youth, Building Futures</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>${footerText}</p>
      <p style="margin-top: 15px;">
        Questions? <a href="mailto:admin@engage-youth.org">Contact us</a>
      </p>
      <p style="margin-top: 10px;">
        <a href="https://engage-youth.org">Visit our website</a> |
        <a href="https://engage-youth.org/privacy-policy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Helper function to create info blocks in emails
 */
export function createInfoBlock(label: string, value: string): string {
  return `<div class="info-block">
    <strong>${label}:</strong>
    <span>${value}</span>
  </div>`;
}

/**
 * Helper function to create paragraphs
 */
export function createParagraph(text: string): string {
  return `<p>${text}</p>`;
}

/**
 * Helper function to create highlighted section
 */
export function createHighlight(text: string): string {
  return `<div class="highlight"><p>${text}</p></div>`;
}

/**
 * Helper function to create button
 */
export function createButton(text: string, url: string): string {
  return `<a href="${url}" class="button">${text}</a>`;
}
