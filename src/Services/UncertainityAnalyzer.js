import { logprobToPercentage } from "../helperFunction.js";

/**
 * INTELLIGENT LOGGER
 * Logs results and compares Internal vs Expressed confidence.
 * @param {object} firstTokenData - The logprobs object for the top token.
 * @param {string} question - The prompt text.
 * @param {string} imageId - Identifier for the image.
 * @param {object} meta - Metadata containing model name and temperature.
 * @param {string} fullText - The full text response (e.g., "Yes 95%")
 */
export function analyzeUncertainty(
  firstTokenData,
  question,
  imageId,
  meta,
  fullText,
) {
  const topToken = firstTokenData;
  const topProb = logprobToPercentage(topToken.logprob);

  // Get the Runner-up
  const runnerUp = topToken.top_logprobs?.[1];
  const runnerUpProb = runnerUp ? logprobToPercentage(runnerUp.logprob) : 0;

  // Confidence Gap
  const confidenceGap = topProb - runnerUpProb;
  const isAmbiguous = confidenceGap < 60 || topProb < 85;

  // Extract Expressed Confidence from text (e.g. "95%" from "Yes 95%")
  const expressedMatch = fullText?.match(/(\d+)%/);
  const expressedProb = expressedMatch ? `${expressedMatch[1]}%` : "N/A";

  if (isAmbiguous) {
    const logHeader = isAmbiguous
      ? `\n🔴 [AMBIGUITY DETECTED] Image: ${imageId}`
      : `\n🟢 [CLEAR PREDICTION]   Image: ${imageId}`;

    console.log(logHeader);
    console.log(`   Question:      "${question}"`);
    console.log(
      `   Config:        Model=[${meta.model}] | Temp=[${meta.temperature}]`,
    );

    // THE COMPARISON
    console.log(`   Full Response: "${fullText}"`);
    console.log(
      `   -----------------------------------------------------------`,
    );
    console.log(`   INTERNAL CONFIDENCE (LogProb):  ${topProb.toFixed(1)}%`);
    console.log(`   EXPRESSED CONFIDENCE (Text):    ${expressedProb}`);
    console.log(
      `   -----------------------------------------------------------`,
    );

    console.log(
      `   Runner Up:      "${runnerUp?.token}" (${runnerUpProb.toFixed(1)}%)`,
    );
    console.log(`   Gap:            ${confidenceGap.toFixed(1)}%`);
    console.log(`\n   Detailed Distribution:`);
    topToken.top_logprobs.forEach((t, i) => {
      const p = logprobToPercentage(t.logprob);
      const bar = "█".repeat(Math.round(p / 5));
      console.log(
        `   ${i + 1}. [${t.token.padEnd(15)}] : ${p.toFixed(2)}% ${bar}`,
      );
    });
    console.log(
      "---------------------------------------------------------------\n",
    );
  }
}
