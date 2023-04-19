// ==UserScript==
// @name         TyprMd5
// @namespace    wyn665817@163.com
// @version      1.0
// @description  Typr.js,Typr.U.js,md5.js
// @author       photopea & blueimp
// @homepageURL  https://cdn.jsdelivr.net/combine/gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js,gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js,npm/blueimp-md5@2.19.0/js/md5.min.js
// ==/UserScript==

/**
 * Combined by jsDelivr.
 * Original files:
 * - /gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.min.js
 * - /gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.min.js
 * - /npm/blueimp-md5@2.19.0/js/md5.min.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * Minified by jsDelivr using Terser v5.10.0.
 * Original file: /gh/photopea/Typr.js@15aa12ffa6cf39e8788562ea4af65b42317375fb/src/Typr.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var Typr = {
	parse: function (r) {
		var e = function (r, e, a, t) {
			Typr.B;
			var n = Typr.T, o = {cmap: n.cmap, head: n.head, hhea: n.hhea, maxp: n.maxp, hmtx: n.hmtx, name: n.name, "OS/2": n.OS2, post: n.post, loca: n.loca, kern: n.kern, glyf: n.glyf, "CFF ": n.CFF, "SVG ": n.SVG}, i = {_data: r, _index: e, _offset: a};
			for (var s in o) {
				var d = Typr.findTable(r, s, a);
				if (d) {
					var u = d[0], h = t[u];
					null == h && (h = o[s].parseTab(r, u, d[1], i)), i[s] = t[u] = h
				}
			}
			return i
		}, a = Typr.B, t = new Uint8Array(r), n = {};
		if ("ttcf" == a.readASCII(t, 0, 4)) {
			var o = 4;
			a.readUshort(t, o);
			o += 2;
			a.readUshort(t, o);
			o += 2;
			var i = a.readUint(t, o);
			o += 4;
			for (var s = [], d = 0; d < i; d++) {
				var u = a.readUint(t, o);
				o += 4, s.push(e(t, d, u, n))
			}
			return s
		}
		return [e(t, 0, 0, n)]
	}, findTable: function (r, e, a) {
		for (var t = Typr.B, n = t.readUshort(r, a + 4), o = a + 12, i = 0; i < n; i++) {
			var s = t.readASCII(r, o, 4), d = (t.readUint(r, o + 4), t.readUint(r, o + 8)), u = t.readUint(r, o + 12);
			if (s == e) return [d, u];
			o += 16
		}
		return null
	}, T: {}
};
Typr.B = {
	readFixed: function (r, e) {
		return (r[e] << 8 | r[e + 1]) + (r[e + 2] << 8 | r[e + 3]) / 65540
	}, readF2dot14: function (r, e) {
		return Typr.B.readShort(r, e) / 16384
	}, readInt: function (r, e) {
		var a = Typr.B.t.uint8;
		return a[0] = r[e + 3], a[1] = r[e + 2], a[2] = r[e + 1], a[3] = r[e], Typr.B.t.int32[0]
	}, readInt8: function (r, e) {
		return Typr.B.t.uint8[0] = r[e], Typr.B.t.int8[0]
	}, readShort: function (r, e) {
		var a = Typr.B.t.uint8;
		return a[1] = r[e], a[0] = r[e + 1], Typr.B.t.int16[0]
	}, readUshort: function (r, e) {
		return r[e] << 8 | r[e + 1]
	}, writeUshort: function (r, e, a) {
		r[e] = a >> 8 & 255, r[e + 1] = 255 & a
	}, readUshorts: function (r, e, a) {
		for (var t = [], n = 0; n < a; n++) {
			var o = Typr.B.readUshort(r, e + 2 * n);
			t.push(o)
		}
		return t
	}, readUint: function (r, e) {
		var a = Typr.B.t.uint8;
		return a[3] = r[e], a[2] = r[e + 1], a[1] = r[e + 2], a[0] = r[e + 3], Typr.B.t.uint32[0]
	}, writeUint: function (r, e, a) {
		r[e] = a >> 24 & 255, r[e + 1] = a >> 16 & 255, r[e + 2] = a >> 8 & 255, r[e + 3] = a >> 0 & 255
	}, readUint64: function (r, e) {
		return 4294967296 * Typr.B.readUint(r, e) + Typr.B.readUint(r, e + 4)
	}, readASCII: function (r, e, a) {
		for (var t = "", n = 0; n < a; n++) t += String.fromCharCode(r[e + n]);
		return t
	}, writeASCII: function (r, e, a) {
		for (var t = 0; t < a.length; t++) r[e + t] = a.charCodeAt(t)
	}, readUnicode: function (r, e, a) {
		for (var t = "", n = 0; n < a; n++) {
			var o = r[e++] << 8 | r[e++];
			t += String.fromCharCode(o)
		}
		return t
	}, _tdec: TextDecoder ? new TextDecoder : null, readUTF8: function (r, e, a) {
		var t = Typr.B._tdec;
		return t && 0 == e && a == r.length ? t.decode(r) : Typr.B.readASCII(r, e, a)
	}, readBytes: function (r, e, a) {
		for (var t = [], n = 0; n < a; n++) t.push(r[e + n]);
		return t
	}, readASCIIArray: function (r, e, a) {
		for (var t = [], n = 0; n < a; n++) t.push(String.fromCharCode(r[e + n]));
		return t
	}, t: function () {
		var r = new ArrayBuffer(8);
		return {buff: r, int8: new Int8Array(r), uint8: new Uint8Array(r), int16: new Int16Array(r), uint16: new Uint16Array(r), int32: new Int32Array(r), uint32: new Uint32Array(r)}
	}()
}, Typr.T.CFF = {
	parseTab: function (r, e, a) {
		var t = Typr.B, n = Typr.T.CFF;
		(r = new Uint8Array(r.buffer, e, a))[e = 0], r[++e], r[++e], r[++e];
		e++;
		var o = [];
		e = n.readIndex(r, e, o);
		for (var i = [], s = 0; s < o.length - 1; s++) i.push(t.readASCII(r, e + o[s], o[s + 1] - o[s]));
		e += o[o.length - 1];
		var d = [];
		e = n.readIndex(r, e, d);
		var u = [];
		for (s = 0; s < d.length - 1; s++) u.push(n.readDict(r, e + d[s], e + d[s + 1]));
		e += d[d.length - 1];
		var h = u[0], p = [];
		e = n.readIndex(r, e, p);
		var f = [];
		for (s = 0; s < p.length - 1; s++) f.push(t.readASCII(r, e + p[s], p[s + 1] - p[s]));
		if (e += p[p.length - 1], n.readSubrs(r, e, h), h.CharStrings && (h.CharStrings = n.readBytes(r, h.CharStrings)), h.ROS) {
			e = h.FDArray;
			var l = [];
			e = n.readIndex(r, e, l), h.FDArray = [];
			for (s = 0; s < l.length - 1; s++) {
				var v = n.readDict(r, e + l[s], e + l[s + 1]);
				n._readFDict(r, v, f), h.FDArray.push(v)
			}
			e += l[l.length - 1], e = h.FDSelect, h.FDSelect = [];
			var y = r[e];
			if (e++, 3 != y) throw y;
			var c = t.readUshort(r, e);
			e += 2;
			for (s = 0; s < c + 1; s++) h.FDSelect.push(t.readUshort(r, e), r[e + 2]), e += 3
		}
		return h.charset && (h.charset = n.readCharset(r, h.charset, h.CharStrings.length)), n._readFDict(r, h, f), h
	},
	_readFDict: function (r, e, a) {
		var t, n = Typr.T.CFF;
		for (var o in e.Private && (t = e.Private[1], e.Private = n.readDict(r, t, t + e.Private[0]), e.Private.Subrs && n.readSubrs(r, t + e.Private.Subrs, e.Private)), e) -1 != ["FamilyName", "FontName", "FullName", "Notice", "version", "Copyright"].indexOf(o) && (e[o] = a[e[o] - 426 + 35])
	},
	readSubrs: function (r, e, a) {
		a.Subrs = Typr.T.CFF.readBytes(r, e);
		var t, n = a.Subrs.length + 1;
		t = n < 1240 ? 107 : n < 33900 ? 1131 : 32768, a.Bias = t
	},
	readBytes: function (r, e) {
		Typr.B;
		var a = [];
		e = Typr.T.CFF.readIndex(r, e, a);
		for (var t = [], n = a.length - 1, o = r.byteOffset + e, i = 0; i < n; i++) {
			var s = a[i];
			t.push(new Uint8Array(r.buffer, o + s, a[i + 1] - s))
		}
		return t
	},
	tableSE: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0],
	glyphByUnicode: function (r, e) {
		for (var a = 0; a < r.charset.length; a++) if (r.charset[a] == e) return a;
		return -1
	},
	glyphBySE: function (r, e) {
		return e < 0 || e > 255 ? -1 : Typr.T.CFF.glyphByUnicode(r, Typr.T.CFF.tableSE[e])
	},
	readCharset: function (r, e, a) {
		var t = Typr.B, n = [".notdef"], o = r[e];
		if (e++, 0 == o) for (var i = 0; i < a; i++) {
			var s = t.readUshort(r, e);
			e += 2, n.push(s)
		} else {
			if (1 != o && 2 != o) throw"error: format: " + o;
			for (; n.length < a;) {
				s = t.readUshort(r, e);
				e += 2;
				var d = 0;
				1 == o ? (d = r[e], e++) : (d = t.readUshort(r, e), e += 2);
				for (i = 0; i <= d; i++) n.push(s), s++
			}
		}
		return n
	},
	readIndex: function (r, e, a) {
		var t = Typr.B, n = t.readUshort(r, e) + 1, o = r[e += 2];
		if (e++, 1 == o) for (var i = 0; i < n; i++) a.push(r[e + i]); else if (2 == o) for (i = 0; i < n; i++) a.push(t.readUshort(r, e + 2 * i)); else if (3 == o) for (i = 0; i < n; i++) a.push(16777215 & t.readUint(r, e + 3 * i - 1)); else if (4 == o) for (i = 0; i < n; i++) a.push(t.readUint(r, e + 4 * i)); else if (1 != n) throw"unsupported offset size: " + o + ", count: " + n;
		return (e += n * o) - 1
	},
	getCharString: function (r, e, a) {
		var t = Typr.B, n = r[e], o = r[e + 1], i = (r[e + 2], r[e + 3], r[e + 4], 1), s = null, d = null;
		n <= 20 && (s = n, i = 1), 12 == n && (s = 100 * n + o, i = 2), 21 <= n && n <= 27 && (s = n, i = 1), 28 == n && (d = t.readShort(r, e + 1), i = 3), 29 <= n && n <= 31 && (s = n, i = 1), 32 <= n && n <= 246 && (d = n - 139, i = 1), 247 <= n && n <= 250 && (d = 256 * (n - 247) + o + 108, i = 2), 251 <= n && n <= 254 && (d = 256 * -(n - 251) - o - 108, i = 2), 255 == n && (d = t.readInt(r, e + 1) / 65535, i = 5), a.val = null != d ? d : "o" + s, a.size = i
	},
	readCharString: function (r, e, a) {
		for (var t = e + a, n = Typr.B, o = []; e < t;) {
			var i = r[e], s = r[e + 1], d = (r[e + 2], r[e + 3], r[e + 4], 1), u = null, h = null;
			i <= 20 && (u = i, d = 1), 12 == i && (u = 100 * i + s, d = 2), 19 != i && 20 != i || (u = i, d = 2), 21 <= i && i <= 27 && (u = i, d = 1), 28 == i && (h = n.readShort(r, e + 1), d = 3), 29 <= i && i <= 31 && (u = i, d = 1), 32 <= i && i <= 246 && (h = i - 139, d = 1), 247 <= i && i <= 250 && (h = 256 * (i - 247) + s + 108, d = 2), 251 <= i && i <= 254 && (h = 256 * -(i - 251) - s - 108, d = 2), 255 == i && (h = n.readInt(r, e + 1) / 65535, d = 5), o.push(null != h ? h : "o" + u), e += d
		}
		return o
	},
	readDict: function (r, e, a) {
		for (var t = Typr.B, n = {}, o = []; e < a;) {
			var i = r[e], s = r[e + 1], d = (r[e + 2], r[e + 3], r[e + 4], 1), u = null, h = null;
			if (28 == i && (h = t.readShort(r, e + 1), d = 3), 29 == i && (h = t.readInt(r, e + 1), d = 5), 32 <= i && i <= 246 && (h = i - 139, d = 1), 247 <= i && i <= 250 && (h = 256 * (i - 247) + s + 108, d = 2), 251 <= i && i <= 254 && (h = 256 * -(i - 251) - s - 108, d = 2), 255 == i) throw h = t.readInt(r, e + 1) / 65535, d = 5, "unknown number";
			if (30 == i) {
				var p = [];
				for (d = 1; ;) {
					var f = r[e + d];
					d++;
					var l = f >> 4, v = 15 & f;
					if (15 != l && p.push(l), 15 != v && p.push(v), 15 == v) break
				}
				for (var y = "", c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"], S = 0; S < p.length; S++) y += c[p[S]];
				h = parseFloat(y)
			}
			if (i <= 21) if (u = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"][i], d = 1, 12 == i) u = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", "", "", "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", "", "", "", "", "", "", "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"][s], d = 2;
			null != u ? (n[u] = 1 == o.length ? o[0] : o, o = []) : o.push(h), e += d
		}
		return n
	}
}, Typr.T.cmap = {
	parseTab: function (r, e, a) {
		var t = {tables: [], ids: {}, off: e};
		r = new Uint8Array(r.buffer, e, a);
		e = 0;
		var n = Typr.B, o = n.readUshort, i = Typr.T.cmap, s = (o(r, e), o(r, e += 2));
		e += 2;
		for (var d = [], u = 0; u < s; u++) {
			var h = o(r, e), p = o(r, e += 2);
			e += 2;
			var f = n.readUint(r, e);
			e += 4;
			var l = "p" + h + "e" + p, v = d.indexOf(f);
			if (-1 == v) {
				v = t.tables.length;
				var y = {};
				d.push(f);
				var c = y.format = o(r, f);
				0 == c ? y = i.parse0(r, f, y) : 4 == c ? y = i.parse4(r, f, y) : 6 == c ? y = i.parse6(r, f, y) : 12 == c && (y = i.parse12(r, f, y)), t.tables.push(y)
			}
			if (null != t.ids[l]) throw"multiple tables for one platform+encoding";
			t.ids[l] = v
		}
		return t
	}, parse0: function (r, e, a) {
		var t = Typr.B;
		e += 2;
		var n = t.readUshort(r, e);
		e += 2;
		t.readUshort(r, e);
		e += 2, a.map = [];
		for (var o = 0; o < n - 6; o++) a.map.push(r[e + o]);
		return a
	}, parse4: function (r, e, a) {
		var t = Typr.B, n = t.readUshort, o = t.readUshorts, i = e, s = n(r, e += 2), d = (n(r, e += 2), n(r, e += 2));
		e += 2;
		var u = d >>> 1;
		a.searchRange = n(r, e), e += 2, a.entrySelector = n(r, e), e += 2, a.rangeShift = n(r, e), e += 2, a.endCount = o(r, e, u), e += 2 * u, e += 2, a.startCount = o(r, e, u), e += 2 * u, a.idDelta = [];
		for (var h = 0; h < u; h++) a.idDelta.push(t.readShort(r, e)), e += 2;
		return a.idRangeOffset = o(r, e, u), e += 2 * u, a.glyphIdArray = o(r, e, i + s - e >>> 1), a
	}, parse6: function (r, e, a) {
		var t = Typr.B;
		e += 2;
		t.readUshort(r, e);
		e += 2;
		t.readUshort(r, e);
		e += 2, a.firstCode = t.readUshort(r, e), e += 2;
		var n = t.readUshort(r, e);
		e += 2, a.glyphIdArray = [];
		for (var o = 0; o < n; o++) a.glyphIdArray.push(t.readUshort(r, e)), e += 2;
		return a
	}, parse12: function (r, e, a) {
		var t = Typr.B.readUint, n = (t(r, e += 4), t(r, e += 4), 3 * t(r, e += 4));
		e += 4;
		for (var o = a.groups = new Uint32Array(n), i = 0; i < n; i += 3) o[i] = t(r, e + (i << 2)), o[i + 1] = t(r, e + (i << 2) + 4), o[i + 2] = t(r, e + (i << 2) + 8);
		return a
	}
}, Typr.T.glyf = {
	parseTab: function (r, e, a, t) {
		for (var n = [], o = t.maxp.numGlyphs, i = 0; i < o; i++) n.push(null);
		return n
	}, _parseGlyf: function (r, e) {
		var a = Typr.B, t = r._data, n = r.loca;
		if (n[e] == n[e + 1]) return null;
		var o = Typr.findTable(t, "glyf", r._offset)[0] + n[e], i = {};
		if (i.noc = a.readShort(t, o), o += 2, i.xMin = a.readShort(t, o), o += 2, i.yMin = a.readShort(t, o), o += 2, i.xMax = a.readShort(t, o), o += 2, i.yMax = a.readShort(t, o), o += 2, i.xMin >= i.xMax || i.yMin >= i.yMax) return null;
		if (i.noc > 0) {
			i.endPts = [];
			for (var s = 0; s < i.noc; s++) i.endPts.push(a.readUshort(t, o)), o += 2;
			var d = a.readUshort(t, o);
			if (o += 2, t.length - o < d) return null;
			i.instructions = a.readBytes(t, o, d), o += d;
			var u = i.endPts[i.noc - 1] + 1;
			i.flags = [];
			for (s = 0; s < u; s++) {
				var h = t[o];
				if (o++, i.flags.push(h), 0 != (8 & h)) {
					var p = t[o];
					o++;
					for (var f = 0; f < p; f++) i.flags.push(h), s++
				}
			}
			i.xs = [];
			for (s = 0; s < u; s++) {
				var l = 0 != (2 & i.flags[s]), v = 0 != (16 & i.flags[s]);
				l ? (i.xs.push(v ? t[o] : -t[o]), o++) : v ? i.xs.push(0) : (i.xs.push(a.readShort(t, o)), o += 2)
			}
			i.ys = [];
			for (s = 0; s < u; s++) {
				l = 0 != (4 & i.flags[s]), v = 0 != (32 & i.flags[s]);
				l ? (i.ys.push(v ? t[o] : -t[o]), o++) : v ? i.ys.push(0) : (i.ys.push(a.readShort(t, o)), o += 2)
			}
			var y = 0, c = 0;
			for (s = 0; s < u; s++) y += i.xs[s], c += i.ys[s], i.xs[s] = y, i.ys[s] = c
		} else {
			var S;
			i.parts = [];
			do {
				S = a.readUshort(t, o), o += 2;
				var T = {m: {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0}, p1: -1, p2: -1};
				if (i.parts.push(T), T.glyphIndex = a.readUshort(t, o), o += 2, 1 & S) {
					var U = a.readShort(t, o);
					o += 2;
					var g = a.readShort(t, o);
					o += 2
				} else {
					U = a.readInt8(t, o);
					o++;
					g = a.readInt8(t, o);
					o++
				}
				2 & S ? (T.m.tx = U, T.m.ty = g) : (T.p1 = U, T.p2 = g), 8 & S ? (T.m.a = T.m.d = a.readF2dot14(t, o), o += 2) : 64 & S ? (T.m.a = a.readF2dot14(t, o), o += 2, T.m.d = a.readF2dot14(t, o), o += 2) : 128 & S && (T.m.a = a.readF2dot14(t, o), o += 2, T.m.b = a.readF2dot14(t, o), o += 2, T.m.c = a.readF2dot14(t, o), o += 2, T.m.d = a.readF2dot14(t, o), o += 2)
			} while (32 & S);
			if (256 & S) {
				var m = a.readUshort(t, o);
				o += 2, i.instr = [];
				for (s = 0; s < m; s++) i.instr.push(t[o]), o++
			}
		}
		return i
	}
}, Typr.T.head = {
	parseTab: function (r, e, a) {
		var t = Typr.B, n = {};
		t.readFixed(r, e);
		e += 4, n.fontRevision = t.readFixed(r, e), e += 4;
		t.readUint(r, e);
		e += 4;
		t.readUint(r, e);
		return e += 4, n.flags = t.readUshort(r, e), e += 2, n.unitsPerEm = t.readUshort(r, e), e += 2, n.created = t.readUint64(r, e), e += 8, n.modified = t.readUint64(r, e), e += 8, n.xMin = t.readShort(r, e), e += 2, n.yMin = t.readShort(r, e), e += 2, n.xMax = t.readShort(r, e), e += 2, n.yMax = t.readShort(r, e), e += 2, n.macStyle = t.readUshort(r, e), e += 2, n.lowestRecPPEM = t.readUshort(r, e), e += 2, n.fontDirectionHint = t.readShort(r, e), e += 2, n.indexToLocFormat = t.readShort(r, e), e += 2, n.glyphDataFormat = t.readShort(r, e), e += 2, n
	}
}, Typr.T.hhea = {
	parseTab: function (r, e, a) {
		var t = Typr.B, n = {};
		t.readFixed(r, e);
		e += 4;
		for (var o = ["ascender", "descender", "lineGap", "advanceWidthMax", "minLeftSideBearing", "minRightSideBearing", "xMaxExtent", "caretSlopeRise", "caretSlopeRun", "caretOffset", "res0", "res1", "res2", "res3", "metricDataFormat", "numberOfHMetrics"], i = 0; i < o.length; i++) {
			var s = o[i], d = "advanceWidthMax" == s || "numberOfHMetrics" == s ? t.readUshort : t.readShort;
			n[s] = d(r, e + 2 * i)
		}
		return n
	}
}, Typr.T.hmtx = {
	parseTab: function (r, e, a, t) {
		for (var n = Typr.B, o = [], i = [], s = t.maxp.numGlyphs, d = t.hhea.numberOfHMetrics, u = 0, h = 0, p = 0; p < d;) u = n.readUshort(r, e + (p << 2)), h = n.readShort(r, e + (p << 2) + 2), o.push(u), i.push(h), p++;
		for (; p < s;) o.push(u), i.push(h), p++;
		return {aWidth: o, lsBearing: i}
	}
}, Typr.T.kern = {
	parseTab: function (r, e, a, t) {
		var n = Typr.B, o = Typr.T.kern;
		if (1 == n.readUshort(r, e)) return o.parseV1(r, e, a, t);
		var i = n.readUshort(r, e + 2);
		e += 4;
		for (var s = {glyph1: [], rval: []}, d = 0; d < i; d++) {
			e += 2;
			a = n.readUshort(r, e);
			e += 2;
			var u = n.readUshort(r, e);
			e += 2;
			var h = u >>> 8;
			0 == (h &= 15) && (e = o.readFormat0(r, e, s))
		}
		return s
	}, parseV1: function (r, e, a, t) {
		var n = Typr.B, o = Typr.T.kern, i = (n.readFixed(r, e), n.readUint(r, e + 4));
		e += 8;
		for (var s = {glyph1: [], rval: []}, d = 0; d < i; d++) {
			n.readUint(r, e);
			e += 4;
			var u = n.readUshort(r, e);
			e += 2;
			n.readUshort(r, e);
			e += 2, 0 == (255 & u) && (e = o.readFormat0(r, e, s))
		}
		return s
	}, readFormat0: function (r, e, a) {
		var t = Typr.B, n = t.readUshort, o = -1, i = n(r, e);
		n(r, e + 2), n(r, e + 4), n(r, e + 6);
		e += 8;
		for (var s = 0; s < i; s++) {
			var d = n(r, e), u = n(r, e += 2);
			e += 2;
			var h = t.readShort(r, e);
			e += 2, d != o && (a.glyph1.push(d), a.rval.push({glyph2: [], vals: []}));
			var p = a.rval[a.rval.length - 1];
			p.glyph2.push(u), p.vals.push(h), o = d
		}
		return e
	}
}, Typr.T.loca = {
	parseTab: function (r, e, a, t) {
		var n = Typr.B, o = [], i = t.head.indexToLocFormat, s = t.maxp.numGlyphs + 1;
		if (0 == i) for (var d = 0; d < s; d++) o.push(n.readUshort(r, e + (d << 1)) << 1);
		if (1 == i) for (d = 0; d < s; d++) o.push(n.readUint(r, e + (d << 2)));
		return o
	}
}, Typr.T.maxp = {
	parseTab: function (r, e, a) {
		var t = Typr.B, n = t.readUshort, o = {};
		t.readUint(r, e);
		return e += 4, o.numGlyphs = n(r, e), e += 2, o
	}
}, Typr.T.name = {
	parseTab: function (r, e, a) {
		var t = Typr.B, n = {};
		t.readUshort(r, e);
		e += 2;
		var o = t.readUshort(r, e);
		e += 2;
		t.readUshort(r, e);
		for (var i = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"], s = e += 2, d = t.readUshort, u = 0; u < o; u++) {
			var h = d(r, e), p = d(r, e += 2), f = d(r, e += 2), l = d(r, e += 2), v = d(r, e += 2), y = d(r, e += 2);
			e += 2;
			var c, S = s + 12 * o + y;
			0 == h || 3 == h && 0 == p ? c = t.readUnicode(r, S, v / 2) : 0 == p ? c = t.readASCII(r, S, v) : 1 == p || 3 == p || 4 == p || 10 == p ? c = t.readUnicode(r, S, v / 2) : 1 == h ? (c = t.readASCII(r, S, v), console.log("reading unknown MAC encoding " + p + " as ASCII")) : (console.log("unknown encoding " + p + ", platformID: " + h), c = t.readASCII(r, S, v));
			var T = "p" + h + "," + f.toString(16);
			null == n[T] && (n[T] = {}), n[T][i[l]] = c, n[T]._lang = f
		}
		var U, g = "postScriptName";
		for (var m in n) if (null != n[m][g] && 1033 == n[m]._lang) return n[m];
		for (var m in n) if (null != n[m][g] && 0 == n[m]._lang) return n[m];
		for (var m in n) if (null != n[m][g] && 3084 == n[m]._lang) return n[m];
		for (var m in n) if (null != n[m][g]) return n[m];
		for (var m in n) {
			U = n[m];
			break
		}
		return console.log("returning name table with languageID " + U._lang), null == U[g] && null != U.ID && (U[g] = U.ID), U
	}
}, Typr.T.OS2 = {
	parseTab: function (r, e, a) {
		var t = Typr.B.readUshort(r, e);
		e += 2;
		var n = Typr.T.OS2, o = {};
		if (0 == t) n.version0(r, e, o); else if (1 == t) n.version1(r, e, o); else if (2 == t || 3 == t || 4 == t) n.version2(r, e, o); else {
			if (5 != t) throw"unknown OS/2 table version: " + t;
			n.version5(r, e, o)
		}
		return o
	}, version0: function (r, e, a) {
		var t = Typr.B;
		return a.xAvgCharWidth = t.readShort(r, e), e += 2, a.usWeightClass = t.readUshort(r, e), e += 2, a.usWidthClass = t.readUshort(r, e), e += 2, a.fsType = t.readUshort(r, e), e += 2, a.ySubscriptXSize = t.readShort(r, e), e += 2, a.ySubscriptYSize = t.readShort(r, e), e += 2, a.ySubscriptXOffset = t.readShort(r, e), e += 2, a.ySubscriptYOffset = t.readShort(r, e), e += 2, a.ySuperscriptXSize = t.readShort(r, e), e += 2, a.ySuperscriptYSize = t.readShort(r, e), e += 2, a.ySuperscriptXOffset = t.readShort(r, e), e += 2, a.ySuperscriptYOffset = t.readShort(r, e), e += 2, a.yStrikeoutSize = t.readShort(r, e), e += 2, a.yStrikeoutPosition = t.readShort(r, e), e += 2, a.sFamilyClass = t.readShort(r, e), e += 2, a.panose = t.readBytes(r, e, 10), e += 10, a.ulUnicodeRange1 = t.readUint(r, e), e += 4, a.ulUnicodeRange2 = t.readUint(r, e), e += 4, a.ulUnicodeRange3 = t.readUint(r, e), e += 4, a.ulUnicodeRange4 = t.readUint(r, e), e += 4, a.achVendID = t.readASCII(r, e, 4), e += 4, a.fsSelection = t.readUshort(r, e), e += 2, a.usFirstCharIndex = t.readUshort(r, e), e += 2, a.usLastCharIndex = t.readUshort(r, e), e += 2, a.sTypoAscender = t.readShort(r, e), e += 2, a.sTypoDescender = t.readShort(r, e), e += 2, a.sTypoLineGap = t.readShort(r, e), e += 2, a.usWinAscent = t.readUshort(r, e), e += 2, a.usWinDescent = t.readUshort(r, e), e += 2
	}, version1: function (r, e, a) {
		var t = Typr.B;
		return e = Typr.T.OS2.version0(r, e, a), a.ulCodePageRange1 = t.readUint(r, e), e += 4, a.ulCodePageRange2 = t.readUint(r, e), e += 4
	}, version2: function (r, e, a) {
		var t = Typr.B, n = t.readUshort;
		return e = Typr.T.OS2.version1(r, e, a), a.sxHeight = t.readShort(r, e), e += 2, a.sCapHeight = t.readShort(r, e), e += 2, a.usDefault = n(r, e), e += 2, a.usBreak = n(r, e), e += 2, a.usMaxContext = n(r, e), e += 2
	}, version5: function (r, e, a) {
		var t = Typr.B.readUshort;
		return e = Typr.T.OS2.version2(r, e, a), a.usLowerOpticalPointSize = t(r, e), e += 2, a.usUpperOpticalPointSize = t(r, e), e += 2
	}
}, Typr.T.post = {
	parseTab: function (r, e, a) {
		var t = Typr.B, n = {};
		return n.version = t.readFixed(r, e), e += 4, n.italicAngle = t.readFixed(r, e), e += 4, n.underlinePosition = t.readShort(r, e), e += 2, n.underlineThickness = t.readShort(r, e), e += 2, n
	}
}, Typr.T.SVG = {
	parseTab: function (r, e, a) {
		var t = Typr.B, n = {entries: []}, o = e;
		t.readUshort(r, e);
		e += 2;
		var i = t.readUint(r, e);
		e += 4;
		t.readUint(r, e);
		e += 4, e = i + o;
		var s = t.readUshort(r, e);
		e += 2;
		for (var d = 0; d < s; d++) {
			var u = t.readUshort(r, e);
			e += 2;
			var h = t.readUshort(r, e);
			e += 2;
			var p = t.readUint(r, e);
			e += 4;
			var f = t.readUint(r, e);
			e += 4;
			for (var l = new Uint8Array(r.buffer, o + p + i, f), v = t.readUTF8(l, 0, l.length), y = u; y <= h; y++) n.entries[y] = v
		}
		return n
	}
};
;

/**
 * Minified by jsDelivr using Terser v5.10.0.
 * Original file: /gh/photopea/Typr.js@f4fcdeb8014edc75ab7296bd85ac9cde8cb30489/src/Typr.U.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
Typr.U = {
	shape: function (t, e, r) {
		for (var s = function (t, e, r, s) {
			var n = e[r], a = e[r + 1], h = t.kern;
			if (h) {
				var o = h.glyph1.indexOf(n);
				if (-1 != o) {
					var f = h.rval[o].glyph2.indexOf(a);
					if (-1 != f) return [0, 0, h.rval[o].vals[f], 0]
				}
			}
			return [0, 0, 0, 0]
		}, n = [], a = 0; a < e.length; a++) {
			var h = e.codePointAt(a);
			h > 65535 && a++, n.push(Typr.U.codeToGlyph(t, h))
		}
		var o = [];
		for (a = 0; a < n.length; a++) {
			var f = s(t, n, a), i = n[a], l = t.hmtx.aWidth[i] + f[2];
			o.push({g: i, cl: a, dx: 0, dy: 0, ax: l, ay: 0}), l
		}
		return o
	}, shapeToPath: function (t, e, r) {
		for (var s = {cmds: [], crds: []}, n = 0, a = 0, h = 0; h < e.length; h++) {
			for (var o = e[h], f = Typr.U.glyphToPath(t, o.g), i = f.crds, l = 0; l < i.length; l += 2) s.crds.push(i[l] + n + o.dx), s.crds.push(i[l + 1] + a + o.dy);
			r && s.cmds.push(r);
			for (l = 0; l < f.cmds.length; l++) s.cmds.push(f.cmds[l]);
			var c = s.cmds.length;
			r && 0 != c && "X" != s.cmds[c - 1] && s.cmds.push("X"), n += o.ax, a += o.ay
		}
		return {cmds: s.cmds, crds: s.crds}
	}, codeToGlyph: function (t, e) {
		for (var r = t.cmap, s = -1, n = ["p3e10", "p0e4", "p3e1", "p1e0", "p0e3", "p0e1"], a = 0; a < n.length; a++) if (null != r.ids[n[a]]) {
			s = r.ids[n[a]];
			break
		}
		if (-1 == s) throw"no familiar platform and encoding!";
		var h = function (t, e, r) {
			for (var s = 0, n = Math.floor(t.length / e); s + 1 != n;) {
				var a = s + (n - s >>> 1);
				t[a * e] <= r ? s = a : n = a
			}
			return s * e
		}, o = r.tables[s], f = o.format, i = -1;
		if (0 == f) i = e >= o.map.length ? 0 : o.map[e]; else if (4 == f) {
			var l = -1, c = o.endCount;
			if (e > c[c.length - 1] ? l = -1 : c[l = h(c, 1, e)] < e && l++, -1 == l) i = 0; else if (e < o.startCount[l]) i = 0; else {
				i = 65535 & (0 != o.idRangeOffset[l] ? o.glyphIdArray[e - o.startCount[l] + (o.idRangeOffset[l] >> 1) - (o.idRangeOffset.length - l)] : e + o.idDelta[l])
			}
		} else if (6 == f) {
			var u = e - o.firstCode, d = o.glyphIdArray;
			i = u < 0 || u >= d.length ? 0 : d[u]
		} else {
			if (12 != f) throw"unknown cmap table format " + o.format;
			var v = o.groups;
			e > v[v.length - 2] ? i = 0 : (v[a = h(v, 3, e)] <= e && e <= v[a + 1] && (i = v[a + 2] + (e - v[a])), -1 == i && (i = 0))
		}
		var p = t["SVG "], g = t.loca;
		return 0 == i || null != t["CFF "] || null != p && null != p.entries[i] || g[i] != g[i + 1] || -1 != [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8232, 8233, 8239, 12288, 6158, 8203, 8204, 8205, 8288, 65279].indexOf(e) || 8192 <= e && e <= 8202 || (i = 0), i
	}, glyphToPath: function (t, e) {
		var r = {cmds: [], crds: []}, s = t["SVG "], n = t["CFF "], a = Typr.U;
		if (s && s.entries[e]) {
			var h = s.entries[e];
			null != h && ("string" == typeof h && (h = a.SVG.toPath(h), s.entries[e] = h), r = h)
		} else if (n) {
			var o = n.Private, f = {x: 0, y: 0, stack: [], nStems: 0, haveWidth: !1, width: o ? o.defaultWidthX : 0, open: !1};
			if (n.ROS) {
				for (var i = 0; n.FDSelect[i + 2] <= e;) i += 2;
				o = n.FDArray[n.FDSelect[i + 1]].Private
			}
			a._drawCFF(n.CharStrings[e], f, n, o, r)
		} else t.glyf && a._drawGlyf(e, t, r);
		return {cmds: r.cmds, crds: r.crds}
	}, _drawGlyf: function (t, e, r) {
		var s = e.glyf[t];
		null == s && (s = e.glyf[t] = Typr.T.glyf._parseGlyf(e, t)), null != s && (s.noc > -1 ? Typr.U._simpleGlyph(s, r) : Typr.U._compoGlyph(s, e, r))
	}, _simpleGlyph: function (t, e) {
		for (var r = Typr.U.P, s = 0; s < t.noc; s++) {
			for (var n = 0 == s ? 0 : t.endPts[s - 1] + 1, a = t.endPts[s], h = n; h <= a; h++) {
				var o = h == n ? a : h - 1, f = h == a ? n : h + 1, i = 1 & t.flags[h], l = 1 & t.flags[o], c = 1 & t.flags[f], u = t.xs[h], d = t.ys[h];
				if (h == n) if (i) {
					if (!l) {
						r.MoveTo(e, u, d);
						continue
					}
					r.MoveTo(e, t.xs[o], t.ys[o])
				} else l ? r.MoveTo(e, t.xs[o], t.ys[o]) : r.MoveTo(e, Math.floor(.5 * (t.xs[o] + u)), Math.floor(.5 * (t.ys[o] + d)));
				i ? l && r.LineTo(e, u, d) : c ? r.qCurveTo(e, u, d, t.xs[f], t.ys[f]) : r.qCurveTo(e, u, d, Math.floor(.5 * (u + t.xs[f])), Math.floor(.5 * (d + t.ys[f])))
			}
			r.ClosePath(e)
		}
	}, _compoGlyph: function (t, e, r) {
		for (var s = 0; s < t.parts.length; s++) {
			var n = {cmds: [], crds: []}, a = t.parts[s];
			Typr.U._drawGlyf(a.glyphIndex, e, n);
			for (var h = a.m, o = 0; o < n.crds.length; o += 2) {
				var f = n.crds[o], i = n.crds[o + 1];
				r.crds.push(f * h.a + i * h.b + h.tx), r.crds.push(f * h.c + i * h.d + h.ty)
			}
			for (o = 0; o < n.cmds.length; o++) r.cmds.push(n.cmds[o])
		}
	}, pathToSVG: function (t, e) {
		var r = t.cmds, s = t.crds;
		null == e && (e = 5);
		for (var n = [], a = 0, h = {M: 2, L: 2, Q: 4, C: 6}, o = 0; o < r.length; o++) {
			var f = r[o], i = a + (h[f] ? h[f] : 0);
			for (n.push(f); a < i;) {
				var l = s[a++];
				n.push(parseFloat(l.toFixed(e)) + (a == i ? "" : " "))
			}
		}
		return n.join("")
	}, SVGToPath: function (t) {
		var e = {cmds: [], crds: []};
		return Typr.U.SVG.svgToPath(t, e), {cmds: e.cmds, crds: e.crds}
	}, pathToContext: function (t, e) {
		for (var r = 0, s = t.cmds, n = t.crds, a = 0; a < s.length; a++) {
			var h = s[a];
			"M" == h ? (e.moveTo(n[r], n[r + 1]), r += 2) : "L" == h ? (e.lineTo(n[r], n[r + 1]), r += 2) : "C" == h ? (e.bezierCurveTo(n[r], n[r + 1], n[r + 2], n[r + 3], n[r + 4], n[r + 5]), r += 6) : "Q" == h ? (e.quadraticCurveTo(n[r], n[r + 1], n[r + 2], n[r + 3]), r += 4) : "#" == h.charAt(0) ? (e.beginPath(), e.fillStyle = h) : "Z" == h ? e.closePath() : "X" == h && e.fill()
		}
	}, P: {
		MoveTo: function (t, e, r) {
			t.cmds.push("M"), t.crds.push(e, r)
		}, LineTo: function (t, e, r) {
			t.cmds.push("L"), t.crds.push(e, r)
		}, CurveTo: function (t, e, r, s, n, a, h) {
			t.cmds.push("C"), t.crds.push(e, r, s, n, a, h)
		}, qCurveTo: function (t, e, r, s, n) {
			t.cmds.push("Q"), t.crds.push(e, r, s, n)
		}, ClosePath: function (t) {
			t.cmds.push("Z")
		}
	}, _drawCFF: function (t, e, r, s, n) {
		for (var a = e.stack, h = e.nStems, o = e.haveWidth, f = e.width, i = e.open, l = 0, c = e.x, u = e.y, d = 0, v = 0, p = 0, g = 0, m = 0, y = 0, T = 0, C = 0, b = 0, _ = 0, M = Typr.T.CFF, x = Typr.U.P, P = s.nominalWidthX, w = {val: 0, size: 0}; l < t.length;) {
			M.getCharString(t, l, w);
			var S = w.val;
			if (l += w.size, "o1" == S || "o18" == S) a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0; else if ("o3" == S || "o23" == S) {
				a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0
			} else if ("o4" == S) a.length > 1 && !o && (f = a.shift() + P, o = !0), i && x.ClosePath(n), u += a.pop(), x.MoveTo(n, c, u), i = !0; else if ("o5" == S) for (; a.length > 0;) c += a.shift(), u += a.shift(), x.LineTo(n, c, u); else if ("o6" == S || "o7" == S) for (var F = a.length, A = "o6" == S, U = 0; U < F; U++) {
				var G = a.shift();
				A ? c += G : u += G, A = !A, x.LineTo(n, c, u)
			} else if ("o8" == S || "o24" == S) {
				F = a.length;
				for (var L = 0; L + 6 <= F;) d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g + a.shift(), x.CurveTo(n, d, v, p, g, c, u), L += 6;
				"o24" == S && (c += a.shift(), u += a.shift(), x.LineTo(n, c, u))
			} else {
				if ("o11" == S) break;
				if ("o1234" == S || "o1235" == S || "o1236" == S || "o1237" == S) "o1234" == S && (v = u, p = (d = c + a.shift()) + a.shift(), _ = g = v + a.shift(), y = g, C = u, c = (T = (m = (b = p + a.shift()) + a.shift()) + a.shift()) + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1235" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), b = p + a.shift(), _ = g + a.shift(), m = b + a.shift(), y = _ + a.shift(), T = m + a.shift(), C = y + a.shift(), c = T + a.shift(), u = C + a.shift(), a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1236" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), _ = g = v + a.shift(), y = g, T = (m = (b = p + a.shift()) + a.shift()) + a.shift(), C = y + a.shift(), c = T + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1237" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), b = p + a.shift(), _ = g + a.shift(), m = b + a.shift(), y = _ + a.shift(), T = m + a.shift(), C = y + a.shift(), Math.abs(T - c) > Math.abs(C - u) ? c = T + a.shift() : u = C + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)); else if ("o14" == S) {
					if (a.length > 0 && !o && (f = a.shift() + r.nominalWidthX, o = !0), 4 == a.length) {
						var k = a.shift(), O = a.shift(), V = a.shift(), W = a.shift(), B = M.glyphBySE(r, V), I = M.glyphBySE(r, W);
						Typr.U._drawCFF(r.CharStrings[B], e, r, s, n), e.x = k, e.y = O, Typr.U._drawCFF(r.CharStrings[I], e, r, s, n)
					}
					i && (x.ClosePath(n), i = !1)
				} else if ("o19" == S || "o20" == S) {
					a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0, l += h + 7 >> 3
				} else if ("o21" == S) a.length > 2 && !o && (f = a.shift() + P, o = !0), u += a.pop(), c += a.pop(), i && x.ClosePath(n), x.MoveTo(n, c, u), i = !0; else if ("o22" == S) a.length > 1 && !o && (f = a.shift() + P, o = !0), c += a.pop(), i && x.ClosePath(n), x.MoveTo(n, c, u), i = !0; else if ("o25" == S) {
					for (; a.length > 6;) c += a.shift(), u += a.shift(), x.LineTo(n, c, u);
					d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g + a.shift(), x.CurveTo(n, d, v, p, g, c, u)
				} else if ("o26" == S) for (a.length % 2 && (c += a.shift()); a.length > 0;) d = c, v = u + a.shift(), c = p = d + a.shift(), u = (g = v + a.shift()) + a.shift(), x.CurveTo(n, d, v, p, g, c, u); else if ("o27" == S) for (a.length % 2 && (u += a.shift()); a.length > 0;) v = u, p = (d = c + a.shift()) + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g, x.CurveTo(n, d, v, p, g, c, u); else if ("o10" == S || "o29" == S) {
					var q = "o10" == S ? s : r;
					if (0 == a.length) console.log("error: empty stack"); else {
						var Q = a.pop(), X = q.Subrs[Q + q.Bias];
						e.x = c, e.y = u, e.nStems = h, e.haveWidth = o, e.width = f, e.open = i, Typr.U._drawCFF(X, e, r, s, n), c = e.x, u = e.y, h = e.nStems, o = e.haveWidth, f = e.width, i = e.open
					}
				} else if ("o30" == S || "o31" == S) {
					var D = a.length, E = (L = 0, "o31" == S);
					for (L += D - (F = -3 & D); L < F;) E ? (v = u, p = (d = c + a.shift()) + a.shift(), u = (g = v + a.shift()) + a.shift(), F - L == 5 ? (c = p + a.shift(), L++) : c = p, E = !1) : (d = c, v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), F - L == 5 ? (u = g + a.shift(), L++) : u = g, E = !0), x.CurveTo(n, d, v, p, g, c, u), L += 4
				} else {
					if ("o" == (S + "").charAt(0)) throw console.log("Unknown operation: " + S, t), S;
					a.push(S)
				}
			}
		}
		e.x = c, e.y = u, e.nStems = h, e.haveWidth = o, e.width = f, e.open = i
	}, SVG: function () {
		var t = {
			getScale: function (t) {
				return Math.sqrt(Math.abs(t[0] * t[3] - t[1] * t[2]))
			}, translate: function (e, r, s) {
				t.concat(e, [1, 0, 0, 1, r, s])
			}, rotate: function (e, r) {
				t.concat(e, [Math.cos(r), -Math.sin(r), Math.sin(r), Math.cos(r), 0, 0])
			}, scale: function (e, r, s) {
				t.concat(e, [r, 0, 0, s, 0, 0])
			}, concat: function (t, e) {
				var r = t[0], s = t[1], n = t[2], a = t[3], h = t[4], o = t[5];
				t[0] = r * e[0] + s * e[2], t[1] = r * e[1] + s * e[3], t[2] = n * e[0] + a * e[2], t[3] = n * e[1] + a * e[3], t[4] = h * e[0] + o * e[2] + e[4], t[5] = h * e[1] + o * e[3] + e[5]
			}, invert: function (t) {
				var e = t[0], r = t[1], s = t[2], n = t[3], a = t[4], h = t[5], o = e * n - r * s;
				t[0] = n / o, t[1] = -r / o, t[2] = -s / o, t[3] = e / o, t[4] = (s * h - n * a) / o, t[5] = (r * a - e * h) / o
			}, multPoint: function (t, e) {
				var r = e[0], s = e[1];
				return [r * t[0] + s * t[2] + t[4], r * t[1] + s * t[3] + t[5]]
			}, multArray: function (t, e) {
				for (var r = 0; r < e.length; r += 2) {
					var s = e[r], n = e[r + 1];
					e[r] = s * t[0] + n * t[2] + t[4], e[r + 1] = s * t[1] + n * t[3] + t[5]
				}
			}
		};

		function e(t, e, r) {
			for (var s = [], n = 0, a = 0, h = 0; ;) {
				var o = t.indexOf(e, a), f = t.indexOf(r, a);
				if (-1 == o && -1 == f) break;
				-1 == f || -1 != o && o < f ? (0 == h && (s.push(t.slice(n, o).trim()), n = o + 1), h++, a = o + 1) : (-1 == o || -1 != f && f < o) && (0 == --h && (s.push(t.slice(n, f).trim()), n = f + 1), a = f + 1)
			}
			return s
		}

		function r(r) {
			for (var n = e(r, "(", ")"), a = [1, 0, 0, 1, 0, 0], h = 0; h < n.length; h += 2) {
				var o = a;
				a = s(n[h], n[h + 1]), t.concat(a, o)
			}
			return a
		}

		function s(e, r) {
			for (var s = [1, 0, 0, 1, 0, 0], n = !0, a = 0; a < r.length; a++) {
				var h = r.charAt(a);
				"," == h || " " == h ? n = !0 : "." == h ? (n || (r = r.slice(0, a) + "," + r.slice(a), a++), n = !1) : "-" == h && a > 0 && "e" != r[a - 1] && (r = r.slice(0, a) + " " + r.slice(a), a++, n = !0)
			}
			if (r = r.split(/\s*[\s,]\s*/).map(parseFloat), "translate" == e) 1 == r.length ? t.translate(s, r[0], 0) : t.translate(s, r[0], r[1]); else if ("scale" == e) 1 == r.length ? t.scale(s, r[0], r[0]) : t.scale(s, r[0], r[1]); else if ("rotate" == e) {
				var o = 0, f = 0;
				1 != r.length && (o = r[1], f = r[2]), t.translate(s, -o, -f), t.rotate(s, -Math.PI * r[0] / 180), t.translate(s, o, f)
			} else "matrix" == e ? s = r : console.log("unknown transform: ", e);
			return s
		}

		function n(e, s, a) {
			for (var o = 0; o < e.length; o++) {
				var f = e[o], i = f.tagName, l = f.getAttribute("fill");
				if (null == l && (l = a), "g" == i) {
					var c = {crds: [], cmds: []};
					n(f.children, c, l);
					var u = f.getAttribute("transform");
					if (u) {
						var d = r(u);
						t.multArray(d, c.crds)
					}
					s.crds = s.crds.concat(c.crds), s.cmds = s.cmds.concat(c.cmds)
				} else if ("path" == i || "circle" == i || "ellipse" == i) {
					var v;
					if (s.cmds.push(l || "#000000"), "path" == i && (v = f.getAttribute("d")), "circle" == i || "ellipse" == i) {
						for (var p = [0, 0, 0, 0], g = ["cx", "cy", "rx", "ry", "r"], m = 0; m < 5; m++) {
							var y = f.getAttribute(g[m]);
							y && (y = parseFloat(y), m < 4 ? p[m] = y : p[2] = p[3] = y)
						}
						var T = p[0], C = p[1], b = p[2], _ = p[3];
						v = ["M", T - b, C, "a", b, _, 0, 1, 0, 2 * b, 0, "a", b, _, 0, 1, 0, 2 * -b, 0].join(" ")
					}
					h(v, s), s.cmds.push("X")
				} else "defs" == i || console.log(i, f)
			}
		}

		function a(t, e, r) {
			for (var s = e; s < t.length && "string" != typeof t[s];) s += r;
			return (s - e) / r
		}

		function h(t, e) {
			for (var r = function (t) {
				for (var e = [], r = 0, s = !1, n = "", a = ""; r < t.length;) {
					var h = t.charCodeAt(r), o = t.charAt(r);
					r++;
					var f = 48 <= h && h <= 57 || "." == o || "-" == o || "e" == o || "E" == o;
					s ? "-" == o && "e" != a || "." == o && -1 != n.indexOf(".") ? (e.push(parseFloat(n)), n = o) : f ? n += o : (e.push(parseFloat(n)), "," != o && " " != o && e.push(o), s = !1) : f ? (n = o, s = !0) : "," != o && " " != o && e.push(o), a = o
				}
				return s && e.push(parseFloat(n)), e
			}(t), s = 0, n = 0, h = 0, o = 0, f = 0, i = e.crds.length, l = {M: 2, L: 2, H: 1, V: 1, T: 2, S: 4, A: 7, Q: 4, C: 6}, c = e.cmds, u = e.crds; s < r.length;) {
				var d = r[s];
				s++;
				var v = d.toUpperCase();
				if ("Z" == v) c.push("Z"), n = o, h = f; else for (var p = a(r, s, l[v]), g = 0; g < p; g++) {
					1 == g && "M" == v && (d = d == v ? "L" : "l", v = "L");
					var m = 0, y = 0;
					if (d != v && (m = n, y = h), "M" == v) n = m + r[s++], h = y + r[s++], c.push("M"), u.push(n, h), o = n, f = h; else if ("L" == v) n = m + r[s++], h = y + r[s++], c.push("L"), u.push(n, h); else if ("H" == v) n = m + r[s++], c.push("L"), u.push(n, h); else if ("V" == v) h = y + r[s++], c.push("L"), u.push(n, h); else if ("Q" == v) {
						var T = m + r[s++], C = y + r[s++], b = m + r[s++], _ = y + r[s++];
						c.push("Q"), u.push(T, C, b, _), n = b, h = _
					} else if ("T" == v) {
						T = n + n - u[P = Math.max(u.length - 2, i)], C = h + h - u[P + 1], b = m + r[s++], _ = y + r[s++];
						c.push("Q"), u.push(T, C, b, _), n = b, h = _
					} else if ("C" == v) {
						T = m + r[s++], C = y + r[s++], b = m + r[s++], _ = y + r[s++];
						var M = m + r[s++], x = y + r[s++];
						c.push("C"), u.push(T, C, b, _, M, x), n = M, h = x
					} else if ("S" == v) {
						var P;
						T = n + n - u[P = Math.max(u.length - ("C" == c[c.length - 1] ? 4 : 2), i)], C = h + h - u[P + 1], b = m + r[s++], _ = y + r[s++], M = m + r[s++], x = y + r[s++];
						c.push("C"), u.push(T, C, b, _, M, x), n = M, h = x
					} else if ("A" == v) {
						T = n, C = h;
						var w = r[s++], S = r[s++], F = r[s++] * (Math.PI / 180), A = r[s++], U = r[s++];
						b = m + r[s++], _ = y + r[s++];
						if (b == n && _ == h && 0 == w && 0 == S) continue;
						var G = (T - b) / 2, L = (C - _) / 2, k = Math.cos(F), O = Math.sin(F), V = k * G + O * L, W = -O * G + k * L, B = w * w, I = S * S, q = V * V, Q = W * W, X = (B * I - B * Q - I * q) / (B * Q + I * q), D = (A != U ? 1 : -1) * Math.sqrt(Math.max(X, 0)), E = D * (w * W) / S,
							H = S * V * -D / w, R = k * E - O * H + (T + b) / 2, Z = O * E + k * H + (C + _) / 2, z = function (t, e, r, s) {
								var n = (t * r + e * s) / (Math.sqrt(t * t + e * e) * Math.sqrt(r * r + s * s));
								return (t * s - e * r >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, n)))
							}, N = (V - E) / w, j = (W - H) / S, J = z(1, 0, N, j), K = z(N, j, (-V - E) / w, (-W - H) / S);
						!function (t, e, r, s, n, a, h) {
							var o = function (t, e) {
								var r = Math.sin(e), s = Math.cos(e), n = (e = t[0], t[1]), a = t[2], h = t[3];
								t[0] = e * s + n * r, t[1] = -e * r + n * s, t[2] = a * s + h * r, t[3] = -a * r + h * s
							}, f = function (t, e) {
								for (var r = 0; r < e.length; r += 2) {
									var s = e[r], n = e[r + 1];
									e[r] = t[0] * s + t[2] * n + t[4], e[r + 1] = t[1] * s + t[3] * n + t[5]
								}
							}, i = function (t, e) {
								for (var r = 0; r < e.length; r++) t.push(e[r])
							};
							if (h) for (; a > n;) a -= 2 * Math.PI; else for (; a < n;) a += 2 * Math.PI;
							var l = (a - n) / 4, c = Math.cos(l / 2), u = -Math.sin(l / 2), d = (4 - c) / 3, v = 0 == u ? u : (1 - c) * (3 - c) / (3 * u), p = [d, v, d, -v, c, -u], g = {cmds: ["C", "C", "C", "C"], crds: p.slice(0)}, m = [1, 0, 0, 1, 0, 0];
							o(m, -l);
							for (var y = 0; y < 3; y++) f(m, p), i(g.crds, p);
							o(m, l / 2 - n), m[0] *= s, m[1] *= s, m[2] *= s, m[3] *= s, m[4] = e, m[5] = r, f(m, g.crds), f(t.ctm, g.crds), function (t, e) {
								i(t.cmds, e.cmds), i(t.crds, e.crds)
							}(t.pth, g)
						}({pth: e, ctm: [w * k, w * O, -S * O, S * k, R, Z]}, 0, 0, 1, J, J + (K %= 2 * Math.PI), 0 == U), n = b, h = _
					} else console.log("Unknown SVG command " + d)
				}
			}
		}

		return {
			cssMap: function (t) {
				for (var r = e(t, "{", "}"), s = {}, n = 0; n < r.length; n += 2) for (var a = r[n].split(","), h = 0; h < a.length; h++) {
					var o = a[h].trim();
					null == s[o] && (s[o] = ""), s[o] += r[n + 1]
				}
				return s
			}, readTrnf: r, svgToPath: h, toPath: function (t) {
				var e = {cmds: [], crds: []};
				if (null == t) return e;
				var r = (new DOMParser).parseFromString(t, "image/svg+xml").getElementsByTagName("svg")[0], s = r.getAttribute("viewBox");
				s = s ? s.trim().split(" ").map(parseFloat) : [0, 0, 1e3, 1e3], n(r.children, e);
				for (var a = 0; a < e.crds.length; a += 2) {
					var h = e.crds[a], o = e.crds[a + 1];
					h -= s[0], o = -(o -= s[1]), e.crds[a] = h, e.crds[a + 1] = o
				}
				return e
			}
		}
	}(), initHB: function (t, e) {
		var r = function (t) {
			var e = 0;
			return 0 == (4294967168 & t) ? e = 1 : 0 == (4294965248 & t) ? e = 2 : 0 == (4294901760 & t) ? e = 3 : 0 == (4292870144 & t) && (e = 4), e
		}, s = new TextEncoder("utf8");
		fetch(t).then((function (t) {
			return t.arrayBuffer()
		})).then((function (t) {
			return WebAssembly.instantiate(t)
		})).then((function (t) {
			console.log("HB ready");
			var n = t.instance.exports, a = n.memory;
			a.grow(700);
			var h, o, f, i, l, c = new Uint8Array(a.buffer), u = new Uint32Array(a.buffer), d = new Int32Array(a.buffer);
			Typr.U.shapeHB = function (t, e, a) {
				var v = t._data, p = t.name.postScriptName;
				h != p && (null != o && (n.hb_blob_destroy(o), n.free(f), n.hb_face_destroy(i), n.hb_font_destroy(l)), f = n.malloc(v.byteLength), c.set(v, f), o = n.hb_blob_create(f, v.byteLength, 2, 0, 0), i = n.hb_face_create(o, 0), l = n.hb_font_create(i), h = p);
				var g = n.hb_buffer_create(), m = s.encode(e), y = m.length, T = n.malloc(y);
				c.set(m, T), n.hb_buffer_add_utf8(g, T, y, 0, y), n.free(T), n.hb_buffer_set_direction(g, a ? 4 : 5), n.hb_buffer_guess_segment_properties(g), n.hb_shape(l, g, 0, 0);
				var C = function (t) {
					for (var e = n.hb_buffer_get_length(t), r = [], s = n.hb_buffer_get_glyph_infos(t, 0) >>> 2, a = n.hb_buffer_get_glyph_positions(t, 0) >>> 2, h = 0; h < e; ++h) {
						var o = s + 5 * h, f = a + 5 * h;
						r.push({g: u[o + 0], cl: u[o + 2], ax: d[f + 0], ay: d[f + 1], dx: d[f + 2], dy: d[f + 3]})
					}
					return r
				}(g);
				n.hb_buffer_destroy(g);
				var b = C.slice(0);
				a || b.reverse();
				for (var _ = 0, M = 0, x = 1; x < b.length; x++) {
					for (var P = b[x], w = P.cl; ;) {
						var S = e.codePointAt(_), F = r(S);
						if (!(M + F <= w)) break;
						M += F, _ += S <= 65535 ? 1 : 2
					}
					P.cl = _
				}
				return C
			}, e()
		}))
	}
};

