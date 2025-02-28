const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;
const multer = require('multer');
const upload = multer();
const dotenv = require('dotenv');
dotenv.config();
const key = process.env.RBG_KEY || "M8mXZ4i6yPodao2fBhhr5gdF";
const nodemailer = require('nodemailer');
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.set("view engine", 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.use(bodyParser.json({ limit: "10mb" }));

async function removeBg(imageBlob, backgroundUrl) {
    const formData = new URLSearchParams();
    formData.append("size", "auto");
    formData.append("image_file_b64", imageBlob);
    backgroundUrl ? formData.append("bg_image_url", backgroundUrl) : null;

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": key },
        body: formData,
    });

    if (response.ok) {
        return await response.arrayBuffer();
    } else {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${response.statusText} - ${errorText}`);
    }
}

app.post('/change-bg', async (req, res) => {
    try {
        const { imageBlob, backgroundUrl } = req.body;

        if (!imageBlob) {
            throw new Error('No image blob provided');
        }

        const rbgResultData = await removeBg(imageBlob, backgroundUrl);

        res.send({
            success: true,
            rbgResultData: Buffer.from(rbgResultData),
        });
    } catch (error) {
        console.error('Error in /change-bg:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

//send email
app.post('/send-email', upload.single('image'), async (req, res) => {
    try {
        const subject = req.body.subject;
        const details = req.body.details ? JSON.parse(req.body.details) : {};

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        const mailOptions = {
            to: 'koladiyamukund58@gmail.com',
            subject: subject,
            text: `image details:\n\n${JSON.stringify(details, null, 2)}`,
            attachments: [{
                filename: req.file.originalname,
                content: req.file.buffer
            }]
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'File Shared Successully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));





