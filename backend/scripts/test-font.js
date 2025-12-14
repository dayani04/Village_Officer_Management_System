const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const baseDir = path.join(__dirname, '..');
const fontsDir = path.join(baseDir, 'fonts');
const roboto = path.join(fontsDir, 'Roboto-Regular.ttf');
const noto = path.join(fontsDir, 'NotoSansSinhala-Regular.ttf');

console.log('Fonts dir:', fontsDir);
console.log('Roboto exists:', fs.existsSync(roboto), roboto);
console.log('NotoSinhala exists:', fs.existsSync(noto), noto);

const doc = new PDFDocument();
try {
  if (fs.existsSync(roboto)) doc.registerFont('Roboto', roboto);
  else doc.registerFont('Roboto', 'Helvetica');
  if (fs.existsSync(noto)) doc.registerFont('NotoSansSinhala', noto);
  else doc.registerFont('NotoSansSinhala', 'Helvetica');
} catch (e) {
  console.error('Error registering fonts:', e.message);
}

const outPath = path.join(baseDir, 'font-test-output.pdf');
console.log('Output PDF:', outPath);
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

doc.font('Roboto').fontSize(18).text('Test English: Permit Certificate', {align: 'center'});
doc.moveDown();
doc.font('NotoSansSinhala').fontSize(18).text('සිංහල පරීක්ෂණය', {align: 'center'});

doc.end();

stream.on('finish', () => console.log('PDF written:', outPath));
stream.on('error', (err) => console.error('Write error:', err));
