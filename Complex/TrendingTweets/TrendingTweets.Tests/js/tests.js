// Trending API Tests
(function () {
    module("Trending API");

    var STR_TwitterAPI = "https://api.twitter.com/1/";

    asyncTest("Get Trending Success", function () {
        expect(3);

        var lat = 39.916188;
        var long = -86.15633;

        var woeid = 2487956;

        var availURL = STR_TwitterAPI + "trends/available.json?lat=" + lat + "&long=" + long;
        var trendURL = STR_TwitterAPI + "trends/" + woeid + ".json";

        var availJSON = '[{"countryCode":"US","name":"San Francisco","country":"United States","woeid":2487956,"placeType":{"name":"Town","code":7},"parentid":23424977,"url":"http:\/\/where.yahooapis.com\/v1\/place\/2487956"}]';
        var trendJSON = '[{"created_at":"2012-06-28T02:27:50Z","trends":[{"query":"%23WhatMostWomenWant","name":"#WhatMostWomenWant","url":"http:\/\/twitter.com\/search\/%23WhatMostWomenWant","promoted_content":null,"events":null}],"as_of":"2012-06-28T02:28:17Z","locations":[{"name":"San Francisco","woeid":2487956}]}]';

        var fakeXHR = function (arg) {
            if (arg.url.indexOf("available.json") > -1) {
                equal(arg.url, availURL, "Available Trends URL Generated");

                return WinJS.Promise.as({ responseText: availJSON });
            } else {
                equal(arg.url, trendURL, "Trends URL Generated");

                return WinJS.Promise.as({ responseText: trendJSON });
            }
        };

        var trendAPI = new Twitter.TrendingAPI();
        trendAPI.xhr = fakeXHR;

        trendAPI.getTrendingTopics(lat, long)
            .done(function (data) {
                var expected = window.JSON.parse(trendJSON)[0].trends;
                deepEqual(data, expected, "Trends Data Structure Generated");
                start();
            },
            function (error) {
                ok(false, "Error encountered");
                start();
            });
    });

    asyncTest("Get Trending Failure", function () {
        expect(3);

        var lat = 39.916188;
        var long = -86.15633;

        var woeid = 2487956;

        var availURL = STR_TwitterAPI + "trends/available.json?lat=" + lat + "&long=" + long;
        var trendURL = STR_TwitterAPI + "trends/" + woeid + ".json";

        var availJSON = '[{"countryCode":"US","name":"San Francisco","country":"United States","woeid":2487956,"placeType":{"name":"Town","code":7},"parentid":23424977,"url":"http:\/\/where.yahooapis.com\/v1\/place\/2487956"}]';
        var trendJSON = '[{"created_at":"2012-06-28T02:27:50Z","trends":[{"query":"%23WhatMostWomenWant","name":"#WhatMostWomenWant","url":"http:\/\/twitter.com\/search\/%23WhatMostWomenWant","promoted_content":null,"events":null}],"as_of":"2012-06-28T02:28:17Z","locations":[{"name":"San Francisco","woeid":2487956}]}]';

        var fakeXHR = function (arg) {
            if (arg.url.indexOf("available.json") > -1) {
                equal(arg.url, availURL, "Available Trends URL Generated");

                return WinJS.Promise.as({ responseText: availJSON });
            } else {
                equal(arg.url, trendURL, "Trends URL Generated");

                return WinJS.Promise.wrapError({ message: "Error" });
            }
        };

        var trendAPI = new Twitter.TrendingAPI();
        trendAPI.xhr = fakeXHR;

        trendAPI.getTrendingTopics(lat, long)
            .done(function (data) {
                ok(false, "Error should be encountered");
                start();
            },
            function (error) {
                ok(true, "Error encountered");
                start();
            });
    });

})();

