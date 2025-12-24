import fs from "fs";
import path from "path";

/**
 * Converts a log probability to a linear percentage (0-100).
 * @param {number} logprob - The natural log probability from OpenAI.
 * @returns {number} The percentage.
 */
export function logprobToPercentage(logprob) {
  return Math.exp(logprob) * 100;
}

/**
 * Reads an image file and converts it to a base64 Data URL.
 * @param {string} filePath - Path to the image file.
 * @returns {string|null} The Data URL or null if error.
 */
export const createDataUrl = (filePath) => {
  try {
    // Resolve absolute path for safety
    const absolutePath = path.resolve(filePath);
    const fileData = fs.readFileSync(absolutePath);
    const base64Data = fileData.toString("base64");

    // Simple detection for jpeg/png
    const mimeType = absolutePath.match(/\.(jpeg|jpg)$/i)
      ? "image/jpeg"
      : "image/png";

    return `data:${mimeType};base64,${base64Data}`;
  } catch (e) {
    console.error(`[Error] Could not read file at ${filePath}: ${e.message}`);
    return null;
  }
};
