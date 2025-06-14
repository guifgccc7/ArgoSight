
import { DataSource } from './types';

export class DataSourceManager {
  private dataSources: Map<string, DataSource> = new Map();

  constructor() {
    this.initializeDataSources();
  }

  private initializeDataSources(): void {
    const sources: DataSource[] = [
      {
        id: 'aisstream',
        name: 'AISStream Live Feed',
        type: 'ais',
        status: 'active',
        reliability: 0.95,
        lastUpdate: new Date().toISOString(),
        latency: 150
      },
      {
        id: 'openweather',
        name: 'OpenWeather Marine',
        type: 'weather',
        status: 'active',
        reliability: 0.88,
        lastUpdate: new Date().toISOString(),
        latency: 300
      }
    ];

    sources.forEach(source => {
      this.dataSources.set(source.id, source);
    });
  }

  getDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  getDataSource(id: string): DataSource | undefined {
    return this.dataSources.get(id);
  }

  updateDataSourceStatus(id: string, status: DataSource['status']): void {
    const source = this.dataSources.get(id);
    if (source) {
      source.status = status;
      source.lastUpdate = new Date().toISOString();
    }
  }

  updateAllSourcesStatus(): void {
    for (const [id, source] of this.dataSources) {
      source.lastUpdate = new Date().toISOString();
      source.status = 'active';
    }
  }
}
