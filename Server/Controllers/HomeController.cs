using System.Threading.Tasks;
using IndAngularStarter.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using IndAngularStarter.Server.Ssr;

namespace IndAngularStarter.Server.Controllers {
  public class HomeController : Controller {
    private readonly IHostingEnvironment env;
    private readonly IOptionsSnapshot<SsrOptions> ssrOptionsAccessor;

    public HomeController(IHostingEnvironment env, IOptionsSnapshot<SsrOptions> ssrOptionsAccessor) {
      this.env = env;
      this.ssrOptionsAccessor = ssrOptionsAccessor;
    }

    public async Task<IActionResult> Index() {
      SsrResult ssrResult = null;

      if (ssrOptionsAccessor.Value.IsEnabled) {
        var serverRenderingModuleFile = env.WebRootFileProvider.GetFileInfo(ssrOptionsAccessor.Value.JsBundlePath);

        if (serverRenderingModuleFile.Exists) {
          ssrResult = await SsrHelper.RenderAsync(Request, ssrOptionsAccessor.Value);
        }
      }

      var model = new SpaModel(ssrResult);

      return View(model);
    }
  }
}
