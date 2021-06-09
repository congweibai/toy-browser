const net = require("net");

class Request {
  //method, url = host + port + path
  //body: k/v
  //headers
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.path = options.path || "/";
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}\r\n`)
      .join("")}\r\n${this.bodyText}`;
  }

  open(method, url) {}
  send(connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on("data", (data) => {
        resolve(data.toString());
        connection.end();
      });
      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
    });
  }
}

class Response {}

// const client = net.createConnection({ port: 7110, host: "127.0.0.1" }, () => {
//   console.log("connected to server!");
//   // client.write("POST / HTTP/1.1\r\n");
//   // client.write("Host: 127.0.0.1\r\n");
//   // client.write("Content-Length: 11\r\n");
//   // client.write("Content-Type: application/x-www-form-urlencoded\r\n");
//   // client.write("\r\n");
//   // client.write("name=wyatt");

void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "7110",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "wyatt",
    },
  });
  let response = await request.send();
  console.log(response);
})();
//   console.log(request.toString());
//   client.write(request.toString());
// });

// client.on("data", (data) => {
//   console.log(data.toString());
//   client.end();
// });

// client.on("end", () => {
//   console.log("disconnected from server");
// });

// client.on("error", (err) => {
//   console.log(err);
//   client.end();
// });
