const generateInvoiceHTML = (order, paymentDetails) => {
    return `
    <html>
<head>
    <title>Tax Invoice</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            font-size: 14px; 
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
            border-bottom: 2px solid #ffa500; 
            padding-bottom: 10px;
        }
        .header h1 { 
            color: #ffa500; 
            font-size: 26px;
        }
        .title { 
            text-align: center; 
            font-weight: bold; 
            font-size: 18px; 
            margin: 10px 0;
        }
        .section { 
            margin-bottom: 15px; 
        }
        .section-title { 
            font-weight: bold; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 5px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
            font-size: 14px;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
        }
        th { 
            background-color: #f4f4f4;
        }
        .total { 
            font-weight: bold; 
            text-align: right;
        }
        .amount-words { 
            font-style: italic; 
            font-weight: bold; 
            margin-top: 10px;
        }
        .footer { 
            margin-top: 30px; 
            text-align: right; 
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>amazon.in</h1>
            <div>
                <p><strong>Tax Invoice / Bill of Supply / Cash Memo</strong></p>
            </div>
        </div>

        <div class="section">
            <p><strong>Sold By:</strong> R K WorldInfocom Pvt Ltd</p>
            <p>Renaissance Industrial Smart City, Kalyan Sape Road, Thane, Maharashtra, 421302</p>
            <p><strong>PAN No:</strong> AAECR0564M | <strong>GST No:</strong> 27AAECR0564M1Z3</p>
        </div>

        <div class="section">
            <div class="section-title">Billing Address</div>
            <p><strong>${order.firstname} ${order.lastname}</strong></p>
            <p>${order.street_address}, ${order.city}, ${order.zipcode}, IN</p>
        </div>

        <div class="section">
            <div class="section-title">Shipping Address</div>
            <p><strong>${order.firstname} ${order.lastname}</strong></p>
            <p>${order.street_address}, ${order.city}, ${order.zipcode}, IN</p>
        </div>

        <div class="section">
            <div class="section-title">Order Details</div>
            <p><strong>Order Number:</strong> ${order.orderNo} | <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Invoice Number:</strong> BOM-${Math.floor(Math.random() * 900000) + 100000}</p>
        </div>

        <table>
            <tr>
                <th>SL No</th>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Unit Price</th>
                <th>Discount</th>
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
                        <td>${item.productId.name} (${item.productId.size})</td>
                        <td>N/A</td>
                        <td>₹${item.productId.price}</td>
                        <td>₹0.00</td>
                        <td>₹${item.productId.price}</td>
                        <td>18%</td>
                        <td>₹${(item.productId.price * 0.18).toFixed(2)}</td>
                        <td>₹${(item.productId.price * 1.18).toFixed(2)}</td>
                    </tr>
                    `
                )
                .join("")}
        </table>

        <p class="total">Total Amount: ₹${(order.total * 1.18).toFixed(2)}</p>
        <p class="amount-words">Amount in Words: <strong>${convertToWords(order.total * 1.18)}</strong></p>

        <div class="section">
            <p><strong>Payment Mode:</strong> ${paymentDetails.items[0].method.toUpperCase()}</p>
            <p><strong>Transaction ID:</strong> ${paymentDetails.items[0].id}</p>
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
    const teens = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const numString = num.toFixed(2).split(".");
    let word = "";

    const getWords = (n) => {
        if (n < 10) return ones[n];
        else if (n < 20) return teens[n - 10];
        else return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    };

    if (num >= 1000) {
        word += ones[Math.floor(num / 1000)] + " Thousand ";
        num %= 1000;
    }
    if (num >= 100) {
        word += ones[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
    }
    if (num > 0) {
        word += getWords(num);
    }

    return word.trim() + " Rupees Only";
};

module.exports = generateInvoiceHTML;
