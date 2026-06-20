const fs = require('fs');
const path = require('path');
const { normalize } = require('path');

function processDir(dir) {
    dir = path.normalize(dir); 
    dir = path.resolve(dir);
    const files = fs.readdirSync(dir).filter(file => !path.basename(file).startsWith('.')).map(file => path.basename(file));
    for (const file of files) {
        const fullPath = path.join(dir, path.basename(path.normalize(file)).replace(/^(\.\.[\\/])+/, '').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\/$/, ''));
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

processDir(path.resolve('./src')); 
console.log('Done!');
