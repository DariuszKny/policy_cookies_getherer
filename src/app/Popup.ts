import {Vendor} from "./Vendor";
import {CookiesManager} from "./CookiesManager";

export module Popup {
    import validateCookies = CookiesManager.validateCookies;
    import saveCookies = CookiesManager.saveCookies;
    let partnersList: HTMLElement;
    let loader: HTMLElement;
    let acceptButton: HTMLButtonElement;
    let rejectButton: HTMLButtonElement;
    let app: HTMLElement;
    let popup: HTMLElement;
    let body: HTMLElement;
    let overlay: HTMLElement;
    const url = 'https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json';
    let partners: Vendor[] = [];


    export const start = () => {
        loadDOM();
        openPopup();
    }

    const openPopup = () => {
        if (validateCookies()) {
            app.style.filter = "blur(5px) grayscale(50%)"
            app.style.backgroundColor = "rgba(0, 0, 0, .4)"
            body.style.overflow = 'hidden'
            popup.style.display = "block"
            overlay.style.transform = "scale(1)"
            getPartners();
        }
    }

    const endPopup = () => {
        app.style.filter = "none"
        app.style.backgroundColor = "white"
        body.style.overflow = 'visible'
        popup.style.display = "none"
        overlay.style.transform = "scale(0)"
    }

    const loadDOM = function () {
        partnersList = document.querySelector<HTMLElement>(".partners")!
        loader = document.querySelector<HTMLElement>(".loader")!
        acceptButton = document.getElementById('Accept') as HTMLButtonElement
        rejectButton = document.getElementById('Reject') as HTMLButtonElement
        app = document.getElementById('App')!
        popup = document.getElementById('Popup')!
        overlay = document.querySelector(".overlay")!
        body = document.body;


        acceptButton.addEventListener('click', () => {
            saveCookies(true, partners)
            endPopup()
        })

        rejectButton.addEventListener('click', () => {
            partners.forEach((partner) => {
                partner.cookiesAccepted = false
            })
            saveCookies(false, partners)
            endPopup()
        })

        openPopup();
    }


    const getPartners = function () {
        loader.style.display = 'block';
        fetch(url)
            .then(response => response.json())
            .then((data) => {
                partners = [];
                let vendors = data.vendors
                for (const vendor in vendors) {
                    let {id, name, policyUrl} = vendors[vendor]
                    partners.push({id, name, policyUrl, cookiesAccepted: true})
                }
                createList();
                loader.style.display = 'none';
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    };

    const createList = function () {
        if (partners) {
            partners.forEach((value) => {
                let li = document.createElement('li');
                let p = document.createElement('p');
                let a = document.createElement('a');
                let boolean = document.createElement('input');

                p.innerHTML = value.name
                a.setAttribute("href", value.policyUrl);
                a.innerHTML = value.policyUrl
                boolean.type = "checkbox"
                boolean.checked = value.cookiesAccepted

                boolean.addEventListener('change', () => {
                    let partner = partners.find((partner) => {
                        return partner.id == value.id
                    })
                    if(partner) {
                        partner.cookiesAccepted = !partner.cookiesAccepted
                    }
                })

                li.appendChild(p);
                li.appendChild(boolean);
                li.appendChild(a);

                partnersList.appendChild(li);
            });
        }
    };


}