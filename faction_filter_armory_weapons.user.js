// ==UserScript==
// @name         Torn: Faction: Filter armory weapons
// @namespace    lugburz.faction.filter_armory_weapons
// @version      0.3
// @description  Filter weapons and armor by type in faction armory.
// @author       Lugburz
// @match        https://www.torn.com/factions.php?step=your*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=744690
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

function showHideItems(checked, cb_name, cb_id) {
    $(".item-list > li").each(function(index) {
        let matches;
        if (cb_name.localeCompare('Show-loaned') == 0) {
            let loaned = $(this).find(".loaned");
            matches = (typeof loaned !== 'undefined' && loaned !== null && !$(loaned).text().includes('Available'));
        } else if (cb_id.startsWith('weapon-')) {
            let type = $(this).find(".type");
            matches = (typeof type !== 'undefined' && type !== null && cb_name.localeCompare($(type).text()) == 0);
        } else if (cb_id.startsWith('armor-')) {
            let name = $(this).find(".name");
            if (cb_name.localeCompare('Body') == 0) {
                // there're a lot of names for body armor...
                matches = (typeof name !== 'undefined' && name !== null &&
                           ($(name).text().includes('Vest') || $(name).text().includes('Jacket') || $(name).text().includes('Armor') || $(name).text().includes('Armour')));
            } else {
                matches = (typeof name !== 'undefined' && name !== null && $(name).text().includes(cb_name));
            }
        }

        if (matches && checked) {
            $(this).show();
        } else if (matches) {
            $(this).hide();
        }
    });
}

function addWeaponDivs() {
    if (!$(location).attr('href').includes('sub=weapons')) {
        return;
    }

    let types = ['primary', 'secondary', 'melee'];
    let id_pref = 'weapon-';

    let primCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="weapon-primary" name="Primary"><label for="Primary">Primary</label>';
    let secondCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="weapon-secondary" name="Secondary"><label for="Secondary">Secondary</label>';
    let meleeCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="weapon-melee" name="Melee"><label for="Melee">Melee</label>';
    let showLoanedCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="weapon-show-loaned" name="Show-loaned"><label for="Show-loaned">Show loaned</label>';
    let myDiv = '<div class="title-black top-round t-overflow"><span>Show weapon types:</span>' + primCB + secondCB + meleeCB + '</div';
    $("#armoury-weapons").prepend(myDiv);

    types.forEach(function(item, index, array) {
        let id = id_pref + item;

        if (GM_getValue(id) == "0") {
            $("#"+id).prop("checked", false);
        } else {
            $("#"+id).prop("checked", true);
        }

        showHideItems($("#"+id).prop("checked"), $("#"+id).attr("name"), id);

        $("#"+id).change(function() {
            GM_setValue(id, this.checked);
            showHideItems(this.checked, $(this).attr("name"), id);
        });
    });
}

function addArmorDivs() {
    if (!$(location).attr('href').includes('sub=armour')) {
        return;
    }

    let types = ['boots', 'gloves', 'helmet', 'pants', 'body'];
    let id_pref = 'armor-';

    let bootsCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="armor-boots" name="Boots"><label for="Boots">Boots</label>';
    let glovesCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="armor-gloves" name="Gloves"><label for="Gloves">Gloves</label>';
    let helmetCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="armor-helmet" name="Helmet"><label for="Helmet">Helmet</label>';
    let pantsCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="armor-pants" name="Pants"><label for="Pants">Pants</label>';
    let bodyCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="armor-body" name="Body"><label for="Body">Body</label>';
    let showLoanedCB = '<input type="checkbox" style="margin-left: 5px; margin-right: 5px" id="armor-show-loaned" name="Show-loaned"><label for="Show-loaned">Show loaned</label>';
    let myDiv = '<div class="title-black top-round t-overflow"><span>Show armor types:</span>' + bootsCB + glovesCB + helmetCB + pantsCB + bodyCB + '</div';
    $("#armoury-armour").prepend(myDiv);

    types.forEach(function(item, index, array) {
        let id = id_pref + item;

        if (GM_getValue(id) == "0") {
            $("#"+id).prop("checked", false);
        } else {
            $("#"+id).prop("checked", true);
        }

        showHideItems($("#"+id).prop("checked"), $("#"+id).attr("name"), id);

        $("#"+id).change(function() {
            GM_setValue(id, this.checked);
            showHideItems(this.checked, $(this).attr("name"), id);
        });
    });
};

(function() {
    'use strict';

    // Your code here...
    ajax((page, json, uri) => {
        if (page != "factions" || !json) return;
        $("#armory-weapons").ready(addWeaponDivs);
    });
    ajax((page, json, uri) => {
        if (page != "factions" || !json) return;
        $("#armory-armour").ready(addArmorDivs);
    });

    $("#armoury-weapons").ready(addWeaponDivs);
    $("#armoury-armour").ready(addArmorDivs);
})();
