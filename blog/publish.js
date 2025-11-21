const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DRAFTS_DIR = path.join(__dirname, 'drafts');
const POSTS_DIR = path.join(__dirname, 'data', 'posts');

// Ensure directories exist
if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}
if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
}

function parseFrontmatter(content) {
    const match = content.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
    if (!match) {
        return { metadata: {}, content: content };
    }

    const metadataRaw = match[1];
    const body = match[2].trim();
    const metadata = {};

    metadataRaw.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join(':').trim();

            // Handle arrays (e.g., [tag1, tag2])
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim());
            }

            metadata[key] = value;
        }
    });

    return { metadata, content: body };
}

function processDraft(filename) {
    if (!filename.endsWith('.md')) return;

    const filePath = path.join(DRAFTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { metadata, content } = parseFrontmatter(fileContent);

    if (!metadata.title) {
        console.warn(`⚠️  Skipping ${filename}: Missing title in frontmatter`);
        return;
    }

    // Generate ID/Slug
    const date = metadata.date || new Date().toISOString().split('T')[0];
    const slug = metadata.slug || metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `${date}-${slug}`;

    const postData = {
        id: id,
        title: metadata.title,
        slug: slug,
        excerpt: metadata.excerpt || '',
        description: metadata.description || metadata.excerpt || '',
        date: date,
        author: metadata.author || 'Prajyoth Reddy',
        tags: metadata.tags || [],
        readTime: metadata.readTime || '5 min read',
        published: true,
        allowComments: true,
        content: content
    };

    const jsonFilename = `${id}.json`;
    const jsonPath = path.join(POSTS_DIR, jsonFilename);

    fs.writeFileSync(jsonPath, JSON.stringify(postData, null, 2));
    console.log(`✅ Converted ${filename} -> ${jsonFilename}`);
}

function buildAll() {
    console.log('🚀 Building articles from drafts...');
    const files = fs.readdirSync(DRAFTS_DIR);
    files.forEach(processDraft);
    
    console.log('🔄 Updating articles index...');
    try {
        execSync('node blog/generate-articles.js', { stdio: 'inherit' });
    } catch (e) {
        console.error('Failed to update index:', e);
    }
}

// Watch mode
if (process.argv.includes('--watch')) {
    console.log('👀 Watching for changes in drafts...');
    buildAll();
    
    fs.watch(DRAFTS_DIR, (eventType, filename) => {
        if (filename && filename.endsWith('.md')) {
            console.log(`📝 Detected change in ${filename}`);
            processDraft(filename);
            try {
                execSync('node blog/generate-articles.js', { stdio: 'inherit' });
            } catch (e) {
                console.error('Failed to update index:', e);
            }
        }
    });
} else {
    buildAll();
}
