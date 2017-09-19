dhtmlXGridObject.prototype._process_xmlA = function (a) {
    this._parsing = true;
    var l = dhx4.ajax.xmltop(this.xml.top, a);
    this._parseHead(l);
    var h = dhx4.ajax.xpath(this.xml.row, l);
    var g = parseInt(l.getAttribute("pos") || 0);
    var e = parseInt(l.getAttribute("total_count") || 0);
    if (e && !this.rowsBuffer[e - 1]) { this.rowsBuffer[e - 1] = null }
    if (this.isTreeGrid()) {
        this._get_xml_data = this._get_xml_dataA;
        this._process_xml_row = this._process_xml_rowA;
        return this._process_tree_xml(a)
    }
    for (var c = 0; c < h.length; c++) {
        if (this.rowsBuffer[c + g]) {
            continue
        }
        var m = h[c].getAttribute("id") || this.uid();
        this.rowsBuffer[c + g] = { idd: m, data: h[c], _parser: this._process_xml_rowA, _locator: this._get_xml_dataA };
        this.rowsAr[m] = h[c]
    }
    this.render_dataset();
    this._parsing = false
};
dhtmlXGridObject.prototype._process_xmlB = function (a) {
    this._parsing = true;
    var l = dhx4.ajax.xmltop(this.xml.top, a);
    this._parseHead(l);
    var h = dhx4.ajax.xpath(this.xml.row, l);
    var g = parseInt(l.getAttribute("pos") || 0);
    var e = parseInt(l.getAttribute("total_count") || 0);
    if (e && !this.rowsBuffer[e - 1]) { this.rowsBuffer[e - 1] = null }
    if (this.isTreeGrid()) {
        this._get_xml_data = this._get_xml_dataB;
        this._process_xml_row = this._process_xml_rowB;
        return this._process_tree_xml(a)
    }
    for (var c = 0; c < h.length; c++) {
        if (this.rowsBuffer[c + g]) {
            continue
        }
        var m = h[c].getAttribute("id") || this.uid();
        this.rowsBuffer[c + g] = { idd: m, data: h[c], _parser: this._process_xml_rowB, _locator: this._get_xml_dataB };
        this.rowsAr[m] = h[c]
    }
    this.render_dataset();
    this._parsing = false
};
dhtmlXGridObject.prototype._process_xml_rowA = function (h, e) {
    var a = [];
    h._attrs = this._xml_attrs(e);
    for (var c = 0; c < this.columnIds.length; c++) {
        var l = this.columnIds[c];
        var g = h._attrs[l] || "";
        if (h.childNodes[c]) { h.childNodes[c]._attrs = {} }
        a.push(g)
    }
    this._fillRow(h, (this._c_order ? this._swapColumns(a) : a));
    return h
};
dhtmlXGridObject.prototype._get_xml_dataA = function (c, a) {
    return c.getAttribute(this.getColumnId(a))
};
dhtmlXGridObject.prototype._process_xml_rowB = function (a, h) {
    var n = [];
    a._attrs = this._xml_attrs(h);
    if (this._ud_enabled) {
        var o = dhx4.ajax.xpath("./userdata", h);
        for (var e = o.length - 1; e >= 0; e--) { this.setUserData(o[e].getAttribute("name"), o[e].firstChild ? o[e].firstChild.data : "") }
    }
    for (var m = 0; m < h.childNodes.length; m++) {
        var g = h.childNodes[m];
        if (!g.tagName) {
            continue
        }
        var c = this.getColIndexById(g.tagName);
        if (isNaN(c)) {
            continue
        }
        var l = g.getAttribute("type");
        if (l) { a.childNodes[c]._cellType = l }
        a.childNodes[c]._attrs = this._xml_attrs(g);
        if (g.getAttribute("xmlcontent")) { } else {
            if (g.firstChild) { g = g.firstChild.data } else { g = "" }
        }
        n[c] = g
    }
    for (var e = 0; e < a.childNodes.length; e++) {
        if (!a.childNodes[e]._attrs) { a.childNodes[e]._attrs = {} }
    }
    this._fillRow(a, n);
    return a
};
dhtmlXGridObject.prototype._get_xml_dataB = function (c, a) {
    var e = this.getColumnId(a);
    c = c.firstChild;
    while (true) {
        if (!c) {
            return ""
        }
        if (c.tagName == e) {
            return (c.firstChild ? c.firstChild.data : "")
        }
        c = c.nextSibling
    }
    return ""
};
dhtmlXGridObject.prototype.startFastOperations = function () {
    this._disF = ["setSizes", "callEvent", "_fixAlterCss", "cells4", "forEachRow", "_correctMonolite"];
    this._disA = [];
    for (var a = this._disF.length - 1; a >= 0; a--) {
        this._disA[a] = this[this._disF[a]];
        this[this._disF[a]] = function () {
            return true
        }
    }
    this._cellCache = [];
    this.cells4 = function (e) {
        var g = this._cellCache[e._cellIndex];
        if (!g) {
            g = this._cellCache[e._cellIndex] = this._disA[3].apply(this, [e]);
            g.destructor = function () {
                return true
            };
            g.setCValue = function (c) { g.cell.innerHTML = c }
        }
        g.cell = e;
        g.combo = e._combo || this.combos[e._cellIndex];
        return g
    }
};
dhtmlXGridObject.prototype.stopFastOperations = function () {
    if (!this._disF) {
        return
    }
    for (var a = this._disF.length - 1; a >= 0; a--) { this[this._disF[a]] = this._disA[a] }
    if (this._correctMonolite) { this._correctMonolite() }
    this.setSizes();
    this.callEvent("onGridReconstructed", [])
};
dhtmlXGridObject.prototype._in_header_number_filter = function (e, c) {
    this._in_header_text_filter.call(this, e, c);
    var a = this;
    e.firstChild._filter = function () {
        var g = a._get_filters(this.value, "num");
        return function (m) {
            var h = g.length > 0 ? false : true;
            for (var l = 0; l < g.length; l++) { h = h || g[l](m) }
            return h
        }
    }
};
dhtmlXGridObject.prototype._in_header_string_filter = function (e, c) {
    this._in_header_text_filter.call(this, e, c);
    var a = this;
    e.firstChild._filter = function () {
        var g = a._get_filters(this.value, "str");
        return function (m) {
            var h = g.length > 0 ? false : true;
            for (var l = 0; l < g.length; l++) { h = h || g[l](m) }
            return h
        }
    }
};
dhtmlXGridObject.prototype._get_filters = function (l, e) {
    var a = l.split(",");
    var g = [];
    for (var c = 0; c < a.length; c++) {
        if (a[c] == "") {
            continue
        }
        var h = this["_get_" + e + "_filter"](a[c]);
        g.push(h)
    }
    return g
};
dhtmlXGridObject.prototype._get_str_filter = function (c) {
    if (c == "null" || c == "empty") {
        return new Function("value", 'if (value == null || value == "") return true; return false;')
    }
    if (c == "!null" || c == "!empty") {
        return new Function("value", 'if (value == null || value == "") return false; return true;')
    }
    if (c.substr(0, 1) === "!") {
        var a = c.substr(1);
        return new Function("value", 'if (value !== "' + a + '") return true; return false;')
    }
    if (c.substr(0, 1) === "~") {
        var a = c.substr(1);
        return new Function("value", 'if (value.indexOf("' + a + '") !== -1) return true; return false;')
    }
    if (c.substr(0, 1) === "^" && c.substr(c.length - 1, 1) === "&") { c = "=" + c.substr(1, c.length - 2) }
    if (c.substr(0, 1) === "^") {
        var a = c.substr(1);
        return new Function("value", "if (value.substr(0, " + a.length + ') === "' + a + '") return true; return false;')
    }
    if (c.substr(c.length - 1, 1) === "&") {
        var a = c.substr(0, c.length - 1);
        return new Function("value", "if (value.substr(value.length - " + a.length + ') === "' + a + '") return true; return false;')
    }
    if (c.substr(0, 1) === "=") {
        var a = c.substr(1)
    } else {
        var a = c
    }
    return new Function("value", 'if (value === "' + a + '") return true; return false;')
};
dhtmlXGridObject.prototype._get_num_filter = function (h) {
    if (h == "null" || h == "empty") {
        return new Function("value", 'if (value == null || value == "") return true; return false;')
    }
    if (h == "!null" || h == "!empty") {
        return new Function("value", 'if (value == null || value == "") return false; return true;')
    }
    var a = h.split("..");
    if (a.length == 2) {
        var l = parseFloat(a[0]);
        var g = parseFloat(a[1]);
        return new Function("value", "if (value >= " + l + " && value <= " + g + ") return true; return false;")
    }
    var e = h.match(/<>|>=|<=|>|<|=/);
    if (e) {
        var m = e[0];
        var c = parseFloat(h.replace(m, ""))
    } else {
        var m = "==";
        c = parseFloat(h)
    }
    if (m == "<>") { m = "!=" }
    if (m == "=") { m = "==" }
    return new Function("value", " if (value " + m + " " + c + " ) return true; return false;")
};
dhtmlXGridObject.prototype.attachHeaderA = dhtmlXGridObject.prototype.attachHeader;
dhtmlXGridObject.prototype.attachHeader = function () {
    this.attachHeaderA.apply(this, arguments);
    if (this._realfake) {
        return true
    }
    this.formAutoSubmit();
    if (typeof (this.FormSubmitOnlyChanged) == "undefined") { this.submitOnlyChanged(true) }
    if (typeof (this._submitAR) == "undefined") { this.submitAddedRows(true) }
    var a = this;
    this._added_rows = [];
    this._deleted_rows = [];
    this.attachEvent("onRowAdded", function (c) {
        a._added_rows.push(c);
        a.forEachCell(c, function (e) { e.cell.wasChanged = true });
        return true
    });
    this.attachEvent("onBeforeRowDeleted", function (c) {
        a._deleted_rows.push(c);
        return true
    });
    this.attachHeader = this.attachHeaderA
};
dhtmlXGridObject.prototype.formAutoSubmit = function () {
    this.parentForm = this.detectParentFormPresent();
    if (this.parentForm === false) {
        return false
    }
    if (this.formEventAttached) {
        return
    }
    this.formInputs = new Array();
    var a = this;
    dhtmlxEvent(this.parentForm, "submit", function () {
        if (a.entBox) { a.parentFormOnSubmit() }
    });
    this.formEventAttached = true
};
dhtmlXGridObject.prototype.parentFormOnSubmit = function () {
    this.formCreateInputCollection();
    if (!this.callEvent("onBeforeFormSubmit", [])) {
        return false
    }
};
dhtmlXGridObject.prototype.submitOnlyChanged = function (a) { this.FormSubmitOnlyChanged = dhx4.s2b(a) };
dhtmlXGridObject.prototype.submitColumns = function (a) {
    if (typeof a == "string") { a = a.split(this.delim) }
    this._submit_cols = a
};
dhtmlXGridObject.prototype.setFieldName = function (a) {
    a = a.replace(/\{GRID_ID\}/g, "'+a1+'");
    a = a.replace(/\{ROW_ID\}/g, "'+a2+'");
    a = a.replace(/\{ROW_INDEX\}/g, "'+this.getRowIndex(a2)+'");
    a = a.replace(/\{COLUMN_INDEX\}/g, "'+a3+'");
    a = a.replace(/\{COLUMN_ID\}/g, "'+this.getColumnId(a3)+'");
    this._input_mask = Function("a1", "a2", "a3", "return '" + a + "';")
};
dhtmlXGridObject.prototype.submitSerialization = function (a) { this.FormSubmitSerialization = dhx4.s2b(a) };
dhtmlXGridObject.prototype.submitAddedRows = function (a) { this._submitAR = dhx4.s2b(a) };
dhtmlXGridObject.prototype.submitOnlySelected = function (a) { this.FormSubmitOnlySelected = dhx4.s2b(a) };
dhtmlXGridObject.prototype.submitOnlyRowID = function (a) { this.FormSubmitOnlyRowID = dhx4.s2b(a) };
dhtmlXGridObject.prototype.createFormInput = function (c, e) {
    var a = document.createElement("input");
    a.type = "hidden";
    if (this._input_mask && (typeof c != "string")) { a.name = this._input_mask.apply(this, c) } else { a.name = ((this.globalBox || this.entBox).id || "dhtmlXGrid") + "_" + c }
    a.value = e;
    this.parentForm.appendChild(a);
    this.formInputs.push(a)
};
dhtmlXGridObject.prototype.createFormInputRow = function (e) {
    var g = (this.globalBox || this.entBox).id;
    for (var c = 0; c < this._cCount; c++) {
        var a = this.cells3(e, c);
        if (((!this.FormSubmitOnlyChanged) || a.wasChanged()) && (!this._submit_cols || this._submit_cols[c])) { this.createFormInput(this._input_mask ? [g, e.idd, c] : (e.idd + "_" + c), a.getValue()) }
    }
};
dhtmlXGridObject.prototype.formCreateInputCollection = function () {
    if (this.parentForm == false) {
        return false
    }
    for (var a = 0; a < this.formInputs.length; a++) { this.parentForm.removeChild(this.formInputs[a]) }
    this.formInputs = new Array();
    if (this.FormSubmitSerialization) { this.createFormInput("serialized", this.serialize()) } else {
        if (this.FormSubmitOnlySelected) {
            if (this.FormSubmitOnlyRowID) { this.createFormInput("selected", this.getSelectedId()) } else {
                for (var a = 0; a < this.selectedRows.length; a++) { this.createFormInputRow(this.selectedRows[a]) }
            }
        } else {
            if (this._submitAR) {
                if (this._added_rows.length) { this.createFormInput("rowsadded", this._added_rows.join(",")) }
                if (this._deleted_rows.length) { this.createFormInput("rowsdeleted", this._deleted_rows.join(",")) }
            }
            this.forEachRow(function (c) {
                if (this.getRowById(c) !== -1) { this.createFormInputRow(this.rowsAr[c]) }
            })
        }
    }
};
dhtmlXGridObject.prototype.detectParentFormPresent = function () {
    var a = false;
    var c = this.entBox;
    while (c && c.tagName && c != document.body) {
        if (c.tagName.toLowerCase() == "form") {
            a = c;
            break
        } else { c = c.parentNode }
    }
    return a
};
dhtmlXGridObject.prototype.unGroup = function () {
    if (!this._groups) {
        return
    }
    this._dndProblematic = false;
    delete this._groups;
    delete this._gIndex;
    if (this._fake) { this._mirror_rowsCol() }
    this.forEachRow(function (a) { this.rowsAr[a].style.display = "" });
    this._reset_view();
    this.callEvent("onGridReconstructed", []);
    this.callEvent("onUnGroup", [])
};
dhtmlXGridObject.prototype._mirror_rowsCol = function () {
    this._fake._groups = this._groups;
    this._fake._gIndex = this._gIndex;
    this.rowsBuffer = dhtmlxArray();
    for (var a = 0; a < this.rowsCol.length; a++) {
        if (!this.rowsCol[a]._cntr) { this.rowsBuffer.push(this.rowsCol[a]) }
    }
    this._fake.rowsBuffer = dhtmlxArray();
    for (var a = 0; a < this._fake.rowsCol.length; a++) {
        if (!this._fake.rowsCol[a]._cntr) { this._fake.rowsBuffer.push(this._fake.rowsCol[a]) }
    }
};
dhtmlXGridObject.prototype.groupBy = function (m, g) {
    if (this._groups) { this.unGroup() }
    this._dndProblematic = true;
    this._groups = {};
    if (!g) {
        g = ["#title"];
        for (var h = 1; h < this._cCount; h++) { g.push("#cspan") }
    }
    this._gmask = document.createElement("TR");
    this._gmask.origin = g;
    var l, e = 0;
    for (var h = 0; h < g.length; h++) {
        if (g[h] == "#cspan") { l.colSpan = (parseInt(l.colSpan) || 1) + 1 } else {
            l = document.createElement("TD");
            l._cellIndex = h;
            if (this._hrrar[h]) { l.style.display = "none" }
            l.className = "group_row";
            l.innerHTML = "&nbsp;";
            if (g[h] == "#title") { this._gmask._title = e } else { l.align = this.cellAlign[h] || "left" }
            this._gmask.appendChild(l);
            if (g[h].indexOf("#stat") == 0) {
                this._gmask._math = true;
                l._counter = [this["_g_" + g[h].replace("#", "")], h, e]
            }
            e++
        }
    }
    for (var c in this._groups) { this._groups[c] = this.undefined }
    this._gIndex = m;
    if (this._fake && !this._realfake) {
        this._fake._groups = [];
        this._fake._gIndex = this._gIndex
    }
    this._nextRow = function (o, a) {
        var n = this.rowsCol[o + a];
        if (n && (n.style.display == "none" || n._cntr)) {
            return this._nextRow(o + a, a)
        }
        return n
    };
    if (!this.__sortRowsBG) {
        this._key_events = dhtmlx.extend({}, this._key_events);
        this._key_events.k38_0_0 = function () {
            if (this.editor && this.editor.combo) { this.editor.shiftPrev() } else {
                var a = this.row.rowIndex;
                if (!a) {
                    return
                }
                var n = this._nextRow(a - 1, -1);
                if (n) { this.selectCell(n, this.cell._cellIndex, true) }
            }
        };
        this._key_events.k13_1_0 = this._key_events.k13_0_1 = function () { };
        this._key_events.k40_0_0 = function () {
            if (this.editor && this.editor.combo) { this.editor.shiftNext() } else {
                var a = this.row.rowIndex;
                if (!a) {
                    return
                }
                var n = this._nextRow(a - 1, 1);
                if (n) { this.selectCell(n, this.cell._cellIndex, true) }
            }
        };
        this.attachEvent("onFilterStart", function () {
            if (this._groups) { this._groups = this.undefined }
            return true
        });
        this.attachEvent("onFilterEnd", function () {
            if (typeof this._gIndex != "undefined") { this.groupBy(this._gIndex, this._gmask.origin) }
        });
        this.sortRows_bg = this.sortRows;
        this.sortRows = function (o, n, a) {
            if (typeof (this._groups) == "undefined") {
                return this.sortRows_bg.apply(this, arguments)
            }
            n = n || "str";
            a = a || "asc";
            if (this.callEvent("onBeforeSorting", [o, n, a])) {
                if (typeof (this._groups) == "undefined") {
                    return true
                }
                if (o == this._gIndex) { this._sortByGroup(o, n, a) } else { this._sortInGroup(o, n, a) }
                this.setSortImgState(true, o, a);
                if (this._fake) {
                    this._mirror_rowsCol();
                    this._fake._groups = [];
                    this._fake._reset_view()
                }
                this.setSortImgState(true, o, a);
                this.callEvent("onAfterSorting", [o, n, a])
            }
            return false
        };
        this.attachEvent("onClearAll", function () { this.unGroup() });
        this.attachEvent("onBeforeRowDeleted", function (o) {
            if (!this._groups) {
                return true
            }
            if (!this.rowsAr[o]) {
                return true
            }
            var n = this.cells(o, this._gIndex).getValue();
            if (n === "") { n = " " }
            var a = this._groups[n];
            this._dec_group(a);
            return true
        });
        this.attachEvent("onAfterRowDeleted", function (a) { this.updateGroups() });
        this.attachEvent("onCheckbox", function (o, a, n) { this.callEvent("onEditCell", [2, o, a, (n ? 1 : 0), (n ? 0 : 1)]) });
        this.attachEvent("onXLE", this.updateGroups);
        this.attachEvent("onColumnHidden", this.hideGroupColumn);
        this.attachEvent("onEditCell", function (D, u, A, y, E) {
            if (!this._groups) {
                return true
            }
            if (D == 2 && y != E && A == this._gIndex) {
                if (E === "") { E = " " }
                this._dec_group(this._groups[E]);
                var a = this.rowsAr[u];
                var C = this.rowsCol._dhx_find(a);
                var w = this._inc_group(y);
                var x = this.rowsCol[w];
                if (a == x) { x = x.nextSibling }
                var s = a.parentNode;
                var v = a.rowIndex;
                s.removeChild(a);
                if (x) { s.insertBefore(a, x) } else { s.appendChild(a) }
                this.rowsCol._dhx_insertAt(w, a);
                if (w < C) { C++ }
                this.rowsCol._dhx_removeAt(C, a);
                this._fixAlterCss()
            } else {
                if (D == 2 && y != E) {
                    this.updateGroups();
                    this._updateGroupView(this._groups[this.cells(u, this._gIndex).getValue() || " "])
                }
            }
            return true
        });
        this.__sortRowsBG = true
    }
    this._groupExisting();
    if (this._hrrar) {
        for (var h = 0; h < this._hrrar.length; h++) {
            if (this._hrrar[h]) { this.hideGroupColumn(h, true) }
        }
    }
    this.callEvent("onGroup", []);
    if (this._ahgr || this._awdth) { this.setSizes() }
};
dhtmlXGridObject.prototype._sortInGroup = function (e, n, g) {
    var o = this._groups_get();
    o.reverse();
    for (var l = 0; l < o.length; l++) {
        var m = o[l]._cntr._childs;
        var r = {};
        for (var h = 0; h < m.length; h++) {
            var s = this.cells3(m[h], e);
            r[m[h].idd] = s.getDate ? s.getDate() : s.getValue()
        }
        this._sortCore(e, n, g, r, m)
    }
    this._groups_put(o);
    this.setSizes();
    this.callEvent("onGridReconstructed", [])
};
dhtmlXGridObject.prototype._sortByGroup = function (h, m, e) {
    var c = this._groups_get();
    var g = [];
    for (var l = 0; l < c.length; l++) {
        c[l].idd = "_sort_" + l;
        g["_sort_" + l] = c[l]._cntr.text
    }
    this._sortCore(h, m, e, g, c);
    this._groups_put(c);
    this.callEvent("onGridReconstructed", []);
    this.setSizes()
};
dhtmlXGridObject.prototype._inc_group = function (h, e, a) {
    if (h === "") { h = " " }
    if (!this._groups[h]) { this._groups[h] = { text: h, row: this._addPseudoRow(), count: 0, state: e ? "plus" : "minus" } }
    var g = this._groups[h];
    g.row._cntr = g;
    var c = this.rowsCol._dhx_find(g.row) + g.count + 1;
    g.count++;
    if (!a) {
        this._updateGroupView(g);
        this.updateGroups()
    }
    return c
};
dhtmlXGridObject.prototype._dec_group = function (a) {
    if (!a) {
        return
    }
    a.count--;
    if (a.count == 0) {
        a.row.parentNode.removeChild(a.row);
        this.rowsCol._dhx_removeAt(this.rowsCol._dhx_find(a.row));
        delete this._groups[a.text]
    } else { this._updateGroupView(a) }
    if (this._fake && !this._realfake) { this._fake._dec_group(this._fake._groups[a.text]) }
    this.updateGroups();
    return true
};
dhtmlXGridObject.prototype._insertRowAt_gA = dhtmlXGridObject.prototype._insertRowAt;
dhtmlXGridObject.prototype._insertRowAt = function (e, g, c) {
    if (typeof (this._groups) != "undefined") {
        if (this._realfake) {
            var h = this._fake._bfs_cells(e.idd, this._gIndex).getValue()
        } else {
            if (this._bfs_cells3) {
                var h = this._bfs_cells3(e, this._gIndex).getValue()
            } else {
                var h = this.cells3(e, this._gIndex).getValue()
            }
        }
        if (!h) { h = " " }
        g = this._inc_group(h, e.style.display == "none")
    }
    var a = this._insertRowAt_gA(e, g, c);
    if (typeof (this._groups) != "undefined") {
        this.expandGroup(h);
        this._updateGroupView(this._groups[h]);
        this.updateGroups()
    }
    return a
};
dhtmlXGridObject.prototype._updateGroupView = function (e) {
    if (this._fake && !this._realfake) {
        return e.row.firstChild.innerHTML = "&nbsp;"
    }
    var a = this._gmask || this._fake._gmask;
    var c = "<img style='margin-bottom:-4px' src='" + this.imgURL + e.state + ".gif'> ";
    if (this.customGroupFormat) { c += this.customGroupFormat(e.text, e.count) } else { c += e.text + " ( " + e.count + " ) " }
    e.row.childNodes[a._title].innerHTML = c
};
dhtmlXGridObject.prototype._addPseudoRow = function (h) {
    var a = this._gmask || this._fake._gmask;
    var g = a.cloneNode(true);
    for (var c = 0; c < g.childNodes.length; c++) {
        g.childNodes[c]._cellIndex = a.childNodes[c]._cellIndex;
        if (this._realfake) { g.childNodes[c].style.display = "" }
    }
    var e = this;
    g.onclick = function (l) {
        if (!e.callEvent("onGroupClick", [this._cntr.text])) {
            if (e._fake && e._realfake) { e._fake._switchGroupState(e._fake._groups[this._cntr.text].row) } else { e._switchGroupState(this) } (l || event).cancelBubble = "true"
        };
        g.ondblclick = function (l) {
            (l || event).cancelBubble = "true"
        };
        if (!h) {
            if (_isKHTML) { this.obj.appendChild(g) } else { this.obj.firstChild.appendChild(g) }
            this.rowsCol.push(g)
        }
        return g
    };
}
dhtmlXGridObject.prototype._groups_get = function () {
    var c = [];
    this._temp_par = this.obj.parentNode;
    this._temp_par.removeChild(this.obj);
    var e = [];
    for (var g = this.rowsCol.length - 1; g >= 0; g--) {
        if (this.rowsCol[g]._cntr) {
            this.rowsCol[g]._cntr._childs = e;
            e = [];
            c.push(this.rowsCol[g])
        } else { e.push(this.rowsCol[g]) }
        this.rowsCol[g].parentNode.removeChild(this.rowsCol[g])
    }
    return c
};
dhtmlXGridObject.prototype._groups_put = function (a) {
    var h = this.rowsCol.stablesort;
    this.rowsCol = new dhtmlxArray(0);
    this.rowsCol.stablesort = h;
    for (var g = 0; g < a.length; g++) {
        var e = a[g]._cntr;
        this.obj.firstChild.appendChild(e.row);
        this.rowsCol.push(e.row);
        e.row.idd = null;
        for (var c = 0; c < e._childs.length; c++) {
            this.obj.firstChild.appendChild(e._childs[c]);
            this.rowsCol.push(e._childs[c])
        }
        delete e._childs
    }
    this._temp_par.appendChild(this.obj)
};
dhtmlXGridObject.prototype._groupExisting = function (c) {
    if (!this.getRowsNum()) {
        return
    }
    var c = [];
    this._temp_par = this.obj.parentNode;
    this._temp_par.removeChild(this.obj);
    var e = [];
    var g = this.rowsCol.length;
    for (var h = 0; h < g; h++) {
        var m = this.cells4(this.rowsCol[h].childNodes[this._gIndex]).getValue();
        this.rowsCol[h].style.display = "";
        if (!m) { m = " " }
        if (!this._groups[m]) {
            this._groups[m] = { text: m, row: this._addPseudoRow(true), count: 0, state: "minus" };
            var l = this._groups[m];
            l.row._cntr = l;
            this._groups[m]._childs = [];
            c.push(l.row)
        }
        this._groups[m].count++;
        this._groups[m]._childs.push(this.rowsCol[h]);
        this.rowsCol[h].parentNode.removeChild(this.rowsCol[h])
    }
    for (var h = 0; h < c.length; h++) { this._updateGroupView(c[h]._cntr) }
    this._groups_put(c);
    if (this._fake && !this._realfake) {
        this._mirror_rowsCol();
        this._fake._groups = [];
        this._fake._reset_view()
    }
    this.callEvent("onGridReconstructed", []);
    this.updateGroups()
};
dhtmlXGridObject.prototype._switchGroupState = function (g) {
    var e = g._cntr;
    if (this._fake && !this._realfake) {
        e.state = this._fake._groups[g._cntr.text].row._cntr.state;
        this._fake._switchGroupState(this._fake._groups[g._cntr.text].row)
    }
    var c = this.rowsCol._dhx_find(e.row) + 1;
    e.state = e.state == "minus" ? "plus" : "minus";
    var a = e.state == "plus" ? "none" : "";
    while (this.rowsCol[c] && !this.rowsCol[c]._cntr) {
        this.rowsCol[c].style.display = a;
        c++
    }
    this._updateGroupView(e);
    this.callEvent("onGroupStateChanged", [e.text, (e.state == "minus")]);
    this.setSizes()
};
dhtmlXGridObject.prototype.expandGroup = function (a) {
    if (this._groups[a].state == "plus") { this._switchGroupState(this._groups[a].row) }
};
dhtmlXGridObject.prototype.collapseGroup = function (a) {
    if (this._groups[a].state == "minus") { this._switchGroupState(this._groups[a].row) }
};
dhtmlXGridObject.prototype.expandAllGroups = function () {
    for (var a in this._groups) {
        if (this._groups[a] && this._groups[a].state == "plus") { this._switchGroupState(this._groups[a].row) }
    }
};
dhtmlXGridObject.prototype.collapseAllGroups = function () {
    for (var a in this._groups) {
        if (this._groups[a] && this._groups[a].state == "minus") { this._switchGroupState(this._groups[a].row) }
    }
};
dhtmlXGridObject.prototype.hideGroupColumn = function (l, h) {
    if (this._fake) {
        return
    }
    var g = -1;
    var m = this._gmask.childNodes;
    for (var e = 0; e < m.length; e++) {
        if (m[e]._cellIndex == l) {
            g = e;
            break
        }
    }
    if (g == -1) {
        return
    }
    for (var c in this._groups) { this._groups[c].row.childNodes[g].style.display = h ? "none" : "" }
};
dhtmlXGridObject.prototype.groupStat = function (c, g, e) {
    e = this["_g_" + (e || "stat_total")];
    var h = 0;
    var a = 0;
    this.forEachRowInGroup(c, function (l) {
        h = e(h, this.cells(l, g).getValue() * 1, a);
        a++
    });
    return h
};
dhtmlXGridObject.prototype.forEachRowInGroup = function (a, g) {
    var h = this._groups[a].row.nextSibling;
    if (h) {
        while (h && !h._cntr) {
            g.call(this, h.idd);
            h = h.nextSibling
        }
    } else {
        var e = this._groups[a]._childs;
        if (e) {
            for (var c = 0; c < e.length; c++) { g.call(this, e[c].idd) }
        }
    }
};
dhtmlXGridObject.prototype.updateGroups = function () {
    if (!this._gmask || !this._gmask._math || this._parsing) {
        return
    }
    var c = this._gmask.childNodes;
    for (var a = 0; a < c.length; a++) {
        if (c[a]._counter) { this._b_processing.apply(this, c[a]._counter) }
    }
};
dhtmlXGridObject.prototype._b_processing = function (e, m, l) {
    var n = 0,
        g = 0;
    if (!this._ecache[this.cellType[m]]) { this.cells5({ parentNode: { grid: this } }, this.cellType[m]) }
    for (var h = this.rowsCol.length - 1; h >= 0; h--) {
        if (!this.rowsCol[h]._cntr) {
            n = e(n, this.cells3(this.rowsCol[h], m).getValue() * 1, g);
            g++
        } else {
            this.cells5(this.rowsCol[h].childNodes[l], this.cellType[m]).setValue(n);
            g = n = 0
        }
    }
};
dhtmlXGridObject.prototype._g_stat_total = function (g, e, a) {
    return g + e
};
dhtmlXGridObject.prototype._g_stat_min = function (g, e, a) {
    if (!a) { g = Infinity }
    return Math.min(g, e)
};
dhtmlXGridObject.prototype._g_stat_max = function (g, e, a) {
    if (!a) { g = -Infinity }
    return Math.max(g, e)
};
dhtmlXGridObject.prototype._g_stat_average = function (g, e, a) {
    return (g * a + e) / (a + 1)
};
dhtmlXGridObject.prototype._g_stat_count = function (g, e, a) {
    return g++
};
dhtmlXGridObject.prototype._in_header_collapse = function (h, g, n) {
    var a = h.tagName == "TD" ? h : h.parentNode;
    g = a._cellIndexS;
    if (!this._column_groups) { this._column_groups = [] }
    var m = n[1].split(":");
    var m = n[1].split(":");
    m = [m.shift(), m.join(":")];
    var l = parseInt(m[0]);
    h.innerHTML = n[0] + "<img src='" + this.imgURL + "minus.gif' style='padding-right:10px;height:16px'/><span style='position:relative; top:-6px;'>" + (m[1] || "") + "<span>";
    h.style.paddingBottom = "0px";
    var e = this;
    this._column_groups[g] = h.getElementsByTagName("IMG")[0];
    this._column_groups[g].onclick = function (o) {
        (o || event).cancelBubble = true;
        this._cstate = !this._cstate;
        for (var c = g + 1; c < (g + l) ; c++) { e.setColumnHidden(c, this._cstate) }
        if (this._cstate) {
            if (a.colSpan && a.colSpan > 0) {
                a._exp_colspan = a.colSpan;
                var u = Math.max(1, a.colSpan - l);
                if (!_isFF) {
                    for (var r = 0; r < a.colSpan - u; r++) {
                        var s = document.createElement("TD");
                        if (a.nextSibling) { a.parentNode.insertBefore(s, a.nextSibling) } else { a.parentNode.appendChild(s) }
                    }
                }
                a.colSpan = u
            }
            e.callEvent("onColumnCollapse", [g, this._cstate])
        } else {
            if (a._exp_colspan) {
                a.colSpan = a._exp_colspan;
                if (!_isFF) {
                    for (var r = 1; r < a._exp_colspan; r++) { a.parentNode.removeChild(a.nextSibling) }
                }
                e.callEvent("onColumnCollapse", [g, this._cstate])
            }
        }
        this.src = e.imgURL + (this._cstate ? "plus.gif" : "minus.gif");
        if (e.sortImg.style.display != "none") { e.setSortImgPos() }
    }
};
dhtmlXGridObject.prototype.collapseColumns = function (a) {
    if (!this._column_groups[a] || this._column_groups[a]._cstate) {
        return
    }
    this._column_groups[a].onclick({})
};
dhtmlXGridObject.prototype.expandColumns = function (a) {
    if (!this._column_groups[a] || !this._column_groups[a]._cstate) {
        return
    }
    this._column_groups[a].onclick({})
};
dhtmlXGridObject.prototype.enableHeaderMenu = function (a) {
    if (!window.dhtmlXMenuObject) {
        return dhtmlx.message("You need to include DHTMLX Menu")
    }
    if (!this._header_menu) {
        var e = this._header_menu = new dhtmlXMenuObject();
        e.renderAsContextMenu();
        e.attachEvent("onBeforeContextMenu", function () {
            c._showHContext(a);
            return true
        });
        e.attachEvent("onClick", function (r) {
            var m = this.getCheckboxState(r);
            var n = c.hdr.rows[1];
            for (var h = 0; h < n.cells.length; h++) {
                var o = n.cells[h];
                if (o._cellIndexS == r) {
                    var g = o.colSpan || 1;
                    for (var l = 0; l < g; l++) { c.setColumnHidden(r * 1 + l, !m) }
                }
            }
        });
        this.attachEvent("onInit", function () { e.addContextZone(this.hdr) });
        if (this.hdr.rows.length) { this.callEvent("onInit", []) }
    }
};
dhtmlXGridObject.prototype.getHeaderMenu = function (a) {
    return this._header_menu
};
dhtmlXGridObject.prototype._hideHContext = function () {
    if (this._header_menu) { this._header_menu.hide() }
};
dhtmlXGridObject.prototype._showHContext = function (g) {
    if (typeof g == "string") { g = g.split(this.delim) }
    var h = 0;
    var a = 0;
    this._header_menu.clearAll();
    for (var e = 0; e < this.hdr.rows[1].cells.length; e++) {
        var n = this.hdr.rows[1].cells[e];
        if (!g || (g[h] && g[h] != "false")) {
            if (n.firstChild && n.firstChild.tagName == "DIV") {
                var m = n.firstChild.innerHTML
            } else {
                var m = n.innerHTML
            }
            m = m.replace(/<[^>]*>/gi, "");
            var l = !(this.isColumnHidden(h) || (this.getColWidth(h) == 0));
            this._header_menu.addCheckbox("child", this._header_menu.topId, a, h, m, l);
            a++
        }
        h += (n.colSpan || 1)
    }
};
dhtmlXGridObject.prototype._process_json_row = function (h, l) {
    h._attrs = l;
    for (var e = 0; e < h.childNodes.length; e++) { h.childNodes[e]._attrs = {} }
    if (l.userdata) {
        for (var c in l.userdata) { this.setUserData(h.idd, c, l.userdata[c]) }
    }
    l = this._c_order ? this._swapColumns(l.data) : l.data;
    for (var g = 0; g < l.length; g++) {
        if (typeof l[g] == "object" && l[g] != null) {
            h.childNodes[g]._attrs = l[g];
            if (l[g].type) { h.childNodes[g]._cellType = l[g].type }
            l[g] = l[g].value
        }
    }
    this._fillRow(h, l);
    return h
};
dhtmlXGridObject.prototype._process_js_row = function (l, m) {
    l._attrs = m;
    for (var g = 0; g < l.childNodes.length; g++) { l.childNodes[g]._attrs = {} }
    if (m.userdata) {
        for (var e in m.userdata) { this.setUserData(l.idd, e, m.userdata[e]) }
    }
    var c = [];
    for (var h = 0; h < this.columnIds.length; h++) {
        c[h] = m[this.columnIds[h]];
        if (typeof c[h] == "object" && c[h] != null) {
            l.childNodes[h]._attrs = c[h];
            if (c[h].type) { l.childNodes[h]._cellType = c[h].type }
            c[h] = c[h].value
        }
        if (!c[h] && c[h] !== 0) { c[h] = "" }
    }
    this._fillRow(l, c);
    return l
};
dhtmlXGridObject.prototype.updateFromJSON = function (a, g, c, e) {
    if (typeof g == "undefined") { g = true }
    this._refresh_mode = [true, g, c];
    this.load(a, e, "json")
};
dhtmlXGridObject.prototype._refreshFromJSON = function (e) {
    if (this._f_rowsBuffer) { this.filterBy(0, "") }
    reset = false;
    if (window.eXcell_tree) {
        eXcell_tree.prototype.setValueX = eXcell_tree.prototype.setValue;
        eXcell_tree.prototype.setValue = function (u) {
            var s = this.grid._h2.get[this.cell.parentNode.idd];
            if (s && this.cell.parentNode.valTag) { this.setLabel(u) } else { this.setValueX(u) }
        }
    }
    var r = this.cellType._dhx_find("tree");
    var h = e.parent || 0;
    var m = {};
    if (this._refresh_mode[2]) {
        if (r != -1) { this._h2.forEachChild(h, function (s) { m[s.id] = true }, this) } else { this.forEachRow(function (s) { m[s] = true }) }
    }
    var o = e.rows;
    for (var g = 0; g < o.length; g++) {
        var n = o[g];
        var a = n.id;
        m[a] = false;
        if (this.rowsAr[a] && this.rowsAr[a].tagName != "TR") {
            if (this._h2) { this._h2.get[a].buff.data = n } else { this.rowsBuffer[this.getRowIndex(a)].data = n }
            this.rowsAr[a] = n
        } else {
            if (this.rowsAr[a]) {
                this._process_json_row(this.rowsAr[a], n, -1);
                this._postRowProcessing(this.rowsAr[a], true)
            } else {
                if (this._refresh_mode[1]) {
                    var l = { idd: a, data: n, _parser: this._process_json_row, _locator: this._get_json_data };
                    var c = this.rowsBuffer.length;
                    if (this._refresh_mode[1] == "top") {
                        this.rowsBuffer.unshift(l);
                        c = 0
                    } else { this.rowsBuffer.push(l) }
                    if (this._h2) {
                        reset = true;
                        (this._h2.add(a, h)).buff = this.rowsBuffer[this.rowsBuffer.length - 1]
                    }
                    this.rowsAr[a] = n;
                    n = this.render_row(c);
                    this._insertRowAt(n, c ? -1 : 0)
                }
            }
        }
    }
    if (this._refresh_mode[2]) {
        for (a in m) {
            if (m[a] && this.rowsAr[a]) { this.deleteRow(a) }
        }
    }
    this._refresh_mode = null;
    if (window.eXcell_tree) { eXcell_tree.prototype.setValue = eXcell_tree.prototype.setValueX }
    if (reset) { this._renderSort() }
    if (this._f_rowsBuffer) {
        this._f_rowsBuffer = null;
        this.filterByAll()
    }
};
dhtmlXGridObject.prototype._process_js = function (a) {
    return this._process_json(a, "js")
};
dhtmlXGridObject.prototype._parseHeadJson = function (s) {
    if (!s.head || !s.head.length) {
        return
    }
    var a = s.head;
    var g = s.settings;
    var m = "setInitWidths";
    var o = false;
    if (g && g.colwidth == "%") { m = "setInitWidthsP" }
    if (g && g.splitat == "%") { o = g.splitat }
    if (this.hdr.rows.length > 0) { this.clearAll(true) }
    var n = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    var r = ["value", "width", "type", "align", "sort", "hidden", "id"];
    var v = ["", m, "setColTypes", "setColAlign", "setColSorting", "", "setColumnIds"];
    for (var l = 0; l < a.length; l++) {
        for (var h = 0; h < r.length; h++) { n[h].push(a[l][r[h]]) }
    }
    this.setHeader(n[0]);
    for (var l = 0; l < v.length; l++) {
        if (v[l]) { this[v[l]](n[l].join(this.delim)) }
    }
    for (var l = 0; l < a.length; l++) {
        var u = a[l].options;
        if (a[l].options) {
            if (this.cellType[l] == "clist") { this.registerCList(l, u) } else {
                var c = this.getCombo(l);
                for (var h = 0; h < u.length; h++) { c.put(u[h].id, u[h].value) }
            }
        }
    }
    this.init();
    var e = n[5].join(this.delim);
    if (this.setColHidden && e.replace(/,/g, "") != "") { this.setColHidden(e) }
    if ((o) && (this.splitAt)) { this.splitAt(o) }
};
dhtmlXGridObject.prototype._process_json = function (data, mode) {
    this._parsing = true;
    try {
        var data = data.responseText || data;
        if (typeof data == "string") {
            eval("dhtmlx.temp=" + data + ";");
            data = dhtmlx.temp
        }
    } catch (e) {
        dhx4.callEvent("onLoadXMLError", ["Incorrect JSON", (data.xmlDoc || data), this]);
        data = { rows: [] }
    }
    if (this._refresh_mode) {
        return this._refreshFromJSON(data)
    }
    if (data.head) { this._parseHeadJson(data) }
    var cr = parseInt(data.pos || 0);
    var total = parseInt(data.total_count || 0);
    var reset = false;
    if (total) {
        if (!this.rowsBuffer[total - 1]) {
            if (this.rowsBuffer.length) { reset = true }
            this.rowsBuffer[total - 1] = null
        }
        if (total < this.rowsBuffer.length) {
            this.rowsBuffer.splice(total, this.rowsBuffer.length - total);
            reset = true
        }
    }
    var userdata = mode === "js" ? data.userdata : data;
    for (var key in userdata) {
        if (mode === "js" || key != "rows") { this.setUserData("", key, userdata[key]) }
    }
    if (mode == "js" && data.collections) {
        for (var colkey in data.collections) {
            var index = this.getColIndexById(colkey);
            var colrecs = data.collections[colkey];
            if (index !== window.undefined) {
                if (this.cellType[index] == "clist") {
                    colplaindata = [];
                    for (var j = 0; j < colrecs.length; j++) { colplaindata.push(colrecs[j].label) }
                    this.registerCList(index, colplaindata)
                } else {
                    var combo = this.getCombo(index);
                    for (var j = 0; j < colrecs.length; j++) { combo.put(colrecs[j].value, colrecs[j].label) }
                }
            }
        }
    }
    if (this.isTreeGrid()) {
        return this._process_tree_json(data, null, null, mode)
    }
    if (mode == "js") {
        if (data.data) { data = data.data }
        for (var i = 0; i < data.length; i++) {
            if (this.rowsBuffer[i + cr]) {
                continue
            }
            var row = data[i];
            var id = row.id || (i + 1);
            this.rowsBuffer[i + cr] = { idd: id, data: row, _parser: this._process_js_row, _locator: this._get_js_data };
            this.rowsAr[id] = data[i]
        }
    } else {
        for (var i = 0; i < data.rows.length; i++) {
            if (this.rowsBuffer[i + cr]) {
                continue
            }
            var id = data.rows[i].id;
            this.rowsBuffer[i + cr] = { idd: id, data: data.rows[i], _parser: this._process_json_row, _locator: this._get_json_data };
            this.rowsAr[id] = data.rows[i]
        }
    }
    this.callEvent("onDataReady", []);
    if (reset && this._srnd) {
        var h = this.objBox.scrollTop;
        this._reset_view();
        this.objBox.scrollTop = h
    } else { this.render_dataset() }
    this._parsing = false
};
dhtmlXGridObject.prototype._get_json_data = function (c, a) {
    if (typeof c.data[a] == "object") {
        return c.data[a].value
    } else {
        return c.data[a]
    }
};
dhtmlXGridObject.prototype._process_tree_json = function (g, h, c, m) {
    this._parsing = true;
    var a = false;
    if (!h) {
        this.render_row = this.render_row_tree;
        a = true;
        h = g;
        c = h.parent || 0;
        if (c == "0") { c = 0 }
        if (!this._h2) { this._h2 = this._createHierarchy() }
        if (this._fake) { this._fake._h2 = this._h2 }
    }
    if (m == "js") {
        if (h.data && !c) { g = h.data }
        if (h.rows) { h = h.rows }
        for (var e = 0; e < h.length; e++) {
            var n = h[e].id;
            var l = this._h2.add(n, c);
            l.buff = { idd: n, data: h[e], _parser: this._process_js_row, _locator: this._get_js_data };
            if (h[e].open) { l.state = "minus" }
            this.rowsAr[n] = l.buff;
            this._process_tree_json(h[e], h[e], n, m)
        }
    } else {
        if (h.rows) {
            for (var e = 0; e < h.rows.length; e++) {
                var n = h.rows[e].id;
                var l = this._h2.add(n, c);
                l.buff = { idd: n, data: h.rows[e], _parser: this._process_json_row, _locator: this._get_json_data };
                if (h.rows[e].open) { l.state = "minus" }
                this.rowsAr[n] = l.buff;
                this._process_tree_json(h.rows[e], h.rows[e], n, m)
            }
        }
    }
    if (a) {
        if (c != 0) { this._h2.change(c, "state", "minus") }
        this._updateTGRState(this._h2.get[c]);
        this._h2_to_buff();
        this.callEvent("onDataReady", []);
        if (c != 0 && (this._srnd || this.pagingOn)) { this._renderSort() } else { this.render_dataset() }
        if (this._slowParse === false) { this.forEachRow(function (o) { this.render_row_tree(0, o) }) }
        this._parsing = false;
        if (c != 0 && !this._srnd) { this.callEvent("onOpenEnd", [c, 1]) }
    }
};
dhtmlXGridObject.prototype.enableMarkedCells = function (a) {
    this.markedRowsArr = new dhtmlxArray(0);
    this.markedCellsArr = new Array(0);
    this.lastMarkedRow = null;
    this.lastMarkedColumn = null;
    this.markedCells = true;
    this.lastMarkMethod = 0;
    if (arguments.length > 0) {
        if (!dhx4.s2b(a)) { this.markedCells = false }
    }
};
dhtmlXGridObject.prototype.doMark = function (e, m) {
    var l = e.parentNode.idd;
    this.setActive(true);
    if (!l) {
        return
    }
    this.editStop();
    this.cell = e;
    this.row = e.parentNode;
    var o = e._cellIndex;
    if (!m) { m = 0 }
    if (m == 0) { this.unmarkAll() } else {
        if (m == 1) {
            if (this.lastMarkedRow) {
                var c = Math.min(this.getRowIndex(l), this.getRowIndex(this.lastMarkedRow));
                var n = Math.max(this.getRowIndex(l), this.getRowIndex(this.lastMarkedRow));
                var a = Math.min(o, this.lastMarkedColumn);
                var r = Math.max(o, this.lastMarkedColumn);
                for (var h = c; h < n + 1; h++) {
                    for (var g = a; g < r + 1; g++) { this.mark(this.getRowId(h), g, true) }
                }
            }
        } else {
            if (m == 2) {
                if (this.markedRowsArr._dhx_find(l) != -1) {
                    for (var s = 0; s < this.markedCellsArr[l].length; s++) {
                        if (this.markedCellsArr[l][s] == o) {
                            this.mark(l, o, false);
                            return true
                        }
                    }
                }
            }
        }
    }
    if (!this.markedCellsArr[l]) { this.markedCellsArr[l] = new dhtmlxArray(0) }
    if (m != 1) { this.mark(l, o) }
    this.moveToVisible(this.cells(l, o).cell);
    this.lastMarkedRow = l;
    this.lastMarkedColumn = o;
    this.lastMarkMethod = m
};
dhtmlXGridObject.prototype.mark = function (e, c, g) {
    if (arguments.length > 2) {
        if (!dhx4.s2b(g)) {
            this.cells(e, c).cell.className = this.cells(e, c).cell.className.replace(/cellselected/g, "");
            if (this.markedRowsArr._dhx_find(e) != -1) {
                var a = this.markedCellsArr[e]._dhx_find(c);
                if (a != -1) {
                    this.markedCellsArr[e]._dhx_removeAt(a);
                    if (this.markedCellsArr[e].length == 0) { this.markedRowsArr._dhx_removeAt(this.markedRowsArr._dhx_find(e)) }
                    this.callEvent("onCellUnMarked", [e, c])
                }
            }
            return true
        }
    }
    this.cells(e, c).cell.className += " cellselected";
    if (this.markedRowsArr._dhx_find(e) == -1) { this.markedRowsArr[this.markedRowsArr.length] = e }
    if (!this.markedCellsArr[e]) { this.markedCellsArr[e] = new dhtmlxArray(0) }
    if (this.markedCellsArr[e]._dhx_find(c) == -1) {
        this.markedCellsArr[e][this.markedCellsArr[e].length] = c;
        this.callEvent("onCellMarked", [e, c])
    }
};
dhtmlXGridObject.prototype.unmarkAll = function () {
    if (this.markedRowsArr) {
        for (var a = 0; a < this.markedRowsArr.length; a++) {
            var e = this.markedRowsArr[a];
            if (this.rowsAr[e]) {
                for (var c = 0; c < this.markedCellsArr[e].length; c++) {
                    this.callEvent("onCellUnMarked", [e, this.markedCellsArr[e][c]]);
                    this.cells(e, this.markedCellsArr[e][c]).cell.className = this.cells(e, this.markedCellsArr[e][c]).cell.className.replace(/cellselected/g, "")
                }
            }
        }
        this.markedRowsArr = new dhtmlxArray(0);
        this.markedCellsArr = new Array(0)
    }
    return true
};
dhtmlXGridObject.prototype.getMarked = function () {
    var e = new Array();
    if (this.markedRowsArr) {
        for (var a = 0; a < this.markedRowsArr.length; a++) {
            var g = this.markedRowsArr[a];
            for (var c = 0; c < this.markedCellsArr[g].length; c++) { e[e.length] = [g, this.markedCellsArr[g][c]] }
        }
    }
    return e
};

