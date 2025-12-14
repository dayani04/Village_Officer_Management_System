const ElectionApplication = require("../../models/villager/electionApplicationModel");
const ElectionNotification = require("../../models/villager/electionNotificationModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { addWeeks, format } = require("date-fns");
const { registerFonts } = require("../../utills/registerFonts");

const createElectionApplication = async (req, res) => {
  try {
    const { email, electionType } = req.body;
    const file = req.file;

    if (!email || !electionType) {
      return res.status(400).json({ error: "Email and election type are required" });
    }

    if (file) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
      }
    }

    const villager = await ElectionApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    const election = await ElectionApplication.getElectionByType(electionType);
    if (!election) {
      return res.status(404).json({ error: "Election type not found" });
    }

    const notification = await ElectionNotification.getNotificationByElectionId(election.ID);
    if (!notification) {
      return res.status(400).json({ error: "No active notification for this election type" });
    }

    const existingApplication = await ElectionApplication.getElectionApplicationByIds(villager.Villager_ID, election.ID);
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this election" });
    }

    let documentPath = null;
    if (file) {
      const fileName = `${villager.Villager_ID}_${election.ID}_${Date.now()}${path.extname(file.originalname)}`;
      const uploadDir = path.join(__dirname, "../../../Uploads");
      documentPath = fileName;

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);
    }

    const applyDate = new Date().toISOString().split("T")[0];
    await ElectionApplication.addElectionApplication(
      villager.Villager_ID,
      election.ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "Election application submitted successfully" });
  } catch (error) {
    console.error("Error in createElectionApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getElectionApplications = async (req, res) => {
  try {
    const applications = await ElectionApplication.getAllElectionApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getElectionApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getConfirmedElectionApplications = async (req, res) => {
  try {
    const applications = await ElectionApplication.getConfirmedElectionApplications();
    console.log("Fetched confirmed applications:", applications);
    res.json(applications);
  } catch (error) {
    console.error("Error in getConfirmedElectionApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const generateElectionReceipt = async (villager, election, applyDate, electionDate) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const timestamp = Date.now();
  const receiptFileName = `${villager.Villager_ID}_${election.ID}_receipt_${timestamp}.pdf`;
  const receiptPath = path.join(__dirname, "../../../Uploads", receiptFileName);

  const getVotingPlace = (address) => {
    console.log("Processing address for voting place:", address);
    if (!address || address.includes('@')) {
      console.log("Address invalid or contains '@':", address);
      return 'Not Provided';
    }
    const lowerAddress = address.toLowerCase().trim();
    if (lowerAddress.includes('hiyare east')) {
      return 'Galle Hiyare East Junior College';
    } else if (lowerAddress.includes('welihena')) {
      return 'Sri Rahula Temple, Welihena, Galle';
    } else if (lowerAddress.includes('kadurugashena')) {
      return 'Sri Subadhraramaya, Kadurugahena, Galle';
    }
    console.log("No matching voting place for address:", address);
    return 'Not Assigned';
  };

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(receiptPath);
    doc.pipe(stream);

    const { sinhalaAvailable, sinhalaFontAvailable, robotoPath, notoSinhalaPath } = registerFonts(doc);
    console.log('registerFonts result:', { sinhalaAvailable, sinhalaFontAvailable, robotoPath, notoSinhalaPath });
    const baseDir = path.join(__dirname, '../../../');

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
       .text('Election Receipt', 0, 120, { align: 'center' });
    if (sinhalaAvailable) {
      doc.font('NotoSansSinhala').fontSize(22)
         .text('ඡන්ද ලදුපත', 0, 150, { align: 'center' });
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#f43f3f')
         .text('Sinhala font unavailable', 0, 150, { align: 'center' });
    }

    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text(`Receipt Number: ${villager.Villager_ID}-${election.ID}`, 0, 190, { align: 'center' });
    if (sinhalaAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`ලදුපත් අංකය: ${villager.Villager_ID}-${election.ID}`, 0, 210, { align: 'center' });
    }

    doc.font('Roboto').fontSize(16).fillColor('#921940')
       .text('Issued To:', 40, 250, { underline: true });
    if (sinhalaAvailable) {
      doc.font('NotoSansSinhala').fontSize(16)
         .text('නිකුත් කරන ලද්දේ:', 40, 270, { underline: true });
    }

    const address = villager.Address && !villager.Address.includes('@') ? villager.Address : 'Not Provided';
    const votingPlace = getVotingPlace(address);
    if (sinhalaAvailable) {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Name: ${villager.Full_Name || 'N/A'}`, 40, 300)
         .text(`Villager ID: ${villager.Villager_ID || 'N/A'}`, 40, 320)
         .text(`Address: ${address}`, 40, 340)
         .text(`Voting Place: ${votingPlace}`, 40, 360);
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`නම: ${villager.Full_Name || 'N/A'}`, 300, 300)
         .text(`ගම්වාසී හැඳුනුම්පත: ${villager.Villager_ID || 'N/A'}`, 300, 320)
         .text(`ලිපිනය: ${address}`, 300, 340)
         .text(`ඡන්ද පොළ: ${votingPlace}`, 300, 360);
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Name: ${villager.Full_Name || 'N/A'}`, 40, 300)
         .text(`Villager ID: ${villager.Villager_ID || 'N/A'}`, 40, 320)
         .text(`Address: ${address}`, 40, 340)
         .text(`Voting Place: ${votingPlace}`, 40, 360);
    }

    doc.font('Roboto').fontSize(16).fillColor('#921940')
       .text('Election Details:', 40, 400, { underline: true });
    if (sinhalaAvailable) {
      doc.font('NotoSansSinhala').fontSize(16)
         .text('ඡන්ද විස්තර:', 40, 420, { underline: true });
    }

    const formattedApplyDate = applyDate ? new Date(applyDate).toISOString().split('T')[0] : 'N/A';
    const formattedElectionDate = electionDate ? format(new Date(electionDate), 'yyyy-MM-dd') : 'N/A';
    if (sinhalaAvailable) {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Election Type: ${election.Type || 'N/A'}`, 40, 450)
         .text(`Election ID: ${election.ID || 'N/A'}`, 40, 470)
         .text(`Issue Date: ${formattedApplyDate}`, 40, 490)
         .text(`Election Date: ${formattedElectionDate}`, 40, 510);
      doc.font('NotoSansSinhala').fontSize(12)
         .text(`ඡන්ද වර්ගය: ${election.Type || 'N/A'}`, 300, 450)
         .text(`ඡන්ද හැඳුනුම්පත: ${election.ID || 'N/A'}`, 300, 470)
         .text(`නිකුත් කළ දිනය: ${formattedApplyDate}`, 300, 490)
         .text(`ඡන්ද දිනය: ${formattedElectionDate}`, 300, 510);
    } else {
      doc.font('Roboto').fontSize(12).fillColor('#333')
         .text(`Election Type: ${election.Type || 'N/A'}`, 40, 450)
         .text(`Election ID: ${election.ID || 'N/A'}`, 40, 470)
         .text(`Issue Date: ${formattedApplyDate}`, 40, 490)
         .text(`Election Date: ${formattedElectionDate}`, 40, 510);
    }

    doc.font('Roboto').fontSize(12).fillColor('#333')
       .text('This receipt confirms that the above-named individual has been registered for the specified election.', 40, 550, { width: 515, align: 'justify' });
    if (sinhalaAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text('මෙම ලදුපත ඉහත නම් කරන ලද පුද්ගලයා නිශ්චිත ඡන්දය සඳහා ලියාපදිංචි කර ඇති බව තහවුරු කරයි.', 40, 580, { width: 515, align: 'justify' });
    }

    doc.font('Roboto').fontSize(12)
       .text('Issued by: Village Authority', 40, 640)
       .text(`Date: ${new Date().toISOString().split('T')[0]}`, 40, 660);
    if (sinhalaAvailable) {
      doc.font('NotoSansSinhala').fontSize(12)
         .text('නිකුත් කළේ: ගම්මාන අධිකාරිය', 300, 640)
         .text(`දිනය: ${new Date().toISOString().split('T')[0]}`, 300, 660);
    }

    doc.lineWidth(1).strokeColor('#D4A017')
       .moveTo(40, 780).lineTo(555, 780).stroke();

    doc.end();

    stream.on('finish', () => resolve(receiptFileName));
    stream.on('error', (err) => reject(err));
  });
};

const updateElectionApplicationStatus = async (req, res) => {
  try {
    const { villagerId, electionrecodeID } = req.params;
    const { status } = req.body;

    console.log("Received update request:", {
      villagerId,
      electionrecodeID,
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

    const updated = await ElectionApplication.updateElectionApplicationStatus(villagerId, electionrecodeID, status);
    if (!updated) {
      return res.status(404).json({ error: "Election application not found" });
    }

    let receiptFileName = null;
    let votingPlace = null;
    let electionDate = null;
    if (status === "Confirm") {
      const application = await ElectionApplication.getElectionApplicationByIds(villagerId, electionrecodeID);
      if (application) {
        const villager = await ElectionApplication.getVillagerById(villagerId);
        const election = await ElectionApplication.getElectionById(electionrecodeID);
        const address = villager.Address && !villager.Address.includes('@') ? villager.Address.trim() : '';
        console.log("Villager address for voting place:", address);
        if (address.toLowerCase().includes('hiyare east')) {
          votingPlace = 'Galle Hiyare East Junior College';
        } else if (address.toLowerCase().includes('welihena')) {
          votingPlace = 'Sri Rahula Temple, Welihena, Galle';
        } else if (address.toLowerCase().includes('kadurugashena')) {
          votingPlace = 'Sri Subadhraramaya, Kadurugahena, Galle';
        } else {
          votingPlace = 'Not Assigned';
          console.log("No matching voting place for address:", address);
        }
        const issueDate = new Date(application.apply_date);
        electionDate = addWeeks(issueDate, 6);
        receiptFileName = await generateElectionReceipt(villager, election, application.apply_date, electionDate);
        await ElectionApplication.updateReceiptPath(villagerId, electionrecodeID, receiptFileName, votingPlace, electionDate);
      }
    }

    res.json({
      message: "Election application status updated successfully",
      receipt: receiptFileName ? { filename: receiptFileName, votingPlace, electionDate: electionDate ? format(electionDate, 'yyyy-MM-dd') : null } : null
    });
  } catch (error) {
    console.error("Error in updateElectionApplicationStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = await ElectionApplication.getFilePath(filename);
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
  createElectionApplication,
  getElectionApplications,
  getConfirmedElectionApplications,
  updateElectionApplicationStatus,
  downloadDocument,
};