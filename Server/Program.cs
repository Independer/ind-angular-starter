using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace IndependerStarter.Server {
  public class Program {
    public static void Main(string[] args) {
      var host = new WebHostBuilder()
          .CaptureStartupErrors(true)
          .UseKestrel()
          .UseContentRoot(Directory.GetCurrentDirectory())
          .UseIISIntegration()
          .UseStartup<Startup>()
          .Build();

      host.Run();
    }
  }
}
