export interface SoketiMetrics {
  connectedSockets: number | null;
  serverStatus: "ok" | "unreachable";
}

function parsePrometheusGauge(text: string, metricName: string): number | null {
  const lines = text.split("\n");
  for (const line of lines) {
    if (
      line.startsWith(metricName + " ") ||
      line.startsWith(metricName + "{")
    ) {
      const parts = line.trim().split(/\s+/);
      const last = parts.at(-1);
      if (last === undefined) continue;
      const value = Number.parseFloat(last);
      if (!Number.isNaN(value)) return value;
    }
  }
  return null;
}

export async function getSoketiMetrics(): Promise<SoketiMetrics> {
  const host = process.env.SOKETI_METRICS_HOST || "127.0.0.1";
  const port = process.env.SOKETI_METRICS_PORT || "9601";

  try {
    const response = await fetch(`http://${host}:${port}/metrics`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return { connectedSockets: null, serverStatus: "unreachable" };
    }

    const text = await response.text();
    const connectedSockets = parsePrometheusGauge(
      text,
      "soketi_connected_sockets",
    );

    return {
      connectedSockets,
      serverStatus: "ok",
    };
  } catch {
    return { connectedSockets: null, serverStatus: "unreachable" };
  }
}
