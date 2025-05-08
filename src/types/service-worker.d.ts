interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval?: number }): Promise<void>;
}

interface ServiceWorkerRegistration {
  periodicSync: PeriodicSyncManager;
} 