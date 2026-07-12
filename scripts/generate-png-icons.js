import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'chrome'
];

const chromePath = chromePaths.find(p => {
  try {
    if (path.isAbsolute(p)) {
      return fs.existsSync(p);
    }
    execSync(`${p} --version`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
});

const tempHtmlPath = path.join(__dirname, 'temp_icon.html');
const svgPath = path.join(__dirname, '../public/favicon.svg');

if (!fs.existsSync(svgPath)) {
  console.error("Error: SVG favicon source does not exist.");
  process.exit(1);
}

// Create temp HTML that renders the SVG in fullscreen
const tempHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${fs.readFileSync(svgPath, 'utf8')}
</body>
</html>`;

fs.writeFileSync(tempHtmlPath, tempHtmlContent, 'utf8');

const generatePng = (size, outputPath) => {
  if (chromePath) {
    const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outputPath}" --window-size=${size},${size} --default-background-color=00000000 "${tempHtmlPath}"`;
    try {
      execSync(cmd, { stdio: 'ignore' });
      console.log(`Successfully generated PNG icon (${size}x${size}) at ${outputPath}`);
      return true;
    } catch (e) {
      console.error(`Failed to run Chrome command for size ${size}:`, e.message);
      return false;
    }
  }
  return false;
};

const appleTouchIconPath = path.join(__dirname, '../public/apple-touch-icon.png');
const favicon32Path = path.join(__dirname, '../public/favicon-32x32.png');

const successApple = generatePng(180, appleTouchIconPath);
const successFavicon = generatePng(32, favicon32Path);

// Clean up temp html file
try {
  fs.unlinkSync(tempHtmlPath);
} catch (e) {}

if (!successApple || !successFavicon) {
  console.warn("Could not generate PNG icons using Chrome. Writing fallback blank PNG files.");
  
  // Standard fallback transparent PNG 1x1 base64
  const transparentPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  if (!fs.existsSync(appleTouchIconPath)) {
    fs.writeFileSync(appleTouchIconPath, Buffer.from(transparentPngBase64, 'base64'));
  }
  if (!fs.existsSync(favicon32Path)) {
    fs.writeFileSync(favicon32Path, Buffer.from(transparentPngBase64, 'base64'));
  }
}
