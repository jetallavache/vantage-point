// Коды ошибок валидации
export const ValidationErrorCodes = {
  // Общие ошибки (001-099)
  REQUIRED: "001",
  SUSPICIOUS_CONTENT: "002",
  INVALID_FORMAT: "003",

  // Ошибки длины/диапазона (100-199)
  TOO_SHORT: "100",
  TOO_LONG: "101",
  OUT_OF_RANGE: "102",

  // Ошибки формата (200-299)
  INVALID_EMAIL: "200",
  INVALID_URL: "201",
  INVALID_PATTERN: "202",
  DIGITS_ONLY: "203",
  LETTERS_ONLY: "204",

  // Ошибки выбора (300-399)
  NO_SELECTION: "300",
  INVALID_SELECTION: "301",
  MIN_SELECTION: "302",
} as const;

// Генератор сообщений с кодами ошибок
export const errorMsg = (message: string, code: string): string => {
  return `${message} (${code})`;
};
