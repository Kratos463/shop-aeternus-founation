const crypto = require('crypto');
const DB_NAME = "shopaterno"

function generateVoucherCode() {
    const randomBytes = crypto.randomBytes(3); 
    const uniqueNumber = parseInt(randomBytes.toString('hex'), 16).toString()
    return `PROMO${uniqueNumber}`;
}

module.exports = {DB_NAME, generateVoucherCode}