// passwordUtils.js
const bcrypt = require('bcrypt'); // ❌ Do NOT require both 'bcrypt' and 'bcryptjs'. Choose one — here we use 'bcrypt'
const SALT_ROUNDS = 10;

class PasswordUtils {
    static async hashPassword(password) {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    static async comparePassword(inputPassword, storedHash) {
        // return await bcrypt.compare(inputPassword, storedHash);
        
    }
}

module.exports = PasswordUtils;
