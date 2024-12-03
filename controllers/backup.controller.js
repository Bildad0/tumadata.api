// backupController.js
const { authenticateToken } = require("../Middlewares/token_verification");
const db = require("../models");
const multer = require('multer');
const Backup = db.backup;
const User = db.user;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


exports.Upload = upload.single('file'), authenticateToken, async (req, res) => {
  const { autoBackup, userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
 
  try {
 
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const backup = await Backup.create({
      filename: req.file.originalname,
      filepath: req.file.path,
      autoBackup: autoBackup === 'true',
      userId: userId,
    });

    res.status(201).json({
      message: 'Backup created successfully',
      backup,
    });
  } catch (error) {
    console.error('Error saving backup:', error);
    res.status(500).json({ error: 'Failed to save backup' });
  }
};


exports.Uploads = authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId, { include: 'backups' });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: { id: user.id, username: user.username },
      backups: user.backups,
    });
  } catch (error) {
    console.error('Error fetching backups:', error);
    res.status(500).json({ error: 'Failed to fetch backups' });
  }
};