// Search API Tests
(function () {
    module("Search API");

    var STR_SearchAPI = "http://search.twitter.com/search.json";

    asyncTest("Search Tweets Success", function () {
        expect(2);

        var query = "qunitmetro";
        var rpp = 20;
        var resultType = "mixed";

        var searchURL = STR_SearchAPI + "?q=" + query + "&rpp=" + rpp + "&result_type=" + resultType + "&include_entities=true";

        var searchJSON = '{"completed_in":0.118,"max_id":217951076522012673,"max_id_str":"217951076522012673","next_page":"?page=2&max_id=217951076522012673&q=qunitmetro&rpp=20&include_entities=1&result_type=mixed","page":1,"query":"qunitmetro","refresh_url":"?since_id=217951076522012673&q=qunitmetro&result_type=mixed&include_entities=1","results":[{"created_at":"Wed, 27 Jun 2012 12:01:51 +0000","entities":{"hashtags":[],"urls":[],"user_mentions":[]},"from_user":"QUnitMetro","from_user_id":609148656,"from_user_id_str":"609148656","from_user_name":"QUnit-Metro","geo":null,"id":217950868400648192,"id_str":"217950868400648192","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http:\/\/a0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","profile_image_url_https":"https:\/\/si0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","source":"&lt;a href=&quot;http:\/\/twitter.com\/&quot;&gt;web&lt;\/a&gt;","text":"This morning we pushed version v0.3.1 of QUnitMetro - a few bug fixes and we simplified some config.  NuGet it now!","to_user":null,"to_user_id":0,"to_user_id_str":"0","to_user_name":null}],"results_per_page":20,"since_id":0,"since_id_str":"0"}';

        var fakeXHR = function (arg) {
            equal(arg.url, searchURL, "Search URL generated");

            return WinJS.Promise.as({ responseText: searchJSON });
        };

        var searchAPI = new Twitter.SearchAPI();
        searchAPI.xhr = fakeXHR;

        searchAPI.getSearchTweets(query, rpp, resultType)
            .done(function (data) {
                var expected = window.JSON.parse(searchJSON).results;
                deepEqual(data, expected, "Search Data Structure generated");
                start();
            },
            function (error) {
                ok(false, "Error encountered");
                start();
            });
    });
    asyncTest("Search Tweets Failure", function () {
        expect(2);

        var query = "qunitmetro";
        var rpp = 20;
        var resultType = "mixed";

        var searchURL = STR_SearchAPI + "?q=" + query + "&rpp=" + rpp + "&result_type=" + resultType + "&include_entities=true";

        var searchJSON = '{"completed_in":0.118,"max_id":217951076522012673,"max_id_str":"217951076522012673","next_page":"?page=2&max_id=217951076522012673&q=qunitmetro&rpp=20&include_entities=1&result_type=mixed","page":1,"query":"qunitmetro","refresh_url":"?since_id=217951076522012673&q=qunitmetro&result_type=mixed&include_entities=1","results":[{"created_at":"Wed, 27 Jun 2012 12:01:51 +0000","entities":{"hashtags":[],"urls":[],"user_mentions":[]},"from_user":"QUnitMetro","from_user_id":609148656,"from_user_id_str":"609148656","from_user_name":"QUnit-Metro","geo":null,"id":217950868400648192,"id_str":"217950868400648192","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http:\/\/a0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","profile_image_url_https":"https:\/\/si0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","source":"&lt;a href=&quot;http:\/\/twitter.com\/&quot;&gt;web&lt;\/a&gt;","text":"This morning we pushed version v0.3.1 of QUnitMetro - a few bug fixes and we simplified some config.  NuGet it now!","to_user":null,"to_user_id":0,"to_user_id_str":"0","to_user_name":null}],"results_per_page":20,"since_id":0,"since_id_str":"0"}';

        var fakeXHR = function (arg) {
            equal(arg.url, searchURL, "Search URL Generated");

            return WinJS.Promise.wrapError({ message: "Error" });
        };

        var searchAPI = new Twitter.SearchAPI();
        searchAPI.xhr = fakeXHR;

        searchAPI.getSearchTweets(query, rpp, resultType)
            .done(function (data) {
                ok(false, "Error should be encountered");
                start();
            },
            function (error) {
                ok(true, "Error encountered");
                start();
            });
    });
})();

