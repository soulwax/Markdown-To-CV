<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<div class="cv-container">
	<div class="cv-document">
		{@html html}
	</div>
</div>

<style>
	.cv-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		min-height: 100%;
	}

	.cv-document {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
		color: #1a1a1a;
		line-height: 1.7;
		max-width: 210mm;
		width: 100%;
		margin: 0 auto;
		padding: 2.5rem 3rem;
		background: white;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		border-radius: 0.5rem;
		position: relative;
	}

	:global(.cv-document h1) {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		color: #1a1a1a;
		font-weight: 700;
		letter-spacing: -0.02em;
		border-bottom: 3px solid #4075a6;
		padding-bottom: 0.75rem;
		margin-bottom: 1.5rem;
	}

	:global(.cv-document h2) {
		font-size: 1.5rem;
		margin-top: 2.5rem;
		margin-bottom: 1.25rem;
		color: #2c3e50;
		font-weight: 600;
		letter-spacing: -0.01em;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
		page-break-after: avoid;
	}

	:global(.cv-document h2:first-of-type) {
		margin-top: 0;
	}

	:global(.cv-document h3) {
		font-size: 1.25rem;
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		color: #1a1a1a;
		font-weight: 600;
		page-break-after: avoid;
	}

	/* First h3 after hr should have less top margin */
	:global(.cv-document hr + * h3),
	:global(.cv-document hr ~ h3:first-of-type) {
		margin-top: 1.5rem;
	}

	/* Style for paragraphs immediately after h3 (job titles and dates) */
	:global(.cv-document h3 + p) {
		margin-top: 0.5rem;
		margin-bottom: 1.25rem;
		line-height: 1.6;
	}

	/* Style for bold job titles in paragraphs */
	:global(.cv-document h3 + p strong) {
		display: block;
		font-size: 1.0625rem;
		margin-bottom: 0.375rem;
		color: #2c3e50;
		font-weight: 600;
		line-height: 1.5;
	}

	:global(.cv-document p) {
		margin: 0.75rem 0;
		color: #4a5568;
		font-size: 0.9375rem;
		line-height: 1.75;
	}

	/* Style for date lines in job entries */
	:global(.cv-document h3 + p:not(:has(strong))) {
		color: #718096;
		font-size: 0.9375rem;
		margin-top: 0.25rem;
	}

	/* Style italic text (like date signature) */
	:global(.cv-document em),
	:global(.cv-document i) {
		font-style: italic;
		color: #4a5568;
		display: block;
		text-align: right;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #e2e8f0;
		font-size: 0.9375rem;
	}

	:global(.cv-document ul) {
		margin: 1.25rem 0;
		padding-left: 1.75rem;
		list-style-type: disc;
	}

	/* Lists after job entries should have proper spacing */
	:global(.cv-document h3 ~ ul) {
		margin-top: 1rem;
		margin-bottom: 1.5rem;
	}

	:global(.cv-document li) {
		margin: 0.625rem 0;
		color: #4a5568;
		font-size: 0.9375rem;
		line-height: 1.8;
	}

	:global(.cv-document li::marker) {
		color: #4075a6;
	}

	/* Style for nested lists (like job details) */
	:global(.cv-document ul ul) {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		padding-left: 1.5rem;
		list-style-type: circle;
	}

	:global(.cv-document ul ul li) {
		margin: 0.375rem 0;
		font-size: 0.9375rem;
	}

	/* Style for personal information lists */
	:global(.cv-document h2:first-of-type + ul li) {
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	:global(.cv-document strong) {
		color: #2c3e50;
		font-weight: 600;
	}

	/* Special styling for job titles and important bold text */
	:global(.cv-document p strong:first-child) {
		color: #1a1a1a;
		font-weight: 600;
	}

	:global(.cv-document a) {
		color: #4075a6;
		text-decoration: none;
		transition: color 0.2s;
	}

	:global(.cv-document a:hover) {
		color: #2c5a85;
		text-decoration: underline;
	}

	:global(.cv-document code) {
		background: #f7fafc;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.875em;
		color: #e53e3e;
	}

	:global(.cv-document pre) {
		background: #f7fafc;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 1rem 0;
		border-left: 3px solid #4075a6;
	}

	:global(.cv-document blockquote) {
		border-left: 4px solid #4075a6;
		padding-left: 1rem;
		margin: 1rem 0;
		color: #4a5568;
		font-style: italic;
	}

	:global(.cv-document hr) {
		border: none;
		border-top: 1px solid #e2e8f0;
		margin: 2.5rem 0;
		background: none;
	}

	:global(.cv-document table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	:global(.cv-document th) {
		background: #f7fafc;
		padding: 0.75rem;
		text-align: left;
		font-weight: 600;
		color: #2c3e50;
		border-bottom: 2px solid #e2e8f0;
	}

	:global(.cv-document td) {
		padding: 0.75rem;
		border-bottom: 1px solid #e2e8f0;
		color: #4a5568;
	}

	@media print {
		.cv-container {
			justify-content: flex-start;
		}

		.cv-document {
			max-width: 100%;
			width: 100%;
			padding: 0;
			box-shadow: none;
			border-radius: 0;
			page-break-inside: avoid;
		}

		:global(.cv-document h1) {
			page-break-after: avoid;
		}

		:global(.cv-document h2) {
			page-break-after: avoid;
		}

		:global(.cv-document h3) {
			page-break-after: avoid;
		}

		:global(.cv-document ul) {
			page-break-inside: avoid;
		}

		:global(.cv-document li) {
			page-break-inside: avoid;
		}
	}

	@media (max-width: 768px) {
		.cv-document {
			padding: 1.5rem 2rem;
		}

		:global(.cv-document h1) {
			font-size: 2rem;
		}

		:global(.cv-document h2) {
			font-size: 1.25rem;
		}

		:global(.cv-document h3) {
			font-size: 1rem;
		}
	}
</style>