function eXcell_math(a) {
    if (a) {
        this.cell = a;
        this.grid = this.cell.parentNode.grid
    }
    this.edit = function () {
        this.grid.editor = new eXcell_ed(this.cell);
        this.grid.editor.fix_self = true;
        this.grid.editor.getValue = this.cell.original ? (function () {
            return this.cell.original
        }) : this.getValue;
        this.grid.editor.setValue = this.setValue;
        this.grid.editor.edit()
    };
    this.isDisabled = function () {
        return !this.grid._mathEdit
    };
    this.setValue = function (c) {
        c = this.grid._compileSCL(c, this.cell, this.fix_self);
        if (this.grid._strangeParams[this.cell._cellIndex]) { this.grid.cells5(this.cell, this.grid._strangeParams[this.cell._cellIndex]).setValue(c) } else {
            this.setCValue(c);
            this.cell._clearCell = false
        }
    };
    this.getValue = function () {
        if (this.grid._strangeParams[this.cell._cellIndex]) {
            return this.grid.cells5(this.cell, this.grid._strangeParams[this.cell._cellIndex]).getValue()
        }
        return this.cell.innerHTML
    }
}
eXcell_math.prototype = new eXcell;
dhx4.attachEvent("onGridCreated", function (a) {
    a._reset_math();
    a.attachEvent("onClearAll", a._reset_math);
    a.attachEvent("onCellChanged", function (m, l) {
        if (this._mat_links[m]) {
            var c = this._mat_links[m][l];
            if (c) {
                for (var h = 0; h < c.length; h++) {
                    if (c[h].parentNode) { this.cells5(c[h]).setValue(this._calcSCL(c[h])) }
                }
            }
        }
        if (!this._parsing && this._aggregators[l]) {
            var g = this._h2.get[m].parent.id;
            if (g != 0) {
                var e = this.cells(g, l);
                e.setValue(this._calcSCL(e.cell))
            }
        }
    });
    a.attachEvent("onAfterRowDeleted", function (h, e) {
        if (e != 0) {
            if (!this._parsing && this._aggregators.length) {
                for (var g = 0; g < this._aggregators.length; g++) {
                    if (this._aggregators[g]) {
                        var c = this.cells(e, g);
                        c.setValue(this._calcSCL(c.cell))
                    }
                }
            }
        }
        return true
    });
    a.attachEvent("onXLE", a._refresh_math)
});
dhtmlXGridObject.prototype._reset_math = function () {
    this._mat_links = {};
    this._aggregators = []
};
dhtmlXGridObject.prototype._refresh_math = function () {
    for (var a = 0; a < this._aggregators.length; a++) {
        if (this._aggregators[a]) {
            this._h2.forEachChild(0, function (e) {
                if (e.childs.length != 0) {
                    var c = this.cells(e.id, a);
                    c.setValue(this._calcSCL(c.cell))
                }
            }, this)
        }
    }
};
dhtmlXGridObject.prototype.refreshMath = function (a) {
    this._mat_links = {};
    for (var c = 0; c < this.getColumnsNum() ; c++) {
        if (this.getColType(c) == "math") {
            this.forEachRow(function (g) {
                var e = this.cells(g, c);
                e.setValue(e.cell.original || e.getValue())
            })
        }
    }
};
dhtmlXGridObject.prototype.enableMathSerialization = function (a) { this._mathSerialization = dhx4.s2b(a) };
dhtmlXGridObject.prototype.setMathRound = function (a) {
    this._roundDl = a;
    this._roundD = Math.pow(10, a)
};
dhtmlXGridObject.prototype.enableMathEditing = function (a) { this._mathEdit = dhx4.s2b(a) };
dhtmlXGridObject.prototype._calcSCL = function (cell) {
    if (!cell._code) {
        return this.cells5(cell).getValue()
    }
    try {
        dhtmlx.agrid = this;
        var z = eval(cell._code)
    } catch (e) {
        return ("#SCL")
    }
    if (this._roundD) {
        var pre = Math.abs(z) < 1 ? "0" : "";
        if (z < 0) { pre = "-" + pre }
        z = Math.round(Math.abs(z) * this._roundD).toString();
        if (z == 0) {
            return 0
        }
        if (this._roundDl > 0) {
            var n = z.length - this._roundDl;
            if (n < 0) {
                z = ("000000000" + z).substring(9 + n);
                n = 0
            }
            return (pre + z.substring(0, n) + "." + z.substring(n, z.length))
        }
        return pre + z
    }
    return z
};
dhtmlXGridObject.prototype._countTotal = function (l, c) {
    var a = 0;
    var h = this._h2.get[l];
    for (var e = 0; e < h.childs.length; e++) {
        if (!h.childs[e].buff) {
            return a
        }
        if (h.childs[e].buff._parser) {
            a = 0;
            this._h2.forEachChild(l, function (m) {
                if (m.childs.length == 0) {
                    var n = parseFloat(this._get_cell_value(m.buff, c), 10);
                    if (n) { a += n }
                }
            }, this);
            return a
        }
        var g = parseFloat(this._get_cell_value(h.childs[e].buff, c), 10);
        if (g) { a += g }
    }
    return a
};
dhtmlXGridObject.prototype._compileSCL = function (e, c, a) {
    if (e === null || e === window.undefined) {
        return e
    }
    e = e.toString();
    if (e.indexOf("=") != 0 || !c.parentNode) {
        this._reLink([], c);
        if (a) { c._code = c.original = null }
        return e
    }
    c.original = e;
    var l = null;
    e = e.replace("=", "");
    if (e.indexOf("sum") != -1) {
        e = e.replace("sum", "(dhtmlx.agrid._countTotal('" + c.parentNode.idd + "'," + c._cellIndex + "))");
        if (!this._aggregators) { this._aggregators = [] }
        this._aggregators[c._cellIndex] = "sum";
        c._code = e;
        return this._parsing ? "" : this._calcSCL(c)
    }
    if (e.indexOf("[[") != -1) {
        var h = /(\[\[([^\,]*)\,([^\]]*)]\])/g;
        dhtmlx.agrid = this;
        l = l || (new Array());
        e = e.replace(h, function (n, m, r, o) {
            if (r == "-") { r = c.parentNode.idd }
            if (r.indexOf("#") == 0) { r = dhtmlx.agrid.getRowId(r.replace("#", "")) }
            l[l.length] = [r, o];
            return '(parseFloat(dhtmlx.agrid.cells("' + r + '",' + o + ").getValue(),10))"
        })
    }
    if (e.indexOf(":") != -1) {
        var h = /:(\w+)/g;
        dhtmlx.agrid = this;
        var g = c.parentNode.idd;
        l = l || (new Array());
        e = e.replace(h, function (n, m, r, o) {
            l[l.length] = [g, dhtmlx.agrid.getColIndexById(m)];
            return '(parseFloat(dhtmlx.agrid.cells("' + g + '",dhtmlx.agrid.getColIndexById("' + m + '")).getValue(),10))'
        })
    } else {
        var h = /c([0-9]+)/g;
        dhtmlx.agrid = this;
        var g = c.parentNode.idd;
        l = l || (new Array());
        e = e.replace(h, function (n, m, r, o) {
            l[l.length] = [g, m];
            return '(parseFloat(dhtmlx.agrid.cells("' + g + '",' + m + ").getValue(),10))"
        })
    }
    this._reLink(l, c);
    c._code = e;
    return this._calcSCL(c)
};
dhtmlXGridObject.prototype._reLink = function (c, a) {
    if (!c.length) {
        return
    }
    for (var g = 0; g < c.length; g++) {
        if (!this._mat_links[c[g][0]]) { this._mat_links[c[g][0]] = {} }
        var e = this._mat_links[c[g][0]];
        if (!e[c[g][1]]) { e[c[g][1]] = [] }
        e[c[g][1]].push(a)
    }
};
// if (_isKHTML) {
//     (function() {
//         var a = String.prototype.replace;
//         String.prototype.replace = function(r, e) {
//             if (typeof e != "function") {
//                 return a.apply(this, arguments)
//             }
//             var h = "" + this;
//             var n = e;
//             if (!(r instanceof RegExp)) {
//                 var m = h.indexOf(r);
//                 return (m == -1 ? h : a.apply(h, [r, n(r, m, h)]))
//             }
//             var c = r;
//             var s = [];
//             var l = c.lastIndex;
//             var o;
//             while ((o = c.exec(h)) != null) {
//                 var m = o.index;
//                 var g = o.concat(m, h);
//                 s.push(h.slice(l, m), n.apply(null, g).toString());
//                 if (!c.global) {
//                     l += RegExp.lastMatch.length;
//                     break
//                 } else { l = c.lastIndex }
//             }
//             s.push(h.slice(l));
//             return s.join("")
//         }
//     })()
// }
dhtmlXGridObject.prototype.insertColumn = function (e, n, r, a, m, o, u, c, h) {
    e = parseInt(e);
    if (e > this._cCount) { e = this._cCount }
    if (!this._cMod) { this._cMod = this._cCount }
    this._processAllArrays(this._cCount, e - 1, [(n || "&nbsp;"), (a || 100), (r || "ed"), (o || "left"), (u || ""), (m || "na"), (h || ""), "", this._cMod, (a || 100)]);
    this._processAllRows("_addColInRow", e);
    if (typeof (n) == "object") {
        for (var l = 1; l < this.hdr.rows.length; l++) {
            if (n[l - 1] == "#rspan") {
                var w = l - 1;
                var v = false;
                var s = null;
                while (!v) {
                    var s = this.hdr.rows[w];
                    for (var g = 0; g < s.cells.length; g++) {
                        if (s.cells[g]._cellIndex == e) {
                            v = g;
                            break
                        }
                    }
                    w--
                }
                this.hdr.rows[w + 1].cells[g].rowSpan = (this.hdr.rows[w].cells[g].rowSpan || 1) + 1
            } else { this.setHeaderCol(e, (n[l - 1] || "&nbsp;"), l) }
        }
    } else { this.setHeaderCol(e, (n || "&nbsp;")) }
    this.hdr.rows[0].cells[e];
    this._cCount++;
    this._cMod++;
    this._master_row = null;
    this.setSizes()
};
dhtmlXGridObject.prototype.deleteColumn = function (a) {
    a = parseInt(a);
    if (this._cCount == 0) {
        return
    }
    if (!this._cMod) { this._cMod = this._cCount }
    if (a >= this._cCount) {
        return
    }
    this._processAllArrays(a, this._cCount - 1, [null, null, null, null, null, null, null, null, null, null, null]);
    this._processAllRows("_deleteColInRow", a);
    this._cCount--;
    this._master_row = null;
    this.setSizes()
};
dhtmlXGridObject.prototype._processAllRows = function (h, a, c) {
    this[h](this.obj.rows[0], a, c, 0);
    var g = this.hdr.rows.length;
    for (var e = 0; e < g; e++) { this[h](this.hdr.rows[e], a, c, e) }
    if (this.ftr) {
        var g = this.ftr.firstChild.rows.length;
        for (var e = 0; e < g; e++) { this[h](this.ftr.firstChild.rows[e], a, c, e) }
    }
    this.forEachRow(function (l) {
        if (this.rowsAr[l] && this.rowsAr[l].tagName == "TR") { this[h](this.rowsAr[l], a, c, -1) }
    })
};
dhtmlXGridObject.prototype._processAllArrays = function (r, a, o) {
    var h = ["hdrLabels", "initCellWidth", "cellType", "cellAlign", "cellVAlign", "fldSort", "columnColor", "_hrrar", "_c_order"];
    if (this.cellWidthPX.length) { h.push("cellWidthPX") }
    if (this.cellWidthPC.length) { h.push("cellWidthPC") }
    if (this._col_combos) { h.push("_col_combos") }
    if (this._mCols) { h[h.length] = "_mCols" }
    if (this.columnIds) { h[h.length] = "columnIds" }
    if (this._maskArr) { h.push("_maskArr") }
    if (this._drsclmW) { h.push("_drsclmW") }
    if (this._RaSeCol) { h.push("_RaSeCol") }
    if (this._hm_config) { h.push("_hm_config") }
    if (this._drsclmn) { h.push("_drsclmn") }
    if (this.clists) { h.push("clists") }
    if (this._validators && this._validators.data) { h.push(this._validators.data) }
    h.push("combos");
    if (this._customSorts) { h.push("_customSorts") }
    if (this._aggregators) { h.push("_aggregators") }
    var n = (r <= a);
    if (!this._c_order) {
        this._c_order = new Array();
        var e = this._cCount;
        for (var m = 0; m < e; m++) { this._c_order[m] = m }
    }
    for (var m = 0; m < h.length; m++) {
        var s = this[h[m]] || h[m];
        if (s) {
            if (n) {
                var c = s[r];
                for (var g = r; g < a; g++) { s[g] = s[g + 1] }
                s[a] = c
            } else {
                var c = s[r];
                for (var g = r; g > (a + 1) ; g--) { s[g] = s[g - 1] }
                s[a + 1] = c
            }
            if (o) { s[a + (n ? 0 : 1)] = o[m] }
        }
    }
};
dhtmlXGridObject.prototype.moveColumn = function (a, c) {
    c--;
    a = parseInt(a);
    c = parseInt(c);
    if (c < a) {
        var e = c + 1
    } else {
        var e = c
    }
    if (!this.callEvent("onBeforeCMove", [a, e])) {
        return false
    }
    if (a == e) {
        return
    }
    this.editStop();
    this._processAllRows("_moveColInRow", a, c);
    this._processAllArrays(a, c);
    if (this.fldSorted) { this.setSortImgPos(this.fldSorted._cellIndex) }
    this.callEvent("onAfterCMove", [a, e])
};
dhtmlXGridObject.prototype._swapColumns = function (c) {
    var e = new Array();
    for (var a = 0; a < this._cCount; a++) {
        var g = c[this._c_order[a]];
        if (typeof (g) == "undefined") { g = "" }
        e[a] = g
    }
    return e
};
dhtmlXGridObject.prototype._moveColInRow = function (l, a, e) {
    var m = l.childNodes[a];
    var h = l.childNodes[e + 1];
    if (!m) {
        return
    }
    if (h) { l.insertBefore(m, h) } else { l.appendChild(m) }
    for (var g = 0; g < l.childNodes.length; g++) { l.childNodes[g]._cellIndex = l.childNodes[g]._cellIndexS = g }
};
dhtmlXGridObject.prototype._addColInRow = function (n, l, a, g) {
    var h = l;
    if (n._childIndexes) {
        if (n._childIndexes[l - 1] == n._childIndexes[l] || !n.childNodes[n._childIndexes[l - 1]]) {
            for (var e = n._childIndexes.length; e >= l; e--) { n._childIndexes[e] = e ? (n._childIndexes[e - 1] + 1) : 0 }
            n._childIndexes[l]--
        } else {
            for (var e = n._childIndexes.length; e >= l; e--) { n._childIndexes[e] = e ? (n._childIndexes[e - 1] + 1) : 0 }
        }
        var h = n._childIndexes[l]
    }
    var o = n.childNodes[h];
    var m = document.createElement((g) ? "TD" : "TH");
    if (g) { m._attrs = {} } else { m.style.width = (parseInt(this.cellWidthPX[l]) || "100") + "px" }
    if (o) { n.insertBefore(m, o) } else { n.appendChild(m) }
    if (this.dragAndDropOff && n.idd) { this.dragger.addDraggableItem(n.childNodes[h], this) }
    for (var e = h + 1; e < n.childNodes.length; e++) { n.childNodes[e]._cellIndex = n.childNodes[e]._cellIndexS = n.childNodes[e]._cellIndex + 1 }
    if (n.childNodes[h]) { n.childNodes[h]._cellIndex = n.childNodes[h]._cellIndexS = l }
    if (n.idd || typeof (n.idd) != "undefined") {
        this.cells3(n, l).setValue("");
        m.align = this.cellAlign[l];
        m.style.verticalAlign = this.cellVAlign[l];
        m.bgColor = this.columnColor[l]
    } else {
        if (m.tagName == "TD") {
            if (!n.idd && this.forceDivInHeader) { m.innerHTML = "<div class='hdrcell'>&nbsp;</div>" } else { m.innerHTML = "&nbsp;" }
        }
    }
};
dhtmlXGridObject.prototype._deleteColInRow = function (n, m) {
    var e = m;
    if (n._childIndexes) { m = n._childIndexes[m] }
    var o = n.childNodes[m];
    if (!o) {
        return
    }
    if (o.colSpan && o.colSpan > 1 && o.parentNode.idd) {
        var h = o.colSpan - 1;
        var a = this.cells4(o).getValue();
        this.setColspan(o.parentNode.idd, o._cellIndex, 1);
        if (h > 1) {
            var l = o._cellIndex * 1;
            this.setColspan(o.parentNode.idd, l + 1, h);
            this.cells(o.parentNode.idd, o._cellIndex * 1 + 1).setValue(a);
            n._childIndexes.splice(l, 1);
            for (var g = l; g < n._childIndexes.length; g++) { n._childIndexes[g] -= 1 }
        }
    } else {
        if (n._childIndexes) {
            n._childIndexes.splice(e, 1);
            for (var g = e; g < n._childIndexes.length; g++) { n._childIndexes[g]-- }
        }
    }
    if (o) { n.removeChild(o) }
    for (var g = m; g < n.childNodes.length; g++) { n.childNodes[g]._cellIndex = n.childNodes[g]._cellIndexS = n.childNodes[g]._cellIndex - 1 }
};
dhtmlXGridObject.prototype.enableColumnMove = function (c, a) {
    this._mCol = dhx4.s2b(c);
    if (typeof (a) != "undefined") { this._mCols = a.split(",") }
    if (!this._mmevTrue) {
        dhtmlxEvent(this.hdr, "mousedown", this._startColumnMove);
        dhtmlxEvent(document.body, "mousemove", this._onColumnMove);
        dhtmlxEvent(document.body, "mouseup", this._stopColumnMove);
        this._mmevTrue = true
    }
};
dhtmlXGridObject.prototype._startColumnMove = function (h) {
    h = h || event;
    var g = h.target || h.srcElement;
    var a = g;
    while (a.tagName != "TABLE") { a = a.parentNode }
    var c = a.grid;
    if (!c) {
        return
    }
    c.setActive();
    if (!c._mCol || h.button == 2) {
        return
    }
    g = c.getFirstParentOfType(g, "TD");
    if (g.style.cursor != "default") {
        return true
    }
    if ((c) && (!c._colInMove)) {
        c.resized = null;
        if ((!c._mCols) || (c._mCols[g._cellIndex] == "true")) { c._colInMove = g._cellIndex + 1 }
    }
    c._colInMovePos = { x: h.clientX, y: h.clientY };
    return true
};
dhtmlXGridObject.prototype._onColumnMove = function (m) {
    m = m || event;
    var a = window.globalActiveDHTMLGridObject;
    if ((a) && (a._colInMove)) {
        var l = Math.max(Math.abs(m.clientX - a._colInMovePos.x), Math.abs(m.clientY - a._colInMovePos.y));
        if (l < 20) {
            return
        }
        if (a._hideHContext) { a._hideHContext() }
        if (typeof (a._colInMove) != "object") {
            var n = document.createElement("DIV");
            n._aIndex = (a._colInMove - 1);
            n._bIndex = null;
            n.innerHTML = a.getHeaderCol(n._aIndex);
            n.className = "dhx_dragColDiv";
            n.style.position = "absolute";
            document.body.appendChild(n);
            a._colInMove = n
        }
        var h = [];
        h[0] = (document.body.scrollLeft || document.documentElement.scrollLeft);
        h[1] = (document.body.scrollTop || document.documentElement.scrollTop);
        a._colInMove.style.left = m.clientX + h[0] + 8 + "px";
        a._colInMove.style.top = m.clientY + h[1] + 8 + "px";
        var c = m.target || m.srcElement;
        while ((c) && (typeof (c._cellIndexS) == "undefined")) { c = c.parentNode }
        if (a._colInMove._oldHe) {
            a._colInMove._oldHe.className = a._colInMove._oldHe.className.replace(/columnTarget(L|R)/g, "");
            a._colInMove._oldHe = null;
            a._colInMove._bIndex = null
        }
        if (c) {
            if (a.hdr.rows[1]._childIndexes) {
                var g = a.hdr.rows[1].cells[a.hdr.rows[1]._childIndexes[c._cellIndexS]]
            } else {
                var g = a.hdr.rows[1].cells[c._cellIndexS]
            }
            var n = m.clientX - (dhx4.absLeft(g) - a.hdrBox.scrollLeft);
            if (n / g.offsetWidth > 0.5) {
                g.className += " columnTargetR";
                a._colInMove._bIndex = c._cellIndexS
            } else {
                g.className += " columnTargetL";
                a._colInMove._bIndex = c._cellIndexS - 1
            }
            if (g.offsetLeft < (a.objBox.scrollLeft + 20)) { a.objBox.scrollLeft = Math.max(0, g.offsetLeft - 20) }
            if ((g.offsetLeft + g.offsetWidth - a.objBox.scrollLeft) > (a.objBox.offsetWidth - 20)) { a.objBox.scrollLeft = Math.min(a.objBox.scrollLeft + g.offsetWidth + 20, a.objBox.scrollWidth - a.objBox.offsetWidth) }
            a._colInMove._oldHe = g
        }
        m.cancelBubble = true;
        return false
    }
    return true
};
dhtmlXGridObject.prototype._stopColumnMove = function (c) {
    c = c || event;
    var a = window.globalActiveDHTMLGridObject;
    if ((a) && (a._colInMove)) {
        if (typeof (a._colInMove) == "object") {
            a._colInMove.parentNode.removeChild(a._colInMove);
            if (a._colInMove._bIndex != null) { a.moveColumn(a._colInMove._aIndex, a._colInMove._bIndex + 1) }
            if (a._colInMove._oldHe) { a._colInMove._oldHe.className = a._colInMove._oldHe.className.replace(/columnTarget(L|R)/g, "") }
            a._colInMove._oldHe = null;
            a._colInMove.grid = null;
            a.resized = true
        }
        a._colInMove = 0
    }
    return true
};
dhtmlXGridObject.prototype.mouseOverHeader = function (c) {
    var a = this;
    dhtmlxEvent(this.hdr, "mousemove", function (h) {
        h = h || window.event;
        var g = h.target || h.srcElement;
        if (g.tagName != "TD") { g = a.getFirstParentOfType(g, "TD") }
        if (g && (typeof (g._cellIndex) != "undefined")) { c(g.parentNode.rowIndex, g._cellIndex) }
    })
};
dhtmlXGridObject.prototype.mouseOver = function (c) {
    var a = this;
    dhtmlxEvent(this.obj, "mousemove", function (h) {
        h = h || window.event;
        var g = h.target || h.srcElement;
        if (g.tagName != "TD") { g = a.getFirstParentOfType(g, "TD") }
        if (g && (typeof (g._cellIndex) != "undefined")) { c(g.parentNode.rowIndex, g._cellIndex) }
    })
};
dhtmlXGridObject.prototype.enablePaging = function (l, g, c, h, a, e) {
    this._pgn_parentObj = typeof (h) == "string" ? document.getElementById(h) : h;
    this._pgn_recInfoParentObj = typeof (e) == "string" ? document.getElementById(e) : e;
    this.pagingOn = l;
    this.showRecInfo = a;
    this.rowsBufferOutSize = parseInt(g);
    this.currentPage = 1;
    this.pagesInGroup = parseInt(c);
    this._init_pgn_events();
    this.setPagingSkin("default")
};
dhtmlXGridObject.prototype.setXMLAutoLoading = function (a, c) {
    this.xmlFileUrl = a;
    this._dpref = c
};
dhtmlXGridObject.prototype.changePageRelative = function (a) { this.changePage(this.currentPage + a) };
dhtmlXGridObject.prototype.changePage = function (a) {
    if (arguments.length == 0) { a = this.currentPage || 0 }
    a = parseInt(a);
    a = Math.max(1, Math.min(a, Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)));
    if (!this.callEvent("onBeforePageChanged", [this.currentPage, a])) {
        return
    }
    this.currentPage = parseInt(a);
    this._reset_view();
    this._fixAlterCss();
    this.callEvent("onPageChanged", this.getStateOfView())
};
dhtmlXGridObject.prototype.setPagingSkin = function (a) {
    this._pgn_skin = this["_pgn_" + a];
    if (a == "toolbar") { this._pgn_skin_tlb = arguments[1] }
};
dhtmlXGridObject.prototype.setPagingTemplates = function (e, c) {
    this._pgn_templateA = this._pgn_template_compile(e);
    this._pgn_templateB = this._pgn_template_compile(c);
    this._page_skin_update()
};
dhtmlXGridObject.prototype._page_skin_update = function (a) {
    if (!this.pagesInGroup) { this.pagesInGroup = Math.ceil(Math.min(5, this.rowsBuffer.length / this.rowsBufferOutSize)) }
    var c = Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize);
    if (c && c < this.currentPage) {
        return this.changePage(c)
    }
    if (this.pagingOn && this._pgn_skin) { this._pgn_skin.apply(this, this.getStateOfView()) }
};
dhtmlXGridObject.prototype._init_pgn_events = function (a) {
    this.attachEvent("onXLE", this._page_skin_update);
    this.attachEvent("onClearAll", this._page_skin_update);
    this.attachEvent("onPageChanged", this._page_skin_update);
    this.attachEvent("onGridReconstructed", this._page_skin_update);
    this._init_pgn_events = function () { }
};
dhtmlXGridObject.prototype._pgn_default = function (e, g, a) {
    if (!this.pagingBlock) {
        this.pagingBlock = document.createElement("DIV");
        this.pagingBlock.className = "pagingBlock";
        this.recordInfoBlock = document.createElement("SPAN");
        this.recordInfoBlock.className = "recordsInfoBlock";
        if (!this._pgn_parentObj) {
            return
        }
        this._pgn_parentObj.appendChild(this.pagingBlock);
        if (this._pgn_recInfoParentObj && this.showRecInfo) { this._pgn_recInfoParentObj.appendChild(this.recordInfoBlock) }
        if (!this._pgn_templateA) {
            this._pgn_templateA = this._pgn_template_compile("[prevpages:&lt;:&nbsp;] [currentpages:,&nbsp;] [nextpages:&gt;:&nbsp;]");
            this._pgn_templateB = this._pgn_template_compile("Results <b>[from]-[to]</b> of <b>[total]</b>")
        }
    }
    var c = this.getStateOfView();
    this.pagingBlock.innerHTML = this._pgn_templateA.apply(this, c);
    this.recordInfoBlock.innerHTML = this._pgn_templateB.apply(this, c);
    this._pgn_template_active(this.pagingBlock);
    this._pgn_template_active(this.recordInfoBlock);
    this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_block = function (c) {
    var h = Math.floor((this.currentPage - 1) / this.pagesInGroup) * this.pagesInGroup;
    var a = Math.min(Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize), h + this.pagesInGroup);
    var g = [];
    for (var e = h + 1; e <= a; e++) {
        if (e == this.currentPage) { g.push("<a class='dhx_not_active'><b>" + e + "</b></a>") } else { g.push("<a onclick='this.grid.changePage(" + e + "); return false;'>" + e + "</a>") }
    }
    return g.join(c)
};
dhtmlXGridObject.prototype._pgn_link = function (g, c, e) {
    if (g == "prevpages" || g == "prev") {
        if (this.currentPage == 1) {
            return e
        }
        return "<a onclick='this.grid.changePageRelative(-1*" + (g == "prev" ? "1" : "this.grid.pagesInGroup") + "); return false;'>" + c + "</a>"
    }
    if (g == "nextpages" || g == "next") {
        if (this.rowsBuffer.length / this.rowsBufferOutSize <= this.currentPage) {
            return e
        }
        if (this.rowsBuffer.length / (this.rowsBufferOutSize * (g == "next" ? "1" : this.pagesInGroup)) <= 1) {
            return e
        }
        return "<a onclick='this.grid.changePageRelative(" + (g == "next" ? "1" : "this.grid.pagesInGroup") + "); return false;'>" + c + "</a>"
    }
    if (g == "current") {
        var a = this.currentPage + (c ? parseInt(c) : 0);
        if (a < 1 || Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize) < a) {
            return e
        }
        return "<a " + (a == this.currentPage ? "class='dhx_active_page_link' " : "") + "onclick='this.grid.changePage(" + a + "); return false;'>" + a + "</a>"
    }
    return c
};
dhtmlXGridObject.prototype._pgn_template_active = function (e) {
    var a = e.getElementsByTagName("A");
    if (a) {
        for (var c = 0; c < a.length; c++) { a[c].grid = this }
    }
};
dhtmlXGridObject.prototype._pgn_template_compile = function (a) {
    a = a.replace(/\[([^\]]*)\]/g, function (e, c) {
        c = c.split(":");
        switch (c[0]) {
            case "from":
                return '"+(arguments[1]*1+(arguments[2]*1?1:0))+"';
            case "total":
                return '"+arguments[3]+"';
            case "to":
                return '"+arguments[2]+"';
            case "current":
            case "prev":
            case "next":
            case "prevpages":
            case "nextpages":
                return "\"+this._pgn_link('" + c[0] + "','" + c[1] + "','" + c[2] + "')+\"";
            case "currentpages":
                return "\"+this._pgn_block('" + c[1] + "')+\""
        }
    });
    return new Function('return "' + a + '";')
};
dhtmlXGridObject.prototype.i18n.paging = { results: "Results", records: "Records from ", to: " to ", page: "Page ", perpage: "rows per page", first: "To first Page", previous: "Previous Page", found: "Found records", next: "Next Page", last: "To last Page", of: " of ", notfound: "No Records Found" };
dhtmlXGridObject.prototype.setPagingWTMode = function (a, c, e, g) { this._WTDef = [a, c, e, g] };
dhtmlXGridObject.prototype._pgn_bricks = function (n, a, e) {
    var h = (this.skin_name || "").split("_")[1];
    var c = "";
    if (h == "light" || h == "modern" || h == "skyblue") { c = "_" + h }
    this.pagerElAr = new Array();
    this.pagerElAr.pagerCont = document.createElement("DIV");
    this.pagerElAr.pagerBord = document.createElement("DIV");
    this.pagerElAr.pagerLine = document.createElement("DIV");
    this.pagerElAr.pagerBox = document.createElement("DIV");
    this.pagerElAr.pagerInfo = document.createElement("DIV");
    this.pagerElAr.pagerInfoBox = document.createElement("DIV");
    var m = (this.globalBox || this.objBox);
    this.pagerElAr.pagerCont.style.width = m.clientWidth + "px";
    this.pagerElAr.pagerCont.style.overflow = "hidden";
    this.pagerElAr.pagerCont.style.clear = "both";
    this.pagerElAr.pagerBord.className = "dhx_pbox" + c;
    this.pagerElAr.pagerLine.className = "dhx_pline" + c;
    this.pagerElAr.pagerBox.style.clear = "both";
    this.pagerElAr.pagerInfo.className = "dhx_pager_info" + c;
    this.pagerElAr.pagerCont.appendChild(this.pagerElAr.pagerBord);
    this.pagerElAr.pagerCont.appendChild(this.pagerElAr.pagerLine);
    this.pagerElAr.pagerCont.appendChild(this.pagerElAr.pagerInfo);
    this.pagerElAr.pagerLine.appendChild(this.pagerElAr.pagerBox);
    this.pagerElAr.pagerInfo.appendChild(this.pagerElAr.pagerInfoBox);
    this._pgn_parentObj.innerHTML = "";
    this._pgn_parentObj.appendChild(this.pagerElAr.pagerCont);
    if (this.rowsBuffer.length > 0) {
        var l = 20;
        var u = 22;
        if (n > this.pagesInGroup) {
            var r = document.createElement("DIV");
            var o = document.createElement("DIV");
            r.className = "dhx_page" + c;
            o.innerHTML = "&larr;";
            r.appendChild(o);
            this.pagerElAr.pagerBox.appendChild(r);
            var s = this;
            r.pgnum = (Math.ceil(n / this.pagesInGroup) - 1) * this.pagesInGroup;
            r.onclick = function () { s.changePage(this.pgnum) };
            l += u
        }
        for (var g = 1; g <= this.pagesInGroup; g++) {
            var r = document.createElement("DIV");
            var o = document.createElement("DIV");
            r.className = "dhx_page" + c;
            pageNumber = ((Math.ceil(n / this.pagesInGroup) - 1) * this.pagesInGroup) + g;
            if (pageNumber > Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)) {
                break
            }
            o.innerHTML = pageNumber;
            r.appendChild(o);
            if (n == pageNumber) {
                r.className += " dhx_page_active" + c;
                o.className = "dhx_page_active" + c
            } else {
                var s = this;
                r.pgnum = pageNumber;
                r.onclick = function () { s.changePage(this.pgnum) }
            }
            l += (parseInt(u / 3) * pageNumber.toString().length) + 15;
            o.style.width = (parseInt(u / 3) * pageNumber.toString().length) + 8 + "px";
            this.pagerElAr.pagerBox.appendChild(r)
        }
        if (Math.ceil(n / this.pagesInGroup) * this.pagesInGroup < Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize)) {
            var r = document.createElement("DIV");
            var o = document.createElement("DIV");
            r.className = "dhx_page" + c;
            o.innerHTML = "&rarr;";
            r.appendChild(o);
            this.pagerElAr.pagerBox.appendChild(r);
            var s = this;
            r.pgnum = (Math.ceil(n / this.pagesInGroup) * this.pagesInGroup) + 1;
            r.onclick = function () { s.changePage(this.pgnum) };
            l += u
        }
        this.pagerElAr.pagerLine.style.width = l + "px"
    }
    if (this.rowsBuffer.length > 0 && this.showRecInfo) { this.pagerElAr.pagerInfoBox.innerHTML = this.i18n.paging.records + (a + 1) + this.i18n.paging.to + e + this.i18n.paging.of + this.rowsBuffer.length } else {
        if (this.rowsBuffer.length == 0) {
            this.pagerElAr.pagerLine.parentNode.removeChild(this.pagerElAr.pagerLine);
            this.pagerElAr.pagerInfoBox.innerHTML = this.i18n.paging.notfound
        }
    }
    this.pagerElAr.pagerBox.appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
    this.pagerElAr.pagerBord.appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
    this.pagerElAr.pagerCont.appendChild(document.createElement("SPAN")).innerHTML = "&nbsp;";
    this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_toolbar = function (l, m, c) {
    if (!this.aToolBar) { this.aToolBar = this._pgn_createToolBar() }
    var h = Math.ceil(this.rowsBuffer.length / this.rowsBufferOutSize);
    if (this._WTDef[0]) {
        this.aToolBar.enableItem("right");
        this.aToolBar.enableItem("rightabs");
        this.aToolBar.enableItem("left");
        this.aToolBar.enableItem("leftabs");
        if (this.currentPage >= h) {
            this.aToolBar.disableItem("right");
            this.aToolBar.disableItem("rightabs")
        }
        if (this.currentPage == 1) {
            this.aToolBar.disableItem("left");
            this.aToolBar.disableItem("leftabs")
        }
    }
    if (this._WTDef[2]) {
        var g = this;
        this.aToolBar.forEachListOption("pages", function (n) { g.aToolBar.removeListOption("pages", n) });
        var a = { dhx_skyblue: 4, dhx_web: 0, dhx_terrace: 14 }[this.aToolBar.conf.skin];
        for (var e = 0; e < h; e++) { this.aToolBar.addListOption("pages", "pages_" + (e + 1), NaN, "button", "<span style='padding: 0px " + a + "px 0px 0px;'>" + this.i18n.paging.page + (e + 1) + "</span>", "paging_page.gif") }
        this.aToolBar.setItemText("pages", this.i18n.paging.page + l)
    }
    if (this._WTDef[1]) {
        if (!this.getRowsNum()) { this.aToolBar.setItemText("results", this.i18n.paging.notfound) } else { this.aToolBar.setItemText("results", "<div style='width:100%; text-align:center'>" + this.i18n.paging.records + (m + 1) + this.i18n.paging.to + c + "</div>") }
    }
    if (this._WTDef[3]) { this.aToolBar.setItemText("perpagenum", this.rowsBufferOutSize.toString() + " " + this.i18n.paging.perpage) }
    this.callEvent("onPaging", [])
};
dhtmlXGridObject.prototype._pgn_createToolBar = function () {
    this.aToolBar = new dhtmlXToolbarObject({ parent: this._pgn_parentObj, skin: (this._pgn_skin_tlb || this.skin_name), icons_path: this.imgURL });
    if (!this._WTDef) { this.setPagingWTMode(true, true, true, true) }
    var g = this;
    this.aToolBar.attachEvent("onClick", function (h) {
        h = h.split("_");
        switch (h[0]) {
            case "leftabs":
                g.changePage(1);
            case "left":
                g.changePage(g.currentPage - 1);
            case "rightabs":
                g.changePage(99999);
            case "right":
                g.changePage(g.currentPage + 1);
                break;
            case "perpagenum":
                if (h[1] === this.undefined) {
                    return
                }
                g.rowsBufferOutSize = parseInt(h[1]);
                g.changePage();
                g.aToolBar.setItemText("perpagenum", h[1] + " " + g.i18n.paging.perpage);
                break;
            case "pages":
                if (h[1] === this.undefined) {
                    return
                }
                g.changePage(h[1]);
                g.aToolBar.setItemText("pages", g.i18n.paging.page + h[1]);
                break
        }
    });
    if (this._WTDef[0]) {
        this.aToolBar.addButton("leftabs", NaN, null, "ar_left_abs.gif", "ar_left_abs_dis.gif");
        this.aToolBar.addButton("left", NaN, null, "ar_left.gif", "ar_left_dis.gif")
    }
    if (this._WTDef[1]) {
        this.aToolBar.addText("results", NaN, this.i18n.paging.results);
        this.aToolBar.setWidth("results", "150");
        this.aToolBar.disableItem("results")
    }
    if (this._WTDef[0]) {
        this.aToolBar.addButton("right", NaN, null, "ar_right.gif", "ar_right_dis.gif");
        this.aToolBar.addButton("rightabs", NaN, null, "ar_right_abs.gif", "ar_right_abs_dis.gif")
    }
    if (this._WTDef[2]) {
        if (this.aToolBar.conf.skin == "dhx_terrace") { this.aToolBar.addSeparator() }
        this.aToolBar.addButtonSelect("pages", NaN, "select page", [], "paging_pages.gif", null, false, true)
    }
    var a;
    if (a = this._WTDef[3]) {
        if (this.aToolBar.conf.skin == "dhx_terrace") { this.aToolBar.addSeparator() }
        this.aToolBar.addButtonSelect("perpagenum", NaN, "select size", [], "paging_rows.gif", null, false, true);
        if (typeof a != "object") { a = [5, 10, 15, 20, 25, 30] }
        var c = { dhx_skyblue: 4, dhx_web: 0, dhx_terrace: 18 }[this.aToolBar.conf.skin];
        for (var e = 0; e < a.length; e++) { this.aToolBar.addListOption("perpagenum", "perpagenum_" + a[e], NaN, "button", "<span style='padding: 0px " + c + "px 0px 0px;'>" + a[e] + " " + this.i18n.paging.perpage + "</span>", "paging_page.gif") }
    }
    return this.aToolBar
};
dhtmlXGridObject.prototype.post = function (a, c, g, e) {
    this.callEvent("onXLS", [this]);
    if (arguments.length == 2 && typeof g != "function") {
        e = g;
        g = null
    }
    e = e || "xml";
    if (!this.xmlFileUrl) { this.xmlFileUrl = a }
    this._data_type = e;
    this.xmlLoader = this.doLoadDetails;
    var h = this;
    this.xmlLoader = function (l) {
        if (!h.callEvent) {
            h["_process_" + e](l.xmlDoc);
            if (!h._contextCallTimer) { h.callEvent("onXLE", [h, 0, 0, l.xmlDoc]) }
            if (g) {
                g();
                g = null
            }
        };
        dhx4.ajax.post(a, (c || ""), this.xmlLoader)
    };
}
dhtmlXGridObject.prototype.setRowspan = function (s, v, h) {
    var u = this[this._bfs_cells ? "_bfs_cells" : "cells"](s, v).cell;
    var a = this.rowsAr[s];
    if (u.rowSpan && u.rowSpan != 1) {
        var l = a.nextSibling;
        for (var n = 1; n < u.rowSpan; n++) {
            var m = l.childNodes[l._childIndexes[u._cellIndex + 1]];
            var e = document.createElement("TD");
            e.innerHTML = "&nbsp;";
            e._cellIndex = u._cellIndex;
            e._clearCell = true;
            if (m) { m.parentNode.insertBefore(e, m) } else { l.parentNode.appendChild(e) }
            this._shiftIndexes(l, u._cellIndex, -1);
            l = l.nextSibling
        }
    }
    u.rowSpan = h;
    if (!this._h2) { a = a.nextSibling || this.rowsCol[this.rowsCol._dhx_find(a) + 1] } else { a = this.rowsAr[this._h2.get[a.idd].parent.childs[this._h2.get[a.idd].index + 1].id] }
    var g = [];
    for (var n = 1; n < h; n++) {
        var o = null;
        if (this._fake && !this._realfake) { o = this._bfs_cells3(a, v).cell } else { o = this.cells3(a, v).cell }
        this._shiftIndexes(a, u._cellIndex, 1);
        if (o) { o.parentNode.removeChild(o) }
        g.push(a);
        if (!this._h2) { a = a.nextSibling || this.rowsCol[this.rowsCol._dhx_find(a) + 1] } else {
            var a = this._h2.get[a.idd].parent.childs[this._h2.get[a.idd].index + 1];
            if (a) { a = this.rowsAr[a.id] }
        }
    }
    this.rowsAr[s]._rowSpan = this.rowsAr[s]._rowSpan || {};
    this.rowsAr[s]._rowSpan[v] = g;
    if (this._fake && !this._realfake && v < this._fake._cCount) { this._fake.setRowspan(s, v, h) }
};
dhtmlXGridObject.prototype._shiftIndexes = function (a, g, c) {
    if (!a._childIndexes) {
        a._childIndexes = new Array();
        for (var e = 0; e < a.childNodes.length; e++) { a._childIndexes[e] = e }
    }
    for (var e = 0; e < a._childIndexes.length; e++) {
        if (e > g) { a._childIndexes[e] = a._childIndexes[e] - c }
    }
};
dhtmlXGridObject.prototype.enableRowspan = function () {
    this._erspan = true;
    this.enableRowspan = function () { };
    this.attachEvent("onAfterSorting", function () {
        if (this._dload) {
            return
        }
        for (var h = 1; h < this.obj.rows.length; h++) {
            if (this.obj.rows[h]._rowSpan) {
                var a = this.obj.rows[h];
                for (var l in a._rowSpan) {
                    var o = a;
                    var c = o._rowSpan[l];
                    for (var e = 0; e < c.length; e++) {
                        if (o.nextSibling) { o.parentNode.insertBefore(c[e], o.nextSibling) } else { o.parentNode.appendChild(c[e]) }
                        if (this._fake) {
                            var g = this._fake.rowsAr[o.idd];
                            var m = this._fake.rowsAr[c[e].idd];
                            if (g.nextSibling) { g.parentNode.insertBefore(m, g.nextSibling) } else { g.parentNode.appendChild(m) }
                            this._correctRowHeight(o.idd)
                        }
                        o = o.nextSibling
                    }
                }
            }
        }
        var n = this.rowsCol.stablesort;
        this.rowsCol = new dhtmlxArray();
        this.rowsCol.stablesort = n;
        for (var h = 1; h < this.obj.rows.length; h++) { this.rowsCol.push(this.obj.rows[h]) }
    });
    this.attachEvent("onXLE", function (g, e, r, l) {
        for (var m = 0; m < this.rowsBuffer.length; m++) {
            var o = this.render_row(m);
            var n = o.childNodes;
            for (var h = 0; h < n.length; h++) {
                if (n[h]._attrs.rowspan) { this.setRowspan(o.idd, n[h]._cellIndex, n[h]._attrs.rowspan) }
            }
        }
    })
};
dhx4.attachEvent("onGridCreated", function (a) {
    if (a._split_later) { a.splitAt(a._split_later) }
});
dhtmlXGridObject.prototype.splitAt = function (m) {
    if (!this.obj.rows[0]) {
        return this._split_later = m
    }
    m = parseInt(m);
    var x = document.createElement("DIV");
    this.entBox.appendChild(x);
    var y = document.createElement("DIV");
    this.entBox.appendChild(y);
    for (var v = this.entBox.childNodes.length - 3; v >= 0; v--) { y.insertBefore(this.entBox.childNodes[v], y.firstChild) }
    this.entBox.style.position = "relative";
    this.globalBox = this.entBox;
    this.entBox = y;
    y.grid = this;
    x.style.cssText += "border:0px solid red !important;";
    y.style.cssText += "border:0px solid red !important;";
    y.style.top = "0px";
    y.style.position = "absolute";
    x.style.position = "absolute";
    x.style.top = "0px";
    x.style.left = "0px";
    x.style.zIndex = 11;
    y.style.height = x.style.height = this.globalBox.clientHeight;
    this._fake = new dhtmlXGridObject(x);
    this.globalBox = this._fake.globalBox = this.globalBox;
    this._fake._fake = this;
    this._fake._realfake = true;
    this._treeC = this.cellType._dhx_find("tree");
    this._fake.delim = this.delim;
    this._fake.customGroupFormat = this.customGroupFormat;
    this._fake.setImagesPath(this._imgURL);
    this._fake.iconURL = this.iconURL;
    this._fake._customSorts = this._customSorts;
    this._fake.noHeader = this.noHeader;
    this._fake._enbTts = this._enbTts;
    this._fake._drsclmW = this._drsclmW;
    this._fake._htkebl = this._htkebl;
    this._fake.clists = this.clists;
    this._fake.fldSort = new Array();
    this._fake.selMultiRows = this.selMultiRows;
    this._fake.multiLine = this.multiLine;
    this._fake._key_events = this._key_events;
    this._fake.smartTabOrder = this.smartTabOrder;
    this._fake._RaSeCol = this._RaSeCol;
    if (this.multiLine || this._erspan) {
        this.attachEvent("onCellChanged", this._correctRowHeight);
        this.attachEvent("onRowAdded", this._correctRowHeight);
        var c = function () { this.forEachRow(function (D) { this._correctRowHeight(D) }) };
        this.attachEvent("onPageChanged", c);
        this.attachEvent("onXLE", c);
        this.attachEvent("onResizeEnd", c);
        if (!this._ads_count) { this.attachEvent("onAfterSorting", c) }
        if (this._srnd) { this.attachEvent("onFilterEnd", c) }
        this.attachEvent("onDistributedEnd", c)
    }
    this.attachEvent("onGridReconstructed", function () { this._fake.objBox.scrollTop = this.objBox.scrollTop });
    this._fake.loadedKidsHash = this.loadedKidsHash;
    if (this._h2) { this._fake._h2 = this._h2 }
    this._fake._dInc = this._dInc;
    var n = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    var s = ["hdrLabels", "initCellWidth", "cellType", "cellAlign", "cellVAlign", "fldSort", "columnColor"];
    var h = ["setHeader", "setInitWidths", "setColTypes", "setColAlign", "setColVAlign", "setColSorting", "setColumnColor"];
    this._fake.callEvent = function () {
        var D = true;
        this._fake._split_event = true;
        var E = (arguments[0] == "onScroll");
        if (arguments[0] == "onGridReconstructed" || E) { this._fake.callEvent.apply(this, arguments) }
        if (!E) { D = this._fake.callEvent.apply(this._fake, arguments) }
        this._fake._split_event = false;
        return D
    };
    if (this._elmn) { this._fake.enableLightMouseNavigation(true) }
    if (this._cssEven || this._cssUnEven) { this._fake.attachEvent("onGridReconstructed", function () { this._fixAlterCss() }) }
    this._fake._cssSP = this._cssSP;
    this._fake.isEditable = this.isEditable;
    this._fake._edtc = this._edtc;
    if (this._sst) { this._fake.enableStableSorting(true) }
    this._fake._sclE = this._sclE;
    this._fake._dclE = this._dclE;
    this._fake._f2kE = this._f2kE;
    this._fake._maskArr = this._maskArr;
    this._fake._dtmask = this._dtmask;
    this._fake.combos = this.combos;
    var o = 0;
    var a = this.globalBox.offsetWidth;
    for (var v = 0; v < m; v++) {
        for (var u = 0; u < s.length; u++) {
            if (this[s[u]]) { n[u][v] = this[s[u]][v] }
            if (typeof n[u][v] == "string") { n[u][v] = n[u][v].replace(new RegExp("\\" + this.delim, "g"), "\\" + this.delim) }
        }
        if (_isFF) { n[1][v] = n[1][v] * 1 }
        if (this.cellWidthType == "%") {
            n[1][v] = Math.round(parseInt(this[s[1]][v]) * a / 100);
            o += n[1][v]
        } else { o += parseInt(this[s[1]][v]) }
        this.setColumnHidden(v, true)
    }
    for (var u = 0; u < s.length; u++) {
        var r = n[u].join(this.delim);
        if (h[u] != "setHeader") {
            if (r != "") { this._fake[h[u]](r) }
        } else { this._fake[h[u]](r, null, this._hstyles) }
    }
    this._fake._strangeParams = this._strangeParams;
    this._fake._drsclmn = this._drsclmn;
    o = Math.min(this.globalBox.offsetWidth, o);
    y.style.left = o + "px";
    x.style.width = o + "px";
    y.style.width = Math.max(this.globalBox.offsetWidth - o, 0);
    if (this._ecspn) { this._fake._ecspn = true }
    this._fake.init();
    if (this.dragAndDropOff) { this.dragger.addDragLanding(this._fake.entBox, this) }
    this._fake.objBox.style.overflow = "hidden";
    if (!dhtmlx.$customScroll) { this._fake.objBox.style.overflowX = "scroll" } else { this._fake.objBox._custom_scroll_mode = "" }
    this._fake._srdh = this._srdh || 20;
    this._fake._srnd = this._srnd;
    this._fake._cssEven = this._cssEven;
    this._fake._cssUnEven = this._cssUnEven;
    if (this.skin_name != this._fake.skin_name) { this._fake.setSkin(this.skin_name) }
    var A = this;

    function C(F) {
        var D = A.objBox;
        if (D.scrollHeight - D.offsetHeight > 2) {
            var E = F.wheelDelta / -40;
            if (F.wheelDelta === window.undefined) { E = F.detail }
            D.scrollTop += E * 40;
            if (F.preventDefault) { F.preventDefault() }
        }
    }
    dhtmlxEvent(this._fake.objBox, "mousewheel", C);
    dhtmlxEvent(this._fake.objBox, "DOMMouseScroll", C);

    function g(E, D) {
        D.style.whiteSpace = "";
        var I = D.nextSibling;
        var F = D.parentNode;
        E.parentNode.insertBefore(D, E);
        if (!I) { F.appendChild(E) } else { F.insertBefore(E, I) }
        var H = E.style.display;
        E.style.display = D.style.display;
        D.style.display = H
    }

    function w(L, T, M, E) {
        var F = (new Array(m)).join(this.delim);
        var N = [];
        if (L == 2) {
            for (var J = 0; J < m; J++) {
                var D = T[L - 1].cells[T[L - 1]._childIndexes ? T[L - 1]._childIndexes[J] : J];
                if (D.rowSpan && D.rowSpan > 1) {
                    N[D._cellIndex] = D.rowSpan - 1;
                    E[L - 1].cells[E[L - 1]._childIndexes ? E[L - 1]._childIndexes[J] : J].rowSpan = D.rowSpan;
                    D.rowSpan = 1
                }
            }
        }
        for (L; L < T.length; L++) {
            this._fake.attachHeader(F, null, M);
            E = E || this._fake.ftr.childNodes[0].rows;
            var Q = m;
            var H = 0;
            for (var K = 0; K < Q; K++) {
                if (N[K]) {
                    N[K] = N[K] - 1;
                    if (_isIE || _isOpera) {
                        var I = document.createElement("TD");
                        if (_isFF) { I.style.display = "none" }
                        T[L].insertBefore(I, T[L].cells[0])
                    }
                    H++;
                    continue
                }
                var P = E[L].cells[K - H];
                var O = T[L].cells[K - (_isIE ? 0 : H)];
                var S = O.rowSpan;
                g(P, O);
                if (S > 1) {
                    N[K] = S - 1;
                    O.rowSpan = S
                }
                if (E[L].cells[K].colSpan > 1) {
                    T[L].cells[K].colSpan = E[L].cells[K].colSpan;
                    Q -= E[L].cells[K].colSpan - 1;
                    for (var J = 1; J < E[L].cells[K].colSpan; J++) { E[L].removeChild(E[L].cells[K + 1]) }
                }
            }
        }
    }
    if (this.hdr.rows.length > 2) { w.call(this, 2, this.hdr.rows, "_aHead", this._fake.hdr.rows) }
    if (this.ftr) {
        w.call(this, 1, this.ftr.childNodes[0].rows, "_aFoot");
        this._fake.ftr.parentNode.style.bottom = (_isFF ? 2 : 1) + "px"
    }
    if (this.saveSizeToCookie) {
        this.saveSizeToCookie = function (E, D) {
            if (this._realfake) {
                return this._fake.saveSizeToCookie.apply(this._fake, arguments)
            }
            if (!E) { E = this.entBox.id }
            var H = new Array();
            var I = "cellWidthPX";
            for (var F = 0; F < this[I].length; F++) {
                if (F < m) { H[F] = this._fake[I][F] } else { H[F] = this[I][F] }
            }
            H = H.join(",");
            this.setCookie(E, D, 0, H);
            var H = (this.initCellWidth || (new Array)).join(",");
            this.setCookie(E, D, 1, H);
            return true
        };
        this.loadSizeFromCookie = function (D) {
            if (!D) { D = this.entBox.id }
            var I = this._getCookie(D, 1);
            if (!I) {
                return
            }
            this.initCellWidth = I.split(",");
            var I = this._getCookie(D, 0);
            var J = "cellWidthPX";
            this.cellWidthType = "px";
            var F = 0;
            if ((I) && (I.length)) {
                I = I.split(",");
                for (var E = 0; E < I.length; E++) {
                    if (E < m) {
                        this._fake[J][E] = I[E];
                        F += I[E] * 1
                    } else { this[J][E] = I[E] }
                }
            }
            this._fake.entBox.style.width = F + "px";
            this._fake.objBox.style.width = F + "px";
            var H = this.globalBox.childNodes[1];
            H.style.left = F - (_isFF ? 0 : 0) + "px";
            if (this.ftr) { this.ftr.style.left = F - (_isFF ? 0 : 0) + "px" }
            H.style.width = this.globalBox.offsetWidth - F + "px";
            this.setSizes();
            return true
        };
        this._fake.onRSE = this.onRSE
    }
    this.setCellTextStyleA = this.setCellTextStyle;
    this.setCellTextStyle = function (E, F, D) {
        if (F < m) { this._fake.setCellTextStyle(E, F, D) }
        this.setCellTextStyleA(E, F, D)
    };
    this.setRowTextBoldA = this.setRowTextBold;
    this.setRowTextBold = function (D) {
        this.setRowTextBoldA(D);
        this._fake.setRowTextBold(D)
    };
    this.setRowColorA = this.setRowColor;
    this.setRowColor = function (E, D) {
        this.setRowColorA(E, D);
        this._fake.setRowColor(E, D)
    };
    this.setRowHiddenA = this.setRowHidden;
    this.setRowHidden = function (E, D) {
        this.setRowHiddenA(E, D);
        this._fake.setRowHidden(E, D)
    };
    this.setRowTextNormalA = this.setRowTextNormal;
    this.setRowTextNormal = function (D) {
        this.setRowTextNormalA(D);
        this._fake.setRowTextNormal(D)
    };
    this.getChangedRows = function (F) {
        var D = new Array();

        function E(I) {
            for (var H = 0; H < I.childNodes.length; H++) {
                if (I.childNodes[H].wasChanged) {
                    return D[D.length] = I.idd
                }
            }
        }
        this.forEachRow(function (J) {
            var I = this.rowsAr[J];
            var H = this._fake.rowsAr[J];
            if (I.tagName != "TR" || !H || H.tagName != "TR") {
                return
            }
            if (F && I._added) { D[D.length] = I.idd } else {
                if (!E(I)) { E(H) }
            }
        });
        return D.join(this.delim)
    };
    this.setRowTextStyleA = this.setRowTextStyle;
    this.setRowTextStyle = function (E, D) {
        this.setRowTextStyleA(E, D);
        if (this._fake.rowsAr[E]) { this._fake.setRowTextStyle(E, D) }
    };
    this.lockRowA = this.lockRow;
    this.lockRow = function (E, D) {
        this.lockRowA(E, D);
        this._fake.lockRow(E, D)
    };
    this.getColWidth = function (D) {
        if (D < m) {
            return parseInt(this._fake.cellWidthPX[D])
        } else {
            return parseInt(this.cellWidthPX[D])
        }
    };
    this.getColumnLabel = function (D) {
        return this._fake.getColumnLabel.apply(((D < m) ? this._fake : this), arguments)
    };
    this.setColWidthA = this._fake.setColWidthA = this.setColWidth;
    this.setColWidth = function (D, E) {
        D = D * 1;
        if (D < m) { this._fake.setColWidthA(D, E) } else { this.setColWidthA(D, E) }
        if ((D + 1) <= m) { this._fake._correctSplit(Math.min(this._fake.objBox.offsetWidth, this._fake.obj.offsetWidth)) }
    };
    this.adjustColumnSizeA = this.adjustColumnSize;
    this.setColumnLabelA = this.setColumnLabel;
    this.setColumnLabel = function (E, D, I, H) {
        var F = this;
        if (E < m) { F = this._fake }
        return this.setColumnLabelA.apply(F, [E, D, I, H])
    };
    this.adjustColumnSize = function (D, E) {
        if (D < m) {
            if (_isIE) { this._fake.obj.style.tableLayout = "" }
            this._fake.adjustColumnSize(D, E);
            if (_isIE) { this._fake.obj.style.tableLayout = "fixed" }
            this._fake._correctSplit()
        } else {
            return this.adjustColumnSizeA(D, E)
        }
    };
    var e = "cells";
    this._bfs_cells = this[e];
    this[e] = function () {
        if (arguments[1] < m) {
            return this._fake.cells.apply(this._fake, arguments)
        } else {
            return this._bfs_cells.apply(this, arguments)
        }
    };
    this._bfs_isColumnHidden = this.isColumnHidden;
    this.isColumnHidden = function () {
        if (parseInt(arguments[0]) < m) {
            return this._fake.isColumnHidden.apply(this._fake, arguments)
        } else {
            return this._bfs_isColumnHidden.apply(this, arguments)
        }
    };
    this._bfs_setColumnHidden = this.setColumnHidden;
    this.setColumnHidden = function () {
        if (parseInt(arguments[0]) < m) {
            this._fake.setColumnHidden.apply(this._fake, arguments);
            return this._fake._correctSplit()
        } else {
            return this._bfs_setColumnHidden.apply(this, arguments)
        }
    };
    var e = "cells2";
    this._bfs_cells2 = this[e];
    this[e] = function () {
        if (arguments[1] < m) {
            return this._fake.cells2.apply(this._fake, arguments)
        } else {
            return this._bfs_cells2.apply(this, arguments)
        }
    };
    var e = "cells3";
    this._bfs_cells3 = this[e];
    this[e] = function (E, D) {
        if (arguments[1] < m && this._fake.rowsAr[arguments[0].idd]) {
            if (this._fake.rowsAr[E.idd] && this._fake.rowsAr[E.idd].childNodes.length == 0) {
                return this._bfs_cells3.apply(this, arguments)
            }
            arguments[0] = arguments[0].idd;
            return this._fake.cells.apply(this._fake, arguments)
        } else {
            return this._bfs_cells3.apply(this, arguments)
        }
    };
    var e = "changeRowId";
    this._bfs_changeRowId = this[e];
    this[e] = function () {
        this._bfs_changeRowId.apply(this, arguments);
        if (this._fake.rowsAr[arguments[0]]) { this._fake.changeRowId.apply(this._fake, arguments) }
    };
    this._fake.getRowById = function (F) {
        var E = this.rowsAr[F];
        if (!E && this._fake.rowsAr[F]) { E = this._fake.getRowById(F) }
        if (E) {
            if (E.tagName != "TR") {
                for (var D = 0; D < this.rowsBuffer.length; D++) {
                    if (this.rowsBuffer[D] && this.rowsBuffer[D].idd == F) {
                        return this.render_row(D)
                    }
                }
                if (this._h2) {
                    return this.render_row(null, E.idd)
                }
            }
            return E
        }
        return null
    };
    if (this.collapseKids) {
        this._fake._bfs_collapseKids = this.collapseKids;
        this._fake.collapseKids = function () {
            return this._fake.collapseKids.apply(this._fake, [this._fake.rowsAr[arguments[0].idd]])
        };
        this["_bfs_collapseKids"] = this.collapseKids;
        this["collapseKids"] = function () {
            var D = this["_bfs_collapseKids"].apply(this, arguments);
            this._fake._h2syncModel();
            if (!this._cssSP) { this._fake._fixAlterCss() }
        };
        this._fake._bfs_expandKids = this.expandKids;
        this._fake.expandKids = function () {
            this._fake.expandKids.apply(this._fake, [this._fake.rowsAr[arguments[0].idd]]);
            if (!this._cssSP) { this._fake._fixAlterCss() }
        };
        this["_bfs_expandAll"] = this.expandAll;
        this["expandAll"] = function () {
            this._bfs_expandAll();
            this._fake._h2syncModel();
            if (!this._cssSP) { this._fake._fixAlterCss() }
        };
        this["_bfs_collapseAll"] = this.collapseAll;
        this["collapseAll"] = function () {
            this._bfs_collapseAll();
            this._fake._h2syncModel();
            if (!this._cssSP) { this._fake._fixAlterCss() }
        };
        this["_bfs_expandKids"] = this.expandKids;
        this["expandKids"] = function () {
            var D = this["_bfs_expandKids"].apply(this, arguments);
            this._fake._h2syncModel();
            if (!this._cssSP) { this._fake._fixAlterCss() }
        };
        this._fake._h2syncModel = function () {
            if (this._fake.pagingOn) { this._fake._renderSort() } else { this._renderSort() }
        };
        this._updateTGRState = function (D) {
            return this._fake._updateTGRState(D)
        }
    }
    if (this._elmnh) {
        this._setRowHoverA = this._fake._setRowHoverA = this._setRowHover;
        this._unsetRowHoverA = this._fake._unsetRowHoverA = this._unsetRowHover;
        this._setRowHover = this._fake._setRowHover = function () {
            var D = this.grid;
            D._setRowHoverA.apply(this, arguments);
            var E = (_isIE ? event.srcElement : arguments[0].target);
            E = D._fake.rowsAr[D.getFirstParentOfType(E, "TD").parentNode.idd];
            if (E) { D._fake._setRowHoverA.apply(D._fake.obj, [{ target: E.childNodes[0] }, arguments[1]]) }
        };
        this._unsetRowHover = this._fake._unsetRowHover = function () {
            if (arguments[1]) {
                var D = this
            } else {
                var D = this.grid
            }
            D._unsetRowHoverA.apply(this, arguments);
            D._fake._unsetRowHoverA.apply(D._fake.obj, arguments)
        };
        this._fake.enableRowsHover(true, this._hvrCss);
        this.enableRowsHover(false);
        this.enableRowsHover(true, this._fake._hvrCss)
    }
    this._updateTGRState = function (D) {
        if (!D.update || D.id == 0) {
            return
        }
        if (this.rowsAr[D.id].imgTag) { this.rowsAr[D.id].imgTag.src = this.iconTree + D.state + ".gif" }
        if (this._fake.rowsAr[D.id] && this._fake.rowsAr[D.id].imgTag) { this._fake.rowsAr[D.id].imgTag.src = this.iconTree + D.state + ".gif" }
        D.update = false
    };
    this.copy_row = function (I) {
        var D = I.cloneNode(true);
        D._skipInsert = I._skipInsert;
        var J = m;
        D._attrs = {};
        D._css = I._css;
        if (this._ecspn) {
            J = 0;
            for (var H = 0;
                (J < D.childNodes.length && H < m) ; H += (D.childNodes[J].colSpan || 1)) { J++ }
        }
        while (D.childNodes.length > J) { D.removeChild(D.childNodes[D.childNodes.length - 1]) }
        var F = J;
        for (var H = 0; H < F; H++) {
            if (this.dragAndDropOff) { this.dragger.addDraggableItem(D.childNodes[H], this) }
            D.childNodes[H].style.display = (this._fake._hrrar ? (this._fake._hrrar[H] ? "none" : "") : "");
            D.childNodes[H]._cellIndex = H;
            D.childNodes[H].combo_value = arguments[0].childNodes[H].combo_value;
            D.childNodes[H]._clearCell = arguments[0].childNodes[H]._clearCell;
            D.childNodes[H]._cellType = arguments[0].childNodes[H]._cellType;
            D.childNodes[H]._brval = arguments[0].childNodes[H]._brval;
            D.childNodes[H].val = arguments[0].childNodes[H].val;
            D.childNodes[H]._combo = arguments[0].childNodes[H]._combo;
            D.childNodes[H]._attrs = arguments[0].childNodes[H]._attrs;
            D.childNodes[H].chstate = arguments[0].childNodes[H].chstate;
            if (I._attrs.style) { D.childNodes[H].style.cssText = I._attrs.style + ";" + D.childNodes[H].style.cssText }
            if (D.childNodes[H].colSpan > 1) { D._childIndexes = arguments[0]._childIndexes }
        }
        if (this._h2 && this._treeC < m) {
            var E = this._h2.get[arguments[0].idd];
            D.imgTag = D.childNodes[this._treeC].childNodes[0].childNodes[E.level];
            D.valTag = D.childNodes[this._treeC].childNodes[0].childNodes[E.level + 2]
        }
        D.idd = I.idd;
        D.grid = this._fake;
        return D
    };
    var e = "_insertRowAt";
    this._bfs_insertRowAt = this[e];
    this[e] = function () {
        var E = this["_bfs_insertRowAt"].apply(this, arguments);
        arguments[0] = this.copy_row(arguments[0]);
        var D = this._fake._insertRowAt.apply(this._fake, arguments);
        if (E._fhd) {
            D.parentNode.removeChild(D);
            this._fake.rowsCol._dhx_removeAt(this._fake.rowsCol._dhx_find(D));
            E._fhd = false
        }
        return E
    };
    this._bfs_setSizes = this.setSizes;
    this.setSizes = function () {
        if (this._notresize) {
            return
        }
        this._bfs_setSizes(this, arguments);
        this.sync_headers();
        if (this.sync_scroll() && this._ahgr) { this.setSizes() }
        var D = this.dontSetSizes ? (this.entBox.offsetHeight + "px") : this.entBox.style.height;
        this._fake.entBox.style.height = D;
        this._fake.objBox.style.height = this.objBox.style.height;
        this._fake.hdrBox.style.height = this.hdrBox.style.height;
        this._fake.objBox.scrollTop = this.objBox.scrollTop;
        this._fake.setColumnSizes(this._fake.entBox.clientWidth);
        this._fake.obj.offsetParent.style.width = this._fake.obj.clientWidth+"px";
        this.globalBox.style.width = parseInt(this.entBox.style.width) + parseInt(this._fake.entBox.style.width);
        if (!this.dontSetSizes) { this.globalBox.style.height = D }
    };
    this.sync_scroll = this._fake.sync_scroll = function (E) {
        var D = this.objBox.style.overflowX;
        if (this.obj.offsetWidth <= this.objBox.offsetWidth) {
            if (!E) {
                return this._fake.sync_scroll(true)
            }
            this.objBox.style.overflowX = "hidden";
            this._fake.objBox.style.overflowX = "hidden"
        } else {
            if (!dhtmlx.$customScroll) {
                this.objBox.style.overflowX = "scroll";
                this._fake.objBox.style.overflowX = "scroll"
            }
        }
        return D != this.objBox.style.overflowX
    };
    this.sync_headers = this._fake.sync_headers = function () {
        if (this.noHeader || (this._fake.hdr.scrollHeight == this.hdr.offsetHeight) || this.noHeaderResize) {
            return
        }
        for (var E = 1; E < this.hdr.rows.length; E++) {
            var I = m;
            while (!this.hdr.rows[E].childNodes[I]) { I-- }
            var D = Math.min(this.hdr.rows[E].childNodes[I].scrollHeight + 2, this.hdr.rows[E].scrollHeight);
            var H = this._fake.hdr.rows[E].scrollHeight;
            if (D != H) { this._fake.hdr.rows[E].style.height = this.hdr.rows[E].style.height = Math.max(D, H) + "px" }
            if (window._KHTMLrv) {
                var F = 0;
                while (this._fake._hrrar[F]) { F++ }
                this._fake.hdr.rows[E].childNodes[F].style.height = this.hdr.rows[E].childNodes[I].style.height = Math.max(D, H) + "px"
            }
        }
        this._fake.sync_headers
    };
    this._fake._bfs_setSizes = this._fake.setSizes;
    this._fake.setSizes = function () {
        if (this._fake._notresize) {
            return
        }
        this._fake.setSizes()
    };
    var e = "_doOnScroll";
    this._bfs__doOnScroll = this[e];
    this[e] = function () {
        this._bfs__doOnScroll.apply(this, arguments);
        this._fake.objBox.scrollTop = this.objBox.scrollTop;
        this._fake._doOnScroll.apply(this._fake, arguments)
    };
    var e = "selectAll";
    this._bfs__selectAll = this[e];
    this[e] = function () {
        this._bfs__selectAll.apply(this, arguments);
        this._bfs__selectAll.apply(this._fake, arguments)
    };
    var e = "doClick";
    this._bfs_doClick = this[e];
    this[e] = function () {
        this["_bfs_doClick"].apply(this, arguments);
        if (arguments[0].tagName == "TD") {
            var D = (arguments[0]._cellIndex >= m);
            if (!arguments[0].parentNode.idd) {
                if (!D) { arguments[0].className = arguments[0].className.replace(/cellselected/g, "") }
                if (!this._fake.rowsAr[arguments[0].parentNode.idd]) { this._fake.render_row(this.getRowIndex(arguments[0].parentNode.idd)) }
                arguments[0] = this._fake.cells(arguments[0].parentNode.idd, (D ? 0 : arguments[0]._cellIndex)).cell;
                if (D) { this._fake.cell = null }
                this._fake._bfs_doClick.apply(this._fake, arguments);
                if (D) { this._fake.cell = this.cell } else { this.cell = this._fake.cell }
                if (this._fake.onRowSelectTime) { clearTimeout(this._fake.onRowSelectTime) }
                if (D) {
                    arguments[0].className = arguments[0].className.replace(/cellselected/g, "");
                    globalActiveDHTMLGridObject = this;
                    this._fake.cell = this.cell
                } else { this.objBox.scrollTop = this._fake.objBox.scrollTop }
            }
        };
        this._fake._bfs_doClick = this._fake[e];
        this._fake[e] = function () {
            this["_bfs_doClick"].apply(this, arguments);
            if (arguments[0].tagName == "TD") {
                var D = (arguments[0]._cellIndex < m);
                if (!arguments[0].parentNode.idd) {
                    return
                }
                arguments[0] = this._fake._bfs_cells(arguments[0].parentNode.idd, (D ? m : arguments[0]._cellIndex)).cell;
                this._fake.cell = null;
                this._fake._bfs_doClick.apply(this._fake, arguments);
                this._fake.cell = this.cell;
                if (this._fake.onRowSelectTime) { clearTimeout(this._fake.onRowSelectTime) }
                if (D) {
                    arguments[0].className = arguments[0].className.replace(/cellselected/g, "");
                    globalActiveDHTMLGridObject = this;
                    this._fake.cell = this.cell;
                    this._fake.objBox.scrollTop = this.objBox.scrollTop
                }
            }
        };
        this.clearSelectionA = this.clearSelection;
        this.clearSelection = function (D) {
            if (D) { this._fake.clearSelection() }
            this.clearSelectionA()
        };
        this.moveRowUpA = this.moveRowUp;
        this.moveRowUp = function (D) {
            if (!this._h2) { this._fake.moveRowUp(D) }
            this.moveRowUpA(D);
            if (this._h2) { this._fake._h2syncModel() }
        };
        this.moveRowDownA = this.moveRowDown;
        this.moveRowDown = function (D) {
            if (!this._h2) { this._fake.moveRowDown(D) }
            this.moveRowDownA(D);
            if (this._h2) { this._fake._h2syncModel() }
        };
        this._fake.getUserData = function () {
            return this._fake.getUserData.apply(this._fake, arguments)
        };
        this._fake.setUserData = function () {
            return this._fake.setUserData.apply(this._fake, arguments)
        };
        this.getSortingStateA = this.getSortingState;
        this.getSortingState = function () {
            var D = this.getSortingStateA();
            if (D.length != 0) {
                return D
            }
            return this._fake.getSortingState()
        };
        this.setSortImgStateA = this._fake.setSortImgStateA = this.setSortImgState;
        this.setSortImgState = function (E, D, H, F) {
            this.setSortImgStateA(E, D, H, F);
            if (D * 1 < m) {
                this._fake.setSortImgStateA(E, D, H, F);
                this.setSortImgStateA(false)
            } else { this._fake.setSortImgStateA(false) }
        };
        this._fake.doColResizeA = this._fake.doColResize;
        this._fake.doColResize = function (I, H, F, D, K) {
            var E = -1;
            var J = 0;
            if (arguments[1]._cellIndex == (m - 1)) {
                E = this._initalSplR + (I.clientX - D);
                if (!this._initalSplF) { this._initalSplF = arguments[3] + this.objBox.scrollWidth - this.objBox.offsetWidth }
                if (this.objBox.scrollWidth == this.objBox.offsetWidth && (this._fake.alter_split_resize || (I.clientX - D) > 0)) {
                    arguments[3] = (this._initalSplF || arguments[3]);
                    J = this.doColResizeA.apply(this, arguments)
                } else { J = this.doColResizeA.apply(this, arguments) }
            } else {
                if (this.obj.offsetWidth < this.entBox.offsetWidth) { E = this.obj.offsetWidth }
                J = this.doColResizeA.apply(this, arguments)
            }
            if (J !== false) {
                this._correctSplit(E);
                this.resized = this._fake.resized = 1
            }
            return J
        };
        this._fake.changeCursorState = function (F) {
            var E = F.target || F.srcElement;
            if (E.tagName != "TD") { E = this.getFirstParentOfType(E, "TD") }
            if ((E.tagName == "TD") && (this._drsclmn) && (!this._drsclmn[E._cellIndex])) {
                var D = (F.layerX || 0) + (((!_isIE) && (F.target.tagName == "DIV")) ? E.offsetLeft : 0);
                var H = parseInt(this.getPosition(E, this.hdrBox));
                if (((E.offsetWidth - (F.offsetX || (H - D) * -1)) < (_isOpera ? 20 : 10)) || ((this.entBox.offsetWidth - (F.offsetX ? (F.offsetX + E.offsetLeft) : D) + this.objBox.scrollLeft - 0) < (_isOpera ? 20 : 10))) { E.style.cursor = "E-resize" } else { E.style.cursor = "default" }
                if (_isOpera) { this.hdrBox.scrollLeft = this.objBox.scrollLeft }
            };
            this._fake.startColResizeA = this._fake.startColResize;
            this._fake.startColResize = function (E) {
                var F = this.startColResizeA(E);
                this._initalSplR = this.entBox.offsetWidth;
                this._initalSplF = null;
                if (this.entBox.onmousemove) {
                    var D = this.entBox.parentNode;
                    if (D._aggrid) {
                        return F
                    }
                    D._aggrid = D.grid;
                    D.grid = this;
                    this.entBox.parentNode.onmousemove = this.entBox.onmousemove;
                    this.entBox.onmousemove = null
                }
                return F
            };
            this._fake.stopColResizeA = this._fake.stopColResize;
            this._fake.stopColResize = function (E) {
                if (this.entBox.parentNode.onmousemove) {
                    var D = this.entBox.parentNode;
                    D.grid = D._aggrid;
                    D._aggrid = null;
                    this.entBox.onmousemove = this.entBox.parentNode.onmousemove;
                    this.entBox.parentNode.onmousemove = null;
                    if (this.obj.offsetWidth < this.entBox.offsetWidth) { this._correctSplit(this.obj.offsetWidth) }
                }
                return this.stopColResizeA(E)
            };
            this.doKeyA = this.doKey;
            this._fake.doKeyA = this._fake.doKey;

            function l(K, J, D, M) {
                var E = M.shiftKey ? -1 : 1;
                var F = M.shiftKey ? -1 : D._cCount;
                var I = false;
                for (var H = K + E; H != F; H += E) {
                    if (D.smartTabOrder) { I = D.cells2(J, H).isDisabled() ? false : H } else { I = H }
                    if (I !== false) {
                        var L = !D._key_events.k_other;
                        D.selectCell(J, I, false, false, L, true);
                        M.cancelBubble = true;
                        if (M.preventDefault) { M.preventDefault() }
                        return true
                    }
                }
            }
            this._fake.doKey = this.doKey = function (I) {
                if (!I) {
                    return true
                }
                if (this._htkebl) {
                    return true
                }
                if ((I.target || I.srcElement).value !== window.undefined) {
                    var E = (I.target || I.srcElement);
                    if ((!E.parentNode) || (E.parentNode.className.indexOf("editable") == -1)) {
                        return true
                    }
                }
                switch (I.keyCode) {
                    case 9:
                        var H = this._realfake ? this._fake : this;
                        if (!H.callEvent("onTab", [true])) {
                            return true
                        }
                        if (this.cell) {
                            var F = this.cell._cellIndex;
                            var D = H.getRowIndex(this.cell.parentNode.idd);
                            while (!l(F, D, H, I)) {
                                D += (I.shiftKey ? -1 : 1);
                                if (D < 0 || D >= H.rowsBuffer.length) {
                                    return
                                }
                                F = I.shiftKey ? H._cCount : -1
                            }
                            return
                        }
                        break
                }
                return this.doKeyA(I)
            };
            this.editCellA = this.editCell;
            this.editCell = function () {
                if (this.cell && this.cell.parentNode.grid != this) {
                    return this._fake.editCell()
                }
                return this.editCellA()
            };
            this.deleteRowA = this.deleteRow;
            this.deleteRow = function (D, E) {
                if (this.deleteRowA(D, E) === false) {
                    return false
                }
                if (this._fake.rowsAr[D]) { this._fake.deleteRow(D) }
            };
            this.clearAllA = this.clearAll;
            this.clearAll = function () {
                this.clearAllA();
                this._fake.clearAll()
            };
            this.editStopA = this.editStop;
            this.editStop = function (D) {
                if (this._fake.editor) { this._fake.editStop(D) } else { this.editStopA(D) }
            };
            this.attachEvent("onAfterSorting", function (E, D, F) {
                if (E >= m) { this._fake.setSortImgState(false) }
            });
            this._fake.sortField = function (E, D, H) {
                this._fake.sortField.call(this._fake, E, D, this._fake.hdr.rows[0].cells[E]);
                if (this.fldSort[E] != "na" && this._fake.fldSorted) {
                    var F = this._fake.getSortingState()[1];
                    this._fake.setSortImgState(false);
                    this.setSortImgState(true, arguments[0], F)
                }
            };
            this.sortTreeRowsA = this.sortTreeRows;
            this._fake.sortTreeRowsA = this._fake.sortTreeRows;
            this.sortTreeRows = this._fake.sortTreeRows = function (F, H, D, E) {
                if (this._realfake) {
                    return this._fake.sortTreeRows(F, H, D, E)
                }
                this.sortTreeRowsA(F, H, D, E);
                this._fake._h2syncModel();
                this._fake.setSortImgStateA(false);
                this._fake.fldSorted = null
            };
            this._fake._fillers = [];
            this._fake.rowsBuffer = this.rowsBuffer;
            this.attachEvent("onClearAll", function () { this._fake.rowsBuffer = this.rowsBuffer });
            this._add_filler_s = this._add_filler;
            this._add_filler = function (E, D, I, F) {
                if (!this._fake._fillers) { this._fake._fillers = [] }
                if (this._realfake || !F) {
                    var H;
                    if (I && I.idd) { H = this._fake.rowsAr[I.idd] } else {
                        if (I && I.nextSibling) {
                            H = {};
                            H.nextSibling = this._fake.rowsAr[I.nextSibling.idd];
                            H.parentNode = H.nextSibling.parentNode
                        } else {
                            if (this._fake._fillers.length) { H = this._fake._fillers[this._fake._fillers.length - 1][2] }
                        }
                    }
                    this._fake._fillers.push(this._fake._add_filler(E, D, H))
                }
                return this._add_filler_s.apply(this, arguments)
            };
            this._add_from_buffer_s = this._add_from_buffer;
            this._add_from_buffer = function () {
                var D = this._add_from_buffer_s.apply(this, arguments);
                if (D != -1) {
                    this._fake._add_from_buffer.apply(this._fake, arguments);
                    if (this.multiLine) { this._correctRowHeight(this.rowsBuffer[arguments[0]].idd) }
                }
                return D
            };
            this._fake.render_row = function (D) {
                var E = this._fake.render_row(D);
                if (E == -1) {
                    return -1
                }
                if (E) {
                    return this.rowsAr[E.idd] = this.rowsAr[E.idd] || this._fake.copy_row(E)
                }
                return null
            };
            this._reset_view_s = this._reset_view;
            this._reset_view = function () {
                this._fake._reset_view(true);
                this._fake._fillers = [];
                this._reset_view_s()
            };
            this.moveColumn_s = this.moveColumn;
            this.moveColumn = function (E, D) {
                if (D >= m) {
                    return this.moveColumn_s(E, D)
                }
            };
            this.attachEvent("onCellChanged", function (I, F, H) {
                if (this._split_event && F < m && this.rowsAr[I]) {
                    var D = this._fake.rowsAr[I];
                    if (!D) {
                        return
                    }
                    if (D._childIndexes) { D = D.childNodes[D._childIndexes[F]] } else { D = D.childNodes[F] }
                    var E = this.rowsAr[I].childNodes[F];
                    if (E._treeCell && E.firstChild.lastChild) { E.firstChild.lastChild.innerHTML = H } else { E.innerHTML = D.innerHTML }
                    E._clearCell = false;
                    E.combo_value = D.combo_value;
                    E.chstate = D.chstate
                }
            });
            this._fake.combos = this.combos;
            this.setSizes();
            if (this.rowsBuffer[0]) { this._reset_view() }
            this.attachEvent("onXLE", function () { this._fake._correctSplit() });
            this._fake._correctSplit()
        };
    }
};
dhtmlXGridObject.prototype._correctSplit = function (c) {
    c = c || (this.obj.scrollWidth - this.objBox.scrollLeft);
    c = Math.min(this.globalBox.offsetWidth, c);
    if (c > -1) {
        this.entBox.style.width = c + "px";
        this.objBox.style.width = c + "px";
        var g = (this.globalBox.offsetWidth - this.globalBox.clientWidth) / 2;
        this._fake.entBox.style.left = c + "px";
        this._fake.entBox.style.width = Math.max(0, this.globalBox.offsetWidth - c - (this.quirks ? 0 : 2) * g) + "px";
        if (this._fake.ftr) { this._fake.ftr.parentNode.style.width = this._fake.entBox.style.width }
        if (_isIE) {
            var e = _isIE && !window.xmlHttpRequest;
            var g = (this.globalBox.offsetWidth - this.globalBox.clientWidth);
            this._fake.hdrBox.style.width = this._fake.objBox.style.width = Math.max(0, this.globalBox.offsetWidth - (e ? g : 0) - c) + "px"
        }
    }
};
dhtmlXGridObject.prototype._correctRowHeight = function (o, m) {
    if (!this.rowsAr[o] || !this._fake.rowsAr[o]) {
        return
    }
    var l = parseInt(this.rowsAr[o].style.height) || this.rowsAr[o].offsetHeight;
    var e = parseInt(this._fake.rowsAr[o].style.height) || this._fake.rowsAr[o].offsetHeight;
    var a = Math.max(l, e) - (this.rowsAr[o].delta_fix || 0);
    if (!a) {
        return
    }
    this.rowsAr[o].style.height = this._fake.rowsAr[o].style.height = Math.round(a + 1) + "px";
    this.rowsAr[o].delta_fix = 1;
    if (window._KHTMLrv) {
        var c = this._fake._cCount;
        var n;
        while (!n && c >= 0) {
            n = this.rowsAr[o].childNodes[c];
            c -= 1
        }
        var g = this._fake.rowsAr[o].firstChild;
        if (n && g) { n.style.height = g.style.height = a + "px" }
    }
};
dhtmlXGridObject.prototype.enableAutoSizeSaving = function (c, a) { this.attachEvent("onResizeEnd", function () { this.saveSizeToCookie(c, a) }) };
dhtmlXGridObject.prototype.saveOpenStates = function (c, a) {
    if (!c) { c = this.entBox.id }
    var e = [];
    this._h2.forEachChild(0, function (h) {
        if (h.state == "minus") { e.push(h.id) }
    });
    var g = "gridOpen" + (c || "") + "=" + e.join("|") + (a ? ("; " + a) : "");
    document.cookie = g
};
dhtmlXGridObject.prototype.loadOpenStates = function (e, a) {
    var h = this.getCookie(e, "gridOpen");
    if (!h) {
        return
    }
    h = h.split("|");
    for (var g = 0; g < h.length; g++) {
        var c = this.getParentId(h[g]);
        if (!this.getOpenState(c)) {
            continue
        }
        this.openItem(h[g])
    }
};
dhtmlXGridObject.prototype.enableAutoHiddenColumnsSaving = function (c, a) { this.attachEvent("onColumnHidden", function () { this.saveHiddenColumnsToCookie(c, a) }) };
dhtmlXGridObject.prototype.enableSortingSaving = function (c, a) {
    this.attachEvent("onBeforeSorting", function () {
        var e = this;
        window.setTimeout(function () { e.saveSortingToCookie(c, a) }, 1);
        return true
    })
};
dhtmlXGridObject.prototype.enableOrderSaving = function (c, a) {
    this.attachEvent("onAfterCMove", function () {
        this.saveOrderToCookie(c, a);
        this.saveSizeToCookie(c, a)
    })
};
dhtmlXGridObject.prototype.enableAutoSaving = function (c, a) {
    this.enableOrderSaving(c, a);
    this.enableAutoSizeSaving(c, a);
    this.enableSortingSaving(c, a)
};
dhtmlXGridObject.prototype.saveSizeToCookie = function (c, a) {
    if (this.cellWidthType == "px") {
        var h = this.cellWidthPX
    } else {
        var h = this.cellWidthPC
    }
    var g = (this.initCellWidth || []).join(",");
    if (this._hrrar) {
        for (var e = 0; e < this._hrrar.length; e++) {
            if (this._hrrar[e]) { h[e] = "" }
        }
    }
    this.setCookie(c, a, 0, h.join(","));
    this.setCookie(c, a, 1, g)
};
dhtmlXGridObject.prototype.saveHiddenColumnsToCookie = function (c, a) {
    var g = [].concat(this._hrrar || []);
    if (this._fake && this._fake._hrrar) {
        for (var e = 0; e < this._fake._cCount; e++) { g[e] = this._fake._hrrar[e] ? "1" : "" }
    }
    this.setCookie(c, a, 4, g.join(",").replace(/display:none;/g, "1"))
};
dhtmlXGridObject.prototype.loadHiddenColumnsFromCookie = function (c) {
    var g = this._getCookie(c, 4);
    var a = (g || "").split(",");
    for (var e = 0; e < this._cCount; e++) { this.setColumnHidden(e, (a[e] ? true : false)) }
};
dhtmlXGridObject.prototype.saveSortingToCookie = function (c, a) { this.setCookie(c, a, 2, (this.getSortingState() || []).join(",")) };
dhtmlXGridObject.prototype.loadSortingFromCookie = function (a) {
    var c = this._getCookie(a, 2);
    c = (c || "").split(",");
    if (c.length > 1 && c[0] < this._cCount) {
        this.sortRows(c[0], null, c[1]);
        this.setSortImgState(true, c[0], c[1])
    }
};
dhtmlXGridObject.prototype.saveOrderToCookie = function (e, a) {
    if (!this._c_order) {
        this._c_order = [];
        var c = this._cCount;
        for (var g = 0; g < c; g++) { this._c_order[g] = g }
    }
    this.setCookie(e, a, 3, ((this._c_order || []).slice(0, this._cCount)).join(","));
    this.saveSortingToCookie(e, a)
};
dhtmlXGridObject.prototype.loadOrderFromCookie = function (c) {
    var h = this._getCookie(c, 3);
    h = (h || "").split(",");
    if (h.length > 1 && h.length <= this._cCount) {
        for (var g = 0; g < h.length; g++) {
            if ((!this._c_order && h[g] != g) || (this._c_order && h[g] != this._c_order[g])) {
                var e = h[g];
                if (this._c_order) {
                    for (var a = 0; a < this._c_order.length; a++) {
                        if (this._c_order[a] == h[g]) {
                            e = a;
                            break
                        }
                    }
                }
                this.moveColumn(e * 1, g)
            }
        }
    }
};
dhtmlXGridObject.prototype.loadSizeFromCookie = function (a) {
    var e = this._getCookie(a, 1);
    if (e) { this.initCellWidth = e.split(",") }
    var e = this._getCookie(a, 0);
    if ((e) && (e.length)) {
        e = e.split(",");
        if (!this._fake && this._hrrar) {
            for (var c = 0; c < e.length; c++) {
                if (this._hrrar[c]) { e[c] = 0 }
            }
        }
        if (this.cellWidthType == "px") { this.cellWidthPX = e } else { this.cellWidthPC = e }
    }
    for (var c = 0; c < e.length; c++) {
        if (e[c] === "") {
            e[c] = this.initCellWidth[c];
            this.setColumnHidden(c, true)
        }
    }
    this.setSizes();
    return true
};
dhtmlXGridObject.prototype.clearConfigCookie = function (a) {
    if (!a) { a = this.entBox.id }
    var c = "gridSettings" + a + "=||||";
    document.cookie = c
};
dhtmlXGridObject.prototype.clearSizeCookie = dhtmlXGridObject.prototype.clearConfigCookie;
dhtmlXGridObject.prototype.setCookie = function (c, a, l, g) {
    if (!c) { c = this.entBox.id }
    var e = this.getCookie(c);
    e = (e || "||||").split("|");
    e[l] = g;
    var h = "gridSettings" + c + "=" + e.join("|").replace(/,/g, "-") + (a ? ("; " + a) : "");
    document.cookie = h
};
dhtmlXGridObject.prototype.getCookie = function (c, g) {
    if (!c) { c = this.entBox.id }
    c = (g || "gridSettings") + c;
    var e = c + "=";
    if (document.cookie.length > 0) {
        var h = document.cookie.indexOf(e);
        if (h != -1) {
            h += e.length;
            var a = document.cookie.indexOf(";", h);
            if (a == -1) { a = document.cookie.length }
            return document.cookie.substring(h, a)
        }
    }
};
dhtmlXGridObject.prototype._getCookie = function (a, c) {
    return ((this.getCookie(a) || "||||").replace(/-/g, ",").split("|"))[c]
};
dhtmlXGridObject.prototype.enableUndoRedo = function () {
    var c = this;
    var e = function () {
        return c._onEditUndoRedo.apply(c, arguments)
    };
    this.attachEvent("onEditCell", e);
    var a = function (h, g, l) {
        return c._onEditUndoRedo.apply(c, [2, h, g, (l ? 1 : 0), (l ? 0 : 1)])
    };
    this.attachEvent("onCheckbox", a);
    this._IsUndoRedoEnabled = true;
    this._UndoRedoData = [];
    this._UndoRedoPos = -1
};
dhtmlXGridObject.prototype.disableUndoRedo = function () {
    this._IsUndoRedoEnabled = false;
    this._UndoRedoData = [];
    this._UndoRedoPos = -1
};
dhtmlXGridObject.prototype._onEditUndoRedo = function (e, c, l, g, a) {
    if (this._IsUndoRedoEnabled && e == 2 && a != g) {
        if (this._UndoRedoPos !== -1 && this._UndoRedoPos != (this._UndoRedoData.length - 1)) { this._UndoRedoData = this._UndoRedoData.slice(0, this._UndoRedoPos + 1) } else {
            if (this._UndoRedoPos === -1 && this._UndoRedoData.length > 0) { this._UndoRedoData = [] }
        }
        var h = { old_value: a, new_value: g, row_id: c, cell_index: l };
        this._UndoRedoData.push(h);
        this._UndoRedoPos++
    }
    return true
};
dhtmlXGridObject.prototype.doUndo = function () {
    if (this._UndoRedoPos === -1) {
        return false
    }
    var a = this._UndoRedoData[this._UndoRedoPos--];
    var e = this.cells(a.row_id, a.cell_index);
    if (this.getColType(a.cell_index) == "tree") { e.setLabel(a.old_value) } else { e.setValue(a.old_value) }
    this.callEvent("onUndo", [a.row_id])
};
dhtmlXGridObject.prototype.doRedo = function () {
    if (this._UndoRedoPos == this._UndoRedoData.length - 1) {
        return false
    }
    var a = this._UndoRedoData[++this._UndoRedoPos];
    this.cells(a.row_id, a.cell_index).setValue(a.new_value);
    this.callEvent("onUndo", [a.row_id])
};
dhtmlXGridObject.prototype.getRedo = function () {
    if (this._UndoRedoPos == this._UndoRedoData.length - 1) {
        return []
    }
    return this._UndoRedoData.slice(this._UndoRedoPos + 1)
};
dhtmlXGridObject.prototype.getUndo = function () {
    if (this._UndoRedoPos == -1) {
        return []
    }
    return this._UndoRedoData.slice(0, this._UndoRedoPos + 1)
};
dhtmlXGridObject.prototype.enableAccessKeyMap = function () {
    this._select_ifpossible = function () {
        if (this.editor && this.editor.obj && this.editor.obj.select) { this.editor.obj.select() }
    };
    this._key_events = {
        k13_1_0: function () { this.editStop() },
        k13_0_1: function () { this._key_events.k9_0_1.call(this) },
        k13_0_0: function () { this._key_events.k9_0_0.call(this) },
        k9_0_0: function () {
            this.editStop();
            if (!this.callEvent("onTab", [true])) {
                return true
            }
            var a = this._getNextCell(null, 1);
            if (a) {
                if (this.pagingOn) { this.showRow(a.parentNode.idd) }
                this.selectCell(a.parentNode, a._cellIndex, (this.row != a.parentNode), false, true);
                this._still_active = true
            }
            this._select_ifpossible()
        },
        k9_0_1: function () {
            this.editStop();
            if (!this.callEvent("onTab", [false])) {
                return true
            }
            var a = this._getNextCell(null, -1);
            if (a) {
                this.selectCell(a.parentNode, a._cellIndex, (this.row != a.parentNode), false, true);
                this._still_active = true
            }
            this._select_ifpossible()
        },
        k113_0_0: function () {
            if (this._f2kE) { this.editCell() }
        },
        k32_0_0: function () {
            var a = this.cells4(this.cell);
            if (!a.changeState || (a.changeState() === false)) {
                return false
            }
        },
        k27_0_0: function () { this.editStop(true) },
        k33_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage - 1) } else { this.scrollPage(-1) }
        },
        k34_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage + 1) } else { this.scrollPage(1) }
        },
        k37_0_0: function () {
            if (this.editor) {
                return false
            }
            if (this.isTreeGrid()) { this.collapseKids(this.row) } else { this._key_events.k9_0_1.call(this) }
        },
        k39_0_0: function () {
            if (this.editor) {
                return false
            }
            if (!this.editor && this.isTreeGrid()) { this.expandKids(this.row) } else { this._key_events.k9_0_0.call(this) }
        },
        k37_1_0: function () {
            if (this.editor) {
                return false
            }
            this.selectCell(this.row, 0, false, false, true);
            this._select_ifpossible()
        },
        k39_1_0: function () {
            if (this.editor) {
                return false
            }
            this.selectCell(this.row, this._cCount - 1, false, false, true);
            this._select_ifpossible()
        },
        k38_1_0: function () {
            this.selectCell(this.rowsCol[0], this.cell._cellIndex, true, false, true);
            this._select_ifpossible()
        },
        k40_1_0: function () {
            this.selectCell(this.rowsCol[this.rowsCol.length - 1], this.cell._cellIndex, true, false, true);
            this._select_ifpossible()
        },
        k38_0_1: function () {
            var a = this.getRowIndex(this.row.idd);
            var c = this._nextRow(a, -1);
            if (!c || c._sRow || c._rLoad) {
                return false
            }
            this.selectCell(c, this.cell._cellIndex, true, false, true);
            this._select_ifpossible()
        },
        k40_0_1: function () {
            var a = this.getRowIndex(this.row.idd);
            var c = this._nextRow(a, 1);
            if (!c || c._sRow || c._rLoad) {
                return false
            }
            this.selectCell(c, this.cell._cellIndex, true, false, true);
            this._select_ifpossible()
        },
        k38_1_1: function () {
            var a = this.getRowIndex(this.row.idd);
            for (var c = a; c >= 0; c--) { this.selectCell(this.rowsCol[c], this.cell._cellIndex, true, false, true) }
        },
        k40_1_1: function () {
            var a = this.getRowIndex(this.row.idd);
            for (var c = a + 1; c < this.rowsCol.length; c++) { this.selectCell(this.rowsCol[c], this.cell._cellIndex, true, false, true) }
        },
        k40_0_0: function () {
            if (this.editor && this.editor.combo) { this.editor.shiftNext() } else {
                if (!this.row.idd) {
                    return
                }
                var a = a = this.getRowIndex(this.row.idd) + 1;
                if (this.rowsBuffer[a]) {
                    var c = this._nextRow(a - 1, 1);
                    if (this.pagingOn && c) { this.showRow(c.idd) }
                    this._Opera_stop = 0;
                    this.selectCell(c, this.cell._cellIndex, true, false, true)
                } else {
                    if (!this.callEvent("onLastRow", [])) {
                        return false
                    }
                    this._key_events.k34_0_0.apply(this, [])
                }
            }
            this._still_active = true
        },
        k36_0_0: function () {
            return this._key_events.k37_1_0.call(this)
        },
        k35_0_0: function () {
            return this._key_events.k39_1_0.call(this)
        },
        k36_1_0: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            this.selectCell(this.rowsCol[0], 0, true, false, true);
            this._select_ifpossible()
        },
        k35_1_0: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            this.selectCell(this.rowsCol[this.rowsCol.length - 1], this._cCount - 1, true, false, true);
            this._select_ifpossible()
        },
        k33_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage - 1) } else { this.scrollPage(-1) }
        },
        k34_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage + 1) } else { this.scrollPage(1) }
        },
        k38_0_0: function () {
            if (this.editor && this.editor.combo) { this.editor.shiftPrev() } else {
                if (!this.row.idd) {
                    return
                }
                var a = a = this.getRowIndex(this.row.idd) + 1;
                if (a != -1) {
                    var c = this._nextRow(a - 1, -1);
                    this._Opera_stop = 0;
                    if (this.pagingOn && c) { this.showRow(c.idd) }
                    this.selectCell(c, this.cell._cellIndex, true, false, true)
                } else { this._key_events.k33_0_0.apply(this, []) }
            }
            this._still_active = true
        }
    }
};
dhtmlXGridObject.prototype.enableExcelKeyMap = function () {
    this._key_events = {
        k13_1_0: function () { this.editStop() },
        k13_0_1: function () {
            this.editStop();
            this._key_events.k38_0_0.call(this)
        },
        k13_0_0: function () {
            this.editStop();
            this.callEvent("onEnter", [(this.row ? this.row.idd : null), (this.cell ? this.cell._cellIndex : null)]);
            this._still_active = true;
            this._key_events.k40_0_0.call(this)
        },
        k9_0_0: function () {
            this.editStop();
            if (!this.callEvent("onTab", [true])) {
                return true
            }
            if (this.cell && (this.cell._cellIndex + 1) >= this._cCount) {
                return
            }
            var a = this._getNextCell(null, 1);
            if (a && this.row == a.parentNode) {
                this.selectCell(a.parentNode, a._cellIndex, true);
                this._still_active = true
            }
        },
        k9_0_1: function () {
            this.editStop();
            if (!this.callEvent("onTab", [false])) {
                return true
            }
            if (this.cell && (this.cell._cellIndex == 0)) {
                return
            }
            var a = this._getNextCell(null, -1);
            if (a && this.row == a.parentNode) {
                this.selectCell(a.parentNode, a._cellIndex, true);
                this._still_active = true
            }
        },
        k113_0_0: function () {
            if (this._f2kE) { this.editCell() }
        },
        k32_0_0: function () {
            var a = this.cells4(this.cell);
            if (!a.changeState || (a.changeState() === false)) {
                return false
            }
        },
        k27_0_0: function () {
            this.editStop(true);
            this._still_active = true
        },
        k33_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage - 1) } else { this.scrollPage(-1) }
        },
        k34_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage + 1) } else { this.scrollPage(1) }
        },
        k37_0_0: function () {
            if (this.editor) {
                return false
            }
            if (this.isTreeGrid()) { this.collapseKids(this.row) } else { this._key_events.k9_0_1.call(this) }
        },
        k39_0_0: function () {
            if (this.editor) {
                return false
            }
            if (!this.editor && this.isTreeGrid()) { this.expandKids(this.row) } else { this._key_events.k9_0_0.call(this) }
        },
        k37_1_0: function () {
            if (this.editor) {
                return false
            }
            this.selectCell(this.row, 0, true)
        },
        k39_1_0: function () {
            if (this.editor) {
                return false
            }
            this.selectCell(this.row, this._cCount - 1, true)
        },
        k38_1_0: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            this.selectCell(this.rowsCol[0], this.cell._cellIndex, true)
        },
        k40_1_0: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            this.selectCell(this.rowsCol[this.rowsCol.length - 1], this.cell._cellIndex, true)
        },
        k38_0_1: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            var a = this.row.rowIndex;
            var c = this._nextRow(a - 1, -1);
            if (!c || c._sRow || c._rLoad) {
                return false
            }
            this.selectCell(c, this.cell._cellIndex, true, true)
        },
        k40_0_1: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            var a = this.row.rowIndex;
            var c = this._nextRow(a - 1, 1);
            if (!c || c._sRow || c._rLoad) {
                return false
            }
            this.selectCell(c, this.cell._cellIndex, true, true)
        },
        k38_1_1: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            var a = this.row.rowIndex;
            for (var c = a - 1; c >= 0; c--) { this.selectCell(this.rowsCol[c], this.cell._cellIndex, true, true) }
        },
        k40_1_1: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            var a = this.row.rowIndex;
            for (var c = a; c < this.rowsCol.length; c++) { this.selectCell(this.rowsCol[c], this.cell._cellIndex, true, true) }
        },
        k40_0_0: function () {
            var c = this._realfake ? this._fake : this;
            if (this.editor && this.editor.combo) { this.editor.shiftNext() } else {
                if (this.editor) {
                    return false
                }
                var a = Math.max((c._r_select || 0), this.getRowIndex(this.row.idd));
                var e = this._nextRow(a, 1);
                if (e) {
                    c._r_select = null;
                    this.selectCell(e, this.cell._cellIndex, true);
                    if (c.pagingOn) { c.showRow(e.idd) }
                } else {
                    if (!this.callEvent("onLastRow", [])) {
                        return false
                    }
                    this._key_events.k34_0_0.apply(this, [])
                }
            }
        },
        k36_0_0: function () {
            return this._key_events.k37_1_0.call(this)
        },
        k35_0_0: function () {
            return this._key_events.k39_1_0.call(this)
        },
        k36_1_0: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            this.selectCell(this.rowsCol[0], 0, true)
        },
        k35_1_0: function () {
            if (this.editor || !this.rowsCol.length) {
                return false
            }
            this.selectCell(this.rowsCol[this.rowsCol.length - 1], this._cCount - 1, true)
        },
        k33_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage - 1) } else { this.scrollPage(-1) }
        },
        k34_0_0: function () {
            if (this.pagingOn) { this.changePage(this.currentPage + 1) } else { this.scrollPage(1) }
        },
        k38_0_0: function () {
            var c = this._realfake ? this._fake : this;
            if (this.editor && this.editor.combo) { this.editor.shiftPrev() } else {
                if (this.editor) {
                    return false
                }
                if (!this.row.idd) {
                    return
                }
                var a = this.getRowIndex(this.row.idd) + 1;
                if (a != -1 && (!this.pagingOn || (a != 1))) {
                    var e = this._nextRow(a - 1, -1);
                    this.selectCell(e, this.cell._cellIndex, true);
                    if (c.pagingOn && e) { c.showRow(e.idd) }
                } else { this._key_events.k33_0_0.apply(this, []) }
            }
        },
        k_other: function (e) {
            if (this.editor) {
                return false
            }
            if (!e.ctrlKey && e.keyCode >= 40 && (e.keyCode < 91 || (e.keyCode > 95 && e.keyCode < 111) || e.keyCode > 187)) {
                if (this.cell) {
                    var g = this.cells4(this.cell);
                    if (g.isDisabled()) {
                        return false
                    }
                    var a = g.getValue();
                    if (g.editable !== false) { g.setValue("") }
                    this.editCell();
                    if (this.editor) {
                        this.editor.val = a;
                        if (this.editor.obj && this.editor.obj.select) { this.editor.obj.select() }
                    } else { g.setValue(a) }
                }
            }
        }
    }
};

function eXcell_time(a) {
    this.base = eXcell_ed;
    this.base(a);
    this.getValue = function () {
        return this.cell.innerHTML.toString()
    };
    this.setValue = function (l) {
        var h = new RegExp(" ", "i");
        l = l.replace(h, ":");
        if ((l == "")) { l = "00:00" } else {
            var h = new RegExp("[a-zA-Z]", "i");
            var g = l.match(h);
            if (g) { l = "00:00" } else {
                var h = new RegExp("[0-9]+[\\.\\/;\\-,_\\]\\[\\?\\: ][0-9]+", "i");
                var g = l.search(h);
                if (g != -1) {
                    var h = new RegExp("[\\./\\;\\-\\,\\_\\]\\[ \\?]", "i");
                    l = l.replace(h, ":")
                } else {
                    var h = new RegExp("[^0-9]", "i");
                    res1 = l.search(h);
                    if (g = l.match(h)) { l = "00:00" } else {
                        if (l.length == 1) { l = "00:0" + l } else {
                            if (parseInt(l) < 60) { l = "00:" + l } else {
                                if (l.length < 5) {
                                    var e = parseInt(l);
                                    var c = Math.floor(e / 60);
                                    e = e - 60 * c;
                                    var c = c.toString();
                                    var e = e.toString();
                                    while (c.length < 2) { c = "0" + c }
                                    while (e.length < 2) { e = "0" + e }
                                    l = c + ":" + e
                                }
                            }
                        }
                    }
                }
            }
        }
        this.cell.innerHTML = l
    }
}
eXcell_time.prototype = new eXcell_ed;

