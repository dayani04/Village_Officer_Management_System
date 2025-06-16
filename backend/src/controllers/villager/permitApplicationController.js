const PermitApplication = require("../../models/villager/permitApplicationModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const createPermitApplication = async (req, res) => {
  try {
    const { email, permitType } = req.body;
    const files = req.files || {};

    console.log("Raw req.files:", files);
    console.log("Raw req.body:", req.body);

    const document = files.document && files.document.length > 0 ? files.document[0] : null;
    const policeReport = files.policeReport && files.policeReport.length > 0 ? files.policeReport[0] : null;

    console.log("Received data:", {
      email,
      permitType,
      document: document ? document.originalname : "undefined",
      policeReport: policeReport ? policeReport.originalname : "undefined",
    });

    if (!email || !permitType || !document || !policeReport) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ error: "Email, permit type, ID document, and police report are required" });
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(document.mimetype) || !allowedTypes.includes(policeReport.mimetype)) {
      console.log("Validation failed: Invalid file type");
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    const villager = await PermitApplication.getVillagerByEmail(email);
    if (!villager) {
      console.log("Validation failed: Villager not found for email", email);
      return res.status(404).json({ error: "Villager not found" });
    }

    const permit = await PermitApplication.getPermitByType(permitType);
    if (!permit) {
      console.log("Validation failed: Permit type not found", permitType);
      return res.status(400).json({ error: `Permit type '${permitType}' not found` });
    }

    const timestamp = Date.now();
    const documentFileName = `${villager.Villager_ID}_${permit.Permits_ID}_doc_${timestamp}${path.extname(document.originalname)}`;
    const policeReportFileName = `${villager.Villager_ID}_${permit.Permits_ID}_police_${timestamp}${path.extname(policeReport.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${documentFileName}`;
    const policeReportPath = `${policeReportFileName}`;

    fs.mkdirSync(uploadDir, { recursive: true });

    fs.writeFileSync(path.join(uploadDir, documentFileName), document.buffer);
    fs.writeFileSync(path.join(uploadDir, policeReportFileName), policeReport.buffer);

    const applyDate = new Date().toISOString().split("T")[0];
    await PermitApplication.addPermitApplication(
      villager.Villager_ID,
      permit.Permits_ID,
      applyDate,
      documentPath,
      policeReportPath
    );

    res.status(201).json({ message: "Permit application submitted successfully" });
  } catch (error) {
    console.error("Error in createPermitApplication:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getPermitApplications = async (req, res) => {
  try {
    const applications = await PermitApplication.getAllPermitApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getPermitApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getConfirmedPermitApplications = async (req, res) => {
  try {
    const applications = await PermitApplication.getConfirmedPermitApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getConfirmedPermitApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const generatePermitCertificate = async (villager, permit, applyDate) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const timestamp = Date.now();
  const certificateFileName = `${villager.Villager_ID}_${permit.Permits_ID}_certificate_${timestamp}.pdf`;
  const certificatePath = path.join(__dirname, "../../../Uploads", certificateFileName);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(certificatePath);
    doc.pipe(stream);

    // Define base directory (project root)
    const baseDir = path.join(__dirname, '../../../');

    // Register fonts
    const robotoPath = path.join(baseDir, 'fonts/Roboto-Regular.ttf');
    const notoSinhalaPath = path.join(baseDir, 'fonts/NotoSansSinhala-Regular.ttf');
    let sinhalaFontAvailable = false;

    console.log('Roboto Path:', robotoPath);
    console.log('NotoSansSinhala Path:', notoSinhalaPath);

    try {
      if (fs.existsSync(robotoPath)) {
        doc.registerFont('Roboto', robotoPath);
      } else {
        console.warn(`Font not found: ${robotoPath}. Using Helvetica.`);
        doc.registerFont('Roboto', 'Helvetica');
      }
      if (fs.existsSync(notoSinhalaPath)) {
        doc.registerFont('NotoSansSinhala', notoSinhalaPath);
        sinhalaFontAvailable = true;
      } else {
        console.warn(`Font not found: ${notoSinhalaPath}. Using Helvetica (Sinhala will not render correctly).`);
        doc.registerFont('NotoSansSinhala', 'Helvetica');
      }
    } catch (error) {
      console.error(`Error registering fonts: ${error.message}`);
      doc.registerFont('Roboto', 'Helvetica');
      doc.registerFont('NotoSansSinhala', 'Helvetica');
    }

    // Draw decorative border
    doc.lineWidth(2)
       .strokeColor('#D4A017') // Gold
       .rect(20, 20, 555, 802)
       .stroke();
    doc.lineWidth(1)
       .strokeColor('#921940') // Maroon
       .rect(25, 25, 545, 792)
       .stroke();

    // Header with flag and emblem
    const flagPath = path.join(baseDir, 'public/assets/sri-lanka-flag.png');
    const emblemPath = path.join(baseDir, 'public/assets/sri-lanka-emblem.png');
    console.log('Flag Path:', flagPath);
    console.log('Emblem Path:', emblemPath);

    if (fs.existsSync(flagPath)) {
      doc.image(flagPath, 40, 40, { width: 60 });
    } else {
      console.warn(`Image not found: ${flagPath}`);
      doc.font('Roboto').fontSize(10).fillColor('#333').text('Flag missing', 40, 40);
    }
    if (fs.existsSync(emblemPath)) {
      doc.image(emblemPath, 495, 40, { width: 60 });
    } else {
      console.warn(`Image not found: ${emblemPath}`);
      doc.font('Roboto').fontSize(10).fillColor('#333').text('Emblem missing', 495, 40);
    }

    // Certificate Title
    doc.font('Roboto').fontSize(24).fillColor('#921940')
       .text('Permit Certificate', 0, 120, { align: 'center' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(22)
         .text('බලපත්‍ර සහතිකය', 0, 150, { align: 'center' });
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#f43f3f')
         .text('Sinhala font unavailable', 0, 150, { align: 'center' });
    }

    // Certificate Number
    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text(`Certificate Number: ${villager.Villager_ID}-${permit.Permits_ID}`, 0, 190, { align: 'center' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`සහතික අංකය: ${villager.Villager_ID}-${permit.Permits_ID}`, 0, 210, { align: 'center' });
    }

    // Villager Information
    doc.font('Roboto').fontSize(16).fillColor('#921940')
       .text('Issued To:', 40, 250, { underline: true });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(16)
         .text('නිකුත් කරන ලද්දේ:', 40, 270, { underline: true });
    }

    const address = villager.Address && !villager.Address.includes('@') ? villager.Address : 'Not Provided';
    if (sinhalaFontAvailable) {
      // Two-column layout
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Name: ${villager.Full_Name || 'N/A'}`, 40, 300)
         .text(`Villager ID: ${villager.Villager_ID || 'N/A'}`, 40, 320)
         .text(`Address: ${villager.address}`, 40, 340);
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`නම: ${villager.Full_Name || 'N/A'}`, 300, 300)
         .text(`ගම්වාසී හැඳුනුම්පත: ${villager.Villager_ID || 'N/A'}`, 300, 320)
         .text(`ලිපිනය: ${villager.address}`, 300, 340);
    } else {
      // Fallback single-column layout
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Name: ${villager.Full_Name || 'N/A'}`, 40, 300)
         .text(`Villager ID: ${villager.Villager_ID || 'N/A'}`, 40, 320)
         .text(`Address: ${villager.address}`, 40, 340);
    }

    // Permit Information
    doc.font('Roboto').fontSize(16).fillColor('#921940')
       .text('Permit Details:', 40, 380, { underline: true });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(16)
         .text('බලපත්‍ර විස්තර:', 40, 400, { underline: true });
    }

    const formattedApplyDate = applyDate ? new Date(applyDate).toISOString().split('T')[0] : 'N/A';
    if (sinhalaFontAvailable) {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Permit Type: ${permit.Permits_Type || 'N/A'}`, 40, 430)
         .text(`Permit ID: ${permit.Permits_ID || 'N/A'}`, 40, 450)
         .text(`Issue Date: ${formattedApplyDate}`, 40, 470);
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`බලපත්‍ර වර්ගය: ${permit.Permits_Type || 'N/A'}`, 300, 430)
         .text(`බලපත්‍ර හැඳුනුම්පත: ${permit.Permits_ID || 'N/A'}`, 300, 450)
         .text(`නිකුත් කළ දිනය: ${formattedApplyDate}`, 300, 470);
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Permit Type: ${permit.Permits_Type || 'N/A'}`, 40, 430)
         .text(`Permit ID: ${permit.Permits_ID || 'N/A'}`, 40, 450)
         .text(`Issue Date: ${formattedApplyDate}`, 40, 470);
    }

    // Official Statement
    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text('This certificate confirms that the above-named individual has been granted the specified permit.', 40, 510, { width: 515, align: 'justify' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text('මෙම සහතිකය ඉහත නම් කරන ලද පුද්ගලයාට නිශ්චිත බලපත්‍රය ලබා දී ඇති බව තහවුරු කරයි.', 40, 540, { width: 515, align: 'justify' });
    }

    // Issued By
    doc.font('Roboto').fontSize(12)
       .text('Issued by: Village Authority', 40, 600)
       .text(`Date: ${new Date().toISOString().split('T')[0]}`, 40, 620);
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text('නිකුත් කළේ: ගම්මාන අධිකාරිය', 300, 600)
         .text(`දිනය: ${new Date().toISOString().split('T')[0]}`, 300, 620);
    }

    // Footer Line
    doc.lineWidth(1).strokeColor('#D4A017')
       .moveTo(40, 780).lineTo(555, 780).stroke();

    doc.end();

    stream.on('finish', () => resolve(certificateFileName));
    stream.on('error', (err) => reject(err));
  });
};

