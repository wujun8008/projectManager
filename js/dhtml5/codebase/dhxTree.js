dhtmlXTreeObject.prototype.setDataMode = function (a) { this._datamode = a };
dhtmlXTreeObject.prototype._doContClick = function (m, a) {
    if (!a && m.button != 2) {
        if (this._acMenu) {
            if (this._acMenu.hideContextMenu) { this._acMenu.hideContextMenu() } else { this.cMenu._contextEnd() }
        }
        return true
    }
    var c = (_isIE ? m.srcElement : m.target);
    while ((c) && (c.tagName != "BODY")) {
        if (c.parentObject) {
            break
        }
        c = c.parentNode
    }
    if ((!c) || (!c.parentObject)) {
        return true
    }
    var h = c.parentObject;
    if (!this.callEvent("onRightClick", [h.id, m])) {
        (m.srcElement || m.target).oncontextmenu = function (r) {
            (r || event).cancelBubble = true;
            return false
        }
    }
    this._acMenu = (h.cMenu || this.cMenu);
    if (this._acMenu) {
        if (!(this.callEvent("onBeforeContextMenu", [h.id]))) {
            return true
        }
        if (!_isMacOS) {
            (m.srcElement || m.target).oncontextmenu = function (r) {
                (r || event).cancelBubble = true;
                return false
            }
        }
        if (this._acMenu.showContextMenu) {
            var g = window.document.documentElement;
            var e = window.document.body;
            var n = new Array((g.scrollLeft || e.scrollLeft), (g.scrollTop || e.scrollTop));
            if (_isIE) {
                var o = m.clientX + n[0];
                var l = m.clientY + n[1]
            } else {
                var o = m.pageX;
                var l = m.pageY
            }
            this._acMenu.showContextMenu(o - 1, l - 1);
            this.contextID = h.id;
            m.cancelBubble = true;
            this._acMenu._skip_hide = true
        } else {
            c.contextMenuId = h.id;
            c.contextMenu = this._acMenu;
            c.a = this._acMenu._contextStart;
            c.a(c, m);
            c.a = null
        }
        return false
    }
    return true
};
dhtmlXTreeObject.prototype.enableIEImageFix = function (a) {
    if (!a) {
        this._getImg = function (c) {
            return document.createElement((c == this.rootId) ? "div" : "img")
        };
        this._setSrc = function (e, c) { e.src = c };
        this._getSrc = function (c) {
            return c.src
        }
    } else {
        this._getImg = function () {
            var c = document.createElement("DIV");
            c.innerHTML = "&nbsp;";
            c.className = "dhx_bg_img_fix";
            return c
        };
        this._setSrc = function (e, c) { e.style.backgroundImage = "url(" + c + ")" };
        this._getSrc = function (c) {
            var e = c.style.backgroundImage;
            return e.substr(4, e.length - 5).replace(/(^")|("$)/g, "")
        }
    }
};
dhtmlXTreeObject.prototype.destructor = function () {
    for (var c in this._idpull) {
        var e = this._idpull[c];
        if (!e) {
            continue
        }
        e.parentObject = null;
        e.treeNod = null;
        e.childNodes = null;
        e.span = null;
        e.tr.nodem = null;
        e.tr = null;
        e.htmlNode.objBelong = null;
        e.htmlNode = null;
        this._idpull[c] = null
    }
    this.parentObject.innerHTML = "";
    this.allTree.onselectstart = null;
    this.allTree.oncontextmenu = null;
    this.allTree.onmousedown = null;
    for (var c in this) { this[c] = null }
};

function cObject() {
    return this
}
cObject.prototype = new Object;
cObject.prototype.clone = function () {
    function a() { }
    a.prototype = this;
    return new a()
};

