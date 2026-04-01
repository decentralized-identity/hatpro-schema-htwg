#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"
npm run validate:schemas -- --segment name
npm run validate:examples -- --segment name
