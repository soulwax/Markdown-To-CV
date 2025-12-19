import {
    AlignmentType,
    Document,
    HeadingLevel,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType
} from 'docx';
import { JSDOM } from 'jsdom';

/**
 * Convert HTML to DOCX document elements
 */
export async function htmlToDocx(html: string): Promise<Document> {
	const dom = new JSDOM(html);
	const document = dom.window.document;
	const docElements: (Paragraph | Table)[] = [];

	processNodeList(Array.from(document.body.childNodes), docElements);

	return new Document({
		sections: [
			{
				properties: {
					page: {
						size: {
							orientation: 'portrait',
							width: 11906, // A4 width in twips (210mm)
							height: 16838 // A4 height in twips (297mm)
						},
						margin: {
							top: 1021, // ~18mm
							right: 1134, // ~20mm
							bottom: 1021, // ~18mm
							left: 1134 // ~20mm
						}
					}
				},
				children: docElements
			}
		],
		styles: {
			default: {
				document: {
					run: {
						font: 'Inter',
						size: 21, // 10.5pt
						color: '1f2937'
					},
					paragraph: {
						spacing: {
							line: 360, // 1.6 line spacing
							lineRule: 'auto'
						}
					}
				}
			}
		}
	});
}

function processNodeList(
	nodes: Node[],
	docElements: (Paragraph | Table)[]
) {
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];

		if (node.nodeType === 3) {
			// TEXT_NODE
			const text = node.textContent?.trim();
			if (text) {
				docElements.push(
					new Paragraph({
						children: parseHTMLText(text),
						spacing: { after: 150 }
					})
				);
			}
		} else if (node.nodeType === 1) {
			// ELEMENT_NODE
			const element = node as Element;
			const tagName = element.tagName?.toLowerCase();

			switch (tagName) {
				case 'h1':
					const h1Runs = parseHTMLInline(element).map((run) => {
						if (run instanceof TextRun) {
							return new TextRun({
								text: (run as any).text || '',
								bold: true,
								size: 56, // 28pt
								color: '111827',
								font: 'Inter'
							});
						}
						return run;
					});
					docElements.push(
						new Paragraph({
							children: h1Runs,
							heading: HeadingLevel.HEADING_1,
							spacing: { after: 360, before: 0 },
							border: {
								bottom: {
									color: '2563eb',
									size: 24, // 3px
									style: 'single'
								}
							}
						})
					);
					break;
				case 'h2':
					const h2Runs = parseHTMLInline(element).map((run) => {
						if (run instanceof TextRun) {
							return new TextRun({
								text: ((run as any).text || '').toUpperCase(),
								bold: true,
								size: 30, // 15pt
								color: '111827',
								font: 'Inter'
							});
						}
						return run;
					});
					docElements.push(
						new Paragraph({
							children: h2Runs,
							heading: HeadingLevel.HEADING_2,
							spacing: { before: 480, after: 240 },
							border: {
								left: {
									color: '2563eb',
									size: 320, // 4px
									style: 'single'
								},
								bottom: {
									color: 'e5e7eb',
									size: 8,
									style: 'single'
								}
							},
							indent: { left: 360 }
						})
					);
					break;
				case 'h3':
					const h3Runs = parseHTMLInline(element).map((run) => {
						if (run instanceof TextRun) {
							return new TextRun({
								text: (run as any).text || '',
								bold: true,
								size: 28, // 14pt
								color: '111827',
								font: 'Inter'
							});
						}
						return run;
					});
					docElements.push(
						new Paragraph({
							children: h3Runs,
							heading: HeadingLevel.HEADING_3,
							spacing: { before: 360, after: 180 }
						})
					);
					break;
				case 'h4':
					docElements.push(
						new Paragraph({
							children: parseHTMLInline(element),
							heading: HeadingLevel.HEADING_4,
							spacing: { before: 200, after: 100 }
						})
					);
					break;
				case 'h5':
					docElements.push(
						new Paragraph({
							children: parseHTMLInline(element),
							heading: HeadingLevel.HEADING_5,
							spacing: { before: 150, after: 100 }
						})
					);
					break;
				case 'h6':
					docElements.push(
						new Paragraph({
							children: parseHTMLInline(element),
							heading: HeadingLevel.HEADING_6,
							spacing: { before: 100, after: 100 }
						})
					);
					break;
				case 'p':
					const alignment = getAlignment(element);
					const pRuns = parseHTMLInline(element).map((run) => {
						if (run instanceof TextRun) {
							return new TextRun({
								text: (run as any).text || '',
								bold: (run as any).bold,
								italics: (run as any).italics,
								color: (run as any).bold ? '111827' : '374151',
								size: (run as any).bold ? 24 : 21, // 12pt for bold, 10.5pt for regular
								font: 'Inter'
							});
						}
						return run;
					});
					docElements.push(
						new Paragraph({
							children: pRuns,
							spacing: { after: 240, line: 360, lineRule: 'auto' },
							alignment
						})
					);
					break;
				case 'ul':
				case 'ol':
					processList(element, docElements, tagName === 'ol');
					break;
				case 'blockquote':
					const blockquoteRuns = parseHTMLInline(element).map((run) => {
						if (run instanceof TextRun) {
							return new TextRun({
								text: (run as any).text || '',
								italics: true,
								color: '4b5563',
								size: 21,
								font: 'Inter'
							});
						}
						return run;
					});
					docElements.push(
						new Paragraph({
							children: blockquoteRuns,
							indent: { left: 720 },
							shading: {
								type: ShadingType.SOLID,
								color: 'f9fafb'
							},
							border: {
								left: {
									color: '2563eb',
									size: 320, // 4px
									style: 'single'
								}
							},
							spacing: { before: 240, after: 240, line: 360 }
						})
					);
					break;
				case 'pre':
				case 'code':
					if (tagName === 'pre') {
						const codeText = element.textContent || '';
						docElements.push(
							new Paragraph({
								children: [
									new TextRun({
										text: codeText,
										font: 'Courier New',
										color: 'dc2626'
									})
								],
								shading: {
									type: ShadingType.SOLID,
									color: 'f3f4f6'
								},
								spacing: { before: 200, after: 200 }
							})
						);
					} else {
						const codeText = element.textContent || '';
						docElements.push(
							new Paragraph({
								children: [
									new TextRun({
										text: codeText,
										font: 'Courier New',
										color: 'dc2626'
									})
								],
								spacing: { after: 150 }
							})
						);
					}
					break;
				case 'table':
					const table = parseTable(element);
					if (table) {
						docElements.push(table);
					}
					break;
				case 'hr':
					docElements.push(new Paragraph({ text: '' }));
					break;
				case 'br':
					docElements.push(new Paragraph({ text: '' }));
					break;
				case 'div':
				case 'section':
					processNodeList(Array.from(element.childNodes), docElements);
					break;
				case 'strong':
				case 'b':
				case 'em':
				case 'i':
				case 'u':
				case 's':
				case 'del':
				case 'strike':
				case 'a':
				case 'span':
					docElements.push(
						new Paragraph({
							children: parseHTMLInline(element),
							spacing: { after: 150 }
						})
					);
					break;
				case 'img':
					const alt = element.getAttribute('alt') || element.getAttribute('src') || '';
					if (alt) {
						docElements.push(
							new Paragraph({
								children: [
									new TextRun({
										text: `[Image: ${alt}]`,
										italics: true
									})
								],
								spacing: { after: 150 }
							})
						);
					}
					break;
				default:
					processNodeList(Array.from(element.childNodes), docElements);
			}
		}
	}
}

