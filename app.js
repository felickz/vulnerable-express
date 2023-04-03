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
//Vulnerable: no - JSON not exploitable in modern browsers: https://koumudi-garikipati.medium.com/json-based-xss-84089141c136  along with guidance from the OWASP XSS cheat sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding-for-javascript-contexts
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

//Check out! http://localhost:3000/user6/1
//Content-type: text/html; charset=utf-8
//Vulnerable: yes - js/reflected-xss
app.get('/user6/:id', function(req, res) {
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
    res.send(`Unknown user: " + ${id}`);
  }
});

//Close Repro w/ Async
//Check out! http://localhost:3000/user7/1
//Content-type: text/html; charset=utf-8
//Vulnerable: yes - js/reflected-xss
app.get('/user7/:id', async function(req, res) {
    // Inject Provider
    const { providerId } = req.params;
    if (providerId) {
      try {
        const providers = await mediator.call('my:getAllProviders');
        const provider = providers?.find(
          p => p.id === parseInt(providerId, 10),
        );
        if (!provider) {
          return res.status(404).send(`Provider not found: ${otherId}`);
        }
        req.provider = provider;
      } catch (e) {
        return res
          .status(500)
          .send(`Could not retrieve providers: ${providerId}`);
      }
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


  function middleware1(req, res, next) {
    if(req.query.num >= 1) {
        next();
    } else {
        res.json({message: "failed validation 1"});
    }
}

// exploitable!
function middleware2(req, res, next) {
    if(req.query.num >= 2) {
        next();
    } else {
        res.send(`failed validation ${req.query.num}`);
    }
}

function middleware3(req, res, next) {
    if(req.query.num >= 3) {
        next();
    } else {
        res.json({message: "failed validation 3"});
    }
}

function combination(req, res, next) {
    middleware1(req, res, function () {
        middleware2(req, res, function () {
            middleware3(req, res, function () {
                next();
            })
        })
    })
}

//Check out! http://localhost:3000/handler?num=1
// Vulnerable: js/reflected-xss in middleware2
app.get('/handler', combination, function (req, res) {
  res.send('Passed All Validation!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function isValidUserId(id) {
    if (id == "0") return true;
    return false;
  }
