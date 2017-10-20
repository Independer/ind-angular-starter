using IndAngularStarter.Server.Ssr;

namespace IndAngularStarter.Server.Apps {
  public class AppPageViewModel {
    public AppPageViewModel(string mainBundleUrl, string baseUrl, SsrResult ssrResult) {
      MainBundleUrl = mainBundleUrl;
      BaseUrl = baseUrl;
      SsrResult = ssrResult;
    }

    public string MainBundleUrl { get; }
    public string BaseUrl { get; }
    public SsrResult SsrResult { get; }
  }
}
