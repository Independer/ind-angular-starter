using IndependerStarter.Server.Configuration;
using IndependerStarter.Server.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace IndependerStarter.Server.Controllers {
  public class HomeController : Controller {
    private readonly IHostingEnvironment env;
    private readonly IOptionsSnapshot<ServerRenderingOptions> serverRenderingOptionsAccessor;

    public HomeController(IHostingEnvironment env, IOptionsSnapshot<ServerRenderingOptions> serverRenderingOptionsAccessor) {
      this.env = env;
      this.serverRenderingOptionsAccessor = serverRenderingOptionsAccessor;
    }

    public IActionResult Index() {
      var vm = new IndexViewModel();

      if (serverRenderingOptionsAccessor.Value.IsEnabled) {
        var serverRenderingModuleFile = env.WebRootFileProvider.GetFileInfo("/serverdist/main-server.js");

        vm.IsServerRenderingEnabled = serverRenderingModuleFile.Exists;
        vm.ServerRenderingModulePath = "wwwroot/serverdist/main-server";
      }

      return View(vm);
    }
  }
}
