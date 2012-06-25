test("Convert: Inches to Feet", function () {
    var inputValue = 12;
    var inputType = "in";
    var outputType = "ft";
    var expected = 1;

    var result = (new unitConverter(inputValue, inputType)).as(outputType).val();

    equal(result, expected, "12 inches should equal 1 foot");
});
test("Convert: Inches to Yards", function () {
    var inputValue = 36;
    var inputType = "in";
    var outputType = "yd";
    var expected = 1;

    var result = (new unitConverter(inputValue, inputType)).as(outputType).val();

    equal(result, expected, "36 inches should equal 1 yard");
});
test("Convert: Inches to Miles", function () {
    var inputValue = 63360;
    var inputType = "in";
    var outputType = "mi";
    var expected = 1;

    var result = (new unitConverter(inputValue, inputType)).as(outputType).val();

    equal(result, expected, "63,360 inches should equal 1 mile");
});
