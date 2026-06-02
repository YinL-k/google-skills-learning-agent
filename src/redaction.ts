const secretPatterns: Array<[RegExp, string]> = [
  [/\bya29\.[A-Za-z0-9._-]+\b/g, "<TOKEN_REDACTED>"],
  [/\b[A-Za-z0-9._%+-]+@(?:qwiklabs|cloudskillsboost|google|gmail)\.[A-Za-z]{2,}\b/gi, "<LAB_USERNAME_REDACTED>"],
  [/\b(?:password|passwd|pwd)\s*[:=]\s*\S+/gi, "password=<LAB_PASSWORD_REDACTED>"],
  [/\b(?:token|access_token|refresh_token|secret|client_secret|api_key)\s*[:=]\s*["']?[^"'\s]+/gi, "<SECRET_REDACTED>"],
  [/\b(?:project|project_id|project-id)\s*[:=]\s*["']?[a-z][a-z0-9-]{4,28}[a-z0-9]\b/gi, "project_id=<PROJECT_ID_REDACTED>"],
  [/\b[a-z][a-z0-9-]{4,28}-[0-9]{4,8}\b/g, "<PROJECT_ID_REDACTED>"]
];

export function redactText(input: string): string {
  return secretPatterns.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), input);
}

export function redactObject<T>(value: T): T {
  return JSON.parse(redactText(JSON.stringify(value))) as T;
}

export function safeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `${url.protocol}//${url.hostname}${url.pathname}`;
    }
    return `${url.origin}${url.pathname}`;
  } catch {
    return redactText(rawUrl);
  }
}
