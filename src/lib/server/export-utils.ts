import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { getGitHash } from './git.js';

/**
 * Ensure output directories exist
 */
export async function ensureOutputDirs(): Promise<void> {
	const outputDir = join(process.cwd(), 'output');
	const pdfDir = join(outputDir, 'pdf');
	const docxDir = join(outputDir, 'docx');

	await mkdir(pdfDir, { recursive: true });
	await mkdir(docxDir, { recursive: true });
}

/**
 * Get the output filename based on git hash
 */
export function getOutputFilename(extension: 'pdf' | 'docx'): string {
	const hash = getGitHash();
	return `output_${hash}.${extension}`;
}

/**
 * Get the full output path for a file
 */
export function getOutputPath(extension: 'pdf' | 'docx'): string {
	const filename = getOutputFilename(extension);
	const dir = extension === 'pdf' ? 'pdf' : 'docx';
	return join(process.cwd(), 'output', dir, filename);
}

/**
 * Save a file to the output directory
 */
export async function saveOutputFile(
	extension: 'pdf' | 'docx',
	data: Buffer | Uint8Array
): Promise<string> {
	await ensureOutputDirs();
	const path = getOutputPath(extension);
	await writeFile(path, data);
	return path;
}
