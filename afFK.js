var playerID, world, run, settings = {},
    spy, checkSpy = true,
    templateA = [],
    templateB = [],
    templates = [],
    table = [],
    bool, endWait = false,
    version, title;
var counter = 0;
var paid;
const extpay = ExtPay('autofarmer-tribal-wars')


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

var dayAttack=localStorage.getItem("afFK-dayAttack"+today);
if(dayAttack===null) dayAttack=0
//console.log(dayAttack);
//extpay.openPaymentPage()

extpay.getUser().then(user => {
    if (user.paid) {
        paid = true;
    } else {
        paid = false;
    }
	head();
})



function farm() {
    checkCaptcha();
    if (run == 1) {
        var timer = 0;
        bool = true;
        var save = 0;
        try {
            if (checkFarm(checkSpy)) timer = checkToSend(table[counter]["attacks"] <= 0 && (table[counter]["icon"] === "red" || table[counter]["icon"] === "yellow" || table[counter]["wall"] > settings["max_wall"]), checkSpy);
        } catch (err) {
       //     console.log(err)
        };
        if (settings["c_template"] === 'Y') try {
            timer = checkToSend(villagesFilter(table[counter]["wall"], table[counter]["distance"], table[counter]["attacks"], table[counter]["icon"]), 'C');
        } catch (err) {
          //  console.log(err)
        };
        try {
            for (var i = 0; i < (checkSpy == true ? 2 : 1); i++) {
                if (bool) {
                    var temp = returnFirstTemplate(i);
                    if (checkFarm(temp)) {
                        timer = checkToSend(villagesFilter(table[counter]["wall"], table[counter]["distance"], table[counter]["attacks"], table[counter]["icon"]), temp);
                    } else save++;
                }
            }
        } catch (err) {
      //      console.log(err)
        };
        counter++;
        if (counter >= table.length || save === (checkSpy == true ? 2 : 1)) {
            end();
        } else {
            setTimeout(farm, timer);
        }
    } else if (window.name.split(";")[1] === '1') setTimeout(farm, 3000);
}

function checkCaptcha() {
    var x = $(".g-recaptcha").length;
    if (x > 0 && run == 1) {
        run = 0;
    } else if (window.name.split(";")[1] === '1' && run == 0 && x == 0) {
        run = 1;
    }
}

function returnFirstTemplate(i) {
    var temp = (i == 0 ? settings["first_template"] : (settings["first_template"] == "A" ? "B" : "A"));
	//console.log(checkSpy, temp)
    return (temp === checkSpy ? (temp == "A" ? "B" : "A") : temp);
}

function reloadPage() {
	//console.log("dupaRP2")
    setTimeout(function() {
        location.reload()
    }, randomNumber(settings["wait_min"], settings["wait_max"]));
}

function head() {
    setInterval(function() {
		if(run==1) reloadPage();
    }, 60 * 25 * 1000);
	
   // if ($('h2:contains(Operacja)')[0] != undefined) reloadPage();
    setInterval(function() {
        if ($(".error").length > 0) {
            localStorage.setItem(world + "-afFK-" + playerID + "-jump", 'y');
			//console.log("dupa2")
            rightClick();
        }
    }, 1000);
    setTimeout(() => {
        if (!endWait) reloadPage();
    }, 300000);
    var manifest = chrome.runtime.getManifest();
    //console.log(manifest);
    version = manifest.version;
    title = manifest.name;
    playerID = document.head.innerText.split('id":"')[1].split("\",")[0];
    world = window.location.hostname.split(".")[0];
    if (localStorage.getItem(world + "-afFK-" + playerID + "-jump") === 'y' || location.href.match('template')) {
        localStorage.setItem(world + "-afFK-" + playerID + "-jump", 'n');
        $("#manager_icon_farm")[0].click();
    }
    run = Number(window.name.split(";")[1]);
    if (isNaN(run)) run = 0;
    setSettings();
    createTemplate();
    createTable();
	addMenu();
	farm();
}

function checkToSend(boolek, x) {
    if (boolek) {
        send(x);
        bool = false;
        return randomNumber(settings["wait_min"], settings["wait_max"]);
    }
}