function eXcell_sub_row(a) {
    if (a) {
        this.cell = a;
        this.grid = this.cell.parentNode.grid
    }
    this.getValue = function () {
        return this.grid.getUserData(this.cell.parentNode.idd, "__sub_row")
    };
    this._setState = function (c, e) {
        (e || this.cell).innerHTML = "<img src='" + this.grid.imgURL + c + "' width='18' height='18' />";
        (e || this.cell).firstChild.onclick = this.grid._expandMonolite
    };
    this.open = function () { this.cell.firstChild.onclick(null, true) };
    this.close = function () { this.cell.firstChild.onclick(null, false, true) };
    this.isOpen = function () {
        return !!this.cell.parentNode._expanded
    };
    this.setValue = function (c) {
        if (c) { this.grid.setUserData(this.cell.parentNode.idd, "__sub_row", c) }
        this._setState(c ? "plus.gif" : "blank.gif")
    };
    this.setContent = function (c) {
        if (this.cell.parentNode._expanded) {
            this.cell.parentNode._expanded.innerHTML = c;
            this.resize()
        } else {
            this.cell._previous_content = null;
            this.setValue(c);
            this.cell._sub_row_type = null
        }
    };
    this.resize = function () { this.grid._detectHeight(this.cell.parentNode._expanded, this.cell, this.cell.parentNode._expanded.scrollHeight) }, this.isDisabled = function () {
        return true
    };
    this.getTitle = function () {
        return this.grid.getUserData(this.cell.parentNode.idd, "__sub_row") ? "click to expand|collapse" : ""
    }
}
eXcell_sub_row.prototype = new eXcell;

