using System.Threading.Tasks;
using IndAngularStarter.Server.Ssr;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IndAngularStarter.Server.Apps {
  public class AppsController : Controller {
    private const string serverBundleUrlTemplate = "serverdist/{0}.js";
    private const string mainBundleUrlTemplate = "~/dist/{0}.js";

    private readonly IHostingEnvironment env;
    private readonly SsrDecider ssrDecider;
    private readonly ILogger<AppsController> logger;

    public AppsController(IHostingEnvironment env, SsrDecider ssrDecider, ILogger<AppsController> logger) {
      this.env = env;
      this.ssrDecider = ssrDecider;
      this.logger = logger;
    }

    [Route("first/{*ng}")]
    public async Task<IActionResult> First() {
      var model = await CreateAppModel(new AppDescriptor("first", "/first"));

      return View(model);
    }

    [Route("second/{*ng}")]
    public async Task<IActionResult> Second() {
      var model = await CreateAppModel(new AppDescriptor("second", "/second"));

      return View(model);
    }

    private async Task<AppPageViewModel> CreateAppModel(AppDescriptor app) {
      var ssrResult = await PrerenderIfNeeded(app);
      var mainBundleUrl = string.Format(mainBundleUrlTemplate, app.BundlePrefix);

      var model = new AppPageViewModel(mainBundleUrl, app.BaseUrl, ssrResult);

      return model;
    }

    private async Task<SsrResult> PrerenderIfNeeded(AppDescriptor app) {
      if (!ssrDecider.ShouldPrerender()) {
        return null;
      }

      SsrResult ssrResult = null;

      var ssrBundleUrl = string.Format(serverBundleUrlTemplate, app.BundlePrefix);
      var serverRenderingModuleFile = env.WebRootFileProvider.GetFileInfo(ssrBundleUrl);

      logger.LogInformation($"[SSR] Bundle URL: {ssrBundleUrl}. Resolved file path: {serverRenderingModuleFile.PhysicalPath}");

      if (serverRenderingModuleFile.Exists) {
        var data = new SsrData {
          baseUrl = app.BaseUrl
        };

        ssrResult = await SsrRenderer.RenderAsync(Request, ssrBundleUrl, app.BaseUrl, data);

        if (ssrResult != null) {
          logger.LogInformation("[SSR] Success");
        }
      }
      else {
        logger.LogWarning("[SSR] Pre-rendering skipped because bundle file doesn't exist.");
      }

      return ssrResult;
    }
  }
}
