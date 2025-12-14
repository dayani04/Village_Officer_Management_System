const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const assetsDir = path.join(baseDir, 'public', 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('Assets directory not found:', assetsDir);
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);

const copyIfExists = (fromRegex, toName) => {
  const found = files.find(f => fromRegex.test(f));
  if (!found) return false;
  const src = path.join(assetsDir, found);
  const dest = path.join(assetsDir, toName);
  try {
    if (fs.existsSync(dest)) {
      console.log('Destination already exists:', dest);
    } else {
      fs.copyFileSync(src, dest);
      console.log('Copied', src, '->', dest);
    }
    const stat = fs.statSync(dest);
    console.log('Resulting file size:', stat.size, 'bytes');
    return true;
  } catch (err) {
    console.error('Failed to copy', src, '->', dest, err.message);
    return false;
  }
};

let any = false;
any = copyIfExists(/sri[-_]?lankan.*flag/i, 'sri-lanka-flag.png') || any;
any = copyIfExists(/sri[-_]?lankan.*emblem/i, 'sri-lanka-emblem.png') || any;
any = copyIfExists(/sri[-_]?lanka.*flag/i, 'sri-lanka-flag.png') || any;
any = copyIfExists(/sri[-_]?lanka.*emblem/i, 'sri-lanka-emblem.png') || any;

if (!any) {
  console.log('No matching sri-lanka/sri-lankan flag/emblem files were found in', assetsDir);
  console.log('Files present:', files.join(', '));
} else {
  console.log('Asset copy step completed. You can regenerate a PDF now.');
}