// View Model Tests
(function () {
    module("Items View Model Tests");

    asyncTest("Items View Model Load", function () {
        expect(5);
        var lat = 39.916188;
        var long = -86.15633;

        var fakeGeo = {
            getGeopositionAsync: function () {
                return WinJS.Promise.as({
                    coordinate: {
                        latitude: lat,
                        longitude: long
                    }
                });
            }
        }

        var trendJSON = '[{"created_at":"2012-06-28T02:27:50Z","trends":[{"query":"%23WhatMostWomenWant","name":"#WhatMostWomenWant","url":"http:\/\/twitter.com\/search\/%23WhatMostWomenWant","promoted_content":null,"events":null}],"as_of":"2012-06-28T02:28:17Z","locations":[{"name":"San Francisco","woeid":2487956}]}]';
        var trendData = window.JSON.parse(trendJSON)[0].trends;

        var fakeTrendAPI = {
            getTrendingTopics: function (latitude, longitude) {
                equal(latitude, lat, "Correct latitude supplied");
                equal(longitude, long, "Correct longitude supplied");

                return WinJS.Promise.as(trendData);
            }
        };

        var vm = TrendingTweets.ViewModels.itemsViewModel;
        vm.geo = fakeGeo;
        vm.trendingAPI = fakeTrendAPI;

        var lengthBind = function () {
            ok(true, "Topics List Updated");
            if (vm.topics.length == 1) {
                var actual = vm.topics.getAt(0);
                var expected = trendData[0];

                deepEqual(actual, expected, "Received correct trending topic");
                start();
                vm.topics.unbind("length", lengthBind);
            }
        };
        vm.topics.bind("length", lengthBind);

        vm.ready();
    });
    asyncTest("Items View Model Item Selected", function () {
        expect(2);
        var lat = 39.916188;
        var long = -86.15633;

        var fakeGeo = {
            getGeopositionAsync: function () {
                return WinJS.Promise.as({
                    coordinate: {
                        latitude: lat,
                        longitude: long
                    }
                });
            }
        }

        var trendJSON = '[{"created_at":"2012-06-28T02:27:50Z","trends":[{"query":"%23WhatMostWomenWant","name":"#WhatMostWomenWant","url":"http:\/\/twitter.com\/search\/%23WhatMostWomenWant","promoted_content":null,"events":null}],"as_of":"2012-06-28T02:28:17Z","locations":[{"name":"San Francisco","woeid":2487956}]}]';
        var trendData = window.JSON.parse(trendJSON)[0].trends;

        var fakeTrendAPI = {
            getTrendingTopics: function (latitude, longitude) {
                return WinJS.Promise.as(trendData);
            }
        };

        var fakeNav = function (url, options) {
            var expectedURL = "/pages/split/split.html";
            var expectedOpts = { trend: trendData[0] };
            equal(url, expectedURL, "Recieved Navigation URL");
            deepEqual(options, expectedOpts, "Recieved Trend data in Options");
            start();
        };

        var vm = TrendingTweets.ViewModels.itemsViewModel;
        vm.geo = fakeGeo;
        vm.trendingAPI = fakeTrendAPI;
        vm.navigate = fakeNav;

        var lengthBind = function () {
            if (vm.topics.length == 1) {
                vm.trendSelected({
                    detail: {
                        itemIndex: 0
                    }
                });
                vm.topics.unbind("length", lengthBind);
            }
        };
        vm.topics.bind("length", lengthBind);

        vm.ready();
    });
})();

