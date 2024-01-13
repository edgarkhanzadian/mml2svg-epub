const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const args = process.argv.slice(2);

const filename = args[0];
const filePath = path.join(__dirname, filename);

// load mathjax
require("mathjax")
  .init({
    loader: { load: ["input/mml", "output/svg"] },
  })
  .then((MathJax) => {
    // read unzipped epub directory
    fs.readdir(filePath, (err, files) => {
      const htmlFiles = files.filter((f) => f.includes(".html"));
      // find all html files
      htmlFiles.map((html) => {
        const htmlFilePath = path.join(filePath, html);
        // read all html files
        fs.readFile(htmlFilePath, "utf8", (err, htmlText) => {
          if (err) {
            console.error(err);
            return;
          }
          // load html in cheerio
          const $ = cheerio.load(htmlText);

          // replace <math> tag with <svg>
          $("math").replaceWith((_this, content) => {
            const htmlToReplace = cheerio.load(content).html();

            const svg = MathJax.mathml2svg(htmlToReplace);
            return MathJax.startup.adaptor.outerHTML(svg);
          });

          // write updated file to that html path
          fs.writeFile(htmlFilePath, $.html(), {}, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      });
    });
  })
  .catch((err) => console.log(err.message));
