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

let requestSequence = 0;

export function createRequestId(): string {
  requestSequence += 1;
  return `weather-${Date.now().toString(36)}-${requestSequence.toString(36)}`;
}

export function recordTelemetry(event: TelemetryEvent): void {
  console.info('[weather-telemetry]', event);
}
