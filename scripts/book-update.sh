#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
# ID="58b9a1726e973ccd4e0e0551"
OWNER="58b98d18d9a24ac354f7c2bd"
TOKEN="EJkFlXnj9iQ4fBScDh4xUfCfTcnY7Ugzt1nHUm/ydtI=--VWcB3TYtfM9Gv05IaJeIslojo5Oka27iL/Dyh3X0dts="
AUTHOR="George RR Martin"
TITLE="Game of Thrones"
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
      "_owner": "'"${OWNER}"'"
    }
  }'

echo
