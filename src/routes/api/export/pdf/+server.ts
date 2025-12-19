import { db } from '$lib/server/db/index.js';
import { inputDocument, outputDocument } from '$lib/server/db/schema.js';
import { saveOutputFile } from '$lib/server/export-utils.js';
import { json } from '@sveltejs/kit';
import { marked } from 'marked';
import { chromium } from 'playwright';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { markdown } = await request.json();

		if (!markdown || typeof markdown !== 'string') {
			return json({ error: 'Markdown content is required' }, { status: 400 });
		}

		// Save input document to database
		const [savedInput] = await db
			.insert(inputDocument)
			.values({ markdown })
			.returning();

		// Convert markdown to HTML
		const html = marked.parse(markdown);

		// Launch browser
		const browser = await chromium.launch();
		const page = await browser.newPage();

		// Set content with hyper-modern styling
		await page.setContent(
			`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<style>
					@page {
						size: A4;
						margin: 18mm 20mm;
					}
					* {
						box-sizing: border-box;
					}
					body {
						font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
						color: #1f2937;
						line-height: 1.6;
						font-size: 10.5pt;
						max-width: 100%;
						margin: 0;
						padding: 0;
						background: #ffffff;
						-webkit-font-smoothing: antialiased;
						-moz-osx-font-smoothing: grayscale;
					}
					h1 {
						font-size: 28pt;
						margin: 0 0 0.75rem 0;
						color: #111827;
						font-weight: 800;
						letter-spacing: -0.03em;
						border-bottom: 3px solid #2563eb;
						padding-bottom: 0.75rem;
						margin-bottom: 2rem;
						line-height: 1.2;
						position: relative;
					}
					h1::after {
						content: '';
						position: absolute;
						bottom: -3px;
						left: 0;
						width: 60px;
						height: 3px;
						background: #2563eb;
					}
					h2 {
						font-size: 12.5pt;
						margin-top: 2rem;
						margin-bottom: 1rem;
						color: #111827;
						font-weight: 700;
						letter-spacing: 0.05em;
						text-transform: uppercase;
						border-bottom: 2px solid #e5e7eb;
						padding-bottom: 0.5rem;
						line-height: 1.3;
						position: relative;
						padding-left: 0.75rem;
						border-left: 4px solid #2563eb;
					}
					h2:first-of-type {
						margin-top: 0;
					}
					h3 {
						font-size: 11.5pt;
						margin-top: 1.5rem;
						margin-bottom: 0.5rem;
						color: #111827;
						font-weight: 700;
						line-height: 1.4;
						letter-spacing: -0.01em;
					}
					h3:first-child {
						margin-top: 0.75rem;
					}
					p {
						margin: 0.625rem 0;
						color: #374151;
						font-size: 10.5pt;
						line-height: 1.65;
						text-align: justify;
					}
					/* Job title styling */
					h3 + p strong {
						display: block;
						font-size: 11pt;
						margin-bottom: 0.25rem;
						color: #111827;
						font-weight: 700;
						line-height: 1.4;
					}
					/* Date styling */
					h3 + p:not(:has(strong)) {
						color: #6b7280;
						font-size: 9.5pt;
						margin-top: 0;
						margin-bottom: 0.75rem;
						font-weight: 500;
						letter-spacing: 0.02em;
					}
					ul {
						margin: 0.875rem 0;
						padding-left: 0;
						list-style: none;
					}
					li {
						margin: 0.5rem 0;
						color: #374151;
						font-size: 10.5pt;
						line-height: 1.7;
						padding-left: 1.5rem;
						position: relative;
					}
					li::before {
						content: '▸';
						position: absolute;
						left: 0;
						color: #2563eb;
						font-weight: 700;
						font-size: 11pt;
					}
					ul ul li::before {
						content: '▪';
						font-size: 9pt;
					}
					strong {
						color: #111827;
						font-weight: 700;
					}
					a {
						color: #2563eb;
						text-decoration: none;
						border-bottom: 1px solid transparent;
						transition: border-color 0.2s;
					}
					a:hover {
						border-bottom-color: #2563eb;
					}
					hr {
						border: none;
						border-top: 1px solid #e5e7eb;
						margin: 2rem 0;
						background: none;
					}
					em, i {
						font-style: italic;
						color: #4b5563;
					}
					/* Personal info list styling */
					h2:first-of-type + ul li {
						margin: 0.375rem 0;
						line-height: 1.6;
						padding-left: 0;
					}
					h2:first-of-type + ul li::before {
						display: none;
					}
					table {
						width: 100%;
						border-collapse: collapse;
						margin: 1rem 0;
						font-size: 10.5pt;
					}
					th {
						background: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%);
						padding: 0.75rem;
						text-align: left;
						font-weight: 700;
						color: #111827;
						border-bottom: 2px solid #2563eb;
						font-size: 10.5pt;
						letter-spacing: 0.02em;
					}
					td {
						padding: 0.625rem 0.75rem;
						border-bottom: 1px solid #e5e7eb;
						color: #374151;
						font-size: 10.5pt;
					}
					tr:last-child td {
						border-bottom: none;
					}
					/* Signature/date styling */
					em:last-child, i:last-child {
						display: block;
						text-align: right;
						margin-top: 2.5rem;
						padding-top: 1.25rem;
						border-top: 1px solid #e5e7eb;
						font-size: 9.5pt;
						color: #6b7280;
						font-style: italic;
					}
					/* Code blocks */
					code {
						background: #f3f4f6;
						padding: 0.125rem 0.375rem;
						border-radius: 0.25rem;
						font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", "Courier New", monospace;
						font-size: 9.5pt;
						color: #dc2626;
					}
					pre {
						background: #f9fafb;
						padding: 1rem;
						border-radius: 0.5rem;
						border-left: 4px solid #2563eb;
						margin: 1rem 0;
						overflow-x: auto;
					}
					pre code {
						background: transparent;
						padding: 0;
					}
					blockquote {
						border-left: 4px solid #2563eb;
						padding-left: 1rem;
						margin: 1rem 0;
						color: #4b5563;
						font-style: italic;
						background: #f9fafb;
						padding: 0.75rem 0.75rem 0.75rem 1rem;
						border-radius: 0 0.25rem 0.25rem 0;
					}
					/* Print optimizations */
					@media print {
						body {
							-webkit-print-color-adjust: exact;
							print-color-adjust: exact;
						}
						h1, h2, h3 {
							page-break-after: avoid;
						}
						ul, ol {
							page-break-inside: avoid;
						}
						li {
							page-break-inside: avoid;
						}
					}
				</style>
			</head>
			<body>
				${html}
			</body>
			</html>
		`,
			{ waitUntil: 'networkidle' }
		);

		// Generate PDF
		const pdfBuffer = await page.pdf({
			format: 'A4',
			margin: {
				top: '18mm',
				right: '20mm',
				bottom: '18mm',
				left: '20mm'
			},
			printBackground: true,
			preferCSSPageSize: true
		});

		await browser.close();

		// Save to output directory
		const savedPath = await saveOutputFile('pdf', pdfBuffer);
		const fileName = savedPath.split('/').pop() || 'output.pdf';
		const fileSize = pdfBuffer.length;

		// Save output document to database
		await db.insert(outputDocument).values({
			inputDocumentId: savedInput.id,
			type: 'pdf',
			filePath: savedPath,
			fileName,
			fileSize
		});

		return json({
			success: true,
			filename: fileName,
			path: savedPath
		});
	} catch (error) {
		console.error('Error generating PDF:', error);
		return json(
			{
				error: 'Failed to generate PDF',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
