const crypto = require('crypto');
const DB_NAME = "shopaterno"

function generateVoucherCode() {
    const randomBytes = crypto.randomBytes(3);
    const hexString = randomBytes.toString('hex');
    const hexPart = hexString.slice(0, 9).toUpperCase();
    const alphanumericPart = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `SA${hexPart}${alphanumericPart}`;
}

module.exports = {DB_NAME, generateVoucherCode}