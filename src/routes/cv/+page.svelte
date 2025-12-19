<script lang="ts">
	import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import CVPreview from './CVPreview.svelte';

	// Configure marked for synchronous parsing
	marked.setOptions({
		breaks: true,
		gfm: true
	});

	let markdownInput = $state(`# Resume

## Personal Information

- Full Name: John Doe
- Address: Oakwood Avenue 42
- City: 90210 Los Angeles
- Phone: +1 555 123 4567
- Email: john.developer@email.com
- Date of Birth: 03.15.1995

---

## About Me

The most important qualities that define me are my ability to learn, adaptability, and reliability in teamwork as well as an independently thinking individual.
I absolutely love implementing systems and see them as puzzles. My passion lies in full-stack web development and encompasses mobile development; I also love embedded systems.

My approach to new challenges is systematic and analytical. I am passionately committed to expanding my knowledge and staying up-to-date with the latest technology.

This enables me to find innovative solutions and quickly familiarize myself with new technologies and work environments, which makes integrating into teams easy for me. In a team context, I greatly value open communication and constructive feedback.

---

## Experience

### TechVision Solutions Inc.
**Senior Full Stack Developer & Team Lead (*, **)**
09.2019 – 12.31.2025

- * Part-time from 09.2019 to 03.2020
- ** Full-time from 04.2020
- (Overlapping with freelancing at Metro Energy Services)

- Led a five-person cross-functional development team for designing, developing, and maintaining complex web applications
- Active client contact: Consulting on project management, testing, integration, scaling, and deployment
- Comprehensive expertise in frontend technologies: Vue.js, React, Angular, Node, Spring Boot, and C#
- Experience with Shopify and Laravel (PHP)
- Backend development with Node.js, Python, and Java Spring Boot
- Database design and optimization with PostgreSQL, MSSQL, MongoDB, and Redis, as well as choosing the right ORMs and suitable logging and caching technologies (AWS, Cloudflare)
- DevOps and cloud infrastructure: CI/CD, Docker, Kubernetes, Azure, AWS
- Agile methodologies: Scrum and active role as Product Owner
- Performance optimization, e.g., reducing load times of frontends and APIs through advanced techniques
- Frontend test automation
- Architecture and system design: Implementation of scalable microservices architecture
- Implementation of Domain-Driven Design (DDD) and hexagonal architecture
- Security: Implementation of OAuth 2.0 and JWT, regular security audits
- Mentoring and team leadership: Code reviews, internal training, onboarding new employees, pair programming
- User relations and user stories: Presentations, gathering and prioritizing requirements, focus on UX/UI and accessibility
- Innovative projects: WebRTC integration for telemedicine, AI integration at multiple levels

---

### Cloud Consultant – Metro Energy Services
**Freelance Consulting**
09.2018 – 03.2020

- (Part-time from 09.2019 to 03.2020 at TechVision Solutions Inc.)

- Development of cloud architecture and strategy
- Evaluation of requirements and use cases for cloud solutions
- Selection of suitable cloud services and deployment models (private, public, hybrid)
- Design of robust cloud architectures with focus on security, scalability, and fault tolerance
- Migration and implementation of cloud-native applications and microservices
- Implementation of Infrastructure as Code
- Security and compliance: Implementation of cloud security policies and best practices
- Ensuring compliance with data protection and regulatory requirements
- Conducting security audits and risk assessments
- Optimization and management of cloud environments
- Technologies used: Cassandra, Serverless Functions, cloud migrations with focus on performance and security

---

## Education

### University of Applied Sciences Boston
10.2015 – 08.2018

- Degree: Bachelor of Science – Computer Science (Minor in Embedded Systems)
- Overall Grade: 1.9 (German grading system, equivalent to B+/A-)
- Thesis Grade: 1.2 (equivalent to A)
- Thesis Topic: "Automated Invoice Generation in a Full-Stack Application"

### Lincoln Academy Seattle
08.2012 – 07.2015

- General Higher Education Entrance Qualification (Abitur)
- Focus: Natural Sciences
- Overall Grade: 1.5 (equivalent to A-/B+)

---

## Degrees & Qualifications

- B.Sc. Computer Science with Minor in Embedded Systems
  - Overall Grade: 1.9
  - Thesis: 1.2
- General Higher Education Entrance Qualification
  - Overall Grade: 1.5

---

## Driver's License

- Class B

---

## Hobbies

- Reading
- Chess
- Writing
- Martial Arts
- Jogging
- Hiking
- Programming

---

_Seattle, December 17, 2025_`);

	let htmlOutput = $derived.by(() => {
		try {
			// marked.parse() is synchronous by default in v17
			return String(marked.parse(markdownInput));
		} catch {
			return '';
		}
	});
	let showPreview = $state(true);
	let viewMode = $state<'split' | 'editor' | 'preview'>('split');

	function exportToPDF() {
		// Add print-specific class to body for better print styling
		document.body.classList.add('printing');
		
		// Handle print completion using afterprint event
		const handleAfterPrint = () => {
			document.body.classList.remove('printing');
			window.removeEventListener('afterprint', handleAfterPrint);
		};
		
		window.addEventListener('afterprint', handleAfterPrint);
		
		// Trigger print dialog
		window.print();
		
		// Fallback: Remove class after a delay if afterprint event doesn't fire
		// (Some browsers may not support afterprint event reliably)
		setTimeout(() => {
			if (document.body.classList.contains('printing')) {
				document.body.classList.remove('printing');
				window.removeEventListener('afterprint', handleAfterPrint);
			}
		}, 5000);
	}

	async function exportToDOCX() {
		try {
			// Parse markdown into lines
			const lines = markdownInput.split('\n');
			const docElements: (Paragraph | Paragraph[])[] = [];

			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();

				// Skip empty lines
				if (!line) {
					docElements.push(new Paragraph({ text: '' }));
					continue;
				}

				// Handle headers
				if (line.startsWith('# ')) {
					// H1
					const text = line.substring(2).trim();
					docElements.push(
						new Paragraph({
							text: text,
							heading: HeadingLevel.HEADING_1,
							spacing: { after: 200 }
						})
					);
				} else if (line.startsWith('## ')) {
					// H2
					const text = line.substring(3).trim();
					docElements.push(
						new Paragraph({
							text: text.toUpperCase(),
							heading: HeadingLevel.HEADING_2,
							spacing: { before: 400, after: 200 }
						})
					);
				} else if (line.startsWith('### ')) {
					// H3
					const text = line.substring(4).trim();
					docElements.push(
						new Paragraph({
							text: text,
							heading: HeadingLevel.HEADING_3,
							spacing: { before: 300, after: 150 }
						})
					);
				} else if (line.startsWith('- ') || /^\s+- /.test(line)) {
					// List item - handle indentation for nested lists
					const indentMatch = line.match(/^(\s*)- /);
					const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
					const text = line.replace(/^\s*- /, '').trim();
					// Handle bold text in list items
					const parts = parseInlineFormatting(text);
					docElements.push(
						new Paragraph({
							children: parts,
							bullet: { level: indentLevel },
							spacing: { after: 100 }
						})
					);
				} else if (line.startsWith('---')) {
					// Horizontal rule - skip or add spacing
					docElements.push(new Paragraph({ text: '' }));
				} else if (line.startsWith('_') && line.endsWith('_')) {
					// Italic text (signature/date)
					const text = line.substring(1, line.length - 1).trim();
					docElements.push(
						new Paragraph({
							children: [
								new TextRun({
									text: text,
									italics: true
								})
							],
							alignment: AlignmentType.RIGHT,
							spacing: { before: 400 }
						})
					);
				} else {
					// Regular paragraph
					const parts = parseInlineFormatting(line);
					docElements.push(
						new Paragraph({
							children: parts,
							spacing: { after: 150 }
						})
					);
				}
			}

			// Create the document
			const doc = new Document({
				sections: [
					{
						properties: {},
						children: docElements.flat()
					}
				]
			});

			// Generate and download the DOCX file
			const blob = await Packer.toBlob(doc);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'cv.docx';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error exporting to DOCX:', error);
			alert('Error exporting to DOCX. Please try again.');
		}
	}

	function parseInlineFormatting(text: string): TextRun[] {
		const parts: TextRun[] = [];
		let remaining = text;
		let currentIndex = 0;

		// Process bold text first (**text**)
		while (currentIndex < remaining.length) {
			const boldStart = remaining.indexOf('**', currentIndex);
			
			if (boldStart === -1) {
				// No more bold markers, process the rest
				const rest = remaining.substring(currentIndex);
				if (rest) {
					// Check for italic in remaining text
					const italicParts = parseItalic(rest);
					parts.push(...italicParts);
				}
				break;
			}

			// Add text before bold marker
			if (boldStart > currentIndex) {
				const beforeBold = remaining.substring(currentIndex, boldStart);
				const italicParts = parseItalic(beforeBold);
				parts.push(...italicParts);
			}

			// Find closing bold marker
			const boldEnd = remaining.indexOf('**', boldStart + 2);
			if (boldEnd === -1) {
				// No closing marker, treat as regular text
				const rest = remaining.substring(boldStart);
				const italicParts = parseItalic(rest);
				parts.push(...italicParts);
				break;
			}

			// Add bold text
			const boldText = remaining.substring(boldStart + 2, boldEnd);
			parts.push(new TextRun({ text: boldText, bold: true }));
			currentIndex = boldEnd + 2;
		}

		// If no formatting found, return plain text
		if (parts.length === 0) {
			parts.push(new TextRun({ text }));
		}

		return parts;
	}

	function parseItalic(text: string): TextRun[] {
		const parts: TextRun[] = [];
		let currentIndex = 0;

		while (currentIndex < text.length) {
			const italicStart = text.indexOf('*', currentIndex);
			
			if (italicStart === -1) {
				// No more italic markers
				const rest = text.substring(currentIndex);
				if (rest) {
					parts.push(new TextRun({ text: rest }));
				}
				break;
			}

			// Add text before italic marker
			if (italicStart > currentIndex) {
				parts.push(new TextRun({ text: text.substring(currentIndex, italicStart) }));
			}

			// Find closing italic marker
			const italicEnd = text.indexOf('*', italicStart + 1);
			if (italicEnd === -1) {
				// No closing marker, treat as regular text
				parts.push(new TextRun({ text: text.substring(italicStart) }));
				break;
			}

			// Add italic text
			const italicText = text.substring(italicStart + 1, italicEnd);
			parts.push(new TextRun({ text: italicText, italics: true }));
			currentIndex = italicEnd + 1;
		}

		return parts.length > 0 ? parts : [new TextRun({ text })];
	}

	function clearInput() {
		markdownInput = '';
	}

	function loadExample() {
		markdownInput = `# Resume

## Personal Information

- Full Name: John Doe
- Address: Oakwood Avenue 42
- City: 90210 Los Angeles
- Phone: +1 555 123 4567
- Email: john.developer@email.com
- Date of Birth: 03.15.1995

---

## About Me

The most important qualities that define me are my ability to learn, adaptability, and reliability in teamwork as well as an independently thinking individual.
I absolutely love implementing systems and see them as puzzles. My passion lies in full-stack web development and encompasses mobile development; I also love embedded systems.

My approach to new challenges is systematic and analytical. I am passionately committed to expanding my knowledge and staying up-to-date with the latest technology.

This enables me to find innovative solutions and quickly familiarize myself with new technologies and work environments, which makes integrating into teams easy for me. In a team context, I greatly value open communication and constructive feedback.

---

## Experience

### TechVision Solutions Inc.
**Senior Full Stack Developer & Team Lead (*, **)**
09.2019 – 12.31.2025

- * Part-time from 09.2019 to 03.2020
- ** Full-time from 04.2020
- (Overlapping with freelancing at Metro Energy Services)

- Led a five-person cross-functional development team for designing, developing, and maintaining complex web applications
- Active client contact: Consulting on project management, testing, integration, scaling, and deployment
- Comprehensive expertise in frontend technologies: Vue.js, React, Angular, Node, Spring Boot, and C#
- Experience with Shopify and Laravel (PHP)
- Backend development with Node.js, Python, and Java Spring Boot
- Database design and optimization with PostgreSQL, MSSQL, MongoDB, and Redis, as well as choosing the right ORMs and suitable logging and caching technologies (AWS, Cloudflare)
- DevOps and cloud infrastructure: CI/CD, Docker, Kubernetes, Azure, AWS
- Agile methodologies: Scrum and active role as Product Owner
- Performance optimization, e.g., reducing load times of frontends and APIs through advanced techniques
- Frontend test automation
- Architecture and system design: Implementation of scalable microservices architecture
- Implementation of Domain-Driven Design (DDD) and hexagonal architecture
- Security: Implementation of OAuth 2.0 and JWT, regular security audits
- Mentoring and team leadership: Code reviews, internal training, onboarding new employees, pair programming
- User relations and user stories: Presentations, gathering and prioritizing requirements, focus on UX/UI and accessibility
- Innovative projects: WebRTC integration for telemedicine, AI integration at multiple levels

---

### Cloud Consultant – Metro Energy Services
**Freelance Consulting**
09.2018 – 03.2020

- (Part-time from 09.2019 to 03.2020 at TechVision Solutions Inc.)

- Development of cloud architecture and strategy
- Evaluation of requirements and use cases for cloud solutions
- Selection of suitable cloud services and deployment models (private, public, hybrid)
- Design of robust cloud architectures with focus on security, scalability, and fault tolerance
- Migration and implementation of cloud-native applications and microservices
- Implementation of Infrastructure as Code
- Security and compliance: Implementation of cloud security policies and best practices
- Ensuring compliance with data protection and regulatory requirements
- Conducting security audits and risk assessments
- Optimization and management of cloud environments
- Technologies used: Cassandra, Serverless Functions, cloud migrations with focus on performance and security

---

## Education

### University of Applied Sciences Boston
10.2015 – 08.2018

- Degree: Bachelor of Science – Computer Science (Minor in Embedded Systems)
- Overall Grade: 1.9 (German grading system, equivalent to B+/A-)
- Thesis Grade: 1.2 (equivalent to A)
- Thesis Topic: "Automated Invoice Generation in a Full-Stack Application"

### Lincoln Academy Seattle
08.2012 – 07.2015

- General Higher Education Entrance Qualification (Abitur)
- Focus: Natural Sciences
- Overall Grade: 1.5 (equivalent to A-/B+)

---

## Degrees & Qualifications

- B.Sc. Computer Science with Minor in Embedded Systems
  - Overall Grade: 1.9
  - Thesis: 1.2
- General Higher Education Entrance Qualification
  - Overall Grade: 1.5

---

## Driver's License

- Class B

---

## Hobbies

- Reading
- Chess
- Writing
- Martial Arts
- Jogging
- Hiking
- Programming

---

_Seattle, December 17, 2025_`;
	}

	function downloadMarkdown() {
		const blob = new Blob([markdownInput], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'cv.md';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	let textareaElement = $state<HTMLTextAreaElement | undefined>(undefined);
	onMount(() => {
		if (textareaElement) {
			textareaElement.focus();
		}
	});
</script>

<svelte:head>
	<title>Markdown to CV Converter</title>
	<meta name="description" content="Convert markdown to a professional CV/Resume" />
</svelte:head>

<div class="container">
	<div class="header">
		<div class="header-content">
			<h1>Markdown to CV</h1>
			<p class="subtitle">Transform your markdown into a professional document</p>
		</div>
	</div>

	<div class="toolbar">
		<div class="toolbar-group">
			<button onclick={loadExample} class="btn btn-icon" title="Load Example">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
					<line x1="16" y1="13" x2="8" y2="13"></line>
					<line x1="16" y1="17" x2="8" y2="17"></line>
					<polyline points="10 9 9 9 8 9"></polyline>
				</svg>
				<span>Example</span>
			</button>
			<button onclick={clearInput} class="btn btn-icon" title="Clear">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
				</svg>
				<span>Clear</span>
			</button>
		</div>

		<div class="toolbar-group view-toggle">
			<button
				onclick={() => (viewMode = 'editor')}
				class="btn btn-icon"
				class:active={viewMode === 'editor'}
				title="Editor Only"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
				</svg>
			</button>
			<button
				onclick={() => (viewMode = 'split')}
				class="btn btn-icon"
				class:active={viewMode === 'split'}
				title="Split View"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
					<line x1="12" y1="3" x2="12" y2="21"></line>
				</svg>
			</button>
			<button
				onclick={() => (viewMode = 'preview')}
				class="btn btn-icon"
				class:active={viewMode === 'preview'}
				title="Preview Only"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
					<circle cx="12" cy="12" r="3"></circle>
				</svg>
			</button>
		</div>

		<div class="toolbar-group">
			<button onclick={downloadMarkdown} class="btn btn-icon" title="Download Markdown">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				<span>Download</span>
			</button>
			<button onclick={exportToDOCX} class="btn btn-docx" title="Export to DOCX">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
					<line x1="16" y1="13" x2="8" y2="13"></line>
					<line x1="16" y1="17" x2="8" y2="17"></line>
					<polyline points="10 9 9 9 8 9"></polyline>
				</svg>
				<span>Export DOCX</span>
			</button>
			<button onclick={exportToPDF} class="btn btn-primary" title="Export to PDF">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
					<line x1="16" y1="13" x2="8" y2="13"></line>
					<line x1="16" y1="17" x2="8" y2="17"></line>
					<polyline points="10 9 9 9 8 9"></polyline>
				</svg>
				<span>Export PDF</span>
			</button>
		</div>
	</div>

	<div class="editor-container" class:split-view={viewMode === 'split'} class:editor-only={viewMode === 'editor'} class:preview-only={viewMode === 'preview'}>
		{#if viewMode !== 'preview'}
			<div class="editor-panel">
				<div class="panel-header">
					<h2>Markdown Editor</h2>
					<span class="char-count">{markdownInput.length} characters</span>
				</div>
				<textarea
					bind:this={textareaElement}
					bind:value={markdownInput}
					placeholder="# Resume

## Personal Information

- Full Name: Your Name
- Address: Your Street Address
- City: Your City
- Phone: +1 555 123 4567
- Email: your.email@example.com

---

## About Me

Write a brief summary about yourself...

---

## Experience

### Company Name
**Job Title**
Date Range

- Key achievement or responsibility
- Another important point

---

## Education

### Institution Name
Date Range

- Degree details
- Grade information

---

_Location, Date_"
					class="markdown-input"
				></textarea>
			</div>
		{/if}

		{#if viewMode !== 'editor'}
			<div class="preview-panel">
				<div class="panel-header">
					<h2>Document Preview</h2>
					<span class="preview-badge">PDF Ready</span>
				</div>
				<div class="preview-wrapper">
					<CVPreview html={htmlOutput} />
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		width: 100%;
		margin: 0 auto;
		padding: 2rem;
		min-height: calc(100vh - 200px);
	}

	.header {
		margin-bottom: 2.5rem;
	}

	.header-content {
		text-align: center;
	}

	.header h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		color: #1a1a1a;
		font-weight: 700;
		letter-spacing: -0.02em;
		background: linear-gradient(135deg, #1a1a1a 0%, #4075a6 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		color: #666;
		font-size: 1.125rem;
		font-weight: 400;
		margin-top: 0.5rem;
	}

	.toolbar {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		padding: 1rem 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}

	.toolbar-group {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.view-toggle {
		border-left: 1px solid rgba(0, 0, 0, 0.1);
		border-right: 1px solid rgba(0, 0, 0, 0.1);
		padding: 0 1rem;
		margin: 0 0.5rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		background: transparent;
		color: #4a5568;
		white-space: nowrap;
	}

	.btn:hover {
		background: rgba(0, 0, 0, 0.05);
		color: #1a1a1a;
		transform: translateY(-1px);
	}

	.btn:active {
		transform: translateY(0);
	}

	.btn-icon {
		padding: 0.625rem;
	}

	.btn-icon svg {
		width: 16px;
		height: 16px;
	}

	.btn-icon.active {
		background: rgba(64, 117, 166, 0.1);
		color: #4075a6;
	}

	.btn-docx {
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		color: white;
		padding: 0.625rem 1.5rem;
		box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
	}

	.btn-docx:hover {
		background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
		box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
		color: white;
		transform: translateY(-2px);
	}

	.btn-primary {
		background: linear-gradient(135deg, #ff3e00 0%, #e03500 100%);
		color: white;
		padding: 0.625rem 1.5rem;
		box-shadow: 0 2px 4px rgba(255, 62, 0, 0.3);
	}

	.btn-primary:hover {
		background: linear-gradient(135deg, #e03500 0%, #cc2f00 100%);
		box-shadow: 0 4px 8px rgba(255, 62, 0, 0.4);
		color: white;
		transform: translateY(-2px);
	}

	.editor-container {
		display: grid;
		gap: 1.5rem;
		min-height: calc(100vh - 400px);
		transition: grid-template-columns 0.3s ease;
	}

	.editor-container.split-view {
		grid-template-columns: 1fr 1fr;
	}

	.editor-container.editor-only {
		grid-template-columns: 1fr;
	}

	.editor-container.preview-only {
		grid-template-columns: 1fr;
	}

	.editor-panel,
	.preview-panel {
		display: flex;
		flex-direction: column;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.05);
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(250, 250, 250, 0.95));
	}

	.panel-header h2 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a1a;
		letter-spacing: -0.01em;
	}

	.char-count {
		font-size: 0.75rem;
		color: #718096;
		font-weight: 500;
	}

	.preview-badge {
		font-size: 0.75rem;
		color: #4075a6;
		font-weight: 600;
		background: rgba(64, 117, 166, 0.1);
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
	}

	.markdown-input {
		flex: 1;
		width: 100%;
		padding: 1.5rem;
		border: none;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.75;
		resize: none;
		box-sizing: border-box;
		background: #fafafa;
		color: #1a1a1a;
		tab-size: 2;
	}

	.markdown-input:focus {
		outline: none;
		background: white;
	}

	.markdown-input::placeholder {
		color: #a0aec0;
	}

	.preview-wrapper {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		background: #f8f9fa;
		min-height: 100%;
	}

	.preview-wrapper::-webkit-scrollbar {
		width: 8px;
	}

	.preview-wrapper::-webkit-scrollbar-track {
		background: transparent;
	}

	.preview-wrapper::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}

	.preview-wrapper::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 1200px) {
		.editor-container.split-view {
			grid-template-columns: 1fr;
		}

		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.toolbar-group {
			justify-content: center;
		}

		.view-toggle {
			border-left: none;
			border-right: none;
			border-top: 1px solid rgba(0, 0, 0, 0.1);
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			padding: 1rem 0;
			margin: 0.5rem 0;
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.header h1 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.toolbar {
			padding: 0.75rem;
		}

		.btn span {
			display: none;
		}

		.btn-icon {
			padding: 0.75rem;
		}

		.panel-header {
			padding: 1rem;
		}

		.preview-wrapper {
			padding: 1.5rem;
		}
	}

	@media print {
		/* Hide all UI elements during print */
		.toolbar,
		.editor-panel,
		.header {
			display: none !important;
		}

		/* Show only the preview panel content */
		.preview-panel {
			box-shadow: none;
			border: none;
			background: white;
			display: block !important;
		}

		.panel-header {
			display: none !important;
		}

		.preview-wrapper {
			border: none;
			padding: 0;
			background: white;
			overflow: visible;
		}

		.container {
			padding: 0;
			max-width: 100%;
			margin: 0;
		}

		.editor-container {
			min-height: auto;
			display: block;
		}

		/* Ensure full page usage - hide everything except CV content */
		:global(body) {
			background: white !important;
			margin: 0 !important;
			padding: 0 !important;
			background-image: none !important;
			background-color: white !important;
		}

		/* Hide root layout elements */
		:global(.app > header),
		:global(.app > footer) {
			display: none !important;
		}

		/* Optimize for PDF output */
		* {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>

