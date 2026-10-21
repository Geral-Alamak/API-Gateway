This whole program will be made with AI since I know nothing.
This whole program will also be executed locally because my professor asking to use paid hosted cloud server platform (Such as railway) and didn't give free solution.
The program will need some packages from npm, as follows;
Programs needed:
- npm
- Node.js (should be included in npm)
- express (from npm by "npm install")
- http-proxy-middleware (from npm by "npm install")
- express-rate-limit (from npm by "npm install")

How to test this:
- run "npm install".
- run "node serviceA.js".
- run "node serviceB.js" on seperated terminal.
- run "node gateway.js" on another serperated terminal.
- Execute API call on "http://localhost:3000/serviceA" or "http://localhost:3000/serviceB" to check if its working
- Execute the same API call many times in short amount of time to trigger the 429 error.
