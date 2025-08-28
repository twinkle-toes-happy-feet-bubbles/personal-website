#!/usr/bin/env node

/**
 * Test script to debug article generation issues
 * Run: node test-articles.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing article generation...\n');

// Test 1: Check if posts directory exists
const postsDir = path.join(__dirname, 'blog', 'data', 'posts');
console.log('📁 Posts directory:', postsDir);
console.log('   Exists:', fs.existsSync(postsDir));

if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));
    console.log('   Files found:', files.length);
    files.forEach(file => console.log('   -', file));
}

console.log();

// Test 2: Validate each JSON file
console.log('🔍 Validating JSON files...');
if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const post = JSON.parse(content);

            // Check required fields
            const required = ['id', 'title', 'date'];
            const missing = required.filter(field => !post[field]);

            if (missing.length === 0) {
                console.log(`   ✅ ${file} - Valid`);
            } else {
                console.log(`   ❌ ${file} - Missing: ${missing.join(', ')}`);
            }
        } catch (error) {
            console.log(`   ❌ ${file} - JSON Error: ${error.message}`);
        }
    });
}

console.log();

// Test 3: Try generating articles.json
console.log('🚀 Testing article generation...');
try {
    const { generateArticlesIndex } = require('./blog/generate-articles.js');
    generateArticlesIndex();
    console.log('   ✅ Generation successful!');
} catch (error) {
    console.log('   ❌ Generation failed:', error.message);
}

console.log('\n🎉 Test complete!');