function eXcell_sub_row_ajax(a) {
    this.base = eXcell_sub_row;
    this.base(a);
    this.setValue = function (c) {
        if (c) { this.grid.setUserData(this.cell.parentNode.idd, "__sub_row", c) }
        this.cell._sub_row_type = "ajax";
        this.cell._previous_content = null;
        this._setState(c ? "plus.gif" : "blank.gif")
    }
}
eXcell_sub_row_ajax.prototype = new eXcell_sub_row;

function eXcell_sub_row_grid(a) {
    this.base = eXcell_sub_row;
    this.base(a);
    this.setValue = function (c) {
        if (c) { this.grid.setUserData(this.cell.parentNode.idd, "__sub_row", c) }
        this.cell._sub_row_type = "grid";
        this._setState(c ? "plus.gif" : "blank.gif")
    };
    this.getSubGrid = function () {
        if (!a._sub_grid) {
            return null
        }
        return a._sub_grid
    }
}
eXcell_sub_row_grid.prototype = new eXcell_sub_row;
dhtmlXGridObject.prototype._expandMonolite = function (a, u, l) {
    var e = this.parentNode;
    var v = e.parentNode;
    var o = v.grid;
    if (a || window.event) {
        if (!l && !v._expanded) { o.editStop() } (a || event).cancelBubble = true
    }
    var s = o.getUserData(v.idd, "__sub_row");
    if (!o._sub_row_editor) { o._sub_row_editor = new eXcell_sub_row(e) }
    if (!s) {
        return
    }
    if (v._expanded && !u) {
        o._sub_row_editor._setState("plus.gif", e);
        e._previous_content = v._expanded;
        o.objBox.removeChild(v._expanded);
        v._expanded = false;
        v.style.height = (v.oldHeight || 20) + "px";
        e.style.height = (v.oldHeight || 20) + "px";
        if (o._fake) {
            o._fake.rowsAr[v.idd].style.height = (v.oldHeight || 20) + "px";
            o._fake.rowsAr[v.idd].firstChild.style.height = (v.oldHeight || 20) + "px"
        }
        for (var h = 0; h < v.cells.length; h++) { v.cells[h].style.verticalAlign = "middle" }
        delete o._flow[v.idd];
        o._correctMonolite();
        v._expanded.ctrl = null
    } else {
        if (!v._expanded && !l) {
            o._sub_row_editor._setState("minus.gif", e);
            v.oldHeight = e.offsetHeight - 4;
            if (e._previous_content) {
                var r = e._previous_content;
                r.ctrl = e;
                o.objBox.appendChild(r);
                o._detectHeight(r, e, parseInt(r.style.height))
            } else {
                var r = document.createElement("DIV");
                r.ctrl = e;
                if (e._sub_row_type) { o._sub_row_render[e._sub_row_type](o, r, e, s) } else { r.innerHTML = s }
                r.style.cssText = "position:absolute; left:0px; top:0px; overflow:auto; font-family:Tahoma; font-size:8pt; margin-top:2px; margin-left:4px;";
                r.className = "dhx_sub_row";
                o.objBox.appendChild(r);
                o._detectHeight(r, e)
            }
            if (!o._flow) {
                o.attachEvent("onGridReconstructed", function () {
                    if ((this.pagingOn && !this.parentGrid) || this._srnd) { this._collapsMonolite() } else { this._correctMonolite() }
                });
                o.attachEvent("onResizeEnd", function () { this._correctMonolite(true) });
                o.attachEvent("onAfterCMove", function () { this._correctMonolite(true) });
                o.attachEvent("onDrop", function () { this._correctMonolite(true) });
                o.attachEvent("onBeforePageChanged", function () {
                    this._collapsMonolite();
                    return true
                });
                o.attachEvent("onGroupStateChanged", function () {
                    this._correctMonolite();
                    return true
                });
                o.attachEvent("onFilterEnd", function () { this._collapsMonolite() });
                o.attachEvent("onUnGroup", function () { this._collapsMonolite() });
                o.attachEvent("onPageChanged", function () { this._collapsMonolite() });
                o.attachEvent("onXLE", function () { this._collapsMonolite() });
                o.attachEvent("onClearAll", function () {
                    for (var c in this._flow) {
                        if (this._flow[c] && this._flow[c].parentNode) { this._flow[c].parentNode.removeChild(this._flow[c]) }
                    }
                    this._flow = []
                });
                o.attachEvent("onEditCell", function (w, n, x) {
                    if ((w !== 2) && this._flow[n] && this.cellType[x] != "ch" && this.cellType[x] != "ra") { this._expandMonolite.apply(this._flow[n].ctrl.firstChild, [0, false, true]) }
                    return true
                });
                o.attachEvent("onCellChanged", function (x, n) {
                    if (!this._flow[x]) {
                        return
                    }
                    var w = this.cells(x, n).cell;
                    w.style.verticalAlign = "top"
                });
                o._flow = []
            }
            o._flow[v.idd] = r;
            o._correctMonolite();
            var m = o._srdh > 30 ? 11 : 3;
            if (o.multiLine) { m = 0 }
            for (var h = 0; h < v.cells.length; h++) { v.cells[h].style.verticalAlign = "top" }
            if (o._fake) {
                var g = o._fake.rowsAr[v.idd];
                for (var h = 0; h < g.cells.length; h++) { g.cells[h].style.verticalAlign = "top" }
            }
            v._expanded = r
        }
    }
    if (o._ahgr) { o.setSizes() }
    if (o.parentGrid) { o.callEvent("onGridReconstructed", []) }
    o.callEvent("onSubRowOpen", [v.idd, (!!v._expanded)])
};
dhtmlXGridObject.prototype._sub_row_render = {
    ajax: function (that, d, td, c) {
        d.innerHTML = "Loading...";
        dhx4.ajax.get(c, function (xml) {
            d.innerHTML = xml.xmlDoc.responseText;
            var z = xml.xmlDoc.responseText.match(/<script[^>]*>([^\f]+?)<\/script>/g);
            if (z) {
                for (var i = 0; i < z.length; i++) { eval(z[i].replace(/<([\/]{0,1})s[^>]*>/g, "")) }
            }
            that._detectHeight(d, td);
            that._correctMonolite();
            that.setUserData(td.parentNode.idd, "__sub_row", xml.xmlDoc.responseText);
            td._sub_row_type = null;
            if (that._ahgr) { that.setSizes() }
            that.callEvent("onSubAjaxLoad", [td.parentNode.idd, xml.xmlDoc.responseText])
        })
    },
    grid: function (a, e, h, g) {
        h._sub_grid = new dhtmlXGridObject(e);
        if (a.skin_name) { h._sub_grid.setSkin(a.skin_name) }
        h._sub_grid.parentGrid = a;
        h._sub_grid.imgURL = a.imgURL;
        h._sub_grid.iconURL = a.iconURL;
        h._sub_grid.enableAutoHeight(true);
        h._sub_grid._delta_x = h._sub_grid._delta_y = null;
        h._sub_grid.attachEvent("onGridReconstructed", function () {
            a._detectHeight(e, h, h._sub_grid.objBox.scrollHeight + h._sub_grid.hdr.offsetHeight + (this.ftr ? this.ftr.offsetHeight : 0));
            a._correctMonolite();
            this.setSizes();
            if (a.parentGrid) { a.callEvent("onGridReconstructed", []) }
        });
        if (!a.callEvent("onSubGridCreated", [h._sub_grid, h.parentNode.idd, h._cellIndex, g])) {
            h._sub_grid.objBox.style.overflow = "hidden";
            h._sub_row_type = null
        } else {
            h._sub_grid.load(g, function () {
                a._detectHeight(e, h, h._sub_grid.objBox.scrollHeight + h._sub_grid.hdr.offsetHeight + (h._sub_grid.ftr ? h._sub_grid.ftr.offsetHeight : 0));
                h._sub_grid.objBox.style.overflow = "hidden";
                a._correctMonolite();
                h._sub_row_type = null;
                if (!a.callEvent("onSubGridLoaded", [h._sub_grid, h.parentNode.idd, h._cellIndex, g])) {
                    return
                }
                if (a._ahgr) { a.setSizes() }
            })
        }
    }
};
dhtmlXGridObject.prototype._detectHeight = function (m, n, c) {
    var a = n.offsetLeft + n.offsetWidth;
    m.style.left = a + "px";
    m.style.width = Math.max(0, n.parentNode.offsetWidth - a - 4) + "px";
    var c = c || m.scrollHeight;
    m.style.overflow = "hidden";
    m.style.height = c + "px";
    var g = n.parentNode;
    n.parentNode.style.height = (g.oldHeight || 20) + c * 1 + "px";
    n.style.height = (g.oldHeight || 20) + c * 1 + "px";
    if (this._fake) {
        var e = this._fake.rowsAr[n.parentNode.idd];
        e.style.height = (g.oldHeight || 20) + c * 1 + "px";
        e.firstChild.style.height = (g.oldHeight || 20) + c * 1 + "px"
    }
};
dhtmlXGridObject.prototype._correctMonolite = function (g) {
    if (this._in_correction) {
        this._in_correction = true;
        for (var e in this._flow) {
            if (this._flow[e] && this._flow[e].tagName == "DIV") {
                if (this.rowsAr[e]) {
                    if (this.rowsAr[e].style.display == "none") {
                        this.cells4(this._flow[e].ctrl).close();
                        continue
                    }
                    this._flow[e].style.top = this.rowsAr[e].offsetTop + (this.rowsAr[e].oldHeight || 20) + "px";
                    if (g) {
                        var c = this._flow[e].ctrl.offsetLeft + this._flow[e].ctrl.offsetWidth;
                        this._flow[e].style.left = c + "px";
                        this._flow[e].style.width = this.rowsAr[e].offsetWidth - c - 4 + "px"
                    }
                } else {
                    this._flow[e].ctrl = null;
                    this.objBox.removeChild(this._flow[e]);
                    delete this._flow[e]
                }
            }
        }
        this._in_correction = false
    };
};
dhtmlXGridObject.prototype._collapsMonolite = function () {
    for (var c in this._flow) {
        if (this._flow[c] && this._flow[c].tagName == "DIV") {
            if (this.rowsAr[c]) { this.cells4(this._flow[c].ctrl).close() }
        }
    }
};

