import { InjectionToken } from '@angular/core';

export const ssrDataToken = new InjectionToken<SsrData>('SSR_DATA');

// When modifying this interface, please make sure to make the same changes in SsrData class on the server
export interface SsrData {
  baseUrl: string;
}

export class NotImplementedSsrData implements SsrData {
  public static readonly instance = new NotImplementedSsrData();

  get baseUrl(): string {
    throw new Error('Not implemented');
  }
}
