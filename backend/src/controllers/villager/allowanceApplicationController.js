const AllowanceApplication = require("../../models/villager/allowanceApplicationModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const createAllowanceApplication = async (req, res) => {
  try {
    const { email, allowanceType } = req.body;
    const file = req.file;

    if (!email || !allowanceType || !file) {
      return res.status(400).json({ error: "Email, allowance type, and document are required" });
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    const villager = await AllowanceApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    const allowance = await AllowanceApplication.getAllowanceByType(allowanceType);
    if (!allowance) {
      return res.status(404).json({ error: `Allowance type '${allowanceType}' not found` });
    }

    const fileName = `${villager.Villager_ID}_${allowance.Allowances_ID}_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = fileName;

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    const applyDate = new Date().toISOString().split("T")[0];
    const result = await AllowanceApplication.addAllowanceApplication(
      villager.Villager_ID,
      allowance.Allowances_ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "Allowance application submitted successfully", applicationId: result.insertId });
  } catch (error) {
    console.error("Error in createAllowanceApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const generateAllowanceReceipt = async (villager, allowance, applyDate) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const timestamp = Date.now();
  const receiptFileName = `${villager.Villager_ID}_${allowance.Allowances_ID}_receipt_${timestamp}.pdf`;
  const receiptPath = path.join(__dirname, "../../../Uploads", receiptFileName);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(receiptPath);
    doc.pipe(stream);

    const baseDir = path.join(__dirname, '../../../');
    const robotoPath = path.join(baseDir, 'fonts/Roboto-Regular.ttf');
    const notoSinhalaPath = path.join(baseDir, 'fonts/NotoSansSinhala-Regular.ttf');
    let sinhalaFontAvailable = false;

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
        console.warn(`Font not found: ${notoSinhalaPath}. Using Helvetica.`);
        doc.registerFont('NotoSansSinhala', 'Helvetica');
      }
    } catch (error) {
      console.error(`Error registering fonts: ${error.message}`);
      doc.registerFont('Roboto', 'Helvetica');
      doc.registerFont('NotoSansSinhala', 'Helvetica');
    }

    doc.lineWidth(2)
       .strokeColor('#D4A017')
       .rect(20, 20, 555, 802)
       .stroke();
    doc.lineWidth(1)
       .strokeColor('#921940')
       .rect(25, 25, 545, 792)
       .stroke();

    const flagPath = path.join(baseDir, 'public/assets/sri-lanka-flag.png');
    const emblemPath = path.join(baseDir, 'public/assets/sri-lanka-emblem.png');

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

    doc.font('Roboto').fontSize(24).fillColor('#921940')
       .text('Allowance Receipt', 0, 120, { align: 'center' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(22)
         .text('ආධාර ලදුපත', 0, 150, { align: 'center' });
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#f43f3f')
         .text('Sinhala font unavailable', 0, 150, { align: 'center' });
    }

    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text(`Receipt Number: ${villager.Villager_ID}-${allowance.Allowances_ID}`, 0, 190, { align: 'center' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`ලදුපත් අංකය: ${villager.Villager_ID}-${allowance.Allowances_ID}`, 0, 210, { align: 'center' });
    }

    doc.font('Roboto').fontSize(16).fillColor('#921940')
       .text('Issued To:', 40, 250, { underline: true });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(16)
         .text('නිකුත් කරන ලද්දේ:', 40, 270, { underline: true });
    }

    const address = villager.Address && !villager.Address.includes('@') ? villager.Address : 'Not Provided';
    if (sinhalaFontAvailable) {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Name: ${villager.Full_Name || 'N/A'}`, 40, 300)
         .text(`Villager ID: ${villager.Villager_ID || 'N/A'}`, 40, 320)
         .text(`Address: ${address}`, 40, 340);
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`නම: ${villager.Full_Name || 'N/A'}`, 300, 300)
         .text(`ගම්වාසී හැඳුනුම්පත: ${villager.Villager_ID || 'N/A'}`, 300, 320)
         .text(`ලිපිනය: ${address}`, 300, 340);
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Name: ${villager.Full_Name || 'N/A'}`, 40, 300)
         .text(`Villager ID: ${villager.Villager_ID || 'N/A'}`, 40, 320)
         .text(`Address: ${address}`, 40, 340);
    }

    doc.font('Roboto').fontSize(16).fillColor('#921940')
       .text('Allowance Details:', 40, 380, { underline: true });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(16)
         .text('ආධාර විස්තර:', 40, 400, { underline: true });
    }

    const formattedApplyDate = applyDate ? new Date(applyDate).toISOString().split('T')[0] : 'N/A';
    const confirmationDate = new Date().toISOString().split('T')[0];
    if (sinhalaFontAvailable) {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Allowance Type: ${allowance.Allowances_Type || 'N/A'}`, 40, 430)
         .text(`Allowance ID: ${allowance.Allowances_ID || 'N/A'}`, 40, 450)
         .text(`Application Date: ${formattedApplyDate}`, 40, 470)
         .text(`Confirmation Date: ${confirmationDate}`, 40, 490);
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`ආධාර වර්ගය: ${allowance.Allowances_Type || 'N/A'}`, 300, 430)
         .text(`ආධාර හැඳුනුම්පත: ${allowance.Allowances_ID || 'N/A'}`, 300, 450)
         .text(`අයදුම් දිනය: ${formattedApplyDate}`, 300, 470)
         .text(`තහවුරු කළ දිනය: ${confirmationDate}`, 300, 490);
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Allowance Type: ${allowance.Allowances_Type || 'N/A'}`, 40, 430)
         .text(`Allowance ID: ${allowance.Allowances_ID || 'N/A'}`, 40, 450)
         .text(`Application Date: ${formattedApplyDate}`, 40, 470)
         .text(`Confirmation Date: ${confirmationDate}`, 40, 490);
    }

    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text('This receipt confirms that the above-named individual has been approved for the specified allowance.', 40, 530, { width: 515, align: 'justify' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text('මෙම ලදුපත ඉහත නම් කරන ලද පුද්ගලයා නිශ්චිත ආධාරය සඳහා අනුමත කර ඇති බව තහවුරු කරයි.', 40, 560, { width: 515, align: 'justify' });
    }

    doc.font('Roboto').fontSize(12)
       .text('Issued by: Village Authority', 40, 620)
       .text(`Date: ${confirmationDate}`, 40, 640);
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text('නිකුත් කළේ: ගම්මාන අධිකාරිය', 300, 620)
         .text(`දිනය: ${confirmationDate}`, 300, 640);
    }

    doc.lineWidth(1).strokeColor('#D4A017')
       .moveTo(40, 780).lineTo(555, 780).stroke();

    doc.end();

    stream.on('finish', () => resolve(receiptFileName));
    stream.on('error', (err) => reject(err));
  });
};

const getAllowanceApplications = async (req, res) => {
  try {
    const applications = await AllowanceApplication.getAllAllowanceApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllowanceApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getConfirmedAllowanceApplications = async (req, res) => {
  try {
    const applications = await AllowanceApplication.getConfirmedAllowanceApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getConfirmedAllowanceApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getAllowanceApplicationsByVillagerId = async (req, res) => {
  try {
    const { villagerId } = req.params;
    const applications = await AllowanceApplication.getAllowanceApplicationsByVillagerId(villagerId);
    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: `No allowance applications found for Villager ID ${villagerId}` });
    }
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllowanceApplicationsByVillagerId:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateAllowanceApplicationStatus = async (req, res) => {
  try {
    const { villagerId, allowancesId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Pending", "Send", "Rejected", "Confirm"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await AllowanceApplication.updateAllowanceApplicationStatus(villagerId, allowancesId, status);
    if (!updated) {
      return res.status(404).json({ error: "Allowance application not found" });
    }

    let receiptFileName = null;
    if (status === "Confirm") {
      const application = await AllowanceApplication.getAllowanceApplicationByIds(villagerId, allowancesId);
      if (application) {
        const villager = await AllowanceApplication.getVillagerById(villagerId);
        const allowance = await AllowanceApplication.getAllowanceById(allowancesId);
        receiptFileName = await generateAllowanceReceipt(villager, allowance, application.apply_date);
        await AllowanceApplication.updateReceiptPath(villagerId, allowancesId, receiptFileName);
      }
    }

    res.json({
      message: "Allowance application status updated successfully",
      receipt: receiptFileName ? { filename: receiptFileName } : null
    });
  } catch (error) {
    console.error("Error in updateAllowanceApplicationStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = await AllowanceApplication.getFilePath(filename);
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

const getVillagerById = async (req, res) => {
  try {
    const { villagerId } = req.params;
    const villager = await AllowanceApplication.getVillagerById(villagerId);
    if (!villager) {
      return res.status(404).json({ error: `Villager ID ${villagerId} not found` });
    }
    res.json(villager);
  } catch (error) {
    console.error("Error in getVillagerById:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createAllowanceApplication,
  getAllowanceApplications,
  getConfirmedAllowanceApplications,
  getAllowanceApplicationsByVillagerId,
  updateAllowanceApplicationStatus,
  downloadDocument,
  getVillagerById,
};