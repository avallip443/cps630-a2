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



/* READ ITEM */

/* READ MULTIPLE ITEMS */

/* UPDATE ITEM */
/* FILE NAME */
app.patch('/api/files/:name', async (req, res) => {
    const { name } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ error: "Missing required field: newName" });
    }

    // if we want every file to have diff name
    const existing = await File.findOne({ name: newName });

    if (existing) {
        return res.status(409).json({ error: "File name already exists" });
    }

    const updated = await File.findOneAndUpdate(
            { name: name },
            { name: newName },
            { new: true, runValidators: true }
    );

    if (!updated) {
        return res.status(404).json({ error: "File Not Found" });
    }
    
    return res.status(200).json(updated); 
});

/* FILE CONTENT */
app.patch('/api/file-data/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { fileData } = req.body;

    if (fileData === undefined) {
        return res.status(400).json({ error: "Missing required field: fileData" });
    }

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return res.status(400).json({ error: "Invalid fileId" });
    }

    const updated = await FileData.findOneAndUpdate(
            { fileId },
            { fileData },
            { new: true, runValidators: true }
        );

    if (!updated) {
        return res.status(404).json({ error: "File Data Not Found" });
    }
    
    return res.status(200).json(updated); 
});


/* DELETE ITEM */
app.delete('/api/files/:fileId', async (req, res) => {
    const { fileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return res.status(400).json({ error: "Invalid Field" });
    }
    const file = await File.findByIdAndDelete(fileId);

    if (!file) {
        return res.status(404).json({ error: "File Not Found" });
    }
    await FileData.deleteMany({ fileId });
    
    return res.status(200).json({ message: "File Deleted" }); 
});


//starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });