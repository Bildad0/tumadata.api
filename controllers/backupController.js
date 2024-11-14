// backupController.js
const db = require('../db');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Directory paths
const SOURCE_DIR = '/Documents/Projects/Tuma data/Core/backup';
const BACKUP_DIR = '/Documents/Projects/Tuma data/Core/backup';
const RESTORE_DIR = '/Documents/Projects/Tuma data/Core/backup';

// Helper function to copy files
const copyFiles = (src, dest) => {
  return new Promise((resolve, reject) => {
    exec(`cp -r ${src} ${dest}`, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

// Create a new backup
exports.createBackup = async (req, res) => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupName = `backup_${timestamp}`;
  const backupPath = path.join(BACKUP_DIR, backupName);
  const username = req.params;

  try {
    // Create a new directory for the backup
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    // Copy source files to backup directory
    await copyFiles(SOURCE_DIR, backupPath);

    // Save the backup metadata in the database
    db.query(`INSERT INTO backups (backup_name, backup_path, username) VALUES (${backupName}, ${backupPath}, ${username});`, (err) => {
      if (err) {
        console.error('Error saving backup metadata:', err);
        return res.status(500).json({ error: 'Failed to save backup metadata' });
      }
      res.status(201).json({ message: `Backup created: ${backupName}`, backupPath });
    });
  } catch (err) {
    console.error('Error during backup:', err);
    res.status(500).json({ error: 'Backup failed' });
  }
};

// List all backups
exports.listBackups = (req, res) => {
  const {username} = req.params;
  const query = `SELECT * FROM backups WHERE username = ? ORDER BY created_at DESC`;

  db.query(query, [username], async(err, results) => {
    if (err) {
      console.error('Error retrieving backups:', err);
      return res.status(500).json({ error: 'Failed to retrieve backups' });
    }
    res.json(results);
  });
};

// Restore a backup
exports.restoreBackup = async (req, res) => {
  const { backupName } = req.params;

  const query = `SELECT * FROM backups WHERE backup_name = ? LIMIT 1`;
  db.query(query, [backupName], async (err, results) => {
    if (err) {
      console.error('Error finding backup:', err);
      return res.status(500).json({ error: 'Failed to find backup' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    const backupPath = results[0].backup_path;
    try {
      // Copy the backup files to the restore directory
      await copyFiles(backupPath, RESTORE_DIR);
      res.json({ message: `Backup restored: ${backupName}` });
    } catch (err) {
      console.error('Error during restore:', err);
      res.status(500).json({ error: 'Restore failed' });
    }
  });
};

// backupController.js

exports.createBackupCron = async () => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupName = `backup_${timestamp}`;
    const backupPath = path.join(BACKUP_DIR, backupName);
  
    try {
      // Create a new directory for the backup
      if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath, { recursive: true });
      }
  
      // Copy source files to backup directory
      await copyFiles(SOURCE_DIR, backupPath);
  
      // Save the backup metadata in the database
      const query = `INSERT INTO backups (backup_name, backup_path) VALUES (?, ?)`;
      db.query(query, [backupName, backupPath], (err) => {
        if (err) {
          console.error('Error saving backup metadata:', err);
        }
        console.log(`Backup created: ${backupName}`);
      });
    } catch (err) {
      console.error('Error during backup:', err);
    }
  };
  