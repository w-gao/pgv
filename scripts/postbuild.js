#!/usr/bin/env node
/* eslint-disable */
console.log("Running post build script...")

const fs = require("fs")
const path = require("path")
const date = new Date()

const rootDir = path.join(path.dirname(__filename), "..")
let version = undefined
try {
  version = "v" + require(path.join(rootDir, "package.json")).version
} catch {}

const filename = path.join(rootDir, "packages/web/dist", "env.json")
data = JSON.stringify({
  SITE_VERSION: version,
  BUILD_DATE: date.toLocaleDateString("en-US", {dateStyle: "medium", timeZone: "America/Los_Angeles"}),
  BUILD_TIME: date.toLocaleTimeString("en-US", {timeZone: "America/Los_Angeles"}),

  BRANCH: process.env.GITHUB_REF_NAME || process.env.BRANCH,
  COMMIT_REF: process.env.GITHUB_WORKFLOW_SHA || process.env.COMMIT_REF,

  // GitHub Actions
  GITHUB_WORKFLOW_SHA: process.env.GITHUB_WORKFLOW_SHA,
  GITHUB_REF: process.env.GITHUB_REF,
  GITHUB_REF_NAME: process.env.GITHUB_REF_NAME,
  GITHUB_JOB: process.env.GITHUB_JOB,
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
  GITHUB_REPOSITORY_OWNER: process.env.GITHUB_REPOSITORY_OWNER,
  GITHUB_ACTOR: process.env.GITHUB_ACTOR,
  GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME,
  GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,

  // Netlify
  NETLIFY_BRANCH: process.env.BRANCH,
  NETLIFY_URL: process.env.URL,
  NETLIFY_COMMIT_REF: process.env.COMMIT_REF,
  NETLIFY_HEAD: process.env.HEAD,
  NETLIFY_CONTEXT: process.env.CONTEXT,
  NETLIFY_BUILD_ID: process.env.BUILD_ID,
  NETLIFY_PULL_REQUEST: process.env.PULL_REQUEST,
  NETLIFY_DEPLOY_ID: process.env.DEPLOY_ID,
})

fs.writeFile(filename, data, function (err) {
  if (err) return console.log(err)

  console.log(data)
  console.log("=> " + filename)
})

console.log("Complete!")