const updatePermitApplicationStatus = async (req, res) => {
  try {
    const { villagerId, permitsId } = req.params;
    const { status } = req.body;

    console.log("Received update request:", {
      villagerId,
      permitsId,
      rawBody: req.body,
      status,
    });

    if (!status) {
      console.log("Validation failed: Status is missing");
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Pending", "Send", "Rejected", "Confirm"];
    if (!validStatuses.includes(status)) {
      console.log("Validation failed: Invalid status", status);
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await PermitApplication.updatePermitApplicationStatus(villagerId, permitsId, status);
    if (!updated) {
      return res.status(404).json({ error: "Permit application not found" });
    }

    // Generate certificate if status is Confirm
    let certificateFileName = null;
    if (status === "Confirm") {
      const application = await PermitApplication.getPermitApplicationByIds(villagerId, permitsId);
      if (application) {
        const villager = await PermitApplication.getVillagerById(villagerId);
        const permit = await PermitApplication.getPermitById(permitsId);
        certificateFileName = await generatePermitCertificate(villager, permit, application.apply_date);
        await PermitApplication.updateCertificatePath(villagerId, permitsId, certificateFileName);
      }
    }

    res.json({ 
      message: "Permit application status updated successfully",
      certificate: certificateFileName ? { filename: certificateFileName } : null
    });
  } catch (error) {
    console.error("Error in updatePermitApplicationStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = await PermitApplication.getFilePath(filename);
    if (!filePath) {
      return res.status(404).json({ error: "File not found" });
    }

    const fullPath = path.join(__dirname, "../../../Uploads", filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(fullPath, filename);
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createPermitApplication,
  getPermitApplications,
  getConfirmedPermitApplications,
  updatePermitApplicationStatus,
  downloadDocument,
};