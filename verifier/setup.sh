npm install -D prettier

cat << EOT >> .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "semi": false,
  "tabWidth": 2,
  "useTabs": false
}
EOT

npm install -D nodemon

jq '. + 
{
  "scripts": {
    "dev:watch": "npx nodemon index.js",
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
' package.json > tmp.json
rm package.json
mv tmp.json package.json

npm ci