function eXcell_ra_str(a) {
    if (a) {
        this.base = eXcell_ra;
        this.base(a);
        this.grid = a.parentNode.grid
    }
}
eXcell_ra_str.prototype = new eXcell_ch;
eXcell_ra_str.prototype.setValue = function (e) {
    this.cell.style.verticalAlign = "middle";
    if (e) {
        e = e.toString()._dhx_trim();
        if ((e == "false") || (e == "0")) { e = "" }
    }
    if (e) {
        if (this.grid.rowsAr[this.cell.parentNode.idd]) {
            for (var c = 0; c < this.grid._cCount; c++) {
                if (c !== this.cell._cellIndex) {
                    var a = this.grid.cells(this.cell.parentNode.idd, c);
                    if ((a.cell._cellType || this.grid.cellType[a.cell._cellIndex]) != "ra_str") {
                        continue
                    }
                    if (a.getValue()) { a.setValue("0") }
                }
            }
        }
        e = "1";
        this.cell.chstate = "1"
    } else {
        e = "0";
        this.cell.chstate = "0"
    }
    this.setCValue("<img src='" + this.grid.imgURL + "radio_chk" + e + ".gif' onclick='new eXcell_ra_str(this.parentNode).changeState()'>", this.cell.chstate)
};
dhx4.attachEvent("onGridCreated", function (c) {
    if (!window.dhx_globalImgPath) { window.dhx_globalImgPath = c.imgURL }
    c._col_combos = [];
    for (var a = 0; a < c._cCount; a++) {
        if (c.cellType[a].indexOf("combo") == 0) { c._col_combos[a] = eXcell_combo.prototype.initCombo.call({ grid: c }, a) }
    }
    if (!c._loading_handler_set) {
        c._loading_handler_set = c.attachEvent("onXLE", function (g, e, m, h, l) {
            if (l != "xml") {
                return
            }
            eXcell_combo.prototype.fillColumnCombos(this, h);
            this.detachEvent(this._loading_handler_set);
            this._loading_handler_set = null
        })
    }
});

function eXcell_combo(a) {
    this.cell = a;
    this.grid = a.parentNode.grid;
    this._combo_pre = "";
    this.edit = function () {
        if (!window.dhx_globalImgPath) { window.dhx_globalImgPath = this.grid.imgURL }
        this.val = this.getValue();
        var c = this.getText();
        if (this.cell._clearCell) { c = "" }
        this.cell.innerHTML = "";
        if (!this.cell._brval) { this.combo = (this.grid._realfake ? this.grid._fake : this.grid)._col_combos[this.cell._cellIndex] } else { this.combo = this.cell._brval }
        this.cell.appendChild(this.combo.DOMParent);
        this.combo.DOMParent.style.margin = "0";
        this.combo.DOMelem_input.focus();
        this.combo.setSize(this.cell.offsetWidth - 2);
        if (!this.combo._xml) {
            if (this.combo.getIndexByValue(this.cell.combo_value) != -1) { this.combo.selectOption(this.combo.getIndexByValue(this.cell.combo_value)) } else {
                if (this.combo.getOptionByLabel(c)) { this.combo.selectOption(this.combo.getIndexByValue(this.combo.getOptionByLabel(c).value)) } else { this.combo.setComboText(c) }
            }
        } else { this.combo.setComboText(c) }
        this.combo.openSelect()
    };
    this.selectComboOption = function (e, c) { c.selectOption(c.getIndexByValue(c.getOptionByLabel(e).value)) };
    this.getValue = function (c) {
        return this.cell.combo_value || ""
    };
    this.getText = function (e) {
        var g = this.cell;
        if (this._combo_pre == "" && g.childNodes[1]) { g = g.childNodes[1] } else { g.childNodes[0].childNodes[1] }
        return (_isIE ? g.innerText : g.textContent)
    };
    this.setValue = function (h) {
        if (typeof (h) == "object") {
            this.cell._brval = this.initCombo();
            var e = this.cell._cellIndex;
            var g = this.cell.parentNode.idd;
            if (!h.firstChild) {
                this.cell.combo_value = "&nbsp;";
                this.cell._clearCell = true
            } else { this.cell.combo_value = h.firstChild.data }
            this.setComboOptions(this.cell._brval, h, this.grid, e, g)
        } else {
            this.cell.combo_value = h;
            var c = null;
            if ((c = this.cell._brval) && (typeof (this.cell._brval) == "object")) { h = (c.getOption(h) || {}).text || h } else {
                if (c = this.grid._col_combos[this.cell._cellIndex] || ((this.grid._fake) && (c = this.grid._fake._col_combos[this.cell._cellIndex]))) { h = (c.getOption(h) || {}).text || h }
            }
            if ((h || "").toString()._dhx_trim() == "") { h = null }
            if (h !== null) { this.setComboCValue(h) } else {
                this.setComboCValue("&nbsp;", "");
                this.cell._clearCell = true
            }
        }
    };
    this.detach = function () {
        var c = this.combo.getParent();
        if (c.parentNode == this.cell) { this.cell.removeChild(c) } else {
            return false
        }
        var e = this.cell.combo_value;
        this.combo._confirmSelect("blur");
        if (!this.combo.getComboText() || this.combo.getComboText().toString()._dhx_trim() == "") {
            this.setComboCValue("&nbsp;");
            this.cell._clearCell = true
        } else {
            this.setComboCValue(this.combo.getComboText().replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), this.combo.getActualValue());
            this.cell._clearCell = false
        }
        this.cell.combo_value = this.combo.getActualValue();
        this.combo.closeAll();
        this.grid._still_active = true;
        this.grid.setActive(1);
        return e != this.cell.combo_value
    }
}
eXcell_combo.prototype = new eXcell;
eXcell_combo_v = function (a) {
    var c = new eXcell_combo(a);
    c._combo_pre = "<img src='" + (window.dhx_globalImgPath ? window.dhx_globalImgPath : this.grid.imgURL) + "combo_select" + (dhtmlx.skin ? "_" + dhtmlx.skin : "") + ".gif' class='dhxgrid_combo_icon'/>";
    return c
};
eXcell_combo.prototype.initCombo = function (c) {
    var a = document.createElement("DIV");
    a.className = "dhxcombo_in_grid_parent";
    var g = this.grid.defVal[arguments.length ? c : this.cell._cellIndex];
    var h = new dhtmlXCombo(a, "combo", 0, g);
    this.grid.defVal[arguments.length ? c : this.cell._cellIndex] = "";
    var e = this.grid;
    h.DOMelem.onmousedown = h.DOMelem.onclick = function (l) {
        l = l || event;
        l.cancelBubble = true
    };
    h.DOMelem.onselectstart = function (l) {
        l = l || event;
        l.cancelBubble = true;
        return true
    };
    this.grid.attachEvent("onScroll", function () {
        if (h._isListVisible()) { h._hideList() }
    });
    h.attachEvent("onKeyPressed", function (l) {
        if (l == 13 || l == 27) {
            e.editStop();
            if (e._fake) { e._fake.editStop() }
        }
    });
    return h
};
eXcell_combo.prototype.fillColumnCombos = function (e, a) {
    var g = dhx4.ajax.xmltop("rows", a, -1);
    if (g && g.tagName !== "DIV") {
        e.combo_columns = e.combo_columns || [];
        columns = dhx4.ajax.xpath("//column", g);
        for (var c = 0; c < columns.length; c++) {
            if ((columns[c].getAttribute("type") || "").indexOf("combo") == 0) {
                e.combo_columns[e.combo_columns.length] = c;
                this.setComboOptions(e._col_combos[c], columns[c], e, c)
            }
        }
    }
};
eXcell_combo.prototype.setComboCValue = function (e, c) {
    if (this._combo_pre != "") {
        var a = (this.cell.offsetHeight ? this.cell.offsetHeight + "px" : 0);
        e = "<div style='width:100%;position:relative;height:100%;overflow:hidden;'>" + this._combo_pre + "<span>" + e + "</span></div>"
    }
    if (arguments.length > 1) { this.setCValue(e, c) } else { this.setCValue(e) }
};
eXcell_combo.prototype.setComboOptions = function (l, m, e, r, u) {
    if (window.dhx4.s2b(m.getAttribute("xmlcontent"))) {
        if (!m.getAttribute("source")) {
            options = m.childNodes;
            var a = [];
            for (var n = 0; n < options.length; n++) {
                if (options[n].tagName == "option") {
                    var g = options[n].firstChild ? options[n].firstChild.data : "";
                    a[a.length] = [options[n].getAttribute("value"), g, (options[n].getAttribute("css") || "")]
                }
            }
            l.addOption(a);
            if (arguments.length == 4) {
                e.forEachRowA(function (w) {
                    var v = e.cells(w, r);
                    if (!v.cell._brval && !v.cell._cellType && (v.cell._cellIndex == r)) {
                        if (v.cell.combo_value == "") { v.setComboCValue("&nbsp;", "") } else {
                            if (!l.getOption(v.cell.combo_value)) { v.setComboCValue(v.cell.combo_value) } else { v.setComboCValue(l.getOption(v.cell.combo_value).text, v.cell.combo_value) }
                        }
                    }
                })
            } else {
                var s = (this.cell) ? this : e.cells(u, r);
                if (m.getAttribute("text")) {
                    if (m.getAttribute("text")._dhx_trim() == "") { s.setComboCValue("&nbsp;", "") } else { s.setComboCValue(m.getAttribute("text")) }
                } else {
                    if ((!s.cell.combo_value) || (s.cell.combo_value._dhx_trim() == "")) { s.setComboCValue("&nbsp;", "") } else {
                        if (!l.getOption(s.cell.combo_value)) { s.setComboCValue(s.cell.combo_value) } else { s.setComboCValue(l.getOption(s.cell.combo_value).text, s.cell.combo_value) }
                    }
                }
            }
        }
    }
    if (m.getAttribute("source")) {
        if (m.getAttribute("auto") && window.dhx4.s2b(m.getAttribute("auto"))) {
            if (m.getAttribute("xmlcontent")) {
                var s = (this.cell) ? this : e.cells(u, r);
                if (m.getAttribute("text")) { s.setComboCValue(m.getAttribute("text")) }
            } else {
                e.forEachRowA(function (y) {
                    var x = e.cells(y, r);
                    if (!x.cell._brval && !x.cell._cellType) {
                        var w = x.cell.combo_value.toString();
                        if (w.indexOf("^") != -1) {
                            var v = w.split("^");
                            x.cell.combo_value = v[0];
                            x.setComboCValue(v[1])
                        }
                    }
                })
            }
            l.enableFilteringMode(true, m.getAttribute("source"), window.dhx4.s2b(m.getAttribute("cache") || true), window.dhx4.s2b(m.getAttribute("sub") || false))
        } else {
            var o = this;
            var h = arguments.length;
            l.load(m.getAttribute("source"), function () {
                if (h == 4) {
                    e.forEachRow(function (x) {
                        var w = e.cells(x, r);
                        if (!w.cell._brval && !w.cell._cellType) {
                            if (l.getOption(w.cell.combo_value)) { w.setComboCValue(l.getOption(w.cell.combo_value).text, w.cell.combo_value) } else {
                                if ((w.cell.combo_value || "").toString()._dhx_trim() == "") {
                                    w.setComboCValue("&nbsp;", "");
                                    w.cell._clearCell = true
                                } else { w.setComboCValue(w.cell.combo_value) }
                            }
                        }
                    })
                } else {
                    var v = e.cells(u, r);
                    if (l.getOption(v.cell.combo_value)) { v.setComboCValue(l.getOption(v.cell.combo_value).text, v.cell.combo_value) } else { v.setComboCValue(v.cell.combo_value) }
                }
            })
        }
    }
    if (!m.getAttribute("auto") || !window.dhx4.s2b(m.getAttribute("auto"))) {
        if (m.getAttribute("editable") && !window.dhx4.s2b(m.getAttribute("editable"))) { l.readonly(true) }
        if (m.getAttribute("filter") && window.dhx4.s2b(m.getAttribute("filter"))) { l.enableFilteringMode(true) }
    }
};
eXcell_combo.prototype.getCellCombo = function () {
    if (this.cell._brval) {
        return this.cell._brval
    }
    this.cell._brval = this.initCombo();
    return this.cell._brval
};
eXcell_combo.prototype.refreshCell = function () { this.setValue(this.getValue()) };
dhtmlXGridObject.prototype.getColumnCombo = function (a) {
    if (this._col_combos && this._col_combos[a]) {
        return this._col_combos[a]
    }
    if (!this._col_combos) { this._col_combos = [] }
    this._col_combos[a] = eXcell_combo.prototype.initCombo.call({ grid: this }, a);
    return this._col_combos[a]
};
dhtmlXGridObject.prototype.refreshComboColumn = function (a) {
    this.forEachRow(function (c) {
        if (this.cells(c, a).refreshCell) { this.cells(c, a).refreshCell() }
    })
};

