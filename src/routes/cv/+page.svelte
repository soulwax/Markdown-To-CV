<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import CVPreview from './CVPreview.svelte';

	// Configure marked for synchronous parsing
	marked.setOptions({
		breaks: true,
		gfm: true
	});

	let markdownInput = $state(`# John Doe

## Contact
- Email: john.doe@example.com
- Phone: +1 (555) 123-4567
- LinkedIn: linkedin.com/in/johndoe
- GitHub: github.com/johndoe

## Professional Summary
Experienced software developer with 5+ years of expertise in web development, specializing in modern JavaScript frameworks and cloud technologies.

## Experience

### Senior Software Engineer | Tech Corp | 2021 - Present
- Led development of microservices architecture serving 1M+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and conducted code reviews

### Software Engineer | Startup Inc | 2019 - 2021
- Developed responsive web applications using React and Node.js
- Collaborated with cross-functional teams in agile environment
- Optimized database queries improving performance by 40%

## Education

### Bachelor of Science in Computer Science
University of Technology | 2015 - 2019
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Software Engineering

## Skills
- **Languages**: JavaScript, TypeScript, Python, Java
- **Frameworks**: React, Vue.js, Node.js, Express
- **Tools**: Git, Docker, AWS, Kubernetes
- **Databases**: PostgreSQL, MongoDB, Redis`);

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
		window.print();
	}

	function clearInput() {
		markdownInput = '';
	}

	function loadExample() {
		markdownInput = `# John Doe

## Contact
- Email: john.doe@example.com
- Phone: +1 (555) 123-4567
- LinkedIn: linkedin.com/in/johndoe
- GitHub: github.com/johndoe

## Professional Summary
Experienced software developer with 5+ years of expertise in web development, specializing in modern JavaScript frameworks and cloud technologies.

## Experience

### Senior Software Engineer | Tech Corp | 2021 - Present
- Led development of microservices architecture serving 1M+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored junior developers and conducted code reviews

### Software Engineer | Startup Inc | 2019 - 2021
- Developed responsive web applications using React and Node.js
- Collaborated with cross-functional teams in agile environment
- Optimized database queries improving performance by 40%

## Education

### Bachelor of Science in Computer Science
University of Technology | 2015 - 2019
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Software Engineering

## Skills
- **Languages**: JavaScript, TypeScript, Python, Java
- **Frameworks**: React, Vue.js, Node.js, Express
- **Tools**: Git, Docker, AWS, Kubernetes
- **Databases**: PostgreSQL, MongoDB, Redis`;
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

	let textareaElement: HTMLTextAreaElement;
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
					placeholder="# Your Name

## Contact
- Email: your.email@example.com
- Phone: +1 (555) 123-4567

## Professional Summary
Write a brief summary of your professional background...

## Experience

### Job Title | Company | Date Range
- Key achievement or responsibility
- Another important point

## Education

### Degree
Institution | Date Range

## Skills
- **Category**: Skill 1, Skill 2, Skill 3"
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
		max-width: 1600px;
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
		.toolbar,
		.editor-panel,
		.header {
			display: none;
		}

		.preview-panel {
			box-shadow: none;
			border: none;
		}

		.panel-header {
			display: none;
		}

		.preview-wrapper {
			border: none;
			padding: 0;
			background: white;
		}

		.container {
			padding: 0;
			max-width: 100%;
		}

		.editor-container {
			min-height: auto;
		}
	}
</style>

