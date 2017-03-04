#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
# ID="58b9ab56c7b41ccfd7c1ca51"
TOKEN="EJkFlXnj9iQ4fBScDh4xUfCfTcnY7Ugzt1nHUm/ydtI=--VWcB3TYtfM9Gv05IaJeIslojo5Oka27iL/Dyh3X0dts="
AUTHOR="NEW BOOK"
TITLE="LION KING"
OL="English"
FP=2007
VERB=POST

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request ${VERB} \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "book": {
      "title": "'"${TITLE}"'",
      "author": "'"${AUTHOR}"'",
      "original_language": "'"${OL}"'",
      "first_published": "'"${FP}"'"
    }
  }'

echo
