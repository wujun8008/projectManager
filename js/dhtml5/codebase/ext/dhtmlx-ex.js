// OVERRIDE non-prototype methods or properties without subclass
function replaceMethods(cname, nms) {
    var t = window[cname];
    if (!t) return;
    window[cname] = function () {
        var that = t.apply(this, arguments);
        that = that || this;
        for (var p in nms) {
            that[p] = nms[p];
        }
    }
    window[cname].prototype = t.prototype;
}

window.dhx4.skin = window.dhx_skin;
dhtmlx.image_path = window.dhx_globalImgPath;

// dhtmlx.message >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlx && dhtmlx.message) {
    dhtmlx.infoExpire = function (n) {
        dhtmlx.message.expire = n * 1000;
    };

    dhtmlx.infoAlignV = function (pos) {
        dhtmlx.message.position = pos || 'top';
    };

    dhtmlx.infoAlign = function (pos) {
        dhtmlx.message.align = pos || 'right';
    };
}

// dhtmlXCellObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXCombo) {
    dhtmlXCombo.prototype.disableNew = function () {
        this.base.childNodes[2].disable();
    }
}

// dhtmlXCellObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXCellObject) {
    dhtmlXCellObject.prototype.attachedUrl = function () {
        return this.conf.url_data && this.conf.url_data.url;
    }
}

// dhtmlXLayoutObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXLayoutObject) {
    dhtmlXLayoutObject.prototype.setMargin = function (id, m) {
        var c = this.cells(id);
        if (c) c.setMargin(m);
    }

    dhtmlXLayoutCell.prototype.setMargin = function (m) {
        var cc = this.cell.childNodes[this.conf.idx.cont];
        cc.style.padding = (m || 0) + 'px';
        this._resetSizeState();
        this._adjustCont();
    }
} // dhtmlXLayoutObject

// dhtmlXTabBar >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXTabBar) {
    dhtmlXTabBar.prototype.setMargin = function (tid, n) {
        var c = this.t[tid].cell;
        if (c) {
            var cc = c.cell.childNodes[c.conf.idx.cont];
            cc.style.padding = (n || 0) + 'px';
            c._resetSizeState();
            c._adjustCont();
        }
    };

    dhtmlXTabBar.prototype.forEach = function (cb) {
        for (var tid in this.t) cb(tid);
    }

    dhtmlXTabBar.prototype.getTabCount = function () {
        var c = 0;
        for (var p in this.t) c++;
        return c;
    }

    dhtmlXTabBar.prototype.getTabIdByIndex = function (ind) {
        for (var p in this.t) {
            if (ind == 0) return p;
            ind--;
        }
        return null;
    }

    dhtmlXTabBar.prototype.getNextTab = function (tid) {
        return this._getNextVisible(tid);
    }

    dhtmlXTabBar.prototype.getPreviousTab = function (tid) {
        return this._getPrevVisible(tid);
    }

    dhtmlXTabBar.prototype.setTabActive = function (tid) {
        this._setTabActive(tid);
    }

    dhtmlXTabBar.prototype.isActive = function (tid) {
        return this.getActiveTab() == tid;
    }

    dhtmlXTabBar.prototype.activeNextTab = function (tid) {
        var tab = this.getNextTab(tid);
        if (tab == null) tab = this.getPreviousTab(tid);
        if (tab) {
            this._setTabActive(tab);
        }
    }

    dhtmlXTabBar.prototype.deleteTab = function (tid) {
        var tab = this.getNextTab(tid);
        if (tab == null) tab = this.getPreviousTab(tid);
        if (tab) {
            this._setTabActive(tab);
        }
        this.removeTab(tid);
    }

    dhtmlXTabBar.prototype.tabFrame = function (tid) {
        return this.cells(tid).getFrame();
    }

    dhtmlXTabBar.prototype.tabWindow = function (tid) {
        return this.tabFrame(tid).contentWindow;
    }

    dhtmlXTabBar.prototype.showTab = function (tid) {
        this.tabs(tid).show();
    };

    dhtmlXTabBar.prototype.hideTab = function (tid) {
        this.tabs(tid).hide();
    };

    dhtmlXTabBar.prototype.hideAll = function (ex, sid) {
        ex = Object.toHash(ex);
        for (var tid in this.t) {
            if (ex[tid]) continue;
            this.tabs(tid).hide();
        }
        sid && this.setTabActive(sid);
    }

    dhtmlXTabBar.prototype.showAll = function (ex, sid) {
        ex = Object.toHash(ex);
        for (var tid in this.t) {
            if (ex[tid]) continue;
            this.tabs(tid).show();
        }
        sid && this.setTabActive(sid);
    }

    dhtmlXTabBar.prototype.setUserData = function (tid, n, v) {
        var t = this.tabs(tid);
        if (t) {
            var d = t._ud;
            if (!d) d = t._ud = {};
            d[n] = v;
        }
    }

    dhtmlXTabBar.prototype.getUserData = function (tid, n) {
        var t = this.tabs(tid);
        var v;
        if (t) {
            var d = t._ud;
            if (d) v = d[n];
        }
        return v;
    }

    dhtmlXTabBar.prototype.attachContextMenu = function (menu) {
        menu.renderAsContextMenu();
        menu.addContextZone(this.tabsArea);
    }

    dhtmlXTabBar.prototype.up2TabId = function (elm) {
        elm && (elm = $(elm));
        if (!elm) return null;
        elm.hasClassName('dhxtabbar_tab') || (elm = elm.up('div.dhxtabbar_tab'));
        return elm == null ? null : elm._tabId;
    }
} // dhtmlXTabBar

// dhtmlXMenuObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXMenuObject) {
    dhtmlXMenuObject.prototype.getItem = function (itemId) {
        return this.itemPull[this.idPrefix + itemId];
    }

    dhtmlXMenuObject.prototype.getLastChild = function (itemId) {
        return null;
    }

    dhtmlXMenuObject.separator = "separator";
} // dhtmlXMenuObject

// dhtmlXToolbarObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXToolbarObject) {
    dhtmlXToolbarObject.prototype.getItem = function (itemId) {
        return this.objPull[this.idPrefix + itemId];
    }

    dhtmlXToolbarObject.prototype.getIdByPos = function (pos) {
        return this._getIdByPosition(pos);
    }

    dhtmlXToolbarObject.prototype.getItemElement = function (itemId) {
        return this.getItem(itemId).obj;
    }

    dhtmlXToolbarObject.prototype.getItemInput = function (itemId) {
        return this.getItem(itemId).obj.childNodes[0];
    }

    dhtmlXToolbarObject.prototype.setItemData = function (itemId, name, value) {
        var item = this.getItem(itemId);
        if (item) {
            if (!item['_ud']) item['_ud'] = {};
            item['_ud'][name] = value;
        }
    }

    dhtmlXToolbarObject.prototype.getItemData = function (itemId, name) {
        var item = this.getItem(itemId);
        if (item) {
            if (item['_ud']) return item['_ud'][name];
        }
    }

    dhtmlXToolbarObject.prototype.showOptionText = function (cid, oid) {
        oid || (oid = this.getListOptionSelected(cid));
        if (oid) this.setItemText(cid, this.getListOptionText(cid, oid));
    }

    dhtmlXToolbarObject.prototype.getSelectOptionId = function (cid, pos) {
        var ids = this.getAllListOptions(cid);
        return ids ? ids[pos] : null;
    }

    dhtmlXToolbarObject.prototype.selectNextListOption = function (cid) {
        // try to select next option
        var id = this.getListOptionSelected(cid);
        if (!id) id = -1;
        else id = this.getListOptionPosition(cid, id) - 1; // begin from 1
        var ids = this.getAllListOptions(cid) || [];
        for (var i = 0, l = ids.length; i < l; i++) {
            id++; id %= l;
            if (this.isListOptionEnabled(cid, ids[id])) {
                this.setListOptionSelected(cid, ids[id]);
                this.callEvent("onClick", [ids[id]]);
                break;
            }
        }
    }

    dhtmlXToolbarObject.prototype.selectOptionByText = function (cid, text) {
        // try to select next option
        var ids = this.getAllListOptions(cid);
        for (var i = 0, l = ids.length; i < l; i++) {
            if (!this.isListOptionEnabled(cid, ids[i])) continue;
            if (this.getListOptionText(cid, ids[i]) == text) {
                this.setListOptionSelected(cid, ids[i]);
                this.callEvent("onClick", [ids[i]]);
                break;
            }
        }
    }

    dhtmlXToolbarObject.prototype.selectOptionById = function (cid, oid, fire) {
        // try to select next option
        if (this.isListOptionEnabled(cid, oid)) {
            this.setListOptionSelected(cid, oid);
            this.callEvent("onClick", [oid]);
        }
    }

    dhtmlXToolbarObject.prototype.selectOptionByPos = function (cid, pos, fire) {
        var id = this.getSelectOptionId(cid, pos);
        if (id) this.selectOptionById(cid, id, fire);
    };

    dhtmlXToolbarObject.prototype.clearState = function () {
        var obj = this.objPull;
        for (var a in obj) {
            var el = obj[a];
            if (el.obj._doOnMouseOut) el.obj._doOnMouseOut();
        }
    };

    dhtmlXToolbarObject.prototype._textObject.prototype.setItemToolTip = function (tip) {
        this.obj.title = tip
    };
} // dhtmlXToolbarObject

// dhtmlXTreeObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXTreeObject) {
    replaceMethods("dhtmlXTreeObject", {
        enableRadioButtons: function (itemId, mode) { if (arguments.length == 1) { this._frbtr = dhx4.s2b(itemId); this.checkBoxOff = this.checkBoxOff || this._frbtr; return }; var node = this._globalIdStorageFind(itemId); if (!node) return ""; mode = dhx4.s2b(mode); if ((mode) && (!node._r_logic)) { node._r_logic = true; for (var i = 0; i < node.childsCount; i++) this._setCheck(node.childNodes[i], node.childNodes[i].checkstate) }; if ((!mode) && (node._r_logic)) { node._r_logic = false; for (var i = 0; i < node.childsCount; i++) this._setCheck(node.childNodes[i], node.childNodes[i].checkstate) } }
    }
    );

    dhtmlXTreeObject.prototype.renderSubitems = function (itemId) {
        if (this.getOpenState(itemId)) {
            this.closeItem(itemId);
        }
        this.openItem(itemId);
    };

    dhtmlXTreeObject.prototype.enableSingleRadioMode = function (mode) {
        this._frbtrs = dhx4.s2b(mode);
    };

    dhtmlXTreeObject.prototype.enableCheckBoxes = function (mode, hidden) {
        this.checkBoxOff = dhx4.s2b(mode);
        this.cBROf = (!(this.checkBoxOff || dhx4.s2b(hidden)))
    };

    dhtmlXTreeObject.prototype.showItemCheckbox = function (itemId, state) {
        if (!itemId) for (var a in this._idpull) this.showItemCheckbox(this._idpull[a], state);
        if (typeof (itemId) != "object") itemId = this._globalIdStorageFind(itemId, 0, 0);
        if (!itemId) return 0;
        itemId.nocheckbox = !dhx4.s2b(state);
        var t = itemId.span.parentNode.previousSibling.previousSibling.childNodes[0];
        t.style.display = (!itemId.nocheckbox) ? "" : "none";
        if (window._KHTMLrv) t.parentNode.style.display = (!itemId.nocheckbox) ? "" : "none"
    }

    // refer to dhtmlXTreeObject.prototype.selectItem
    dhtmlXTreeObject.prototype.isSelectedItem = function (itemId) {
        var temp = this._globalIdStorageFind(itemId);
        if ((!temp) || (!temp.parentObject)) return false;
        return temp.i_sel;
    }

    dhtmlXTreeObject.prototype.deselectItem = function (itemId) {
        var temp = this._globalIdStorageFind(itemId);
        if ((!temp) || (!temp.parentObject)) return false;
        this._unselectItem(temp);
    }

    // delete empty item until the root if deep is true
    dhtmlXTreeObject.prototype.deleteEmptyItem = function (itemId, deep) {
        if (!this.getItem(itemId)) return;
        var delid = null;
        do {
            if (itemId != this.rootId && !this.hasChildren(itemId)) delid = itemId, itemId = this.getParentId(itemId);
        } while (deep);
        if (delid) this.deleteItem(delid);
        this._redrawFrom(this, this.getItem(itemId));
        return itemId;
    }

    dhtmlXTreeObject.prototype.getItem = function (itemId) {
        return this._globalIdStorageFind(itemId);
    }

    dhtmlXTreeObject.prototype.enableContextMenu = function (menu) {
        this.cMenu = menu;
    }

    dhtmlXTreeObject.prototype.setItemContextMenu = function (itemId, menu) {
        itemId = this._globalIdStorageFind(itemId);
        if (itemId) itemId.cMenu = menu;
    }

    dhtmlXTreeObject.prototype.getChildrenIds = function (itemId) {
        var ids = this.getSubItems(itemId);
        if (ids) ids = ids.split(this.dlmtr);
        else ids = [];
        return ids;
    }

    dhtmlXTreeObject.prototype.cloneBranch = function (itemObject, targetObject, beforeNode, deep) {
        var i; var st = "";
        if (beforeNode) {
            for (i = 0; i < targetObject.childsCount; i++) if (targetObject.childNodes[i] == beforeNode) break;
            if (i != 0) beforeNode = targetObject.childNodes[i - 1]; else { st = "TOP"; beforeNode = "" }
        };

        var t2 = this._onradh; this._onradh = null;
        var newNode = this._attachChildNode(targetObject, itemObject.id, itemObject.label, 0, itemObject.images[0], itemObject.images[1], itemObject.images[2], st, 0, beforeNode);
        newNode._userdatalist = itemObject._userdatalist; newNode.userData = itemObject.userData.clone();
        newNode.XMLload = itemObject.XMLload; if (t2) { this._onradh = t2; this._onradh(newNode.id) };
        if (itemObject.treeNod.dpcpy) itemObject.treeNod._globalIdStorageFind(itemObject.id);
        else newNode.unParsed = itemObject.unParsed; this._correctPlus(newNode);
        if (deep) for (var i = 0; i < itemObject.childsCount; i++) this._recreateBranch(itemObject.childNodes[i], newNode, 0, 1);
        if (this.childCalc) { this._redrawFrom(this, targetObject) }; return newNode;
    }

    // support multi selection
    dhtmlXTreeObject.prototype.enableMultiselection = function (mode, strict) {
        this._ms_enable = mode;
        this._ms_samelevel = strict;
    }

    dhtmlXTreeObject.prototype.onRowSelect = function (e, htmlObject, mode) {
        e = e || window.event;
        var obj = this.parentObject;
        if (htmlObject) obj = htmlObject.parentObject;
        var that = obj.treeNod;
        var lastId = that.getSelectedItemId();
        if (e && e.ctrlKey) e.skipUnSel = true;
        that._selectItem(obj, e);
        if (!mode) {
            if (obj.actionHandler) obj.actionHandler(obj.id, lastId);
            else that.callEvent("onClick", [obj.id, lastId])
        }
    };

    dhtmlXTreeObject.prototype._selectItem = function (node, e) {
        if (this.checkEvent("onSelect")) this._onSSCFold = this.getSelectedItemId();
        if (!this._ms_enable || !e || !e.skipUnSel) {
            if (this._ms_samelevel) { // node is sibling of existed selected items
            }
            this._unselectItems();
        }
        this._markItem(node);
        if (this.checkEvent("onSelect")) {
            var z = this.getSelectedItemId();
            if (z != this._onSSCFold) this.callEvent("onSelect", [z])
        }
    };

    dhtmlXTreeObject.prototype.genItemId = function (id, prefix) {
        return id == this.rootId ? id : (prefix || '') + '_hitem.' + id;
    };

    dhtmlXTreeObject.prototype.extractId = function (itemId, prefix) {
        return itemId == null || !itemId.substring || itemId == this.rootId ? itemId : itemId.substring(7 + (prefix ? prefix.length : 0));
    };

    // find item
    dhtmlXTreeObject.prototype._getNextNode = function (item, mode) {
        if ((!mode) && (item.childsCount)) return item.childNodes[0];
        if (item == this.htmlNode) return -1;
        if ((item.tr) && (item.tr.nextSibling) && (item.tr.nextSibling.nodem)) return item.tr.nextSibling.nodem;
        return this._getNextNode(item.parentObject, true)
    };

    dhtmlXTreeObject.prototype._compare = function (s, v) {
        if (s instanceof Function) {
            if (s(v)) return true;
        } else {
            if (v.toLowerCase().search(s) != -1) return true;
        }
    };

    dhtmlXTreeObject.prototype.findStrInJSON = function (node, field, cvalue) {
        for (var i = 0; i < node.item.length; i++) {
            var z = node.item[i].text;
            if (z && this._compare(cvalue, z)) return true;
            if (this.item[i].item && this.findStrInJSON(node.item[i], field, cvalue)) return true
        };
        return false
    };

    dhtmlXTreeObject.prototype.findStrInXML = function (node, field, cvalue) {
        if (!node.childNodes && node.item) return this.findStrInJSON(node, field, cvalue);
        for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType == 1) {
                var z = node.childNodes[i].getAttribute(field);
                if (!z && node.childNodes[i].tagName == "itemtext") z = node.childNodes[i].firstChild.data;
                if (z && this._compare(cvalue, z)) return true;
                if (this.findStrInXML(node.childNodes[i], field, cvalue)) return true
            }
        };
        return false
    };

    dhtmlXTreeObject.prototype._findNodeByLabel = function (searchStr, direction, fromNode) {
        if (!(searchStr instanceof Function)) {
            searchStr += '';
            searchStr = searchStr.replace(new RegExp("^( )+"), "").replace(new RegExp("( )+$"), "");
            searchStr = new RegExp(searchStr.replace(/([\?\*\+\\\[\]\(\)]{1})/gi, "\\$1").replace(/ /gi, ".*"), "gi");
        }
        if (!fromNode) {
            fromNode = this._selected[0];
            if (!fromNode) fromNode = this.htmlNode
        };
        var startNode = fromNode;
        if (!direction) {
            if ((fromNode.unParsed) && (this.findStrInXML(fromNode.unParsed.d, "text", searchStr))) this.reParse(fromNode);
            fromNode = this._getNextNode(startNode);
            if (fromNode == -1) fromNode = this.htmlNode.childNodes[0]
        } else {
            var z2 = this._getPrevNode(startNode);
            if (z2 == -1) z2 = this._lastChild(this.htmlNode);
            if ((z2.unParsed) && (this.findStrInXML(z2.unParsed.d, "text", searchStr))) {
                this.reParse(z2);
                fromNode = this._getPrevNode(startNode)
            } else fromNode = z2;
            if (fromNode == -1) fromNode = this._lastChild(this.htmlNode)
        };
        while ((fromNode) && (fromNode != startNode)) {
            if ((fromNode.label) && this._compare(searchStr, fromNode.label)) return (fromNode);
            if (!direction) {
                if (fromNode == -1) {
                    if (startNode == this.htmlNode) break;
                    fromNode = this.htmlNode.childNodes[0]
                };
                if ((fromNode.unParsed) && (this.findStrInXML(fromNode.unParsed.d, "text", searchStr))) this.reParse(fromNode);
                fromNode = this._getNextNode(fromNode);
                if (fromNode == -1) fromNode = this.htmlNode
            } else {
                var z2 = this._getPrevNode(fromNode);
                if (z2 == -1) z2 = this._lastChild(this.htmlNode);
                if ((z2.unParsed) && (this.findStrInXML(z2.unParsed.d, "text", searchStr))) {
                    this.reParse(z2);
                    fromNode = this._getPrevNode(fromNode)
                } else fromNode = z2;
                if (fromNode == -1) fromNode = this._lastChild(this.htmlNode)
            }
        };
        return null
    };

    dhtmlXTreeObject.prototype.findItem = function (searchStr, direction, top) {
        var z = this._findNodeByLabel(searchStr, direction, (top ? this.htmlNode : null));
        if (z) {
            this.selectItem(z.id, true);
            this._focusNode(z);
            return z.id
        }
        return null;
    };

    dhtmlXTreeObject.prototype.descendantOf = function (itemId, ancestor) {
        if (itemId == null || ancestor == null) return false;
        while (itemId) {
            if (itemId == ancestor) return true;
            itemId = this.getParentId(itemId);
        }
        return false;
    };
} // dhtmlXTreeObject

// dhtmlXGridObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXGridObject) {
    dhtmlXGridObject.prototype.isColumnHidden = function (ind) {
        ind = this.toColIndex(ind);
        return this._hrrar && this._hrrar[ind];
    }

    dhtmlXGridObject.prototype._ow001 = dhtmlXGridObject.prototype.setColumnHidden;
    dhtmlXGridObject.prototype.setColumnHidden = function (col, hidden) {
        if (col instanceof Array) {
            for (var i = 0; i < col.length; i++) this.setColumnHidden(col[i], hidden);
            return;
        }

        col = this.toColIndex(col);
        hidden != null || (hidden = true);
        var zc = this.hdr.rows[0].cells[col];
        if (!zc._oldWidth && !zc._oldWidthP) zc._oldWidth = this.initCellWidth[col];

        this._ow001(col, hidden);
    };

    dhtmlXGridObject.prototype.enabletColumnHidden = function (cols) {
        var h = [], cid;
        if (!(cols instanceof Array)) cols = cols.split(',');
        for (var c = 0, cc = this.getColumnCount() ; c < cc; c++) {
            h.push(cols.include(this.getColumnId(c)));
        }
        this.enableHeaderMenu(h);
    };

    dhtmlXGridObject.prototype.setEmptyText = function (txt) {
        this.objBox.style.textAlign = 'center';
        this._emptyTxt = txt;

        function _setText(grid) {
            var t = grid.getRowsNum() < 1 ? grid._emptyTxt : '';
            if (t == null || t == grid._emptyTxt_o) return;
            grid._emptyTxt_o = t;
            grid.objBox.setText(t);
        }
        this.attachEvent('onGridReconstructed', function () {
            _setText(this);
        });
        this.attachEvent('onClearAll', function () {
            _setText(this);
        });
    }
    dhtmlXGridObject.prototype.deleteAll = function () {
        this.clearAll();
        if (this._fake) this._fake.clearAll();
    }

    dhtmlXGridObject.prototype.getHeaderLabel = function (cth, ind, hdr) {
        cth = this.toColIndex(cth);
        hdr || (hdr = this.hdr);
        if (ind == null) {
            ind = hdr.rows.length - 1;
        }
        var z = hdr.rows[ind];
        var rt;
        for (var i = 0; i < z.cells.length; i++) {
            if (z.cells[i]._cellIndexS == cth) rt = $(z.cells[i]).getText(1);
            while (!rt && --ind > 0) {
                rt = this.getHeaderLabel(cth, ind, hdr);
            }
        }
        return rt;
    }

    dhtmlXGridObject.prototype.setHeaderStyle = function (cth, css) {
        cth = this.toColIndex(cth);
        this._hstyles[cth] = css;
    }

    dhtmlXGridObject.prototype.toTabCellth = function (tr, cidx, exact) {
        if (!tr) return cidx;
        if (tr._childIndexes) return tr._childIndexes[cidx];
        var cs = tr.childNodes || [];
        for (var i = 0; i < cs.length; i++) {
            if (cs[i]._cellIndex >= cidx) {
                if (!exact || cs[i]._cellIndex == cidx) return i;
            }
        }
        return cidx;
    }

    dhtmlXGridObject.prototype.toTabCell = function (tr, cidx, exact) {
        if (!tr) return
        return tr.childNodes[this.toTabCellth(tr, cidx, exact)];
    }

    dhtmlXGridObject.prototype.setHeaderLabel = function (cidx, label, ind, css) {
        var r = this.hdr.rows[(ind || 0) + 1], cs = r.childNodes || [];
        var c = this.toTabCellth(r, this.toColIndex(cidx), true);
        if (!cs[c]) return;
        if (label == '#cspan') {
            if (cs[c] && cs[c].colSpan > 1) return;	// already spanned
            _buildIndexes(r, ind);
            cs[c - 1].colSpan = ((cs[c - 1].colSpan) || 1) + (cs[c].colSpan || 1);
            r.deleteCell(c);
            this.adjustIndexes(r, cidx, -1);
        } else if (label == '#rspan') {
            var r0 = ind + 1, c0;
            while (--r0 > 0) {
                c0 = this.toTabCell(this.hdr.rows[r0], cidx, true);
                if (c0) {
                    c0.rowSpan = (c0.rowSpan || 1) + (cs[c].rowSpan || 1);
                }
            }
        } else {
            $(cs[c]).updateText(label, true);
            cs[c].style.cssText = css || this._hstyles[cidx];
        }
        return this;

        function _buildIndexes(tr, ind) {
            if (ind != 0 || !tr || tr._childIndexes) return;
            var cs = tr.childNodes;
            var idxs = tr._childIndexes = [];
            for (var g = 0; g < cs.length; g++) {
                idxs[cs[g]._cellIndex] = g;
            }
        }
    }

    dhtmlXGridObject.prototype.adjustIndexes = function (tr, cidx, dis, cth) {
        if (!tr || !tr._childIndexes) return;
        var idxs = tr._childIndexes;
        if (dis) for (var g = idxs.length - 1; g >= cidx; g--) {
            idxs[g] += dis;
        }
        if (cth === null) {
            idxs.splice(cidx, 1);
        } else if (cth) {
            idxs.splice(cidx, 0, cth);
        }
    }

    dhtmlXGridObject.prototype.setHeaderHtml = function (cidx, html, ind) {
        cth = this.toColIndex(cth);
        var z = this.hdr.rows[(ind || 0) + 1];
        for (var i = 0; i < z.cells.length; i++) {
            if (z.cells[i]._cellIndexS == cth) return $(z.cells[i]).update(html);
        }
    }

    dhtmlXGridObject.prototype.setFooterText = function (cth, txt, idx) {
        cth = this.toColIndex(cth);
        var z = this.ftr.rows[(idx || 0) + 1];
        for (var i = 0; i < z.cells.length; i++) {
            if (z.cells[i]._cellIndexS == cth) {
                var c = $(z.cells[i]), elm; if (elm = c.down()) c = elm;
                return elm.updateText(txt, true);
            }
        }
        return ""
    }

    dhtmlXGridObject.prototype.getFooterText = function (cth, ind) {
        return this.getHeaderLabel(cth, ind, this.ftr);
    }

    dhtmlXGridObject.prototype.setDateFormat = function (mask, incoming) {
        this._dtmask = mask; this._dtmask_inc = incoming;
    }

    dhtmlXGridObject.prototype.setCellExcellType = function (row, colIndex, type) {
        this.changeCellType(this.getRow(row), this.toColIndex(colIndex), type);
    }

    dhtmlXGridObject.prototype.setColumnExcellType = function (colIndex, type) {
        colIndex = this.toColIndex(colIndex);
        for (var i = 0; i < this.rowsBuffer.length; i++)
            if (this.rowsBuffer[i] && this.rowsBuffer[i].tagName == "TR")
                this.changeCellType(this.rowsBuffer[i], colIndex, type);

        if ((type.indexOf("[") != -1)) {
            var z = type.split(/[\[\]]+/g);
            this.cellType[colIndex] = z[0];
            this.defVal[colIndex] = z[1];
            if (z[1].indexOf("=") == 0) {
                this.cellType[colIndex] = "math";
                this._strangeParams[colIndex] = z[0]
            }
        } else {
            this.cellType[colIndex] = type;
        }
    }

    dhtmlXGridObject.prototype.changeCellType = function (r, ind, type) {
        type = type || this.cellType[ind];
        var z = this.cells3(r, ind);
        var v = z.getValue();
        z.cell._cellType = type;
        var z = this.cells3(r, ind);
        z.setValue(v)
    }

    dhtmlXGridObject.prototype.enableDistributedParsing = function (mode, count, time) {
        if (dhx4.s2b(mode)) {
            this._ads_count = count || 10;
            this._ads_time = time || 250;
        } else
            this._ads_count = 0;
    }

    replaceMethods("dhtmlXGridObject", {
        clearChangedState: function (rid) {
            if (rid) {
                var row = this.getRowById(rid);
                if (!row) return;
                if (row._added) {
                    row._added = false;
                    this.callEvent('onCellStateChanged', [rid, null, false])
                }
                var that = this;
                this.forEachCell(rid, function (cell, col) {
                    if (cell.wasChanged()) {
                        cell.cell.wasChanged = false;
                        that.callEvent('onCellStateChanged', [rid, col, false]);
                    }
                });
            } else {
                this.forEachRow(function (rid) {
                    this.clearChangedState(rid);
                });
                this.clearDeletedCache();
            }
        },

        // override the method, deleteSelectedRows, to fix the bug for select
        deleteSelectedRows: function () {
            var num = this.selectedRows.length;
            if (num == 0) return;

            var tmpAr = this.selectedRows;
            this.selectedRows = dhtmlxArray();
            var osel = this.row ? this.getRowIndex(this.row.idd) : 0;
            var ind = -1;
            for (var i = num - 1; i >= 0; i--) {
                var node = tmpAr[i];
                if (!this.deleteRow(node.idd, node)) {
                    this.selectedRows[this.selectedRows.length] = node
                } else {
                    if (node == this.row) {
                        var ind = osel;
                    }
                }
            }
            if (ind >= 0) {
                try {
                    if (ind >= this.rowsCol.length) ind--;
                    this.selectCell(ind, 0, true);
                } catch (er) {
                    this.row = null; this.cell = null;
                }
            }
        }
    });

    dhtmlXGridObject.prototype.getTopRowIndex = function () {
        var top = this.objBox.scrollTop || 0;
        if (top <= 0) return 0;

        var r = Math.ceil(top / 20);

        var c = this.getFirstCell(r, true);
        if (c == null) return 0;

        var lr = r;
        while (c && c.offsetTop > top) {
            lr = r;
            r--;
            c = this.getFirstCell(r, true);
        }
        while (c && c.offsetTop < top) {
            lr = r;
            r++;
            c = this.getFirstCell(r, true);
        }
        return lr;
    };

    dhtmlXGridObject.prototype.getNextRowId = function (row, circle) {
        var c = this.getRowsNum();
        var r = this.toRowId(row);
        if (!r || c < 1) return;
        r = this.getRowIndex(r) + 1;
        if (circle) r %= c;
        else r = Math.min(r, c - 1);
        return this.toRowId(r);
    };

    ////////////////////////////////////////////////////////////////////////////////
    // other extensions
    dhtmlXGridObject.prototype.focusable = function (able) {
        this._focusable = !!able;
    }

    dhtmlXGridObject.prototype.toColIndex = function (col) {
        var cth = parseInt(col);
        if (isNaN(cth)) cth = this.getColIndexById(col);
        return cth;
    }

    dhtmlXGridObject.prototype.toColId = function (col) {
        if (typeof col == 'number') col = this.getColumnId(col);
        return col;
    }

    dhtmlXGridObject.prototype.hasColumn = function (col) {
        col = this.toColIndex(col);
        return col >= 0 && col < this._cCount;
    }

    dhtmlXGridObject.prototype.getFirstCell = function (r, disp) {
        var r = this.getRow(r);
        if (r == null) return null;
        var c = r.childNodes[0];
        if (disp) {
            while (c && c.style.display == "none") c = c.nextSibling;
        }
        return c;
    }

    dhtmlXGridObject.prototype.setColColor = function (col, clr) {
        col = this.toColIndex(col);
        if (col < 0) return;
        while (this.columnColor.length < col) this.columnColor.push('');
        this.columnColor[col] = clr;

        this.forEachRow(function (rid) {
            if (this.rowsAr[rid] && this.rowsAr[rid].tagName == "TR") {
                Element.writeAttribute(this.cells(rid, col).cell, 'bgcolor', clr);
            }
        })
    }

    dhtmlXGridObject.prototype.setCellTextBold = function (rid, col, bold) {
        var c = this.getCell(rid, col);
        if (!c) return;
        (bold != null) || (bold = "bold");
        c.cell.style.fontWeight = bold;
    }

    dhtmlXGridObject.prototype.setColTextBold = function (col, bold) {
        col = this.toColIndex(col);
        if (col < 0) return;

        (bold != null) || (bold = "bold");
        this.forEachRow(function (rid) {
            if (this.rowsAr[rid] && this.rowsAr[rid].tagName == "TR") {
                this.cells(rid, col).cell.style.fontWeight = bold;
            }
        })
    }

    dhtmlXGridObject.prototype.setColValidator = function (col, v) {
        col = this.toColIndex(col);
        if (col < 0) return;
        if (!this._validators) this._validators = {};
        var vs = this._validators.data;
        if (!vs) vs = this._validators.data = [];
        while (vs.length < col) vs.push('');
        vs[col] = v;
    }

    dhtmlXGridObject.prototype.setCellStyle = function (row, col, style) {
        var c = this.getCell(row, col);
        if (c) {
            $(c.cell).setStyle(style);
        }
    }

    // other extensions
    dhtmlXGridObject.prototype.enableQuickEdit = function () {
        this.enableEditTabOnly(true);
        this.enableEditEvents(true, false, false);
        this.attachEvent("onEnter", function (id, ind) {
            this._key_events["k9_0_0"].call(this);
        });
    }

    dhtmlXGridObject.prototype.reverseSelected = function () {
        var selar = this.getSelectedRowIds();
        this.clearSelection();
        this.forEachRow(function (rid) {
            for (var i = selar.length - 1; i >= 0; i--)
                if (rid == selar[i]) {
                    selar.splice(i, 1)
                    return;
                }
            this.selectRowById(rid, true, false, true);
        });
    }

    dhtmlXGridObject.prototype.getRowIds = function () {
        var ar = [];
        for (var i = 0; i < this.rowsBuffer.length; i++) if (this.rowsBuffer[i]) ar.push(this.rowsBuffer[i].idd);
        return ar;
    }

    // return null, for non-selection
    dhtmlXGridObject.prototype.getSelectedIds = function () {
        var selAr = this.getSelectedRowIds();
        if (selAr.length == 0) return null;
        return selAr;
    }

    // always return a array
    dhtmlXGridObject.prototype.getSelectedRowIds = function () {
        var selAr = []; var uni = {};
        var sels = this.selectedRows;
        for (var i = 0; i < sels.length; i++) {
            var id = sels[i].idd; if (uni[id]) continue;
            selAr[selAr.length] = id; uni[id] = true;
        };
        return selAr;
    }

    dhtmlXGridObject.prototype.isRowSelected = function (rid) {
        var sels = this.selectedRows;
        for (var i = 0; i < sels.length; i++) {
            if (rid == sels[i].idd) return true;
        }
        return false;
    }

    dhtmlXGridObject.prototype.deselectRow = function (rid) {
        rid = this.toRowId(rid);
        if (!rid) return;
        var sels = this.selectedRows;
        for (var i = 0; i < sels.length; i++) {
            if (rid == sels[i].idd) {
                sels.splice(i, 1);
                var r = this.rowsAr[rid];
                if (r) r.className = r.className.replace(/rowselected/g, "");
                break;
            }
        }
        if (this.cell != null && this.cell.parentNode.idd == rid) {
            this.cell.className = this.cell.className.replace(/cellselected/g, "");
            this.cell = null;
        }
    }

    dhtmlXGridObject.prototype.getFocusedCell = function () {
        return this.cell;
    }

    dhtmlXGridObject.prototype.getFocusedColId = function () {
        var c = this.getFocusedCell();
        return c == null ? null : this.toColId(c._cellIndex);
    }

    dhtmlXGridObject.prototype.getFocusedRowId = function () {
        var rid = this.row ? this.row.idd : null;
        if (rid != null && this.doesRowExist(rid)) return rid;
        return null;
    }

    dhtmlXGridObject.prototype.rowDataHash2Array = function (data) {
        (data == null) && (data = {});
        var text = [];
        var v;
        for (var col = 0; col < this._cCount; col++) {
            v = data[this.getColumnId(col)];
            text.push(v == null ? '' : v);
        }
        return text;
    }

    // set values for all columns
    dhtmlXGridObject.prototype.addRowJson = function (rid, data, ind, sel) {
        var r = this.addRow(rid, this.rowDataHash2Array(data), ind == null ? -1 : ind);
        this.callEvent('onCellStateChanged', [rid, null, true])
        if (sel) this.selectRow(r, true, false, true);
        return r;
    }

    // only update columns in the data
    dhtmlXGridObject.prototype.updateRowJson = function (rid, data, all, add, ind) {
        if (!this.doesRowExist(rid)) {
            if (add || add === undefined) return this.addRowJson(rid, data, ind);
        } else {
            var idx = this.getRowIndex(rid);
            if (idx < 0) return;	// to avoid bug in tree grid
            var cid;
            var v;
            all = !!all;
            for (var col = 0; col < this._cCount; col++) {
                cid = this.getColumnId(col);
                v = data[cid];
                if (all || v !== undefined) {	// update all columns or the value is NOT undefined
                    this.cellByIndex(idx, col).setValue(v == null ? '' : v);
                    this.callEvent('onCellStateChanged', [rid, col, true])
                }
            }
            return idx;
        }
    }

    dhtmlXGridObject.prototype.hasData = function () {
        return this.rowsBuffer.length > 0
            || this._f_rowsBuffer && this._f_rowsBuffer.length > 0;
    }

    dhtmlXGridObject.prototype.isRowLoaded = function (row_index) {
        return this.rowsBuffer[row_index] != null;
    }

    // donly: for data only
    dhtmlXGridObject.prototype.getRowByIndex = function (row_index, donly) {
        return donly ? this.rowsBuffer[row_index] : this.render_row(row_index);
    }

    dhtmlXGridObject.prototype.getRow = function (row, donly) {
        var r = null;
        if (row == null) return null;
        if (row.childNodes != null) r = row;	// row is a grid row object
        if (r == null && typeof row == 'number') r = this.getRowByIndex(row, donly);
        if (r == null || r < 0) {
            r = this.getRowById(row);
        }
        return r;
    }

    dhtmlXGridObject.prototype.toRowId = function (row) {
        var r = this.getRow(row, true) || {};
        return r.idd;
    }

    dhtmlXGridObject.prototype.getCell = function (row, col) {
        if (row == null || col == null) return null;
        col = this.toColIndex(col);

        var r = this.getRow(row);
        if (r == null || !r.childNodes) return null;

        var cell = (r._childIndexes ? r.childNodes[r._childIndexes[col]] : r.childNodes[col]);
        if (cell) return this.cells4(cell)
        return null;
    };

    dhtmlXGridObject.prototype.setUserData = function (row, name, data) {
        row = this.getRow(row);
        var ud = row._ud || (row._ud = {});
        ud[name || '.'] = data;
    };

    dhtmlXGridObject.prototype.getUserData = function (row, name, def) {
        row = this.getRow(row);
        if (row && row._ud) return ud[name || '.'];
        return def;
    };

    dhtmlXGridObject.prototype.getEditor = function (row, col) {
        var c = this.getCell(row, col);
        return c ? c.getInput() : null;
    };

    // to avoid render the row
    dhtmlXGridObject.prototype.getValue = function (row, col) {
        var row = this.getRow(row, true);
        if (!row || row == -1) return null;
        return this._get_cell_value(row, this.toColIndex(col));
    }

    dhtmlXGridObject.prototype.getFocusedValue = function (col) {
        return this.getValue(this.row, col);
    }

    dhtmlXGridObject.prototype.getCaption =
    dhtmlXGridObject.prototype.getText = function (row, col) {
        var cell = this.getCell(row, col);
        if (cell) {
            if (cell.getContent) return cell.getContent();
            if (cell.getText) return cell.getText();
            return cell.getValue();
        }
    }

    dhtmlXGridObject.prototype.isEmpty = function (row, col) {
        var cell = this.getCell(row, col);
        return cell == null || cell.cell._clearCell || !cell.getValue();
    }

    dhtmlXGridObject.prototype.getInt = function (row, col, def) {
        return Object.intValue(this.getValue(row, col), def);
    }

    dhtmlXGridObject.prototype.getFloat = function (row, col, def) {
        return Object.floatValue(this.getValue(row, col), def);
    }

    dhtmlXGridObject.prototype.setValue = function (row, col, val, changed) {
        //		if (!changed){
        //			row = this.getRow(row, true);
        //			if (row._setter)row._setter(row.data, this.toColIndex(col), val);
        //			return;
        //		}
        var cell = this.getCell(row, col);
        if (cell) {
            if (changed) {
                changed = (val != cell.getValue());
                if (changed) {
                    cell.cell.wasChanged = true;
                    this.callEvent('onCellStateChanged', [this.toRowId(row), col, true]);
                    return cell.setValue(val);
                }
            } else {
                return cell.setValue(val);
            }
        }
    }

    dhtmlXGridObject.prototype.editCell2 =
    dhtmlXGridObject.prototype.selectAndEdit = function (row, col) {
        var that = this;
        (function () {
            that.selectCell(that.getRow(row), that.toColIndex(col), false, true, true);
        }).defer();
    }

    dhtmlXGridObject.prototype.editNextCell = function (row, col) {
        var c = this._getNextCell(null, 1);
        if (c) this.editCell2(c.parentNode, c._cellIndex);
    }

    dhtmlXGridObject.prototype.setAsAddedRow = function (rowid) {
        if (rowid) {
            var row = this.getRowById(rowid);
            if (row) {
                row._added = true;
                this.callEvent('onCellStateChanged', [rowid, null, true])
            }
        } else {
            this.forEachRow(function (rowid) {
                this.getRowById(rowid)._added = true;
                this.callEvent('onCellStateChanged', [rowid, null, true])
            });
        }
    }

    dhtmlXGridObject.prototype.isAddedRow = function (row) {
        var row = this.getRow(row);
        return row && row._added;
    }

    dhtmlXGridObject.prototype.rowChanged = function (row, inc_new, exColIds) {
        exColIds = Object.toHash(exColIds);
        var row = this.getRow(row);
        if (row) {
            if (inc_new && row._added) return true;
            var c;
            for (var j = 0; j < this._cCount; j++) {
                c = (row._childIndexes ? row.childNodes[row._childIndexes[j]] : row.childNodes[j])
                if (c.wasChanged) {
                    if (exColIds[this.getColumnId(j)]) continue;
                    return true;
                }
            }
        }
        return false;
    }

    dhtmlXGridObject.prototype.hasChanged = function (inc_new, exColIds) {
        exColIds = Object.toHash(exColIds);
        var rt = false;
        try {
            this.forEachRow(function (id) {
                if (rt = this.rowChanged(id, inc_new, exColIds)) throw true;
            });
        } catch (ex) {
        }
        return rt;
    }

    dhtmlXGridObject.prototype.setCellChanged = function (row, col, changed) {
        var cell = this.getCell(row, col);
        if (cell) cell.cell.wasChanged = changed;
    }

    dhtmlXGridObject.prototype.cellChanged = function (row, col) {
        var cell = this.getCell(row, col);
        return cell && cell.wasChanged();
    }

    // get all changed id in Array, but exclude the changed col id in the exColIds
    dhtmlXGridObject.prototype.getChangedRowIds = function (and_added, exColIds) {
        // prepare the exColIds
        if (exColIds) {
            switch (Object.prototype.toString.call(exColIds)) {
                case '[object String]':
                    exColIds = exColIds.split(this.delim);
                    // cascade down
                case '[object Array]':
                    var cols = {};
                    for (var i = 0; i < exColIds.length; i++) {
                        cols[exColIds[i]] = true;
                    }
                    exColIds = cols;
                    break;
                default:
                    for (var p in exColIds) exColIds[p] = true;
            }
        } else
            exColIds = {};

        var res = [];
        this.forEachRow(function (id) {
            var row = this.rowsAr[id];
            if (row.tagName != "TR") return;
            var cols = row.childNodes.length;
            if (row._added) {
                if (and_added) res[res.length] = row.idd;
            } else {
                var c;
                for (var j = 0; j < cols; j++) {
                    c = (row._childIndexes ? row.childNodes[row._childIndexes[j]] : row.childNodes[j])
                    if (c.wasChanged) {
                        if (exColIds[this.getColumnId(j)]) continue;
                        res[res.length] = row.idd;
                        break
                    }
                }
            }
        })
        return res
    }

    // collect data of the row. return hash: column id/index -> value
    // default: use the id as key
    dhtmlXGridObject.prototype.getRowData = function (rid, usecid) {
        var data = {};
        var that = this;
        if (usecid == undefined) usecid = true;
        rid = this.toRowId(rid);
        this.forEachCell(rid, function (cell, col) {
            data[usecid ? that.getColumnId(col) : col] = cell.getValue();
        });
        return data;
    }

    dhtmlXGridObject.prototype.getAllVisibleRowIds = function (separator) {
        var ar = [];
        var row;
        for (var i = 0, l = this.rowsBuffer.length; i < l; i++) {
            row = this.rowsBuffer[i];
            if (row && row.style.display != "none") {
                ar.push(row.idd);
            }
        }
        return ar.join(separator || this.delim);
    }

    /*
        check if exists any checked row quickly
        to avoid use getCheckedRowIds
    */
    Boolean.isTrue = function (val) {
        return !!val && val != '0' && val != (false + '');
    }
    dhtmlXGridObject.prototype.hasCheckedRow = function (col) {
        col = this.toColIndex(col);
        for (var a = 0, l = this.rowsBuffer.length; a < l; a++) {
            if (Boolean.isTrue(this.getValue(a, col))) return true;
        }
        return false;
    }

    dhtmlXGridObject.prototype.setCheckedAll2 = function (col, chd, call, changed) {
        col = this.toColIndex(col);
        var that = this;
        this.forEachRow(function (id) {
            var c = that.cells(id, col);
            if (!c.isDisabled()) that.setChecked(id, col, chd, call, changed);
        });
    }

    // get all check row id for ch/ra, based on the column
    dhtmlXGridObject.prototype.getCheckedRowIds = function (col) {
        col = this.toColIndex(col);
        var ids = [], r;
        for (var a = 0, l = this.rowsBuffer.length; a < l; a++) {
            r = this.getRowByIndex(a, true);
            if (Boolean.isTrue(this.getValue(r, col))) ids.push(r.idd);
        }
        return ids;
    }

    dhtmlXGridObject.prototype.setCheckedAll = function (col, chd, call, changed) {
        col = this.toColIndex(col);
        this.setCheckedRows(col, chd ? 1 : 0);
    }

    // toggle the checkbox
    dhtmlXGridObject.prototype.toggleChecked = function (row, col, call, changed) {
        var c = this.getCell(row, col);
        if (c && c.isChecked) {
            this.setChecked(row, col, !c.isChecked(), call, changed);
        }
    }

    // setChecked
    dhtmlXGridObject.prototype.setChecked = function (row, col, checked, call, changed) {
        if (checked === undefined) checked = true;
        this.setValue(row, col, checked ? eXcell_ch.CHECKED_VAL : eXcell_ch.UNCHECKED_VAL, changed);
        if (checked && !this.cells(row, this.toColIndex(col)).isChecked()) this.cells(row, this.toColIndex(col)).changeState();
        if (!checked && this.cells(row, this.toColIndex(col)).isChecked()) this.cells(row, this.toColIndex(col)).changeState();
        if (call) {
            var c = this.getCell(row, col);
            if (c && c.isChecked) {
                
                this.callEvent('onCheck', [c.cell.parentNode.idd, c.cell._cellIndex, checked]);
                this.callEvent('onCheckbox', [c.cell.parentNode.idd, c.cell._cellIndex, checked]);
            }
        }
    }

    // isChecked
    dhtmlXGridObject.prototype.isChecked = function (row, col) {
        var c = this.getCell(row, col);
        return c && c.isChecked && c.isChecked();
    }

    dhtmlXGridObject.prototype.checkSelect = function (cth) {
        cth = this.toColIndex(cth);
        this.attachEvent('onCheck', function (rid, cidx, state) {
            if (cidx != cth) return;
            if (state) {
                this.selectRowById(rid, true, false, false);
            } else {
                this.deselectRow(rid);
            }
        });
        this.attachEvent('onSelectStateChanged', function (ids, oids) {
            if (!ids) ids = [];
            else ids = ids.split(this.delim);
            if (!oids) oids = [];
            else oids = oids.split(this.delim);
            var idx;
            for (var i = ids.length - 1; i >= 0; i--) {
                if ((idx = oids.indexOf(ids[i])) >= 0) {
                    oids.splice(idx, 1);
                } else {
                    this.setChecked(ids[i], cth, true, false);
                }
            }
            for (var i = 0, l = oids.length; i < l; i++) {
                this.setChecked(oids[i], cth, false, false);
            }
        });
    }

    // sort relative
    dhtmlXGridObject.prototype.clearSortState = function () {
        this.setSortImgState(false);
    }

    dhtmlXGridObject.prototype.sortRowsEx = function (col, type, order) {
        col = this.toColIndex(col);
        this.sortRows(col, type, order);
        this.setSortImgState(true, col, order);
    }

    // for treegrid -----------------------
    dhtmlXGridObject.prototype.getSubItemIds = function (c) {
        var h = [];
        var g = this._h2.get[c || 0];
        if (g) {
            for (var a = 0; a < g.childs.length; a++) {
                h.push(g.childs[a].id)
            }
        }
        return h;
    };

    // for sub row -----------------------
    dhtmlXGridObject.prototype.isSubRowOpened = function (row) {
        row = this.getRow(row);
        return row && row._expanded;
    }

    dhtmlXGridObject.prototype.closeAllSubRow = function (col, exRowIds) {
        if (exRowIds) {
            switch (Object.prototype.toString.call(exRowIds)) {
                case '[object String]':
                    exRowIds = exRowIds.split(this.delim);
                    // cascade down
                case '[object Array]':
                    var cols = {};
                    for (var i = 0; i < exRowIds.length; i++) {
                        cols[exRowIds[i]] = true;
                    }
                    exRowIds = cols;
                    break;
                default:
                    for (var p in exRowIds) exRowIds[p] = true;
            }
        } else exRowIds = {};

        col = this.toColIndex(col);
        this.forEachRow(function (id) {
            if (!exRowIds[id]) {
                var c = this.cells(id, col);
                if (c && this.isSubRowOpened(id)) c.close();
            }
        });
    }

    dhtmlXGridObject.prototype.openSubRow = function (row, col) {
        var c = this.getCell(row, col);
        if (c && c.open && !this.isSubRowOpened(row)) c.open();
    }

    dhtmlXGridObject.prototype.closeSubRow = function (row, col) {
        var c = this.getCell(row, col);
        if (c && c.close && this.isSubRowOpened(row)) c.close();
    }

    dhtmlXGridObject.prototype.getSubRowGrid = function (row, col, bopen) {
        if (row == null) row = this.getFocusedRowId();
        var c = this.getCell(row, col);
        if (!c || !c.getSubGrid) return null;
        var sg = c.getSubGrid();
        if (!sg && bopen) {
            c.open(); sg = c.getSubGrid();
        }
        return sg;
    }

    dhtmlXGridObject.prototype.redrawSubRowGrid = function (row, col) {
        var c = this.getCell(row, col);
        if (c && c.open && this.isSubRowOpened(row)) {
            c.close(); c.open();
        }
    }

    dhtmlXGridObject.prototype.filtered = function () {
        return this._f_rowsBuffer && this._f_rowsBuffer.length > this.rowsBuffer.length;
    }

    dhtmlXGridObject.prototype.unfilter = function () {
        this.filterBy(0, ""); //unfilter
        this._f_rowsBuffer = null; //clear cache
    }

    dhtmlXGridObject.prototype.resetFilters = function () {
        if (!this.filters) return;
        for (var a = 0, l = this.filters.length; a < l; a++) {
            var e = this.filters[a][0];
            switch (e.tagName.toLowerCase()) {
                case "select":
                case "input":
                    $(e).setValue('');
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // load/parse funcitons for record set
    dhtmlXGridObject.prototype.isParsing = function () {
        return this._parsing;
    }

    dhtmlXGridObject.prototype.setRowCount = function (c) {
        var len = this.rowsBuffer.length;
        if (len < c) this.rowsBuffer[c - 1] = null;
        else this.rowsBuffer.splice(c);
    }

    // same as jsarray, just use the unique id as the row id
    dhtmlXGridObject.prototype._process_jsarrayu = function (data) {
        this._parsing = true;
        for (var i = 0; i < data.length; i++) {
            var id = nw2.uid();
            this.rowsBuffer.push({
                idd: id,
                data: data[i],
                _parser: this._process_jsarray_row,
                _locator: this._get_jsarray_data
            });
            this.rowsAr[id] = data[i];
        };
        this.render_dataset();
        this._parsing = false;
    }

    dhtmlXGridObject.prototype._process_rs_row = function (r, pos) {
        r._attrs = {};
        for (var j = 0; j < r.childNodes.length; j++) r.childNodes[j]._attrs = {};

        var data = [];
        if (this._rs.absolute(pos)) data = this.rowDataHash2Array(this._rs.record());
        this._fillRow(r, (this._c_order ? this._swapColumns(data) : data));
        return r
    }

    dhtmlXGridObject.prototype._locator_rs = function (pos, cidx) {
        if (this._rs.absolute(pos)) {
            return this._rs.getValue(this.getColumnId(cidx));
        }
    }

    dhtmlXGridObject.prototype._process_rs = function (rs) {
        if (rs.absolute == null) return; // not a recordset object
        if (this._refresh_mode) return this._refreshFromRs(rs);

        this._parsing = true;

        var len = this.rowsBuffer.length;
        this.setRowCount(rs.total());

        var start = rs.start() || 0;
        if (this._rs == null || len < 1) this._rs = rs;
        else {
            this._rs.replace(start, rs, rs.size());
        }

        var end = start + rs.size();
        rs = this._rs;
        var id, rb = this.rowsBuffer;
        for (var r = start; r < end; r++) {
            if (!rs.absolute(r)) break;
            id = rs.m_key ? rs.getValue(rs.m_key) : 0;
            id || (id = nw2.uid());
            rb[r] = {
                idd: id,
                data: r,
                _parser: this._process_rs_row,
                _locator: this._locator_rs
            };
            this.rowsAr[id] = r;
        }
        this.render_dataset(start, end);
        this._parsing = false;
        this.callEvent("onGridReconstructed", []);
    }

    dhtmlXGridObject.prototype.updateFromRs = function (rs, insert_new, del_missed, afterCall) {
        alert('Implement in future!');
    }
    ////////////////////////////////////////////////////////////////////////////////
    // special for iBOS
    dhtmlXGridObject.prototype.__delrs = dhtmlxArray();

    dhtmlXGridObject.prototype.setDatasetId = function (did) {
        this._did = did;
    }

    dhtmlXGridObject.prototype.__keepDeletedRow = function (rid) {
        var row = this.getRowById(rid);
        if (row) {
            if (!row._added) {
                this.__delrs.push(row);
            }
        }
    }

    dhtmlXGridObject.prototype.enableDeletedRowCache = function () {
        this.attachEvent('onBeforeRowDeleted', function (rid) {
            this.__keepDeletedRow(rid);
            return true;
        });

        this.attachEvent("onRowAdded", function (rid) {
            for (var i = 0, l = this.__delrs.length; i < l; i++) {
                if (this.__delrs[i].idd == rid) {
                    this.__delrs.splice(i, 1);
                    this.clearChangedState(rid);
                    break;
                }
            }
        });

        this.attachEvent('onClearAll', function () {
            this.clearDeletedCache();
        });
    }

    dhtmlXGridObject.prototype.clearDeletedCache = function () {
        this.__delrs = dhtmlxArray();
    }

    dhtmlXGridObject.prototype.forEachDeletedCell = function (row, custom_code) {
        if (row) {
            var cell;
            for (var col = 0; col < this._cCount; col++) {
                cell = (row._childIndexes ? row.childNodes[row._childIndexes[col]] : row.childNodes[col]);
                custom_code.apply(this, [this.cells4(cell), col]);
            }
        }
    }

    dhtmlXGridObject.prototype.forEachDeletedRow = function (custom_code) {
        for (var r = 0, l = this.__delrs.length; r < l; r++) {
            if (this.__delrs[r]) custom_code.apply(this, [this.__delrs[r]]);
        }
    }

    dhtmlXGridObject.prototype.getDeletedRowIds = function () {
        var ids = [];
        for (var r = 0, l = this.__delrs.length; r < l; r++) {
            if (this.__delrs[r]) ids.push(this.__delrs[r].idd);
        }
        return ids;
    }

    dhtmlXGridObject.prototype.getDeletedHash = function (h, id_func) {
        if (!h) h = {};
        var id;
        this.forEachDeletedRow(function (row) {
            this.forEachDeletedCell(row, function (cell, col) {
                var cid = cell.grid.getColumnId(col);
                if (!nw2.isVoidId(cid)) {
                    id = (id_func || nw2.deletedId)(this._did, cid, row.idd);
                    if (id) h[id] = cell.getValue();
                }
            });
        });
        return h;
    }

    dhtmlXGridObject.prototype.getDelRowData = function (rid, usecid) {
        var data = {};
        if (usecid == undefined) usecid = true;
        for (var r = 0, l = this.__delrs.length; r < l; r++) {
            if (this.__delrs[r] && this.__delrs[r].idd == rid) {
                this.forEachDeletedCell(this.__delrs[r], function (cell, col) {
                    data[usecid ? this.getColumnId(col) : col] = cell.getValue();
                });
            }
        }

        return data;
    }

    dhtmlXGridObject.prototype.getRowHash = function (h, rid, id_func) {
        if (!h) h = {};
        try {
            var rowth = nw2.uid();
            this.forEachCell(rid, function (cell, col) {
                var cid = cell.grid.getColumnId(col);
                if (!nw2.isVoidId(cid)) {
                    var id = (id_func || nw2.fieldId)(cell.grid._did, cid, rowth, cell);
                    if (id === false) throw false;
                    if (id) h[id] = cell.getValue();
                }
            });
        } catch (ex) {
        }
        return h;
    }

    // if id_func return false, abort
    dhtmlXGridObject.prototype.getChangedHash = function (h, id_func, del) {
        try {
            if (!h) h = {};
            this.forEachRowA(function (rowid) {
                if (this.rowChanged(rowid, true)) {
                    h = this.getRowHash(h, rowid, id_func);
                    if (!h) throw false;
                }
            });
            del === undefined && (del = true);
            if (del) this.getDeletedHash(h, id_func);
            return h;
        } catch (ex) {
        }
    }

    // if id_func return false, abort
    dhtmlXGridObject.prototype.getDataHash = function (h, id_func) {
        try {
            this.forEachRowA(function (rowid) {
                h = this.getRowHash(h, rowid, id_func);
                if (!h) throw false;
            });
            return h;
        } catch (ex) {
        }
    }

    dhtmlXGridObject.prototype.hasAnyChanged = function (and_added, and_del, exColIds) {// prepare the exColIds
        if (exColIds) {
            switch (Object.prototype.toString.call(exColIds)) {
                case '[object String]':
                    exColIds = exColIds.split(this.delim);
                    // cascade down
                case '[object Array]':
                    var cols = {};
                    for (var i = 0; i < exColIds.length; i++) {
                        cols[exColIds[i]] = true;
                    }
                    exColIds = cols;
                    break;
                default:
                    for (var p in exColIds) exColIds[p] = true;
            }
        } else
            exColIds = {};

        var changed = 0;
        try {
            this.forEachRow(function (id) {
                var row = this.rowsAr[id];
                if (row.tagName != "TR") return;
                var cols = row.childNodes.length;
                if (row._added) {
                    if (and_added) changed++;
                } else {
                    var c;
                    for (var j = 0; j < cols; j++) {
                        c = (row._childIndexes ? row.childNodes[row._childIndexes[j]] : row.childNodes[j])
                        if (c.wasChanged) {
                            if (exColIds[this.getColumnId(j)]) continue;
                            changed++;
                            break
                        }
                    }
                }
                if (changed > 0) throw (changed);
            })
        } catch (e) {
        }
        if (and_del && this.__delrs.length > 0) changed++;
        return changed > 0
    }

    dhtmlXGridObject.prototype.forceLoadOthers = function (buffer) {
        var self = this;
        window.setTimeout(function () {
            self.forceFullLoading(buffer)
        },
        100);
    };

    dhtmlXGridObject.prototype.skipTab = function (cth, skip) {
        if (cth instanceof Array) {
            for (var i = 0; i < cth.length; i++) this.skipTab(cth[i], skip);
            return skip;
        }
        var s = this._skipTab || (this._skipTab = []);
        cth = this.toColIndex(cth);
        return skip == null ? s[cth] : (s[cth] = !!skip);
    }
} // dhtmlXGridObject

if (window.dhtmlXGridCellObject) {
    dhtmlXGridCellObject.prototype.skipTab = function (val) {
        return val == null ? (this.cell._skipTab || this.isDisabled() || this.grid.skipTab(this.cell._cellIndex))
            : (this.cell._skipTab = !!val);
    }
} // dhtmlXGridCellObject

if (window.eXcell_cntr) {
    eXcell_cntr.prototype.isDisabled = function () { return true }
}

if (window.eXcell_ch) {
    eXcell_ch.CHECKED_VAL = '1';
    eXcell_ch.UNCHECKED_VAL = '0';
}

if (window.dhtmlXGridComboObject) {
    dhtmlXGridComboObject.prototype.include = function (key) {
        return this.getKeys().include(key);
    };
}

window.eXcell_clist = function (a) {
    try {
        this.cell = a,
        this.grid = this.cell.parentNode.grid
    } catch (b) { }
    this.edit = function () {
        this.val = this.getValue();
        var a = this.cell._combo || (this.grid.clists ? this.grid.clists[this.cell._cellIndex] : {});
        if (a) {
            this.obj = document.createElement("DIV");
            var es = [],
            b = this.val.split(",");
            for (var f in a) {
                var g = !1;
                for (var h = 0; h < b.length; h++) {
                    if (f == b[h]) { g = !0; break; }
                }
                es.push("<div><label><input type='checkbox'" + (g ? "' checked='true'" : "") + " value='" + f + "' />" + a[f] + "</label></div>")
            }
            es.push("<div class='dhx_clist_app_area'><input type='button' value='" + (this.grid.applyButtonText || "应用") + "'  onclick='this.parentNode.parentNode.editor.grid.editStop();'/></div>");
            this.obj.editor = this;
            this.obj.innerHTML = es.join('');
            document.body.appendChild(this.obj);
            this.obj.className = "dhx_clist";
            this.obj.style.position = "absolute";
            var i = this.grid.getPosition(this.cell);
            this.obj.style.left = i[0] + "px";
            this.obj.style.top = Element.alignY(this.obj, this.cell) + "px";
            this.obj.style.width = this.cell.offsetWidth + "px";
            this.obj.getValue = function () {
                for (var a = "", b = 0; b < this.childNodes.length - 1; b++) {
                    var c = this.childNodes[b].firstChild.firstChild;
                    c.checked && (a && (a += ","), a += c.value);
                }
                return a;
            }
            this.obj.getText = function () {
                for (var a = "", b = 0; b < this.childNodes.length - 1; b++) {
                    var cl = this.childNodes[b].firstChild;
                    cl.firstChild.checked && (a && (a += ","), a += cl.textContent);
                }
                return a;
            }
            this.obj.onclick = function (r) {
                (r || event).cancelBubble = true;
                return true
            };
        }
    };
    this.getValue = function () {
        return this.cell._clearCell ? '' : (this.cell._val || '');
    };
    this.detach = function () {
        if (this.obj) {
            this.setValue(this.obj.getValue());
            this.obj.editor = null,
			this.obj.parentNode.removeChild(this.obj),
			this.obj = null;
        }
        return this.val != this.getValue()
    }
}
eXcell_clist.prototype = new eXcell;
eXcell_clist.prototype.setValue = function (a) {
    this.cell._clearCell = !a;
    var txt = '';
    this.cell._val = (a + '') || '';
    var cs = this.cell._combo || (this.grid.clists ? this.grid.clists[this.cell._cellIndex] : {});
    var vs = this.cell._val.split(",");
    for (var b = 0; b < vs.length; b++) {
        cs[vs[b]] && (txt && (txt += ","), txt += cs[vs[b]]);
    }
    this.setCTxtValue(txt);
    this.cell._txt = txt;
};

eXcell_clist.prototype.setText = function (a) {
    this.setCTxtValue(a);
    this.cell._txt = a;
};

dhtmlXGridObject.prototype.registerCList = function (a, c) {
    if (!this.clists) {
        this.clists = new Array()
    }
    if (c instanceof String) {
        c = c.split(",")
    }
    if (c instanceof Array) {
        var co = {};
        for (var i = 0, l = c.length; i < l; i++) {
            co[c[i] + ''] = co[c[i]];
        }
    }
    this.clists[a] = c
};

// dhtmlXCalendarObject >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
if (window.dhtmlXCalendarObject) {
    replaceMethods('dhtmlXCalendarObject', {
        _updateCellStyle: function (q, w) {
            var r = this.contDates.childNodes[q].childNodes[w];
            var s = "dhtmlxcalendar_cell dhtmlxcalendar_cell";
            // this/another month
            s += (r._css_month ? "_month" : "");
            // selected date
            s += (r._css_date ? "_date" : "");
            // is weekend
            s += (r._css_weekend ? "_weekend" : "");
            // is holiday
            s += (r._css_holiday ? "_holiday" : "");
            // is cell disabled
            s += (r._css_dis ? "_dis" : "");
            // is cell hover (only if not disabled)
            s += (r._css_hover && !r._css_dis ? "_hover" : "");
            // is today
            var td = new Date(); td.setHours(0, 0, 0, 0);
            if (td.getTime() == r._date.getTime()) s += ' dhtmlxcalendar_cell_today';

            r.className = s;
            r = null;
        },
        show: function (id, toggle) {
            // if id not set - try show in container
            if (!id && this._hasParent) {
                this._show();
                return;
            }
            // if input id not specified show near first found
            // if nothing found - do not show
            if (typeof (id) == "object" && typeof (id._dhtmlxcalendar_uid) != "undefined" && this.i[id._dhtmlxcalendar_uid] == id) {
                this._updateDateStr(id.value);
                this._show(id._dhtmlxcalendar_uid, toggle);
                return;
            }
            if (typeof (id) == "undefined") { for (var a in this.i) if (!id) id = a; }
            if (!id) return;
            this._show(id);
        },

        attachObj: function (obj, trigger) {
            obj = $(obj); trigger = $(trigger);
            if (trigger) {
                $P(obj, '_trigger', trigger.identify());
            }
            if (obj._dhtmlxcalendar_uid) return; // already attached
            var a = dhtmlx.uid();
            this.i[a] = obj;
            obj._dhtmlxcalendar_uid = a;
            this._attachEventsToObject(a);
        },

        detachObj: function (obj) {
            if (obj === undefined) {
                for (var a in this.i) {
                    this.detachObj(this.i[a]);
                }
                return;
            }
            obj = $(obj);
            if (!obj) return;
            var a = obj._dhtmlxcalendar_uid;
            if (this.i[a] != null) {
                this._detachEventsFromObject(a);
                this.i[a]._dhtmlxcalendar_uid = null;
                this.i[a] = null;
                delete this.i[a];
            }
        },

        _detachEventsFromObject: function (a) {
            if (this.i[a].button != null) {
                if (window.addEventListener) {
                    this.i[a].button.removeEventListener("click", this._doOnBtnClick, false);
                } else {
                    this.i[a].button.detachEvent("onclick", this._doOnBtnClick);
                }
            } else if (this.i[a].input != null) {
                var o = this.i[a].input;
                if (window.addEventListener) {
                    this.i[a].input.removeEventListener("click", this._doOnInpClick, false);
                    this.i[a].input.removeEventListener("keyup", this._doOnInpKeyUp, false);
                    if (o._trigger) {
                        $(o._trigger).removeEventListener("click", this._doOnTriggerClick, false);
                    }
                } else {
                    this.i[a].input.detachEvent("onclick", this._doOnInpClick);
                    this.i[a].input.detachEvent("onkeyup", this._doOnInpKeyUp);
                    if (o._trigger) {
                        $(o._trigger).detachEvent("onclick", this._doOnTriggerClick);
                    }
                }
            }
        }
    });

    // inputs events
    dhtmlXCalendarObject.prototype._doOnInpClick = function (e) {
        e = e || event;
        var t = (e.target || e.srcElement);
        if ($P(t, '_triggeronly')) return;
        if (!t._dhtmlxcalendar_uid) return;
        this._updateDateStr(t.value);
        this._show(t._dhtmlxcalendar_uid, true);
    }

    dhtmlXCalendarObject.prototype._doOnTriggerClick = function (e) {
        e = e || event;
        var o = (e.target || e.srcElement);
        if (o) o = $($P(o, '_input'));
        if (!o || !o._dhtmlxcalendar_uid) return;
        this._updateDateStr(o.value || '');
        this._show(o._dhtmlxcalendar_uid, true);
        e.cancelBubble = true;
        return false;
    }

    dhtmlXCalendarObject.prototype._attachEventsToObject = function (a) {
        if (this.i[a].button != null) {
            this.i[a].button._dhtmlxcalendar_uid = a;
            if (window.addEventListener) {
                this.i[a].button.addEventListener("click", this._doOnBtnClick.bindAsEventListener(this), false);
            } else {
                this.i[a].button.attachEvent("onclick", this._doOnBtnClick.bindAsEventListener(this));
            }
        } else if (this.i[a].input != null) {
            var o = this.i[a].input;
            o._dhtmlxcalendar_uid = a;
            var t = $($P(o, '_trigger'));
            if (window.addEventListener) {
                this.i[a].input.addEventListener("click", this._doOnInpClick.bindAsEventListener(this), false);
                this.i[a].input.addEventListener("keyup", this._doOnInpKeyUp.bindAsEventListener(this), false);
                if (t) {
                    t.addEventListener("click", this._doOnTriggerClick.bindAsEventListener(this), false);
                    $P(t, '_input', o.identify());
                }
            } else {
                this.i[a].input.attachEvent("onclick", this._doOnInpClick.bindAsEventListener(this));
                this.i[a].input.attachEvent("onkeyup", this._doOnInpKeyUp.bindAsEventListener(this));
                if (t) {
                    t.attachEvent("onclick", this._doOnTriggerClick.bindAsEventListener(this));
                    $P(t, '_input', o.identify());
                }
            }
        }
    }

    dhtmlXCalendarObject.prototype.getInput = function (uid) {
        if (uid instanceof Object) uid = uid._dhtmlxcalendar_uid;
        uid || (uid = this._activeInp);
        uid && (uid = this.i[uid]);
        return uid ? uid.input : null;
    };

    dhtmlXCalendarObject.prototype.isReadonly = function (elm) {
        var e = $(this.getInput(elm));
        return e && e.isReadonly();
    }

    dhtmlXCalendarObject.prototype._updateInput = function (val, inpId) {
        inpId || (inpId = this._activeInp);
        if (inpId && this.i[inpId] && this.i[inpId].input != null) {
            $(this.i[inpId].input).setValue(val);
        }
    };

    dhtmlXCalendarObject.prototype.langData.zh = {
        dateformat: "%Y-%m-%d",
        monthesFNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthesSNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        daysFNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        daysSNames: ["日", "一", "二", "三", "四", "五", "六"],
        weekstart: 7,
        weekname: "w"
    };
    dhtmlXCalendarObject.prototype.lang = "zh";
} // dhtmlXCalendarObject

////////////////////////////////////////////////////////////////////////////////
// extension or profesional api implementation for dhtmlXTreeObject

// setClientDimension:	_adjustToContent(cx, cy);
var ID_OK = 0x0001;
var ID_CANCEL = 0x0002;
var ID_YES = 0x0004;
var ID_NO = 0x0008;
var ID_RETRY = 0x0010;
var ID_ABORT = 0x0020;
var ID_IGONRE = 0x0040;
var ID_YESALL = 0x0080;
var ID_NOALL = 0x0100;

var MB_OK = ID_OK;
var MB_OKCANCEL = ID_OK | ID_CANCEL;
var MB_ABORTRETRYIGNORE = ID_ABORT | ID_RETRY | ID_IGONRE;
var MB_YESNOCANCEL = ID_YES | ID_NO | ID_CANCEL;
var MB_YESNO = ID_YES | ID_NO;
var MB_RETRYCANCEL = ID_RETRY | ID_IGONRE;

var MB_ICONERROR = 0x00010000;
var MB_ICONQUESTION = 0x00020000;
var MB_ICONEXCLAMATION = 0x00030000;
var MB_ICONINFORMATION = 0x00040000;

var MB_ICONWARNING = MB_ICONEXCLAMATION;
var MB_ICONSTOP = MB_ICONERROR;
var MB_ICONMASK = 0x000F0000;
var MB_BTNMASK = 0x0000FFFF;

var MB_ALERT = MB_OK;
var MB_CONFIRM = MB_YESNO | MB_ICONQUESTION;

if (window.dhtmlXWindows) {
    replaceMethods('dhtmlXWindows', {
        messageBox: function (caption, message, flag, callback) {
            if (flag == null) flag = MB_OK;
            // get the unique id
            var ind = 1;
            var id = '_dialog_' + ind;
            while (this.isWindow(id)) id = '_dialog_' + (++ind);
            var win = this.createWindow(id, 0, 0, 40, 60);
            win.denyResize();
            win.button('minmax1').hide();
            win.button('minmax2').hide();
            win.button('park').hide();
            win.setText(caption || '');

            var box = new Element("div", { 'class': 'msgbox' });

            var div = new Element("div", { 'class': 'msgbox_icon' });
            box.insert(div);
            var img = 'none';
            switch (flag & MB_ICONMASK) {
                case MB_ICONERROR:
                    img = 'msgbox_icon_err';
                    break;
                case MB_ICONQUESTION:
                    img = 'msgbox_icon_que';
                    break;
                case MB_ICONEXCLAMATION:
                    img = 'msgbox_icon_exc';
                    break;
                case MB_ICONINFORMATION:
                case 0:
                    img = 'msgbox_icon_inf';
                    break;
            }
            div.addClassName(img);

            div = new Element("div", { 'class': 'msgbox_msg_div' });
            box.insert(div);
            var span = new Element("span", { 'class': 'msgbox_msg_div_span' });
            span.setText(message);
            div.insert(span);
            var h = div.getHeight();
            if (h < 60) {
                div.setHeight(60);
            }

            // buttons
            div = new Element("div", { 'class': 'msgbox_btnline' });
            box.insert(div);

            // create buttons
            var btn;
            var fcous_elm;
            switch (MB_BTNMASK & flag) {
                case MB_OKCANCEL:
                    btn = new Element("INPUT", { 'id': ID_CANCEL, type: 'button', value: '取消', 'class': 'msgbox_btn' });
                    div.insert(btn);
                    btn.observe('click', onBtnClick);
                    fcous_elm = btn;
                case MB_OK:
                    btn = new Element("INPUT", { 'id': ID_OK, type: 'button', value: '确定', 'class': 'msgbox_btn' });
                    div.insert({ 'top': btn });
                    btn.observe('click', onBtnClick);
                    break;
                case MB_YESNOCANCEL:
                    btn = new Element("INPUT", { 'id': ID_CANCEL, type: 'button', value: '取消', 'class': 'msgbox_btn' });
                    div.insert(btn);
                    btn.observe('click', onBtnClick);
                    fcous_elm = btn;
                case MB_YESNO:
                    btn = new Element("INPUT", { 'id': ID_NO, type: 'button', value: '否', 'class': 'msgbox_btn' });
                    div.insert({ 'top': btn });
                    btn.observe('click', onBtnClick);
                    btn = new Element("INPUT", { 'id': ID_YES, type: 'button', value: '是', 'class': 'msgbox_btn' });
                    div.insert({ 'top': btn });
                    btn.observe('click', onBtnClick);
                    break;
                case MB_RETRYCANCEL:
                    break;
                case MB_ABORTRETRYIGNORE:
                    break;
            }

            win.attachObject(box, true);
            //this.setBkColor(win, 'ButtonFace');

            h = div.positionedOffset().top + div.getHeight() + 20;
            win._adjustByCont(box.getWidth(), h);
            win.centerOnScreen();
            win.setModal(true);
            if (fcous_elm) fcous_elm.focus();

            // set default button
            //			box.focusFirstElement();

            function onBtnClick(evt) {
                if (callback) callback(Object.intValue(evt.element().id));
                win.close();
            }
        }
    });

    dhtmlXWindows.prototype.setBkColor = function (win, color) {
        if (Object.isString(win)) win = this.window(win);
        win = $(win);
        if (!win) return;
        var inner = win.down('.dhtmlx_wins_body_inner');
        var elm = inner.firstDescendant();
        elm.setBkColor(color);
    }

    dhtmlXWindows.prototype.windowElement = function (wid) {
        if (this.w[wid]) {
            return this.w[wid].win;
        }
    }
}