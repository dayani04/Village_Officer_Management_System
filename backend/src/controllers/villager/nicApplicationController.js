const NICApplication = require("../../models/villager/nicApplicationModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const createNICApplication = async (req, res) => {
  try {
    const { email, nicType } = req.body;
    const file = req.file;

    if (!email || !nicType) {
      return res.status(400).json({ error: "Email and NIC type are required" });
    }

    if (file) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
      }
    }

    const villager = await NICApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    const nic = await NICApplication.getNICByType(nicType);
    if (!nic) {
      return res.status(404).json({ error: "NIC type not found" });
    }

    let documentPath = null;
    if (file) {
      const fileName = `${villager.Villager_ID}_${nic.NIC_ID}_${Date.now()}${path.extname(file.originalname)}`;
      const uploadDir = path.join(__dirname, "../../../Uploads");
      documentPath = fileName;

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);
    }

    const applyDate = new Date().toISOString().split("T")[0];
    await NICApplication.addNICApplication(
      villager.Villager_ID,
      nic.NIC_ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "NIC application submitted successfully" });
  } catch (error) {
    console.error("Error in createNICApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const generateNICReceipt = async (villager, nic, applyDate) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const timestamp = Date.now();
  const receiptFileName = `${villager.Villager_ID}_${nic.NIC_ID}_receipt_${timestamp}.pdf`;
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
        console.warn(`Font not found: ${robotoPath}. Using Helvetica`);
        doc.registerFont('Roboto', 'Helvetica');
      }
      if (fs.existsSync(notoSinhalaPath)) {
        doc.registerFont('NotoSansSinhala', notoSinhalaPath);
        sinhalaFontAvailable = true;
      } else {
        console.warn(`Font not found: ${notoSinhalaPath}. Using Helvetica`);
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
       .text('NIC Application Receipt', 0, 120, { align: 'center' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(22)
         .text('ජාතික හැඳුනුම්පත් ලදුපත', 0, 150, { align: 'center' });
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#f43f3f')
         .text('Sinhala font unavailable', 0, 150, { align: 'center' });
    }

    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text(`Receipt Number: ${villager.Villager_ID}-${nic.NIC_ID}`, 0, 190, { align: 'center' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`ලදුපත් අංකය: ${villager.Villager_ID}-${nic.NIC_ID}`, 0, 210, { align: 'center' });
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
       .text('NIC Application Details:', 40, 380, { underline: true });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(16)
         .text('ජාතික හැඳුනුම්පත් ඉල්ලුම් විස්තර:', 40, 400, { underline: true });
    }

    const formattedApplyDate = applyDate ? new Date(applyDate).toISOString().split('T')[0] : 'N/A';
    const confirmationDate = new Date().toISOString().split('T')[0];
    if (sinhalaFontAvailable) {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`NIC Type: ${nic.NIC_Type || 'N/A'}`, 40, 430)
         .text(`NIC ID: ${nic.NIC_ID || 'N/A'}`, 40, 450)
         .text(`Application Date: ${formattedApplyDate}`, 40, 470)
         .text(`Confirmation Date: ${confirmationDate}`, 40, 490);
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`හැඳුනුම්පත් වර්ගය: ${nic.NIC_Type || 'N/A'}`, 300, 430)
         .text(`හැ඾ුනුම්පත් අංකය: ${nic.NIC_ID || 'N/A'}`, 300, 450)
         .text(`අයදුම් දිනය: ${formattedApplyDate}`, 300, 470)
         .text(`තහවුරු කළ දිනය: ${confirmationDate}`, 300, 490);
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`NIC Type: ${nic.NIC_Type || 'N/A'}`, 40, 430)
         .text(`NIC ID: ${nic.NIC_ID || 'N/A'}`, 40, 450)
         .text(`Application Date: ${formattedApplyDate}`, 40, 470)
         .text(`Confirmation Date: ${confirmationDate}`, 40, 490);
    }

    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text('This receipt confirms that the person named above has been approved for the specific National Identity Card application. Please take this receipt with you when contacting the Attorney Generals Department for further action.', 40, 530, { width: 515, align: 'justify' });
    if (sinhalaFontAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text('ඉහත නම් කර ඇති පුද්ගලයා නිශ්චිත ජාතික හැඳුනුම්පත් අයදුම්පත සඳහා අනුමත කර ඇති බව මෙම රිසිට්පත මගින් තහවුරු කෙරේ. වැඩිදුර ක්‍රියාමාර්ග සඳහා නීතිපති දෙපාර්තමේන්තුව අමතන්නේ නම් කරුණාකර මෙම රිසිට්පත ඔබ සමඟ රැගෙන යන්න.', 40, 560, { width: 515, align: 'justify' });
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

const getAllNICApplications = async (req, res) => {
  try {
    const applications = await NICApplication.getAllNICApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllNICApplications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getConfirmedNICApplications = async (req, res) => {
  try {
    const applications = await NICApplication.getConfirmedNICApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getConfirmedNICApplications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateNICApplicationStatus = async (req, res) => {
  try {
    const { villagerId, nicId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Send", "Rejected", "Confirm"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await NICApplication.updateNICApplicationStatus(villagerId, nicId, status);
    if (!updated) {
      return res.status(404).json({ error: "NIC application not found" });
    }

    let receiptFileName = null;
    if (status === "Confirm") {
      const application = await NICApplication.getNICApplicationByIds(villagerId, nicId);
      if (application) {
        const villager = await NICApplication.getVillagerById(villagerId);
        const nic = await NICApplication.getNICById(nicId);
        receiptFileName = await generateNICReceipt(villager, nic, application.apply_date);
        await NICApplication.updateReceiptPath(villagerId, nicId, receiptFileName);
      }
    }

    res.json({
      message: "Status updated successfully",
      receipt: receiptFileName ? { filename: receiptFileName } : null
    });
  } catch (error) {
    console.error("Error in updateNICApplicationStatus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = await NICApplication.getFilePath(filename);
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
  createNICApplication,
  getAllNICApplications,
  getConfirmedNICApplications,
  updateNICApplicationStatus,
  downloadDocument,
};