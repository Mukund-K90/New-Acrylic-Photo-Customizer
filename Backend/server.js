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
const fs = require("fs");
const PDFDocument = require("pdfkit");
const pdf = require("html-pdf"); // Import html-pdf
const generateInvoiceHTML = require('./src/helper/InvoiceTemplete');

app.use(cors());
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

// API to Generate & Download Invoice
app.post("/download-invoice", async (req, res) => {
    try {
        const { order, paymentDetails } = req.body;

        if (!order || !order.products || !Array.isArray(order.products)) {
            return res.status(400).json({ error: "Invalid order data" });
        }

        const htmlContent = generateInvoiceHTML(order, paymentDetails);
        const pdfPath = path.join(__dirname, `invoice-${order.orderNo}.pdf`);
        const options = {
            format: "A4", // Ensures full A4 size
            orientation: "portrait", // Portrait mode
            border: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
            zoomFactor: 1.4, // Enlarges content to fill page
        };

        pdf.create(htmlContent, options).toFile(pdfPath, (err, result) => {
            if (err) {
                console.error("Error generating PDF:", err);
                return res.status(500).json({ error: "Failed to generate invoice" });
            }

            res.download(result.filename, `invoice-${order.orderNo}.pdf`, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    res.status(500).json({ error: "Failed to download invoice" });
                }
                fs.unlinkSync(pdfPath); // Delete file after sending
            });
        });

    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ error: "Failed to generate invoice" });
    }
});

//Routes
app.use('/user', require('./src/Routes/UserRoutes'));
app.use('/cart', require('./src/Routes/CartRoutes'));
app.use('/billing', require('./src/Routes/BilligRoutes'));
app.use('/order', require('./src/Routes/orderRoutes'));

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));