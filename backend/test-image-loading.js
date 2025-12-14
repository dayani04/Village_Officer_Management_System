const path = require('path');
const fs = require('fs');

// Test the exact paths used in the controllers
const controllerDir = 'd:\\HDSE23.3f\\Final_Project\\Village_Officer_Management_System\\backend\\src\\controllers\\villager';
const baseDir = path.join(controllerDir, '../../../');
const flagPath = path.join(baseDir, 'public/assets/sri-lanka-flag.png');
const emblemPath = path.join(baseDir, 'public/assets/sri-lanka-emblem.png');

console.log('Controller Dir:', controllerDir);
console.log('BaseDir:', baseDir);
console.log('Absolute BaseDir:', path.resolve(baseDir));
console.log('Flag Path:', flagPath);
console.log('Emblem Path:', emblemPath);
console.log('Absolute Flag Path:', path.resolve(flagPath));
console.log('Absolute Emblem Path:', path.resolve(emblemPath));

console.log('\n--- File Existence Check ---');
console.log('Flag exists:', fs.existsSync(flagPath));
console.log('Emblem exists:', fs.existsSync(emblemPath));

if (fs.existsSync(flagPath)) {
    const stats = fs.statSync(flagPath);
    console.log('Flag file size:', stats.size, 'bytes');
}

if (fs.existsSync(emblemPath)) {
    const stats = fs.statSync(emblemPath);
    console.log('Emblem file size:', stats.size, 'bytes');
}

// Test PDF creation
console.log('\n--- Testing PDF Creation ---');
try {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    
    // Create a test PDF
    const testPath = path.join(baseDir, 'test-pdf-with-images.pdf');
    const stream = fs.createWriteStream(testPath);
    doc.pipe(stream);
    
    console.log('PDF Document created');
    
    // Try to add the flag image
    if (fs.existsSync(flagPath)) {
        console.log('Adding flag image to PDF...');
        doc.image(flagPath, 40, 40, { width: 60 });
        console.log('Flag image added successfully');
    } else {
        console.log('Flag image not found, adding text instead');
        doc.text('Flag missing', 40, 40);
    }
    
    // Try to add the emblem image
    if (fs.existsSync(emblemPath)) {
        console.log('Adding emblem image to PDF...');
        doc.image(emblemPath, 495, 40, { width: 60 });
        console.log('Emblem image added successfully');
    } else {
        console.log('Emblem image not found, adding text instead');
        doc.text('Emblem missing', 495, 40);
    }
    
    doc.end();
    
    stream.on('finish', () => {
        console.log('Test PDF created successfully at:', testPath);
        console.log('Check this file to see if images appear correctly');
    });
    
    stream.on('error', (err) => {
        console.error('Error creating test PDF:', err);
    });
    
} catch (error) {
    console.error('Error in PDF test:', error);
}
