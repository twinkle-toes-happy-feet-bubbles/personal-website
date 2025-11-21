const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const DRAFTS_DIR = path.join(__dirname, '..', 'drafts');
const EDITOR_DIR = __dirname;

// Ensure drafts directory exists
if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // API Endpoints
    if (req.url === '/api/drafts' && req.method === 'GET') {
        fs.readdir(DRAFTS_DIR, (err, files) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
            const drafts = files.filter(f => f.endsWith('.md'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(drafts));
        });
        return;
    }

    if (req.url.startsWith('/api/drafts/') && req.method === 'GET') {
        const filename = req.url.split('/').pop();
        const filePath = path.join(DRAFTS_DIR, filename);
        
        if (!fs.existsSync(filePath)) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'File not found' }));
            return;
        }

        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ content }));
        });
        return;
    }

    if (req.url === '/api/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { filename, content } = JSON.parse(body);
                const filePath = path.join(DRAFTS_DIR, filename);
                fs.writeFile(filePath, content, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: err.message }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    if (req.url === '/api/create' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { filename, title } = JSON.parse(body);
                const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
                const filePath = path.join(DRAFTS_DIR, safeFilename);
                
                const initialContent = `---
title: ${title}
date: ${new Date().toISOString().split('T')[0]}
excerpt: 
tags: []
readTime: 5 min read
slug: ${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
---

# ${title}

Start writing here...
`;

                fs.writeFile(filePath, initialContent, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: err.message }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, filename: safeFilename }));
                });
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    if (req.url === '/api/publish' && req.method === 'POST') {
        const publishScript = path.join(__dirname, '..', 'publish.js');
        exec(`node "${publishScript}"`, (error, stdout, stderr) => {
            if (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: error.message, details: stderr }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, output: stdout }));
        });
        return;
    }

    // Serve Static Files
    let filePath = req.url === '/' ? path.join(EDITOR_DIR, 'index.html') : path.join(EDITOR_DIR, req.url);
    
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`📝 Blog Editor running at http://localhost:${PORT}`);
});
