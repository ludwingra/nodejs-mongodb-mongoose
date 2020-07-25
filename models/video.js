const mongoose = require("mongoose");

let VideoSchema = new mongoose.Schema({
    title: String,
    // Referencia
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
});

mongoose.model('Video', VideoSchema);