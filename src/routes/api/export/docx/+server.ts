import { htmlToDocx } from '$lib/server/docx-generator.js';
import { saveOutputFile } from '$lib/server/export-utils.js';
import { json } from '@sveltejs/kit';
import { Packer } from 'docx';
import { marked } from 'marked';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { markdown } = await request.json();

		if (!markdown || typeof markdown !== 'string') {
			return json({ error: 'Markdown content is required' }, { status: 400 });
		}

		// Convert markdown to HTML
		const html = marked.parse(markdown);

		// Convert HTML to DOCX
		const doc = await htmlToDocx(String(html));

		// Generate DOCX buffer
		const docxBuffer = await Packer.toBuffer(doc);

		// Save to output directory
		const savedPath = await saveOutputFile('docx', docxBuffer);

		return json({
			success: true,
			filename: savedPath.split('/').pop() || 'output.docx',
			path: savedPath
		});
	} catch (error) {
		console.error('Error generating DOCX:', error);
		return json(
			{
				error: 'Failed to generate DOCX',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
