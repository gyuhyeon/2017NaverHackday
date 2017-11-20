const request = require('request-promise');
const mysql = require('mysql');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const config = require('./config');

class CJ{
    constructor(){
        this.uri = "http://nplus.doortodoor.co.kr/web/detail.jsp";
        this.PAGE_ENCODING = 'utf-8';
        // this.uri = "https://www.doortodoor.co.kr/parcel/doortodoor.do"; bad form. above is much more restful.
    }
    static CreateQueryPromise(trackingnum){ // usage : CreateQueryPromise(tn).then(($)=>{});
        qs = {slipno:trackingnum};
        let options = {
            uri: this.uri,
            qs: qs,
            encoding: null,
            transform: function (body){
                return iconv.decode(cheerio.load(body),PAGE_ENCODING); // using transform option, return cheerio rather than the request object I guess?
            }
        };
        return request(options).catch(CJ.ErrorHandler);
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