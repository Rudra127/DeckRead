const fs = require('fs');
const pdf = require('html-pdf');

const html = fs.readFileSync('top.html', 'utf8');

// Custom options for maximum size (A4 is standard, but you can go bigger)
const options = {
  format: 'A4',               // Standard size (210mm x 297mm)
  border: '0',                // No margin
  type: 'pdf',               // Output type
  phantomArgs: [
    '--ignore-ssl-errors=yes',
    '--web-security=no',
  ],
  renderDelay: 1000,          // Wait for rendering (ms)
  height: '297mm',            // Explicit height (A4)
  width: '210mm',             // Explicit width (A4)
  // If you want even larger (e.g., A3), use:
  // format: 'A3',            // 297mm x 420mm
  // height: '420mm',
  // width: '297mm',
};

pdf.create(html, options).toFile('resume.pdf', (err, res) => {
  if (err) console.error(err);
  else console.log('PDF generated:', res.filename);
});