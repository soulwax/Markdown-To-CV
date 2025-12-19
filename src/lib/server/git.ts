import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Get the current git commit hash
 * Returns a short hash (7 characters) or 'unknown' if git is not available
 */
export function getGitHash(): string {
	try {
		// Check if we're in a git repository
		const gitDir = join(process.cwd(), '.git');
		if (!existsSync(gitDir)) {
			return 'unknown';
		}

		// Get the current commit hash
		const hash = execSync('git rev-parse --short HEAD', {
			encoding: 'utf-8',
			cwd: process.cwd()
		}).trim();

		return hash || 'unknown';
	} catch (error) {
		console.warn('Failed to get git hash:', error);
		return 'unknown';
	}
}
