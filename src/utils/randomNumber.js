// utils/randomSixDigits.js
import crypto from 'crypto';

/**
 * Generates a secure random 6-digit number (100000–999999).
 * @returns {number} A random 6-digit integer.
 */
export function generateSixDigitCode() {
  // 900000 possible numbers starting from 100000
  const min = 100000;
  const max = 999999;
  const range = max - min + 1;

  const randomBytes = crypto.randomBytes(4);
  const randomValue = randomBytes.readUInt32BE(0);

  return min + (randomValue % range);
}
