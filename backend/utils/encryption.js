import crypto from "crypto";
import { generateSalt } from "./index.js";

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY || "your-very-secret-key-32-characters"; // Should be 32 chars
const ivLength = 16;

export function encryptData(text, salt) {
    if (!text) return text;

    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.concat([Buffer.from(secretKey), Buffer.from(salt)]).slice(0, 32),
        iv
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptData(text, salt) {
    if (!text) return text;

    const [ivHex, encryptedHex] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.concat([Buffer.from(secretKey), Buffer.from(salt)]).slice(0, 32),
        iv
    );

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}