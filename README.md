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
- Execute "http://localhost:3000/order-service/orders"  
  {"productId": 1, "qty": 2}  
  To test one service unavailable.  
- run "node serviceB.js" on seperated terminal.
- run "node gateway.js" on another serperated terminal.
- Execute:  
  - http://localhost:3000/order-service/orders  
    {"productId": 1, "qty": 2}  
    To test 2 service communicatng.  
  - http://localhost:3000/order-service/orders  
    {"productId": 1, "qty": 999}  
    To test its function being unavailable (Not important)  
  - *one of the endpoint and spam it atleast more than 5 times per minutes 
    To test error 429.
