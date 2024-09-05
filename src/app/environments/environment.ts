import { timeout } from "rxjs";

export const environment = {
    production: false,
    //backendUrl: 'http://localhost:7860/',
    backendUrl: 'https://api.ocorp.com.br:8443/',
    ambient: "Local",
    timeoutValue: 3*60*1000,
    auth:`cGFibG8udmllaXJhOlQ1RFhMd3RtTm05M2hwNVI=`
};