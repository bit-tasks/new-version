import * as core from "@actions/core";
import { context } from "@actions/github";
import run from "./scripts/pull-request";
import fs from "fs";

try {
  const githubToken = process.env.GITHUB_TOKEN;
  const wsDir: string = core.getInput("ws-dir") || process.env.WSDIR || "./";
  const prNumber = context?.payload?.pull_request?.number;
  const { owner, repo } = context?.repo;

  if (!githubToken) {
    throw new Error("GitHub token not found");
  }

  if (!prNumber) {
    throw new Error("Pull Request number is not found");
  }

  const prAction: string = JSON.parse(
    fs.readFileSync(process.env.GITHUB_EVENT_PATH || "", "utf8")
  )?.action; // values: opened, synchronize, closed
  core.info("PR: " + prAction);
  
  const laneName = `pr-${prNumber?.toString()}`;
  run(githubToken, repo, owner, prNumber, prAction, laneName, wsDir);
} catch (error) {
  core.setFailed((error as Error).message);
}
