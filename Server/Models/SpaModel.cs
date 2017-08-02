using IndAngularStarter.Server.Ssr;

namespace IndAngularStarter.Server.Models {
  public class SpaModel {
    public SpaModel(SsrResult ssrResult = null) {
      SsrResult = ssrResult;
    }

    public SsrResult SsrResult { get; private set; }
  }
}
