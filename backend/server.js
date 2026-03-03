const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const File = require('./models/File');

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

/* CREATE TEMPLATE ITEM */
app.post("/api/templates", async (req, res) => {
    try {
        const { name, icon, description, color } = req.body;

        //Bad Request
        if (!name || !icon || !description || !color) {
            return res.status(400).json({
                error: "Missing required fields: name, icon, description, color"
            });
        }

        const existing = await TemplateItem.findOne({ name: name.trim() });

        if (existing) {
            return res.status(409).json({ error: "Template name already exists" });
        }

        const created = await TemplateItem.create({
            name: String(name).trim(),
            icon: String(icon).trim(),
            description: String(description).trim(),
            color: String(color).trim()
        });
        
        return res.status(201).json(created);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error creating template" });
    }
        
});

/* CREATE TEMPLATE DATA */
app.post("/api/template-data", async (req, res) => {
    try {
        const { templateId, templateType, templateData } = req.body;

        //Bad Request
        if (!templateId || !templateType || templateData === undefined) {
            return res.status(400).json({
                error: "Missing required fields: templateId, templateType, templateData"
            });
        }

        //Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(templateId)) {
            return res.status(400).json({ error: "Invalid templateId" });
        }

        const templateExists = await TemplateItem.exists({ _id: templateId });
        if (!templateExists) {
            return res.status(404).json({ error: "Template item not found" });
        }

        const created = await templateData.create({
            templateId,
            templateType: String(templateType).trim(),
            templateData
        });

        return res.status(201).json(created);
    } catch (err) {
        console.error("POST /api/template-data error:", err);
        return res.status(500).json({ error: "Server error creating template data" });
    }
});



/* READ ITEM */

/* READ MULTIPLE ITEMS */

/* UPDATE ITEM */

/* DELETE ITEM */

//starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });