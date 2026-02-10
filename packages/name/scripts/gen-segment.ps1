#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"
npm run gen:schemas -- --segment name
npm run compile:schemas -- --segment name
