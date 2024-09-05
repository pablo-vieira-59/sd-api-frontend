import { timeout } from "rxjs";

export const environment = {
    production: false,
    backendUrl: 'http://localhost:7860/',
    ambient: "Local",
    timeoutValue: 3*60*1000,
    auth:`---`
};