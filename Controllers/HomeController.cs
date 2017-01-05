using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace IndependerStarter.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHostingEnvironment env;

        public HomeController(IHostingEnvironment env)
        {
            this.env = env;
        }

        public IActionResult Index()
        {
            ViewBag.HashedMain = GetHashedBundle("main");
            ViewBag.HashedPolifills = GetHashedBundle("polyfills");

            return View();
        }

        public string GetHashedBundle(string name)
        {
            var basePath = env.WebRootPath + "//dist//";
            var info = new System.IO.DirectoryInfo(basePath);
            var file = info.GetFiles().FirstOrDefault(f => f.Name.StartsWith(name + ".") && !f.Name.EndsWith("bundle.map"));

            return file.Name;
        }

    }
}
