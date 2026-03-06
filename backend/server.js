const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const File = require('./models/File');
const FileData = require('./models/FileData');

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

//test files
let file_database = [
  {name: "Bug Report", icon: "🐞", description: "Documenting software bugs and issues", color: "#E53935"},
  {name: "Meeting Notes", icon: "📝", description: "Notes from team meetings and discussions", color: "#1E88E5"},
  {name: "Project Plan",icon: "📊",description: "Project timeline, milestones, and deliverables",color: "#43A047"}
];

//adding test data
async function addTestFilesToMongoDB() {
    const fileCount = await File.countDocuments();

    if (fileCount == 0) {
        console.log('Adding test files to database...');

        file_database.forEach( file => {
            const newFile = new File(file);
            newFile.save()
            .then( () => console.log('File added with name ' + file.name))
            .catch(err =>  console.error('Error Adding File with Title ' + file.name)); 
        })
    }
    else {
        console.log('files already exist...');
        return;
    }
}
addTestFilesToMongoDB();

/* CREATE ITEM */

/* CREATE FILE ITEM */
app.post("/api/files", async (req, res) => {
    try {
        const { name, icon, description, colour, color } = req.body;
        const fileColor = color ?? colour;

        //Bad Request
        if (!name || !icon || !description || fileColor === undefined) {
            return res.status(400).json({
                error: "Missing required fields: name, icon, description, color (or colour)"
            });
        }

        const existing = await File.findOne({ name: name.trim() });

        if (existing) {
            return res.status(409).json({ error: "File name already exists" });
        }

        const created = await File.create({
            name: String(name).trim(),
            icon: String(icon).trim(),
            description: String(description).trim(),
            color: String(fileColor).trim()
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

        //Bad Request
        if (!fileId || !fileType || fileData === undefined) {
            return res.status(400).json({
                error: "Missing required fields: fileId, fileType, fileData"
            });
        }

        //Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: "Invalid fileId" });
        }

        const fileExists = await File.exists({ _id: fileId });
        if (!fileExists) {
            return res.status(404).json({ error: "File not found" });
        }

        const created = await FileData.create({
            fileId,
            fileType: String(fileType).trim(),
            fileData
        });

        return res.status(201).json(created);
    } catch (err) {
        console.error("POST /api/file-data error:", err);
        return res.status(500).json({ error: "Server error creating file data" });
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

/* READ MULTIPLE FILES (all files) */
app.get("/api/file-data/:fileId", async (req, res) => {
    try {
        const { fileId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: "Invalid fileId" });
        }

        const data = await FileData.find({ fileId })
            .populate("fileId"); // 👈 This pulls full file info

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching file data" });
    }
});

/* READ SINGLE FILE DATA */
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

/* DELETE ITEM */
app.delete('/api/file-data/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const deleted = await FileData.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "File Data Not Found" });
        }

        return res.status(200).json({ message: "File Deleted Successfully" });

    } catch (err) {
        console.error("DELETE /api/file-data error:", err);
        return res.status(500).json({ error: "Server error deleting file" });
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
      { new: true }
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