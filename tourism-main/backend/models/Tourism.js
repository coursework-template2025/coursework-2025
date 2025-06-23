const mongoose = require('mongoose');

const TourismSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    duration: String,
    price: String, // Можно заменить на Number, если будешь использовать цену в расчетах
    route: [String],
    includes: [String],
    region: String,
    category: String,
    image: String,
    contactPhone: String,
    contactEmail: String,
});

const Tourism = mongoose.model('Tourism', TourismSchema);

module.exports = Tourism;
