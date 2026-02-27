#!/usr/bin/env node

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const nextCommand = process.argv[2];
const nextArgs = process.argv.slice(3);

if (!nextCommand) {
  console.error("Usage: node scripts/run-next.js <dev|build|start> [args...]");
  process.exit(1);
}

const env = { ...process.env };
const npmConfigVarsToRemove = [
  "npm_config_argv",
  "npm_config_version_git_tag",
  "npm_config_version_commit_hooks",
  "npm_config_version_git_message",
  "npm_config_version_tag_prefix",
  "npm_config__technicalshree_registry",
];

for (const key of npmConfigVarsToRemove) {
  delete env[key];
}

if (nextCommand === "dev" && env.NEXT_PRESERVE_CACHE !== "1") {
  const nextDir = path.join(process.cwd(), ".next");
  fs.rmSync(nextDir, { recursive: true, force: true });
}

const nextBin = require.resolve("next/dist/bin/next");
const child = spawn(process.execPath, [nextBin, nextCommand, ...nextArgs], {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
