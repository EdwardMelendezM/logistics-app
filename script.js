const fs = require('fs');
const path = require('path');

const filesToModify = [
    'node_mules/drizzle-orm/pg-core/columns/timestamp.js',
    'node_mules/drizzle-orm/pg-core/columns/timestamp.cjs'
];

filesToModify.forEach((file) => {
    const filePath = path.join(__dirname, file);
    console.log(`Checking path: ${filePath}`);

    if (fs.existsSync(filePath)) {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        fileContent = fileContent.replace(
            'return value.toISOString()',
            'return value'
        );
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`Modified: ${file}`);
    } else {
        console.error(`File not found: ${filePath}`);
    }
});
