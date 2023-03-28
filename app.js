//Testing scenarios that fire https://codeql.github.com/codeql-query-help/javascript/js-reflected-xss/
// Query -  https://github.com/github/codeql/blob/main/javascript/ql/src/Security/CWE-079/ReflectedXss.ql
// Library - import semmle.javascript.security.dataflow.ReflectedXssQuery -  https://github.com/github/codeql/blob/main/javascript/ql/lib/semmle/javascript/security/dataflow/ReflectedXssQuery.qll
// Customs - import ReflectedXssCustomizations::ReflectedXss - https://github.com/github/codeql/blob/main/javascript/ql/lib/semmle/javascript/security/dataflow/ReflectedXssCustomizations.qll

//Docs ( lists content-types that can be used for XSS) - https://portswigger.net/web-security/cross-site-scripting/cheat-sheet#content-types


const express = require('express')
const app = express()
const port = 3000

//Check out! http://localhost:3000/
//Content-Type: text/html; charset=utf-8
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Check out! http://localhost:3000/hello2
//Content-Type: application/json; charset=utf-8
app.get('/hello2', (req, res) => {
    res.send({hello:'Hello World!'})
})

//Check out! http://localhost:3000/hello
//Vulnerble: js/incomplete-sanitization
app.get('/hello/:status', (req, res) => {
    const myhtml = "<li id=custom-" + req.params.status.replace('[','-').replace(']','-') + "-identifier>Custom</li>"; 
    res.send({hello:`Hello World! ${myhtml}`})
})

//Check out! http://localhost:3000/user/1/review/2
//Content-Type: text/html; charset=utf-8
//Vulnerable: js/reflected-xss
app.get('/user/:id/review/:review', function(req, res) {
    if (!isValidUserId(req.params.id))
      // BAD: a request parameter is incorporated without validation into the response
      res.send("Unknown user: " + req.params.id + " and review: " + req.params.review);
    else
      // TODO: do something exciting
      ;
  });

//Check out! http://localhost:3000/user/1
//Content-Type: text/html; charset=utf-8
//Vulnerable: js/reflected-xss
app.get('/user/:id', function(req, res) {
    if (!isValidUserId(req.params.id))
      // BAD: a request parameter is incorporated without validation into the response
      res.send("Unknown user: " + req.params.id);
    else
      // TODO: do something exciting
      ;
  });

//Check out! http://localhost:3000/user2/1
//Content-Type: text/html; charset=utf-8
//Vulnerable: js/reflected-xss
app.get('/user2/:id', function(req, res) {
    const { id } = req.params;
    if (!isValidUserId(id))
      // BAD: a request parameter is incorporated without validation into the response
      res.send("Unknown user: " + id);
    else
      // TODO: do something exciting
      ;
  });

//Check out! http://localhost:3000/user3/1
//Vulnerable: js/reflected-xss
app.get('/user3/:id', function(req, res) {
    const { id } = req.params;
    try {
        if (!isValidUserId(id))
        throw new Error('not a valid user');
        else
        // TODO: do something exciting
        ;
        
    } catch (error) {
              // BAD: a request parameter is incorporated without validation into the response
      res.send("Unknown user: " + id);
    }
  });
  
//Check out! http://localhost:3000/user4/1
// Content-Type: text/html; charset=utf-8 
//Vulnerable: js/reflected-xss
  app.get('/user4/:id', function(req, res) {
    const { id } = req.params;
    const userNum = parseInt(id, 10);
    try {
        if (!isValidUserId(userNum))
        throw new Error('not a valid user');
        else
        // TODO: do something exciting
        ;
    } catch (error) {
              // BAD: a request parameter is incorporated without validation into the response
      res.send("Unknown user: " + id);
    }
  });

//Check out! http://localhost:3000/user5/1
//Content-type: application/json; charset=utf-8
//Vulnerable: ???
app.get('/user5/:id', function(req, res) {
    const { id } = req.params;
    const userNum = parseInt(id, 10);
    try {
        if (!isValidUserId(userNum))
        throw new Error('not a valid user');
        else
        // TODO: do something exciting
        ;
    } catch (error) {
              // BAD: a request parameter is incorporated without validation into the response
      res.send({message: `Unknown user: " + ${id}`});
    }
  });


//Check out! http://localhost:3000/users/1/reviews/2
app.get('/users/:userId/reviews/:reviewId', (req, res) => {
    res.send(req.params)
  })

//Check out! http://localhost:3000/users/1/books/2
//Check out! http://localhost:3000/users/1/books/mybook
app.get('/users/:userId/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    try {
        const book = parseInt(bookId, 10);
        // if book is not a number, throw error "not a num"
        if (isNaN(book)) {
            throw new Error('not a num');
        }

    } catch (error) {
        return res
            .status(500)
            .send({ message: `Invalid bookId: ${bookId}` });
    }
    
    res.send(req.params)
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function isValidUserId(id) {
    if (id == "0") return true;
    return false;
  }