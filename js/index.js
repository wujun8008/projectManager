var departdata = {
    data: [["1", "翻译部"], ["2", "客服部"], ["3", "管委会"], ["4", "技术部"], ["5", "人事部"], ["6", "行政部"]]
};
var data = {
    data: [{
        title: 'IMS',
        id: "001",
        data: [{
            id: "001-1",
            title: "结算",
            status: "open",
            progress: "20%",
            issue: [{
                time: "2001-01-01",
                user: "AAA",
                content: "如何如何"
            }, {
                time: "2001-02-02",
                user: "BBB",
                content: "怎样怎样"
            }],
            departments: [{
                id: "1",
                title: "翻译部"
            }, {
                id: "2",
                title: "客服部"
            }, {
                id: "3",
                title: "管委会"
            }],
            parties: [{
                id: "1",
                title: "AAA"
            }, {
                id: "2",
                title: "BBB"
            }],
            emergency: 3
        }, {
            id: "001-2",
            title: "系统维护并开发",
            status: "running",
            progress: "40%",
            issue: [{
                time: "2001-01-01",
                user: "AAA",
                content: "如何如何"
            }, {
                time: "2001-02-02",
                user: "BBB",
                content: "怎样怎样"
            }],
            departments: [{
                id: "4",
                title: "技术部"
            }, {
                id: "2",
                title: "客服部"
            }],
            parties: [{
                id: "2",
                title: "BBB"
            }, {
                id: "3",
                title: "CCC"
            }],
            emergency: 4
        }]
    }, {
        title: 'CAT',
        id: "002",
        data: [{
            id: "002-1",
            title: "维护",
            status: "open",
            progress: "90%",
            issue: [{
                time: "2001-01-01",
                user: "AAA",
                content: "如何如何"
            }, {
                time: "2001-02-02",
                user: "BBB",
                content: "怎样怎样"
            }],
            departments: [{
                id: "1",
                title: "翻译部"
            }, {
                id: "2",
                title: "客服部"
            }],
            parties: [{
                id: "4",
                title: "DDD"
            }, {
                id: "5",
                title: "EEE"
            }, {
                id: "6",
                title: "FFF"
            }],
            emergency: 2
        }, {
            id: "002-2",
            title: "开发",
            status: "closed",
            progress: "50%",
            issue: [{
                time: "2001-01-01",
                user: "AAA",
                content: "如何如何"
            }, {
                time: "2001-02-02",
                user: "BBB",
                content: "怎样怎样"
            }],
            departments: [{
                id: "1",
                title: "翻译部"
            }, {
                id: "2",
                title: "客服部"
            }, {
                id: "3",
                title: "管委会"
            }],
            parties: [{
                id: "4",
                title: "DDD"
            }, {
                id: "5",
                title: "EEE"
            }, {
                id: "6",
                title: "FFF"
            }],
            emergency: 5
        }, {
            id: "002-3",
            title: "维护",
            status: "open",
            progress: "70%",
            issue: [{
                time: "2001-01-01",
                user: "AAA",
                content: "如何如何"
            }, {
                time: "2001-02-02",
                user: "BBB",
                content: "怎样怎样"
            }],
            departments: [{
                id: "1",
                title: "翻译部"
            }, {
                id: "2",
                title: "客服部"
            }, {
                id: "3",
                title: "管委会"
            }],
            parties: [{
                id: "9",
                title: "XXX"
            }],
            emergency: 2
        }]
    }]
};
var combodata = {
    data: [["open", "open"], ["running", "running", "color:red;"], ["closed", "closed"]]
}
var userdata = {
    data: [["1", "AAA"], ["2", "BBB"], ["3", "CCC"], ["4", "DDD"], ["5", "EEE"], ["6", "FFF"], ["9", "XXX"]]
};
var departHash = {
    "1": "翻译部",
    "2": "客服部",
    "3": "管委会",
    "4": "技术部",
    "5": "人事部",
    "6": "行政部"
};
var userHash = {
    "1": "AAA",
    "2": "BBB",
    "3": "CCC",
    "4": "DDD",
    "5": "EEE",
    "6": "FFF",
    "9": "XXX"
};
$(document).ready(function () {
    onCommand("f:buildData", data);
    onCommand("f:buildView");
});

