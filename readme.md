## Create DB
```
codeql database create --language=javascript ./codeql_db --overwrite
```

## Analyze DB
```
codeql database analyze ./codeql_db --format=sarif-latest --output=codeql.sarif javascript-code-scanning.qls
```