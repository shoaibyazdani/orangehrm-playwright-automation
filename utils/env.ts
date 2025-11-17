/**
 * Environment Variable Manager
 * 
 * Centralized management of environment variables with defaults
 * and type safety for configuration values.
 */

export class EnvManager {
  private static instance: EnvManager;

  private constructor() {}

  public static getInstance(): EnvManager {
    if (!EnvManager.instance) {
      EnvManager.instance = new EnvManager();
    }
    return EnvManager.instance;
  }

  /**
   * Get environment variable with optional default value
   */
  public get(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
      throw new Error(`Environment variable ${key} is not set and no default provided`);
    }
    return value;
  }

  /**
   * Get environment variable as boolean
   */
  public getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Get environment variable as number
   */
  public getNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (!value) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Environment variable ${key} is not set and no default provided`);
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new Error(`Environment variable ${key} is not a valid number`);
    }
    return num;
  }

  /**
   * Get base URL for OrangeHRM
   */
  public getBaseUrl(): string {
    return this.get('BASE_URL', 'https://opensource-demo.orangehrmlive.com/');
  }

  /**
   * Get default credentials
   */
  public getDefaultUsername(): string {
    return this.get('DEFAULT_USERNAME', 'Admin');
  }

  public getDefaultPassword(): string {
    return this.get('DEFAULT_PASSWORD', 'admin123');
  }

  /**
   * Check if running in CI environment
   */
  public isCI(): boolean {
    return this.getBoolean('CI', false);
  }

  /**
   * Check if running in headless mode
   */
  public isHeadless(): boolean {
    return this.getBoolean('HEADLESS', true);
  }
}

export const env = EnvManager.getInstance();

