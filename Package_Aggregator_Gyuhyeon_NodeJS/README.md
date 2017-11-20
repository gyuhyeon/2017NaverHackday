# Package_Aggregator : A consolidated package status tracker
Prepared for a 24hr Programming event [Naver Hack Day](https://github.com/NAVER-CAMPUS-HACKDAY/common).  

# About
Demo hosted at [naverhackday.xyz](http://naverhackday.xyz).  
The server will probably be down after 2017/11/24 when the event ends and the almighty Gods take my [Ncloud](https://www.ncloud.com/) instance away.  
Uses Node.js & Express & ejs to serve frontend, frontend design is based on a copyright tranferred(purchased) Pixelarity template.  
DB is MySQL.  

# How to use
```
sudo npm install
sudo npm install pm2 -g
sudo pm2 start app.js    # alternatively, node app.js - but it will terminate if nohup/other tools aren't used.
```

# LICENSE
Copyright (c) 2017 Gyuhyeon Lee

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
