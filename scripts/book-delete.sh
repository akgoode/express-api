#!/bin/bash

API="http://localhost:4741"
URL_PATH="/books"
TOKEN="EJkFlXnj9iQ4fBScDh4xUfCfTcnY7Ugzt1nHUm/ydtI=--VWcB3TYtfM9Gv05IaJeIslojo5Oka27iL/Dyh3X0dts="
ID="58b99fc80cd015cc607a42fc"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Token token=${TOKEN}"

echo
