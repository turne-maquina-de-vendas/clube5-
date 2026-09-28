#!/bin/zsh
# Gera o site e publica em https://acervoclube5.netlify.app
cd "${0:A:h}" && python3 build-site.py && netlify deploy --prod --no-build --dir dist --functions netlify/functions --site 16f0bee2-a2f0-4a15-84cb-9b129f77bed5 --message "${1:-atualização do acervo}"