function send(string) {
    if ($("tr[id^=\"village_\"]").eq(counter).find(".farm_icon_disabled").length > 1) end();
	if(dayAttack>10000000){
		addHideBox(chrome.i18n.getMessage("over10000000AttacksDemo"), "error");
		return
	}
	if (!paid){
		dayAttack++;
		localStorage.setItem("afFK-dayAttack"+today,dayAttack)
	}
	$("tr[id^=\"village_\"]").eq(counter).find(".farm_icon_" + string.toLowerCase())[0].click();
    console.log(string + ": " + counter);
}

function end() {
    var actualPage = Number(window.location.href.substr(-2, 2));
    if (!Number.isInteger(actualPage)) actualPage = Number(window.location.href.substr(-1, 1));
    if (!Number.isInteger(actualPage)) actualPage = 0;
    actualPage++;
    var page = document.getElementById("plunder_list_nav").getElementsByTagName("a");
    const villageCoords = document.getElementById("menu_row2").textContent.match(/\((\d+\|\d+)\)/);
    if (actualPage === 1) {
        changePage(false, actualPage, page);
    } else {
        changePage(true, actualPage, page);
    }
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

function clickNextPage(actualPage, page, state) {
    setTimeout(() => {
        try {
            page[actualPage - 1].click();
        } catch (err) {
           // addHideBox(chrome.i18n.getMessage("problemWithNextPage"), "error");
            clickNextVillage(state)
        }
    }, randomNumber(settings["wait_min"], settings["wait_max"] * 5));
}

function setPauseHistory() {
    var ab = returnFirstTemplate(0);
    var x = [];
    for (var i = 0; i < templates.length; i++) {
        try {
			if (ab="A") var temp = Number((document.getElementById("units_home").querySelector("#" + templates[i]).textContent.trim()) / Number(templateA[i]))
			if (ab="B") var temp = Number((document.getElementById("units_home").querySelector("#" + templates[i]).textContent.trim()) / Number(templateB[i]))
            if (isFloat(temp) || Number.isInteger(temp)) x.push(temp)
        } catch (err) {
      //      console.log(err)
        };
    }
    x = Math.min.apply(null, x);
    if (x === Infinity) x = 0;
    var localStoragePause = localStorage.getItem(world + "-afFK-" + playerID + "-pause");
    console.log(x, returnVillage(), localStoragePause);
    if (localStoragePause === null || (Number(localStoragePause.split(";")[1]) < x && !localStoragePause.match("X")) || localStoragePause.split(";")[0] === returnVillage()) localStorage.setItem(world + "-afFK-" + playerID + "-pause", returnVillage() + ";" + x);
    else if (localStoragePause.match("X")) localStorage.setItem(world + "-afFK-" + playerID + "-pause", localStoragePause.replace("X", ""));
}

function clickNextVillage(state) {
    if (settings["not_pause"] === 'Y') {
        setPauseHistory()
        var lastMaxUnits = Number(localStorage.getItem(world + "-afFK-" + playerID + "-pause").split(";")[1]);
    } else var lastMaxUnits = 0;
    var tempTime = 0;
    if ((Number(window.name.split(";")[0]) + 1 >= randomNumber(settings["villages_min"], settings["villages_max"]) && settings["villages_min"] != 0 && settings["villages_max"] != 0 && settings["not_pause"] !== 'Y') || (settings["not_pause"] === 'Y' && (lastMaxUnits < 100 || localStorage.getItem(world + "-afFK-" + playerID + "-pause") === null))) {
        $('input[name="f"]')[0].checked = false;
        setSettingInStorage();
        window.name = '-1' + ';' + window.name.split(";")[1];
        addHideBox(chrome.i18n.getMessage("randomWait"), "success");
        endWait = true;
        tempTime = 1;
    }
    var temp = Number(window.name.split(";")[0]);
    temp++;
	//console.log(temp)
    window.name = temp + ';' + window.name.split(";")[1];
    if (state) {
        localStorage.setItem(world + "-afFK-" + playerID + "-jump", 'y')
    }
	//console.log(settings["pause_min"], settings["pause_max"],tempTime,run)
	//console.log(randomNumber(settings["pause_min"], settings["pause_max"]) * tempTime * 60 * 1000)
    setTimeout(() => {
        if (run = 1) {
            rightClick();
        }
    }, (randomNumber(settings["pause_min"], settings["pause_max"]) * tempTime * 60 * 1000));
}

function changePage(state, actualPage, page) {
    setTimeout(() => {
		//console.log(counter)
        if (table[counter] === undefined  && counter!=1) counter--;
	//	console.log(table)
        if ((table[counter - 1]["distance"] <= settings["max_distance"]) && (checkSpy === true && (checkFarm("A") || checkFarm("B")) || ((checkSpy !== true) && checkFarm(returnFirstTemplate(0))))) {
            clickNextPage(actualPage, page, state);
        } else {
            clickNextVillage(state)
        }
    }, randomNumber(settings["wait_min"], settings["wait_max"]));
}

function addHideBox(mess, type) {
    var div = document.createElement("div");
    div.innerHTML = '<div class="autoHideBox ' + type + '"><p>' + mess + '</p></div>';
    document.getElementsByClassName("desktop")[0].appendChild(div);
}

function randomNumber(min, max) {
    var timer = parseInt(Math.random() * (max - min + 1) + min);
    return timer;
}

function villagesFilter(wall, distance, attacks, icon) {
    return wall <= settings["max_wall"] && distance <= settings["max_distance"] && attacks < settings["max_attacks"] && (settings["yellow"] === 1 || icon !== 'yellow') && icon !== 'red' ? !0 : !1;
}

function createTemplate() {
    var units = ["spear", "sword", "axe", "bow", "spy", "light", "marcher", "heavy"];
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < units.length; j++) addToTemplate(units[j], i);
        if (checkSpy === true) {
            checkSpy = (i == 0 ? "A" : "B")
        } else if (checkSpy === false) {
            checkSpy = true
        }
    }
}

