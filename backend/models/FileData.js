const mongoose = require('mongoose');

const FileDataSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
        required: true
    },
    fileType: {
        type: String,
        required: true,
        trim: true
    },
    fileData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

const FileData = mongoose.model('filedata', FileDataSchema);

module.exports = FileData;
