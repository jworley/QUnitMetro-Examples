(function () {
	var ItemsViewModel = WinJS.Class.define(
		function () {
			this._trendingAPI = null;
			this._geo = null;
			this._navigate = null;
			this.topics = new WinJS.Binding.List();
		},
		{
			trendingAPI: {
				get: function () {
					if (!this._trendingAPI) {
						this._trendingAPI = new Twitter.TrendingAPI();
					}
					return this._trendingAPI;
				},
				set: function (val) {
					this._trendingAPI = val;
				}
			},
			geo: {
				get: function () {
					if (!this._geo) {
						this._geo = (new Windows.Devices.Geolocation.Geolocator());
					}
					return this._geo;
				},
				set: function (val) {
				    this._geo = val;
				}
			},
			navigate: {
				get: function () {
					if (!this._navigate) {
						this._navigate = WinJS.Navigation.navigate;
					}
					return this._navigate;
				},
				set: function (val) {
				    this._navigate = val;
				}
			},
			ready: function () {
				var that = this;
				that.geo.getGeopositionAsync()
					.then(function (pos) {
						return that.trendingAPI.getTrendingTopics(pos.coordinate.latitude, pos.coordinate.longitude);
					})
					.then(function (data) {
						while (that.topics.pop()) {}
						data.forEach(function (item) {
							that.topics.push(item);
						});
					});
			},
			trendSelected: WinJS.Utilities.markSupportedForProcessing(function (args) {
				var that = TrendingTweets.ViewModels.itemsViewModel;
				var trend = that.topics.getAt(args.detail.itemIndex);
				that.navigate("/pages/split/split.html", { trend: trend });
			})
		}
	);

	var BindableItemsViewModel = WinJS.Class.mix(ItemsViewModel,
        WinJS.Binding.mixin,
        WinJS.Binding.expandProperties(ItemsViewModel)
        );

	var SplitViewModel = WinJS.Class.define(
		function () {
			this._searchAPI = null;
			this.selectedTweet = WinJS.Binding.as({from_user: "", from_user_name: "", profile_image_url: "", text: ""});
			this.tweets = new WinJS.Binding.List();
			this.topicName = "";
		},
		{
			searchAPI: {
				get: function () {
					if (!this._searchAPI) {
						this._searchAPI = new Twitter.SearchAPI();
					}
					return this._searchAPI;
				},
				set: function (val) {
					this._searchAPI = val;
				}
			},
			ready: function (trend) {
				var that = this;
				that.topicName = trend.name;
				while(this.tweets.pop()) {}
				that.searchAPI.getSearchTweets(trend.query)
					.then(function (data) {
						var firstTweet = data[0];
						that.selectedTweet.from_user = firstTweet.from_user;
						that.selectedTweet.from_user_name = firstTweet.from_user_name;
						that.selectedTweet.profile_image_url = firstTweet.profile_image_url;
						that.selectedTweet.text = firstTweet.text;
						data.forEach(function (item) {
							that.tweets.push(item);
						});
					});
			},
			reset: function () {
				this.selectedTweet.from_user = "";
				this.selectedTweet.from_user_name = "";
				this.selectedTweet.profile_image_url = "";
				this.selectedTweet.text = "";
			},
			tweetSelected: WinJS.Utilities.markSupportedForProcessing(function (args) {
				var that = TrendingTweets.ViewModels.splitViewModel;
				var tweet = that.tweets.getAt(args.detail.itemIndex);
				that.selectedTweet.from_user = tweet.from_user;
				that.selectedTweet.from_user_name = tweet.from_user_name;
				that.selectedTweet.profile_image_url = tweet.profile_image_url;
				that.selectedTweet.text = tweet.text;
			})
		}
	);

	var BindableSplitViewModel = WinJS.Class.mix(SplitViewModel,
		WinJS.Binding.mixin,
		WinJS.Binding.expandProperties(SplitViewModel)
		);

	WinJS.Namespace.define("TrendingTweets.ViewModels", {
	    itemsViewModel: new BindableItemsViewModel(),
		splitViewModel: new BindableSplitViewModel()
	});
})();