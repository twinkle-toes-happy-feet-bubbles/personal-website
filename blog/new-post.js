#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Interactive script to create new blog posts
 * Run: npm run new-post
 */

const POSTS_DIR = path.join(__dirname, 'data', 'posts');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

async function createNewPost() {
    console.log('🚀 Creating a new blog post...\n');

    try {
        // Get post details
        const title = await question('📝 Post title: ');
        if (!title.trim()) {
            console.log('❌ Title is required');
            process.exit(1);
        }

        const excerpt = await question('📄 Short excerpt (optional): ');
        const tagsInput = await question('🏷️  Tags (comma-separated, optional): ');

        // Generate post data
        const now = new Date();
        const slug = generateSlug(title);
        const id = `${formatDate(now)}-${slug}`;
        const filename = `${id}.json`;

        const tags = tagsInput
            ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
            : [];

        const postData = {
            id: id,
            title: title.trim(),
            slug: slug,
            excerpt: excerpt.trim() || '',
            description: excerpt.trim() || '',
            date: formatDate(now),
            author: "Prajyoth Reddy Mothi",
            tags: tags,
            readTime: "5 min read",
            content: `# ${title}\n\n${excerpt ? excerpt + '\n\n' : ''}Write your blog post content here using Markdown.\n\n## Getting Started\n\nYou can use:\n- **Bold text**\n- *Italic text*\n- \`inline code\`\n- [Links](https://example.com)\n- Lists\n- Code blocks\n\n\`\`\`javascript\nconsole.log('Hello, world!');\n\`\`\`\n\n## Conclusion\n\nWrap up your thoughts here.`
        };

        // Ensure posts directory exists
        if (!fs.existsSync(POSTS_DIR)) {
            fs.mkdirSync(POSTS_DIR, { recursive: true });
        }

        // Write the post file
        const filePath = path.join(POSTS_DIR, filename);
        fs.writeFileSync(filePath, JSON.stringify(postData, null, 2));

        console.log(`\n✅ Created new post: ${filename}`);
        console.log(`📁 Location: ${filePath}`);
        console.log(`\n📝 Next steps:`);
        console.log(`1. Edit the content in: ${filePath}`);
        console.log(`2. Run: npm run build-articles`);
        console.log(`3. Commit and push to GitHub`);

    } catch (error) {
        console.error('❌ Error creating post:', error.message);
    } finally {
        rl.close();
    }
}

// Run the script
if (require.main === module) {
    createNewPost();
}

module.exports = { createNewPost };