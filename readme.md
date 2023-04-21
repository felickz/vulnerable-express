## Convert to Typescript
https://blog.logrocket.com/how-to-set-up-node-typescript-express/

init: `npm install`
compile with: `npm run build`

## Create DB
```
codeql database create --language=javascript ./vulnerable-express_db --overwrite
```

## Analyze DB
```
codeql database analyze ./vulnerable-express_db --format=sarif-latest --output=codeql.sarif javascript-code-scanning.qls
```