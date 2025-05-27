const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    file: {
        data: Buffer,
        contentType: String,
        filename: String
    },
    audio: {
        data: Buffer,
        contentType: String,
        filename: String
    },
    video: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Tab', tabSchema);