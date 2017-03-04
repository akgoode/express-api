#!/bin/bash

API="http://localhost:4741"
URL_PATH="/books"
OWNER="58b98d18d9a24ac354f7c2bd"
TOKEN="EJkFlXnj9iQ4fBScDh4xUfCfTcnY7Ugzt1nHUm/ydtI=--VWcB3TYtfM9Gv05IaJeIslojo5Oka27iL/Dyh3X0dts="
AUTHOR="Name of the Wind"
TITLE="Patrick Rothfuss"
OL="English"
FP=2007

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "book": {
      "title": "'"${TITLE}"'",
      "author": "'"${AUTHOR}"'",
      "original_language": "'"${OL}"'",
      "first_published": "'"${FP}"'",
      "_owner": "'"${OWNER}"'"
    }
  }'

echo