function rightClick() {
	//console.log("testRC")
    setTimeout(() => {
        try {
            $(".arrowRight")[0].click()
        } catch (err) {
           // console.log(err)
        }
        try {
            $(".groupRight")[0].click();
        } catch (err) {
            //console.log(err)
        }
        setTimeout(() => {
            reloadPage();
        }, randomNumber(settings["wait_min"], settings["wait_max"]));
    }, randomNumber(settings["wait_min"], settings["wait_max"]));
}

function returnVillage() {
    return $(".tooltip-delayed")[$(".tooltip-delayed").length - 1].href.split("village=")[1].split("&")[0].replace("n", "");
}

function saveSettings() {
    localStorage.setItem(world + "-afFK-" + playerID + "-pause", returnVillage() + "X" + ";" + 100);

    addHideBox(chrome.i18n.getMessage("saved"), "success");
    setSettingInStorage();
}

function setSettingInStorage() {
    if (localStorage.getItem(world + "-afFK-" + playerID) !== null) {
        var settingsText = '';
        for (var i = 0; i < $('input[id="sett"]').length; i++) {
            if (i == 7) {
                settingsText += $('input[name="template"]:checked').val();
                settingsText += ";";
            }
            settingsText += $('input[id="sett"]')[i].value;
            settingsText += ";";
            if (i == 8) {
                settingsText += $('input[name="yellow"]:checked').length
                settingsText += ";";
                settingsText += ($('input[name="c"]:checked').val() == 'C' ? 'Y' : 'N');
                settingsText += ";";
                settingsText += ($('input[name="f"]:checked').length > 0 ? 'Y' : 'N');
            }
        }
        localStorage.setItem(world + "-afFK-" + playerID, settingsText);
    }
    setSettings();
}

