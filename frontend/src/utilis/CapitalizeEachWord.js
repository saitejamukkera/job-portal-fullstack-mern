function capitalizeEachWord(sentence) {
  if (typeof sentence !== "string" || sentence.length === 0) {
    return ""; // Handle empty or non-string inputs
  }

  // Use a regular expression to split by one or more spaces, underscores, OR hyphens.
  // /[ _-]+/g finds every occurrence of one or more of these delimiters.
  const words = sentence.split(/[ _-]+/g);

  // Map over each word to capitalize its first letter
  const capitalizedWords = words.map((word) => {
    // Ensure the rest of the word is lowercased for proper Title Case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the capitalized words back into a sentence using a single space
  return capitalizedWords.join(" ");
}

function capitalizeEachWordPreservingDelimiters(sentence) {
  if (typeof sentence !== "string" || sentence.length === 0) {
    return "";
  }

  // Optional: convert entire string to lowercase first for consistent casing
  // If you omit this line, input like "aPPLE_pie" becomes "APPLE_Pie"
  sentence = sentence.toLowerCase();

  // The regex /(^|[ _-])\S/g matches:
  // 1. ( |[ _-]) : The start of the string OR a space/underscore/hyphen (captured in a group)
  // 2. \S        : The non-whitespace character immediately following that boundary
  // The global flag 'g' ensures all matches are found.
  return sentence.replace(/(^|[ _-])\S/g, (match) => {
    // 'match' here is the entire sequence found by the regex (e.g., " a", "_p", "-p", or "^a")

    // The replacement function capitalizes the relevant character:
    return match.toUpperCase();
  });
}

export { capitalizeEachWord, capitalizeEachWordPreservingDelimiters };