function processList(
	element: Element,
	docElements: (Paragraph | Table)[],
	ordered: boolean
) {
	const items = element.querySelectorAll('li');
	const isPersonalInfo = element.parentElement?.querySelector('h2:first-of-type') === element.previousElementSibling;
	
	items.forEach((item) => {
		let level = 0;
		let parent = item.parentElement;
		while (parent && parent !== element) {
			if (parent.tagName.toLowerCase() === 'ul' || parent.tagName.toLowerCase() === 'ol') {
				level++;
			}
			parent = parent.parentElement;
		}

		const listRuns = parseHTMLInline(item).map((run) => {
			if (run instanceof TextRun) {
				return new TextRun({
					text: (run as any).text || '',
					bold: (run as any).bold,
					italics: (run as any).italics,
					color: '374151',
					size: 21, // 10.5pt
					font: 'Inter'
				});
			}
			return run;
		});

		docElements.push(
			new Paragraph({
				children: listRuns,
				bullet: ordered ? undefined : { level },
				numbering: ordered
					? {
							reference: 'default-numbering',
							level: level
					  }
					: undefined,
				spacing: { after: 200, line: 360, lineRule: 'auto' },
				indent: isPersonalInfo ? { left: 0 } : { left: 720, hanging: 360 }
			})
		);
	});
}

