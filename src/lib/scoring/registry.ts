import type { ScoringEngine } from './contract';
import { sumEngine } from './engines/sum';

const registry = new Map<string, ScoringEngine>();

registry.set(sumEngine.id, sumEngine);

export function getEngine(engineId: string): ScoringEngine | undefined {
  return registry.get(engineId);
}

export function registerEngine(engine: ScoringEngine): void {
  registry.set(engine.id, engine);
}

export { registry };
