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
		/* Professional font stack - ATS-friendly */
		font-family: 'Calibri', 'Arial', 'Helvetica Neue', 'Helvetica', 'Segoe UI', sans-serif;
		color: #1a1a1a;
		line-height: 1.6;
		max-width: 210mm; /* A4 width */
		width: 100%;
		margin: 0 auto;
		padding: 25mm 25mm; /* Standard 1 inch margins */
		background: white;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		border-radius: 0.5rem;
		position: relative;
		font-size: 11pt; /* Professional body text size */
	}

	/* Name/Title - Most prominent element */
	:global(.cv-document h1) {
		font-size: 22pt; /* 18-22pt as per best practices */
		margin: 0 0 0.25rem 0;
		color: #1a2938; /* Professional dark blue-gray */
		font-weight: 700;
		letter-spacing: -0.01em;
		border-bottom: 3px solid #2563eb; /* Professional blue accent */
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	/* Section Headings - Clear hierarchy */
	:global(.cv-document h2) {
		font-size: 14pt; /* 14-16pt for section headings */
		margin-top: 1.75rem;
		margin-bottom: 0.875rem;
		color: #1e3a5f; /* Professional navy */
		font-weight: 600;
		letter-spacing: 0.05em; /* Increased spacing for uppercase text */
		border-bottom: 1.5px solid #e5e7eb;
		padding-bottom: 0.375rem;
		page-break-after: avoid;
		page-break-inside: avoid;
		text-transform: uppercase;
		/* Keep header with at least some following content */
		orphans: 3;
		widows: 3;
	}

	:global(.cv-document h2:first-of-type) {
		margin-top: 0;
	}

	/* Subsection Headings (Company names, etc.) */
	:global(.cv-document h3) {
		font-size: 12pt;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		color: #1a1a1a;
		font-weight: 600;
		page-break-after: avoid;
		line-height: 1.4;
	}

	/* First h3 after hr should have less top margin */
	:global(.cv-document hr + * h3),
	:global(.cv-document hr ~ h3:first-of-type) {
		margin-top: 1.25rem;
	}

	/* Job titles and dates */
	:global(.cv-document h3 + p) {
		margin-top: 0.25rem;
		margin-bottom: 0.875rem;
		line-height: 1.5;
	}

	/* Bold job titles in paragraphs */
	:global(.cv-document h3 + p strong) {
		display: block;
		font-size: 11pt;
		margin-bottom: 0.25rem;
		color: #1a1a1a;
		font-weight: 600;
		line-height: 1.4;
	}

	/* Body paragraphs */
	:global(.cv-document p) {
		margin: 0.625rem 0;
		color: #374151;
		font-size: 11pt;
		line-height: 1.6;
	}

	/* Date lines in job entries */
	:global(.cv-document h3 + p:not(:has(strong))) {
		color: #6b7280;
		font-size: 10pt;
		margin-top: 0.125rem;
		margin-bottom: 0.75rem;
	}

	/* Signature/date italic text */
	:global(.cv-document em),
	:global(.cv-document i) {
		font-style: italic;
		color: #4b5563;
		display: block;
		text-align: right;
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
		font-size: 10pt;
	}

	/* Lists - Professional bullet points */
	:global(.cv-document ul) {
		margin: 0.875rem 0;
		padding-left: 1.5rem;
		list-style-type: disc;
	}

	/* Lists after job entries */
	:global(.cv-document h3 ~ ul) {
		margin-top: 0.75rem;
		margin-bottom: 1.25rem;
	}

	:global(.cv-document li) {
		margin: 0.5rem 0;
		color: #374151;
		font-size: 11pt;
		line-height: 1.7;
		padding-left: 0.25rem;
	}

	:global(.cv-document li::marker) {
		color: #2563eb; /* Professional blue for bullets */
		font-weight: 600;
	}

	/* Nested lists */
	:global(.cv-document ul ul) {
		margin-top: 0.375rem;
		margin-bottom: 0.375rem;
		padding-left: 1.25rem;
		list-style-type: circle;
	}

	:global(.cv-document ul ul li) {
		margin: 0.375rem 0;
		font-size: 10.5pt;
	}

	/* Personal information lists */
	:global(.cv-document h2:first-of-type + ul li) {
		margin: 0.375rem 0;
		line-height: 1.5;
	}

	/* Bold text */
	:global(.cv-document strong) {
		color: #1a1a1a;
		font-weight: 600;
	}

	/* Special styling for job titles */
	:global(.cv-document p strong:first-child) {
		color: #1a1a1a;
		font-weight: 600;
	}

	/* Links */
	:global(.cv-document a) {
		color: #2563eb;
		text-decoration: none;
		transition: color 0.2s;
	}

	:global(.cv-document a:hover) {
		color: #1d4ed8;
		text-decoration: underline;
	}

	/* Code */
	:global(.cv-document code) {
		background: #f3f4f6;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: 'Courier New', 'Courier', monospace;
		font-size: 10pt;
		color: #dc2626;
	}

	:global(.cv-document pre) {
		background: #f3f4f6;
		padding: 0.875rem;
		border-radius: 0.375rem;
		overflow-x: auto;
		margin: 1rem 0;
		border-left: 3px solid #2563eb;
		font-size: 10pt;
	}

	/* Blockquotes */
	:global(.cv-document blockquote) {
		border-left: 3px solid #2563eb;
		padding-left: 1rem;
		margin: 1rem 0;
		color: #4b5563;
		font-style: italic;
		font-size: 10.5pt;
	}

	/* Horizontal rules - subtle separators */
	:global(.cv-document hr) {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 2rem 0;
		background: none;
	}

	/* Tables */
	:global(.cv-document table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		font-size: 11pt;
	}

	:global(.cv-document th) {
		background: #f9fafb;
		padding: 0.625rem;
		text-align: left;
		font-weight: 600;
		color: #1e3a5f;
		border-bottom: 2px solid #e5e7eb;
		font-size: 11pt;
	}

	:global(.cv-document td) {
		padding: 0.625rem;
		border-bottom: 1px solid #e5e7eb;
		color: #374151;
		font-size: 11pt;
	}

	/* Print styles - Optimized for PDF */
	@media print {
		@page {
			size: A4;
			margin: 0;
			/* Set minimum lines for orphans and widows at page level */
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
			padding: 25mm 25mm; /* Maintain 1 inch margins for print */
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
			/* Never split a header across pages */
			page-break-inside: avoid;
			/* Try to keep header with following content */
			page-break-after: avoid;
			/* Allow break before header if needed (prevents orphaned headers at bottom) */
			page-break-before: auto;
			margin-top: 1.5rem; /* Ensure proper spacing in print */
			/* Ensure at least 3 lines stay together */
			orphans: 3;
			widows: 3;
		}

		/* Prevent content from breaking away from its header */
		/* Keep first element after h2 with the header - prevents orphaned headers */
		:global(.cv-document h2 + p),
		:global(.cv-document h2 + ul),
		:global(.cv-document h2 + ol),
		:global(.cv-document h2 + h3) {
			page-break-before: avoid;
			orphans: 3;
		}

		:global(.cv-document h3) {
			page-break-after: avoid;
			page-break-inside: avoid;
			margin-top: 1.25rem; /* Ensure proper spacing in print */
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

		/* Prevent orphaned lines at page breaks for better readability */
		:global(.cv-document p) {
			orphans: 2;
			widows: 2;
		}

		/* Ensure horizontal rules don't create awkward breaks */
		:global(.cv-document hr) {
			page-break-after: avoid;
			page-break-before: auto;
		}

		/* Optimize colors for print */
		:global(.cv-document) {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.cv-document {
			padding: 1.5rem 2rem;
		}

		:global(.cv-document h1) {
			font-size: 20pt;
		}

		:global(.cv-document h2) {
			font-size: 13pt;
		}

		:global(.cv-document h3) {
			font-size: 11.5pt;
		}
	}
</style>


