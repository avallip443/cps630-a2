const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const fs        = require('fs');
const { default: mongoose } = require('mongoose');

const File = require('./models/File');
const FileData = require('./models/FileData');
const { VALID_FILE_TYPES } = File;

const DEFAULT_TEMPLATES_PATH = path.join(__dirname, 'data', 'default-templates.json');

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

//database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/file_database`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', function(e){
    console.log('error connecting: ', e);
});

db.on('open', function() {
    console.log('database connected')
});

// Test data
const file_database = [
    { name: "Test Bug Report", fileType: "bug-report", icon: "🐞", description: "Documenting software bugs and issues", colour: "#E53935" },
    { name: "Test Meeting Notes", fileType: "meeting-notes", icon: "📝", description: "Notes from team meetings and discussions", colour: "#1E88E5" },
    { name: "Test Project Plan", fileType: "project-plan", icon: "📊", description: "Project timeline, milestones, and deliverables", colour: "#43A047" }
];

// Add test data
async function addTestFilesToMongoDB() {
    const fileCount = await File.countDocuments();

    if (fileCount == 0) {
        console.log('Adding test files to database...');

        file_database.forEach( file => {
            const newFile = new File(file);
            newFile.save()
            .then( () => console.log('File added with name ' + file.name))
            .catch(err =>  console.error('Error adding file with name ' + file.name, err)); 
        })
    }
    else {
        console.log('Files already exist...');
        return;
    }
}
addTestFilesToMongoDB();

function readDefaultTemplates() {
    try {
        const raw = fs.readFileSync(DEFAULT_TEMPLATES_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('Error reading default-templates.json:', err);
        return [];
    }
}

/* CREATE ITEM */

/* CREATE FILE ITEM */
app.post("/api/files", async (req, res) => {
    try {
        const { name, icon, description, colour, fileType } = req.body;

        if (!name || !icon || !description || !colour || !fileType) {
            return res.status(400).json({
                error: "Missing required fields: name, icon, description, colour, fileType"
            });
        }
        if (!VALID_FILE_TYPES.includes(String(fileType).trim())) {
            return res.status(400).json({
                error: "fileType must be one of: project-plan, meeting-notes, bug-report"
            });
        }

        const existing = await File.findOne({ name: name.trim() });

        if (existing) {
            return res.status(409).json({ error: "File name already exists" });
        }

        const created = await File.create({
            name: String(name).trim(),
            fileType: String(fileType).trim(),
            icon: String(icon).trim(),
            description: String(description).trim(),
            colour: String(colour).trim()
        });

        // Create one FileData for this file with the same fileType
        await FileData.create({
            fileId: created._id,
            fileType: created.fileType,
            fileData: {}
        });

        return res.status(201).json(created);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error creating file" });
    }
});

/* CREATE FILE DATA */
app.post("/api/file-data", async (req, res) => {
    try {
        const { fileId, fileType, fileData } = req.body;

        // missing required fields
        if (!fileId || !fileType || fileData === undefined) {
            return res.status(400).json({
                error: "Missing required fields: fileId, fileType, fileData"
            });
        }

        // invalid id for file 
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: "Invalid fileId" });
        }

        // associated file does not exist
        const fileExists = await File.exists({ _id: fileId });
        if (!fileExists) {
            return res.status(404).json({ error: "File not found" });
        }

        // create file data
        const created = await FileData.create({
            fileId,
            fileType: String(fileType).trim(),
            fileData: fileData || {}
        });

        return res.status(201).json(created);
    } catch (err) {
        console.error("POST /api/file-data error:", err);
        return res.status(500).json({ error: "Server error creating file data" });
    }
});

/* get fileData by fileId */
app.get("/api/file-data/:fileId", async (req, res) => {
    try {
        const { fileId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: "Invalid file ID" });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        let record = await FileData.findOne({ fileId, fileType: file.fileType });
        if (!record) {
            const fileType = file.fileType || 'project-plan';
            record = await FileData.create({
                fileId: file._id,
                fileType,
                fileData: {}
            });
        }

        res.status(200).json({
            file: { _id: file._id, name: file.name, icon: file.icon, description: file.description, colour: file.colour, fileType: file.fileType || 'project-plan' },
            fileData: record.fileData || {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching file data" });
    }
});

/* update fileData by fileId */
app.put("/api/file-data/:fileId", async (req, res) => {
    try {
        const { fileId } = req.params;
        const { fileData } = req.body;
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: "Invalid file ID" });
        }

        const file = await File.findById(fileId);
        if (!file) return res.status(404).json({ error: "File not found" });

        const updated = await FileData.findOneAndUpdate(
            { fileId, fileType: file.fileType },
            { fileData: fileData || {} },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: "File data not found" });
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating file data" });
    }
});

/* DELETE FILE + FILEDATA by fileId */
app.delete("/api/file-data/:fileId", async (req, res) => {
    try {
        const { fileId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: "Invalid file ID" });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        await FileData.deleteMany({ fileId });
        await File.findByIdAndDelete(fileId);

        return res.status(200).json({
            message: "File and file data deleted successfully"
        });
    } catch (err) {
        console.error("DELETE /api/file-data/:fileId error:", err);
        return res.status(500).json({ error: "Error deleting file and file data" });
    }
});


/* READ ITEM (one file using id) */
app.get("/api/files/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid file ID" });
        }

        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        res.status(200).json(file);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching file" });
    }
});

/* READ SINGLE FILE DATA (by FileData _id) */
app.get("/api/file-data/item/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const item = await FileData.findById(id)
            .populate("fileId");

        if (!item) {
            return res.status(404).json({ error: "File data not found" });
        }

        res.status(200).json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching file data item" });
    }
});

/* SAVE EDITS (UPDATE) */
app.put("/api/file-data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fileData } = req.body;

    const updated = await FileData.findByIdAndUpdate(
      id,
      { fileData },
      { returnDocument: 'after' }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating file" });
  }
});

app.get("/api/files", async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching files" });
    }
});

app.get("/api/templates/default", (req, res) => {
    try {
        const list = readDefaultTemplates();
        res.status(200).json(list.map((t) => ({
            name: t.name,
            type: t.type,
            icon: t.icon,
            description: t.description,
            colour: t.colour
        })));
    } catch (err) {
        console.error("Error reading default templates:", err);
        res.status(500).json({ error: "Error reading default templates" });
    }
});

// GET all user files
app.get("/api/file-data", async (req, res) => {
  try {
    const files = await FileData.find().populate("fileId");
    res.status(200).json(files);
  } catch (err) {
    console.error("Error fetching user files:", err);
    res.status(500).json({ error: "Error fetching user files" });
  }
});

//starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });
