namespace IndAngularStarter.Server.Apps {
  public class AppDescriptor {
    public AppDescriptor(string bundlePrefix, string baseUrl) {
      BundlePrefix = bundlePrefix;
      BaseUrl = baseUrl;
    }

    public string BundlePrefix { get; }
    public string BaseUrl { get; }
  }
}
