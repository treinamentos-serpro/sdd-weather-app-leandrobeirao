export type TelemetryCategory =
  | 'timeout'
  | 'network'
  | 'invalid-response'
  | 'rate-limit'
  | 'operation';

export interface TelemetryEvent {
  category: TelemetryCategory;
  operation: 'geocoding' | 'forecast';
  timestamp: string;
  requestId: string;
}

export type TelemetrySink = (event: TelemetryEvent) => void;

let requestSequence = 0;

export function createRequestId(): string {
  requestSequence += 1;
  return `weather-${Date.now().toString(36)}-${requestSequence.toString(36)}`;
}

const defaultTelemetrySink: TelemetrySink = (event) => {
  console.info('[weather-telemetry]', event);
};
let telemetrySink: TelemetrySink = defaultTelemetrySink;

export function recordTelemetry(event: TelemetryEvent): void {
  telemetrySink(event);
}

export function configureTelemetrySink(sink: TelemetrySink): void {
  telemetrySink = sink;
}

export function resetTelemetrySink(): void {
  telemetrySink = defaultTelemetrySink;
}
