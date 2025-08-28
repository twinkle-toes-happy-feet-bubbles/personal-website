# Giscus Comments Setup Guide

This blog uses [Giscus](https://giscus.app/) for comments, which provides GitHub Discussions-powered comments for your blog.

## Prerequisites

1. Your repository must be **public**
2. The **giscus app** must be installed on your repository
3. **Discussions** feature must be enabled in your repository

## Setup Steps

### 1. Enable Discussions

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Features** section
4. Check the **Discussions** checkbox

### 2. Install Giscus App

1. Visit [github.com/apps/giscus](https://github.com/apps/giscus)
2. Click **Install**
3. Choose your repository
4. Grant the necessary permissions

### 3. Configure Giscus

1. Go to [giscus.app](https://giscus.app/)
2. Enter your repository in the format: `username/repository-name`
3. Choose your preferred settings:
   - **Page ↔️ Discussions Mapping**: Recommended: "Discussion title contains page pathname"
   - **Discussion Category**: Choose or create a category (e.g., "General" or "Blog Comments")
   - **Features**: Enable reactions, metadata as needed
   - **Theme**: Choose "dark" to match the blog theme

### 4. Update Configuration

1. Copy the generated configuration from giscus.app
2. Update the values in `blog/js/config.js`:

```javascript
giscus: {
    repo: 'your-username/your-repo-name',           // Your repository
    repoId: 'R_kgDOxxxxxxxx',                       // Repository ID from giscus.app
    category: 'General',                            // Discussion category name
    categoryId: 'DIC_kwDOxxxxxxxx',                 // Category ID from giscus.app
    mapping: 'pathname',                            // Mapping method
    strict: '0',                                    // Strict title matching
    reactionsEnabled: '1',                          // Enable reactions
    emitMetadata: '0',                              // Emit discussion metadata
    inputPosition: 'bottom',                        // Comment input position
    theme: 'dark',                                  // Theme (matches blog)
    lang: 'en',                                     // Language
    loading: 'lazy'                                 // Loading behavior
}
```

### 5. Test Comments

1. Publish your blog
2. Navigate to an article page
3. Verify that the comments section loads
4. Try posting a test comment

## Troubleshooting

### Comments Not Loading

- Check that your repository is public
- Verify the giscus app is installed
- Ensure discussions are enabled
- Check browser console for errors
- Verify the repository and category IDs are correct

### Wrong Discussion Category

- Go to your repository's Discussions tab
- Create or rename categories as needed
- Update the category name and ID in config.js

### Theme Issues

- The blog uses a dark theme by default
- You can change the theme in config.js
- Giscus will automatically match the theme

## Disabling Comments

To disable comments on specific articles, add this to the article JSON:

```json
{
    "allowComments": false
}
```

To disable comments globally, set this in config.js:

```javascript
blog: {
    enableComments: false
}
```

## Security Notes

- Comments are moderated through GitHub Discussions
- Users need a GitHub account to comment
- Repository owners can moderate discussions
- Giscus respects GitHub's privacy and security features

For more information, visit the [Giscus documentation](https://github.com/giscus/giscus).