function d(n, t) {
	var r = (65535 & n) + (65535 & t);
	return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
}

function f(n, t, r, e, o, u) {
	return d((u = d(d(t, n), d(e, u))) << o | u >>> 32 - o, r)
}

function l(n, t, r, e, o, u, c) {
	return f(t & r | ~t & e, n, t, o, u, c)
}

function g(n, t, r, e, o, u, c) {
	return f(t & e | r & ~e, n, t, o, u, c)
}

function v(n, t, r, e, o, u, c) {
	return f(t ^ r ^ e, n, t, o, u, c)
}

function m(n, t, r, e, o, u, c) {
	return f(r ^ (t | ~e), n, t, o, u, c)
}

function c(n, t) {
	var r, e, o, u;
	n[t >> 5] |= 128 << t % 32,
		n[14 + (t + 64 >>> 9 << 4)] = t;
	for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16)
		c = l(r = c, e = f, o = i, u = a, n[h], 7, -680876936),
			a = l(a, c, f, i, n[h + 1], 12, -389564586),
			i = l(i, a, c, f, n[h + 2], 17, 606105819),
			f = l(f, i, a, c, n[h + 3], 22, -1044525330),
			c = l(c, f, i, a, n[h + 4], 7, -176418897),
			a = l(a, c, f, i, n[h + 5], 12, 1200080426),
			i = l(i, a, c, f, n[h + 6], 17, -1473231341),
			f = l(f, i, a, c, n[h + 7], 22, -45705983),
			c = l(c, f, i, a, n[h + 8], 7, 1770035416),
			a = l(a, c, f, i, n[h + 9], 12, -1958414417),
			i = l(i, a, c, f, n[h + 10], 17, -42063),
			f = l(f, i, a, c, n[h + 11], 22, -1990404162),
			c = l(c, f, i, a, n[h + 12], 7, 1804603682),
			a = l(a, c, f, i, n[h + 13], 12, -40341101),
			i = l(i, a, c, f, n[h + 14], 17, -1502002290),
			c = g(c, f = l(f, i, a, c, n[h + 15], 22, 1236535329), i, a, n[h + 1], 5, -165796510),
			a = g(a, c, f, i, n[h + 6], 9, -1069501632),
			i = g(i, a, c, f, n[h + 11], 14, 643717713),
			f = g(f, i, a, c, n[h], 20, -373897302),
			c = g(c, f, i, a, n[h + 5], 5, -701558691),
			a = g(a, c, f, i, n[h + 10], 9, 38016083),
			i = g(i, a, c, f, n[h + 15], 14, -660478335),
			f = g(f, i, a, c, n[h + 4], 20, -405537848),
			c = g(c, f, i, a, n[h + 9], 5, 568446438),
			a = g(a, c, f, i, n[h + 14], 9, -1019803690),
			i = g(i, a, c, f, n[h + 3], 14, -187363961),
			f = g(f, i, a, c, n[h + 8], 20, 1163531501),
			c = g(c, f, i, a, n[h + 13], 5, -1444681467),
			a = g(a, c, f, i, n[h + 2], 9, -51403784),
			i = g(i, a, c, f, n[h + 7], 14, 1735328473),
			c = v(c, f = g(f, i, a, c, n[h + 12], 20, -1926607734), i, a, n[h + 5], 4, -378558),
			a = v(a, c, f, i, n[h + 8], 11, -2022574463),
			i = v(i, a, c, f, n[h + 11], 16, 1839030562),
			f = v(f, i, a, c, n[h + 14], 23, -35309556),
			c = v(c, f, i, a, n[h + 1], 4, -1530992060),
			a = v(a, c, f, i, n[h + 4], 11, 1272893353),
			i = v(i, a, c, f, n[h + 7], 16, -155497632),
			f = v(f, i, a, c, n[h + 10], 23, -1094730640),
			c = v(c, f, i, a, n[h + 13], 4, 681279174),
			a = v(a, c, f, i, n[h], 11, -358537222),
			i = v(i, a, c, f, n[h + 3], 16, -722521979),
			f = v(f, i, a, c, n[h + 6], 23, 76029189),
			c = v(c, f, i, a, n[h + 9], 4, -640364487),
			a = v(a, c, f, i, n[h + 12], 11, -421815835),
			i = v(i, a, c, f, n[h + 15], 16, 530742520),
			c = m(c, f = v(f, i, a, c, n[h + 2], 23, -995338651), i, a, n[h], 6, -198630844),
			a = m(a, c, f, i, n[h + 7], 10, 1126891415),
			i = m(i, a, c, f, n[h + 14], 15, -1416354905),
			f = m(f, i, a, c, n[h + 5], 21, -57434055),
			c = m(c, f, i, a, n[h + 12], 6, 1700485571),
			a = m(a, c, f, i, n[h + 3], 10, -1894986606),
			i = m(i, a, c, f, n[h + 10], 15, -1051523),
			f = m(f, i, a, c, n[h + 1], 21, -2054922799),
			c = m(c, f, i, a, n[h + 8], 6, 1873313359),
			a = m(a, c, f, i, n[h + 15], 10, -30611744),
			i = m(i, a, c, f, n[h + 6], 15, -1560198380),
			f = m(f, i, a, c, n[h + 13], 21, 1309151649),
			c = m(c, f, i, a, n[h + 4], 6, -145523070),
			a = m(a, c, f, i, n[h + 11], 10, -1120210379),
			i = m(i, a, c, f, n[h + 2], 15, 718787259),
			f = m(f, i, a, c, n[h + 9], 21, -343485551),
			c = d(c, r),
			f = d(f, e),
			i = d(i, o),
			a = d(a, u);
	return [c, f, i, a]
}

