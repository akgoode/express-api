#!/bin/sh

API="http://localhost:4741"
URL_PATH="/books"
TOKEN="EJkFlXnj9iQ4fBScDh4xUfCfTcnY7Ugzt1nHUm/ydtI=--VWcB3TYtfM9Gv05IaJeIslojo5Oka27iL/Dyh3X0dts="
ID="58b9a1726e973ccd4e0e0551"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Token token=$TOKEN"

echo
