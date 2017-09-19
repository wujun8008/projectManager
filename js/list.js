$(document).ready(function () {
    onCommand("f:buildView");
});


function onCommand(c, o, s) {
    switch (c) {
    case "f:buildView":
        var _layout = new dhtmlXLayoutObject({
            parent: document.body, // parent container
            pattern: "1C"
        });
        _layout.cells("a").setText("列表");
        var _grid = _layout.cells("a").attachGrid();
        _grid.setHeader("序号,项目,事项,状态,进度,相关纪录,紧急程度", null, ["text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;", "text-align:center;"]);
        _grid.setColumnIds("a,b,c,d,e,f,g");
        _grid.setInitWidthsP("5,10,*,10,10,10,*");
        _grid.setColAlign("center,center,center,center,center,center,center");
        _grid.setColTypes("ro,ro,ro,combo,ro,ro,button");
        _grid.init();
        for (var i = 0; i < 100; i++) {
            _grid.addRowJson(i, {
                a: i + 1,
                b: "项目" + i + 1,
                c: "事项" + i,
                d: "running",
                e: "80%",
                f: "111",
                g: "***"
            });
        }

        _grid.setRowspan("1", 1, 5);
        combo = _grid.getColumnCombo(3); //takes the column index
        combo.enableFilteringMode(true);
        combo.load({
            options: [{
                value: "1",
                text: "aaa"
            }, {
                value: "2",
                text: "bbb"
                }]
        });
        break;
    default:

    }
}
