import { InjectionToken } from '@angular/core';
import { LocationInfo } from './location-info';

export const LOCATION = new InjectionToken<LocationInfo>('LOCATION');
