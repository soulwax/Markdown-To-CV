<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Markdown to CV Converter</title>
	<meta name="description" content="Convert markdown to a professional CV/Resume PDF" />
</svelte:head>

<section>
	<h1>Markdown to CV Converter</h1>

	<h2>
		Transform your Markdown into a professional CV/Resume and export it as PDF
	</h2>

	<div class="cta-container">
		<a href={resolve('/cv')} class="cta-button">Get Started</a>
	</div>

	<div class="features">
		<div class="feature">
			<h3>📝 Markdown Input</h3>
			<p>Write your CV using simple Markdown syntax</p>
		</div>
		<div class="feature">
			<h3>👁️ Live Preview</h3>
			<p>See your CV rendered in real-time as you type</p>
		</div>
		<div class="feature">
			<h3>📄 PDF Export</h3>
			<p>Export your CV as a professional PDF document</p>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		text-align: center;
		padding: 2rem;
	}

	h1 {
		width: 100%;
		margin-bottom: 1rem;
	}

	h2 {
		max-width: 600px;
		margin: 0 auto 2rem;
		color: var(--color-text);
	}

	.cta-container {
		margin: 2rem 0;
	}

	.cta-button {
		display: inline-block;
		padding: 1rem 2rem;
		background-color: var(--color-theme-1);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-size: 1.2rem;
		font-weight: 600;
		transition: all 0.2s;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.cta-button:hover {
		background-color: #e03500;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
		text-decoration: none;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		margin-top: 3rem;
		max-width: 800px;
		width: 100%;
	}

	.feature {
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.feature h3 {
		margin-top: 0;
		font-size: 1.3rem;
		color: var(--color-theme-2);
	}

	.feature p {
		margin-bottom: 0;
		color: var(--color-text);
	}
</style>
