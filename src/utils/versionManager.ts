export class VersionManager {
  private static instance: VersionManager;
  /**
   * version list:
   *   xhis-opd-frontend
   *   widgets
   *
   * @type {Map<string, string>}
   * @memberof VersionManager
   */
  using: Map<string, string>;
  latest: Map<string, string>;

  constructor() {
    this.using = new Map();
    this.latest = new Map();
  }

  setUsingVersion(name: string, version: string): void {
    this.using.set(name, version);
  }

  setLatestVersion(name: string, version: string): void {
    this.latest.set(name, version);
  }

  hasMismatch(): boolean {
    for (const [name, version] of this.using.entries()) {
      const latestVersion = this.latest.get(name);

      console.log('version', name, version, latestVersion);

      if (typeof latestVersion === 'string' && latestVersion !== version) {
        return true;
      }
    }

    return false;
  }

  static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }

    return VersionManager.instance;
  }
}
