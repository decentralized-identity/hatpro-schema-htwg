#!/usr/bin/env bash
set -euo pipefail
npm run validate:schemas -- --segment name
npm run validate:examples -- --segment name