function setSettings() {
    if (localStorage.getItem(world + "-afFK-" + playerID) === null) {
        localStorage.setItem(world + "-afFK-" + playerID, "10;25;1;15;1;15;15;B;350;600;0;N;N")
    }
    settings = {
        "villages_min": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[0]),
        "villages_max": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[1]),
        "pause_min": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[2]),
        "pause_max": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[3]),
        "max_wall": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[4]),
        "max_distance": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[5]),
        "max_attacks": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[6]),
        "first_template": localStorage.getItem(world + "-afFK-" + playerID).split(";")[7],
        "wait_min": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[8]),
        "wait_max": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[9]),
        "yellow": Number(localStorage.getItem(world + "-afFK-" + playerID).split(";")[10]),
        "c_template": localStorage.getItem(world + "-afFK-" + playerID).split(";")[11],
        "not_pause": localStorage.getItem(world + "-afFK-" + playerID).split(";")[12],
    }
    console.log(settings);
}

function blockSett1() {
    if ($('input[name="f"]:checked').length > 0) {
        for (var i=0;i<4;i++) $('input[id="sett"]')[i].disabled = true
    } else {
        for (var i=0;i<4;i++) $('input[id="sett"]')[i].disabled = false
    }
}

function addMenu() {
    addGUI();
    if (run == 1) document.getElementById("startOrStop").onclick = pauseAF;
    else document.getElementById("startOrStop").onclick = startAF;
    document.getElementById("saveSettings").onclick = saveSettings;
    document.getElementById("spoiler").onclick = spoiler;
    document.getElementById("settCheckbox").onclick = blockSett1;
    document.getElementById("sub").onclick = extpay.openPaymentPage;
}

