const fs = require('fs');
const path = require('path');

function registerFonts(doc) {
  // backend/src/utills -> ../../ resolves to backend
  const baseDir = path.join(__dirname, '../../');
  const robotoPath = path.join(baseDir, 'fonts/Roboto-Regular.ttf');
  const notoSinhalaPath = path.join(baseDir, 'fonts/NotoSansSinhala-Regular.ttf');
  let sinhalaAvailable = false;

  try {
    console.log(`Trying fonts: Roboto='${robotoPath}', NotoSinhala='${notoSinhalaPath}'`);
    if (fs.existsSync(robotoPath)) {
      doc.registerFont('Roboto', robotoPath);
    } else {
      doc.registerFont('Roboto', 'Helvetica');
      console.warn(`Font not found: ${robotoPath}. Using Helvetica.`);
    }

    if (fs.existsSync(notoSinhalaPath)) {
      doc.registerFont('NotoSansSinhala', notoSinhalaPath);
      sinhalaAvailable = true;
      console.log('Sinhala font found and registered.');
    } else {
      doc.registerFont('NotoSansSinhala', 'Helvetica');
      console.warn(`Font not found: ${notoSinhalaPath}. Sinhala text will fallback to Helvetica.`);
    }
  } catch (error) {
    console.error(`Error registering fonts: ${error.message}`);
    doc.registerFont('Roboto', 'Helvetica');
    doc.registerFont('NotoSansSinhala', 'Helvetica');
  }

  // return both names to be compatible with existing controllers
  return { sinhalaAvailable, sinhalaFontAvailable: sinhalaAvailable, robotoPath, notoSinhalaPath };
}

module.exports = { registerFonts };
