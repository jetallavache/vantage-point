import DOMPurify from "dompurify";
import * as he from "he";

const purifyConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  FORBID_TAGS: ["style", "script", "iframe", "frame", "object", "embed"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
};

export const sanitizeText = (input: string): string => {
  if (!input) return input;

  const decoded = he.decode(input);
  const purified = DOMPurify.sanitize(decoded, purifyConfig) as string;

  return purified
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/expression\(/gi, "")
    .trim();
};

export const hasSuspiciousContent = (input: string): boolean => {
  if (!input) return false;

  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /data:/i,
    /vbscript:/i,
    /expression\(/i,
    /alert\(/i,
    /confirm\(/i,
    /prompt\(/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
    /cookie/i,
    /localstorage/i,
    /sessionstorage/i,
    /<\?xml/i,
    /<!entity/i,
    /<!\[cdata\[/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
};
