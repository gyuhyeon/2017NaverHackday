const request = require('request-promise');
// iconv for decoding, cheerio for serverside DOM access. It's slightly different from jQuery - consider jQuery?
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

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
        let res = {success:true, data:[]};
        // if there's no such tracking number
        if($('table').eq(0).text().indexOf('미등록운송장') > -1){
            res.success = false;
            return res;
        }
        // if there's a query result
        $('table').eq(6).children('tbody').children('tr').children('td')
            .each((index, elem) => {
                if(index > 3 && index % 4 == 2){ // except table headers, all 3rd columns need special treatment
                    // this is the weird td inside table part
                    let data = $(elem).find('td').eq(0).text()+'<br>'+$(elem).find('td').eq(1).text().match(/\(.*\)/i)[0];
                    res.data.push(data);
                }
                else{ // normal single td data
                    let data = $(elem).text();
                    res.data.push(data);
                }
        });
        //slightly different from jquery. cannot access/iterate by index. $('td').eq(0) works, though.
        return res;
    }
    static ErrorHandler(err){
        console.log("Something went wrong : " + err);
    }
}

module.exports = CJ;