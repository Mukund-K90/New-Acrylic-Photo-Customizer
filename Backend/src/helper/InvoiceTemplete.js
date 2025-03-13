const generateInvoiceHTML = (order, paymentDetails) => {
    return `
    <html>
<head>
    <title>Tax Invoice</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            font-size: 18px;
            margin: 0; 
            padding: 20px;
        }
        .container { 
            width: 100%; 
            margin: auto; 
            padding: 20px; 
            border: 1px solid #ddd;
        }
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: 3px solid #ffa500; 
            padding-bottom: 10px;
        }
        .header h1 { 
            color: #ffa500; 
            font-size: 32px; 
            font-weight: bold;
        }
        .title { 
            text-align: center; 
            font-weight: bold; 
            font-size: 22px; 
            margin: 10px 0;
        }
        .section { 
            margin-bottom: 20px; 
        }
        .section-title { 
            font-weight: bold; 
            font-size: 20px; 
            border-bottom: 2px solid #ddd; 
            padding-bottom: 5px;
        }
        .address-container {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-bottom: 2rem;
        }
        .address {
            display: table-cell;
            width: 50%;
            padding: 15px;
            border: 2px solid #ddd;
            vertical-align: top;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
            font-size: 18px;
        }
        th, td { 
            border: 2px solid #ddd; 
            padding: 12px; 
            text-align: left;
        }
        th { 
            background-color: #f4f4f4;
            font-size: 20px; 
        }
        .total { 
            font-weight: bold; 
            text-align: right;
            font-size: 22px;
        }
        .amount-words { 
            font-style: italic; 
            font-weight: bold; 
            font-size: 20px; 
            margin-top: 10px;
        }
        .footer { 
            margin-top: 30px; 
            text-align: right; 
            font-weight: bold;
            font-size: 22px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Acrylic Image</h1>
            <div>
                <p style="font-size: 22px; font-weight: bold;"><strong>Tax Invoice / Bill of Supply / Cash Memo</strong></p>
            </div>
        </div>

        <div class="section">
            <p style="font-size: 20px;"><strong>Sold By:</strong> R K WorldInfocom Pvt Ltd</p>
            <p style="font-size: 18px;">Renaissance Industrial Smart City, Kalyan Sape Road, Thane, Maharashtra, 421302</p>
            <p style="font-size: 18px;"><strong>PAN No:</strong> AAECR0564M | <strong>GST No:</strong> 27AAECR0564M1Z3</p>
        </div>

        <div class="address-container">
            <div class="section address">
                <div class="section-title">Billing Address</div>
                <p><strong>${order.firstname} ${order.lastname}</strong></p>
                <p>${order.street_address}, ${order.city}, ${order.zipcode}, IN</p>
            </div>

            <div class="section address">
                <div class="section-title">Shipping Address</div>
                <p><strong>${order.firstname} ${order.lastname}</strong></p>
                <p>${order.street_address}, ${order.city}, ${order.zipcode}, IN</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Order Details</div>
            <p style="font-size: 20px;"><strong>Order Number:</strong> ${order.orderNo} | <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p style="font-size: 20px;"><strong>Invoice Number:</strong> BOM-${Math.floor(Math.random() * 900000) + 100000}</p>
        </div>

        <table>
            <tr>
                <th>Sr No.</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Net Amount</th>
                <th>Tax %</th>
                <th>Tax Amount</th>
                <th>Total</th>
            </tr>
            ${order.products
                .map(
                    (item, index) => ` 
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.productId.name}</td>
                        <td>₹${item.productId.price}</td>
                        <td>${item.productId.quantity}</td>
                        <td>₹${item.productId.subTotal}</td>
                        <td>0%</td>
                        <td>₹0</td>
                        <td>₹${(item.productId.subTotal).toFixed(2)}</td>
                    </tr>
                    `
                )
                .join("")}
        </table>

        <p class="total">Total Amount: ₹${(order.total).toFixed(2)}</p>
        <p class="amount-words">Amount in Words: <strong>${convertToWords(order.total)}</strong></p>

        <div class="section">
            <p style="font-size: 20px;"><strong>Payment Mode:</strong> ${paymentDetails.items[0].method.toUpperCase()}</p>
            <p style="font-size: 20px;"><strong>Transaction ID:</strong> ${paymentDetails.items[0].id}</p>
        </div>

        <div class="footer">Authorized Signatory</div>
    </div>
</body>
</html>
    `;
};




// Function to Convert Numbers to Words (For Amount in Words)
const convertToWords = (num) => {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    if (num === 0) return "Zero Rupees Only";

    const numString = num.toFixed(2).split(".");
    let intPart = parseInt(numString[0]);
    let decimalPart = parseInt(numString[1]);
    const getWords = (n) => {
        if (n < 10) return ones[n];
        else if (n < 20) return teens[n - 10];
        else return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    };

    let word = "";
    
    if (intPart >= 10000000) {
        word += getWords(Math.floor(intPart / 10000000)) + " Crore ";
        intPart %= 10000000;
    }
    if (intPart >= 100000) {
        word += getWords(Math.floor(intPart / 100000)) + " Lakh ";
        intPart %= 100000;
    }
    if (intPart >= 1000) {
        word += getWords(Math.floor(intPart / 1000)) + " Thousand ";
        intPart %= 1000;
    }
    if (intPart >= 100) {
        word += ones[Math.floor(intPart / 100)] + " Hundred ";
        intPart %= 100;
    }
    if (intPart > 0) {
        word += getWords(intPart);
    }

    word = word.trim() + " Rupees";

    if (decimalPart > 0) {
        word += " and " + getWords(decimalPart) + " Paise";
    }

    return word + " Only";
};


module.exports = generateInvoiceHTML;
