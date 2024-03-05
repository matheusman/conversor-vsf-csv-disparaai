#!/bin/bash

sudo apt update
npm run dev

PATH="./contatos.json"

if [[ -d "$PATH" ]]; then
    echo npm run csv
else
    echo "O arquivo não existe"
fi