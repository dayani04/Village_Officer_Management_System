const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { registerFonts } = require('../src/utills/registerFonts');

const villager = { Villager_ID: 'V002', Full_Name: 'දයානි සන්දාමලි', Address: '106/A welihena , Galle' };
const nic = { NIC_ID: '1', NIC_Type: 'New NIC' };
const applyDate = new Date().toISOString().split('T')[0];

async function generate() {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const timestamp = Date.now();
  const filename = `${villager.Villager_ID}_${nic.NIC_ID}_receipt_${timestamp}.pdf`;
  const uploadDir = path.join(__dirname, '../Uploads');
  const outPath = path.join(uploadDir, filename);
  fs.mkdirSync(uploadDir, { recursive: true });

  console.log('Generating NIC receipt to:', outPath);
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  const { sinhalaAvailable, sinhalaFontAvailable } = registerFonts(doc);
  console.log('registerFonts returned:', { sinhalaAvailable, sinhalaFontAvailable });

  doc.font('Roboto').fontSize(24).fillColor('#921940').text('NIC Application Receipt', 0, 120, { align: 'center' });
  if (sinhalaFontAvailable) doc.font('NotoSansSinhala').fontSize(22).text('ජාතික හැඳුනුම්පත් ලදුපත', 0, 150, { align: 'center' });
  else doc.font('Roboto').fontSize(12).fillColor('#f43f3f').text('Sinhala font unavailable', 0, 150, { align: 'center' });

  if (sinhalaFontAvailable) doc.font('NotoSansSinhala').fontSize(12).text(`නම: ${villager.Full_Name}`, 40, 300);
  doc.font('Roboto').fontSize(12).text(`Name: ${villager.Full_Name}`, 40, 300);

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  console.log('NIC receipt generated:', outPath);
}

generate().catch(err => console.error('Error:', err));