function eXcell_clist(a) {
    try {
        this.cell = a;
        this.grid = this.cell.parentNode.grid
    } catch (c) { }
    this.edit = function () {
        this.val = this.getValue();
        var g = (this.cell._combo || this.grid.clists[this.cell._cellIndex]);
        if (!g) {
            return
        }
        this.obj = document.createElement("DIV");
        var e = this.val.split(",");
        var o = "";
        for (var m = 0; m < g.length; m++) {
            var n = false;
            for (var h = 0; h < e.length; h++) {
                if (g[m] == e[h]) { n = true }
            }
            if (n) { o += "<div><input type='checkbox' id='dhx_clist_" + m + "' checked='true' /><label for='dhx_clist_" + m + "'>" + g[m] + "</label></div>" } else { o += "<div><input type='checkbox' id='dhx_clist_" + m + "'/><label for='dhx_clist_" + m + "'>" + g[m] + "</label></div>" }
        }
        o += "<div><input type='button' value='" + (this.grid.applyButtonText || "Apply") + "' style='width:100px; font-size:8pt;' onclick='this.parentNode.parentNode.editor.grid.editStop();'/></div>";
        this.obj.editor = this;
        this.obj.innerHTML = o;
        document.body.appendChild(this.obj);
        this.obj.style.position = "absolute";
        this.obj.className = "dhx_clist";
        this.obj.onclick = function (r) {
            (r || event).cancelBubble = true;
            return true
        };
        var l = this.grid.getPosition(this.cell);
        this.obj.style.left = l[0] + "px";
        this.obj.style.top = l[1] + this.cell.offsetHeight + "px";
        this.obj.getValue = function () {
            var s = "";
            for (var r = 0; r < this.childNodes.length - 1; r++) {
                if (this.childNodes[r].childNodes[0].checked) {
                    if (s) { s += ", " }
                    s += this.childNodes[r].childNodes[1].innerHTML
                }
            }
            return s.replace(/&amp;/g, "&")
        }
    };
    this.getValue = function () {
        if (this.cell._clearCell) {
            return ""
        }
        return this.cell.innerHTML.toString()._dhx_trim().replace(/&amp;/g, "&").replace(/, /g, ",")
    };
    this.detach = function (e) {
        if (this.obj) {
            this.setValue(this.obj.getValue());
            this.obj.editor = null;
            this.obj.parentNode.removeChild(this.obj);
            this.obj = null
        }
        return this.val != this.getValue()
    }
}
eXcell_clist.prototype = new eXcell;
eXcell_clist.prototype.setValue = function (e) {
    if (typeof (e) == "object") {
        var c = dhx4.ajax.xpath("./option", e);
        if (c.length) { this.cell._combo = [] }
        for (var a = 0; a < c.length; a++) { this.cell._combo.push(c[a].firstChild ? c[a].firstChild.data : "") }
        e = e.firstChild.data
    }
    if (e === "" || e === this.undefined) {
        this.setCTxtValue(" ", e);
        this.cell._clearCell = true
    } else {
        e = e.replace(/,[ ]*/g, ", ");
        this.setCTxtValue(e);
        this.cell._clearCell = false
    }
};
dhtmlXGridObject.prototype.registerCList = function (a, c) {
    if (!this.clists) { this.clists = new Array() }
    if (typeof (c) != "object") { c = c.split(",") }
    this.clists[a] = c
};

function eXcell_calck(a) {
    try {
        this.cell = a;
        this.grid = this.cell.parentNode.grid
    } catch (c) { }
    this.edit = function () {
        this.val = this.getValue();
        var e = this.grid.getPosition(this.cell);
        this.obj = new calcX(e[0], e[1] + this.cell.offsetHeight, this, this.val)
    };
    this.getValue = function () {
        return this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(), this.cell._cellIndex)
    };
    this.detach = function () {
        if (this.obj) {
            this.setValue(this.obj.inputZone.value);
            this.obj.removeSelf()
        }
        this.obj = null;
        return this.val != this.getValue()
    }
}
eXcell_calck.prototype = new eXcell;
eXcell_calck.prototype.setValue = function (a) {
    if (!a || a.toString()._dhx_trim() == "") { a = "0" }
    this.setCValue(this.grid._aplNF(a, this.cell._cellIndex), a)
};

function calcX(left, top, onReturnSub, val) {
    this.top = top || 0;
    this.left = left || 0;
    this.onReturnSub = onReturnSub || null;
    this.operandA = 0;
    this.operandB = 0;
    this.operatorA = "";
    this.state = 0;
    this.dotState = 0;
    this.calckGo = function () {
        return (eval(this.operandA + "*1" + this.operatorA + this.operandB + "*1"))
    };
    this.isNumeric = function (str) {
        return ((str.search(/[^1234567890]/gi) == -1) ? (true) : (false))
    };
    this.isOperation = function (str) {
        return ((str.search(/[^\+\*\-\/]/gi) == -1) ? (true) : (false))
    };
    this.onCalcKey = function (e) {
        that = this.calk;
        var z = this.innerHTML;
        var rZone = that.inputZone;
        if (((that.state == 0) || (that.state == 2)) && (that.isNumeric(z))) {
            if (rZone.value != "0") { rZone.value += z } else { rZone.value = z }
        }
        if ((((that.state == 0) || (that.state == 2)) && (z == ".")) && (that.dotState == 0)) {
            that.dotState = 1;
            rZone.value += z
        }
        if ((z == "C")) {
            rZone.value = 0;
            that.dotState = 0;
            that.state = 0
        }
        if ((that.state == 0) && (that.isOperation(z))) {
            that.operatorA = z;
            that.operandA = rZone.value;
            that.state = 1
        }
        if ((that.state == 2) && (that.isOperation(z))) {
            that.operandB = rZone.value;
            rZone.value = that.calckGo();
            that.operatorA = z;
            that.operandA = rZone.value;
            that.state = 1
        }
        if ((that.state == 2) && (z == "=")) {
            that.operandB = rZone.value;
            rZone.value = that.calckGo();
            that.operatorA = z;
            that.operandA = rZone.value;
            that.state = 3
        }
        if ((that.state == 1) && (that.isNumeric(z))) {
            rZone.value = z;
            that.state = 2;
            that.dotState = 0
        }
        if ((that.state == 3) && (that.isNumeric(z))) {
            rZone.value = z;
            that.state = 0
        }
        if ((that.state == 3) && (that.isOperation(z))) {
            that.operatorA = z;
            that.operandA = rZone.value;
            that.state = 1
        }
        if (z == "e") {
            rZone.value = Math.E;
            if (that.state == 1) { that.state = 2 }
            that.dotState = 0
        }
        if (z == "p") {
            rZone.value = Math.PI;
            if (that.state == 1) { that.state = 2 }
            that.dotState = 0
        }
        if (z == "Off") { that.topNod.parentNode.removeChild(that.topNod) }
        if (e || event) {
            (e || event).cancelBubble = true
        }
    };
    this.sendResult = function () {
        that = this.calk;
        if (that.state == 2) {
            var rZone = that.inputZone;
            that.operandB = rZone.value;
            rZone.value = that.calckGo();
            that.operatorA = z;
            that.operandA = rZone.value;
            that.state = 3
        }
        var z = that.inputZone.value;
        that.topNod.parentNode.removeChild(that.topNod);
        that.onReturnSub.grid.editStop(false)
    };
    this.removeSelf = function () {
        if (this.topNod.parentNode) { this.topNod.parentNode.removeChild(this.topNod) }
    };
    this.keyDown = function () { this.className = "calcPressed" };
    this.keyUp = function () { this.className = "calcButton" };
    this.init_table = function () {
        var table = this.topNod.childNodes[0];
        if ((!table) || (table.tagName != "TABLE")) {
            return
        }
        for (i = 1; i < table.childNodes[0].childNodes.length; i++) {
            for (j = 0; j < table.childNodes[0].childNodes[i].childNodes.length; j++) {
                table.childNodes[0].childNodes[i].childNodes[j].onclick = this.onCalcKey;
                table.childNodes[0].childNodes[i].childNodes[j].onmousedown = this.keyDown;
                table.childNodes[0].childNodes[i].childNodes[j].onmouseout = this.keyUp;
                table.childNodes[0].childNodes[i].childNodes[j].onmouseup = this.keyUp;
                table.childNodes[0].childNodes[i].childNodes[j].calk = this
            }
        }
        this.inputZone = this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
        if (this.onReturnSub) {
            this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].onclick = this.sendResult;
            this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].calk = this
        } else { this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerHTML = "" }
    };
    this.drawSelf = function () {
        var div = document.createElement("div");
        div.className = "calcTable";
        div.style.position = "absolute";
        div.style.top = this.top + "px";
        div.style.left = this.left + "px";
        div.innerHTML = "<table cellspacing='0' id='calc_01' class='calcTable'><tr><td colspan='4'><table cellpadding='1' cellspacing='0' width='100%'><tr><td width='100%' style='overflow:hidden;'><input style='width:100%' class='calcInput' value='0' align='right' readonly='true' style='text-align:right'></td><td class='calkSubmit'>=</td></tr></table></td></tr><tr><td class='calcButton' width='25%'>Off</td><td class='calcButton' width='25%'>p</td><td class='calcButton' width='25%'>e</td><td class='calcButton' width='25%'>/</td></tr><tr><td class='calcButton'>7</td><td class='calcButton'>8</td><td class='calcButton'>9</td><td class='calcButton'>*</td></tr><tr><td class='calcButton'>4</td><td class='calcButton'>5</td><td class='calcButton'>6</td><td class='calcButton'>+</td></tr><tr><td class='calcButton'>1</td><td class='calcButton'>2</td><td class='calcButton'>3</td><td class='calcButton'>-</td></tr><tr><td class='calcButton'>0</td><td class='calcButton'>.</td><td class='calcButton'>C</td><td class='calcButton'>=</td></tr></table>";
        div.onclick = function (e) {
            (e || event).cancelBubble = true
        };
        document.body.appendChild(div);
        this.topNod = div
    };
    this.drawSelf();
    this.init_table();
    if (val) {
        var rZone = this.inputZone;
        rZone.value = val * 1;
        this.operandA = val * 1;
        this.state = 3
    }
    return this
}
// var _0x44c0 = ["\x64\x6F\x63\x75\x6D\x65\x6E\x74", "\x64\x68\x74\x6D\x6C\x78\x2E\x63\x6F\x6D\x2F", "\x69\x6E\x64\x65\x78\x4F\x66", "\x68\x72\x65\x66", "\x6C\x6F\x63\x61\x74\x69\x6F\x6E", "\x49\x4D\x47", "\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74", "\x70\x6F\x73\x69\x74\x69\x6F\x6E", "\x73\x74\x79\x6C\x65", "\x61\x62\x73\x6F\x6C\x75\x74\x65", "\x6C\x65\x66\x74", "\x70\x78", "\x74\x6F\x70", "\x77\x69\x64\x74\x68", "\x68\x65\x69\x67\x68\x74", "\x76\x69\x73\x69\x62\x69\x6C\x69\x74\x79", "\x68\x69\x64\x64\x65\x6E", "\x73\x72\x63", "\x68\x74\x74\x70\x3A\x2F\x2F\x64\x68\x74\x6D\x6C\x78\x2E\x63\x6F\x6D\x2F\x64\x6F\x63\x73\x2F\x70\x72\x6F\x64\x75\x63\x74\x73\x2F\x64\x68\x74\x6D\x6C\x78\x57\x69\x6E\x64\x6F\x77\x73\x2F\x63\x6F\x64\x65\x62\x61\x73\x65\x2F\x69\x6D\x67\x73\x2F\x64\x68\x78\x5F\x73\x6B\x69\x62\x6C\x75\x65\x2F\x62\x6F\x72\x64\x65\x72\x2E\x67\x69\x66", "\x62\x6F\x64\x79", "\x64\x6F\x63\x75\x6D\x65\x6E\x74\x45\x6C\x65\x6D\x65\x6E\x74", "\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64", "\x73\x65\x74\x54\x69\x6D\x65\x6F\x75\x74", "\x54\x68\x69\x73\x20\x76\x65\x72\x73\x69\x6F\x6E\x20\x6F\x66\x20\x64\x68\x74\x6D\x6C\x78\x53\x75\x69\x74\x65\x20\x69\x73\x20\x6E\x6F\x74\x20\x69\x6E\x74\x65\x6E\x64\x65\x64\x20\x66\x6F\x72\x20\x75\x73\x69\x6E\x67\x20\x6F\x75\x74\x73\x69\x64\x65\x20\x6F\x66\x20\x64\x68\x74\x6D\x6C\x78\x2E\x63\x6F\x6D", "\x64\x68\x74\x6D\x6C\x78", "\x6D\x65\x73\x73\x61\x67\x65", "\x65\x72\x72\x6F\x72", "\x61\x6C\x65\x72\x74", "\x72\x61\x6E\x64\x6F\x6D", "\x66\x6C\x6F\x6F\x72"];
// (function() {
//     var a = (document || parent[_0x44c0[0]]);
//     if (String(a[_0x44c0[4]][_0x44c0[3]])[_0x44c0[2]](_0x44c0[1]) == -1) {
//         window[_0x44c0[22]](function() {
//             var e = a[_0x44c0[6]](_0x44c0[5]);
//             e[_0x44c0[8]][_0x44c0[7]] = _0x44c0[9];
//             e[_0x44c0[8]][_0x44c0[10]] = -100 + _0x44c0[11];
//             e[_0x44c0[8]][_0x44c0[12]] = -100 + _0x44c0[11];
//             e[_0x44c0[8]][_0x44c0[13]] = e[_0x44c0[8]][_0x44c0[14]] = 1 + _0x44c0[11];
//             e[_0x44c0[8]][_0x44c0[15]] = _0x44c0[16];
//             e[_0x44c0[17]] = _0x44c0[18];
//             var c = (a[_0x44c0[19]] || a[_0x44c0[20]]);
//             if (c) { c[_0x44c0[21]](e) }
//         }, 1);
//         window[_0x44c0[22]](function() {
//             var c = _0x44c0[23];
//             if (window[_0x44c0[24]] != null && window[_0x44c0[24]][_0x44c0[25]] != null) { dhtmlx[_0x44c0[25]]({ type: _0x44c0[26], text: c, expire: -1 }) } else { window[_0x44c0[27]](c) }
//         }, Math[_0x44c0[29]](Math[_0x44c0[28]]() * 7541) + 1574)
//     }
// })();
dhtmlXGridObject.prototype._updateTGRState = function (a) {
    if (!a.update || a.id == 0) {
        return
    }
    if (this.rowsAr[a.id].imgTag) { this.rowsAr[a.id].imgTag.src = this.iconTree + a.state + ".gif" }
    a.update = false
};
dhtmlXGridObject.prototype.doExpand = function (c) {
    this.editStop();
    var e = c.parentNode.parentNode.parentNode;
    var a = this._h2.get[e.idd];
    if (!this.callEvent("onOpen", [e.idd, (a.state == "plus" ? -1 : 1)])) {
        return
    }
    if (a.state == "plus") { this.expandKids(e) } else {
        if ((a.state == "minus") && (!a._closeable)) { this.collapseKids(e) }
    }
};
dhtmlXGridObject.prototype._createHierarchy = function () {
    if (!this._emptyLineImg) { this._emptyLineImg = "blank" }
    return new dhtmlxHierarchy({ _emptyLineImg: this._emptyLineImg })
};

function dhtmlxHierarchy(a) {
    var c = { id: 0, childs: [], level: -1, parent: null, index: 0, state: a._emptyLineImg };
    this.order = [c];
    this.get = { "0": c };
    this.swap = function (g, e) {
        var h = g.parent;
        var l = g.index;
        h.childs[l] = e;
        h.childs[e.index] = g;
        g.index = e.index;
        e.index = l
    };
    this.forEachChildF = function (n, e, l, g) {
        var m = this.get[n];
        for (var h = 0; h < m.childs.length; h++) {
            if (!e.apply((l || this), [m.childs[h]])) {
                continue
            }
            if (m.childs[h].childs.length) { this.forEachChildF(m.childs[h].id, e, l, g) }
            if (g) { g.call((l || this), m.childs[h]) }
        }
    };
    this.forEachChild = function (m, e, h) {
        var l = this.get[m];
        for (var g = 0; g < l.childs.length; g++) {
            e.apply((h || this), [l.childs[g]]);
            if (l.childs[g].childs.length) { this.forEachChild(l.childs[g].id, e, h) }
        }
    };
    this.change = function (l, e, h) {
        var g = this.get[l];
        if (g[e] == h) {
            return
        }
        g[e] = h;
        g.update = true
    };
    this.add = function (g, e) {
        return this.addAfter(g, e)
    };
    this.addAfter = function (r, o, h, g) {
        var n = this.get[o || 0];
        if (h) {
            var m = this.get[h].index + (g ? 0 : 1)
        } else {
            var m = n.childs.length
        }
        var e = { id: r, childs: [], level: n.level + 1, parent: n, index: m, state: a._emptyLineImg };
        if (n.state == a._emptyLineImg) { this.change(o, "state", (o == 0 ? "minus" : "plus")) }
        if (h) {
            for (var l = m; l < n.childs.length; l++) { n.childs[l].index++ }
            n.childs = n.childs.slice(0, m).concat([e]).concat(n.childs.slice(m, n.childs.length))
        } else { n.childs.push(e) }
        this.get[r] = e;
        return e
    };
    this.addBefore = function (h, g, e) {
        return this.addAfter(h, g, e, true)
    };
    this.remove = function (h) {
        var g = this.get[h || 0];
        for (var e = 0; e < g.childs.length; e++) { this.deleteAll(g.childs[e].id) }
        g.childs = [];
        g.parent.childs = g.parent.childs.slice(0, g.index).concat(g.parent.childs.slice(g.index + 1));
        for (var e = g.index; e < g.parent.childs.length; e++) { g.parent.childs[e].index-- }
        delete this.get[h]
    };
    this.deleteAll = function (h) {
        var g = this.get[h || 0];
        for (var e = 0; e < g.childs.length; e++) { this.deleteAll(g.childs[e].id) }
        g.childs = [];
        delete this.get[h]
    };
    return this
}
dhtmlXGridObject.prototype._getOpenLenght = function (g, e) {
    var c = this._h2.get[g].childs;
    e += c.length;
    for (var a = 0; a < c.length; a++) {
        if (c[a].childs.length && c[a].state == "minus") { e += this._getOpenLenght(c[a].id, 0) }
    }
    return e
};
dhtmlXGridObject.prototype.collapseKids = function (e) {
    var g = this._h2.get[e.idd];
    if (g.state != "minus") {
        return
    }
    if (!this.callEvent("onOpenStart", [e.idd, 1])) {
        return
    }
    var h = e.rowIndex;
    if (h < 0) { h = this.rowsCol._dhx_find(e) + 1 }
    this._h2.change(g.id, "state", "plus");
    this._updateTGRState(g);
    if (this._srnd || this.pagingOn) {
        this._h2_to_buff();
        this._renderSort()
    } else {
        var a = this._getOpenLenght(this.rowsCol[h - 1].idd, 0);
        for (var c = 0; c < a; c++) { this.rowsCol[h + c].parentNode.removeChild(this.rowsCol[h + c]) }
        this.rowsCol.splice(h, a)
    }
    this.callEvent("onGridReconstructed", []);
    this.setSizes();
    this._h2_to_buff();
    this.callEvent("onOpenEnd", [e.idd, -1])
};
dhtmlXGridObject.prototype._massInsert = function (a, e, g, o) {
    var h = [];
    var n = (_isKHTML ? this.obj : this.obj.rows[0].parentNode);
    this._h2_to_buff();
    if (this._srnd || this.pagingOn) {
        return this._renderSort()
    }
    var m = this._getOpenLenght(a.id, 0);
    for (var l = 0; l < m; l++) {
        var c = this.render_row(g + l);
        if (e) { e.parentNode.insertBefore(c, e) } else { n.appendChild(c) }
        h.push(c)
    }
    this.rowsCol = dhtmlxArray(this.rowsCol.slice(0, g).concat(h).concat(this.rowsCol.slice(g)));
    return a.childs.length + h.length
};
dhtmlXGridObject.prototype.expandKids = function (c, h) {
    var e = this._h2.get[c.idd];
    if ((!e.childs.length) && (!e._xml_await)) {
        return
    }
    if (e.state != "plus") {
        return
    }
    if (!e._loading && !h) {
        if (!this.callEvent("onOpenStart", [e.id, -1])) {
            return
        }
    }
    var g = this.getRowIndex(e.id) + 1;
    if (e.childs.length) {
        e._loading = false;
        this._h2.change(e.id, "state", "minus");
        this._updateTGRState(e);
        var a = this._massInsert(e, this.rowsCol[g], g);
        this.callEvent("onGridReconstructed", [])
    } else {
        if (e._xml_await) {
            e._loading = true;
            if (this.callEvent("onDynXLS", [e.id])) { this.load(this.kidsXmlFile + "" + (this.kidsXmlFile.indexOf("?") != -1 ? "&" : "?") + "id=" + encodeURIComponent(e.id), this._data_type) }
        }
    }
    this.setSizes();
    if (!e._loading) { this.callEvent("onOpenEnd", [e.id, 1]) }
    this._fixAlterCss()
};
dhtmlXGridObject.prototype.kidsXmlFile = "";
dhtmlXGridObject.prototype.sortTreeRows = function (g, h, a) {
    var l = "getValue";
    if (this.cells5({ parentNode: { grid: this } }, this.getColType(g)).getDate) {
        l = "getDate";
        h = "str"
    }
    this.forEachRow(function (s) {
        var r = this._h2.get[s];
        if (!r) {
            return
        }
        var o = this._get_cell_value(r.buff, g, l);
        if (h == "int") {
            r._sort = parseFloat(o);
            r._sort = isNaN(r._sort) ? -99999999999999 : r._sort
        } else { r._sort = o }
    });
    var e = this;
    var n = 1;
    var m = -1;
    if (a == "des") {
        n = -1;
        m = 1
    }
    var c = null;
    if (typeof h == "function") {
        c = function (r, o) {
            return h(r._sort, o._sort, a, r.id, o.id)
        }
    } else {
        if (h == "cus") {
            c = function (r, o) {
                return e._customSorts[g](r._sort, o._sort, a, r.id, o.id)
            }
        }
        if (h == "str") {
            c = function (r, o) {
                return (r._sort < o._sort ? m : (r._sort == o._sort ? 0 : n))
            }
        }
        if (h == "int") {
            c = function (r, o) {
                return (r._sort < o._sort ? m : (r._sort == o._sort ? 0 : n))
            }
        }
        if (h == "date") {
            c = function (r, o) {
                return (Date.parse(new Date(r._sort || "01/01/1900")) - Date.parse(new Date(o._sort || "01/01/1900"))) * n
            }
        }
    }
    this._sortTreeRows(c, 0);
    this._renderSort(0, true);
    this.callEvent("onGridReconstructed", [])
};
dhtmlXGridObject.prototype._sortTreeRows = function (a, g) {
    var c = this._h2.get[g].childs;
    if (this.rowsCol.stablesort) { this.rowsCol.stablesort.call(c, a) } else { c.sort(a) }
    for (var e = 0; e < c.length; e++) {
        if (c[e].childs.length) { this._sortTreeRows(a, c[e].id) }
        c[e].index = e
    }
};
dhtmlXGridObject.prototype._renderSort = function (e, c) {
    this._h2_to_buff();
    var a = this.objBox.scrollTop;
    this._reset_view();
    this.objBox.scrollTop = a
};
dhtmlXGridObject.prototype._fixAlterCssTGR = function () {
    if (!this._realfake) {
        this._h2.forEachChild(0, function (a) {
            if (a.buff.tagName == "TR") {
                var c = (this._cssSP ? (a.level % 2) : (a.index % 2)) ? this._cssUnEven : this._cssEven;
                this.rowsAr[a.id].className = (c + (this._cssSU ? (" " + c + "_" + a.level) : "")) + " " + (this.rowsAr[a.id]._css || "") + ((this.rowsAr[a.id].className.indexOf("rowselected") != -1) ? " rowselected" : "")
            }
        }, this)
    }
};
dhtmlXGridObject.prototype.moveRowUDTG = function (c, h) {
    var n = this._h2.get[c];
    var e = n.parent.childs[n.index + h];
    if ((!e) || (e.parent != n.parent)) {
        return
    }
    var a = [n.state, e.state];
    this.collapseKids(this.rowsAr[n.id]);
    this.collapseKids(this.rowsAr[e.id]);
    var g = this.rowsCol._dhx_find(this.rowsAr[c]);
    var m = this.rowsBuffer._dhx_find(this.rowsAr[c]);
    var o = this.obj.rows[0].parentNode.removeChild(this.rowsCol[g]);
    var l = this.rowsCol[g + ((h == 1) ? 2 : h)];
    if (l) { l.parentNode.insertBefore(o, l) } else { this.obj.rows[0].parentNode.appendChild(o) }
    this.rowsCol._dhx_swapItems(g, g + h);
    this.rowsBuffer._dhx_swapItems(m, m + h);
    this._h2.swap(e, n);
    if (a[0] == "minus") { this.expandKids(this.rowsAr[n.id]) }
    if (a[1] == "minus") { this.expandKids(this.rowsAr[e.id]) }
    this._fixAlterCss(Math.min(g, g + h))
};

