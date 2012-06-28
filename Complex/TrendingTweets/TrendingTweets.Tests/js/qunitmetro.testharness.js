(function () {
    var Assert = WinJS.Binding.define({ result: false, actual: {}, expected: {}, message: "" });
    var TestCase = WinJS.Binding.define({ module: "", name: "", failed: 0, passed: 0, total: 0, asserts: new WinJS.Binding.List(), currentAssert: new Assert() });
    var HomeViewModel = WinJS.Class.define(
        function () {
            this.testResults = new WinJS.Binding.List();
            this.currentTestCase = new TestCase();
            this.currentTestCase.asserts = new WinJS.Binding.List();
            this.currentModule = "";
            var that = this;

            QUnit.moduleStart(function (args) {
                that.currentModule = args.name;
            });

            QUnit.moduleDone(function (args) {
                that.currentModule = "";
            });

            QUnit.testStart(function (args) {
                that.currentTestCase = new TestCase();
                that.currentTestCase.asserts = new WinJS.Binding.List();
                that.currentTestCase.name = args.name;
                that.currentTestCase.module = that.currentModule;
            });

            QUnit.testDone(function (args) {
                that.currentTestCase.failed = args.failed;
                that.currentTestCase.passed = args.passed;
                that.currentTestCase.total = args.total;

                that.testResults.push(that.currentTestCase);
                that.currentTestCase = null;
            });

            QUnit.log(function (args) {
                var assert = new Assert();
                assert.result = args.result;
                assert.actual = args.actual;
                assert.expected = args.expected;
                assert.message = args.message;

                that.currentTestCase.asserts.push(assert);
            });
        }, {
            testResultSelected: WinJS.Utilities.markSupportedForProcessing(function (args) {
                var that = QUnitMetro.TestHarness.ViewModels.homeViewModel;
                that.currentTestCase = that.testResults.getAt(args.detail.itemIndex);

                WinJS.Navigation.navigate("/pages/detail/detail.html");
            }),
            assertSelected: WinJS.Utilities.markSupportedForProcessing(function (args) {
                var that = QUnitMetro.TestHarness.ViewModels.homeViewModel;
                that.currentTestCase.currentAssert = that.currentTestCase.asserts.getAt(args.detail.itemIndex);
            })
        }
    );

    var BindableHomeViewModel = WinJS.Class.mix(
        HomeViewModel,
        WinJS.Binding.mixin,
        WinJS.Binding.expandProperties(HomeViewModel)
    );


    WinJS.Namespace.define("QUnitMetro.TestHarness.ViewModels", {
        homeViewModel: new BindableHomeViewModel(),
        failedToColor: WinJS.Binding.converter(function (failed) {
            return failed ? "#f00" : "#00ff21";
        }),
        resultToColor: WinJS.Binding.converter(function (result) {
            return !result ? "#f00" : "#00ff21";
        })
});
})();