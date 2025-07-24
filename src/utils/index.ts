export function safeJsonParse<T>(rawData: string): {
  jsonData?: T;
  error?: Error;
} {
  let jsonData: T | undefined = undefined;
  try {
    jsonData = JSON.parse(rawData);
    return { jsonData };
  } catch (err) {
    return { error: err as Error };
  }
}
