import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const AUTH_TAG_LEN = 16;

function getKey(): Buffer {
    const b64 = process.env.PAYMENT_ENCRYPTION_KEY?.trim();
    if (!b64) {
        throw new Error(
            'PAYMENT_ENCRYPTION_KEY is not set. Generate a 32-byte key and base64-encode it, e.g. `openssl rand -base64 32`.',
        );
    }
    const key = Buffer.from(b64, 'base64');
    if (key.length !== 32) {
        throw new Error('PAYMENT_ENCRYPTION_KEY must decode to exactly 32 bytes (AES-256).');
    }
    return key;
}

/** Encrypt JSON payment payload for storage (UPI / bank details). */
export function encryptPaymentPayload(payload: Record<string, unknown>): string {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LEN);
    const cipher = crypto.createCipheriv(ALGO, key, iv, { authTagLength: AUTH_TAG_LEN });
    const json = JSON.stringify(payload);
    const enc = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptPaymentPayload(blob: string): Record<string, unknown> {
    const key = getKey();
    const raw = Buffer.from(blob, 'base64');
    const iv = raw.subarray(0, IV_LEN);
    const tag = raw.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN);
    const data = raw.subarray(IV_LEN + AUTH_TAG_LEN);
    const decipher = crypto.createDecipheriv(ALGO, key, iv, { authTagLength: AUTH_TAG_LEN });
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
    return JSON.parse(plain) as Record<string, unknown>;
}
