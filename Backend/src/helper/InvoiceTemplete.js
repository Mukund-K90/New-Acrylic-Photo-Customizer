const generateInvoiceHTML = (order, paymentDetails) => {
    return `
    <html>
    <head>
        <title>Tax Invoice</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 14px; }
            .container { border: 1px solid #ddd; padding: 20px; width: 800px; margin: auto; }
            .header { display: flex; align-items: center; justify-content: space-between; }
            .header h1 { color: #ff9900; font-size: 24px; }
            .section-title { font-weight: bold; margin-top: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f4f4f4; }
            .total { font-weight: bold; }
            .amount-words { font-style: italic; margin-top: 10px; }
            .footer { text-align: right; margin-top: 20px; }
            .signature { margin-top: 30px; text-align: right; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>amazon.in</h1>
                <h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
            </div>
            
            <p><strong>Sold By:</strong> R K WorldInfocom Pvt Ltd</p>
            <p>Renaissance Industrial Smart City, Kalyan Sape Road, Thane, Maharashtra, 421302</p>
            <p><strong>PAN No:</strong> AAECR0564M | <strong>GST Registration No:</strong> 27AAECR0564M1Z3</p>
            
            <div class="section-title">Billing Address</div>
            <p><strong>${order.firstname} ${order.lastname}</strong></p>
            <p>${order.street_address}, ${order.city}, ${order.zipcode}, IN</p>

            <div class="section-title">Shipping Address</div>
            <p><strong>${order.firstname} ${order.lastname}</strong></p>
            <p>${order.street_address}, ${order.city}, ${order.zipcode}, IN</p>

            <div class="section-title">Order Details</div>
            <p><strong>Order Number:</strong> ${order.orderNo} | <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Invoice Number:</strong> BOM-${Math.floor(Math.random() * 900000) + 100000}</p>

            <table>
                <tr>
                    <th>SL No</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Net Amount</th>
                    <th>Tax Type</th>
                    <th>Tax Amount</th>
                    <th>Total</th>
                </tr>
                ${order.products
                    .map(
                        (item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.productId.name} (${item.productId.size})</td>
                            <td>₹${item.productId.price}</td>
                            <td>₹0.00</td>
                            <td>₹${item.productId.price}</td>
                            <td>0% GST</td>
                            <td>₹${(item.productId.price).toFixed(2)}</td>
                            <td>₹${(item.productId.price).toFixed(2)}</td>
                        </tr>
                        `
                    )
                    .join("")}
            </table>

            <p class="total">Total Amount: ₹${(order.total * 1.18).toFixed(2)}</p>
            <p class="amount-words">Amount in Words: <strong>${convertToWords(order.total * 1.18)}</strong></p>

            <div class="footer">
                <p><strong>Payment Mode:</strong> ${paymentDetails.items[0].method.toUpperCase()}</p>
                <p><strong>Transaction ID:</strong> ${paymentDetails.items[0].id}</p>
            </div>

            <div class="signature">Authorized Signatory</div>
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
