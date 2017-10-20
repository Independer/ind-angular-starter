using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;

namespace IndAngularStarter.Server.Ssr {
  public class SsrDecider {
    private const string EscapedFragment = "_escaped_fragment_";

    private readonly string[] crawlerUserAgents;
    private readonly IOptionsSnapshot<SsrOptions> ssrOptionsAccessor;
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly ILogger<SsrDecider> logger;

    public SsrDecider(IOptionsSnapshot<SsrOptions> ssrOptionsAccessor, IHttpContextAccessor httpContextAccessor, ILogger<SsrDecider> logger) {
      this.ssrOptionsAccessor = ssrOptionsAccessor;
      this.httpContextAccessor = httpContextAccessor;
      this.logger = logger;

      crawlerUserAgents = GetCrawlerUserAgents();
    }

    private string[] GetCrawlerUserAgents() {
      return new[] {
        "Googlebot",
        "Bingbot",
        "Adidxbot",
        "MSNBot",
        "BingPreview",
        "Slurp",
        "AddSearchBot",
        "Mediapartners-Google",
        "AdsBot-Google",
        "Applebot",
        "Facebot"
      };
    }

    public bool ShouldPrerender() {
      if (!ssrOptionsAccessor.Value.IsEnabled) {
        logger.LogInformation("[SSR Decider] Pre-rendering is disabled via the app settings.");
        return false;
      }

      var request =  httpContextAccessor.HttpContext?.Request;

      if (request != null) {
        if (HasEscapedFragment(request)) {
          logger.LogInformation("[SSR Decider] Pre-rendering is enabled via escaped fragment in the URL.");
          return true;
        }

        if (IsInCrawler(request)) {
          logger.LogInformation($"[SSR Decider] Pre-rendering is enabled because the user agent is a crawler ({request.Headers[HeaderNames.UserAgent]}).");
          return true;
        }
      }
      else {
        logger.LogWarning("[SSR Decider] HTTP Context is missing.");
      }

      logger.LogInformation("[SSR Decider] Pre-rendering is not needed for this request.");
      return false;
    }

    private bool HasEscapedFragment(HttpRequest request) {
      return request.QueryString.HasValue && request.QueryString.Value.Contains(EscapedFragment);
    }

    private bool IsInCrawler(HttpRequest request) {
      var userAgent = request.Headers.ContainsKey(HeaderNames.UserAgent) ? request.Headers[HeaderNames.UserAgent].ToString() : null;

      return !string.IsNullOrEmpty(userAgent) && crawlerUserAgents.Any(a => userAgent.IndexOf(a, StringComparison.OrdinalIgnoreCase) >= 0);
    }
  }
}
