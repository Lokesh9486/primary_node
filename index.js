const http = require("http");
const fs = require("fs");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const template = fs.readFileSync(`${__dirname}/index.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/card.html`, "utf-8");

const dataObj = JSON.parse(data);
const replaceTemplate = (temp, data) => {
  let output = temp.replace(/{%IMAGE%}/g, data.ThumbnailImage);
  output = output.replace(/{%NUMBER%}/g, data.number);
  output = output.replace(/{%NAME%}/g, data.name);
  const ability = data.abilities.map((item) => item).join("");
  output = output.replace(/{%ABILITIES%}/g, ability);

  return output;
};

const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const output = dataObj.map((item) => replaceTemplate(templateCard, item)).join("");
    const templateHtml = template.replace("{%DATA%}", output);
    res.end(templateHtml);
  }
  if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  res.end("Hello  world from server");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listen to request on port 8000");
});
