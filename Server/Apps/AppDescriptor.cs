namespace IndAngularStarter.Server.Apps {
  public class AppDescriptor {
    public AppDescriptor(string id, string baseUrl) {
      Id = id;
      BaseUrl = baseUrl;
    }

    public string Id { get; }
    public string BaseUrl { get; }
  }
}
