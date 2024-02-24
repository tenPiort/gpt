var sid;
var domain;
var domainIsGood = false;
var domainName = 'screen=am_farm';

var legalDomain = [
    "tribalwars.nl",
    "die-staemme.de",
    "staemme.ch",
    "tribalwars.net",
    "plemiona.pl",
    "tribalwars.se",
    "tribalwars.com.br",
    "tribalwars.com.pt",
    "divokekmeny.cz",
    "triburile.ro",
    "voyna-plemyon.ru",
    "fyletikesmaxes.gr",
    "tribalwars.com",
    "divoke-kmene.sk",
    "klanhaboru.hu",
    "tribalwars.dk",
    "tribals.it",
    "klanlar.org",
    "guerretribale.fr",
    "guerrastribales.es",
    "tribalwars.ae",
    "tribalwars.co.uk",
    "vojnaplemen.si",
    "plemena.com",
    "tribalwars.asia",
    "tribalwars.us",
    "tribalwars.works"
]

setTimeout(function() {
    sid = setInterval(function() {
        setTimeout(function() {
            location.reload();
        }, 90000);
        domain = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
        //	console.log(sessionStorage.getItem('test'))
        if (checkDomain(domain)) {
            setTimeout(function() {
                try {
                    executererere('clickOnSolver', document.getElementById("solver-button"));
                } catch (err) {};
            }, 1500);
            setTimeout(function() {
                try {
                    executererere('clickOnBox', document.getElementsByClassName('recaptcha-checkbox-checkmark')[0]);
                } catch (err) {};
            }, 150);
            setTimeout(function() {
                try {
                    if (document.getElementsByClassName("rc-audiochallenge-error-message").length > 0)
                        executererere('clickOnSolver', document.getElementById("solver-button"));
                } catch (err) {};
            }, 5000);
        }
    }, 500);
}, 1500);

function executererere(string, btn) {
    //console.log(string, btn, domain, domain.match("screen=am_farm"))
    var execute = true;
    if (sessionStorage.getItem(string)) {
        if (new Date().getTime() - sessionStorage.getItem(string) < 30 * 1000) {
            execute = false;
        }
    }
    if (execute) {
        //console.log(document, window.location)
        btn.click();
        sessionStorage.setItem(string, new Date().getTime());
        clearInterval(sid);
    }
}

function checkDomain(domain) {
    console.log(domain)
    if (checkChecked(domain))
        sessionStorage.setItem(domainName, new Date().getTime());
    if (sessionStorage.getItem(domainName))
        if (new Date().getTime() - sessionStorage.getItem(domainName) < 5 * 1000)
            return true;
}

function checkChecked(domain) {
    for (var i = 0; i < legalDomain.length; i++) {
        if (domain.match(legalDomain[i])) return true
    }
}