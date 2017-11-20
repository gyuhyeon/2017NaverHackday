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
                return cheerio.load(iconv.decode(body,"EUC-KR")); // using transform option, return cheerio rather than the request object I guess?
                // CJ page is EUC-KR. Always look at headers first.
            }
        };
        return request(options).catch(this.ErrorHandler);
    }
    static TrackingDataToJSON($){ // test impl to see if it works
        let res = {data:[]};
        $('td').each(function(index, element){res.data.push($(element).text());});
        //slightly different from jquery. cannot access by index. $('td').eq(0) works, though.
        return res;
    }
    static ErrorHandler(err){
        console.log("Something went wrong : " + err);
    }
}

module.exports={CJ:CJ};