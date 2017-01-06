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
            return View();
        }
    }
}
