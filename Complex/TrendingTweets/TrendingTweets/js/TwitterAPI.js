(function () {
    "use strict";

    var STR_TwitterAPI = "https://api.twitter.com/1/";
    
    var TrendingAPI = WinJS.Class.define(
        function () {
            this._xhr = null;
        },
        {
            xhr: {
                get: function() {
                    if (this._xhr == null) {
                        this._xhr = WinJS.xhr;
                    }
                    return this._xhr;
                },
                set: function (val) {
                    this._xhr = val;
                }
            },
            getTrendingTopics: function (latitude, longitude) {
                var that = this;
                return that.xhr({ url: STR_TwitterAPI + "trends/available.json?lat=" + latitude + "&long=" + longitude })
                    .then(
                        function (request) {
                            var data = window.JSON.parse(request.responseText);
                            var woeid = data[0].woeid;

                            return that.xhr({ url: STR_TwitterAPI + "trends/" + woeid + ".json" });
                        }
                    ).then(
                        function (request) {
                            var data = window.JSON.parse(request.responseText);
                            return WinJS.Promise.as(data[0].trends);
                        }
                    );
            }
        }
        );

    var STR_SearchAPI = "http://search.twitter.com/search.json";

    var SearchAPI = WinJS.Class.define(
        function () {
            this._xhr = null;
        },
        {
            xhr: {
                get: function () {
                    if (this._xhr == null) {
                        this._xhr = WinJS.xhr;
                    }
                    return this._xhr;
                },
                set: function (val) {
                    this._xhr = val;
                }
            },
            getSearchTweets: function (query, rpp, resultType) {
                var that = this;
                rpp = rpp || 20;
                resultType = resultType || "mixed";
                return that.xhr({ url: STR_SearchAPI + "?q=" + query + "&rpp=" + rpp + "&result_type=" + resultType + "&include_entities=true" })
                    .then(
                        function (request) {
                            var data = window.JSON.parse(request.responseText);
                            return WinJS.Promise.as(data.results);
                        }
                    );
            }
        }
    );

    WinJS.Namespace.define("Twitter", {
        TrendingAPI: TrendingAPI,
        SearchAPI: SearchAPI
    });
})();