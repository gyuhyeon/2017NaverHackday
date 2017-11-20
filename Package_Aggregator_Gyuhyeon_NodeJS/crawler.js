const request = require('request-promise');
const mysql = require('mysql');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const config = require('./config');

class CJ{
    static GetCJBaseURL(){
        return "http://nplus.doortodoor.co.kr/web/detail.jsp";
    }
    static CreateQueryPromise(trackingnum){ // usage : CreateQueryPromise(tn).then(($)=>{});
        let qs = {slipno:trackingnum};
        let options = {
            uri: this.GetCJBaseURL(),
            qs: qs,
            encoding: null,
            transform: function (body){
                return cheerio.load(iconv.decode(body,"utf-8")); // using transform option, return cheerio rather than the request object I guess?
            }
        };
        return request(options).catch(this.ErrorHandler);
    }
    static TrackingDataToJSON($){ // test impl to see if it works
        let t = $('td');
        let res = {data:[]};
        for(let i = 0; i<t.length; ++i){
            res.data.push(t[i].innerText);
        }
        return res;
    }
    static ErrorHandler(err){
        console.log("Something went wrong : " + err);
    }
}

module.exports={CJ:CJ};