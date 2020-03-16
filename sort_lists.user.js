// ==UserScript==
// @name         Torn: Sort lists
// @namespace    lugburz.sort_lists
// @version      0.1.2
// @description  Sort lists (such as blacklist, friendlist, faction members list) by various columns.
// @author       Lugburz
// @match        https://www.torn.com/blacklist.php*
// @match        https://www.torn.com/friendlist.php*
// @match        https://www.torn.com/factions.php*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=744690
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.headerSortable {
  cursor: pointer;
}

.headerSortDown:after {
  content: " ▾";
  font: inherit;
}

.headerSortUp:after {
  content: " ▴";
  font: inherit;
}`);

function compare (aText, bText, asc) {
    // Returning -1 will place element `a` before element `b`
    if (aText < bText) {
        if (asc) return -1;
        else return 1;
    }

    // Returning 1 will do the opposite
    if (aText > bText) {
        if (asc) return 1;
        else return -1;
    }

    // Returning 0 leaves them as-is
    return 0;
}

function doSort(users, column, ascending) {
    if ('level'.localeCompare(column) == 0 || 'lvl'.localeCompare(column) == 0 || 'days'.localeCompare(column) == 0) {
        let sortedByLevel = Array.prototype.sort.bind(users);
        sortedByLevel(function (a, b) {
            let aText = $(a).find('.'+column).text().match(/(\d+)/)[0];
            let bText = $(b).find('.'+column).text().match(/(\d+)/)[0];

            return compare(Number(aText), Number(bText), ascending);
        });
    } else if ('title'.localeCompare(column) == 0 || 'desk'.localeCompare(column) == 0) {
        let sortedByName = Array.prototype.sort.bind(users);
        sortedByName(function (a, b) {
            let aText = $(a).find('.name').attr('data-placeholder');
            let bText = $(b).find('.name').attr('data-placeholder');
            if (typeof aText !== 'undefined') aText = aText.toLowerCase();
            if (typeof bText !== 'undefined') bText = bText.toLowerCase();

            return compare(aText, bText, ascending);
        });
    } else if ('status'.localeCompare(column) == 0) {
        let sortedByStatus = Array.prototype.sort.bind(users);
        sortedByStatus(function (a, b) {
            let aText = $(a).find('.'+column).text().replace('Status:', '').trim();
            let bText = $(b).find('.'+column).text().replace('Status:', '').trim();

            return compare (aText, bText, ascending);
        });
    } else {
        // shouldn't happen
        return users;
    }

    let divPrefix = '.title-black > .';
    let columns = [ 'level', 'lvl', 'title', 'desk', 'days', 'status'].forEach((elem) => {
        $(divPrefix+elem).removeClass('headerSortUp');
        $(divPrefix+elem).removeClass('headerSortDown');
    });

    if (ascending) {
        $(divPrefix+column).addClass('headerSortDown');
    } else {
        $(divPrefix+column).addClass('headerSortUp');
    }

    return users;
}

// Blacklist, friendlist
function addUserlistSort() {
    let user_list = $('ul.user-info-blacklist-wrap');
    let users = $(user_list).children('li');
    let ascending = true;
    let last_sort = '';

    let columns = ['title', 'level', 'status'].forEach((column) => {
        $('div.title-black > div.'+column).addClass('headerSortable');
        $('div.'+column).on('click', function() {
            if (column != last_sort) ascending = true;
            last_sort = column;
            users = doSort(users, column, ascending);
            ascending = !ascending;
            $(user_list).append(users);
        });
    });
}

// Faction members
function addMemberlistSort() {
    let user_list = $('ul.member-list');
    let users = $(user_list).children('li');
    let ascending = true;
    let last_sort = '';

    let columns = ['desk', 'lvl', 'days', 'status'].forEach((column) => {
        $('ul.title-black > li.'+column).addClass('headerSortable');
        $('ul.title-black > li.'+column).on('click', function() {
            if (column != last_sort) ascending = true;
            last_sort = column;
            users = doSort(users, column, ascending);
            ascending = !ascending;
            $(user_list).append(users);
        });
    });
}

(function() {
    'use strict';

    // Your code here...
    ajax((page, json, uri) => {
        if (page == "userlist") {
            $('ul.user-info-blacklist-wrap').ready(addUserlistSort);
        } else if (page == "factions") {
            $('ul.member-list').ready(addMemberlistSort);
        }
    });

    //$('ul.container-body-list').ready(a);
    if ($(location).attr('href').includes('factions.php')) {
        $('ul.member-list').ready(addMemberlistSort);
    }
})();
