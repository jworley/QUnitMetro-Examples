(function () {
    "use strict";

    var ui = WinJS.UI;

    ui.Pages.define("/pages/items/items.html", {

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemslist").winControl;
            TrendingTweets.ViewModels.itemsViewModel.ready();
            listView.layout = new ui.GridLayout();
        },
    });
})();
