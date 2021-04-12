import {Cookies} from "./Cookies";
import {Vendor} from "./Vendor";

export module CookiesManager {

    export const getCookiesDate = (): Cookies | null => {
        let data = JSON.parse(localStorage.getItem("GDPR_consent")!);
        if(data) {
            return data
        } else {
            return null
        }
    }

    export const saveCookies = (isAccepted: boolean, partners: Vendor[]) => {
        let cookies:Cookies = {
            date: new Date(),
            accepted: isAccepted,
            vendors: partners
        }
        localStorage.setItem("GDPR_consent", JSON.stringify(cookies));
    }


    const checkTime = (data: Cookies) => {
        const oneDay = 60 * 60 * 24 * 1000;
        return (new Date().getTime() - new Date(data.date).getTime()) > oneDay;

    }

    export const validateCookies = () => {
        let data: Cookies | null = getCookiesDate()
        if(data) {
            return checkTime(data)
        }
        return true
    }

}