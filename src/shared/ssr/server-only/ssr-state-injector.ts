import { Injectable, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { SsrState } from '../ssr-state';
import { PlatformState } from '@angular/platform-server';
import { SSR_STATE_KEY } from '../ssr-state-key.constant';

/**
 * When executed on the server-side during pre-rendering injects a special <script> section with the serialized state of the
 * application that will be deserialized and loaded by the app running in the browser.
 * This technique is commonly used to transfer the results of API calls executed on the server-side, so that the client
 * doesn't have to execute the same calls again when the app is loaded in the browser.
 */
@Injectable()
export class SsrStateInjector {
  constructor(private state: PlatformState, private rendererFactory: RendererFactory2, private ssrState: SsrState) {
  }

  inject() {
    try {
      const document: any = this.state.getDocument();
      const ssrStateString = JSON.stringify(this.ssrState.toJson());
      const renderer = this.rendererFactory.createRenderer(document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const body = document.body;

      const script = renderer.createElement('script');
      renderer.setValue(script, `window['${SSR_STATE_KEY}'] = ${ssrStateString}`);
      renderer.appendChild(body, script);
    }
    catch (e) {
      console.log(`Failed to append ${SSR_STATE_KEY} to body`);
      console.error(e);
    }
  }
}
