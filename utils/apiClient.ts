/**
 * API Client Utility
 * 
 * Wrapper around Playwright's APIRequestContext for API testing
 * Provides convenient methods for common HTTP operations
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger';
import { env } from './env';

export class ApiClient {
  private requestContext: APIRequestContext;
  private baseURL: string;

  constructor(requestContext: APIRequestContext, baseURL?: string) {
    this.requestContext = requestContext;
    this.baseURL = baseURL || env.getBaseUrl();
  }

  /**
   * Make GET request
   */
  async get(
    endpoint: string,
    options?: { headers?: Record<string, string>; params?: Record<string, string> }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint, options?.params);
    logger.info(`API GET: ${url}`);
    
    try {
      const response = await this.requestContext.get(url, {
        headers: options?.headers,
      });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API GET failed: ${url}`, error);
      throw error;
    }
  }

  /**
   * Make POST request
   */
  async post(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    logger.info(`API POST: ${url}`);
    
    try {
      const response = await this.requestContext.post(url, {
        data,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API POST failed: ${url}`, error);
      throw error;
    }
  }

  /**
   * Make PUT request
   */
  async put(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    logger.info(`API PUT: ${url}`);
    
    try {
      const response = await this.requestContext.put(url, {
        data,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API PUT failed: ${url}`, error);
      throw error;
    }
  }

  /**
   * Make DELETE request
   */
  async delete(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    const url = this.buildUrl(endpoint);
    logger.info(`API DELETE: ${url}`);
    
    try {
      const response = await this.requestContext.delete(url, {
        headers: options?.headers,
      });
      logger.info(`API Response Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`API DELETE failed: ${url}`, error);
      throw error;
    }
  }

  /**
   * Build full URL from endpoint and query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    
    return url;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    // This can be used to set default headers for authenticated requests
    logger.info('Auth token set for API client');
  }

  /**
   * Get response as JSON
   */
  async getJson<T>(response: APIResponse): Promise<T> {
    try {
      return await response.json() as T;
    } catch (error) {
      logger.error('Failed to parse response as JSON', error);
      throw error;
    }
  }

  /**
   * Verify response status
   */
  async verifyStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();
    if (actualStatus !== expectedStatus) {
      const body = await response.text();
      throw new Error(
        `Expected status ${expectedStatus}, got ${actualStatus}. Response: ${body}`
      );
    }
  }
}

