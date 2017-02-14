using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace IndependerStarter.Server.Controllers {
  [Route("api/[controller]")]
  public class TestController : Controller {
    private static string[] Names = new[] {
      "Kim	Shelton",
      "Nina	Wong",
      "Santos	Santos",
      "Eric	Stanley",
      "Brendan	Mann",
      "Cindy	Hubbard",
      "Tasha	Bowman",
      "Joe	Coleman",
      "Edith	Wilkerson",
      "Steven	Kim"
    };

    [HttpGet("[action]")]
    public IEnumerable<SampleData> Users() {
      var random = new Random();
      return Enumerable.Range(1, 5).Select(index => new SampleData
      {
        ID = random.Next(0, 2000),
        Name = Names[random.Next(Names.Length)]
      });
    }

    public class SampleData {
      public int ID { get; set; }
      public string Name { get; set; }
    }
  }
}