function eXcell_tree(a) {
    if (a) {
        this.cell = a;
        this.grid = this.cell.parentNode.grid
    }
    this.isDisabled = function () {
        return this.cell._disabled || this.grid._edtc
    };
    this.edit = function () {
        if ((this.er) || (this.grid._edtc)) {
            return
        }
        this.er = this.cell.parentNode.valTag;
        this.val = this.getLabel();
        this.cell.atag = ((!this.grid.multiLine) && (_isKHTML || _isMacOS || _isFF)) ? "INPUT" : "TEXTAREA";
        this.er.innerHTML = "<" + this.cell.atag + " class='dhx_combo_edit' type='text' style='height:" + (this.cell.offsetHeight - 4) + "px;line-height:" + (this.cell.offsetHeight - 6) + "px; width:100%; border:0px; margin:0px; padding:0px; overflow:hidden;'></" + this.cell.atag + ">";
        this.er.childNodes[0].onmousedown = function (c) {
            (c || event).cancelBubble = true
        };
        this.er.childNodes[0].onselectstart = function (c) {
            if (!c) { c = event }
            c.cancelBubble = true;
            return true
        };
        this.er.className += " editable";
        this.er.firstChild.onclick = function (c) {
            (c || event).cancelBubble = true
        };
        this.er.firstChild.value = this.val;
        this.obj = this.er.firstChild;
        this.er.firstChild.style.width = Math.max(0, this.cell.offsetWidth - this.er.offsetLeft - 2) + "px";
        this.er.firstChild.focus();
        if (_isIE) { this.er.firstChild.focus() }
    };
    this.detach = function () {
        if (!this.er) {
            return
        }
        this.setLabel(this.er.firstChild.value);
        this.er.className = this.er.className.replace("editable", "");
        var c = (this.val != this.er.innerHTML);
        this.obj = this.er = null;
        return (c)
    };
    this.getValue = function () {
        return this.getLabel()
    };
    this.setImage = function (c) {
        this.cell.parentNode.imgTag.nextSibling.src = this.grid.iconURL + c;
        this.grid._h2.get[this.cell.parentNode.idd].image = c
    };
    this.setIcon = function (c) {
        this.grid._h2.get[this.cell.parentNode.idd].icon = c;
        this.cell.parentNode.imgTag.nextSibling.className = "dhx_treegrid_icon fa fa-" + c
    };
    this.getImage = function () {
        return this.grid._h2.get[this.cell.parentNode.idd].image
    };
    this.getIcon = function () {
        return this.grid._h2.get[this.cell.parentNode.idd].icon
    };
    this.setLabel = function (c) { this.setValueA(c) };
    this.getLabel = function (c) {
        return this.cell.parentNode.valTag.innerHTML
    }
}
eXcell_tree.prototype = new eXcell;
eXcell_tree.prototype.setValueA = function (a) {
    this.cell.parentNode.valTag.innerHTML = a;
    this.grid.callEvent("onCellChanged", [this.cell.parentNode.idd, this.cell._cellIndex, a])
};
eXcell_tree.prototype.setValue = function (a) {
    if (this.cell.parentNode.imgTag) {
        return this.setLabel(a)
    }
    if ((this.grid._tgc.iconTree == null) || (this.grid._tgc.iconTree != this.grid.iconTree)) {
        var h = {};
        //this.grid.iconTree="../js/dhtml5/codebase/imgs/dhxgrid_material/tree/"
        h.spacer = "<img src='" + this.grid.iconTree + "blank.gif'  align='top' class='space'>";
        h.imst = "<img class='grid_collapse_icon' src='" + this.grid.iconTree;
        h.imsti = "<img style='padding-top:2px;'  src='" + (this.grid.iconURL || this.grid.iconTree);
        h.imact = "' align='top' onclick='this." + (_isKHTML ? "" : "parentNode.") + "parentNode.parentNode.parentNode.parentNode.grid.doExpand(this);event.cancelBubble=true;'>";
        h.plus = h.imst + "plus.gif" + h.imact;
        h.minus = h.imst + "minus.gif" + h.imact;
        h.blank = h.imst + "blank.gif" + h.imact;
        h.start = "<div class='treegrid_cell' style='overflow:hidden; white-space : nowrap; line-height:23px; height:" + (_isIE ? 21 : 23) + "px;'>";
        h.itemim = "' align='top' " + (this.grid._img_height ? (' height="' + this.grid._img_height + '"') : "") + (this.grid._img_width ? (' width="' + this.grid._img_width + '"') : "") + " >";
        h.itemne = "<span id='nodeval'>";
        h.close = "</span></div>";
        this.grid._tgc = h
    }
    var l = this.grid._h2;
    var h = this.grid._tgc;
    var g = this.cell.parentNode.idd;
    var m = this.grid._h2.get[g];
    if (this.grid.kidsXmlFile || this.grid._slowParse) {
        m.has_kids = (m.has_kids || (this.cell.parentNode._attrs.xmlkids && (m.state != "minus")));
        m._xml_await = !!m.has_kids
    }
    m.image = m.image || (this.cell._attrs.image || "leaf.gif");
    m.icon = m.icon || (this.cell._attrs.icon || (this.grid.iconset ? "file-o" : ""));
    m.label = a;
    var e = [h.start];
    for (var c = 0; c < m.level; c++) { e.push(h.spacer) }
    if (m.has_kids) {
        e.push(h.plus);
        m.state = "plus"
    } else { e.push(h.imst + m.state + ".gif" + h.imact) }
    if (!m.icon) {
        if (m.image != "leaf.gif") {
            e.push(h.imsti);
            e.push(m.image);
            e.push(h.itemim);
        }
    } else { e.push("<i class='dhx_treegrid_icon fa fa-" + m.icon + "'></i>") }
    e.push(h.itemne);
    e.push(m.label);
    e.push(h.close);
    this.cell.innerHTML = e.join("");
    this.cell._treeCell = true;
    this.cell.parentNode.imgTag = this.cell.childNodes[0].childNodes[m.level];
    this.cell.parentNode.valTag = this.cell.childNodes[0].childNodes[m.level + 2];
    if (_isKHTML) { this.cell.vAlign = "top" }
    if (m.parent.id != 0 && m.parent.state == "plus") {
        this.grid._updateTGRState(m.parent, false);
        this.cell.parentNode._skipInsert = true
    }
    this.grid.callEvent("onCellChanged", [g, this.cell._cellIndex, a])
};
dhtmlXGridObject.prototype._process_tree_xml = function (l, c) {
    this._parsing = true;
    var a = false;
    if (!c) {
        this.render_row = this.render_row_tree;
        a = true;
        c = l.getAttribute("parent") || 0;
        if (c == "0") { c = 0 }
        if (!this._h2) { this._h2 = this._createHierarchy() }
        if (this._fake) { this._fake._h2 = this._h2 }
    }
    var h = dhx4.ajax.xpath(this.xml.row, l);
    this._open = this._open || [];
    for (var e = 0; e < h.length; e++) {
        var n = h[e].getAttribute("id");
        if (!n) {
            n = this.uid();
            h[e].setAttribute("id", n)
        }
        var m = this._h2.add(n, c);
        m.buff = { idd: n, data: h[e], _parser: this._process_xml_row, _locator: this._get_xml_data };
        if (h[e].getAttribute("open")) {
            m.state = "minus";
            this._open.push(n)
        }
        this.rowsAr[n] = m.buff;
        this._process_tree_xml(h[e], n)
    }
    if (a) {
        if (!h.length) { this._h2.change(c, "state", this._emptyLineImg) } else {
            if (c != 0 && !this._srnd) { this._h2.change(c, "state", "minus") }
        }
        for (var e = 0; e < this._open.length; e++) {
            var g = this._h2.get[this._open[e]];
            if (!g.childs.length) { g.state = this._emptyLineImg }
        }
        this._updateTGRState(this._h2.get[c]);
        this._h2_to_buff();
        if (c != 0 && this._srnd) { this.openItem(c) } else {
            if (this.pagingOn) { this._renderSort() } else { this.render_dataset() }
        }
        if (this.kidsXmlFile) {
            for (var e = 0; e < this._open.length; e++) {
                var g = this._h2.get[this._open[e]];
                if (g._xml_await) { this.expandKids({ idd: g.id }) }
            }
        }
        this._open = [];
        if (this._slowParse === false) { this.forEachRow(function (o) { this.render_row_tree(0, o) }) }
        this._parsing = false;
        if (c != 0 && !this._srnd) { this.callEvent("onOpenEnd", [c, 1]) }
    }
};
dhtmlXGridObject.prototype._h2_to_buff = function (c) {
    if (!c) {
        c = this._h2.get[0];
        this.rowsBuffer = new dhtmlxArray();
        if (this._fake && !this._realfake) { this._fake.rowsBuffer = this.rowsBuffer }
    }
    for (var a = 0; a < c.childs.length; a++) {
        this.rowsBuffer.push(c.childs[a].buff);
        if (c.childs[a].state == "minus") { this._h2_to_buff(c.childs[a]) }
    }
};
dhtmlXGridObject.prototype.render_row_tree = function (c, g) {
    if (g) {
        var a = this._h2.get[g];
        a = a ? a.buff : a
    } else {
        var a = this.rowsBuffer[c]
    }
    if (!a) {
        return -1
    }
    if (a._parser) {
        if (this.rowsAr[a.idd] && this.rowsAr[a.idd].tagName == "TR") {
            return this._h2.get[a.idd].buff = this.rowsBuffer[c] = this.rowsAr[a.idd]
        }
        var e = this._prepareRow(a.idd);
        this.rowsAr[a.idd] = e;
        if (!g) { this.rowsBuffer[c] = e }
        this._h2.get[a.idd].buff = e;
        a._parser.call(this, e, a.data);
        this._postRowProcessing(e);
        return e
    }
    return a
};
dhtmlXGridObject.prototype._removeTrGrRow = function (g, c) {
    if (c) {
        this._h2.forEachChild(c.id, function (l) {
            this._removeTrGrRow(null, l);
            delete this.rowsAr[l.id]
        }, this);
        var h = this.getRowIndex(g.idd);
        var c = this._h2.get[g.idd];
        if (h != -1 && h !== this.undefined) {
            var a = 1;
            if (c && c.state == "minus") { a += this._getOpenLenght(c.id, 0) }
            for (var e = 0; e < a; e++) {
                if (this.rowsCol[e + h]) { this.rowsCol[e + h].parentNode.removeChild(this.rowsCol[e + h]) }
            }
            if (this._fake) {
                for (var e = 0; e < a; e++) {
                    if (this._fake.rowsCol[e + h]) { this._fake.rowsCol[e + h].parentNode.removeChild(this._fake.rowsCol[e + h]) }
                }
                if (a > 1) { this._fake.rowsCol.splice(h + 1, a - 1) }
            }
            this.rowsCol.splice(h, a);
            this.rowsBuffer.splice(h, a)
        }
        if (!c) {
            this._removeTrGrRow(null, c);
            delete this.rowsAr[c.id];
            if (c.parent.childs.length == 1) {
                this._h2.change(c.parent.id, "state", this._emptyLineImg);
                this._updateTGRState(c.parent)
            }
            this._h2.remove(c.id)
        };
    }
};
dhtmlXGridObject.prototype.openItem = function (c) {
    var e = this._h2.get[c || 0];
    var a = this.getRowById(c || 0);
    if (!a) {
        if (e.parent && e.parent.id != 0) { this.openItem(e.parent.id) }
        this.expandKids(a)
    };
};
dhtmlXGridObject.prototype._addRowClassic = dhtmlXGridObject.prototype.addRow;
dhtmlXGridObject.prototype.addRow = function (c, m, h, g, a, n) {
    if (!this._h2) {
        return this._addRowClassic(c, m, h)
    }
    g = g || 0;
    var e = this.cellType._dhx_find("tree");
    if (typeof (m) == "string") { m = m.split(this.delim) }
    var l = this._h2.get[c];
    if (!l) {
        if (g == 0) { h = this.rowsBuffer.length } else {
            h = this.getRowIndex(g) + 1;
            if (this._h2.get[g].state == "minus") { h += this._getOpenLenght(g, 0) } else { this._skipInsert = true }
        }
    }
    l = l || this._h2.add(c, g);
    l.image = a;
    l.has_kids = n;
    return l.buff = this._addRowClassic(c, m, h)
};
dhtmlXGridObject.prototype.addRowBefore = function (e, l, g, c, n) {
    var m = this.rowsAr[g];
    if (!m) {
        if (!this._h2) {
            return this.addRow(e, l, this.getRowIndex(g))
        }
        var a = this._h2.get[g].parent.id;
        var h = this.getRowIndex(g);
        if (h == -1) { this._skipInsert = true }
        this._h2.addBefore(e, a, g);
        return this.addRow(e, l, h, this._h2.get[g].parent.id, c, n)
    };
};
dhtmlXGridObject.prototype.addRowAfter = function (e, l, g, c, n) {
    var m = this.rowsAr[g];
    if (!m) {
        if (!this._h2) {
            return this.addRow(e, l, this.getRowIndex(g) + 1)
        }
        var a = this._h2.get[g].parent.id;
        var h = this.getRowIndex(g);
        if (h == -1) { this._skipInsert = true }
        if (this._h2.get[g].state == "minus") { h += this._getOpenLenght(g, 0) + 1 } else { h++ }
        this._h2.addAfter(e, a, g);
        return this.addRow(e, l, h, a, c, n)
    };
};
dhtmlXGridObject.prototype.enableSmartXMLParsing = function (a) { this._slowParse = dhx4.s2b(a) };
dhtmlXGridObject.prototype._copyTreeGridRowContent = function (a, c, e) {
    var g = this.cellType._dhx_find("tree");
    for (i = 0; i < a.cells.length; i++) {
        if (i != g) { this.cells(e, i).setValue(this.cells(c, i).getValue()) } else { this.cells(e, i).setValueA(this.cells(c, i).getValue()) }
    }
};
dhtmlXGridObject.prototype.closeItem = function (c) {
    var a = this.getRowById(c);
    if (!a) {
        this.collapseKids(a)
    };
};
dhtmlXGridObject.prototype.deleteChildItems = function (a) {
    var c = this._h2.get[a];
    if (!c) {
        return
    }
    while (c.childs.length) { this.deleteRow(c.childs[0].id) }
};
dhtmlXGridObject.prototype.getAllSubItems = function (c) {
    var g = [];
    var e = this._h2.get[c || 0];
    if (e) {
        for (var a = 0; a < e.childs.length; a++) {
            g.push(e.childs[a].id);
            if (e.childs[a].childs.length) { g = g.concat(this.getAllSubItems(e.childs[a].id).split(this.delim)) }
        }
    }
    return g.join(this.delim)
};
dhtmlXGridObject.prototype.getChildItemIdByIndex = function (c, a) {
    var e = this._h2.get[c || 0];
    if (!e) {
        return null
    }
    return (e.childs[a] ? e.childs[a].id : null)
};
dhtmlXGridObject.prototype.getItemText = function (a) {
    return this.cells(a, this.cellType._dhx_find("tree")).getLabel()
};
dhtmlXGridObject.prototype.getOpenState = function (a) {
    var c = this._h2.get[a || 0];
    if (!c) {
        return
    }
    if (c.state == "minus") {
        return true
    }
    return false
};
dhtmlXGridObject.prototype.getParentId = function (a) {
    var c = this._h2.get[a || 0];
    if ((!c) || (!c.parent)) {
        return null
    }
    return c.parent.id
};
dhtmlXGridObject.prototype.getSubItems = function (c) {
    var g = [];
    var e = this._h2.get[c || 0];
    if (e) {
        for (var a = 0; a < e.childs.length; a++) { g.push(e.childs[a].id) }
    }
    return g.join(this.delim)
};
dhtmlXGridObject.prototype.expandAll = function (a) {
    this._renderAllExpand(a || 0);
    this._h2_to_buff();
    this._reset_view();
    this.setSizes();
    this.callEvent("onGridReconstructed", []);
    if (this._redrawLines) { this._redrawLines() }
};
dhtmlXGridObject.prototype._renderAllExpand = function (e) {
    var a = this._h2.get[e].childs;
    for (var c = 0; c < a.length; c++) {
        if (a[c].childs.length) {
            this._h2.change(a[c].id, "state", "minus");
            this._updateTGRState(a[c]);
            this._renderAllExpand(a[c].id)
        }
    }
};
dhtmlXGridObject.prototype.collapseAll = function (a) {
    this._h2.forEachChild((a || 0), function (c) {
        if (c && c.state == "minus") {
            c.state = "plus";
            c.update = true;
            this._updateTGRState(c)
        }
    }, this);
    this._h2_to_buff();
    this._reset_view();
    this.setSizes();
    this.callEvent("onGridReconstructed", []);
    if (this._redrawLines) { this._redrawLines() }
};
dhtmlXGridObject.prototype.hasChildren = function (c) {
    var a = this._h2.get[c];
    if (a && a.childs.length) {
        return a.childs.length
    }
    if (a._xml_await) {
        return -1
    }
    return 0
};
dhtmlXGridObject.prototype.setItemCloseable = function (e, c) {
    var a = this._h2.get[e];
    if (!a) {
        return
    }
    a._closeable = (!dhx4.s2b(c))
};
dhtmlXGridObject.prototype.setItemText = function (a, c) {
    return this.cells(a, this.cellType._dhx_find("tree")).setLabel(c)
};
dhtmlXGridObject.prototype.setItemImage = function (c, a) {
    this._h2.get[c].image = a;
    this.rowsAr[c].imgTag.nextSibling.src = (this.iconURL || "") + a
};
dhtmlXGridObject.prototype.setItemIcon = function (c, a) {
    this._h2.get[c].icon = a;
    this.rowsAr[c].imgTag.nextSibling.className = "dhx_treegrid_icon fa fa-" + a
};
dhtmlXGridObject.prototype.getItemImage = function (a) {
    this.getRowById(a);
    return this._h2.get[a].image
};
dhtmlXGridObject.prototype.getItemIcon = function (a) {
    this.getRowById(a);
    return this._h2.get[a].icon
};
dhtmlXGridObject.prototype.setImageSize = function (c, a) {
    this._img_width = c;
    this._img_height = a
};
dhtmlXGridObject.prototype._getRowImage = function (a) {
    return this._h2.get[a.idd].image
};
dhtmlXGridObject.prototype.setOnOpenStartHandler = function (a) { this.attachEvent("onOpenStart", a) };
dhtmlXGridObject.prototype.setOnOpenEndHandler = function (a) { this.attachEvent("onOpenEnd", a) };
dhtmlXGridObject.prototype.enableTreeCellEdit = function (a) { this._edtc = !dhx4.s2b(a) };
dhtmlXGridObject.prototype.getLevel = function (a) {
    var c = this._h2.get[a || 0];
    if (!c) {
        return -1
    }
    return c.level
};
dhtmlXGridObject.prototype._fixHiddenRowsAllTG = function (c, a) {
    for (i in this.rowsAr) {
        if ((this.rowsAr[i]) && (this.rowsAr[i].childNodes)) { this.rowsAr[i].childNodes[c].style.display = a }
    }
};
dhtmlXGridObject.prototype._updateLine = function (e, c) {
    c = c || this.rowsAr[e.id];
    if (!c) {
        return
    }
    var a = c.imgTag;
    if (!a) {
        return
    }
    if (e.state == "blank") {
        return a.src = this.iconTree + "blank.gif"
    }
    var g = 1;
    if (e.index == 0) {
        if (e.level == 0) {
            if ((e.parent.childs.length - 1) > e.index) { g = 3 } else { g = 1 }
        } else {
            if ((e.parent.childs.length - 1) > e.index) { g = 3 } else { g = 2 }
        }
    } else {
        if ((e.parent.childs.length - 1) > e.index) { g = 3 } else { g = 2 }
    }
    a.src = this.iconTree + e.state + g + ".gif"
};
dhtmlXGridObject.prototype._updateParentLine = function (g, e) {
    e = e || this.rowsAr[g.id];
    if (!e) {
        return
    }
    var a = e.imgTag;
    if (!a) {
        return
    }
    for (var c = g.level; c > 0; c--) {
        if (g.id == 0) {
            break
        }
        a = a.previousSibling;
        g = g.parent;
        if ((g.parent.childs.length - 1) > g.index) { a.src = this.iconTree + "line1.gif" } else { a.src = this.iconTree + "blank.gif" }
    }
};
dhtmlXGridObject.prototype._renderSortA = dhtmlXGridObject.prototype._renderSort;
dhtmlXGridObject.prototype._renderSort = function () {
    this._renderSortA.apply(this, arguments);
    this._redrawLines(0)
};
dhtmlXGridObject.prototype._redrawLines = function (a) {
    if (this._tgle) {
        this._h2.forEachChild((a || 0), function (c) {
            this._updateLine(c);
            this._updateParentLine(c)
        }, this)
    }
};
dhtmlXGridObject.prototype.enableTreeGridLines = function () {
    this._emptyLineImg = "line";
    this._updateTGRState = function (c, a) {
        if (a || !c.update || c.id == 0) {
            if (this._tgle) { this._updateLine(c, this.rowsAr[c.id]) }
            c.update = false
        };
        this._tgle = true;
        this.attachEvent("onXLE", function (e, c, g) { this._redrawLines(g) });
        this.attachEvent("onOpenEnd", function (a) { this._redrawLines(a) });
        this.attachEvent("onRowAdded", function (c) {
            var a = this._h2.get[c];
            this._updateLine(a);
            this._updateParentLine(a);
            if (a.index < (a.parent.childs.length - 1)) {
                a = a.parent.childs[a.index + 1];
                this._updateLine(a);
                this._updateParentLine(a)
            } else {
                if (a.index != 0) {
                    a = a.parent.childs[a.index - 1];
                    this._updateLine(a);
                    this._updateParentLine(a);
                    if (a.childs.length) { this._h2.forEachChild(a.id, function (e) { this._updateParentLine(e) }, this) }
                }
            }
        });
        this.attachEvent("onOpen", function (g, c) {
            if (c) {
                var e = this._h2.get[g];
                for (var a = 0; a < e.childs.length; a++) { this._updateParentLine(e.childs[a]) }
            }
            return true
        });
        this.attachEvent("onBeforeRowDeleted", function (g) {
            var c = this;
            var e = this._h2.get[g];
            var a = null;
            if (e.index != 0) { a = e.parent.childs[e.index - 1] }
            e = e.parent;
            window.setTimeout(function () {
                e = c._h2.get[e.id];
                if (!e) {
                    return
                }
                c._updateLine(e);
                c._updateParentLine(e);
                if (a) {
                    c._updateLine(a);
                    if (a.state == "minus") { c._h2.forEachChild(a.id, function (h) { c._updateParentLine(h) }, c) }
                }
            }, 1);
            return true
        })
    };
};
dhtmlXGridObject.prototype.setFiltrationLevel = function (e, a, c) {
    this._tr_strfltr = e;
    this._tr_fltr_c = a;
    this._tr_fltr_d = c;
    this.refreshFilters()
};
dhtmlXGridObject.prototype.filterTreeBy = function (g, h, e) {
    var a = this._h2;
    if (typeof this._tr_strfltr == "undefined") { this._tr_strfltr = -1 }
    if (this._f_rowsBuffer) {
        if (!e) {
            this._h2 = this._f_rowsBuffer;
            if (this._fake) { this._fake._h2 = this._h2 }
        }
    } else { this._f_rowsBuffer = this._h2 }
    var l = true;
    this.dma(true);
    this._fbf = {};
    if (typeof (g) == "object") {
        for (var c = 0; c < h.length; c++) { this._filterTreeA(g[c], h[c]) }
    } else { this._filterTreeA(g, h) }
    this._fbf = null;
    this.dma(false);
    this._fix_filtered_images(this._h2, a);
    this._renderSort();
    this.callEvent("onGridReconstructed", [])
};
dhtmlXGridObject.prototype._filterTreeA = function (e, o) {
    if (o == "") {
        return
    }
    var m = true;
    if (typeof (o) == "function") { m = false } else { o = (o || "").toString().toLowerCase() }
    var c = function (w, v, u) {
        var x = u.get[w.parent.id];
        if (!x) { x = c(w.parent, v, u) }
        var u = r.get[w.id];
        if (!u) {
            u = { id: w.id, childs: [], level: w.level, parent: x, index: x.childs.length, image: w.image, state: w.state, buff: w.buff, has_kids: w.has_kids, _xml_await: w._xml_await };
            x.childs.push(u);
            r.get[u.id] = u
        }
        return u
    };
    var n = this._fbf;
    var r = this._createHierarchy();
    var a;
    var h = this._tr_strfltr;
    var l = this;
    var g = function (u) {
        for (var s = 0; s < u.childs.length; s++) { l.temp(u.childs[s]) }
    };
    switch (h.toString()) {
        case "-2":
            a = function (s) {
                if (n[s.id]) {
                    return false
                }
                g(s);
                return true
            };
            break;
        case "-1":
            a = function (s) {
                return !s.childs.length
            };
            break;
        default:
            a = function (s) {
                return h == s.level
            };
            break
    }
    this.temp = function (s) {
        if (s.id != 0 && a(s)) {
            if (m ? (this._get_cell_value(s.buff, e).toString().toLowerCase().indexOf(o) == -1) : (!o(this._get_cell_value(s.buff, e), s.id))) {
                n[s.id] = true;
                if (this._tr_fltr_c) { c(s.parent, this._h2, r) }
                return false
            } else {
                c(s, this._h2, r);
                if (s.childs && h != -2) { this._h2.forEachChild(s.id, function (u) { c(u, this._h2, r) }, this) }
                return true
            }
        } else {
            if (this._tr_fltr_d && this._tr_strfltr > s.level && s.id != 0) { c(s, this._h2, r) }
            g(s)
        }
    };
    this.temp(this._h2.get[0]);
    this._h2 = r;
    if (this._fake) { this._fake._h2 = this._h2 }
};
dhtmlXGridObject.prototype._fix_filtered_images = function (c, a) {
    c.forEachChild(0, function (e) {
        if (!e.childs.length && !e.has_kids) {
            if (e.state != this._emptyLineImg) {
                e.state = this._emptyLineImg;
                e.update = true;
                this._updateTGRState(e)
            }
        } else {
            if (e.buff.tagName == "TR") {
                var g = a.get[e.id];
                if (g && g.state != this._emptyLineImg) { e.state = g.state }
                e.update = true;
                this._updateTGRState(e)
            }
        }
    }, this)
};
dhtmlXGridObject.prototype.collectTreeValues = function (e) {
    if (typeof this._tr_strfltr == "undefined") { this._tr_strfltr = -1 }
    this.dma(true);
    this._build_m_order();
    e = this._m_order ? this._m_order[e] : e;
    var m = {};
    var h = [];
    var a = this._f_rowsBuffer || this._h2;
    a.forEachChild(0, function (c) {
        if (this._tr_strfltr == -2 || (this._tr_strfltr == -1 && !c.childs.length) || (this._tr_strfltr == c.level)) {
            var n = this._get_cell_value(c.buff, e);
            if (n) { m[n] = true }
        }
    }, this);
    this.dma(false);
    var g = this.combos[e];
    for (var l in m) {
        if (m[l] === true) { h.push(g ? (g.get(l) || l) : l) }
    }
    return h.sort()
};
dhtmlXGridObject.prototype._in_header_stat_tree_total = function (e, a, h) {
    var g = function () {
        var l = 0;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        this._h2.forEachChild(0, function (n) {
            var m = parseFloat(this._get_cell_value((n.buff || this.rowsAr[n.id]), c));
            l += isNaN(m) ? 0 : m
        }, this);
        return this._maskArr[a] ? this._aplNF(l, a) : (Math.round(l * 100) / 100)
    };
    this._stat_in_header(e, g, a, h, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_total_leaf = function (e, a, h) {
    var g = function () {
        var l = 0;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        this._h2.forEachChild(0, function (n) {
            if (n.childs.length) {
                return
            }
            var m = parseFloat(this._get_cell_value((n.buff || this.rowsAr[n.id]), c));
            l += isNaN(m) ? 0 : m
        }, this);
        return this._maskArr[a] ? this._aplNF(l, a) : (Math.round(l * 100) / 100)
    };
    this._stat_in_header(e, g, a, h, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_multi_total = function (e, a, l) {
    var h = l[1].split(":");
    l[1] = "";
    var g = function () {
        var c = 0;
        this._h2.forEachChild(0, function (n) {
            var m = parseFloat(this._get_cell_value((n.buff || this.rowsAr[n.id]), h[0])) * parseFloat(this._get_cell_value((n.buff || this.rowsAr[n.id]), h[1]));
            c += isNaN(m) ? 0 : m
        }, this);
        return this._maskArr[a] ? this._aplNF(c, a) : (Math.round(c * 100) / 100)
    };
    this._stat_in_header(e, g, a, l, l)
};
dhtmlXGridObject.prototype._in_header_stat_tree_multi_total_leaf = function (e, a, l) {
    var h = l[1].split(":");
    l[1] = "";
    var g = function () {
        var c = 0;
        this._h2.forEachChild(0, function (n) {
            if (n.childs.length) {
                return
            }
            var m = parseFloat(this._get_cell_value((n.buff || this.rowsAr[n.id]), h[0])) * parseFloat(this._get_cell_value((n.buff || this.rowsAr[n.id]), h[1]));
            c += isNaN(m) ? 0 : m
        }, this);
        return this._maskArr[a] ? this._aplNF(c, a) : (Math.round(c * 100) / 100)
    };
    this._stat_in_header(e, g, a, l, l)
};
dhtmlXGridObject.prototype._in_header_stat_tree_max = function (e, a, h) {
    var g = function () {
        var l = -999999999;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        if (this.getRowsNum() == 0) {
            return ""
        }
        this._h2.forEachChild(0, function (m) {
            var n = parseFloat(this._get_cell_value((m.buff || this.rowsAr[m.id]), c));
            if (!isNaN(n)) { l = Math.max(l, n) }
        }, this);
        return this._maskArr[a] ? this._aplNF(l, a) : l
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_min = function (e, a, h) {
    var g = function () {
        var l = 999999999;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        if (this.getRowsNum() == 0) {
            return ""
        }
        this._h2.forEachChild(0, function (m) {
            var n = parseFloat(this._get_cell_value((m.buff || this.rowsAr[m.id]), c));
            if (!isNaN(n)) { l = Math.min(l, n) }
        }, this);
        return this._maskArr[a] ? this._aplNF(l, a) : l
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_average = function (e, a, h) {
    var g = function () {
        var m = 0;
        var l = 0;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        this._h2.forEachChild(0, function (o) {
            var n = parseFloat(this._get_cell_value((o.buff || this.rowsAr[o.id]), c));
            m += isNaN(n) ? 0 : n;
            l++
        }, this);
        return this._maskArr[a] ? this._aplNF(m, a) : (Math.round(m / l * 100) / 100)
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_max_leaf = function (e, a, h) {
    var g = function () {
        var l = -999999999;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        if (this.getRowsNum() == 0) {
            return ""
        }
        this._h2.forEachChild(0, function (m) {
            if (m.childs.length) {
                return
            }
            var n = parseFloat(this._get_cell_value((m.buff || this.rowsAr[m.id]), c));
            if (!isNaN(n)) { l = Math.max(l, n) }
        }, this);
        return this._maskArr[a] ? this._aplNF(l, a) : l
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_min_leaf = function (e, a, h) {
    var g = function () {
        var l = 999999999;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        if (this.getRowsNum() == 0) {
            return ""
        }
        this._h2.forEachChild(0, function (m) {
            if (m.childs.length) {
                return
            }
            var n = parseFloat(this._get_cell_value((m.buff || this.rowsAr[m.id]), c));
            if (!isNaN(n)) { l = Math.min(l, n) }
        }, this);
        return this._maskArr[a] ? this._aplNF(l, a) : l
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_average_leaf = function (e, a, h) {
    var g = function () {
        var m = 0;
        var l = 0;
        this._build_m_order();
        var c = this._m_order ? this._m_order[a] : a;
        this._h2.forEachChild(0, function (o) {
            if (o.childs.length) {
                return
            }
            var n = parseFloat(this._get_cell_value((o.buff || this.rowsAr[o.id]), c));
            m += isNaN(n) ? 0 : n;
            l++
        }, this);
        return this._maskArr[a] ? this._aplNF(m, a) : (Math.round(m / l * 100) / 100)
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_count = function (e, a, h) {
    var g = function () {
        var c = 0;
        this._h2.forEachChild(0, function (l) { c++ }, this);
        return c
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._in_header_stat_tree_count_leaf = function (e, a, h) {
    var g = function () {
        var c = 0;
        this._h2.forEachChild(0, function (l) {
            if (!l.childs.length) { c++ }
        }, this);
        return c
    };
    this._stat_in_header(e, g, a, h)
};
dhtmlXGridObject.prototype._stat_in_header = function (e, g, a, m) {
    var h = this;
    var l = function () {
        this.dma(true);
        e.innerHTML = (m[0] ? m[0] : "") + g.call(this) + (m[1] ? m[1] : "");
        this.dma(false);
        this.callEvent("onStatReady", [])
    };
    if (!this._stat_events) {
        this._stat_events = [];
        this.attachEvent("onClearAll", function () {
            if (!this.hdr.rows[1]) {
                for (var n = 0; n < this._stat_events.length; n++) {
                    for (var c = 0; c < 4; c++) { this.detachEvent(this._stat_events[n][c]) }
                }
                this._stat_events = []
            }
        })
    }
    this._stat_events.push([this.attachEvent("onGridReconstructed", l), this.attachEvent("onXLE", l), this.attachEvent("onFilterEnd", l), this.attachEvent("onEditCell", function (c, o, n) {
        if (c == 2 && n == a) { l.call(this) }
        return true
    })]);
    e.innerHTML = ""
};
dhtmlXGridObject.prototype._build_m_order = function () {
    if (this._c_order) {
        this._m_order = [];
        for (var a = 0; a < this._c_order.length; a++) {
            this._m_order[this._c_order[a]] = a
        }
    }
};