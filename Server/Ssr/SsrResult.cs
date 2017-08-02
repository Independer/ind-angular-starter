namespace IndAngularStarter.Server.Ssr {
  public class SsrResult {
    public SsrResult(string html, string title, string styles, string meta, string links) {
      Html = html;
      Title = title;
      Styles = styles;
      Meta = meta;
      Links = links;
    }

    public string Html { get; private set; }
    public string Title { get; private set; }
    public string Styles { get; private set; }
    public string Meta { get; private set; }
    public string Links { get; private set; }
  }
}
