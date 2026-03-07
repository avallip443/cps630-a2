const mongoose = require('mongoose');

const VALID_FILE_TYPES = ['project-plan', 'meeting-notes', 'bug-report'];

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    fileType: {
        type: String,
        required: true,
        trim: true,
        enum: VALID_FILE_TYPES
    },
    icon: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    colour: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const File = mongoose.model('file', FileSchema);

module.exports = File;
module.exports.VALID_FILE_TYPES = VALID_FILE_TYPES;
