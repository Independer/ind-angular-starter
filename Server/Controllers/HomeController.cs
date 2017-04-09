using Microsoft.AspNetCore.Mvc;

namespace IndAngularStarter.Server.Controllers {
  public class HomeController : Controller {
    public HomeController() {
    }

    public IActionResult Index() {
      return View();
    }
  }
}
