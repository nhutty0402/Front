const fs = require("fs");
const path = require("path");

const targetHooks = ["useSearchParams", "usePathname", "useRouter"];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // Chỉ sửa nếu file có hook cần fix
  if (!targetHooks.some(hook => content.includes(hook))) return;

  // 1. Thêm "use client" nếu chưa có
  if (!/^["']use client["']/.test(content)) {
    content = `"use client";\n` + content;
    changed = true;
  }

  // 2. Thêm import Suspense nếu chưa có
  if (!content.includes("import { Suspense }")) {
    content = `import { Suspense } from "react";\n` + content;
    changed = true;
  }

  // 3. Bọc component xuất default
  const defaultExportRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/;
  const match = content.match(defaultExportRegex);
  if (match) {
    const compName = match[1];
    const wrapperName = compName + "Wrapper";

    content = content.replace(
      defaultExportRegex,
      `function ${compName}(` // giữ nguyên function gốc
    );

    // Thêm wrapper export
    content += `

export default function ${wrapperName}() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <${compName} />
    </Suspense>
  );
}
`;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✅ Fixed:", filePath);
  }
}

// Chạy script
scanDir(path.join(__dirname, "app"));
