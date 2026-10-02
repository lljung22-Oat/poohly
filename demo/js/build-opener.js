const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const repo = path.resolve(root, "..");
const css = fs.readFileSync(path.join(root, "css", "app.css"), "utf8");
const js = ["criteria.js", "db.js", "app.js"].map((f) =>
  fs.readFileSync(path.join(root, "js", f), "utf8")
).join("\n\n");

const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ระบบสารสนเทศเพื่อการบริหารจัดการบุคลากร</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@600;700;800&family=Sarabun:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
${css}
  </style>
</head>
<body>
  <div id="app"></div>
  <div id="toast"></div>
  <script>
${js}
  </script>
</body>
</html>
`;

const targets = [
  path.join(repo, "เปิดตรงนี้.html"),
  path.join(root, "เปิดตรงนี้.html"),
  path.join(repo, "PA", "demo", "เปิดตรงนี้.html")
];
targets.forEach((p) => fs.writeFileSync(p, html));

function copyDirFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

["css/app.css", "js/app.js", "js/criteria.js", "js/db.js", "js/criteria.test.js", "index.html", "README.md"].forEach((rel) => {
  copyDirFile(path.join(root, rel), path.join(repo, "PA", "demo", rel));
});

console.log("opener rebuilt");