function addGUI() {
    var errorDetails = "content";
    var gui = $('<div class="vis">');
    var gui_content = '<table class="vis" style="width:100%"><tbody>'
	
	if (paid) {
		gui_content += '<tr class="vis"><h4>Wersja pełna -  Sprawdź status płatności:\
		<input class="btn" id="sub" type="submit" value="Subskrypcja" >\</h4>';
	} else {
		gui_content += '<tr class="vis"><h4>Wersja demo, limit '+dayAttack+'/10000000xd ataków na dobę - Zakup wersję pełną, aby nie czuć limitów\
		<input class="btn" id="sub" type="submit" value="Subskrypcja" >\</h4>';
	}
	
	
	gui_content +='<tr class="vis"><h4><img src=https://help.plemiona.pl/images/5/52/Lup.png>' + title + ' v' + version + ' - ' + chrome.i18n.getMessage("village") + ': ' + (window.name.split(";")[0] !== '' ? Number(window.name.split(";")[0]) + 1 : 1) + ' \
<input class="btn" id="spoiler" type="submit" value="Spoiler" >\</h4>';
    for (var i = 1; i <= 8; i++) {
        gui_content = addTD(gui_content, chrome.i18n.getMessage("F" + i).split("DUPA")[0], chrome.i18n.getMessage("F" + i).split("DUPA")[1]);
    }
    gui_content = addTD(gui_content, '<input class="btn" type="submit" value="' + (run == 1 ? "Stop" : "Start") + '" id="startOrStop">', 1);
    gui_content += "<tr>";
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["villages_min"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["villages_max"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="checkbox" id="settCheckbox" name="f"' + (settings["not_pause"] == 'Y' ? " checked" : "") + '> <br>' + chrome.i18n.getMessage("dontStop"), 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["pause_min"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["pause_max"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["max_wall"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["max_distance"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["max_attacks"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="radio" name="template" value="A"' + (settings["first_template"] == 'A' ? " checked" : "") + '> A', 1);
    gui_content = addTD(gui_content, '<input type="radio" name="template" value="B"' + (settings["first_template"] == 'B' ? " checked" : "") + '> B', 1);
    gui_content = addTD(gui_content, '<input type="checkbox" name="c" value="C"' + (settings["c_template"] == 'Y' ? " checked" : "") + '> C', 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["wait_min"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="text" id="sett" size="3" value="' + settings["wait_max"] + '">', 1);
    gui_content = addTD(gui_content, '<input type="checkbox" name="yellow" ' + (settings["yellow"] == '1' ? " checked" : "") + '> ', 1);
    gui_content = addTD(gui_content, '<input class="btn" id="saveSettings" type="submit" value="' + chrome.i18n.getMessage("save") + '" >', 1);
    gui_content += "<tr><table style='width:100%;display:none' id='hiddenTable'>";
    for (var i = 1; i <= 10; i++) {
        try {
            gui_content = addTRTD(gui_content, chrome.i18n.getMessage("S" + i));
        } catch (err) {}
    }
    $(gui).html(gui_content);
    var vis = $(".farm_icon").parent().parent().parent().parent().parent().parent().parent();
    if (vis.eq(1).length == 0) vis.eq(0).after(gui);
    else vis.eq(1).after(gui);
    if ($('input[name="f"]:checked').length > 0) {
        $('input[id="sett"]')[0].disabled = true
        $('input[id="sett"]')[1].disabled = true
        $('input[id="sett"]')[2].disabled = true
        $('input[id="sett"]')[3].disabled = true
    }
}

function spoiler() {
    if (document.getElementById('hiddenTable').style.display === "none") {
        document.getElementById('hiddenTable').style.display = '';
    } else document.getElementById('hiddenTable').style.display = "none";
}

function pauseAF() {
    run = 0;
    window.name = window.name.split(";")[0] + ";" + run;
    $('#startOrStop')[0].value = 'Start';
    document.getElementById("startOrStop").onclick = startAF;
}

function startAF() {
    run = 1;
    window.name = window.name.split(";")[0] + ";" + run;
    if (endWait) {
        rightClick();
    } else farm();
    $('#startOrStop')[0].value = 'Stop';
    document.getElementById("startOrStop").onclick = pauseAF;
}

function addTRTD(object, text) {
    object += "<tr>" + addTD("", text, 5);
    return object
}

function addTD(object, text, col) {
    object += "<td align='center' colspan='" + col + "'>" + text;
    return object
}

function addToTemplate(x, i) {
    if (x === "spy") {
		if (i == 0) spy=templateA.length
		else spy=templateB.length
	}
    try {
		if (i==0) templateA.push($("[name^=\"" + x + "\"]")[i].value)
		else templateB.push($("[name^=\"" + x + "\"]")[i].value)
        if (i == 0) templates.push(x);
        if (checkSpy === true && ((x === 'spy' && Number($("[name^=\"" + x + "\"]")[i].value) === 0) || (x !== 'spy' && Number($("[name^=\"" + x + "\"]")[i].value) > 0))) checkSpy = false;
    } catch (err) {
		//console.log(err)
	}
}

function createTable() {
	//window.onload = function() {
		var rows = $("tr[id^=\"village_\"]");
		var rows_num = rows.length;
		for (var i = 0; i < rows_num; i++) {
			var z = $("tr[id^=\"village_\"]")[i].getElementsByTagName("td")[3].getElementsByTagName("img")[0];
			if (z !== undefined) {
				var event = new MouseEvent('mouseover', {});
				z.dispatchEvent(event);
			}
			var node = rows.eq(i);
			table.push({
				"village": node.children().eq(3).text(),
				"distance": parseFloat(node.children().eq(7).text()),
				"wall": parseInt(node.children().eq(6).text() == "?" ? -1 : node.children().eq(6).text()),
				"icon": node.find("img")[1].src.split("dots/")[1] != undefined ? node.find("img")[1].src.split("dots/")[1].split(".")[0] : "green",
				"attacks": (z == undefined ? 0 : ($("#tooltip")[0].innerText.split(" ")[0])),
			});
		}
		$("#tooltip")[0] === undefined ? undefined : $("#tooltip")[0].style.display = "none"
		console.log(table)
	//};
}

function checkFarm(ab) {
    for (var i = 0; i < templates.length; i++) {
		if (ab=="A"){
			if (Number(templateA[i]) > Number(document.getElementById("units_home").querySelector("#" + templates[i]).textContent.trim())) {
				return false;
			}
		}else if (ab="B"){
			if (Number(templateB[i]) > Number(document.getElementById("units_home").querySelector("#" + templates[i]).textContent.trim())) {
				return false;
			}
		}
    }
    return true;
}