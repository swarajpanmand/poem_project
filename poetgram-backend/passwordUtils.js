// passwordUtils.js
const bcrypt = require('bcryptjs');

class PasswordUtils {
    // Hash password before storing
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Verify password
    static async comparePassword(inputPassword, storedHash) {
        return await bcrypt.compare(inputPassword, storedHash);
    }
}

module.exports = PasswordUtils;