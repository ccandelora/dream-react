export function formatDreamText(text: string): string {
  // Only format the text when submitting, not during input
  let formatted = text;

  // Capitalize first letter of sentences
  formatted = formatted.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => 
    p1 + p2.toUpperCase()
  );

  // Add period at the end if missing
  if (!/[.!?]$/.test(formatted)) {
    formatted += '.';
  }

  return formatted;
}