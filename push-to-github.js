const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE';
const REPO_OWNER = 'Aladesamuel';
const REPO_NAME = 'lightning-qr';
const BRANCH = 'main';

async function makeRequest(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'User-Agent': 'Node.js',
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function getFileSha(filePath) {
    try {
        const result = await makeRequest('GET', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`);
        return result.sha;
    } catch (e) {
        return null; // File doesn't exist
    }
}

async function uploadFile(localPath, remotePath, message) {
    const content = fs.readFileSync(localPath, 'utf8');
    const base64Content = Buffer.from(content).toString('base64');

    const sha = await getFileSha(remotePath);
    const data = {
        message: message,
        content: base64Content,
        branch: BRANCH
    };

    if (sha) {
        data.sha = sha; // Update existing file
    }

    console.log(`Uploading ${remotePath}...`);
    await makeRequest('PUT', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${remotePath}`, data);
    console.log(`✅ ${remotePath} uploaded`);
}

async function main() {
    const files = [
        { local: 'src/controller.ts', remote: 'src/controller.ts', msg: 'Fix controller.ts TypeScript errors' },
        { local: 'src/schemas.ts', remote: 'src/schemas.ts', msg: 'Update schemas.ts' },
        { local: 'package.json', remote: 'package.json', msg: 'Remove canvas dependencies' },
        { local: 'api/index.ts', remote: 'api/index.ts', msg: 'Update API handler' },
        { local: 'vercel.json', remote: 'vercel.json', msg: 'Update Vercel config' }
    ];

    for (const file of files) {
        try {
            await uploadFile(file.local, file.remote, file.msg);
        } catch (error) {
            console.error(`❌ Failed to upload ${file.remote}:`, error.message);
        }
    }

    console.log('\n🎉 All files uploaded! Vercel will auto-deploy.');
}

main().catch(console.error);
