#!/usr/bin/env bash
set -euo pipefail
npm run gen:schemas -- --segment name
npm run compile:schemas -- --segment name
