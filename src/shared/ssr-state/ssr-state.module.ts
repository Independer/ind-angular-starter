import { NgModule } from '@angular/core';
import { SsrStateInjector } from './ssr-state-injector';
import { SsrState } from './ssr-state';
import { SSR_STATE_KEY } from './constants';

@NgModule({
  providers: [
  ]
})
export class SsrStateModule {
  static forServer() {
    return {
      ngModule: SsrStateModule,
      providers: [
        SsrState,
        SsrStateInjector
      ]
    };
  }

  static forBrowser() {
    return {
      ngModule: SsrStateModule,
      providers: [
        {
          provide: SsrState,
          useFactory: getSsrState
        }
      ]
    };
  }
}

export function getSsrState(): SsrState {
  const ssrState = new SsrState();
  ssrState.initialize((window as any)[SSR_STATE_KEY] || {});
  return ssrState;
}
