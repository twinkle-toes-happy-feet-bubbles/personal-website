# Blog System

Automated blog system for Prajyoth's portfolio. No more manual JSON updates!

## 🚀 Quick Start

### Creating a New Post

```bash
# Interactive post creation
npm run new-post

# Or manually create a JSON file in blog/data/posts/
```

### Updating Articles Index

```bash
# Generate articles.json from all posts
npm run build-articles
```

### Development Server

```bash
# Start local server
npm run dev
# Visit: http://localhost:8000
```

## 📁 File Structure

```
blog/
├── data/
│   ├── posts/           # Individual post JSON files
│   │   ├── 2025-01-28-welcome-to-my-blog.json
│   │   └── 2025-01-29-building-with-javascript.json
│   └── articles.json    # Auto-generated index (don't edit manually!)
├── js/                  # Blog JavaScript modules
├── generate-articles.js # Auto-generates articles.json
├── new-post.js         # Creates new posts interactively
└── README.md           # This file
```

## ✍️ Writing Posts

### Post JSON Format

```json
{
  "id": "2025-01-29-my-awesome-post",
  "title": "My Awesome Post",
  "slug": "my-awesome-post",
  "excerpt": "A brief description of the post",
  "description": "Same as excerpt, for SEO",
  "date": "2025-01-29",
  "author": "Prajyoth Reddy Mothi",
  "tags": ["javascript", "web-development"],
  "readTime": "5 min read",
  "content": "# My Awesome Post\n\nMarkdown content here..."
}
```

### Content Guidelines

- Use **Markdown** for content formatting
- Include code blocks with syntax highlighting
- Add relevant tags for categorization
- Keep excerpts under 160 characters for SEO

## 🤖 Automation

### GitHub Actions

The system automatically:
1. **Detects** new posts when you push to GitHub
2. **Generates** updated articles.json
3. **Commits** the changes back to the repository

### Manual Workflow

1. Create new post: `npm run new-post`
2. Edit the generated JSON file
3. Update index: `npm run build-articles`
4. Commit and push to GitHub

## 🎯 Features

- ✅ **Automated indexing** - No manual articles.json updates
- ✅ **Interactive post creation** - Guided post setup
- ✅ **GitHub Actions integration** - Auto-updates on push
- ✅ **Markdown support** - Rich content formatting
- ✅ **SEO optimized** - Proper meta tags and structure
- ✅ **Reading time calculation** - Automatic estimation
- ✅ **Tag system** - Categorize your posts
- ✅ **Responsive design** - Works on all devices

## 🛠️ Customization

### Adding New Fields

Edit `blog/generate-articles.js` to include additional metadata:

```javascript
const article = {
    id: post.id,
    title: post.title,
    // Add your custom fields here
    customField: post.customField || 'default value'
};
```

### Styling

- Main styles: `article.html` and `blog.html`
- Minimal, technical aesthetic
- Dark theme optimized
- Clean typography hierarchy

## 📝 Tips

1. **Consistent naming**: Use YYYY-MM-DD-slug format for post IDs
2. **SEO friendly**: Write descriptive titles and excerpts
3. **Tag wisely**: Use consistent, lowercase tags
4. **Test locally**: Use `npm run dev` before pushing
5. **Backup**: Posts are in Git, but keep local backups

## 🚨 Troubleshooting

### Articles not updating?
```bash
# Manually regenerate
npm run build-articles

# Check for errors
node blog/generate-articles.js
```

### GitHub Actions failing?
- Check repository permissions
- Ensure GITHUB_TOKEN has write access
- Verify file paths in workflow

### Local development issues?
```bash
# Python server (recommended)
python -m http.server 8000

# Or Node.js alternative
npx serve .
```

---

**Happy blogging!** 🎉