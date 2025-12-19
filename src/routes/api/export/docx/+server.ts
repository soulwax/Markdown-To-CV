import { db } from '$lib/server/db/index.js';
import { inputDocument, outputDocument } from '$lib/server/db/schema.js';
import { htmlToDocx } from '$lib/server/docx-generator.js';
import { saveOutputFile } from '$lib/server/export-utils.js';
import { json } from '@sveltejs/kit';
import { Packer } from 'docx';
import { marked } from 'marked';
import { basename } from 'path';
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

		// Convert HTML to DOCX
		const doc = await htmlToDocx(String(html));

		// Generate DOCX buffer
		const docxBuffer = await Packer.toBuffer(doc);

		// Save to output directory
		const savedPath = await saveOutputFile('docx', docxBuffer);
		const fileName = basename(savedPath) || 'output.docx';
		const fileSize = docxBuffer.length;

		// Save output document to database
		await db.insert(outputDocument).values({
			inputDocumentId: savedInput.id,
			type: 'docx',
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
