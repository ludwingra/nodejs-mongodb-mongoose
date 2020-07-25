const express = require('express');
const mongoose = require("mongoose");
const { CourseModel, VideoModel } = require("./models");
const bodyParser = require('body-parser');

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect("mongodb://localhost/mongoose-course", () => {
    console.log("Connected to mongoDB")
});

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.get("/cursos", async (req, res) => {
    try {
        const Course = mongoose.model('Course');
        // Like, con options: i -> es insencible a mayusc y minusc
        let rpt;
        let filter = {};
        let include = null;
        let orderBy = {};
        if (req.query && req.query.propiedad) {
            let propiedad = req.query.propiedad;
            let val = req.query.val;
            filter = {
                [propiedad]: {
                    $regex: val,
                    $options: "i"
                }
            };
        }

        if (req.query && req.query.include) {
            include = req.query.include.split(',');
        }

        if (req.query && req.query.noinclude) {
            arreglo = req.query.noinclude.split(',');
            include = [];
            arreglo.map(a => {
                let i = '-' + a;
                include.push(i);
            });

        }

        let valor = '';
        if (req.query && req.query.orderBy) {
            let v = '';
            for (let data of req.query.orderBy) {
                let typeOrder = data.split(",")[0];
                let type = typeOrder == 'desc' ? '-' : '+';
                let val = data.split(",")[1];
                v = v.concat(type, val, ' ');
                valor = v;
            }
        }

        let pagination = null;
        let cant = 0;
        if (req.query && req.query.page) {
            let page = parseInt(req.query.page);
            let perPage = parseInt(req.query.limit) || 10;
            pagination = {
                limit: perPage,
                skip: page * perPage,
            }
            // contar registro  s con filtro
            cant = await Course.countDocuments(filter);

        }

        rpt = await Course.find(filter, include, pagination).sort(valor);
        res.status(200).json({
            data: rpt,
            total: cant,
            pagination
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

app.get("/cursos/:id", async (req, res) => {
    try {
        const Course = mongoose.model('Course');
        let rpt = await Course.findById(req.params.id).select('title -_id');
        res.status(200).json(rpt);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }


});

app.post("/cursos", async (req, res) => {
    try {
        const Course = mongoose.model('Course');

        let rpt = await Course.create(req.body);

        res.status(201).json(rpt);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

app.put("/cursos/:id", async (req, res) => {
    try {
        const Course = mongoose.model('Course');

        // 1. Actualizar multiples: de 0 a n

        // Course.update({ numberOfTopics: 0 }, { publishedAt: new Date() }, { multi: true });

        // 2. Actualizar un registro
        let body = req.body;
        let rpt = await Course.findByIdAndUpdate(req.params.id, body);

        // 3. Encontrar el documento y luego guardarlo

        res.status(201).json(rpt);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

app.delete("/cursos/:id", async (req, res) => {
    try {
        const Course = mongoose.model('Course');
        let rpt = await Course.findByIdAndDelete(req.params.id);
        res.status(200).json(rpt);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// Crear un nuevo video
app.post("/video", async (req, res) => {
    try {
        const Video = mongoose.model("Video");
        const Course = mongoose.model("Course");
        let video = await Video.create(req.body);
        let course = await Course.findById(req.body.course);
        course.videos.push(video.id);
        let response = await course.save();

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(400).json(
            { message: error.message }
        )
    }
})

app.listen(8000, () => console.log("Listening on port 8000"))