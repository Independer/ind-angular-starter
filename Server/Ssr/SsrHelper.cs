using System.Threading.Tasks;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace IndAngularStarter.Server.Ssr {
  public class SsrHelper {
    public static async Task<SsrResult> RenderAsync(HttpRequest request, SsrOptions options) {
      var nodeServices = request.HttpContext.RequestServices.GetRequiredService<INodeServices>();
      var hostEnv = request.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();
      var logger = request.HttpContext.RequestServices.GetRequiredService<ILogger<SsrHelper>>();


      var applicationBasePath = hostEnv.WebRootPath;
      var requestFeature = request.HttpContext.Features.Get<IHttpRequestFeature>();
      var unencodedPathAndQuery = requestFeature.RawTarget;
      var unencodedAbsoluteUrl = $"{request.Scheme}://{request.Host}{unencodedPathAndQuery}";

      try {
        var prerenderResult = await Prerenderer.RenderToString(
          "/",
          nodeServices,
          new JavaScriptModuleExport(hostEnv.WebRootPath + "/" + options.JsBundlePath),
          unencodedAbsoluteUrl,
          unencodedPathAndQuery,
          null,
          30000,
          request.PathBase.ToString()
        );

        var result = new SsrResult(
          prerenderResult.Html, // our <app> from Angular
          prerenderResult.Globals["title"].ToString(),
          prerenderResult.Globals["styles"].ToString(),
          prerenderResult.Globals["meta"].ToString(),
          prerenderResult.Globals["links"].ToString()
        );

        return result;
      }
      catch (Exception ex) {
        logger.LogError(new EventId(0, name: "ssr"), ex, "Server-side rendering failed.");

        return null;
      }
    }
  }
}
