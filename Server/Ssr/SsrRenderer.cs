using System.Threading.Tasks;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.AspNetCore.Mvc;

namespace IndAngularStarter.Server.Ssr {
  public class SsrRenderer {
    private const int PrerenderTimeoutMilliseconds = 30000;

    public static async Task<SsrResult> RenderAsync(HttpRequest request, string jsBundlePath, string moduleName, string appBaseUrl, SsrData data) {
      // Based on https://github.com/MarkPieszak/aspnetcore-angular2-universal/blob/04273f64e122fa5648f4d21fab76da30163eedfd/Server/Controllers/HomeController.cs

      var nodeServices = request.HttpContext.RequestServices.GetRequiredService<INodeServices>();
      var hostEnv = request.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();
      var logger = request.HttpContext.RequestServices.GetRequiredService<ILogger<SsrRenderer>>();

      var applicationBasePath = hostEnv.WebRootPath;
      var requestFeature = request.HttpContext.Features.Get<IHttpRequestFeature>();
      var unencodedPathAndQuery = requestFeature.RawTarget;
      var unencodedAbsoluteUrl = $"{request.Scheme}://{request.Host}{unencodedPathAndQuery}";

      var appPath = $"{request.PathBase}{appBaseUrl}";
      var appRelativeUrl = unencodedPathAndQuery.StartsWith(appPath) ? unencodedPathAndQuery.Substring(appPath.Length) : unencodedPathAndQuery;

      logger.LogDebug($"[SSR] request.PathBase: {request.PathBase}; requestFeature.RawTarget: {requestFeature.RawTarget}, unencodedAbsoluteUrl: {unencodedAbsoluteUrl}, appBaseUrl: {appBaseUrl}, appPath: {appPath}, appRelativeUrl: {appRelativeUrl}");

      try {
        var prerenderResult = await Prerenderer.RenderToString(
          "/",
          nodeServices,
          new JavaScriptModuleExport(hostEnv.WebRootPath + "/" + jsBundlePath) { ExportName = moduleName },
          unencodedAbsoluteUrl,
          appRelativeUrl,
          data,
          PrerenderTimeoutMilliseconds,
          appBaseUrl
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
