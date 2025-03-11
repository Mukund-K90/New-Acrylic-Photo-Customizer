const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { CONFIG } = require('./src/config/config');
const PORT = CONFIG.port;
const multer = require('multer');
const upload = multer();
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
const cors = require('cors');
const { connectDb } = require('./src/config/db');
const { removeBg } = require('./src/utils/removeBg');

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();

app.set("view engine", 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
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
        console.log(req.body);

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

app.get('/home', (req, res) => {
    res.send('Hello World!')
})


//Routes
app.use('/user', require('./src/Routes/UserRoutes'));
app.use('/cart', require('./src/Routes/CartRoutes'));
app.use('/billing', require('./src/Routes/BilligRoutes'));

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));