function dhtmlXTreeItemObject(l, c, e, a, g, h) {
    this.htmlNode = "";
    this.acolor = "";
    this.scolor = "";
    this.tr = 0;
    this.childsCount = 0;
    this.tempDOMM = 0;
    this.tempDOMU = 0;
    this.dragSpan = 0;
    this.dragMove = 0;
    this.span = 0;
    this.closeble = 1;
    this.childNodes = new Array();
    this.userData = new cObject();
    this.checkstate = 0;
    this.treeNod = a;
    this.label = c;
    this.parentObject = e;
    this.actionHandler = g;
    this.images = new Array(a.imageArray[0], a.imageArray[1], a.imageArray[2]);
    this.id = a._globalIdStorageAdd(l, this);
    if (this.treeNod.checkBoxOff) { this.htmlNode = this.treeNod._createItem(1, this, h) } else { this.htmlNode = this.treeNod._createItem(0, this, h) }
    this.htmlNode.objBelong = this;
    return this
}
dhtmlXTreeObject.prototype._globalIdStorageAdd = function (c, a) {
    if (this._globalIdStorageFind(c, 1, 1)) {
        c = c + "_" + (new Date()).valueOf();
        return this._globalIdStorageAdd(c, a)
    }
    this._idpull[c] = a;
    this._pullSize++;
    return c
};
dhtmlXTreeObject.prototype._globalIdStorageSub = function (a) {
    if (this._idpull[a]) {
        this._unselectItem(this._idpull[a]);
        this._idpull[a] = null;
        this._pullSize--
    }
    if ((this._locker) && (this._locker[a])) { this._locker[a] = false }
};
dhtmlXTreeObject.prototype._globalIdStorageFind = function (l, a, e, g) {
    var h = this._idpull[l];
    if (h) {
        if ((h.unParsed) && (!e)) { this.reParse(h, 0) }
        if (this._srnd && !h.htmlNode) { this._buildSRND(h, e) }
        if ((g) && (this._edsbpsA)) {
            for (var c = 0; c < this._edsbpsA.length; c++) {
                if (this._edsbpsA[c][2] == l) {
                    dhx4.callEvent("ongetItemError", ["Requested item still in parsing process.", l]);
                    return null
                }
            }
        }
        return h
    }
    if ((this.slowParse) && (l != 0) && (!a)) {
        return this.preParse(l)
    } else {
        return null
    }
};
dhtmlXTreeObject.prototype._getSubItemsXML = function (a) {
    var c = [];
    a.each("item", function (e) { c.push(e.get("id")) }, this);
    return c.join(this.dlmtr)
};
dhtmlXTreeObject.prototype.enableSmartXMLParsing = function (a) { this.slowParse = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.findXML = function (c, a, e) { };
dhtmlXTreeObject.prototype._getAllCheckedXML = function (c, a, g) {
    var e = [];
    if (g == 2) { c.through("item", "checked", -1, function (h) { e.push(h.get("id")) }, this) }
    if (g == 1) {
        c.through("item", "id", null, function (h) {
            if (h.get("checked") && (h.get("checked") != -1)) { e.push(h.get("id")) }
        }, this)
    }
    if (g == 0) {
        c.through("item", "id", null, function (h) {
            if (!h.get("checked") || h.get("checked") == 0) { e.push(h.get("id")) }
        }, this)
    }
    if (e.length) {
        return a + (a ? this.dlmtr : "") + e.join(this.dlmtr)
    }
    if (a) {
        return a
    } else {
        return ""
    }
};
dhtmlXTreeObject.prototype._setSubCheckedXML = function (a, c) {
    var e = a ? "1" : "";
    c.through("item", "id", null, function (g) {
        if (!g.get("disabled") || g.get("disabled") == 0) { g.set("checked", e) }
    }, this)
};
dhtmlXTreeObject.prototype._getAllScraggyItemsXML = function (e, a) {
    var g = [];
    var c = function (h) {
        if (!h.sub_exists("item")) { g.push(h.get("id")) } else { h.each("item", c, this) }
    };
    c(e);
    return g.join(",")
};
dhtmlXTreeObject.prototype._getAllFatItemsXML = function (e, a) {
    var g = [];
    var c = function (h) {
        if (!h.sub_exists("item")) {
            return
        }
        g.push(h.get("id"));
        h.each("item", c, this)
    };
    c(e);
    return g.join(",")
};
dhtmlXTreeObject.prototype._getAllSubItemsXML = function (e, c, a) {
    var c = [];
    a.through("item", "id", null, function (g) { c.push(g.get("id")) }, this);
    return c.join(",")
};
dhtmlXTreeObject.prototype.reParse = function (e) {
    var l = this;
    if (!this.parsCount) { l.callEvent("onXLS", [l, e.id]) }
    this.xmlstate = 1;
    var g = e.unParsed;
    e.unParsed = 0;
    this.XMLloadingWarning = 1;
    var a = this.parsingOn;
    var m = this.waitUpdateXML;
    var o = this.parsedArray;
    this.parsedArray = new Array();
    this.waitUpdateXML = false;
    this.parsingOn = e.id;
    this.parsedArray = new Array();
    this.setCheckList = "";
    this._parse(g, e.id, 2);
    var r = this.setCheckList.split(this.dlmtr);
    for (var h = 0; h < this.parsedArray.length; h++) { e.htmlNode.childNodes[0].appendChild(this.parsedArray[h]) }
    if (g.get("order") && g.get("order") != "none") { this._reorderBranch(e, g.get("order"), true) }
    this.oldsmcheck = this.smcheck;
    this.smcheck = false;
    for (var c = 0; c < r.length; c++) {
        if (r[c]) { this.setCheck(r[c], 1) }
    }
    this.smcheck = this.oldsmcheck;
    this.parsingOn = a;
    this.waitUpdateXML = m;
    this.parsedArray = o;
    this.XMLloadingWarning = 0;
    this._redrawFrom(this, e);
    if (this._srnd && !e._sready) { this.prepareSR(e.id) }
    this.xmlstate = 0;
    return true
};
dhtmlXTreeObject.prototype.preParse = function (c) {
    if (!c || !this._p) {
        return null
    }
    var a = false;
    this._p.clone().through("item", "id", c, function (g) {
        this._globalIdStorageFind(g.up().get("id"));
        return a = true
    }, this);
    if (a) {
        var e = this._globalIdStorageFind(c, true, false);
        if (!e) { dhx4.callEvent("ongetItemError", ["The item " + c + " not operable. Seems you have non-unique|incorrect IDs in tree's XML.", c]) }
    }
    return e
};
dhtmlXTreeObject.prototype._escape = function (a) {
    switch (this.utfesc) {
        case "none":
            return a;
            break;
        case "utf8":
            return encodeURIComponent(a);
            break;
        default:
            return escape(a);
            break
    }
};
dhtmlXTreeObject.prototype._drawNewTr = function (h, e) {
    var g = document.createElement("tr");
    var c = document.createElement("td");
    var a = document.createElement("td");
    c.appendChild(document.createTextNode(" "));
    a.colSpan = 3;
    a.appendChild(h);
    g.appendChild(c);
    g.appendChild(a);
    return g
};
dhtmlXTreeObject.prototype.parse = function (g, e, a) {
    if (typeof e == "string") {
        a = e;
        e = null
    }
    if (a === "json") {
        return this._loadJSONObject(g, e)
    } else {
        if (a === "csv") {
            return this._loadCSVString(g, e)
        } else {
            if (a === "jsarray") {
                return this._loadJSArray(g, e)
            }
        }
    }
    var c = this;
    if (!this.parsCount) { this.callEvent("onXLS", [c, null]) }
    this.xmlstate = 1;
    this.XMLLoader({ responseXML: dhx4.ajax.parse(g) }, e)
};
dhtmlXTreeObject.prototype.loadXMLString = function () {
    if (window.console && window.console.info) { window.console.info("loadXMLString was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this.parse.apply(this, arguments)
};
dhtmlXTreeObject.prototype.load = function (c, h, e) {
    if (typeof h == "string") {
        e = h;
        h = null
    }
    e = e || this._datamode;
    if (e === "json") {
        return this._loadJSON(c, h)
    } else {
        if (e === "csv") {
            return this._loadCSV(c, h)
        } else {
            if (e === "jsarray") {
                return this._loadJSArrayFile(xmlString, h)
            }
        }
    }
    var g = this;
    if (!this.parsCount) { this.callEvent("onXLS", [g, this._ld_id]) }
    this._ld_id = null;
    this.xmlstate = 1;
    this.XMLLoader = this._parseXMLTree;
    var a = this;
    dhx4.ajax.get(c, function (l) {
        a.XMLLoader(l.xmlDoc, h);
        a = null
    })
};
dhtmlXTreeObject.prototype.loadXML = function () {
    if (window.console && window.console.info) { window.console.info("loadXML was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this.load.apply(this, arguments)
};
dhtmlXTreeObject.prototype._attachChildNode = function (m, l, g, o, E, D, C, r, e, v, w) {
    if (v && v.parentObject) { m = v.parentObject }
    if (((m.XMLload == 0) && (this.XMLsource)) && (!this.XMLloadingWarning)) {
        m.XMLload = 1;
        this._loadDynXML(m.id)
    }
    var s = m.childsCount;
    var F = m.childNodes;
    if (w && w.tr.previousSibling) {
        if (w.tr.previousSibling.previousSibling) { v = w.tr.previousSibling.nodem } else { r = r.replace("TOP", "") + ",TOP" }
    }
    if (v) {
        var h, A;
        for (h = 0; h < s; h++) {
            if (F[h] == v) {
                for (A = s; A != h; A--) { F[1 + A] = F[A] }
                break
            }
        }
        h++;
        s = h
    }
    if (r) {
        var x = r.split(",");
        for (var y = 0; y < x.length; y++) {
            switch (x[y]) {
                case "TOP":
                    if (m.childsCount > 0) {
                        v = new Object;
                        v.tr = m.childNodes[0].tr.previousSibling
                    }
                    m._has_top = true;
                    for (h = s; h > 0; h--) { F[h] = F[h - 1] }
                    s = 0;
                    break
            }
        }
    }
    var u;
    if (!(u = this._idpull[l]) || u.span != -1) {
        u = F[s] = new dhtmlXTreeItemObject(l, g, m, this, o, 1);
        l = F[s].id;
        m.childsCount++
    }
    if (!u.htmlNode) {
        u.label = g;
        u.htmlNode = this._createItem((this.checkBoxOff ? 1 : 0), u);
        u.htmlNode.objBelong = u
    }
    if (E) { u.images[0] = E }
    if (D) { u.images[1] = D }
    if (C) { u.images[2] = C }
    var c = this._drawNewTr(u.htmlNode);
    if ((this.XMLloadingWarning) || (this._hAdI)) { u.htmlNode.parentNode.parentNode.style.display = "none" }
    if ((v) && v.tr && (v.tr.nextSibling)) { m.htmlNode.childNodes[0].insertBefore(c, v.tr.nextSibling) } else {
        if (this.parsingOn == m.id) { this.parsedArray[this.parsedArray.length] = c } else { m.htmlNode.childNodes[0].appendChild(c) }
    }
    if ((v) && (!v.span)) { v = null }
    if (this.XMLsource) {
        if ((e) && (e != 0)) { u.XMLload = 0 } else { u.XMLload = 1 }
    }
    u.tr = c;
    c.nodem = u;
    if (m.itemId == 0) { c.childNodes[0].className = "hiddenRow" }
    if ((m._r_logic) || (this._frbtr)) { this._setSrc(u.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0], this.imPath + this.radioArray[0]) }
    if (r) {
        var x = r.split(",");
        for (var y = 0; y < x.length; y++) {
            switch (x[y]) {
                case "SELECT":
                    this.selectItem(l, false);
                    break;
                case "CALL":
                    this.selectItem(l, true);
                    break;
                case "CHILD":
                    u.XMLload = 0;
                    break;
                case "CHECKED":
                    if (this.XMLloadingWarning) { this.setCheckList += this.dlmtr + l } else { this.setCheck(l, 1) }
                    break;
                case "HCHECKED":
                    this._setCheck(u, "unsure");
                    break;
                case "OPEN":
                    u.openMe = 1;
                    break
            }
        }
    }
    if (!this.XMLloadingWarning) {
        if ((this._getOpenState(m) < 0) && (!this._hAdI)) { this.openItem(m.id) }
        if (v) {
            this._correctPlus(v);
            this._correctLine(v)
        }
        this._correctPlus(m);
        this._correctLine(m);
        this._correctPlus(u);
        if (m.childsCount >= 2) {
            this._correctPlus(F[m.childsCount - 2]);
            this._correctLine(F[m.childsCount - 2])
        }
        if (m.childsCount != 2) { this._correctPlus(F[0]) }
        if (this.tscheck) { this._correctCheckStates(m) }
        if (this._onradh) {
            if (this.xmlstate == 1) {
                var a = this.onXLE;
                this.onXLE = function (n) {
                    this._onradh(l);
                    if (a) { a(n) }
                }
            } else { this._onradh(l) }
        }
    }
    return u
};
dhtmlXTreeObject.prototype.enableContextMenu = function (a) {
    if (a) { this.cMenu = a }
};
dhtmlXTreeObject.prototype.setItemContextMenu = function (h, g) {
    var a = h.toString().split(this.dlmtr);
    for (var e = 0; e < a.length; e++) {
        var c = this._globalIdStorageFind(a[e]);
        if (!c) {
            continue
        }
        c.cMenu = g
    }
};
dhtmlXTreeObject.prototype.insertNewItem = function (g, n, r, e, m, l, h, c, a) {
    var s = this._globalIdStorageFind(g);
    if (!s) {
        return (-1)
    }
    var o = this._attachChildNode(s, n, r, e, m, l, h, c, a);
    if (!this._idpull[this.rootId].XMLload) { this._idpull[this.rootId].XMLload = 1 }
    if ((!this.XMLloadingWarning) && (this.childCalc)) { this._fixChildCountLabel(s) }
    return o
};
dhtmlXTreeObject.prototype.insertNewChild = function (g, n, o, e, m, l, h, c, a) {
    return this.insertNewItem(g, n, o, e, m, l, h, c, a)
};
dhtmlXTreeObject.prototype._parseXMLTree = function (a, e) {
    var c = new xmlPointer(dhx4.ajax.xmltop("tree", a));
    this._parse(c);
    this._p = c;
    if (e) { e.call(this, a) }
};
dhtmlXTreeObject.prototype._parseItem = function (l, r, h, n) {
    var e;
    if (this._srnd && (!this._idpull[e = l.get("id")] || !this._idpull[e].span)) {
        this._addItemSRND(r.id, e, l);
        return
    }
    var m = l.get_all();
    if ((typeof (this.waitUpdateXML) == "object") && (!this.waitUpdateXML[m.id])) {
        this._parse(l, m.id, 1);
        return
    }
    if ((m.text === null) || (typeof (m.text) == "undefined")) {
        m.text = l.sub("itemtext");
        if (m.text) { m.text = m.text.content() }
    }
    var u = [];
    if (m.select) { u.push("SELECT") }
    if (m.top) { u.push("TOP") }
    if (m.call) { this.nodeAskingCall = m.id }
    if (m.checked == -1) { u.push("HCHECKED") } else {
        if (m.checked) { u.push("CHECKED") }
    }
    if (m.open) { u.push("OPEN") }
    if (this.waitUpdateXML) {
        if (this._globalIdStorageFind(m.id)) {
            var o = this.updateItem(m.id, m.text, m.im0, m.im1, m.im2, m.checked, m.child)
        } else {
            if (this.npl == 0) { u.push("TOP") } else { h = r.childNodes[this.npl] }
            var o = this._attachChildNode(r, m.id, m.text, 0, m.im0, m.im1, m.im2, u.join(","), m.child, 0, h);
            m.id = o.id;
            h = null
        }
    } else {
        var o = this._attachChildNode(r, m.id, m.text, 0, m.im0, m.im1, m.im2, u.join(","), m.child, (n || 0), h)
    }
    if (m.tooltip) { o.span.parentNode.parentNode.title = m.tooltip }
    if (m.style) {
        if (o.span.style.cssText) { o.span.style.cssText += (";" + m.style) } else { o.span.setAttribute("style", o.span.getAttribute("style") + "; " + m.style) }
    }
    if (m.radio) { o._r_logic = true }
    if (m.nocheckbox) {
        var s = o.span.parentNode.previousSibling.previousSibling;
        s.style.display = "none";
        o.nocheckbox = true
    }
    if (m.disabled) {
        if (m.checked != null) { this._setCheck(o, m.checked) }
        this.disableCheckbox(o, 1)
    }
    o._acc = m.child || 0;
    if (this.parserExtension) { this.parserExtension._parseExtension.call(this, l, m, (r ? r.id : 0)) }
    this.setItemColor(o, m.aCol, m.sCol);
    if (m.locked == "1") { this.lockItem(o.id, true, true) }
    if ((m.imwidth) || (m.imheight)) { this.setIconSize(m.imwidth, m.imheight, o) }
    if ((m.closeable == "0") || (m.closeable == "1")) { this.setItemCloseable(o, m.closeable) }
    var g = "";
    if (m.topoffset) { this.setItemTopOffset(o, m.topoffset) }
    if ((!this.slowParse) || (typeof (this.waitUpdateXML) == "object")) {
        if (l.sub_exists("item")) { g = this._parse(l, m.id, 1) }
    } else {
        if ((!o.childsCount) && l.sub_exists("item")) { o.unParsed = l.clone() }
        l.each("userdata", function (a) { this.setUserData(m.id, a.get("name"), a.content()) }, this)
    }
    if (g != "") { this.nodeAskingCall = g }
    l.each("userdata", function (a) { this.setUserData(l.get("id"), a.get("name"), a.content()) }, this)
};
dhtmlXTreeObject.prototype._parse = function (e, l, a, c) {
    if (this._srnd && !this.parentObject.offsetHeight) {
        var w = this;
        return window.setTimeout(function () { w._parse(e, l, a, c) }, 100)
    }
    if (!e.exists()) {
        return
    }
    this.skipLock = true;
    if (!l) {
        l = e.get("id");
        if (this._dynDeleteBranches[l]) {
            this.deleteChildItems(l);
            this._dynDeleteBranches[l]--;
            if (!this._dynDeleteBranches[l]) { delete this._dynDeleteBranches[l] }
        }
        var u = e.get("dhx_security");
        if (u) { dhtmlx.security_key = u }
        if (e.get("radio")) { this.htmlNode._r_logic = true }
        this.parsingOn = l;
        this.parsedArray = new Array();
        this.setCheckList = "";
        this.nodeAskingCall = ""
    }
    var v = this._globalIdStorageFind(l);
    if (!v) {
        return dhx4.callEvent("onDataStructureError", ["XML refers to not existing parent"])
    }
    this.parsCount = this.parsCount ? (this.parsCount + 1) : 1;
    this.XMLloadingWarning = 1;
    if ((v.childsCount) && (!c) && (!this._edsbps) && (!v._has_top)) {
        var m = 0
    } else {
        var m = 0
    }
    this.npl = 0;
    e.each("item", function (x, n) {
        v.XMLload = 1;
        this._parseItem(x, v, 0, m);
        if ((this._edsbps) && (this.npl == this._edsbpsC)) {
            this._distributedStart(e, n + 1, l, a, v.childsCount);
            return -1
        }
        this.npl++
    }, this, c);
    if (!a) {
        e.each("userdata", function (n) { this.setUserData(e.get("id"), n.get("name"), n.content()) }, this);
        v.XMLload = 1;
        if (this.waitUpdateXML) {
            this.waitUpdateXML = false;
            for (var h = v.childsCount - 1; h >= 0; h--) {
                if (v.childNodes[h]._dmark) { this.deleteItem(v.childNodes[h].id) }
            }
        }
        var r = this._globalIdStorageFind(this.parsingOn);
        for (var h = 0; h < this.parsedArray.length; h++) { v.htmlNode.childNodes[0].appendChild(this.parsedArray[h]) }
        this.parsedArray = [];
        this.lastLoadedXMLId = l;
        this.XMLloadingWarning = 0;
        var s = this.setCheckList.split(this.dlmtr);
        for (var g = 0; g < s.length; g++) {
            if (s[g]) { this.setCheck(s[g], 1) }
        }
        if ((this.XMLsource) && (this.tscheck) && (this.smcheck) && (v.id != this.rootId)) {
            if (v.checkstate === 0) { this._setSubChecked(0, v) } else {
                if (v.checkstate === 1) { this._setSubChecked(1, v) }
            }
        }
        this._redrawFrom(this, null, c);
        if (e.get("order") && e.get("order") != "none") { this._reorderBranch(v, e.get("order"), true) }
        if (this.nodeAskingCall != "") { this.callEvent("onClick", [this.nodeAskingCall, this.getSelectedItemId()]) }
        if (this._branchUpdate) { this._branchUpdateNext(e) }
    }
    if (this.parsCount == 1) {
        this.parsingOn = null;
        if (this._srnd && v.id != this.rootId) {
            this.prepareSR(v.id);
            if (this.XMLsource) { this.openItem(v.id) }
        }
        e.through("item", "open", null, function (n) { this.openItem(n.get("id")) }, this);
        if ((!this._edsbps) || (!this._edsbpsA.length)) {
            var o = this;
            window.setTimeout(function () { o.callEvent("onXLE", [o, l]) }, 1);
            this.xmlstate = 0
        }
        this.skipLock = false
    }
    this.parsCount--;
    var o = this;
    if (this._edsbps) { window.setTimeout(function () { o._distributedStep(l) }, this._edsbpsD) }
    if (!a && this.onXLE) { this.onXLE(this, l) }
    return this.nodeAskingCall
};
dhtmlXTreeObject.prototype._branchUpdateNext = function (a) {
    a.each("item", function (g) {
        var e = g.get("id");
        if (this._idpull[e] && (!this._idpull[e].XMLload)) {
            return
        }
        this._branchUpdate++;
        this.smartRefreshItem(g.get("id"), g)
    }, this);
    this._branchUpdate--
};
dhtmlXTreeObject.prototype.checkUserData = function (c, e) {
    if ((c.nodeType == 1) && (c.tagName == "userdata")) {
        var a = c.getAttribute("name");
        if ((a) && (c.childNodes[0])) { this.setUserData(e, a, c.childNodes[0].data) }
    }
};
dhtmlXTreeObject.prototype._redrawFrom = function (n, c, m, e) {
    if (!c) {
        var h = n._globalIdStorageFind(n.lastLoadedXMLId);
        n.lastLoadedXMLId = -1;
        if (!h) {
            return 0
        }
    } else { h = c }
    var l = 0;
    for (var g = (m ? m - 1 : 0) ; g < h.childsCount; g++) {
        if ((!this._branchUpdate) || (this._getOpenState(h) == 1)) {
            if ((!c) || (e == 1)) { h.childNodes[g].htmlNode.parentNode.parentNode.style.display = "" }
        }
        if (h.childNodes[g].openMe == 1) {
            this._openItem(h.childNodes[g]);
            h.childNodes[g].openMe = 0
        }
        n._redrawFrom(n, h.childNodes[g]);
        if (this.childCalc != null) {
            if ((h.childNodes[g].unParsed) || ((!h.childNodes[g].XMLload) && (this.XMLsource))) {
                if (h.childNodes[g]._acc) { h.childNodes[g].span.innerHTML = h.childNodes[g].label + this.htmlcA + h.childNodes[g]._acc + this.htmlcB } else { h.childNodes[g].span.innerHTML = h.childNodes[g].label }
            }
            if ((h.childNodes[g].childNodes.length) && (this.childCalc)) {
                if (this.childCalc == 1) { h.childNodes[g].span.innerHTML = h.childNodes[g].label + this.htmlcA + h.childNodes[g].childsCount + this.htmlcB }
                if (this.childCalc == 2) {
                    var a = h.childNodes[g].childsCount - (h.childNodes[g].pureChilds || 0);
                    if (a) { h.childNodes[g].span.innerHTML = h.childNodes[g].label + this.htmlcA + a + this.htmlcB }
                    if (h.pureChilds) { h.pureChilds++ } else { h.pureChilds = 1 }
                }
                if (this.childCalc == 3) { h.childNodes[g].span.innerHTML = h.childNodes[g].label + this.htmlcA + h.childNodes[g]._acc + this.htmlcB }
                if (this.childCalc == 4) {
                    var a = h.childNodes[g]._acc;
                    if (a) { h.childNodes[g].span.innerHTML = h.childNodes[g].label + this.htmlcA + a + this.htmlcB }
                }
            } else {
                if (this.childCalc == 4) { l++ }
            }
            l += h.childNodes[g]._acc;
            if (this.childCalc == 3) { l++ }
        }
    }
    if ((!h.unParsed) && ((h.XMLload) || (!this.XMLsource))) { h._acc = l }
    n._correctLine(h);
    n._correctPlus(h);
    if ((this.childCalc) && (!c)) { n._fixChildCountLabel(h) }
};
dhtmlXTreeObject.prototype._createSelf = function () {
    var a = document.createElement("div");
    a.className = "containerTableStyle";
    a.style.width = this.width;
    a.style.height = this.height;
    this.parentObject.appendChild(a);
    return a
};
dhtmlXTreeObject.prototype._xcloseAll = function (c) {
    if (c.unParsed) {
        return
    }
    if (this.rootId != c.id) {
        if (!c.htmlNode) {
            return
        }
        var g = c.htmlNode.childNodes[0].childNodes;
        var a = g.length;
        for (var e = 1; e < a; e++) { g[e].style.display = "none" }
        this._correctPlus(c)
    }
    for (var e = 0; e < c.childsCount; e++) {
        if (c.childNodes[e].childsCount) { this._xcloseAll(c.childNodes[e]) }
    }
};
dhtmlXTreeObject.prototype._xopenAll = function (a) {
    this._HideShow(a, 2);
    for (var c = 0; c < a.childsCount; c++) { this._xopenAll(a.childNodes[c]) }
};
dhtmlXTreeObject.prototype._correctPlus = function (c) {
    if (!c.htmlNode) {
        return
    }
    var e = c.htmlNode.childNodes[0].childNodes[0].childNodes[0].lastChild;
    var h = c.htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0];
    var a = this.lineArray;
    if ((this.XMLsource) && (!c.XMLload)) {
        var a = this.plusArray;
        this._setSrc(h, this.iconURL + c.images[2]);
        if (this._txtimg) {
            return (e.innerHTML = "[+]")
        }
    } else {
        if ((c.childsCount) || (c.unParsed)) {
            if ((c.htmlNode.childNodes[0].childNodes[1]) && (c.htmlNode.childNodes[0].childNodes[1].style.display != "none")) {
                if (!c.wsign) {
                    var a = this.minusArray
                }
                this._setSrc(h, this.iconURL + c.images[1]);
                if (this._txtimg) {
                    return (e.innerHTML = "[-]")
                }
            } else {
                if (!c.wsign) {
                    var a = this.plusArray
                }
                this._setSrc(h, this.iconURL + c.images[2]);
                if (this._txtimg) {
                    return (e.innerHTML = "[+]")
                }
            }
        } else { this._setSrc(h, this.iconURL + c.images[0]) }
    }
    var g = 2;
    if (!c.treeNod.treeLinesOn) { this._setSrc(e, this.imPath + a[3]) } else {
        if (c.parentObject) { g = this._getCountStatus(c.id, c.parentObject) }
        this._setSrc(e, this.imPath + a[g])
    }
};
dhtmlXTreeObject.prototype._correctLine = function (c) {
    if (!c.htmlNode) {
        return
    }
    var a = c.parentObject;
    if (a) {
        if ((this._getLineStatus(c.id, a) == 0) || (!this.treeLinesOn)) {
            for (var e = 1; e <= c.childsCount; e++) {
                if (!c.htmlNode.childNodes[0].childNodes[e]) {
                    break
                }
                c.htmlNode.childNodes[0].childNodes[e].childNodes[0].style.backgroundImage = "";
                c.htmlNode.childNodes[0].childNodes[e].childNodes[0].style.backgroundRepeat = ""
            }
        } else {
            for (var e = 1; e <= c.childsCount; e++) {
                if (!c.htmlNode.childNodes[0].childNodes[e]) {
                    break
                }
                c.htmlNode.childNodes[0].childNodes[e].childNodes[0].style.backgroundImage = "url(" + this.imPath + this.lineArray[5] + ")";
                c.htmlNode.childNodes[0].childNodes[e].childNodes[0].style.backgroundRepeat = "repeat-y"
            }
        }
    }
};
dhtmlXTreeObject.prototype._getCountStatus = function (c, a) {
    if (a.childsCount <= 1) {
        if (a.id == this.rootId) {
            return 4
        } else {
            return 0
        }
    }
    if (a.childNodes[0].id == c) {
        if (a.id == this.rootId) {
            return 2
        } else {
            return 1
        }
    }
    if (a.childNodes[a.childsCount - 1].id == c) {
        return 0
    }
    return 1
};
dhtmlXTreeObject.prototype._getLineStatus = function (c, a) {
    if (a.childNodes[a.childsCount - 1].id == c) {
        return 0
    }
    return 1
};
dhtmlXTreeObject.prototype._HideShow = function (c, h) {
    if (this._locker && !this.skipLock && this._locker[c.id]) {
        return
    }
    if ((this.XMLsource) && (!c.XMLload)) {
        if (h == 1) {
            return
        }
        c.XMLload = 1;
        this._loadDynXML(c.id);
        return
    }
    if (c.unParsed) { this.reParse(c) }
    var g = c.htmlNode.childNodes[0].childNodes;
    var a = g.length;
    if (a > 1) {
        if (((g[1].style.display != "none") || (h == 1)) && (h != 2)) {
            this.allTree.childNodes[0].border = "1";
            this.allTree.childNodes[0].border = "0";
            nodestyle = "none"
        } else { nodestyle = "" }
        for (var e = 1; e < a; e++) { g[e].style.display = nodestyle }
    }
    this._correctPlus(c)
};
dhtmlXTreeObject.prototype._getOpenState = function (a) {
    if (!a.htmlNode) {
        return 0
    }
    var c = a.htmlNode.childNodes[0].childNodes;
    if (c.length <= 1) {
        return 0
    }
    if (c[1].style.display != "none") {
        return 1
    } else {
        return -1
    }
};
dhtmlXTreeObject.prototype.onRowClick2 = function () {
    var a = this.parentObject.treeNod;
    if (!a.callEvent("onDblClick", [this.parentObject.id, a])) {
        return false
    }
    if ((this.parentObject.closeble) && (this.parentObject.closeble != "0")) { a._HideShow(this.parentObject) } else { a._HideShow(this.parentObject, 2) }
    if (a.checkEvent("onOpenEnd")) {
        if (!a.xmlstate) { a.callEvent("onOpenEnd", [this.parentObject.id, a._getOpenState(this.parentObject)]) } else {
            a._oie_onXLE.push(a.onXLE);
            a.onXLE = a._epnFHe
        }
    }
    return false
};
dhtmlXTreeObject.prototype.onRowClick = function () {
    var a = this.parentObject.treeNod;
    if (!a.callEvent("onOpenStart", [this.parentObject.id, a._getOpenState(this.parentObject)])) {
        return 0
    }
    if ((this.parentObject.closeble) && (this.parentObject.closeble != "0")) { a._HideShow(this.parentObject) } else { a._HideShow(this.parentObject, 2) }
    if (a.checkEvent("onOpenEnd")) {
        if (!a.xmlstate) { a.callEvent("onOpenEnd", [this.parentObject.id, a._getOpenState(this.parentObject)]) } else {
            a._oie_onXLE.push(a.onXLE);
            a.onXLE = a._epnFHe
        }
    }
};
dhtmlXTreeObject.prototype._epnFHe = function (c, e, a) {
    if (e != this.rootId) { this.callEvent("onOpenEnd", [e, c.getOpenState(e)]) }
    c.onXLE = c._oie_onXLE.pop();
    if (!a && !c._oie_onXLE.length) {
        if (c.onXLE) { c.onXLE(c, e) }
    }
};
dhtmlXTreeObject.prototype.onRowClickDown = function (c) {
    c = c || window.event;
    var a = this.parentObject.treeNod;
    a._selectItem(this.parentObject, c)
};
dhtmlXTreeObject.prototype.getSelectedItemId = function () {
    var c = new Array();
    for (var a = 0; a < this._selected.length; a++) { c[a] = this._selected[a].id }
    return (c.join(this.dlmtr))
};
dhtmlXTreeObject.prototype._selectItem = function (m, n) {
    if (this.checkEvent("onSelect")) { this._onSSCFold = this.getSelectedItemId() }
    if ((!this._amsel) || (!n) || ((!n.ctrlKey) && (!n.metaKey) && (!n.shiftKey))) { this._unselectItems() }
    if ((m.i_sel) && (this._amsel) && (n) && (n.ctrlKey || n.metaKey)) { this._unselectItem(m) } else {
        if ((!m.i_sel) && ((!this._amselS) || (this._selected.length == 0) || (this._selected[0].parentObject == m.parentObject))) {
            if ((this._amsel) && (n) && (n.shiftKey) && (this._selected.length != 0) && (this._selected[this._selected.length - 1].parentObject == m.parentObject)) {
                var h = this._getIndex(this._selected[this._selected.length - 1]);
                var g = this._getIndex(m);
                if (g < h) {
                    var r = h;
                    h = g;
                    g = r
                }
                for (var l = h; l <= g; l++) {
                    if (!m.parentObject.childNodes[l].i_sel) { this._markItem(m.parentObject.childNodes[l]) }
                }
            } else { this._markItem(m) }
        }
    }
    if (this.checkEvent("onSelect")) {
        var o = this.getSelectedItemId();
        if (o != this._onSSCFold) { this.callEvent("onSelect", [o]) }
    }
};
dhtmlXTreeObject.prototype._markItem = function (a) {
    if (a.scolor) { a.span.style.color = a.scolor }
    a.span.className = "selectedTreeRow";
    a.span.parentNode.parentNode.className = "selectedTreeRowFull";
    a.i_sel = true;
    this._selected[this._selected.length] = a
};
dhtmlXTreeObject.prototype.getIndexById = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return null
    }
    return this._getIndex(a)
};
dhtmlXTreeObject.prototype._getIndex = function (a) {
    var e = a.parentObject;
    for (var c = 0; c < e.childsCount; c++) {
        if (e.childNodes[c] == a) {
            return c
        }
    }
};
dhtmlXTreeObject.prototype._unselectItem = function (c) {
    if ((c) && (c.i_sel)) {
        c.span.className = "standartTreeRow";
        c.span.parentNode.parentNode.className = "";
        if (c.acolor) { c.span.style.color = c.acolor }
        c.i_sel = false;
        for (var a = 0; a < this._selected.length; a++) {
            if (!this._selected[a].i_sel) {
                this._selected.splice(a, 1);
                break
            }
        }
    }
};
dhtmlXTreeObject.prototype._unselectItems = function () {
    for (var a = 0; a < this._selected.length; a++) {
        var c = this._selected[a];
        c.span.className = "standartTreeRow";
        c.span.parentNode.parentNode.className = "";
        if (c.acolor) { c.span.style.color = c.acolor }
        c.i_sel = false
    }
    this._selected = new Array()
};
dhtmlXTreeObject.prototype.onRowSelect = function (h, g, m) {
    h = h || window.event;
    var c = this.parentObject;
    if (g) { c = g.parentObject }
    var a = c.treeNod;
    var l = a.getSelectedItemId();
    if ((!h) || (!h.skipUnSel)) { a._selectItem(c, h) }
    if (!m) {
        if (c.actionHandler) { c.actionHandler(c.id, l) } else { a.callEvent("onClick", [c.id, l]) }
    }
};
dhtmlXTreeObject.prototype._correctCheckStates = function (h) {
    if (!this.tscheck) {
        return
    }
    if (!h) {
        return
    }
    if (h.id == this.rootId) {
        return
    }
    var e = h.childNodes;
    var c = 0;
    var a = 0;
    if (h.childsCount == 0) {
        return
    }
    for (var g = 0; g < h.childsCount; g++) {
        if (e[g].dscheck) {
            continue
        }
        if (e[g].checkstate == 0) { c = 1 } else {
            if (e[g].checkstate == 1) { a = 1 } else {
                c = 1;
                a = 1;
                break
            }
        }
    }
    if ((c) && (a)) { this._setCheck(h, "unsure") } else {
        if (c) { this._setCheck(h, false) } else { this._setCheck(h, true) }
    }
    this._correctCheckStates(h.parentObject)
};
dhtmlXTreeObject.prototype.onCheckBoxClick = function (a) {
    if (!this.treeNod.callEvent("onBeforeCheck", [this.parentObject.id, this.parentObject.checkstate])) {
        return
    }
    if (this.parentObject.dscheck) {
        return true
    }
    if (this.treeNod.tscheck) {
        if (this.parentObject.checkstate == 1) { this.treeNod._setSubChecked(false, this.parentObject) } else { this.treeNod._setSubChecked(true, this.parentObject) }
    } else {
        if (this.parentObject.checkstate == 1) { this.treeNod._setCheck(this.parentObject, false) } else { this.treeNod._setCheck(this.parentObject, true) }
    }
    this.treeNod._correctCheckStates(this.parentObject.parentObject);
    return this.treeNod.callEvent("onCheck", [this.parentObject.id, this.parentObject.checkstate])
};
dhtmlXTreeObject.prototype._createItem = function (u, s, n) {
    var v = document.createElement("table");
    v.cellSpacing = 0;
    v.cellPadding = 0;
    v.border = 0;
    if (this.hfMode) { v.style.tableLayout = "fixed" }
    v.style.margin = 0;
    v.style.padding = 0;
    var m = document.createElement("tbody");
    var r = document.createElement("tr");
    var g = document.createElement("td");
    g.className = "standartTreeImage";
    if (this._txtimg) {
        var h = document.createElement("div");
        g.appendChild(h);
        h.className = "dhx_tree_textSign"
    } else {
        var h = this._getImg(s.id);
        h.border = "0";
        if (h.tagName == "IMG") { h.align = "absmiddle" }
        g.appendChild(h);
        h.style.padding = 0;
        h.style.margin = 0;
        h.style.width = this.def_line_img_x
    }
    var e = document.createElement("td");
    var o = this._getImg(this.cBROf ? this.rootId : s.id);
    o.checked = 0;
    this._setSrc(o, this.imPath + this.checkArray[0]);
    o.style.width = "18px";
    o.style.height = "18px";
    if (!u) { e.style.display = "none" }
    e.appendChild(o);
    if ((!this.cBROf) && (o.tagName == "IMG")) { o.align = "absmiddle" }
    o.onclick = this.onCheckBoxClick;
    o.treeNod = this;
    o.parentObject = s;
    if (!window._KHTMLrv) { e.width = "20px" } else { e.width = "16px" }
    var c = document.createElement("td");
    c.className = "standartTreeImage";
    var l = this._getImg(this.timgen ? s.id : this.rootId);
    l.onmousedown = this._preventNsDrag;
    l.ondragstart = this._preventNsDrag;
    l.border = "0";
    if (this._aimgs) {
        l.parentObject = s;
        if (l.tagName == "IMG") { l.align = "absmiddle" }
        l.onclick = this.onRowSelect
    }
    if (!n) { this._setSrc(l, this.iconURL + this.imageArray[0]) }
    c.appendChild(l);
    l.style.padding = 0;
    l.style.margin = 0;
    if (this.timgen) {
        c.style.width = l.style.width = this.def_img_x;
        l.style.height = this.def_img_y
    } else {
        l.style.width = "0px";
        l.style.height = "0px";
        if (_isOpera || window._KHTMLrv) { c.style.display = "none" }
    }
    var a = document.createElement("td");
    a.className = "dhxTextCell standartTreeRow";
    s.span = document.createElement("span");
    s.span.className = "standartTreeRow";
    if (this.mlitems) {
        s.span.style.width = this.mlitems;
        s.span.style.display = "block"
    } else { a.noWrap = true }
    if (dhx4.isIE8) { a.style.width = "99999px" } else {
        if (!window._KHTMLrv) { a.style.width = "100%" }
    }
    s.span.innerHTML = s.label;
    a.appendChild(s.span);
    a.parentObject = s;
    g.parentObject = s;
    a.onclick = this.onRowSelect;
    g.onclick = this.onRowClick;
    a.ondblclick = this.onRowClick2;
    if (this.ettip) { r.title = s.label }
    if (this.dragAndDropOff) {
        if (this._aimgs) {
            this.dragger.addDraggableItem(c, this);
            c.parentObject = s
        }
        this.dragger.addDraggableItem(a, this)
    }
    s.span.style.paddingLeft = "5px";
    s.span.style.paddingRight = "5px";
    a.style.verticalAlign = "";
    a.style.fontSize = "10pt";
    a.style.cursor = this.style_pointer;
    r.appendChild(g);
    r.appendChild(e);
    r.appendChild(c);
    r.appendChild(a);
    m.appendChild(r);
    v.appendChild(m);
    if (this.ehlt || this.checkEvent("onMouseIn") || this.checkEvent("onMouseOut")) {
        r.onmousemove = this._itemMouseIn;
        r[(_isIE) ? "onmouseleave" : "onmouseout"] = this._itemMouseOut
    }
    return v
};
dhtmlXTreeObject.prototype.setImagePath = function (a) {
    this.imPath = a;
    this.iconURL = a
};
dhtmlXTreeObject.prototype.setIconPath = function (a) { this.iconURL = a };
dhtmlXTreeObject.prototype._getLeafCount = function (g) {
    var e = 0;
    for (var c = 0; c < g.childsCount; c++) {
        if (g.childNodes[c].childsCount == 0) { e++ }
    }
    return e
};
dhtmlXTreeObject.prototype._getChildCounterValue = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    }
    if ((a.unParsed) || ((!a.XMLload) && (this.XMLsource))) {
        return a._acc
    }
    switch (this.childCalc) {
        case 1:
            return a.childsCount;
            break;
        case 2:
            return this._getLeafCount(a);
            break;
        case 3:
            return a._acc;
            break;
        case 4:
            return a._acc;
            break
    }
};
dhtmlXTreeObject.prototype._fixChildCountLabel = function (l, g) {
    if (this.childCalc == null) {
        return
    }
    if ((l.unParsed) || ((!l.XMLload) && (this.XMLsource))) {
        if (l._acc) { l.span.innerHTML = l.label + this.htmlcA + l._acc + this.htmlcB } else { l.span.innerHTML = l.label }
        return
    }
    switch (this.childCalc) {
        case 1:
            if (l.childsCount != 0) { l.span.innerHTML = l.label + this.htmlcA + l.childsCount + this.htmlcB } else { l.span.innerHTML = l.label }
            break;
        case 2:
            var h = this._getLeafCount(l);
            if (h != 0) { l.span.innerHTML = l.label + this.htmlcA + h + this.htmlcB } else { l.span.innerHTML = l.label }
            break;
        case 3:
            if (l.childsCount != 0) {
                var e = 0;
                for (var c = 0; c < l.childsCount; c++) {
                    if (!l.childNodes[c]._acc) { l.childNodes[c]._acc = 0 }
                    e += l.childNodes[c]._acc * 1
                }
                e += l.childsCount * 1;
                l.span.innerHTML = l.label + this.htmlcA + e + this.htmlcB;
                l._acc = e
            } else {
                l.span.innerHTML = l.label;
                l._acc = 0
            }
            if ((l.parentObject) && (l.parentObject != this.htmlNode)) { this._fixChildCountLabel(l.parentObject) }
            break;
        case 4:
            if (l.childsCount != 0) {
                var e = 0;
                for (var c = 0; c < l.childsCount; c++) {
                    if (!l.childNodes[c]._acc) { l.childNodes[c]._acc = 1 }
                    e += l.childNodes[c]._acc * 1
                }
                l.span.innerHTML = l.label + this.htmlcA + e + this.htmlcB;
                l._acc = e
            } else {
                l.span.innerHTML = l.label;
                l._acc = 1
            }
            if ((l.parentObject) && (l.parentObject != this.htmlNode)) { this._fixChildCountLabel(l.parentObject) }
            break
    }
};
dhtmlXTreeObject.prototype.setChildCalcMode = function (a) {
    switch (a) {
        case "child":
            this.childCalc = 1;
            break;
        case "leafs":
            this.childCalc = 2;
            break;
        case "childrec":
            this.childCalc = 3;
            break;
        case "leafsrec":
            this.childCalc = 4;
            break;
        case "disabled":
            this.childCalc = null;
            break;
        default:
            this.childCalc = 4
    }
};
dhtmlXTreeObject.prototype.setChildCalcHTML = function (c, a) {
    this.htmlcA = c;
    this.htmlcB = a
};
dhtmlXTreeObject.prototype.setOnRightClickHandler = function (a) { this.attachEvent("onRightClick", a) };
dhtmlXTreeObject.prototype.setOnClickHandler = function (a) { this.attachEvent("onClick", a) };
dhtmlXTreeObject.prototype.setOnSelectStateChange = function (a) { this.attachEvent("onSelect", a) };
dhtmlXTreeObject.prototype.setXMLAutoLoading = function (a) { this.XMLsource = a };
dhtmlXTreeObject.prototype.setOnCheckHandler = function (a) { this.attachEvent("onCheck", a) };
dhtmlXTreeObject.prototype.setOnOpenHandler = function (a) { this.attachEvent("onOpenStart", a) };
dhtmlXTreeObject.prototype.setOnOpenStartHandler = function (a) { this.attachEvent("onOpenStart", a) };
dhtmlXTreeObject.prototype.setOnOpenEndHandler = function (a) { this.attachEvent("onOpenEnd", a) };
dhtmlXTreeObject.prototype.setOnDblClickHandler = function (a) { this.attachEvent("onDblClick", a) };
dhtmlXTreeObject.prototype.openAllItems = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    }
    this._xopenAll(a)
};
dhtmlXTreeObject.prototype.getOpenState = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return ""
    }
    return this._getOpenState(a)
};
dhtmlXTreeObject.prototype.closeAllItems = function (c) {
    if (c === window.undefined) { c = this.rootId }
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    }
    this._xcloseAll(a);
    this.allTree.childNodes[0].border = "1";
    this.allTree.childNodes[0].border = "0"
};
dhtmlXTreeObject.prototype.setUserData = function (g, c, e) {
    var a = this._globalIdStorageFind(g, 0, true);
    if (!a) {
        return
    }
    if (c == "hint") { a.htmlNode.childNodes[0].childNodes[0].title = e }
    if (typeof (a.userData["t_" + c]) == "undefined") {
        if (!a._userdatalist) { a._userdatalist = c } else { a._userdatalist += "," + c }
    }
    a.userData["t_" + c] = e
};
dhtmlXTreeObject.prototype.getUserData = function (e, c) {
    var a = this._globalIdStorageFind(e, 0, true);
    if (!a) {
        return
    }
    return a.userData["t_" + c]
};
dhtmlXTreeObject.prototype.getItemColor = function (e) {
    var a = this._globalIdStorageFind(e);
    if (!a) {
        return 0
    }
    var c = new Object();
    if (a.acolor) { c.acolor = a.acolor }
    if (a.scolor) { c.scolor = a.scolor }
    return c
};
dhtmlXTreeObject.prototype.setItemColor = function (e, c, g) {
    if ((e) && (e.span)) {
        var a = e
    } else {
        var a = this._globalIdStorageFind(e)
    }
    if (!a) {
        return 0
    } else {
        if (a.i_sel) {
            if (g || c) { a.span.style.color = g || c }
        } else {
            if (c) { a.span.style.color = c }
        }
        if (g) { a.scolor = g }
        if (c) { a.acolor = c }
    }
};
dhtmlXTreeObject.prototype.getItemText = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    }
    return (a.htmlNode.childNodes[0].childNodes[0].childNodes[3].childNodes[0].innerHTML)
};
dhtmlXTreeObject.prototype.getParentId = function (c) {
    var a = this._globalIdStorageFind(c);
    if ((!a) || (!a.parentObject)) {
        return ""
    }
    return a.parentObject.id
};
dhtmlXTreeObject.prototype.changeItemId = function (c, e) {
    if (c == e) {
        return
    }
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    }
    a.id = e;
    a.span.contextMenuId = e;
    this._idpull[e] = this._idpull[c];
    delete this._idpull[c]
};
dhtmlXTreeObject.prototype.doCut = function () {
    if (this.nodeCut) { this.clearCut() }
    this.nodeCut = (new Array()).concat(this._selected);
    for (var a = 0; a < this.nodeCut.length; a++) {
        var c = this.nodeCut[a];
        c._cimgs = new Array();
        c._cimgs[0] = c.images[0];
        c._cimgs[1] = c.images[1];
        c._cimgs[2] = c.images[2];
        c.images[0] = c.images[1] = c.images[2] = this.cutImage;
        this._correctPlus(c)
    }
};
dhtmlXTreeObject.prototype.doPaste = function (e) {
    var a = this._globalIdStorageFind(e);
    if (!a) {
        return 0
    }
    for (var c = 0; c < this.nodeCut.length; c++) {
        if (this._checkPNodes(a, this.nodeCut[c])) {
            continue
        }
        this._moveNode(this.nodeCut[c], a)
    }
    this.clearCut()
};
dhtmlXTreeObject.prototype.clearCut = function () {
    for (var a = 0; a < this.nodeCut.length; a++) {
        var c = this.nodeCut[a];
        c.images[0] = c._cimgs[0];
        c.images[1] = c._cimgs[1];
        c.images[2] = c._cimgs[2];
        this._correctPlus(c)
    }
    this.nodeCut = new Array()
};
dhtmlXTreeObject.prototype._moveNode = function (a, c) {
    var l = this.dadmodec;
    if (l == 1) {
        var h = c;
        if (this.dadmodefix < 0) {
            while (true) {
                h = this._getPrevNode(h);
                if ((h == -1)) {
                    h = this.htmlNode;
                    break
                }
                if ((h.tr == 0) || (h.tr.style.display == "") || (!h.parentObject)) {
                    break
                }
            }
            var g = h;
            var e = c
        } else {
            if ((h.tr) && (h.tr.nextSibling) && (h.tr.nextSibling.nodem) && (this._getOpenState(h) < 1)) { h = h.tr.nextSibling.nodem } else {
                h = this._getNextNode(h);
                if ((h == -1)) { h = this.htmlNode }
            }
            var e = h;
            var g = c
        }
        if (this._getNodeLevel(g, 0) > this._getNodeLevel(e, 0)) {
            if (!this.dropLower) {
                return this._moveNodeTo(a, g.parentObject)
            } else {
                if (e.id != this.rootId) {
                    return this._moveNodeTo(a, e.parentObject, e)
                } else {
                    return this._moveNodeTo(a, this.htmlNode, null)
                }
            }
        } else {
            return this._moveNodeTo(a, e.parentObject, e)
        }
    } else {
        return this._moveNodeTo(a, c)
    }
};
dhtmlXTreeObject.prototype._fixNodesCollection = function (n, l) {
    var c = 0;
    var g = 0;
    var m = n.childNodes;
    var a = n.childsCount - 1;
    if (l == m[a]) {
        return
    }
    for (var h = 0; h < a; h++) {
        if (m[h] == m[a]) {
            m[h] = m[h + 1];
            m[h + 1] = m[a]
        }
    }
    for (var h = 0; h < a + 1; h++) {
        if (c) {
            var e = m[h];
            m[h] = c;
            c = e
        } else {
            if (m[h] == l) {
                c = m[h];
                m[h] = m[a]
            }
        }
    }
};
dhtmlXTreeObject.prototype._recreateBranch = function (l, n, h, a) {
    var c;
    var o = "";
    if (h) {
        for (c = 0; c < n.childsCount; c++) {
            if (n.childNodes[c] == h) {
                break
            }
        }
        if (c != 0) { h = n.childNodes[c - 1] } else {
            o = "TOP";
            h = ""
        }
    }
    var e = this._onradh;
    this._onradh = null;
    var m = this._attachChildNode(n, l.id, l.label, 0, l.images[0], l.images[1], l.images[2], o, 0, h);
    m._userdatalist = l._userdatalist;
    m.userData = l.userData.clone();
    if (l._attrs) {
        m._attrs = {};
        for (var g in l._attrs) { m._attrs[g] = l._attrs[g] }
    }
    m.XMLload = l.XMLload;
    if (e) {
        this._onradh = e;
        this._onradh(m.id)
    }
    if (l.treeNod.dpcpy) { l.treeNod._globalIdStorageFind(l.id) } else { m.unParsed = l.unParsed }
    this._correctPlus(m);
    for (var c = 0; c < l.childsCount; c++) { this._recreateBranch(l.childNodes[c], m, 0, 1) }
    if ((!a) && (this.childCalc)) { this._redrawFrom(this, n) }
    return m
};
dhtmlXTreeObject.prototype._moveNodeTo = function (u, w, s) {
    if (u.treeNod._nonTrivialNode) {
        return u.treeNod._nonTrivialNode(this, w, s, u)
    }
    if (this._checkPNodes(w, u)) {
        return false
    }
    if (w.mytype) {
        var m = (u.treeNod.lWin != w.lWin)
    } else {
        var m = (u.treeNod.lWin != w.treeNod.lWin)
    }
    if (!this.callEvent("onDrag", [u.id, w.id, (s ? s.id : null), u.treeNod, w.treeNod])) {
        return false
    }
    if ((w.XMLload == 0) && (this.XMLsource)) {
        w.XMLload = 1;
        this._loadDynXML(w.id)
    }
    this.openItem(w.id);
    var e = u.treeNod;
    var o = u.parentObject.childsCount;
    var r = u.parentObject;
    if ((m) || (e.dpcpy)) {
        var g = u.id;
        u = this._recreateBranch(u, w, s);
        if (!e.dpcpy) { e.deleteItem(g) }
    } else {
        var h = w.childsCount;
        var v = w.childNodes;
        if (h == 0) { w._open = true }
        e._unselectItem(u);
        v[h] = u;
        u.treeNod = w.treeNod;
        w.childsCount++;
        var n = this._drawNewTr(v[h].htmlNode);
        if (!s) {
            w.htmlNode.childNodes[0].appendChild(n);
            if (this.dadmode == 1) { this._fixNodesCollection(w, s) }
        } else {
            w.htmlNode.childNodes[0].insertBefore(n, s.tr);
            this._fixNodesCollection(w, s);
            v = w.childNodes
        }
    }
    if ((!e.dpcpy) && (!m)) {
        var a = u.tr;
        if ((document.all) && (navigator.appVersion.search(/MSIE\ 5\.0/gi) != -1)) { window.setTimeout(function () { a.parentNode.removeChild(a) }, 250) } else { u.parentObject.htmlNode.childNodes[0].removeChild(u.tr) }
        if ((!s) || (w != u.parentObject)) {
            for (var l = 0; l < r.childsCount; l++) {
                if (r.childNodes[l].id == u.id) {
                    r.childNodes[l] = 0;
                    break
                }
            }
        } else { r.childNodes[r.childsCount - 1] = 0 }
        e._compressChildList(r.childsCount, r.childNodes);
        r.childsCount--
    }
    if ((!m) && (!e.dpcpy)) {
        u.tr = n;
        n.nodem = u;
        u.parentObject = w;
        if (e != w.treeNod) {
            if (u.treeNod._registerBranch(u, e)) {
                return
            }
            this._clearStyles(u);
            this._redrawFrom(this, u.parentObject);
            if (this._onradh) { this._onradh(u.id) }
        }
        this._correctPlus(w);
        this._correctLine(w);
        this._correctLine(u);
        this._correctPlus(u);
        if (s) { this._correctPlus(s) } else {
            if (w.childsCount >= 2) {
                this._correctPlus(v[w.childsCount - 2]);
                this._correctLine(v[w.childsCount - 2])
            }
        }
        this._correctPlus(v[w.childsCount - 1]);
        if (this.tscheck) { this._correctCheckStates(w) }
        if (e.tscheck) { e._correctCheckStates(r) }
    }
    if (o > 1) {
        e._correctPlus(r.childNodes[o - 2]);
        e._correctLine(r.childNodes[o - 2])
    }
    e._correctPlus(r);
    e._correctLine(r);
    this._fixChildCountLabel(w);
    e._fixChildCountLabel(r);
    this.callEvent("onDrop", [u.id, w.id, (s ? s.id : null), e, w.treeNod]);
    return u.id
};
dhtmlXTreeObject.prototype._clearStyles = function (a) {
    if (!a.htmlNode) {
        return
    }
    var g = a.htmlNode.childNodes[0].childNodes[0].childNodes[1];
    var c = g.nextSibling.nextSibling;
    a.span.innerHTML = a.label;
    a.i_sel = false;
    if (a._aimgs) { this.dragger.removeDraggableItem(g.nextSibling) }
    if (this.checkBoxOff) {
        g.childNodes[0].style.display = "";
        g.childNodes[0].onclick = this.onCheckBoxClick;
        this._setSrc(g.childNodes[0], this.imPath + this.checkArray[a.checkstate])
    } else { g.style.display = "none" }
    g.childNodes[0].treeNod = this;
    this.dragger.removeDraggableItem(c);
    if (this.dragAndDropOff) { this.dragger.addDraggableItem(c, this) }
    if (this._aimgs) { this.dragger.addDraggableItem(g.nextSibling, this) }
    c.childNodes[0].className = "standartTreeRow";
    c.parentNode.className = "";
    c.onclick = this.onRowSelect;
    c.ondblclick = this.onRowClick2;
    g.previousSibling.onclick = this.onRowClick;
    this._correctLine(a);
    this._correctPlus(a);
    for (var e = 0; e < a.childsCount; e++) { this._clearStyles(a.childNodes[e]) }
};
dhtmlXTreeObject.prototype._registerBranch = function (c, a) {
    if (a) { a._globalIdStorageSub(c.id) }
    c.id = this._globalIdStorageAdd(c.id, c);
    c.treeNod = this;
    for (var e = 0; e < c.childsCount; e++) { this._registerBranch(c.childNodes[e], a) }
    return 0
};
dhtmlXTreeObject.prototype.enableThreeStateCheckboxes = function (a) { this.tscheck = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.setOnMouseInHandler = function (a) {
    this.ehlt = true;
    this.attachEvent("onMouseIn", a)
};
dhtmlXTreeObject.prototype.setOnMouseOutHandler = function (a) {
    this.ehlt = true;
    this.attachEvent("onMouseOut", a)
};
dhtmlXTreeObject.prototype.enableMercyDrag = function (a) { this.dpcpy = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.enableTreeImages = function (a) { this.timgen = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.enableFixedMode = function (a) { this.hfMode = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.enableCheckBoxes = function (c, a) {
    this.checkBoxOff = dhx4.s2b(c);
    this.cBROf = (!(this.checkBoxOff || dhx4.s2b(a)))
};
dhtmlXTreeObject.prototype.setStdImages = function (a, e, c) {
    this.imageArray[0] = a;
    this.imageArray[1] = e;
    this.imageArray[2] = c
};
dhtmlXTreeObject.prototype.enableTreeLines = function (a) { this.treeLinesOn = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.setImageArrays = function (g, a, l, h, e, c) {
    switch (g) {
        case "plus":
            this.plusArray[0] = a;
            this.plusArray[1] = l;
            this.plusArray[2] = h;
            this.plusArray[3] = e;
            this.plusArray[4] = c;
            break;
        case "minus":
            this.minusArray[0] = a;
            this.minusArray[1] = l;
            this.minusArray[2] = h;
            this.minusArray[3] = e;
            this.minusArray[4] = c;
            break
    }
};
dhtmlXTreeObject.prototype.openItem = function (c) {
    this.skipLock = true;
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    } else {
        return this._openItem(a)
    }
    this.skipLock = false
};
dhtmlXTreeObject.prototype._openItem = function (a) {
    var c = this._getOpenState(a);
    if ((c < 0) || (((this.XMLsource) && (!a.XMLload)))) {
        if (!this.callEvent("onOpenStart", [a.id, c])) {
            return 0
        }
        this._HideShow(a, 2);
        if (this.checkEvent("onOpenEnd")) {
            if (this.onXLE == this._epnFHe) { this._epnFHe(this, a.id, true) }
            if (!this.xmlstate || !this.XMLsource) { this.callEvent("onOpenEnd", [a.id, this._getOpenState(a)]) } else {
                this._oie_onXLE.push(this.onXLE);
                this.onXLE = this._epnFHe
            }
        }
    } else {
        if (this._srnd) { this._HideShow(a, 2) }
    }
    if (a.parentObject && !this._skip_open_parent) { this._openItem(a.parentObject) }
};
dhtmlXTreeObject.prototype.closeItem = function (c) {
    if (this.rootId == c) {
        return 0
    }
    this.skipLock = true;
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    }
    if (a.closeble) { this._HideShow(a, 1) }
    this.skipLock = false
};
dhtmlXTreeObject.prototype.getLevel = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    }
    return this._getNodeLevel(a, 0)
};
dhtmlXTreeObject.prototype.setItemCloseable = function (e, a) {
    a = dhx4.s2b(a);
    if ((e) && (e.span)) {
        var c = e
    } else {
        var c = this._globalIdStorageFind(e)
    }
    if (!c) {
        return 0
    }
    c.closeble = a
};
dhtmlXTreeObject.prototype._getNodeLevel = function (a, c) {
    if (a.parentObject) {
        return this._getNodeLevel(a.parentObject, c + 1)
    }
    return (c)
};
dhtmlXTreeObject.prototype.hasChildren = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return 0
    } else {
        if ((this.XMLsource) && (!a.XMLload)) {
            return true
        } else {
            return a.childsCount
        }
    }
};
dhtmlXTreeObject.prototype._getLeafCount = function (g) {
    var e = 0;
    for (var c = 0; c < g.childsCount; c++) {
        if (g.childNodes[c].childsCount == 0) { e++ }
    }
    return e
};
dhtmlXTreeObject.prototype.setItemText = function (g, e, c) {
    var a = this._globalIdStorageFind(g);
    if (!a) {
        return 0
    }
    a.label = e;
    a.span.innerHTML = e;
    if (this.childCalc) { this._fixChildCountLabel(a) }
    a.span.parentNode.parentNode.title = c || ""
};
dhtmlXTreeObject.prototype.getItemTooltip = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return ""
    }
    return (a.span.parentNode.parentNode._dhx_title || a.span.parentNode.parentNode.title || "")
};
dhtmlXTreeObject.prototype.refreshItem = function (c) {
    if (!c) { c = this.rootId }
    var a = this._globalIdStorageFind(c);
    this._dynDeleteBranches[c] = (this._dynDeleteBranches[c] || 0) + 1;
    this._loadDynXML(c)
};
dhtmlXTreeObject.prototype.setItemImage2 = function (g, a, h, e) {
    var c = this._globalIdStorageFind(g);
    if (!c) {
        return 0
    }
    c.images[1] = h;
    c.images[2] = e;
    c.images[0] = a;
    this._correctPlus(c)
};
dhtmlXTreeObject.prototype.setItemImage = function (e, a, g) {
    var c = this._globalIdStorageFind(e);
    if (!c) {
        return 0
    }
    if (g) {
        c.images[1] = a;
        c.images[2] = g
    } else { c.images[0] = a }
    this._correctPlus(c)
};
dhtmlXTreeObject.prototype.getSubItems = function (e) {
    var a = this._globalIdStorageFind(e, 0, 1);
    if (!a) {
        return 0
    }
    if (a.unParsed) {
        return (this._getSubItemsXML(a.unParsed))
    }
    var c = "";
    for (i = 0; i < a.childsCount; i++) {
        if (!c) { c = "" + a.childNodes[i].id } else { c += this.dlmtr + a.childNodes[i].id }
    }
    return c
};
dhtmlXTreeObject.prototype._getAllScraggyItems = function (e) {
    var g = "";
    for (var c = 0; c < e.childsCount; c++) {
        if ((e.childNodes[c].unParsed) || (e.childNodes[c].childsCount > 0)) {
            if (e.childNodes[c].unParsed) {
                var a = this._getAllScraggyItemsXML(e.childNodes[c].unParsed, 1)
            } else {
                var a = this._getAllScraggyItems(e.childNodes[c])
            }
            if (a) {
                if (g) { g += this.dlmtr + a } else { g = a }
            }
        } else {
            if (!g) { g = "" + e.childNodes[c].id } else { g += this.dlmtr + e.childNodes[c].id }
        }
    }
    return g
};
dhtmlXTreeObject.prototype._getAllFatItems = function (e) {
    var g = "";
    for (var c = 0; c < e.childsCount; c++) {
        if ((e.childNodes[c].unParsed) || (e.childNodes[c].childsCount > 0)) {
            if (!g) { g = "" + e.childNodes[c].id } else { g += this.dlmtr + e.childNodes[c].id }
            if (e.childNodes[c].unParsed) {
                var a = this._getAllFatItemsXML(e.childNodes[c].unParsed, 1)
            } else {
                var a = this._getAllFatItems(e.childNodes[c])
            }
            if (a) { g += this.dlmtr + a }
        }
    }
    return g
};
dhtmlXTreeObject.prototype._getAllSubItems = function (l, h, g) {
    if (g) { c = g } else {
        var c = this._globalIdStorageFind(l)
    }
    if (!c) {
        return 0
    }
    h = "";
    for (var e = 0; e < c.childsCount; e++) {
        if (!h) { h = "" + c.childNodes[e].id } else { h += this.dlmtr + c.childNodes[e].id }
        var a = this._getAllSubItems(0, h, c.childNodes[e]);
        if (a) { h += this.dlmtr + a }
    }
    if (c.unParsed) { h = this._getAllSubItemsXML(l, h, c.unParsed) }
    return h
};
dhtmlXTreeObject.prototype.selectItem = function (g, e, c) {
    e = dhx4.s2b(e);
    var a = this._globalIdStorageFind(g);
    if ((!a) || (!a.parentObject)) {
        return 0
    }
    if (this.XMLloadingWarning) { a.parentObject.openMe = 1 } else { this._openItem(a.parentObject) }
    var h = null;
    if (c) {
        h = new Object;
        h.ctrlKey = true;
        if (a.i_sel) { h.skipUnSel = true }
    }
    if (e) { this.onRowSelect(h, a.htmlNode.childNodes[0].childNodes[0].childNodes[3], false) } else { this.onRowSelect(h, a.htmlNode.childNodes[0].childNodes[0].childNodes[3], true) }
};
dhtmlXTreeObject.prototype.getSelectedItemText = function () {
    var c = new Array();
    for (var a = 0; a < this._selected.length; a++) { c[a] = this._selected[a].span.innerHTML }
    return (c.join(this.dlmtr))
};
dhtmlXTreeObject.prototype._compressChildList = function (a, e) {
    a--;
    for (var c = 0; c < a; c++) {
        if (e[c] == 0) {
            e[c] = e[c + 1];
            e[c + 1] = 0
        }
    }
};
dhtmlXTreeObject.prototype._deleteNode = function (m, h, o) {
    if ((!h) || (!h.parentObject)) {
        return 0
    }
    var a = 0;
    var c = 0;
    if (h.tr.nextSibling) { a = h.tr.nextSibling.nodem }
    if (h.tr.previousSibling) { c = h.tr.previousSibling.nodem }
    var l = h.parentObject;
    var e = l.childsCount;
    var n = l.childNodes;
    for (var g = 0; g < e; g++) {
        if (n[g].id == m) {
            if (!o) { l.htmlNode.childNodes[0].removeChild(n[g].tr) }
            n[g] = 0;
            break
        }
    }
    this._compressChildList(e, n);
    if (!o) { l.childsCount-- }
    if (a) {
        this._correctPlus(a);
        this._correctLine(a)
    }
    if (c) {
        this._correctPlus(c);
        this._correctLine(c)
    }
    if (this.tscheck) { this._correctCheckStates(l) }
    if (!o) { this._globalIdStorageRecSub(h) }
};
dhtmlXTreeObject.prototype.setCheck = function (e, c) {
    var a = this._globalIdStorageFind(e, 0, 1);
    if (!a) {
        return
    }
    if (c === "unsure") { this._setCheck(a, c) } else {
        c = dhx4.s2b(c);
        if ((this.tscheck) && (this.smcheck)) { this._setSubChecked(c, a) } else { this._setCheck(a, c) }
    }
    if (this.smcheck) { this._correctCheckStates(a.parentObject) }
};
dhtmlXTreeObject.prototype._setCheck = function (a, e) {
    if (!a) {
        return
    }
    if (((a.parentObject._r_logic) || (this._frbtr)) && (e)) {
        if (this._frbtrs) {
            if (this._frbtrL) { this.setCheck(this._frbtrL.id, 0) }
            this._frbtrL = a
        } else {
            for (var c = 0; c < a.parentObject.childsCount; c++) { this._setCheck(a.parentObject.childNodes[c], 0) }
        }
    }
    var g = a.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    if (e == "unsure") { a.checkstate = 2 } else {
        if (e) { a.checkstate = 1 } else { a.checkstate = 0 }
    }
    if (a.dscheck) { a.checkstate = a.dscheck }
    this._setSrc(g, this.imPath + ((a.parentObject._r_logic || this._frbtr) ? this.radioArray : this.checkArray)[a.checkstate])
};
dhtmlXTreeObject.prototype.setSubChecked = function (e, c) {
    var a = this._globalIdStorageFind(e);
    this._setSubChecked(c, a);
    this._correctCheckStates(a.parentObject)
};
dhtmlXTreeObject.prototype._setSubChecked = function (e, a) {
    e = dhx4.s2b(e);
    if (!a) {
        return
    }
    if (((a.parentObject._r_logic) || (this._frbtr)) && (e)) {
        for (var c = 0; c < a.parentObject.childsCount; c++) { this._setSubChecked(0, a.parentObject.childNodes[c]) }
    }
    if (a.unParsed) { this._setSubCheckedXML(e, a.unParsed) }
    if (a._r_logic || this._frbtr) { this._setSubChecked(e, a.childNodes[0]) } else {
        for (var c = 0; c < a.childsCount; c++) { this._setSubChecked(e, a.childNodes[c]) }
    }
    var g = a.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
    if (e) { a.checkstate = 1 } else { a.checkstate = 0 }
    if (a.dscheck) { a.checkstate = a.dscheck }
    this._setSrc(g, this.imPath + ((a.parentObject._r_logic || this._frbtr) ? this.radioArray : this.checkArray)[a.checkstate])
};
dhtmlXTreeObject.prototype.isItemChecked = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return
    }
    return a.checkstate
};
dhtmlXTreeObject.prototype.deleteChildItems = function (g) {
    var a = this._globalIdStorageFind(g);
    if (!a) {
        return
    }
    var c = a.childsCount;
    for (var e = 0; e < c; e++) { this._deleteNode(a.childNodes[0].id, a.childNodes[0]) }
};
dhtmlXTreeObject.prototype.deleteItem = function (e, a) {
    if ((!this._onrdlh) || (this._onrdlh(e))) {
        var c = this._deleteItem(e, a);
        if (c) { this._fixChildCountLabel(c) }
    }
    this.allTree.childNodes[0].border = "1";
    this.allTree.childNodes[0].border = "0"
};
dhtmlXTreeObject.prototype._deleteItem = function (l, c, h) {
    c = dhx4.s2b(c);
    var a = this._globalIdStorageFind(l);
    if (!a) {
        return
    }
    var e = this.getParentId(l);
    var g = a.parentObject;
    this._deleteNode(l, a, h);
    if (this._editCell && this._editCell.id == l) { this._editCell = null }
    this._correctPlus(g);
    this._correctLine(g);
    if ((c) && (e != this.rootId)) { this.selectItem(e, 1) }
    return g
};
dhtmlXTreeObject.prototype._globalIdStorageRecSub = function (a) {
    for (var c = 0; c < a.childsCount; c++) {
        this._globalIdStorageRecSub(a.childNodes[c]);
        this._globalIdStorageSub(a.childNodes[c].id)
    }
    this._globalIdStorageSub(a.id);
    var e = a;
    e.span = null;
    e.tr.nodem = null;
    e.tr = null;
    e.htmlNode = null
};
dhtmlXTreeObject.prototype.insertNewNext = function (n, s, r, e, l, h, g, c, a) {
    var m = this._globalIdStorageFind(n);
    if ((!m) || (!m.parentObject)) {
        return (0)
    }
    var o = this._attachChildNode(0, s, r, e, l, h, g, c, a, m);
    if ((!this.XMLloadingWarning) && (this.childCalc)) { this._fixChildCountLabel(m.parentObject) }
    return o
};
dhtmlXTreeObject.prototype.getItemIdByIndex = function (e, a) {
    var c = this._globalIdStorageFind(e);
    if ((!c) || (a >= c.childsCount)) {
        return null
    }
    return c.childNodes[a].id
};
dhtmlXTreeObject.prototype.getChildItemIdByIndex = function (e, a) {
    var c = this._globalIdStorageFind(e);
    if ((!c) || (a >= c.childsCount)) {
        return null
    }
    return c.childNodes[a].id
};
dhtmlXTreeObject.prototype.setDragHandler = function (a) { this.attachEvent("onDrag", a) };
dhtmlXTreeObject.prototype._clearMove = function () {
    if (this._lastMark) {
        this._lastMark.className = this._lastMark.className.replace(/dragAndDropRow/g, "");
        this._lastMark = null
    }
    this.selectionBar.style.display = "none";
    this.allTree.className = this.allTree.className.replace(" selectionBox", "")
};
dhtmlXTreeObject.prototype.enableDragAndDrop = function (c, a) {
    if (c == "temporary_disabled") {
        this.dADTempOff = false;
        c = true
    } else { this.dADTempOff = true }
    this.dragAndDropOff = dhx4.s2b(c);
    if (this.dragAndDropOff) { this.dragger.addDragLanding(this.allTree, this) }
    if (arguments.length > 1) { this._ddronr = (!dhx4.s2b(a)) }
};
dhtmlXTreeObject.prototype._setMove = function (h, e, m) {
    if (h.parentObject.span) {
        var g = dhx4.absTop(h);
        var c = dhx4.absTop(this.allTree) - this.allTree.scrollTop;
        this.dadmodec = this.dadmode;
        this.dadmodefix = 0;
        if (this.dadmode == 2) {
            var l = m - g + (document.body.scrollTop || document.documentElement.scrollTop) - 2 - h.offsetHeight / 2;
            if ((Math.abs(l) - h.offsetHeight / 6) > 0) {
                this.dadmodec = 1;
                if (l < 0) { this.dadmodefix = 0 - h.offsetHeight }
            } else { this.dadmodec = 0 }
        }
        if (this.dadmodec == 0) {
            var a = h.parentObject.span;
            a.className += " dragAndDropRow";
            this._lastMark = a
        } else {
            this._clearMove();
            this.selectionBar.style.top = (g - c + ((parseInt(h.parentObject.span.parentNode.parentNode.offsetHeight) || 18) - 1) + this.dadmodefix) + "px";
            this.selectionBar.style.left = "5px";
            if (this.allTree.offsetWidth > 20) { this.selectionBar.style.width = (this.allTree.offsetWidth - (_isFF ? 30 : 25)) + "px" }
            this.selectionBar.style.display = ""
        }
        this._autoScroll(null, g, c)
    }
};
dhtmlXTreeObject.prototype._autoScroll = function (e, c, a) {
    if (this.autoScroll) {
        if (e) {
            c = dhx4.absTop(e);
            a = dhx4.absTop(this.allTree) - this.allTree.scrollTop
        }
        if ((c - a - parseInt(this.allTree.scrollTop)) > (parseInt(this.allTree.offsetHeight) - 50)) { this.allTree.scrollTop = parseInt(this.allTree.scrollTop) + 20 }
        if ((c - a) < (parseInt(this.allTree.scrollTop) + 30)) { this.allTree.scrollTop = parseInt(this.allTree.scrollTop) - 20 }
    }
};
dhtmlXTreeObject.prototype._createDragNode = function (l, h) {
    if (!this.dADTempOff) {
        return null
    }
    var g = l.parentObject;
    if (!this.callEvent("onBeforeDrag", [g.id, h])) {
        return null
    }
    if (!g.i_sel) { this._selectItem(g, h) }
    this._checkMSelectionLogic();
    var c = document.createElement("div");
    var m = new Array();
    if (this._itim_dg) {
        for (var a = 0; a < this._selected.length; a++) { m[a] = "<table cellspacing='0' cellpadding='0'><tr><td><img width='18px' height='18px' src='" + this._getSrc(this._selected[a].span.parentNode.previousSibling.childNodes[0]) + "'></td><td>" + this._selected[a].span.innerHTML + "</td></tr></table>" }
    } else { m = this.getSelectedItemText().split(this.dlmtr) }
    c.innerHTML = m.join("");
    c.style.position = "absolute";
    c.className = "dragSpanDiv";
    this._dragged = (new Array()).concat(this._selected);
    return c
};
dhtmlXTreeObject.prototype._focusNode = function (a) {
    var c = dhx4.absTop(a.htmlNode) - dhx4.absTop(this.allTree);
    if ((c > (this.allTree.offsetHeight - 30)) || (c < 0)) { this.allTree.scrollTop = c + this.allTree.scrollTop }
};
dhtmlXTreeObject.prototype._preventNsDrag = function (a) {
    if ((a) && (a.preventDefault)) {
        a.preventDefault();
        return false
    }
    return false
};
dhtmlXTreeObject.prototype._drag = function (m, n, a) {
    if (this._autoOpenTimer) { clearTimeout(this._autoOpenTimer) }
    if (!a.parentObject) {
        a = this.htmlNode.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
        this.dadmodec = 0
    }
    this._clearMove();
    var l = m.parentObject.treeNod;
    if ((l) && (l._clearMove)) { l._clearMove("") }
    if ((!this.dragMove) || (this.dragMove())) {
        if ((!l) || (!l._clearMove) || (!l._dragged)) {
            var g = new Array(m.parentObject)
        } else {
            var g = l._dragged
        }
        var c = a.parentObject;
        for (var h = 0; h < g.length; h++) {
            var e = this._moveNode(g[h], c);
            if ((this.dadmodec) && (e !== false)) { c = this._globalIdStorageFind(e, true, true) }
            if ((e) && (!this._sADnD)) { this.selectItem(e, 0, 1) }
        }
    }
    if (l) { l._dragged = new Array() }
};
dhtmlXTreeObject.prototype._dragIn = function (g, c, l, h) {
    if (!this.dADTempOff) {
        return 0
    }
    var m = c.parentObject;
    var a = g.parentObject;
    if ((!a) && (this._ddronr)) {
        return
    }
    if (!this.callEvent("onDragIn", [m.id, a ? a.id : null, m.treeNod, this])) {
        if (a) { this._autoScroll(g) }
        return 0
    }
    if (!a) { this.allTree.className += " selectionBox" } else {
        if (m.childNodes == null) {
            this._setMove(g, l, h);
            return g
        }
        var o = m.treeNod;
        for (var e = 0; e < o._dragged.length; e++) {
            if (this._checkPNodes(a, o._dragged[e])) {
                this._autoScroll(g);
                return 0
            }
        }
        this.selectionBar.parentNode.removeChild(this.selectionBar);
        a.span.parentNode.appendChild(this.selectionBar);
        this._setMove(g, l, h);
        if (this._getOpenState(a) <= 0) {
            var n = this;
            this._autoOpenId = a.id;
            this._autoOpenTimer = window.setTimeout(function () {
                n._autoOpenItem(null, n);
                n = null
            }, 1000)
        }
    }
    return g
};
dhtmlXTreeObject.prototype._autoOpenItem = function (c, a) { a.openItem(a._autoOpenId) };
dhtmlXTreeObject.prototype._dragOut = function (a) {
    this._clearMove();
    if (this._autoOpenTimer) { clearTimeout(this._autoOpenTimer) }
};
dhtmlXTreeObject.prototype._getNextNode = function (a, c) {
    if ((!c) && (a.childsCount)) {
        return a.childNodes[0]
    }
    if (a == this.htmlNode) {
        return -1
    }
    if ((a.tr) && (a.tr.nextSibling) && (a.tr.nextSibling.nodem)) {
        return a.tr.nextSibling.nodem
    }
    return this._getNextNode(a.parentObject, true)
};
dhtmlXTreeObject.prototype._lastChild = function (a) {
    if (a.childsCount) {
        return this._lastChild(a.childNodes[a.childsCount - 1])
    } else {
        return a
    }
};
dhtmlXTreeObject.prototype._getPrevNode = function (a, c) {
    if ((a.tr) && (a.tr.previousSibling) && (a.tr.previousSibling.nodem)) {
        return this._lastChild(a.tr.previousSibling.nodem)
    }
    if (a.parentObject) {
        return a.parentObject
    } else {
        return -1
    }
};
dhtmlXTreeObject.prototype.findItem = function (a, e, c) {
    var g = this._findNodeByLabel(a, e, (c ? this.htmlNode : null));
    if (g) {
        this.selectItem(g.id, true);
        this._focusNode(g);
        return g.id
    } else {
        return null
    }
};
dhtmlXTreeObject.prototype.findItemIdByLabel = function (a, e, c) {
    var g = this._findNodeByLabel(a, e, (c ? this.htmlNode : null));
    if (g) {
        return g.id
    } else {
        return null
    }
};
dhtmlXTreeObject.prototype.findStrInXML = function (c, e, h) {
    if (!c.childNodes && c.item) {
        return this.findStrInJSON(c, e, h)
    }
    if (!c.childNodes) {
        return false
    }
    for (var a = 0; a < c.childNodes.length; a++) {
        if (c.childNodes[a].nodeType == 1) {
            var g = c.childNodes[a].getAttribute(e);
            if (!g && c.childNodes[a].tagName == "itemtext") { g = c.childNodes[a].firstChild.data }
            if ((g) && (g.toLowerCase().search(h) != -1)) {
                return true
            }
            if (this.findStrInXML(c.childNodes[a], e, h)) {
                return true
            }
        }
    }
    return false
};
dhtmlXTreeObject.prototype.findStrInJSON = function (c, e, h) {
    for (var a = 0; a < c.item.length; a++) {
        var g = c.item[a].text;
        if ((g) && (g.toLowerCase().search(h) != -1)) {
            return true
        }
        if (c.item[a].item && this.findStrInJSON(c.item[a], e, h)) {
            return true
        }
    }
    return false
};
dhtmlXTreeObject.prototype._findNodeByLabel = function (a, h, g) {
    var a = a.replace(new RegExp("^( )+"), "").replace(new RegExp("( )+$"), "");
    a = new RegExp(a.replace(/([\^\.\?\*\+\\\[\]\(\)]{1})/gi, "\\$1").replace(/ /gi, ".*"), "gi");
    if (!g) {
        g = this._selected[0];
        if (!g) { g = this.htmlNode }
    }
    var c = g;
    if (!h) {
        if ((g.unParsed) && (this.findStrInXML(g.unParsed.d, "text", a))) { this.reParse(g) }
        g = this._getNextNode(c);
        if (g == -1) { g = this.htmlNode.childNodes[0] }
    } else {
        var e = this._getPrevNode(c);
        if (e == -1) { e = this._lastChild(this.htmlNode) }
        if ((e.unParsed) && (this.findStrInXML(e.unParsed.d, "text", a))) {
            this.reParse(e);
            g = this._getPrevNode(c)
        } else { g = e }
        if (g == -1) { g = this._lastChild(this.htmlNode) }
    }
    while ((g) && (g != c)) {
        if ((g.label) && (g.label.search(a) != -1)) {
            return (g)
        }
        if (!h) {
            if (g == -1) {
                if (c == this.htmlNode) {
                    break
                }
                g = this.htmlNode.childNodes[0]
            }
            if ((g.unParsed) && (this.findStrInXML(g.unParsed.d, "text", a))) { this.reParse(g) }
            g = this._getNextNode(g);
            if (g == -1) { g = this.htmlNode }
        } else {
            var e = this._getPrevNode(g);
            if (e == -1) { e = this._lastChild(this.htmlNode) }
            if ((e.unParsed) && (this.findStrInXML(e.unParsed.d, "text", a))) {
                this.reParse(e);
                g = this._getPrevNode(g)
            } else { g = e }
            if (g == -1) { g = this._lastChild(this.htmlNode) }
        }
    }
    return null
};
dhtmlXTreeObject.prototype.moveItem = function (n, c, o, a) {
    var h = this._globalIdStorageFind(n);
    if (!h) {
        return (0)
    }
    var l = null;
    switch (c) {
        case "right":
            alert("Not supported yet");
            break;
        case "item_child":
            var e = (a || this)._globalIdStorageFind(o);
            if (!e) {
                return (0)
            }
            l = (a || this)._moveNodeTo(h, e, 0);
            break;
        case "item_sibling":
            var e = (a || this)._globalIdStorageFind(o);
            if (!e) {
                return (0)
            }
            l = (a || this)._moveNodeTo(h, e.parentObject, e);
            break;
        case "item_sibling_next":
            var e = (a || this)._globalIdStorageFind(o);
            if (!e) {
                return (0)
            }
            if ((e.tr) && (e.tr.nextSibling) && (e.tr.nextSibling.nodem)) { l = (a || this)._moveNodeTo(h, e.parentObject, e.tr.nextSibling.nodem) } else { l = (a || this)._moveNodeTo(h, e.parentObject) }
            break;
        case "left":
            if (h.parentObject.parentObject) { l = this._moveNodeTo(h, h.parentObject.parentObject, h.parentObject) }
            break;
        case "up":
            var m = this._getPrevNode(h);
            if ((m == -1) || (!m.parentObject)) {
                return null
            }
            l = this._moveNodeTo(h, m.parentObject, m);
            break;
        case "up_strict":
            var m = this._getIndex(h);
            if (m != 0) { l = this._moveNodeTo(h, h.parentObject, h.parentObject.childNodes[m - 1]) }
            break;
        case "down_strict":
            var m = this._getIndex(h);
            var g = h.parentObject.childsCount - 2;
            if (m == g) { l = this._moveNodeTo(h, h.parentObject) } else {
                if (m < g) { l = this._moveNodeTo(h, h.parentObject, h.parentObject.childNodes[m + 2]) }
            }
            break;
        case "down":
            var m = this._getNextNode(this._lastChild(h));
            if ((m == -1) || (!m.parentObject)) {
                return
            }
            if (m.parentObject == h.parentObject) {
                var m = this._getNextNode(m)
            }
            if (m == -1) { l = this._moveNodeTo(h, h.parentObject) } else {
                if ((m == -1) || (!m.parentObject)) {
                    return
                }
                l = this._moveNodeTo(h, m.parentObject, m)
            }
            break
    }
    if (_isIE && _isIE < 8) {
        this.allTree.childNodes[0].border = "1";
        this.allTree.childNodes[0].border = "0"
    }
    return l
};
dhtmlXTreeObject.prototype.setDragBehavior = function (c, a) {
    this._sADnD = (!dhx4.s2b(a));
    switch (c) {
        case "child":
            this.dadmode = 0;
            break;
        case "sibling":
            this.dadmode = 1;
            break;
        case "complex":
            this.dadmode = 2;
            break
    }
};
dhtmlXTreeObject.prototype._loadDynXML = function (e, c) {
    c = c || this.XMLsource;
    var a = (new Date()).valueOf();
    this._ld_id = e;
    if (this.xmlalb == "function") {
        if (c) { c(this._escape(e)) }
    } else {
        if (this.xmlalb == "name") { this.load(c + this._escape(e)) } else {
            if (this.xmlalb == "xmlname") { this.load(c + this._escape(e) + ".xml?uid=" + a) } else { this.load(c + dhtmlx.url(c) + "uid=" + a + "&id=" + this._escape(e)) }
        }
    }
};
dhtmlXTreeObject.prototype.enableMultiselection = function (c, a) {
    this._amsel = dhx4.s2b(c);
    this._amselS = dhx4.s2b(a)
};
dhtmlXTreeObject.prototype._checkMSelectionLogic = function () {
    var e = new Array();
    for (var c = 0; c < this._selected.length; c++) {
        for (var a = 0; a < this._selected.length; a++) {
            if ((c != a) && (this._checkPNodes(this._selected[a], this._selected[c]))) { e[e.length] = this._selected[a] }
        }
    }
    for (var c = 0; c < e.length; c++) { this._unselectItem(e[c]) }
};
dhtmlXTreeObject.prototype._checkPNodes = function (c, a) {
    if (this._dcheckf) {
        return false
    }
    if (a == c) {
        return 1
    }
    if (c.parentObject) {
        return this._checkPNodes(c.parentObject, a)
    } else {
        return 0
    }
};
dhtmlXTreeObject.prototype.disableDropCheck = function (a) { this._dcheckf = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.enableDistributedParsing = function (e, c, a) {
    this._edsbps = dhx4.s2b(e);
    this._edsbpsA = new Array();
    this._edsbpsC = c || 10;
    this._edsbpsD = a || 250
};
dhtmlXTreeObject.prototype.getDistributedParsingState = function () {
    return (!((!this._edsbpsA) || (!this._edsbpsA.length)))
};
dhtmlXTreeObject.prototype.getItemParsingState = function (e) {
    var c = this._globalIdStorageFind(e, true, true);
    if (!c) {
        return 0
    }
    if (this._edsbpsA) {
        for (var a = 0; a < this._edsbpsA.length; a++) {
            if (this._edsbpsA[a][2] == e) {
                return -1
            }
        }
    }
    return 1
};
dhtmlXTreeObject.prototype._distributedStart = function (c, h, g, e, a) {
    if (!this._edsbpsA) { this._edsbpsA = new Array() }
    this._edsbpsA[this._edsbpsA.length] = [c, h, g, e, a]
};
dhtmlXTreeObject.prototype._distributedStep = function (g) {
    var c = this;
    if ((!this._edsbpsA) || (!this._edsbpsA.length)) {
        c.XMLloadingWarning = 0;
        return
    }
    var h = this._edsbpsA[0];
    this.parsedArray = new Array();
    this._parse(h[0], h[2], h[3], h[1]);
    var a = this._globalIdStorageFind(h[2]);
    this._redrawFrom(this, a, h[4], this._getOpenState(a));
    var e = this.setCheckList.split(this.dlmtr);
    for (var l = 0; l < e.length; l++) {
        if (e[l]) { this.setCheck(e[l], 1) }
    }
    this._edsbpsA = (new Array()).concat(this._edsbpsA.slice(1));
    if ((!this._edsbpsA.length)) {
        window.setTimeout(function () {
            if (c.onXLE) { c.onXLE(c, g) }
            c.callEvent("onXLE", [c, g])
        }, 1);
        c.xmlstate = 0
    }
};
dhtmlXTreeObject.prototype.enableTextSigns = function (a) { this._txtimg = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.preventIECaching = function (a) { dhx4.ajax.cache = !a };
dhtmlXTreeObject.prototype.preventIECashing = dhtmlXTreeObject.prototype.preventIECaching;
dhtmlXTreeObject.prototype.disableCheckbox = function (e, c) {
    if (typeof (e) != "object") {
        var a = this._globalIdStorageFind(e, 0, 1)
    } else {
        var a = e
    }
    if (!a) {
        return
    }
    a.dscheck = dhx4.s2b(c) ? (((a.checkstate || 0) % 3) + 3) : ((a.checkstate > 2) ? (a.checkstate - 3) : a.checkstate);
    this._setCheck(a);
    if (a.dscheck < 3) { a.dscheck = false }
};
dhtmlXTreeObject.prototype.smartRefreshBranch = function (c, a) {
    this._branchUpdate = 1;
    this.smartRefreshItem(c, a)
};
dhtmlXTreeObject.prototype.smartRefreshItem = function (g, e) {
    var a = this._globalIdStorageFind(g);
    for (var c = 0; c < a.childsCount; c++) { a.childNodes[c]._dmark = true }
    this.waitUpdateXML = true;
    if (e && e.exists) { this._parse(e, g) } else { this._loadDynXML(g, e) }
};
dhtmlXTreeObject.prototype.refreshItems = function (c, e) {
    var g = c.toString().split(this.dlmtr);
    this.waitUpdateXML = new Array();
    for (var a = 0; a < g.length; a++) { this.waitUpdateXML[g[a]] = true }
    this.load((e || this.XMLsource) + dhtmlx.url(e || this.XMLsource) + "ids=" + this._escape(c))
};
dhtmlXTreeObject.prototype.updateItem = function (m, l, g, e, c, h, n) {
    var a = this._globalIdStorageFind(m);
    a.userData = new cObject();
    if (l) { a.label = l }
    a.images = new Array(g || this.imageArray[0], e || this.imageArray[1], c || this.imageArray[2]);
    this.setItemText(m, l);
    if (h) { this._setCheck(a, true) }
    if (n == "1" && !this.hasChildren(m)) { a.XMLload = 0 }
    this._correctPlus(a);
    a._dmark = false;
    return a
};
dhtmlXTreeObject.prototype.setDropHandler = function (a) { this.attachEvent("onDrop", a) };
dhtmlXTreeObject.prototype.setOnLoadingStart = function (a) { this.attachEvent("onXLS", a) };
dhtmlXTreeObject.prototype.setOnLoadingEnd = function (a) { this.attachEvent("onXLE", a) };
dhtmlXTreeObject.prototype.setXMLAutoLoadingBehaviour = function (a) { this.xmlalb = a };
dhtmlXTreeObject.prototype.enableSmartCheckboxes = function (a) { this.smcheck = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.getXMLState = function () {
    return (this.xmlstate == 1)
};
dhtmlXTreeObject.prototype.setItemTopOffset = function (l, g) {
    var e;
    if (typeof (l) != "object") { e = this._globalIdStorageFind(l) } else { e = l }
    var h = e.span.parentNode.parentNode;
    e.span.style.paddingBottom = "1px";
    for (var c = 0; c < h.childNodes.length; c++) {
        if (c != 0) {
            if (_isIE) {
                h.childNodes[c].style.height = "18px";
                h.childNodes[c].style.paddingTop = parseInt(g) + "px"
            } else { h.childNodes[c].style.height = 18 + parseInt(g) + "px" }
        } else {
            var a = h.childNodes[c].firstChild;
            if (h.childNodes[c].firstChild.tagName != "DIV") {
                a = document.createElement("DIV");
                h.childNodes[c].insertBefore(a, h.childNodes[c].firstChild)
            }
            if ((e.parentObject.id != this.rootId || e.parentObject.childNodes[0] != e) && this.treeLinesOn) { h.childNodes[c].style.backgroundImage = "url(" + this.imPath + this.lineArray[5] + ")" }
            a.innerHTML = "&nbsp;";
            a.style.overflow = "hidden"
        }
        a.style.verticalAlign = h.childNodes[c].style.verticalAlign = "bottom";
        if (_isIE) {
            this.allTree.childNodes[0].border = "1";
            this.allTree.childNodes[0].border = "0"
        }
    }
};
dhtmlXTreeObject.prototype.setIconSize = function (g, c, h) {
    if (h) {
        if ((h) && (h.span)) {
            var a = h
        } else {
            var a = this._globalIdStorageFind(h)
        }
        if (!a) {
            return (0)
        }
        var e = a.span.parentNode.previousSibling.childNodes[0];
        if (g) {
            e.style.width = g + "px";
            if (window._KHTMLrv) { e.parentNode.style.width = g + "px" }
        }
        if (c) {
            e.style.height = c + "px";
            if (window._KHTMLrv) { e.parentNode.style.height = c + "px" }
        }
    } else {
        this.def_img_x = g + "px";
        this.def_img_y = c + "px"
    }
};
dhtmlXTreeObject.prototype.getItemImage = function (h, g, c) {
    var e = this._globalIdStorageFind(h);
    if (!e) {
        return ""
    }
    var a = e.images[g || 0];
    if (c) { a = this.iconURL + a }
    return a
};
dhtmlXTreeObject.prototype.enableRadioButtons = function (g, e) {
    if (arguments.length == 1) {
        this._frbtr = dhx4.s2b(g);
        this.checkBoxOff = this.checkBoxOff || this._frbtr;
        return
    }
    var c = this._globalIdStorageFind(g);
    if (!c) {
        return ""
    }
    e = dhx4.s2b(e);
    if ((e) && (!c._r_logic)) {
        c._r_logic = true;
        for (var a = 0; a < c.childsCount; a++) { this._setCheck(c.childNodes[a], c.childNodes[a].checkstate) }
    }
    if ((!e) && (c._r_logic)) {
        c._r_logic = false;
        for (var a = 0; a < c.childsCount; a++) { this._setCheck(c.childNodes[a], c.childNodes[a].checkstate) }
    }
};
dhtmlXTreeObject.prototype.enableSingleRadioMode = function (a) { this._frbtrs = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.openOnItemAdded = function (a) { this._hAdI = !dhx4.s2b(a) };
dhtmlXTreeObject.prototype.openOnItemAdding = function (a) { this._hAdI = !dhx4.s2b(a) };
dhtmlXTreeObject.prototype.enableMultiLineItems = function (a) {
    if (a === true) { this.mlitems = "100%" } else { this.mlitems = a }
};
dhtmlXTreeObject.prototype.enableAutoTooltips = function (a) { this.ettip = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.clearSelection = function (a) {
    if (a) { this._unselectItem(this._globalIdStorageFind(a)) } else { this._unselectItems() }
};
dhtmlXTreeObject.prototype.showItemSign = function (g, c) {
    var a = this._globalIdStorageFind(g);
    if (!a) {
        return 0
    }
    var e = a.span.parentNode.previousSibling.previousSibling.previousSibling;
    if (!dhx4.s2b(c)) {
        this._openItem(a);
        a.closeble = false;
        a.wsign = true
    } else {
        a.closeble = true;
        a.wsign = false
    }
    this._correctPlus(a)
};
dhtmlXTreeObject.prototype.showItemCheckbox = function (h, g) {
    if (!h) {
        for (var c in this._idpull) { this.showItemCheckbox(this._idpull[c], g) }
    }
    if (typeof (h) != "object") { h = this._globalIdStorageFind(h, 0, 0) }
    if (!h) {
        return 0
    }
    h.nocheckbox = !dhx4.s2b(g);
    var e = h.span.parentNode.previousSibling.previousSibling.childNodes[0];
    e.parentNode.style.display = (!h.nocheckbox) ? "" : "none"
};
dhtmlXTreeObject.prototype.setListDelimeter = function (a) { this.dlmtr = a };
dhtmlXTreeObject.prototype.setEscapingMode = function (a) { this.utfesc = a };
dhtmlXTreeObject.prototype.enableHighlighting = function (a) {
    this.ehlt = true;
    this.ehlta = dhx4.s2b(a)
};
dhtmlXTreeObject.prototype._itemMouseOut = function () {
    var c = this.childNodes[3].parentObject;
    var a = c.treeNod;
    a.callEvent("onMouseOut", [c.id]);
    if (c.id == a._l_onMSI) { a._l_onMSI = null }
    if (!a.ehlta) {
        return
    }
    c.span.className = c.span.className.replace("_lor", "")
};
dhtmlXTreeObject.prototype._itemMouseIn = function () {
    var c = this.childNodes[3].parentObject;
    var a = c.treeNod;
    if (a._l_onMSI != c.id) { a.callEvent("onMouseIn", [c.id]) }
    a._l_onMSI = c.id;
    if (!a.ehlta) {
        return
    }
    c.span.className = c.span.className.replace("_lor", "");
    c.span.className = c.span.className.replace(/((standart|selected)TreeRow)/, "$1_lor")
};
dhtmlXTreeObject.prototype.enableActiveImages = function (a) { this._aimgs = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.focusItem = function (c) {
    var a = this._globalIdStorageFind(c);
    if (!a) {
        return (0)
    }
    this._focusNode(a)
};
dhtmlXTreeObject.prototype.getAllSubItems = function (a) {
    return this._getAllSubItems(a)
};
dhtmlXTreeObject.prototype.getAllChildless = function () {
    return this._getAllScraggyItems(this.htmlNode)
};
dhtmlXTreeObject.prototype.getAllLeafs = dhtmlXTreeObject.prototype.getAllChildless;
dhtmlXTreeObject.prototype._getAllScraggyItems = function (e) {
    var g = "";
    for (var c = 0; c < e.childsCount; c++) {
        if ((e.childNodes[c].unParsed) || (e.childNodes[c].childsCount > 0)) {
            if (e.childNodes[c].unParsed) {
                var a = this._getAllScraggyItemsXML(e.childNodes[c].unParsed, 1)
            } else {
                var a = this._getAllScraggyItems(e.childNodes[c])
            }
            if (a) {
                if (g) { g += this.dlmtr + a } else { g = a }
            }
        } else {
            if (!g) { g = "" + e.childNodes[c].id } else { g += this.dlmtr + e.childNodes[c].id }
        }
    }
    return g
};
dhtmlXTreeObject.prototype._getAllFatItems = function (e) {
    var g = "";
    for (var c = 0; c < e.childsCount; c++) {
        if ((e.childNodes[c].unParsed) || (e.childNodes[c].childsCount > 0)) {
            if (!g) { g = "" + e.childNodes[c].id } else { g += this.dlmtr + e.childNodes[c].id }
            if (e.childNodes[c].unParsed) {
                var a = this._getAllFatItemsXML(e.childNodes[c].unParsed, 1)
            } else {
                var a = this._getAllFatItems(e.childNodes[c])
            }
            if (a) { g += this.dlmtr + a }
        }
    }
    return g
};
dhtmlXTreeObject.prototype.getAllItemsWithKids = function () {
    return this._getAllFatItems(this.htmlNode)
};
dhtmlXTreeObject.prototype.getAllFatItems = dhtmlXTreeObject.prototype.getAllItemsWithKids;
dhtmlXTreeObject.prototype.getAllChecked = function () {
    return this._getAllChecked("", "", 1)
};
dhtmlXTreeObject.prototype.getAllUnchecked = function (a) {
    if (a) { a = this._globalIdStorageFind(a) }
    return this._getAllChecked(a, "", 0)
};
dhtmlXTreeObject.prototype.getAllPartiallyChecked = function () {
    return this._getAllChecked("", "", 2)
};
dhtmlXTreeObject.prototype.getAllCheckedBranches = function () {
    var a = [this._getAllChecked("", "", 1)];
    var c = this._getAllChecked("", "", 2);
    if (c) { a.push(c) }
    return a.join(this.dlmtr)
};
dhtmlXTreeObject.prototype._getAllChecked = function (g, e, h) {
    if (!g) { g = this.htmlNode }
    if (g.checkstate == h) {
        if (!g.nocheckbox) {
            if (e) { e += this.dlmtr + g.id } else { e = "" + g.id }
        }
    }
    var a = g.childsCount;
    for (var c = 0; c < a; c++) { e = this._getAllChecked(g.childNodes[c], e, h) }
    if (g.unParsed) { e = this._getAllCheckedXML(g.unParsed, e, h) }
    if (e) {
        return e
    } else {
        return ""
    }
};
dhtmlXTreeObject.prototype.setItemStyle = function (g, e, c) {
    var c = c || false;
    var a = this._globalIdStorageFind(g);
    if (!a) {
        return 0
    }
    if (!a.span.style.cssText) { a.span.setAttribute("style", a.span.getAttribute("style") + "; " + e) } else { a.span.style.cssText = c ? e : a.span.style.cssText + ";" + e }
};
dhtmlXTreeObject.prototype.enableImageDrag = function (a) { this._itim_dg = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.setOnDragIn = function (a) { this.attachEvent("onDragIn", a) };
dhtmlXTreeObject.prototype.enableDragAndDropScrolling = function (a) { this.autoScroll = dhx4.s2b(a) };
dhtmlXTreeObject.prototype.setSkin = function (a) {
    var c = this.parentObject.className.replace(/dhxtree_[^ ]*/gi, "");
    this.parentObject.className = c + " dhxtree_" + a;
    if (a == "dhx_terrace" || a == "dhx_web" || a == "material") { this.enableTreeLines(false) }
    if (a == "material") { this.setIconSize("25", "25") }
};
(function () {
    dhtmlx.extend_api("dhtmlXTreeObject", {
        _init: function (a) {
            return [a.parent, (a.width || "100%"), (a.height || "100%"), (a.root_id || 0)]
        }, auto_save_selection: "enableAutoSavingSelected", auto_tooltip: "enableAutoTooltips", checkbox: "enableCheckBoxes", checkbox_3_state: "enableThreeStateCheckboxes", checkbox_smart: "enableSmartCheckboxes", context_menu: "enableContextMenu", distributed_parsing: "enableDistributedParsing", drag: "enableDragAndDrop", drag_copy: "enableMercyDrag", drag_image: "enableImageDrag", drag_scroll: "enableDragAndDropScrolling", editor: "enableItemEditor", hover: "enableHighlighting", images: "enableTreeImages", image_fix: "enableIEImageFix", image_path: "setImagePath", lines: "enableTreeLines", loading_item: "enableLoadingItem", multiline: "enableMultiLineItems", multiselect: "enableMultiselection", navigation: "enableKeyboardNavigation", radio: "enableRadioButtons", radio_single: "enableSingleRadioMode", rtl: "enableRTL", search: "enableKeySearch", smart_parsing: "enableSmartXMLParsing", smart_rendering: "enableSmartRendering", text_icons: "enableTextSigns", xml: "loadXML", skin: "setSkin"
    }, {})
})();
dhtmlXTreeObject.prototype._dp_init = function (a) {
    a.attachEvent("insertCallback", function (g, l, c) {
        var e = dhx4.ajax.xpath(".//item", g);
        var h = e[0].getAttribute("text");
        this.obj.insertNewItem(c, l, h, 0, 0, 0, 0, "CHILD")
    });
    a.attachEvent("updateCallback", function (g, l, c) {
        var e = dhx4.ajax.xpath(".//item", g);
        var h = e[0].getAttribute("text");
        this.obj.setItemText(l, h);
        if (this.obj.getParentId(l) != c) { this.obj.moveItem(l, "item_child", c) }
        this.setUpdated(l, true, "updated")
    });
    a.attachEvent("deleteCallback", function (e, g, c) {
        this.obj.setUserData(g, this.action_param, "true_deleted");
        this.obj.deleteItem(g, false)
    });
    a._methods = ["setItemStyle", "", "changeItemId", "deleteItem"];
    this.attachEvent("onEdit", function (c, e) {
        if (c == 3) { a.setUpdated(e, true) }
        return true
    });
    this.attachEvent("onDrop", function (l, h, g, e, c) {
        if (e == c) { a.setUpdated(l, true) }
    });
    this._onrdlh = function (c) {
        var e = a.getState(c);
        if (e == "inserted") {
            a.set_invalid(c, false);
            a.setUpdated(c, false);
            return true
        }
        if (e == "true_deleted") {
            a.setUpdated(c, false);
            return true
        }
        a.setUpdated(c, true, "deleted");
        return false
    };
    this._onradh = function (c) { a.setUpdated(c, true, "inserted") };
    a._getRowData = function (h) {
        var g = {};
        var l = this.obj._globalIdStorageFind(h);
        var e = l.parentObject;
        var c = 0;
        for (c = 0; c < e.childsCount; c++) {
            if (e.childNodes[c] == l) {
                break
            }
        }
        g.tr_id = l.id;
        g.tr_pid = e.id;
        g.tr_order = c;
        g.tr_text = l.span.innerHTML;
        e = (l._userdatalist || "").split(",");
        for (c = 0; c < e.length; c++) { g[e[c]] = l.userData["t_" + e[c]] }
        return g
    }
};
if (typeof (window.dhtmlXCellObject) != "undefined") {
    dhtmlXCellObject.prototype.attachTree = function (a) {
        this.callEvent("_onBeforeContentAttach", ["tree"]);
        var c = document.createElement("DIV");
        c.style.width = "100%";
        c.style.height = "100%";
        c.style.position = "relative";
        c.style.overflow = "hidden";
        this._attachObject(c);
        this.dataType = "tree";
        this.dataObj = new dhtmlXTreeObject(c, "100%", "100%", (a || 0));
        this.dataObj.setSkin(this.conf.skin);
        this.dataObj.allTree.childNodes[0].style.marginTop = "2px";
        this.dataObj.allTree.childNodes[0].style.marginBottom = "2px";
        c = null;
        this.callEvent("_onContentAttach", []);
        return this.dataObj
    }
}
dhtmlXTreeObject.prototype.makeDraggable = function (c, a) {
    if (typeof (c) != "object") { c = document.getElementById(c) }
    dragger = new dhtmlDragAndDropObject();
    dropper = new dhx_dragSomethingInTree();
    dragger.addDraggableItem(c, dropper);
    c.dragLanding = null;
    c.ondragstart = dropper._preventNsDrag;
    c.onselectstart = new Function("return false;");
    c.parentObject = new Object;
    c.parentObject.img = c;
    c.parentObject.treeNod = dropper;
    dropper._customDrop = a
};
dhtmlXTreeObject.prototype.makeDragable = dhtmlXTreeObject.prototype.makeDraggable;
dhtmlXTreeObject.prototype.makeAllDraggable = function (c) {
    var e = document.getElementsByTagName("div");
    for (var a = 0; a < e.length; a++) {
        if (e[a].getAttribute("dragInDhtmlXTree")) { this.makeDragable(e[a], c) }
    }
};

function dhx_dragSomethingInTree() {
    this.lWin = window;
    this._createDragNode = function (c) {
        var a = document.createElement("div");
        a.style.position = "absolute";
        a.innerHTML = (c.innerHTML || c.value);
        a.className = "dragSpanDiv";
        return a
    };
    this._preventNsDrag = function (a) {
        (a || window.event).cancelBubble = true;
        if ((a) && (a.preventDefault)) {
            a.preventDefault();
            return false
        }
        return false
    };
    this._nonTrivialNode = function (c, e, a, g) {
        if (this._customDrop) {
            return this._customDrop(c, g.img.id, e.id, a ? a.id : null)
        }
        var h = (g.img.getAttribute("image") || "");
        var m = g.img.id || "new";
        var l = (g.img.getAttribute("text") || (_isIE ? g.img.innerText : g.img.textContent));
        c[a ? "insertNewNext" : "insertNewItem"](a ? a.id : e.id, m, l, "", h, h, h)
    }
}
dhtmlXTreeObject.prototype.enableItemEditor = function (a) {
    this._eItEd = dhx4.s2b(a);
    if (!this._eItEdFlag) {
        this._edn_click_IE = true;
        this._edn_dblclick = true;
        this._ie_aFunc = this.aFunc;
        this._ie_dblclickFuncHandler = this.dblclickFuncHandler;
        this.setOnDblClickHandler(function (e, c) {
            if (this._edn_dblclick) { this._editItem(e, c) }
            return true
        });
        this.setOnClickHandler(function (e, c) {
            this._stopEditItem(e, c);
            if ((this.ed_hist_clcik == e) && (this._edn_click_IE)) { this._editItem(e, c) }
            this.ed_hist_clcik = e;
            return true
        });
        this._eItEdFlag = true
    }
};
dhtmlXTreeObject.prototype.setOnEditHandler = function (a) { this.attachEvent("onEdit", a) };
dhtmlXTreeObject.prototype.setEditStartAction = function (a, c) {
    this._edn_click_IE = dhx4.s2b(a);
    this._edn_dblclick = dhx4.s2b(c)
};
dhtmlXTreeObject.prototype._stopEdit = function (c, l) {
    if (this._editCell) {
        this.dADTempOff = this.dADTempOffEd;
        if (this._editCell.id != c) {
            var g = true;
            if (!l) { g = this.callEvent("onEdit", [2, this._editCell.id, this, this._editCell.span.childNodes[0].value]) } else {
                g = false;
                this.callEvent("onEditCancel", [this._editCell.id, this._editCell._oldValue])
            }
            if (g === true) { g = this._editCell.span.childNodes[0].value } else {
                if (g === false) { g = this._editCell._oldValue }
            }
            var h = (g != this._editCell._oldValue);
            this._editCell.span.innerHTML = g;
            this._editCell.label = this._editCell.span.innerHTML;
            var e = this._editCell.i_sel ? "selectedTreeRow" : "standartTreeRow";
            this._editCell.span.className = e;
            this._editCell.span.parentNode.className = "standartTreeRow";
            this._editCell.span.style.paddingRight = this._editCell.span.style.paddingLeft = "5px";
            this._editCell.span.onclick = this._editCell.span.ondblclick = function () { };
            var m = this._editCell.id;
            if (this.childCalc) { this._fixChildCountLabel(this._editCell) }
            this._editCell = null;
            if (!l) { this.callEvent("onEdit", [3, m, this, h]) }
            if (this._enblkbrd) {
                this.parentObject.lastChild.focus();
                this.parentObject.lastChild.focus()
            }
        }
    }
};
dhtmlXTreeObject.prototype._stopEditItem = function (c, a) { this._stopEdit(c) };
dhtmlXTreeObject.prototype.stopEdit = function (a) {
    if (this._editCell) { this._stopEdit(this._editCell.id + "_non", a) }
};
dhtmlXTreeObject.prototype.editItem = function (a) { this._editItem(a, this) };
dhtmlXTreeObject.prototype._editItem = function (h, a) {
    if (this._eItEd) {
        this._stopEdit();
        var e = this._globalIdStorageFind(h);
        if (!e) {
            return
        }
        var g = this.callEvent("onEdit", [0, h, this, e.span.innerHTML]);
        if (g === true) { g = (typeof e.span.innerText != "undefined" ? e.span.innerText : e.span.textContent) } else {
            if (g === false) {
                return
            }
        }
        this.dADTempOffEd = this.dADTempOff;
        this.dADTempOff = false;
        this._editCell = e;
        e._oldValue = g;
        e.span.innerHTML = "<input type='text' class='intreeeditRow' />";
        e.span.style.paddingRight = e.span.style.paddingLeft = "0px";
        e.span.onclick = e.span.ondblclick = function (l) {
            (l || event).cancelBubble = true
        };
        e.span.childNodes[0].value = g;
        e.span.childNodes[0].onselectstart = function (l) {
            (l || event).cancelBubble = true;
            return true
        };
        e.span.childNodes[0].onmousedown = function (l) {
            (l || event).cancelBubble = true;
            return true
        };
        e.span.childNodes[0].focus();
        e.span.childNodes[0].focus();
        e.span.onclick = function (l) {
            (l || event).cancelBubble = true;
            return false
        };
        e.span.className = "";
        e.span.parentNode.className = "";
        var c = this;
        e.span.childNodes[0].onkeydown = function (l) {
            if (!l) { l = window.event }
            if (l.keyCode == 13) {
                l.cancelBubble = true;
                c._stopEdit(window.undefined)
            } else {
                if (l.keyCode == 27) { c._stopEdit(window.undefined, true) }
            } (l || event).cancelBubble = true
        };
        this.callEvent("onEdit", [1, h, this])
    }
};

function jsonPointer(c, a) {
    this.d = c;
    this.dp = a
}
jsonPointer.prototype = {
    text: function () {
        var a = function (h) {
            var g = [];
            for (var e = 0; e < h.length; e++) { g.push("{" + c(h[e]) + "}") }
            return g.join(",")
        };
        var c = function (h) {
            var g = [];
            for (var e in h) {
                if (typeof (h[e]) == "object") {
                    if (e.length) { g.push('"' + e + '":[' + a(h[e]) + "]") } else { g.push('"' + e + '":{' + c(h[e]) + "}") }
                } else { g.push('"' + e + '":"' + h[e] + '"') }
            }
            return g.join(",")
        };
        return "{" + c(this.d) + "}"
    }, get: function (a) {
        return this.d[a]
    }, exists: function () {
        return !!this.d
    }, content: function () {
        return this.d.content
    }, each: function (g, m, l) {
        var e = this.d[g];
        var n = new jsonPointer();
        if (e) {
            for (var h = 0; h < e.length; h++) {
                n.d = e[h];
                m.apply(l, [n, h])
            }
        }
    }, get_all: function () {
        return this.d
    }, sub: function (a) {
        return new jsonPointer(this.d[a], this.d)
    }, sub_exists: function (a) {
        return !!this.d[a]
    }, each_x: function (g, n, m, l, h) {
        var e = this.d[g];
        var o = new jsonPointer(0, this.d);
        if (e) {
            for (h = h || 0; h < e.length; h++) {
                if (e[h][n]) {
                    o.d = e[h];
                    if (m.apply(l, [o, h]) == -1) {
                        return
                    }
                }
            }
        }
    }, up: function (a) {
        return new jsonPointer(this.dp, this.d)
    }, set: function (a, c) { this.d[a] = c }, clone: function (a) {
        return new jsonPointer(this.d, this.dp)
    }, through: function (e, m, r, h, s) {
        var n = this.d[e];
        if (n.length) {
            for (var g = 0; g < n.length; g++) {
                if (n[g][m] != null && n[g][m] != "" && (!r || n[g][m] == r)) {
                    var l = new jsonPointer(n[g], this.d);
                    h.apply(s, [l, g])
                }
                var o = this.d;
                this.d = n[g];
                if (this.sub_exists(e)) { this.through(e, m, r, h, s) }
                this.d = o
            }
        }
    }
};
dhtmlXTreeObject.prototype.loadJSArrayFile = function (a, c) {
    if (window.console && window.console.info) { window.console.info("loadJSArrayFile was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this._loadJSArrayFile(a, c)
};
dhtmlXTreeObject.prototype._loadJSArrayFile = function (file, callback) {
    if (!this.parsCount) { this.callEvent("onXLS", [this, this._ld_id]) }
    this._ld_id = null;
    this.xmlstate = 1;
    var that = this;
    this.XMLLoader = function (xml, callback) {
        eval("var z=" + xml.responseText);
        this._loadJSArray(z);
        if (callback) { callback.call(this, xml) }
    };
    dhx4.ajax.get(file, function (obj) { that.XMLLoader(obj.xmlDoc, callback) })
};
dhtmlXTreeObject.prototype.loadCSV = function (a, c) {
    if (window.console && window.console.info) { window.console.info("loadCSV was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this._loadCSV(a, c)
};
dhtmlXTreeObject.prototype._loadCSV = function (a, e) {
    if (!this.parsCount) { this.callEvent("onXLS", [this, this._ld_id]) }
    this._ld_id = null;
    this.xmlstate = 1;
    var c = this;
    this.XMLLoader = function (g, h) {
        this._loadCSVString(g.responseText);
        if (h) { h.call(this, g) }
    };
    dhx4.ajax.get(a, function (g) { c.XMLLoader(g.xmlDoc, e) })
};
dhtmlXTreeObject.prototype.loadJSArray = function (a, c) {
    if (window.console && window.console.info) { window.console.info("loadJSArray was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this._loadJSArray(a, c)
};
dhtmlXTreeObject.prototype._loadJSArray = function (a, g) {
    var l = [];
    for (var c = 0; c < a.length; c++) {
        if (!l[a[c][1]]) { l[a[c][1]] = [] }
        l[a[c][1]].push({ id: a[c][0], text: a[c][2] })
    }
    var h = { id: this.rootId };
    var e = function (o, n) {
        if (l[o.id]) {
            o.item = l[o.id];
            for (var m = 0; m < o.item.length; m++) { n(o.item[m], n) }
        }
    };
    e(h, e);
    this._loadJSONObject(h, g)
};
dhtmlXTreeObject.prototype.loadCSVString = function (a, c) {
    if (window.console && window.console.info) { window.console.info("loadCSVString was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this._loadCSVString(a, c)
};
dhtmlXTreeObject.prototype._loadCSVString = function (a, l) {
    var n = [];
    var c = a.split("\n");
    for (var g = 0; g < c.length; g++) {
        var e = c[g].split(",");
        if (!n[e[1]]) { n[e[1]] = [] }
        n[e[1]].push({ id: e[0], text: e[2] })
    }
    var m = { id: this.rootId };
    var h = function (s, r) {
        if (n[s.id]) {
            s.item = n[s.id];
            for (var o = 0; o < s.item.length; o++) { r(s.item[o], r) }
        }
    };
    h(m, h);
    this._loadJSONObject(m, l)
};
dhtmlXTreeObject.prototype.loadJSONObject = function (a, c) {
    if (window.console && window.console.info) { window.console.info("loadJSONObject was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this._loadJSONObject(a, c)
};
dhtmlXTreeObject.prototype._loadJSONObject = function (a, c) {
    if (!this.parsCount) { this.callEvent("onXLS", [this, null]) }
    this.xmlstate = 1;
    var e = new jsonPointer(a);
    this._parse(e);
    this._p = e;
    if (c) { c() }
};
dhtmlXTreeObject.prototype.loadJSON = function (a, c) {
    if (window.console && window.console.info) { window.console.info("loadJSON was deprecated", "http://docs.dhtmlx.com/migration__index.html#migrationfrom43to44") }
    return this._loadJSON(a, c)
};
dhtmlXTreeObject.prototype._loadJSON = function (file, callback) {
    if (!this.parsCount) { this.callEvent("onXLS", [this, this._ld_id]) }
    this._ld_id = null;
    this.xmlstate = 1;
    var that = this;
    this.XMLLoader = function (xml, callback) {
        try { eval("var t=" + xml.responseText) } catch (e) {
            dhx4.callEvent("onLoadXMLerror", ["Incorrect JSON", (xml), this]);
            return
        }
        var p = new jsonPointer(t);
        this._parse(p);
        this._p = p;
        if (callback) { callback.call(this, xml) }
    };
    dhx4.ajax.get(file, function (obj) { that.XMLLoader(obj.xmlDoc, callback) })
};
dhtmlXTreeObject.prototype.serializeTreeToJSON = function () {
    var a = ['{"id":"' + this.rootId + '", "item":['];
    var e = [];
    for (var c = 0; c < this.htmlNode.childsCount; c++) { e.push(this._serializeItemJSON(this.htmlNode.childNodes[c])) }
    a.push(e.join(","));
    a.push("]}");
    return a.join("")
};
dhtmlXTreeObject.prototype._serializeItemJSON = function (m) {
    var a = [];
    if (m.unParsed) {
        return (m.unParsed.text())
    }
    if (this._selected.length) {
        var e = this._selected[0].id
    } else { e = "" }
    var l = m.span.innerHTML;
    l = l.replace(/\"/g, '\\"', l);
    if (!this._xfullXML) { a.push('{ "id":"' + m.id + '", ' + (this._getOpenState(m) == 1 ? ' "open":"1", ' : "") + (e == m.id ? ' "select":"1",' : "") + ' "text":"' + l + '"' + (((this.XMLsource) && (m.XMLload == 0)) ? ', "child":"1" ' : "")) } else { a.push('{ "id":"' + m.id + '", ' + (this._getOpenState(m) == 1 ? ' "open":"1", ' : "") + (e == m.id ? ' "select":"1",' : "") + ' "text":"' + l + '", "im0":"' + m.images[0] + '", "im1":"' + m.images[1] + '", "im2":"' + m.images[2] + '" ' + (m.acolor ? (', "aCol":"' + m.acolor + '" ') : "") + (m.scolor ? (', "sCol":"' + m.scolor + '" ') : "") + (m.checkstate == 1 ? ', "checked":"1" ' : (m.checkstate == 2 ? ', "checked":"-1"' : "")) + (m.closeable ? ', "closeable":"1" ' : "") + (((this.XMLsource) && (m.XMLload == 0)) ? ', "child":"1" ' : "")) }
    if ((this._xuserData) && (m._userdatalist)) {
        a.push(', "userdata":[');
        var h = m._userdatalist.split(",");
        var g = [];
        for (var c = 0; c < h.length; c++) { g.push('{ "name":"' + h[c] + '" , "content":"' + m.userData["t_" + h[c]] + '" }') }
        a.push(g.join(","));
        a.push("]")
    }
    if (m.childsCount) {
        a.push(', "item":[');
        var g = [];
        for (var c = 0; c < m.childsCount; c++) { g.push(this._serializeItemJSON(m.childNodes[c])) }
        a.push(g.join(","));
        a.push("]\n")
    }
    a.push("}\n");
    return a.join("")
};

function dhtmlXTreeFromHTML(obj) {
    if (typeof (obj) != "object") { obj = document.getElementById(obj) }
    var n = obj;
    var id = n.id;
    var cont = "";
    for (var j = 0; j < obj.childNodes.length; j++) {
        if (obj.childNodes[j].nodeType == "1") {
            if (obj.childNodes[j].tagName == "XMP") {
                var cHead = obj.childNodes[j];
                for (var m = 0; m < cHead.childNodes.length; m++) { cont += cHead.childNodes[m].data }
            } else {
                if (obj.childNodes[j].tagName.toLowerCase() == "ul") { cont = dhx_li2trees(obj.childNodes[j], new Array(), 0) }
            }
            break
        }
    }
    obj.innerHTML = "";
    var t = new dhtmlXTreeObject(obj, "100%", "100%", 0);
    var z_all = new Array();
    for (b in t) { z_all[b.toLowerCase()] = b }
    var atr = obj.attributes;
    for (var a = 0; a < atr.length; a++) {
        if ((atr[a].name.indexOf("set") == 0) || (atr[a].name.indexOf("enable") == 0)) {
            var an = atr[a].name;
            if (!t[an]) { an = z_all[atr[a].name] }
            t[an].apply(t, atr[a].value.split(","))
        }
    }
    if (typeof (cont) == "object") {
        t.XMLloadingWarning = 1;
        for (var i = 0; i < cont.length; i++) {
            var n = t.insertNewItem(cont[i][0], cont[i][3], cont[i][1]);
            if (cont[i][2]) { t._setCheck(n, cont[i][2]) }
        }
        t.XMLloadingWarning = 0;
        t.lastLoadedXMLId = 0;
        t._redrawFrom(t)
    } else { t.parse("<tree id='0'>" + cont + "</tree>") }
    window[id] = t;
    var oninit = obj.getAttribute("oninit");
    if (oninit) { eval(oninit) }
    return t
}

function dhx_init_trees() {
    var c = document.getElementsByTagName("div");
    for (var a = 0; a < c.length; a++) {
        if (c[a].className == "dhtmlxTree") { dhtmlXTreeFromHTML(c[a]) }
    }
}

function dhx_li2trees(s, l, e) {
    for (var m = 0; m < s.childNodes.length; m++) {
        var r = s.childNodes[m];
        if ((r.nodeType == 1) && (r.tagName.toLowerCase() == "li")) {
            var o = "";
            var n = null;
            var a = r.getAttribute("checked");
            for (var h = 0; h < r.childNodes.length; h++) {
                var g = r.childNodes[h];
                if (g.nodeType == 3) { o += g.data } else {
                    if (g.tagName.toLowerCase() != "ul") { o += dhx_outer_html(g) } else { n = g }
                }
            }
            l[l.length] = [e, o, a, (r.id || (l.length + 1))];
            if (n) { l = dhx_li2trees(n, l, (r.id || l.length)) }
        }
    }
    return l
}

function dhx_outer_html(c) {
    if (c.outerHTML) {
        return c.outerHTML
    }
    var a = document.createElement("DIV");
    a.appendChild(c.cloneNode(true));
    a = a.innerHTML;
    return a
}
if (window.addEventListener) { window.addEventListener("load", dhx_init_trees, false) } else {
    if (window.attachEvent) { window.attachEvent("onload", dhx_init_trees) }
}
dhtmlXTreeObject.prototype.parserExtension = { _parseExtension: function (g, c, e) { this._idpull[c.id]._attrs = c } };
dhtmlXTreeObject.prototype.getAttribute = function (e, a) {
    this._globalIdStorageFind(e);
    var c = this._idpull[e]._attrs;
    return c ? c[a] : window.undefined
};
dhtmlXTreeObject.prototype.setAttribute = function (g, a, e) {
    this._globalIdStorageFind(g);
    var c = (this._idpull[g]._attrs) || {};
    c[a] = e;
    this._idpull[g]._attrs = c
};
dhtmlXTreeObject.prototype.enableKeyboardNavigation = function (e) {
    this._enblkbrd = dhx4.s2b(e);
    if (this._enblkbrd) {
        if (_isFF) {
            var c = window.getComputedStyle(this.parentObject, null)["position"];
            if ((c != "absolute") && (c != "relative")) { this.parentObject.style.position = "relative" }
        }
        this._navKeys = [
            ["up", 38],
            ["down", 40],
            ["open", 39],
            ["close", 37],
            ["call", 13],
            ["edit", 113]
        ];
        var a = this;
        var c = document.createElement("INPUT");
        c.className = "a_dhx_hidden_input";
        c.autocomplete = "off";
        if (window._KHTMLrv) { c.style.color = "white" }
        this.parentObject.appendChild(c);
        this.parentObject[_isOpera ? "onkeypress" : "onkeydown"] = function (g) {
            if (a.callEvent("onKeyPress", [(g || window.event).keyCode, (g || window.event)])) {
                return a._onKeyDown(g || window.event)
            }
        };
        this.parentObject.onclick = function (g) {
            if (_isFF || _isIE) { c.select() }
            if (window._KHTMLrv || _isOpera) { c.focus() }
        }
    } else { this.parentObject.onkeydown = null }
};
dhtmlXTreeObject.prototype._onKeyDown = function (g) {
    if (window.globalActiveDHTMLGridObject && globalActiveDHTMLGridObject.isActive) {
        return true
    }
    var a = this;
    for (var c = 0; c < this._navKeys.length; c++) {
        if (this._navKeys[c][1] == g.keyCode) {
            this["_onkey_" + this._navKeys[c][0]].apply(this, [this.getSelectedItemId()]);
            if (g.preventDefault) { g.preventDefault() } (g || event).cancelBubble = true;
            return false
        }
    }
    if (this._textSearch) {
        return this._searchItemByKey(g)
    }
    return true
};
dhtmlXTreeObject.prototype._onkey_up = function (e) {
    var a = this._globalIdStorageFind(e);
    if (!a) {
        return
    }
    var c = this._getPrevVisibleNode(a);
    if (c.id == this.rootId) {
        return
    }
    this.focusItem(c.id);
    this.selectItem(c.id, false)
};
dhtmlXTreeObject.prototype._onkey_down = function (e) {
    var a = this._globalIdStorageFind(e);
    if (!a) {
        return
    }
    var c = this._getNextVisibleNode(a);
    if (c.id == this.rootId) {
        return
    }
    this.focusItem(c.id);
    this.selectItem(c.id, false)
};
dhtmlXTreeObject.prototype._onkey_open = function (a) { this.openItem(a) };
dhtmlXTreeObject.prototype._onkey_close = function (a) { this.closeItem(a) };
dhtmlXTreeObject.prototype._onkey_call = function (a) {
    if (this.stopEdit) {
        this.stopEdit();
        this.parentObject.lastChild.focus();
        this.parentObject.lastChild.focus();
        this.selectItem(a, true)
    } else { this.selectItem(this.getSelectedItemId(), true) }
};
dhtmlXTreeObject.prototype._onkey_edit = function (a) {
    if (this.editItem) { this.editItem(a) }
};
dhtmlXTreeObject.prototype._getNextVisibleNode = function (a, c) {
    if ((!c) && (this._getOpenState(a) > 0)) {
        return a.childNodes[0]
    }
    if ((a.tr) && (a.tr.nextSibling) && (a.tr.nextSibling.nodem)) {
        return a.tr.nextSibling.nodem
    }
    if (a.parentObject) {
        return this._getNextVisibleNode(a.parentObject, 1)
    }
    return a
};
dhtmlXTreeObject.prototype._getPrevVisibleNode = function (a) {
    if ((a.tr) && (a.tr.previousSibling) && (a.tr.previousSibling.nodem)) {
        return this._lastVisibleChild(a.tr.previousSibling.nodem)
    }
    if (a.parentObject) {
        return a.parentObject
    } else {
        return a
    }
};
dhtmlXTreeObject.prototype._lastVisibleChild = function (a) {
    if (this._getOpenState(a) > 0) {
        return this._lastVisibleChild(a.childNodes[a.childsCount - 1])
    } else {
        return a
    }
};
dhtmlXTreeObject.prototype._searchItemByKey = function (c) {
    if (c.keyCode == 8) {
        this._textSearchString = "";
        return true
    }
    var a = String.fromCharCode(c.keyCode).toUpperCase();
    if (a.match(/[A-Z,a-z,0-9\ ]/)) {
        this._textSearchString += a;
        this._textSearchInProgress = true;
        if (!(this.getSelectedItemText() || "").match(RegExp("^" + this._textSearchString, "i"))) { this.findItem(this._textSearchString, 0) }
        this._textSearchInProgress = false;
        if (c.preventDefault) { c.preventDefault() } (c || event).cancelBubble = true;
        return false
    }
    return true
};
dhtmlXTreeObject.prototype.assignKeys = function (a) { this._navKeys = a };
dhtmlXTreeObject.prototype.enableKeySearch = function (c) {
    this._textSearch = dhx4.s2b(c);
    if (!this._textSearch) {
        return
    }
    this._textSearchString = "";
    var a = this;
    this._markItem2 = this._markItem;
    this._markItem = function (e) {
        if (!a._textSearchInProgress) { a._textSearchString = "" }
        a._markItem2(e)
    }
};
dhtmlXTreeObject.prototype.enableLoadingItem = function (a) {
    this.attachEvent("onXLS", this._showFakeItem);
    this.attachEvent("onXLE", this._hideFakeItem);
    this._tfi_text = a || "Loading..."
};
dhtmlXTreeObject.prototype._showFakeItem = function (a, e) {
    if ((e === null) || (this._globalIdStorageFind("fake_load_xml_" + e))) {
        return
    }
    var c = this.XMLsource;
    this.XMLsource = null;
    this.insertNewItem(e, "fake_load_xml_" + e, this._tfi_text);
    this.XMLsource = c
};
dhtmlXTreeObject.prototype._hideFakeItem = function (a, c) {
    if (c === null) {
        return
    }
    this.deleteItem("fake_load_xml_" + c)
};
dhtmlXTreeObject.prototype.isLocked = function (a) {
    if (!this._locker) { this._init_lock() }
    return (this._locker[a] == true)
};
dhtmlXTreeObject.prototype._lockItem = function (a, h, c) {
    if (!this._locker) { this._init_lock() }
    if (h) {
        if (this._locker[a.id] == true) {
            return
        }
        this._locker[a.id] = true;
        a.bIm0 = a.images[0];
        a.bIm1 = a.images[1];
        a.bIm2 = a.images[2];
        a.images[0] = this.lico0;
        a.images[1] = this.lico1;
        a.images[2] = this.lico2;
        var g = a.span.parentNode;
        var e = g.previousSibling;
        this.dragger.removeDraggableItem(g);
        this.dragger.removeDraggableItem(e)
    } else {
        if (this._locker[a.id] != true) {
            return
        }
        this._locker[a.id] = false;
        a.images[0] = a.bIm0;
        a.images[1] = a.bIm1;
        a.images[2] = a.bIm2;
        var g = a.span.parentNode;
        var e = g.previousSibling;
        this.dragger.addDraggableItem(g, this);
        this.dragger.addDraggableItem(e, this)
    }
    if (!c) { this._correctPlus(a) }
};
dhtmlXTreeObject.prototype.lockItem = function (e, c) {
    if (!this._locker) { this._init_lock() }
    this._lockOn = false;
    var a = this._globalIdStorageFind(e);
    this._lockOn = true;
    this._lockItem(a, dhx4.s2b(c))
};
dhtmlXTreeObject.prototype.setLockedIcons = function (e, c, a) {
    if (!this._locker) { this._init_lock() }
    this.lico0 = e;
    this.lico1 = c;
    this.lico2 = a
};
dhtmlXTreeObject.prototype._init_lock = function () {
    this._locker = new Array();
    this._locker_count = "0";
    this._lockOn = true;
    this._globalIdStorageFindA = this._globalIdStorageFind;
    this._globalIdStorageFind = this._lockIdFind;
    if (this._serializeItem) {
        this._serializeItemA = this._serializeItem;
        this._serializeItem = this._serializeLockItem;
        this._serializeTreeA = this.serializeTree;
        this.serializeTree = this._serializeLockTree
    }
    this.setLockedIcons(this.imageArray[0], this.imageArray[1], this.imageArray[2])
};
dhtmlXTreeObject.prototype._lockIdFind = function (e, a, c) {
    if (!this.skipLock) {
        if ((!c) && (this._lockOn == true) && (this._locker[e] == true)) {
            return null
        }
    }
    return this._globalIdStorageFindA(e, a, c)
};
dhtmlXTreeObject.prototype._serializeLockItem = function (a) {
    if (this._locker[a.id] == true) {
        return ""
    }
    return this._serializeItemA(a)
};
dhtmlXTreeObject.prototype._serializeLockTree = function () {
    var a = this._serializeTreeA();
    return a.replace(/<item[^>]+locked\=\"1\"[^>]+\/>/g, "")
};
dhtmlXTreeObject.prototype._moveNodeToA = dhtmlXTreeObject.prototype._moveNodeTo;
dhtmlXTreeObject.prototype._moveNodeTo = function (a, e, c) {
    if ((e.treeNod.isLocked) && (e.treeNod.isLocked(e.id))) {
        return false
    }
    return this._moveNodeToA(a, e, c)
};
dhtmlXTreeObject.prototype.lockTree = function (a) {
    if (dhx4.s2b(a)) { this._initTreeLocker() } else {
        if (this._TreeLocker) {
            this._TreeLocker.parentNode.removeChild(this._TreeLocker);
            this._TreeLocker = null
        }
    }
};
dhtmlXTreeObject.prototype._initTreeLocker = function (a) {
    if (this._TreeLocker) {
        return
    }
    this.parentObject.style.overflow = "hidden";
    if (this.parentObject.style.position != "absolute") { this.parentObject.style.position = "relative" }
    var c = document.createElement("div");
    c.style.position = "absolute";
    c.style.left = "0px";
    c.style.top = "0px";
    c.className = "dhx_tree_opacity";
    c.style.width = this.allTree.offsetWidth + "px";
    c.style.backgroundColor = "#FFFFFF";
    c.style.height = this.allTree.offsetHeight + "px";
    this._TreeLocker = c;
    this.parentObject.appendChild(this._TreeLocker)
};
dhtmlXTreeObject.prototype.enableRTL = function (c) {
    var a = dhx4.s2b(c);
    if (((a) && (!this.rtlMode)) || ((!a) && (this.rtlMode))) {
        this.rtlMode = a;
        this._switchToRTL(this.rtlMode)
    }
};
dhtmlXTreeObject.prototype._switchToRTL = function (a) {
    if (a) {
        this.allTree.className = this._ltr_line = this.lineArray;
        this._ltr_min = this.minusArray;
        this._ltr_plus = this.plusArray;
        this.lineArray = new Array("line2_rtl.gif", "line3_rtl.gif", "line4_rtl.gif", "blank.gif", "blank.gif", "line1_rtl.gif");
        this.minusArray = new Array("minus2_rtl.gif", "minus3_rtl.gif", "minus4_rtl.gif", "minus.gif", "minus5_rtl.gif");
        this.plusArray = new Array("plus2_rtl.gif", "plus3_rtl.gif", "plus4_rtl.gif", "plus.gif", "plus5_rtl.gif");
        this.allTree.className = "containerTableStyleRTL"
    } else {
        this.allTree.className = "containerTableStyle";
        this.lineArray = this._ltr_line;
        this.minusArray = this._ltr_min;
        this.plusArray = this._ltr_plus
    }
    if (this.htmlNode.childsCount) { this._redrawFrom(this, this.htmlNode) }
};
dhtmlXTreeObject.prototype.sortTree = function (g, c, e) {
    var a = this._globalIdStorageFind(g);
    if (!a) {
        return false
    }
    this._reorderBranch(a, (c.toString().toLowerCase() == "asc"), dhx4.s2b(e))
};
dhtmlXTreeObject.prototype.setCustomSortFunction = function (a) { this._csfunca = a };
dhtmlXTreeObject.prototype._reorderBranch = function (n, c, o) {
    var a = [];
    var l = n.childsCount;
    if (!l) {
        return
    }
    var h = n.childNodes[0].tr.parentNode;
    for (var g = 0; g < l; g++) {
        a[g] = n.childNodes[g];
        h.removeChild(a[g].tr)
    }
    var e = this;
    if (c == 1) {
        if (this._csfunca) {
            a.sort(function (r, m) {
                return e._csfunca(r.id, m.id)
            })
        } else {
            a.sort(function (r, m) {
                return ((r.span.innerHTML.toUpperCase() > m.span.innerHTML.toUpperCase()) ? 1 : ((r.span.innerHTML.toUpperCase() == m.span.innerHTML.toUpperCase()) ? 0 : -1))
            })
        }
    } else {
        if (this._csfunca) {
            a.sort(function (r, m) {
                return e._csfunca(m.id, r.id)
            })
        } else {
            a.sort(function (r, m) {
                return ((r.span.innerHTML.toUpperCase() < m.span.innerHTML.toUpperCase()) ? 1 : ((r.span.innerHTML.toUpperCase() == m.span.innerHTML.toUpperCase()) ? 0 : -1))
            })
        }
    }
    for (var g = 0; g < l; g++) {
        h.appendChild(a[g].tr);
        n.childNodes[g] = a[g];
        if ((o) && (a[g].unParsed)) { a[g].unParsed.set("order", c ? 1 : -1) } else {
            if ((o) && (a[g].childsCount)) { this._reorderBranch(a[g], c, o) }
        }
    }
    for (var g = 0; g < l; g++) {
        this._correctPlus(a[g]);
        this._correctLine(a[g])
    }
};
dhtmlXTreeObject.prototype._reorderXMLBranch = function (l) {
    var n = l.getAttribute("order");
    if (n == "none") {
        return
    }
    var c = (n == 1);
    var h = l.childNodes.length;
    if (!h) {
        return
    }
    var a = new Array();
    var e = 0;
    for (var g = 0; g < h; g++) {
        if (l.childNodes[g].nodeType == 1) {
            a[e] = l.childNodes[g];
            e++
        }
    }
    for (var g = h - 1; g != 0; g--) { l.removeChild(l.childNodes[g]) }
    if (c) {
        a.sort(function (o, m) {
            return ((o.getAttribute("text") > m.getAttribute("text")) ? 1 : ((o.getAttribute("text") == m.getAttribute("text")) ? 0 : -1))
        })
    } else {
        a.sort(function (o, m) {
            return ((o.getAttribute("text") < m.getAttribute("text")) ? 1 : ((o.getAttribute("text") == m.getAttribute("text")) ? 0 : -1))
        })
    }
    for (var g = 0; g < e; g++) {
        a[g].setAttribute("order", n);
        l.appendChild(a[g])
    }
    l.setAttribute("order", "none")
};
dhtmlXTreeObject.prototype._serEnts = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"]
];
dhtmlXTreeObject.prototype.registerXMLEntity = function (a, c) { this._serEnts[this._serEnts.length] = [a, c, new RegExp(a, "g")] };
dhtmlXTreeObject.prototype.setSerializationLevel = function (a, c, h, l, e) {
    this._xuserData = dhx4.s2b(a);
    this._xfullXML = dhx4.s2b(c);
    this._dtd = e;
    this._xescapeEntities = dhx4.s2b(h);
    if (dhx4.s2b(l)) {
        this._apreUC = "<![CDATA[";
        this._apstUC = "]]>"
    } else { }
    for (var g = 0; g < this._serEnts.length; g++) { this._serEnts[g][2] = new RegExp(this._serEnts[g][0], "g") }
};
dhtmlXTreeObject.prototype.serializeTree = function () {
    if (this.stopEdit) { this.stopEdit() }
    this._apreUC = this._apreUC || "";
    this._apstUC = this._apstUC || "";
    var a = '<?xml version="1.0"?>';
    if (this._dtd) { a += '<!DOCTYPE tree SYSTEM "' + this._dtd + '">' }
    a += '<tree id="' + this.rootId + '">';
    if ((this._xuserData) && (this._idpull[this.rootId]._userdatalist)) {
        var e = this._idpull[this.rootId]._userdatalist.split(",");
        for (var c = 0; c < e.length; c++) { a += '<userdata name="' + e[c] + '">' + this._apreUC + this._idpull[this.rootId].userData["t_" + e[c]] + this._apstUC + "</userdata>" }
    }
    for (var c = 0; c < this.htmlNode.childsCount; c++) { a += this._serializeItem(this.htmlNode.childNodes[c]) }
    a += "</tree>";
    return a
};
dhtmlXTreeObject.prototype._serializeItem = function (m) {
    if (m.unParsed) {
        if (dhx4.isIE) {
            return m.unParsed.d.xml
        } else {
            var a = new XMLSerializer();
            return a.serializeToString(m.unParsed.d)
        }
    }
    var c = "";
    if (this._selected.length) {
        var g = this._selected[0].id
    } else { g = '"' }
    var l = m.span.innerHTML;
    if (this._xescapeEntities) {
        for (var e = 0; e < this._serEnts.length; e++) { l = l.replace(this._serEnts[e][2], this._serEnts[e][1]) }
    }
    if (!this._xfullXML) { c = '<item id="' + m.id + '" ' + (this._getOpenState(m) == 1 ? ' open="1" ' : "") + (g == m.id ? ' select="1"' : "") + ' text="' + l + '"' + (((this.XMLsource) && (m.XMLload == 0)) ? ' child="1" ' : "") + ">" } else { c = '<item id="' + m.id + '" ' + (this._getOpenState(m) == 1 ? ' open="1" ' : "") + (g == m.id ? ' select="1"' : "") + ' text="' + l + '" im0="' + m.images[0] + '" im1="' + m.images[1] + '" im2="' + m.images[2] + '" ' + (m.acolor ? ('aCol="' + m.acolor + '" ') : "") + (m.scolor ? ('sCol="' + m.scolor + '" ') : "") + (m.checkstate == 1 ? 'checked="1" ' : (m.checkstate == 2 ? 'checked="-1"' : "")) + (m.closeable ? 'closeable="1" ' : "") + (((this.XMLsource) && (m.XMLload == 0)) ? ' child="1" ' : "") + ">" }
    if ((this._xuserData) && (m._userdatalist)) {
        var h = m._userdatalist.split(",");
        for (var e = 0; e < h.length; e++) { c += '<userdata name="' + h[e] + '">' + this._apreUC + m.userData["t_" + h[e]] + this._apstUC + "</userdata>" }
    }
    for (var e = 0; e < m.childsCount; e++) { c += this._serializeItem(m.childNodes[e]) }
    c += "</item>";
    return c
};
dhtmlXTreeObject.prototype.saveSelectedItem = function (c, a) {
    c = c || "";
    this.setCookie("treeStateSelected" + c, this.getSelectedItemId(), a)
};
dhtmlXTreeObject.prototype.restoreSelectedItem = function (a) {
    a = a || "";
    var c = this.getCookie("treeStateSelected" + a);
    this.selectItem(c, false)
};
dhtmlXTreeObject.prototype.enableAutoSavingSelected = function (a, c) {
    this.assMode = dhx4.s2b(a);
    if ((this.assMode) && (!this.oldOnSelect)) {
        this.oldOnSelect = this.onRowSelect;
        this.onRowSelect = function (h, g, l) {
            if (!g) { g = this }
            g.parentObject.treeNod.oldOnSelect(h, g, l);
            if (g.parentObject.treeNod.assMode) { g.parentObject.treeNod.saveSelectedItem(g.parentObject.treeNod.assCookieName) }
        }
    }
    this.assCookieName = c
};
dhtmlXTreeObject.prototype.saveState = function (e, c) {
    var h = this._escape(this.serializeTree());
    var a = 4000;
    if (h.length > a) {
        if (navigator.appName.indexOf("Microsoft") != -1) {
            return false
        }
        this.setCookie("treeStatex" + e, Math.ceil(h.length / a));
        for (var g = 0; g < Math.ceil(h.length / a) ; g++) { this.setCookie("treeStatex" + e + "x" + g, h.substr(g * a, a), c) }
    } else { this.setCookie("treeStatex" + e, h, c) }
    var h = this.getCookie("treeStatex" + e);
    if (!h) {
        this.setCookie("treeStatex" + e, "", c);
        return false
    }
    return true
};
dhtmlXTreeObject.prototype.loadState = function (a) {
    var g = this.getCookie("treeStatex" + a);
    if (!g) {
        return false
    }
    if (g.length) {
        if (g.toString().length < 4) {
            var e = "";
            for (var c = 0; c < g; c++) { e += this.getCookie("treeStatex" + a + "x" + c) }
            g = e
        }
        this.parse((this.utfesc == "utf8") ? decodeURI(g) : unescape(g))
    }
    return true
};
dhtmlXTreeObject.prototype.setCookie = function (c, e, a) {
    var g = c + "=" + e + (a ? ("; " + a) : "");
    document.cookie = g
};
dhtmlXTreeObject.prototype.getCookie = function (c) {
    var e = c + "=";
    if (document.cookie.length > 0) {
        var g = document.cookie.indexOf(e);
        if (g != -1) {
            g += e.length;
            var a = document.cookie.indexOf(";", g);
            if (a == -1) { a = document.cookie.length }
            return document.cookie.substring(g, a)
        }
    }
};
dhtmlXTreeObject.prototype.saveOpenStates = function (c, a) {
    var g = [];
    for (var e = 0; e < this.htmlNode.childsCount; e++) { g = g.concat(this._collectOpenStates(this.htmlNode.childNodes[e])) }
    g = g.join(this.dlmtr);
    this.setCookie("treeOpenStatex" + c, g, a)
};
dhtmlXTreeObject.prototype.loadOpenStates = function (c) {
    for (var e = 0; e < this.htmlNode.childsCount; e++) { this._xcloseAll(this.htmlNode.childNodes[e]) }
    this.allTree.childNodes[0].border = "1";
    this.allTree.childNodes[0].border = "0";
    var h = getCookie("treeOpenStatex" + c);
    if (h) {
        var a = h.split(this.dlmtr);
        for (var e = 0; e < a.length; e++) {
            var g = this._globalIdStorageFind(a[e]);
            if (g) {
                if ((this.XMLsource) && (!g.XMLload) && (g.id != this.rootId)) {
                    this._delayedLoad(g, "loadOpenStates('" + c + "')");
                    return
                } else { this.openItem(a[e]) }
            }
        }
    }
    this.callEvent("onAllOpenDynamic", [])
};
dhtmlXTreeObject.prototype._delayedLoad = function (c, a) {
    this.afterLoadMethod = a;
    this.onLoadReserve = this.onXLE;
    this.onXLE = this._delayedLoadStep2;
    this._loadDynXML(c.id)
};
dhtmlXTreeObject.prototype._delayedLoadStep2 = function (tree) {
    tree.onXLE = tree.onLoadReserve;
    window.setTimeout(function () {
        dhtmlx.temp = tree;
        eval("dhtmlx.temp." + tree.afterLoadMethod)
    }, 100);
    if (tree.onXLE) { tree.onXLE(tree) }
    tree.callEvent("onXLE", [tree])
};
dhtmlXTreeObject.prototype._collectOpenStates = function (c) {
    var e = [];
    if (this._getOpenState(c) == 1) {
        e.push(c.id);
        for (var a = 0; a < c.childsCount; a++) { e = e.concat(this._collectOpenStates(c.childNodes[a])) }
    }
    return e
};

function setCookie(a, c) { document.cookie = a + "=" + c }

function getCookie(c) {
    var e = c + "=";
    if (document.cookie.length > 0) {
        var g = document.cookie.indexOf(e);
        if (g != -1) {
            g += e.length;
            var a = document.cookie.indexOf(";", g);
            if (a == -1) { a = document.cookie.length }
            return (document.cookie.substring(g, a))
        }
    }
}
dhtmlXTreeObject.prototype.openAllItemsDynamic = function (a) {
    this.ClosedElem = new Array();
    this.G_node = null;
    var c = this._globalIdStorageFind(a || this.rootId);
    if (c.id != this.rootId && this.getOpenState(c.id) != 0) { this.openItem(a) }
    this._openAllNodeChilds(c, 0);
    if (this.ClosedElem.length > 0) {
        this.onLoadReserve = this.onXLE;
        this.onXLE = this._loadAndOpen;
        this._loadAndOpen(this)
    }
};
dhtmlXTreeObject.prototype._openAllNodeChilds = function (c) {
    if ((c.XMLload == 0) || (c.unParsed)) { this.ClosedElem.push(c) }
    for (var a = 0; a < c.childsCount; a++) {
        if (this._getOpenState(c.childNodes[a]) < 0) { this._HideShow(c.childNodes[a], 2) }
        if (c.childNodes[a].childsCount > 0) { this._openAllNodeChilds(c.childNodes[a]) }
        if ((c.childNodes[a].XMLload == 0) || (c.childNodes[a].unParsed)) { this.ClosedElem.push(c.childNodes[a]) }
    }
};
dhtmlXTreeObject.prototype._loadAndOpen = function (a) {
    if (a.G_node) {
        a._openItem(a.G_node);
        a._openAllNodeChilds(a.G_node);
        a.G_node = null
    }
    if (a.ClosedElem.length > 0) { a.G_node = a.ClosedElem.shift() }
    if (a.G_node) {
        if (a.G_node.unParsed) { a.reParse(a.G_node) } else { window.setTimeout(function () { a._loadDynXML(a.G_node.id) }, 100) }
    } else {
        a.onXLE = a.onLoadReserve;
        if (a.onXLE) { a.onXLE(a) }
        a.callEvent("onAllOpenDynamic", [a])
    }
};
dhtmlXTreeObject.prototype.openItemsDynamic = function (c, a) {
    if (this.onXLE == this._stepOpen) {
        return
    }
    this._opnItmsDnmcFlg = dhx4.s2b(a);
    this.onLoadReserve = this.onXLE;
    this.onXLE = this._stepOpen;
    this.ClosedElem = c.split(",").reverse();
    this._stepOpen(this)
};
dhtmlXTreeObject.prototype._stepOpen = function (c) {
    if (!c.ClosedElem.length) {
        c.onXLE = c.onLoadReserve;
        if (c._opnItmsDnmcFlg) { c.selectItem(c.G_node, true) }
        if ((c.onXLE) && (arguments[1])) { c.onXLE.apply(c, arguments) }
        c.callEvent("onOpenDynamicEnd", []);
        return
    }
    c.G_node = c.ClosedElem.pop();
    c.skipLock = true;
    var a = c._globalIdStorageFind(c.G_node);
    if (a) {
        if (a.XMLload === 0) { c.openItem(c.G_node) } else {
            c.openItem(c.G_node);
            c._stepOpen(c)
        }
    }
    c.skipLock = false
};