function applyFormatting(
	runs: TextRun[],
	formatting: { bold?: boolean; italics?: boolean; underline?: {}; strike?: boolean }
): TextRun[] {
	return runs.map((run) => {
		const runOptions: any = { ...(run as any) };

		if (formatting.bold !== undefined) {
			runOptions.bold = formatting.bold;
		}
		if (formatting.italics !== undefined) {
			runOptions.italics = formatting.italics;
		}
		if (formatting.underline !== undefined) {
			runOptions.underline = formatting.underline;
		}
		if (formatting.strike !== undefined) {
			runOptions.strike = formatting.strike;
		}

		return new TextRun(runOptions);
	});
}

function parseHTMLInline(element: Element): TextRun[] {
	const runs: TextRun[] = [];
	const nodes = element.childNodes;

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];

		if (node.nodeType === 3) {
			// TEXT_NODE
			const text = node.textContent || '';
			if (text.trim()) {
				runs.push(new TextRun({ text }));
			}
		} else if (node.nodeType === 1) {
			// ELEMENT_NODE
			const el = node as Element;
			const tagName = el.tagName?.toLowerCase();
			const text = el.textContent || '';

			switch (tagName) {
				case 'strong':
				case 'b':
					const boldRuns = parseHTMLInline(el);
					runs.push(
						...boldRuns.map((run) => {
							if (run instanceof TextRun) {
								return new TextRun({
									text: (run as any).text || '',
									bold: true,
									color: '111827',
									size: 24, // 12pt for bold text
									font: 'Inter'
								});
							}
							return run;
						})
					);
					break;
				case 'em':
				case 'i':
					const italicRuns = parseHTMLInline(el);
					runs.push(...applyFormatting(italicRuns, { italics: true }));
					break;
				case 'u':
					const underlineRuns = parseHTMLInline(el);
					runs.push(...applyFormatting(underlineRuns, { underline: {} }));
					break;
				case 's':
				case 'del':
				case 'strike':
					const strikeRuns = parseHTMLInline(el);
					runs.push(...applyFormatting(strikeRuns, { strike: true }));
					break;
				case 'code':
					const codeRuns = parseHTMLInline(el);
					runs.push(
						...codeRuns.map((run) => {
							const runOptions: any = { ...(run as any) };
							runOptions.font = 'Courier New';
							runOptions.color = 'dc2626';
							return new TextRun(runOptions);
						})
					);
					break;
				case 'a':
					const href = el.getAttribute('href') || '';
					const linkRuns = parseHTMLInline(el);
					const hasContent = linkRuns.some((run) => {
						const runText = (run as any).text || '';
						return runText.trim().length > 0;
					});

					if (!hasContent && href) {
						runs.push(
							new TextRun({
								text: href,
								color: '2563eb',
								underline: {},
								font: 'Inter',
								size: 21
							})
						);
					} else {
						runs.push(
							...linkRuns.map((run) => {
								if (run instanceof TextRun) {
									return new TextRun({
										text: (run as any).text || '',
										bold: (run as any).bold,
										italics: (run as any).italics,
										color: '2563eb',
										underline: {},
										font: 'Inter',
										size: 21
									});
								}
								return run;
							})
						);
					}
					break;
				case 'br':
					runs.push(new TextRun({ text: '\n', break: 1 }));
					break;
				case 'span':
				case 'div':
					runs.push(...parseHTMLInline(el));
					break;
				default:
					if (el.childNodes.length > 0) {
						runs.push(...parseHTMLInline(el));
					} else if (text) {
						runs.push(new TextRun({ text }));
					}
			}
		}
	}

	return runs.length > 0 ? runs : [new TextRun({ text: element.textContent || '' })];
}

function parseHTMLText(text: string): TextRun[] {
	const runs = parseInlineFormatting(text);
	return runs.map((run) => {
		if (run instanceof TextRun) {
			return new TextRun({
				text: (run as any).text || '',
				bold: (run as any).bold,
				italics: (run as any).italics,
				color: '374151',
				size: 21,
				font: 'Inter'
			});
		}
		return run;
	});
}

