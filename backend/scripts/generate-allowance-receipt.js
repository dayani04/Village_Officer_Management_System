const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { registerFonts } = require('../src/utills/registerFonts');

const villager = {
  Villager_ID: 'V123',
  Full_Name: 'සුජාත සිල්වා',
  Address: '106/A welihena , Galle'
};
const allowance = {
  Allowances_ID: 'A1',
  Allowances_Type: 'Old Age Allowance'
};
const applyDate = new Date().toISOString().split('T')[0];

async function generate() {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const timestamp = Date.now();
  const receiptFileName = `${villager.Villager_ID}_${allowance.Allowances_ID}_receipt_${timestamp}.pdf`;
  const uploadDir = path.join(__dirname, '../Uploads');
  const outPath = path.join(uploadDir, receiptFileName);
  fs.mkdirSync(uploadDir, { recursive: true });

  console.log('Generating to:', outPath);
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  const { sinhalaAvailable, sinhalaFontAvailable } = registerFonts(doc);
  console.log('registerFonts returned:', { sinhalaAvailable, sinhalaFontAvailable });

  const baseDir = path.join(__dirname, '../');
  const flagPath = path.join(baseDir, 'public/assets/sri-lanka-flag.png');
  const emblemPath = path.join(baseDir, 'public/assets/sri-lanka-emblem.png');

  doc.font('Roboto').fontSize(24).fillColor('#921940').text('Allowance Receipt', 0, 120, { align: 'center' });
  if (sinhalaFontAvailable) {
    doc.font('NotoSansSinhala').fontSize(22).text('ආධාර ලදුපත', 0, 150, { align: 'center' });
  } else {
    doc.font('Roboto').fontSize(12).fillColor('#f43f3f').text('Sinhala font unavailable', 0, 150, { align: 'center' });
  }

  if (sinhalaFontAvailable) {
    doc.font('NotoSansSinhala').fontSize(12).text(`නම: ${villager.Full_Name || 'N/A'}`, 40, 300);
  }
  doc.font('Roboto').fontSize(12).text(`Name: ${villager.Full_Name}`, 40, 300);

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  console.log('Receipt generated:', outPath);
}

generate().catch(err => console.error('Generation error:', err));
