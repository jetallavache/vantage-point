export type DomainError =
  | { kind: "validation"; fields: Record<string, string> }
  | { kind: "form"; message: string }
  | { kind: "unknown"; message: string };