function parseTable(element: Element): Table | null {
	try {
		const rows = element.querySelectorAll('tr');
		if (rows.length === 0) return null;

		const tableRows: TableRow[] = [];
		let isHeader = true;

		rows.forEach((row) => {
			const cells = row.querySelectorAll('td, th');
			if (cells.length === 0) return;

			const tableCells = Array.from(cells).map((cell) => {
				const cellElement = cell as Element;
				const isHeaderCell = cellElement.tagName.toLowerCase() === 'th';
				const cellRuns = parseHTMLInline(cellElement).map((run) => {
					if (run instanceof TextRun) {
						return new TextRun({
							text: (run as any).text || '',
							bold: isHeaderCell ? true : (run as any).bold,
							color: isHeaderCell ? '111827' : '374151',
							size: isHeaderCell ? 24 : 21,
							font: 'Inter'
						});
					}
					return run;
				});

				return new TableCell({
					children: [
						new Paragraph({
							children: cellRuns.length > 0 ? cellRuns : [new TextRun({ text: '' })],
							spacing: { after: 120, line: 360 }
						})
					],
					shading: isHeaderCell
						? {
								type: ShadingType.SOLID,
								color: 'f9fafb'
						  }
						: undefined,
					margins: {
						top: 360,
						bottom: 360,
						left: 360,
						right: 360
					}
				});
			});

			tableRows.push(new TableRow({ children: tableCells }));

			if (isHeader) {
				isHeader = false;
			}
		});

		return new Table({
			rows: tableRows,
			width: {
				size: 100,
				type: WidthType.PERCENTAGE
			}
		});
	} catch (error) {
		console.error('Error parsing table:', error);
		return null;
	}
}

function getAlignment(element: Element) {
	const style = element.getAttribute('style') || '';
	const align = element.getAttribute('align') || '';

	if (style.includes('text-align: right') || align === 'right') {
		return AlignmentType.RIGHT;
	}
	if (style.includes('text-align: center') || align === 'center') {
		return AlignmentType.CENTER;
	}
	if (style.includes('text-align: justify') || align === 'justify') {
		return AlignmentType.JUSTIFIED;
	}
	return AlignmentType.LEFT;
}

function parseInlineFormatting(text: string): TextRun[] {
	const parts: TextRun[] = [];
	let remaining = text;
	let currentIndex = 0;

	while (currentIndex < remaining.length) {
		const boldStart = remaining.indexOf('**', currentIndex);

		if (boldStart === -1) {
			const rest = remaining.substring(currentIndex);
			if (rest) {
				const italicParts = parseItalic(rest);
				parts.push(...italicParts);
			}
			break;
		}

			if (boldStart > currentIndex) {
				const beforeBold = remaining.substring(currentIndex, boldStart);
				const italicParts = parseItalic(beforeBold);
				parts.push(...italicParts.map(run => {
					if (run instanceof TextRun) {
						return new TextRun({
							text: (run as any).text || '',
							italics: (run as any).italics,
							color: '374151',
							size: 21,
							font: 'Inter'
						});
					}
					return run;
				}));
			}

		const boldEnd = remaining.indexOf('**', boldStart + 2);
		if (boldEnd === -1) {
			const rest = remaining.substring(boldStart);
			const italicParts = parseItalic(rest);
			parts.push(...italicParts);
			break;
		}

		const boldText = remaining.substring(boldStart + 2, boldEnd);
		parts.push(new TextRun({ 
			text: boldText, 
			bold: true,
			color: '111827',
			size: 24,
			font: 'Inter'
		}));
		currentIndex = boldEnd + 2;
	}

	if (parts.length === 0) {
		parts.push(new TextRun({ 
			text,
			color: '374151',
			size: 21,
			font: 'Inter'
		}));
	}

	return parts;
}

function parseItalic(text: string): TextRun[] {
	const parts: TextRun[] = [];
	let currentIndex = 0;

	while (currentIndex < text.length) {
		const italicStart = text.indexOf('*', currentIndex);

		if (italicStart === -1) {
			const rest = text.substring(currentIndex);
			if (rest) {
				parts.push(new TextRun({ 
					text: rest,
					color: '374151',
					size: 21,
					font: 'Inter'
				}));
			}
			break;
		}

			if (italicStart > currentIndex) {
				parts.push(new TextRun({ 
					text: text.substring(currentIndex, italicStart),
					color: '374151',
					size: 21,
					font: 'Inter'
				}));
			}

		const italicEnd = text.indexOf('*', italicStart + 1);
		if (italicEnd === -1) {
			parts.push(new TextRun({ 
				text: text.substring(italicStart),
				color: '374151',
				size: 21,
				font: 'Inter'
			}));
			break;
		}

		const italicText = text.substring(italicStart + 1, italicEnd);
		parts.push(new TextRun({ 
			text: italicText, 
			italics: true,
			color: '4b5563',
			size: 21,
			font: 'Inter'
		}));
		currentIndex = italicEnd + 1;
	}

	return parts.length > 0 ? parts : [new TextRun({ 
		text,
		color: '374151',
		size: 21,
		font: 'Inter'
	})];
}