function onCommand(c, o, s) {
    var _guid, _dguid, _tr, _inp, _type, _name, _combo;
    switch (c) {
    case "Initalised":
        break;
    case 'create_project':
        _guid = wj.Guid("P");
        _dguid = wj.Guid("D");
        if (wj.DataStore.temp_project) return;

        wj.DataStore.temp_project = {
            id: _guid,
            title: "",
            detailLength: 1,
            idarr: [_dguid],
        };


        wj.DataStore.temp_project[_dguid] = {
            id: _dguid,
            title: "",
            status: "",
            progress: "",
            issue: [],
            departments: [],
            parties: [],
            emergency: ""
        };
        _tr = $(onCommand("f:buildTempTrStr", wj.DataStore.temp_project));
        _inp = _tr.find("input").first();
        _inp.width($("#wt td").first().width());
        var _td = _tr.find("td").first();
        _td.width($("#wt td").first().width());
        $("#wt").append(_tr);
        _inp.focus().select();
        var _temp_toolbar = _tr.find("div[class='div_temp_toolbar']");
        _temp_toolbar.show();
        _temp_toolbar.css("left", _td.position().left + _td.width() - 85);
        _temp_toolbar.css("top", _td.position().top + _td.height() - 10);
        trace(wj.DataStore);
        break;
    case 'btn_addDetail':
        _guid = wj.Guid("D");
        _pid = o.parent().parent().attr("data-id");
        wj.DataStore.tableDataHash[_pid][_guid] = {
            id: _guid,
            title: "",
            status: "",
            progress: "",
            issue: [],
            departments: [],
            parties: [],
            emergency: ""
        };
        wj.DataStore.tableDataHash[_pid].idarr.push(_guid);
        wj.DataStore.tableDataHash[_pid].detailLength = wj.DataStore.tableDataHash[_pid].idarr.length;
        var _rowspantd = $("tr[data-id='" + _pid + "']").first().find("td").first();
        _rowspantd.attr("rowspan", parseInt(_rowspantd.attr("rowspan")) + 1);
        _tr = $('<tr name="project" data-id="' + _pid + '">' + onCommand("f:buildDetailStr", wj.DataStore.tableDataHash[_pid][_guid]) + "</tr>");
        _tr.css("height", "100px");
        _tr.insertAfter($("tr[data-id='" + _pid + "']").last());
        onCommand("f:initEvent");
        _tr.find("td[name='title']").append($("div[name='div_toolbar']"));
        $("div[name='div_toolbar']").css("left", _tr.find("td[name='title']").position().left + _tr.find("td[name='title']").width() - 85);
        $("div[name='div_toolbar']").css("top", _tr.find("td[name='title']").position().top + _tr.find("td[name='title']").height() - 10);
        onCommand("btn_edit");
        break;
    case 'btn_edit':
        wj.Components.toolbar.attr("state", "edit");
        onCommand("f:changeToolBarState", "edit");
        onCommand("f:changeTdState", wj.Components.toolbar.parent(), "edit");

        break;
    case 'btn_ok':
        wj.Components.toolbar.attr("state", "normal");

        onCommand("f:saveTd", wj.Components.toolbar.parent(), true); //存数据
        onCommand("f:changeToolBarState", "normal");
        onCommand("f:changeTdState", wj.Components.toolbar.parent(), "normal");

        break;
    case 'btn_cancle':
        wj.Components.toolbar.attr("state", "normal");
        onCommand("f:changeToolBarState", "normal");
        onCommand("f:changeTdState", wj.Components.toolbar.parent(), "normal");
        break;
    case 'btn_temp_ok':
        _guid = wj.Guid("P");
        wj.DataStore.tableDataHash[_guid] = {
            id: _guid,
            title: $(o).parent().parent().find("input").first().val(),
            index: wj.DataStore.tableDataIdArr.length,
            detailLength: 1,
            idarr: [_guid]
        };
        wj.DataStore.tableDataHash[_guid][_guid] = {
            id: _guid,
            title: "",
            status: "",
            progress: "",
            issue: [],
            departments: [],
            parties: [],
            emergency: ""
        };
        wj.DataStore.tableDataIdArr.push(_guid);
        wj.DataStore.tableDataHash.projectLength = wj.DataStore.tableDataIdArr.length;
        delete wj.DataStore.temp_project;
        onCommand("f:buildView");
        break;
    case 'btn_temp_cancle':
        delete wj.DataStore.temp_project;
        $(o).parent().parent().parent().remove();
        trace(wj.DataStore);
        break;


        //方法
    case "f:initEvent":
        $("#wt td").unbind("mouseenter mouseleave");
        $("button").unbind("click");
        $("button").bind('click', function (event) {
            event.preventDefault();
            /* Act on the event */
            onCommand($(event.currentTarget).attr('name'), $(event.currentTarget));
        });
        $("#wt td").bind("mouseenter", function (event) {
            var target = $(event.target);
            if ($("div[name='div_toolbar']").attr("state") == "normal") {
                if (target.is("td") && target.attr("name")) {
                    target.append($("div[name='div_toolbar']"));
                    $("div[name='div_toolbar']").show();
                    var _type = "normal";
                    if (target.attr("data-type") == "project") _type = "projectNormal";
                    onCommand("f:changeToolBarState", _type);
                    $("div[name='div_toolbar']").css("left", target.position().left + target.width() - 85);
                    $("div[name='div_toolbar']").css("top", target.position().top + target.height() - 10);
                }
            }
        }).bind("mouseleave", function () {
            if ($("div[name='div_toolbar']").attr("state") == "normal") $("div[name='div_toolbar']").hide();
        });
        break;
    case "f:buildView":
        $("body").append(wj.Components.toolbar);

        $("#wt").children().not("thead").remove();
        var _plength = wj.DataStore.tableDataHash.projectLength;
        $(wj.DataStore.tableDataIdArr).each(function (i, e) {
            var _pdata = wj.DataStore.tableDataHash[e];
            var _ps = '<tr class="content_tr" name="project" data-id="' + e + '"></tr>';
            var _dlength = _pdata.detailLength;
            $(_pdata.idarr).each(function (di, de) {
                wj.DataStore.tableDataHash[e][de] = _pdata[de];
                var _po = $(_ps);
                var _ddata = _pdata[de];
                var _ds = onCommand("f:buildDetailStr", _ddata);

                if (di < 1) _ds = '<td name="projectName" rowspan="' + _dlength + '" data-type="project" data-id="' + e + '"><span>' + _pdata.title + '</span></td>' + _ds;
                var _do = $(_ds);
                _po.append(_do);
                $("#wt").append(_po);
            });
        });
        $(".raty").each(function (index, el) {
            $(el).raty({
                starType: 'f',
                score: $(el).attr("data-value")
            });
        });
        wj.Components.toolbar = $("div[name='div_toolbar']");
        wj.Components.btnEdit = $("button[name='btn_edit']");
        wj.Components.btnOk = $("button[name='btn_ok']");
        wj.Components.btnAddDetail = $("button[name='btn_addDetail']");
        wj.Components.btnCancle = $("button[name='btn_cancle']");
        trace(wj.DataStore);
        onCommand("f:initEvent");
        break;
    case "f:buildData":
        wj.DataStore.tableData = o;
        wj.DataStore.tableDataHash = {};
        wj.DataStore.tableDataIdArr = [];
        wj.DataStore.tableDataHash.projectLength = o.data.length;
        $(o.data).each(function (i, e) {
            wj.DataStore.tableDataHash[e.id] = {
                id: e.id,
                title: e.title,
                index: i,
                detailLength: e.data.length,
                idarr: []
            };
            wj.DataStore.tableDataIdArr.push(e.id);
            $(e.data).each(function (di, de) {
                wj.DataStore.tableDataHash[e.id][de.id] = de;
                wj.DataStore.tableDataHash[e.id].idarr.push(de.id);
            });
        });
        break;
    case 'f:buildTdStr':
        switch (o.type) {
        case "combo":
        case "text":
            return '<td name="' + o.name + '" data-type="' + o.type + '" data-id="' + o.id + '" state="normal"><span>' + o.content + '</span></td>';
        case "itemlist":
            return '<td name="' + o.name + '" data-type="' + o.type + '" data-id="' + o.id + '" state="normal"><span>' + onCommand("f:buildIssue", o) + '</span></td>';
        case 'buttonList':
            return '<td name="' + o.name + '" data-type="' + o.type + '" data-id="' + o.id + '" state="normal"><span>' + onCommand("f:buttonList", o) + '</span></td>';
        case 'stars':
            return '<td name="' + o.name + '" data-type="' + o.type + '" data-id="' + o.id + '" state="normal"><span>' + onCommand("f:buildStars", o) + '</span></td>';
        case 'progress':
            return '<td name="' + o.name + '" data-type="' + o.type + '" data-id="' + o.id + '" state="normal"><span>' + onCommand("f:buildProgress", o) + '</span></td>';
        case 'labelList':
            return '<td name="' + o.name + '" data-type="' + o.type + '" data-id="' + o.id + '" state="normal"><span>' + onCommand("f:labelList", o) + '</span></td>';
        default:

        }

        break;
    case "f:buildTempTrStr":
        var _ps = '<tr class="tr_temp" name="project" data-id="' + o.id + '">' + '<td name="projectName" rowspan="1" data-type="project"><input name="inp_edit" class="form-control" placeholder="请输入项目名称" type="text" value=""/><div class="div_temp_toolbar"><button class="btn btn-xs btn-danger btn-cancle pull-right mr10" name="btn_temp_cancle" onclick="onCommand(this.name,this)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><button class="btn btn-xs btn-success btn-ok pull-right mr10" name="btn_temp_ok" onclick="onCommand(this.name,this)"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button></div></td>' + onCommand("f:buildDetailStr", o[o.idarr[0]]) + '</tr>';
        return _ps;
    case "f:buildDetailStr":
        var _ds = "";
        $.each(o, function (k, v) {
            if (k != "id") {
                var _vo = {
                    id: o.id,
                    type: 'text',
                    name: k,
                    content: v
                };
                if (k == "status") _vo.type = "combo";
                if (k == "issue") _vo.type = "itemlist";
                if (k == "progress") _vo.type = "progress";
                if (k == "emergency") _vo.type = "stars";
                if (k == "departments") _vo.type = "buttonList";
                if (k == "parties") _vo.type = "labelList";
                var _vos = onCommand("f:buildTdStr", _vo);
                _ds += _vos;
            }
        });
        return _ds;
    case "f:changeToolBarState":
        switch (o) {
        case "projectNormal":
            wj.Components.btnAddDetail.show();
            wj.Components.btnEdit.show();
            wj.Components.btnOk.hide();
            wj.Components.btnCancle.hide();
            break;
        case "normal":
            wj.Components.btnAddDetail.hide();
            wj.Components.btnEdit.show();
            wj.Components.btnOk.hide();
            wj.Components.btnCancle.hide();
            break;
        case "edit":
            wj.Components.btnAddDetail.hide();
            wj.Components.btnEdit.hide();
            wj.Components.btnOk.show();
            wj.Components.btnCancle.show();
            break;
        default:

        }
        break;
    case "f:changeTdState":
        switch (s) {
        case 'edit':
            switch (o.attr("data-type")) {
            case "project":
            case "text":
                var _inpv = o.find("span").first()[0].innerText;
                _inp = $('<input name="inp_edit" class="form-control" type="text" value="' + _inpv + '"/>');
                var _w = o.width();
                var _h = o.height();
                _inp.width(_w);
                o.width(_w);
                o.height(_h);
                o.prepend(_inp);
                $(o.find("span")[0]).remove();
                _inp.focus().select();
                break;
            case "combo":
                var _v = o.find("span").first()[0].innerText;
                var _id = "combo_edit_" + o.attr("data-id");
                _combo = $("<div id='" + _id + "'></div>");
                o.prepend(_combo);
                $(o.find("span")[0]).remove();
                var _comboEdit = new dhtmlXCombo(_id, _id, "100px");
                _comboEdit.addOption(combodata.data);
                if (_v != "") _comboEdit.selectOption(_comboEdit.getOptionByLabel(_v).index);
                break;
            case "itemlist":
                var _inpv = o.find("span").first()[0].innerText;
                _inp = $('<input name="inp_edit" class="form-control" type="text" value=""/>');
                var _w = o.width();
                var _h = o.height();
                _inp.width(_w);
                o.width(_w);
                o.height(_h);
                o.prepend(_inp);
                $(o.find("span")[0]).remove();
                _inp.focus().select();
                break;
            case "labelList":
            case "buttonList":
                var _id = o.attr("name") + "_combo_edit_" + o.attr("data-id");
                _combo = $("<div id='" + _id + "' name='div_component'></div>");
                o.append(_combo);
                var _comboEdit = new dhtmlXCombo(_id, _id, "100px");
                var _ds;
                if (o.attr("name") == "parties") {
                    _comboEdit.addOption(userdata.data);
                } else if (o.attr("name") == "departments") {
                    _comboEdit.addOption(departdata.data);
                }

                _comboEdit.setPlaceholder("请选择");
                $(wj.DataStore.tableDataHash[o.parent().attr("data-id")][o.attr("data-id")][o.attr("name")]).each(function (i, e) {
                    _comboEdit.deleteOption(e.id);
                });
                break;
            case "progress":
                var _inpv = o.find("div").first().first()[0].innerText;
                _inp = $('<input name="inp_edit" class="form-control" type="text" value="' + _inpv + '"/>');
                var _w = o.width();
                var _h = o.height();
                _inp.width(_w);
                o.width(_w);
                o.height(_h);
                o.prepend(_inp);
                $(o.find("span")[0]).remove();
                _inp.focus().select();
                break;
            default:

            }

            break;
        case 'normal':
            wj.Components.toolbar.hide();
            $("body").append(wj.Components.toolbar);
            _id = o.attr("data-id");
            _type = o.attr("data-type");
            _name = o.attr("name");
            switch (_type) {
            case "project":
            case "text":
                $(o.find("input")[0]).replaceWith('<span>' + wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name] + '</span>');
                break;
            case "combo":
                $(o.find("div")[0]).replaceWith('<span>' + wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name] + '</span>');
                break;
            case "itemlist":
                var _vo = {
                    id: _id,
                    type: 'itemlist',
                    name: _name,
                    content: wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name]
                };
                $(o.find("input")[0]).replaceWith('<span>' + onCommand("f:buildIssue", _vo) + '</span>');
                break;
            case "buttonList":
                var _vo = {
                    id: _id,
                    type: 'buttonList',
                    name: _name,
                    content: wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name]
                };
                $(o.find("span")[0]).replaceWith('<span>' + onCommand("f:buttonList", _vo) + '</span>');
                $(o.find("div")[0]).remove();
                break;
            case "labelList":
                var _vo = {
                    id: _id,
                    type: 'buttonList',
                    name: _name,
                    content: wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name]
                };
                $(o.find("span")[0]).replaceWith('<span>' + onCommand("f:labelList", _vo) + '</span>');
                $(o.find("div")[0]).remove();
                break;
            case "progress":
                var _vo = {
                    id: _id,
                    type: 'progress',
                    name: _name,
                    content: wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name]
                };
                $(o.find("input")[0]).replaceWith('<span>' + onCommand("f:buildProgress", _vo) + '</span>');
                break;
            default:

            }

            break;
        default:

        }
        break;
    case "f:buildIssue":
        var _is = "";
        $(o.content).each(function (i, e) {
            var _iss = "<span>" + e.time + " " + e.user + ":</span></br>" + "<span>" + e.content + "</span></br>";
            _is += _iss;
        });
        return _is;
    case "f:buttonList":
        var _is = "";
        $(o.content).each(function (i, e) {
            var _iss = "<button class='btn btn-xs btn-default' data-id='" + e.id + "'>" + e.title + "</button> ";
            _is += _iss;
        });
        return _is;
        break;
    case "f:labelList":
        var _is = "";
        $(o.content).each(function (i, e) {
            var _iss = '<a href="#" data-id="' + e.id + '">' + e.title + '</a> ,';
            _is += _iss;
        });
        return _is.cutcomma();
        break;
    case "f:buildStars":
        return "<div class='raty' data-value='" + o.content + "'></div>";
        break;
    case "f:buildProgress":
        return '<div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: ' + o.content + '">' + o.content + '</div></div>';
    case "f:saveTd":
        _id = o.attr("data-id");
        _type = o.attr("data-type");
        _name = o.attr("name");
        var _vo = {
            id: _id,
            type: _type,
            name: _name,
            content: ""
        };
        switch (_type) {
        case "text":
            wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name] = $(o.find("input")[0]).val();
            break;
        case "itemlist":
            wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name].push({
                content: $(o.find("input")[0]).val(),
                time: new Date().WJFormat("yyyy-MM-dd HH:mm:ss"),
                user: "用户"
            });
            break;
        case "project":
            wj.DataStore.tableDataHash[o.parent().attr("data-id")].title = $(o.find("input")[0]).val();
            break;
        case "combo":
            wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name] = $("input[name='" + $(o.find("div")[0]).attr("id") + "']").val();
            break;
        case "buttonList":
            var _id = o.find("div[name='div_component']").attr("id");
            wj.DataStore.tableDataHash[o.parent().attr("data-id")][o.attr("data-id")][o.attr("name")].push({
                id: $("input[name='" + _id + "']").val(),
                title: departHash[$("input[name='" + _id + "']").val()]
            });
            break;
        case "labelList":
            var _id = o.find("div[name='div_component']").attr("id");
            wj.DataStore.tableDataHash[o.parent().attr("data-id")][o.attr("data-id")][o.attr("name")].push({
                id: $("input[name='" + _id + "']").val(),
                title: userHash[$("input[name='" + _id + "']").val()]
            });
            break;
        case "progress":
            wj.DataStore.tableDataHash[o.parent().attr("data-id")][_id][_name] = $(o.find("input")[0]).val();
            break;
        default:
        }
        break;
    default:

    }
}
