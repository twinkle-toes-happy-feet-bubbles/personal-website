// Markdown parsing functionality using Marked.js and Prism.js
const MarkdownParser = (() => {

    // Configure Marked.js with Prism.js integration
    const configureMarked = () => {
        if (typeof marked === 'undefined') {
            console.warn('Marked.js not loaded');
            return false;
        }

        // Configure marked options
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            xhtml: false
        });

        // Custom renderer for syntax highlighting
        const renderer = new marked.Renderer();

        // Override code block rendering to use Prism.js
        renderer.code = (code, language) => {
            if (language && typeof Prism !== 'undefined' && Prism.languages[language]) {
                try {
                    const highlighted = Prism.highlight(code, Prism.languages[language], language);
                    return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`;
                } catch (e) {
                    console.warn('Prism highlighting failed:', e);
                }
            }

            // Fallback to regular code block
            return `<pre><code class="${language ? `language-${language}` : ''}">${marked.parseInline(code)}</code></pre>`;
        };

        // Override inline code rendering
        renderer.codespan = (code) => {
            return `<code class="inline-code">${code}</code>`;
        };

        // Override link rendering to add target="_blank" for external links
        renderer.link = (href, title, text) => {
            const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
            const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
        };

        // Override blockquote rendering
        renderer.blockquote = (quote) => {
            return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
        };

        // Override table rendering
        renderer.table = (header, body) => {
            return `<div class="table-wrapper"><table class="markdown-table"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
        };

        marked.use({ renderer });

        return true;
    };

    // Parse markdown content to HTML
    const parseMarkdown = (content) => {
        if (!content) return '';

        // Configure marked if not already done
        if (!configureMarked()) {
            // Fallback to basic parsing if Marked.js is not available
            return parseMarkdownFallback(content);
        }

        try {
            return marked.parse(content);
        } catch (error) {
            console.error('Markdown parsing failed:', error);
            return parseMarkdownFallback(content);
        }
    };

    // Fallback markdown parser (basic implementation)
    const parseMarkdownFallback = (content) => {
        return content
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')

            // Bold and italic
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')

            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

            // Line breaks and paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')

            // Wrap in paragraphs
            .replace(/^(?!<[h|p|u|o|l|b|d])(.+)/gm, '<p>$1</p>')

            // Lists
            .replace(/^\- (.+)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

            // Clean up
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-6]>)/g, '$1')
            .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    };

    // Initialize syntax highlighting after content is rendered
    const highlightCode = () => {
        if (typeof Prism !== 'undefined' && Prism.highlightAll) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    };

    return {
        parseMarkdown,
        highlightCode,
        configureMarked
    };
})();