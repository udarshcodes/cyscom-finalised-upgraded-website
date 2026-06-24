const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fileName = path.basename(file);
const sanitizedFileName = path.basename(file).replace(/[^a-zA-Z0-9._-]/g, '');
const fullPath = path.join(dir, sanitizedFileName);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            let newContent = content.replace(/src="\/img\/([^"]+)"/g, 'src={`${import.meta.env.BASE_URL}img/$1`}');
            newContent = newContent.replace(/src="\/videos\/([^"]+)"/g, 'src={`${import.meta.env.BASE_URL}videos/$1`}');
            newContent = newContent.replace(/alt="\/img\/([^"]+)"/g, 'alt={`${import.meta.env.BASE_URL}img/$1`}');
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('./src');
console.log('Done!');
