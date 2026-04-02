export function toSQLDatetime(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function castRow<T = Record<string, any>>(
  row: Record<string, any>,
  casts: Record<string, string>,
): T {
  const casted: Record<string, any> = { ...row };

  for (const [key, type] of Object.entries(casts)) {
    if (casted[key] === undefined || casted[key] === null) {
      continue;
    }

    if (type === "boolean") {
      casted[key] = Boolean(casted[key]);
    } else if (type === "number") {
      casted[key] = Number(casted[key]);
    } else if (type === "string") {
      casted[key] = String(casted[key]);
    } else if (type === "json") {
      try {
        casted[key] =
          typeof casted[key] === "string"
            ? JSON.parse(casted[key])
            : casted[key];
      } catch {
        casted[key] = null;
      }
    }
  }

  return casted as T;
}