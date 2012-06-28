(function () {
    "use strict";

    var binding = WinJS.Binding;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/split/split.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemlist").winControl;

            // Set up the ListView.
            listView.layout = new ui.ListLayout();

            // Set up the view model
            TrendingTweets.ViewModels.splitViewModel.ready(options.trend);
            binding.processAll(element, TrendingTweets.ViewModels.splitViewModel);
        },
        unload: function () {
            // Reset the view model
            TrendingTweets.ViewModels.splitViewModel.reset();
        },
    });
})();
