#!/bin/bash
# ============================================================================
# Post to the Tutagora Facebook page.
#   ./post-to-facebook.sh "Your message"                      # text post
#   ./post-to-facebook.sh "Your message" --link URL           # link post
#   ./post-to-facebook.sh "Your message" --photo path.jpg     # photo post
#   Add --dry-run to see what WOULD be posted without posting.
# Token + page id live in facebook-config.json (renew ~every 60 days via
# Graph Explorer -> Access Token Debugger -> Extend, see FACEBOOK-SETUP-GUIDE).
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"

MSG="${1:?Usage: ./post-to-facebook.sh \"message\" [--link URL | --photo FILE] [--dry-run]}"
shift || true

LINK=""; PHOTO=""; DRY=0
while [ $# -gt 0 ]; do
  case "$1" in
    --link)  LINK="$2"; shift 2;;
    --photo) PHOTO="$2"; shift 2;;
    --dry-run) DRY=1; shift;;
    *) echo "unknown arg: $1" >&2; exit 1;;
  esac
done

PAGE_ID=$(python3 -c "import json;print(json.load(open('facebook-config.json'))['page_id'])")
TOKEN=$(python3 -c "import json;print(json.load(open('facebook-config.json'))['access_token'])")

if [ "$DRY" = 1 ]; then
  echo "DRY RUN — would post to page $PAGE_ID:"
  echo "  message: $MSG"
  [ -n "$LINK" ] && echo "  link:    $LINK"
  [ -n "$PHOTO" ] && echo "  photo:   $PHOTO"
  exit 0
fi

if [ -n "$PHOTO" ]; then
  RESP=$(curl -sf -F "message=$MSG" -F "source=@$PHOTO" -F "access_token=$TOKEN" \
    "https://graph.facebook.com/v21.0/$PAGE_ID/photos")
elif [ -n "$LINK" ]; then
  RESP=$(curl -sf --data-urlencode "message=$MSG" --data-urlencode "link=$LINK" \
    --data-urlencode "access_token=$TOKEN" \
    "https://graph.facebook.com/v21.0/$PAGE_ID/feed")
else
  RESP=$(curl -sf --data-urlencode "message=$MSG" \
    --data-urlencode "access_token=$TOKEN" \
    "https://graph.facebook.com/v21.0/$PAGE_ID/feed")
fi

echo "Posted: $RESP"
