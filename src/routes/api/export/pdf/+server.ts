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

		// Convert markdown to HTML
		const html = marked.parse(markdown);

		// Launch browser
		const browser = await chromium.launch();
		const page = await browser.newPage();

		// Set content with proper styling
		await page.setContent(
			`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<style>
					@page {
						size: A4;
						margin: 20mm;
					}
					body {
						font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
						color: #1a1a1a;
						line-height: 1.5;
						font-size: 11pt;
						max-width: 210mm;
						margin: 0 auto;
						padding: 0;
					}
					h1 {
						font-size: 24pt;
						margin: 0 0 0.5rem 0;
						color: #000000;
						font-weight: 700;
						letter-spacing: -0.02em;
						border-bottom: 2px solid #2563eb;
						padding-bottom: 0.5rem;
						margin-bottom: 1.5rem;
						line-height: 1.3;
					}
					h2 {
						font-size: 13pt;
						margin-top: 1.5rem;
						margin-bottom: 0.75rem;
						color: #000000;
						font-weight: 600;
						letter-spacing: 0.02em;
						border-bottom: 1px solid #e5e7eb;
						padding-bottom: 0.25rem;
						line-height: 1.4;
					}
					h2:first-of-type {
						margin-top: 0;
					}
					h3 {
						font-size: 11.5pt;
						margin-top: 1.25rem;
						margin-bottom: 0.375rem;
						color: #000000;
						font-weight: 600;
						line-height: 1.4;
					}
					p {
						margin: 0.5rem 0;
						color: #1a1a1a;
						font-size: 11pt;
						line-height: 1.5;
					}
					ul {
						margin: 0.75rem 0;
						padding-left: 1.25rem;
						list-style-type: disc;
					}
					li {
						margin: 0.375rem 0;
						color: #1a1a1a;
						font-size: 11pt;
						line-height: 1.5;
						padding-left: 0.25rem;
					}
					li::marker {
						color: #2563eb;
					}
					strong {
						color: #000000;
						font-weight: 600;
					}
					a {
						color: #2563eb;
						text-decoration: none;
					}
					hr {
						border: none;
						border-top: 1px solid #e5e7eb;
						margin: 1.5rem 0;
					}
					em, i {
						font-style: italic;
						color: #4a5568;
					}
					table {
						width: 100%;
						border-collapse: collapse;
						margin: 0.75rem 0;
					}
					th {
						background: #f9fafb;
						padding: 0.5rem;
						text-align: left;
						font-weight: 600;
						border-bottom: 1px solid #e5e7eb;
					}
					td {
						padding: 0.5rem;
						border-bottom: 1px solid #e5e7eb;
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
				top: '20mm',
				right: '20mm',
				bottom: '20mm',
				left: '20mm'
			},
			printBackground: false
		});

		await browser.close();

		// Save to output directory
		const savedPath = await saveOutputFile('pdf', pdfBuffer);

		return json({
			success: true,
			filename: savedPath.split('/').pop() || 'output.pdf',
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
