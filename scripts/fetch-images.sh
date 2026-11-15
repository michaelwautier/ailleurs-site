#!/usr/bin/env bash
# Download the Higgsfield mood images listed in docs/image-prompts.md
# into public/images/<slug>/ and convert them to JPG (macOS `sips`).
set -euo pipefail
cd "$(dirname "$0")/.."

grep -E '^\| public/images/' docs/image-prompts.md | while IFS='|' read -r _ target url _; do
  target="$(echo "$target" | xargs)"
  url="$(echo "$url" | xargs)"
  mkdir -p "$(dirname "$target")"
  tmp="${target%.jpg}.png"
  echo "→ $target"
  curl -fsSL "$url" -o "$tmp"
  if command -v sips >/dev/null 2>&1; then
    sips -s format jpeg -s formatOptions 82 "$tmp" --out "$target" >/dev/null
    rm "$tmp"
  else
    mv "$tmp" "$target"
  fi
done
echo "Done."
