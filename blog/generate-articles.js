#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Automatically generates articles.json from individual post files
 * Run this script whenever you add new posts: node blog/generate-articles.js
 */

const POSTS_DIR = path.join(__dirname, 'data', 'posts');
const OUTPUT_FILE = path.join(__dirname, 'data', 'articles.json');

function generateArticlesIndex() {
    try {
        // Check if posts directory exists
        if (!fs.existsSync(POSTS_DIR)) {
            console.error('❌ Posts directory not found:', POSTS_DIR);
            process.exit(1);
        }

        // Read all JSON files from posts directory
        const files = fs.readdirSync(POSTS_DIR)
            .filter(file => file.endsWith('.json'))
            .sort()
            .reverse(); // Most recent first

        console.log(`📁 Found ${files.length} post files`);

        const articles = [];

        // Process each post file
        for (const file of files) {
            const filePath = path.join(POSTS_DIR, file);

            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const post = JSON.parse(content);

                // Validate required fields
                if (!post.id || !post.title || !post.date) {
                    console.warn(`⚠️  Skipping ${file}: Missing required fields (id, title, date)`);
                    continue;
                }

                // Extract article metadata
                const article = {
                    id: post.id,
                    title: post.title,
                    excerpt: post.excerpt || post.description || '',
                    date: post.date,
                    author: post.author || 'Prajyoth Reddy',
                    tags: post.tags || [],
                    readTime: post.readTime || calculateReadTime(post.content || ''),
                    slug: post.slug || post.id
                };

                articles.push(article);
                console.log(`✅ Processed: ${post.title}`);

            } catch (error) {
                console.error(`❌ Error processing ${file}:`, error.message);
            }
        }

        // Generate the articles index
        const articlesData = {
            articles: articles,
            totalCount: articles.length,
            lastUpdated: new Date().toISOString(),
            generatedBy: 'generate-articles.js'
        };

        // Write to articles.json
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articlesData, null, 2));

        // Also write to articles.js for CORS-free loading
        const JS_OUTPUT_FILE = path.join(__dirname, 'data', 'articles.js');
        const jsContent = `// Articles data - generated automatically
window.articlesData = ${JSON.stringify(articlesData, null, 2)};`;
        fs.writeFileSync(JS_OUTPUT_FILE, jsContent);

        console.log(`\n🎉 Successfully generated articles files with ${articles.length} articles`);
        console.log(`📄 JSON Output: ${OUTPUT_FILE}`);
        console.log(`📄 JS Output: ${JS_OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ Error generating articles index:', error.message);
        process.exit(1);
    }
}

/**
 * Calculate estimated reading time based on content
 * @param {string} content - The article content
 * @returns {string} - Reading time like "5 min read"
 */
function calculateReadTime(content) {
    if (!content) return '1 min read';

    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return `${minutes} min read`;
}

// Run the generator
if (require.main === module) {
    console.log('🚀 Generating articles index...\n');
    generateArticlesIndex();
}

module.exports = { generateArticlesIndex };