(function () {
    module("Split View Model Tests");

    asyncTest("Split View Model Load", function () {
        expect(4);
        var trend = {
            name: "qunitmetro",
            query: "qunitmetro"
        };
        var searchJSON = '{"completed_in":0.118,"max_id":217951076522012673,"max_id_str":"217951076522012673","next_page":"?page=2&max_id=217951076522012673&q=qunitmetro&rpp=20&include_entities=1&result_type=mixed","page":1,"query":"qunitmetro","refresh_url":"?since_id=217951076522012673&q=qunitmetro&result_type=mixed&include_entities=1","results":[{"created_at":"Wed, 27 Jun 2012 12:01:51 +0000","entities":{"hashtags":[],"urls":[],"user_mentions":[]},"from_user":"QUnitMetro","from_user_id":609148656,"from_user_id_str":"609148656","from_user_name":"QUnit-Metro","geo":null,"id":217950868400648192,"id_str":"217950868400648192","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http:\/\/a0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","profile_image_url_https":"https:\/\/si0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","source":"&lt;a href=&quot;http:\/\/twitter.com\/&quot;&gt;web&lt;\/a&gt;","text":"This morning we pushed version v0.3.1 of QUnitMetro - a few bug fixes and we simplified some config.  NuGet it now!","to_user":null,"to_user_id":0,"to_user_id_str":"0","to_user_name":null}],"results_per_page":20,"since_id":0,"since_id_str":"0"}';
        var searchData = window.JSON.parse(searchJSON).results;

        var fakeSearchAPI = {
            getSearchTweets: function (query) {
                equal(query, trend.query, "Query Provided");
                return WinJS.Promise.as(searchData);
            }
        };

        var vm = TrendingTweets.ViewModels.splitViewModel;
        vm.searchAPI = fakeSearchAPI;

        var lengthBind =function () {
            if (vm.tweets.length == 1) {
                ok(true, "Tweets Updated");
                var actual = vm.tweets.getAt(0);
                var expected = searchData[0];

                deepEqual(actual, expected, "Recieved Correct Tweet");
                start();
                vm.tweets.unbind("length", lengthBind);
            }
        };
        vm.tweets.bind("length", lengthBind);

        vm.ready(trend);

        equal(vm.topicName, trend.name, "Topic Name updated");
    });
    asyncTest("Split View Model Item Selected", function () {
        expect(4);
        var trend = {
            name: "qunitmetro",
            query: "qunitmetro"
        };
        var searchJSON = '{"completed_in":0.118,"max_id":217951076522012673,"max_id_str":"217951076522012673","next_page":"?page=2&max_id=217951076522012673&q=qunitmetro&rpp=20&include_entities=1&result_type=mixed","page":1,"query":"qunitmetro","refresh_url":"?since_id=217951076522012673&q=qunitmetro&result_type=mixed&include_entities=1","results":[{"created_at":"Wed, 27 Jun 2012 12:01:51 +0000","entities":{"hashtags":[],"urls":[],"user_mentions":[]},"from_user":"QUnitMetro","from_user_id":609148656,"from_user_id_str":"609148656","from_user_name":"QUnit-Metro","geo":null,"id":217950868400648192,"id_str":"217950868400648192","iso_language_code":"en","metadata":{"result_type":"recent"},"profile_image_url":"http:\/\/a0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","profile_image_url_https":"https:\/\/si0.twimg.com\/sticky\/default_profile_images\/default_profile_4_normal.png","source":"&lt;a href=&quot;http:\/\/twitter.com\/&quot;&gt;web&lt;\/a&gt;","text":"This morning we pushed version v0.3.1 of QUnitMetro - a few bug fixes and we simplified some config.  NuGet it now!","to_user":null,"to_user_id":0,"to_user_id_str":"0","to_user_name":null}],"results_per_page":20,"since_id":0,"since_id_str":"0"}';
        var searchData = window.JSON.parse(searchJSON).results;

        var fakeSearchAPI = {
            getSearchTweets: function (query) {
                return WinJS.Promise.as(searchData);
            }
        };

        var vm = TrendingTweets.ViewModels.splitViewModel;
        vm.searchAPI = fakeSearchAPI;

        var lengthBind = function () {
            if (vm.tweets.length == 1) {
                lengthChanged = true;
                vm.tweetSelected({
                    detail: {
                        itemIndex: 0
                    }
                });
                equal(vm.selectedTweet.from_user, searchData[0].from_user, "Username Provided");
                equal(vm.selectedTweet.from_user_name, searchData[0].from_user_name, "User's name provided");
                equal(vm.selectedTweet.profile_image_url, searchData[0].profile_image_url, "Profile image url provided");
                equal(vm.selectedTweet.text, searchData[0].text, "Tweet Text provided");
                start();
                vm.tweets.unbind("length", lengthBind);
            }
        };
        vm.tweets.bind("length", lengthBind);

        vm.ready(trend);
    });
})();