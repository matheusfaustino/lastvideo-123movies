// @todo: make it like the others ("curried")
var selectLastEpisode = function(result) {
    // it seems that some versions return as array and others as object
    var episode = result[0] || result;
    var contents = document.querySelectorAll('.server-active .les-content a');

    // first time in this page
    if (typeof episode == 'undefined' || Object.getOwnPropertyNames(episode).length == 0) {
        // do nothing
        return contents[0];
    }

    var episode_element = document.querySelector('#' + episode[pageUri].elementId);

    // if it is the first episode do nothing, because the video is loading
    if (contents[0] != episode_element) {
        // simulate click in current video
        episode_element.click();
    }

    // stop chain
    // @todo: not working
    return episode_element;
}

var saveByKey = function(key) {
    return function(element) {

        var item = new Object();
        item[key] = {
            elementId: element.id
        };

        return browser.storage.local.set(item);
    }
}

var pageUri = window.location.pathname.substring(1);

var saveVideoPage = saveByKey(pageUri);

// when the page loads
browser.storage.local.get(pageUri)
.then(selectLastEpisode)
.then(saveVideoPage)
.then(function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    var observer = new MutationObserver(mutations => {
        saveVideoPage(document.querySelector('.server-active .les-content .active'));
    });

    var config = {
        attributes: true,
        attributeFilter: ['class']
    };

    observer.observe(document.querySelector('.server-active .les-content .btn-eps'), config);
});
