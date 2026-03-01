const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
});

const File = mongoose.model('file', FileSchema);

module.exports = File;