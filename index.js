var express = require('express');
var app = express();
const request = require('request');
const fs = require('fs');
const path = require('path');



app.get('/getTradeItem/:tradeId', function (req, res) {
   const dir = path.join(__dirname, "/test.json")
   if (!fs.existsSync(dir)) {
      request('https://api.bitcoiva.com/markets', function (error, response, dataBody) {
         if (error) res.send(error).status(500)
         else {
            fs.appendFile(dir, dataBody, function (err) {
               if (err) throw err;
               else {
                  let temp = readFile(req.params.tradeId)
                  res.send(temp).status(200)
               }
            })
         }
      });
   } else {
      let temp = readFile(req.params.tradeId)
      res.send(temp).status(200)
   }
});

app.get('/getTradeList', function (req, res) {
   request('https://api.bitcoiva.com/markets', function (error, response, dataBody) {
      if (error) res.send(error).status(500)
      else {
         dataBody = JSON.parse(dataBody)
         res.send(dataBody).status(200)
      }
   });
});

function readFile(tradeId) {
   const dir = path.join(__dirname, "/test.json")
   let fileResponse = fs.readFileSync(dir, 'utf8');
   fileResponse = JSON.parse(fileResponse)
   let record = fileResponse.markets.filter((element) => tradeId == element.trading_pairs)
   return record[0] ? record[0] : {};
}

app.listen(3000, (err) => {
   if (err) console.log(err)
   else console.log("server connected")
});