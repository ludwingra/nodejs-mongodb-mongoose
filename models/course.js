const mongoose = require("mongoose");
const isEmail = require("validator").isEmail;

// 1. Definir el eschema
let CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        validate: [isEmail, 'El email es inválido'],
    },
    description: {
        type: String,
        // enum: ['Bueno', 'Malo']
        minlength: [5, 'La longitud minima es de 50 caracteres'],
        maxlength: [300, 'No se cumple con la longitu maxíma'],
        // match: // lo que definamos en una expresión regular
    },
    numberOfTopics: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    publishedAt: {
        type: Date,
        default: new Date()
    },
    // Referencia
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
})

// 2. Definir el modelo
mongoose.model('Course', CourseSchema);
