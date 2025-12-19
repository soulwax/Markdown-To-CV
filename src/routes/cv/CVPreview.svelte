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
		/* Modern sans-serif font stack - ATS-friendly and DOCX-compatible */
		font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		color: #1a1a1a;
		line-height: 1.5;
		max-width: 210mm; /* A4 width */
		width: 100%;
		margin: 0 auto;
		padding: 20mm 20mm; /* Standard margins */
		background: white;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		border-radius: 0.5rem;
		position: relative;
		font-size: 11pt;
	}

	/* Name/Title - Most prominent element */
	:global(.cv-document h1) {
		font-size: 24pt;
		margin: 0 0 0.5rem 0;
		color: #000000;
		font-weight: 700;
		letter-spacing: -0.02em;
		border-bottom: 2px solid #2563eb;
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
		line-height: 1.3;
		page-break-after: avoid;
		page-break-inside: avoid;
	}

	/* Section Headings - Clear hierarchy */
	:global(.cv-document h2) {
		font-size: 13pt;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		color: #000000;
		font-weight: 600;
		letter-spacing: 0.02em;
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 0.25rem;
		page-break-after: avoid;
		page-break-inside: avoid;
		line-height: 1.4;
		orphans: 3;
		widows: 3;
	}

	:global(.cv-document h2:first-of-type) {
		margin-top: 0;
	}

	/* Subsection Headings (Company names, etc.) */
	:global(.cv-document h3) {
		font-size: 11.5pt;
		margin-top: 1.25rem;
		margin-bottom: 0.375rem;
		color: #000000;
		font-weight: 600;
		page-break-after: avoid;
		line-height: 1.4;
	}

	/* First h3 after hr should have less top margin */
	:global(.cv-document hr + * h3),
	:global(.cv-document hr ~ h3:first-of-type) {
		margin-top: 1rem;
	}

	/* Job titles and dates */
	:global(.cv-document h3 + p) {
		margin-top: 0.125rem;
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	/* Bold job titles in paragraphs */
	:global(.cv-document h3 + p strong) {
		display: block;
		font-size: 11pt;
		margin-bottom: 0.125rem;
		color: #000000;
		font-weight: 600;
		line-height: 1.4;
	}

	/* Body paragraphs */
	:global(.cv-document p) {
		margin: 0.5rem 0;
		color: #1a1a1a;
		font-size: 11pt;
		line-height: 1.5;
		orphans: 2;
		widows: 2;
	}

	/* Date lines in job entries */
	:global(.cv-document h3 + p:not(:has(strong))) {
		color: #4a5568;
		font-size: 10pt;
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	/* Signature/date italic text */
	:global(.cv-document em),
	:global(.cv-document i) {
		font-style: italic;
		color: #4a5568;
		display: block;
		text-align: right;
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
		font-size: 10pt;
	}

	/* Lists - Professional bullet points */
	:global(.cv-document ul) {
		margin: 0.75rem 0;
		padding-left: 1.25rem;
		list-style-type: disc;
		orphans: 2;
		widows: 2;
	}

	/* Lists after job entries */
	:global(.cv-document h3 ~ ul) {
		margin-top: 0.5rem;
		margin-bottom: 1rem;
	}

	:global(.cv-document li) {
		margin: 0.375rem 0;
		color: #1a1a1a;
		font-size: 11pt;
		line-height: 1.5;
		padding-left: 0.25rem;
	}

	:global(.cv-document li::marker) {
		color: #2563eb;
	}

	/* Nested lists */
	:global(.cv-document ul ul) {
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
		padding-left: 1rem;
		list-style-type: circle;
	}

	:global(.cv-document ul ul li) {
		margin: 0.25rem 0;
		font-size: 10.5pt;
	}

	/* Personal information lists */
	:global(.cv-document h2:first-of-type + ul li) {
		margin: 0.25rem 0;
		line-height: 1.5;
	}

	/* Bold text */
	:global(.cv-document strong) {
		color: #000000;
		font-weight: 600;
	}

	/* Special styling for job titles */
	:global(.cv-document p strong:first-child) {
		color: #000000;
		font-weight: 600;
	}

	/* Links */
	:global(.cv-document a) {
		color: #2563eb;
		text-decoration: none;
	}

	:global(.cv-document a:hover) {
		text-decoration: underline;
	}

	/* Code */
	:global(.cv-document code) {
		background: #f5f5f5;
		padding: 0.125rem 0.375rem;
		border-radius: 0.125rem;
		font-family: "Courier New", Courier, monospace;
		font-size: 10pt;
		color: #1a1a1a;
	}

	:global(.cv-document pre) {
		background: #f5f5f5;
		padding: 0.75rem;
		border-radius: 0.25rem;
		overflow-x: auto;
		margin: 0.75rem 0;
		border-left: 2px solid #2563eb;
		font-size: 10pt;
	}

	/* Blockquotes */
	:global(.cv-document blockquote) {
		border-left: 2px solid #2563eb;
		padding-left: 0.75rem;
		margin: 0.75rem 0;
		color: #4a5568;
		font-style: italic;
		font-size: 10.5pt;
	}

	/* Horizontal rules - subtle separators */
	:global(.cv-document hr) {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 1.5rem 0;
		background: none;
	}

	/* Tables */
	:global(.cv-document table) {
		width: 100%;
		border-collapse: collapse;
		margin: 0.75rem 0;
		font-size: 11pt;
	}

	:global(.cv-document th) {
		background: #f9fafb;
		padding: 0.5rem;
		text-align: left;
		font-weight: 600;
		color: #000000;
		border-bottom: 1px solid #e5e7eb;
		font-size: 11pt;
	}

	:global(.cv-document td) {
		padding: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
		color: #1a1a1a;
		font-size: 11pt;
	}

	/* Print styles - Optimized for PDF */
	@media print {
		@page {
			size: A4;
			margin: 20mm;
			orphans: 3;
			widows: 3;
		}

		.cv-container {
			justify-content: flex-start;
			background: white;
		}

		.cv-document {
			max-width: 100%;
			width: 100%;
			padding: 0;
			box-shadow: none;
			border-radius: 0;
			background: white;
		}

		/* Prevent page breaks in critical sections */
		:global(.cv-document h1) {
			page-break-after: avoid;
			page-break-inside: avoid;
		}

		/* Intelligent page breaks for section headers (h2) */
		:global(.cv-document h2) {
			page-break-inside: avoid;
			page-break-after: avoid;
			page-break-before: auto;
			margin-top: 1.25rem;
			orphans: 3;
			widows: 3;
		}

		/* Prevent content from breaking away from its header */
		:global(.cv-document h2 + p),
		:global(.cv-document h2 + ul),
		:global(.cv-document h2 + ol),
		:global(.cv-document h2 + h3) {
			page-break-before: avoid;
			orphans: 3;
			widows: 3;
		}

		:global(.cv-document h3) {
			page-break-after: avoid;
			page-break-inside: avoid;
			margin-top: 1rem;
		}

		/* Keep list items together when possible */
		:global(.cv-document ul) {
			page-break-inside: avoid;
		}

		:global(.cv-document li) {
			page-break-inside: avoid;
		}

		/* Keep job entries together */
		:global(.cv-document h3 + p),
		:global(.cv-document h3 + p + ul) {
			page-break-inside: avoid;
			orphans: 2;
			widows: 2;
		}

		/* Prevent orphaned lines at page breaks */
		:global(.cv-document p) {
			orphans: 2;
			widows: 2;
		}

		/* Ensure horizontal rules don't create awkward breaks */
		:global(.cv-document hr) {
			page-break-after: avoid;
			page-break-before: auto;
		}

		/* Optimize colors for print - avoid large backgrounds */
		:global(.cv-document th) {
			background: transparent;
			border-bottom: 1px solid #000000;
		}

		:global(.cv-document code),
		:global(.cv-document pre) {
			background: transparent;
			border: 1px solid #e5e7eb;
		}
	}

	/* Desktop: Optional subtle 2-column visual treatment for personal info */
	@media screen and (min-width: 1024px) {
		:global(.cv-document h2:first-of-type + ul) {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 0 1.5rem;
		}
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.cv-document {
			padding: 1.5rem;
		}

		:global(.cv-document h1) {
			font-size: 20pt;
		}

		:global(.cv-document h2) {
			font-size: 12pt;
		}

		:global(.cv-document h3) {
			font-size: 11pt;
		}
	}
</style>