function i(n) {
	for (var t = "", r = 32 * n.length, e = 0; e < r; e += 8)
		t += String.fromCharCode(n[e >> 5] >>> e % 32 & 255);
	return t
}

function a(n) {
	var t = [];
	for (t[(n.length >> 2) - 1] = void 0,
		     e = 0; e < t.length; e += 1)
		t[e] = 0;
	for (var r = 8 * n.length, e = 0; e < r; e += 8)
		t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32;
	return t
}

function e(n) {
	for (var t, r = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1)
		t = n.charCodeAt(o),
			e += r.charAt(t >>> 4 & 15) + r.charAt(15 & t);
	return e
}

function r(n) {
	return unescape(encodeURIComponent(n))
}

function o(n) {
	return i(c(a(n = r(n)), 8 * n.length))
}

function u(n, t) {
	return function (n, t) {
		var r, e = a(n), o = [], u = [];
		for (o[15] = u[15] = void 0,
		     16 < e.length && (e = c(e, 8 * n.length)),
			     r = 0; r < 16; r += 1)
			o[r] = 909522486 ^ e[r],
				u[r] = 1549556828 ^ e[r];
		return t = c(o.concat(a(t)), 512 + 8 * t.length),
			i(c(u.concat(t), 640))
	}(r(n), r(t))
}

function t(n, t, r) {
	return t ? r ? u(t, n) : e(u(t, n)) : r ? o(n) : e(o(n))
}

/*"function" == typeof define && define.amd ? define(function() {
	return t
}) : "object" == typeof module && module.exports ? module.exports = t : n.md5 = t*/
module.exports = {
	md5: t,
	typr: Typr
}

