const net = require("net");

class Request {}

class Response {}

const client = net.createConnection({ port: 7110, host: "127.0.0.1" }, () => {
  console.log("connected to server!");
  client.write("POST / HTTP/1.1\r\n");
  client.write("Host: 127.0.0.1\r\n");
  client.write("Content-Length: 11\r\n");
  client.write("Content-Type: application/x-www-form-urlencoded\r\n");
  client.write("\r\n");
  client.write("name=wyatt");
});

client.on("data", (data) => {
  console.log(data.toString());
  client.end();
});

client.on("end", () => {
  console.log("disconnected from server");
});

client.on("error", (err) => {
  console.log(err);
  client.end();
});
