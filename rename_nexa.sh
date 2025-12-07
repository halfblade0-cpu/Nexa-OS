#!/usr/bin/env bash
set -euo pipefail

# Script to create branch, perform exact, case-sensitive replacements,
# remove the specific alert(...) call, commit, push, and prepare a PR.

branch="change/NexaOS-name"

echo "Fetching latest..."
git fetch origin

echo "Creating and switching to branch: $branch"
git checkout -b "$branch"

# Find files tracked by git that contain any of the exact patterns
# Note: These are case-sensitive matches.
mapfile -t files < <(git grep -Il --no-messages -e 'nexaOS' -e 'fake browser' -e 'fake demo browser' -e 'This is a fake demo browser. Replace with your own app.' || true)

if [ ${#files[@]} -eq 0 ]; then
  echo "No matching files found. Nothing to change."
  exit 0
fi

echo "Files to update:"
for f in "${files[@]}"; do
  echo "  $f"
done

# Make backups and apply replacements
for f in "${files[@]}"; do
  echo "Processing $f"
  cp -- "$f" "$f.bak"
  # 1) Replace exact occurrences of 'nexaOS' with 'NexaOS' (case-sensitive).
  # Use word boundary \b to avoid accidental partial replacements (keeps it strict).
  # (If you want to replace non-word-bound contexts too, remove \b anchors.)
  perl -0777 -pe 's/\bnexaOS\b/NexaOS/g' "$f.bak" > "$f"

  # 2) Replace exact phrases 'fake demo browser' and 'fake browser' -> 'in-app browser (iframe)'
  perl -0777 -pe 's/fake demo browser/in-app browser (iframe)/g; s/fake browser/in-app browser (iframe)/g' -i "$f"

  # 3) Replace the sentence (text) "This is a fake demo browser. Replace with your own app." with the neutral phrase
  #    (this handles it in textual content like README/index.html)
  perl -0777 -pe 's/This is a fake demo browser\. Replace with your own app\./in-app browser (iframe)/g' -i "$f"

  # 4) Remove exact alert(...) call whose message exactly equals the string.
  #    Matches:
  #      alert("This is a fake demo browser. Replace with your own app.");
  #      alert('This is a fake demo browser. Replace with your own app.');
  #    and removes the trailing semicolon if present.
  perl -0777 -pe 's/alert\(\s*["'"'"'']This is a fake demo browser\. Replace with your own app\.["'"'"'']\s*\)\s*;//g' -i "$f"

  echo "  backup created: $f.bak"
done

# Add changed files and commit
git add "${files[@]}"
git commit -m "Rename product to NexaOS and replace fake browser text"

# Push branch to origin
git push -u origin "$branch"

echo
echo "Done. Branch '$branch' pushed to origin."
echo "Backups saved with .bak alongside each modified file."
echo
echo "To open a PR (using GitHub CLI 'gh'):"
echo "  gh pr create --base main --head $branch --title \"Rename product to NexaOS and replace fake browser text\" --body \"Rename product to NexaOS. Replace 'fake browser' and 'fake demo browser' with 'in-app browser (iframe)'. Remove the demo alert call with the exact message. Updated index.html, script.js, README.md, and other occurrences.\""
echo
echo "If you don't have 'gh', open a PR in the GitHub web UI from branch $branch into main."
