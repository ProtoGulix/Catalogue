function bindReady() {
    $(".getload")[0] && $(".getload").each(function () {
        var e = $(this),
            t = $(e.data("target"));
        t.addClass("loading-spinner loading-spinner-central");
        var n = $.ajax({
            type: "GET",
            dataType: "json",
            url: e.attr("action"),
            data: e.serialize(),
            cache: !0
        });
        n.done(function (e) {
            t.html(e.html)
        }), n.always(function () {
            t.removeClass("loading-spinner loading-spinner-central")
        })
    })
}

function RefreshPrices(e, t) {
    if ("undefined" == typeof price_refresh_urls || !(price_refresh_urls instanceof Object)) return !1;
    "undefined" == typeof t && (t = price_refresh_urls.urls);
    var n = [],
        r = Object.keys(t).length,
        i = 0;
    r > 1 && e.find("#prices tbody tr").remove();
    var o = $(".price-progress-bar");
    o.removeClass("noshow").find("div").removeClass("loadingstarted").css("width", "").find("span").html(r), $(".price-messages .warning").addClass("hidden").find("span").html(""), $(".price-controls").addClass("disable-interaction"), $.each(t, function (t, a) {
        var s = $.ajax({
            type: "POST",
            url: a,
            dataType: "html",
            cache: !1,
            async: !0
        }).then(function (t) {
            e.html(t)
        }, function (e, n, r) {
            var i = "";
            /\S/.test($(".price-messages .warning span").html()) && (i = ", "), $(".price-messages .warning").removeClass("hidden").find("span").append(i + t), "undefined" != typeof ga && ga("send", "event", "Scrape", "Failure", t)
        }).always(function () {
            i++, (1 == r || r > 1 && i > 1) && o.find("div").addClass("loadingnow"), o.find("div").css("width", i / r * 100 + "%").addClass("loadingstarted")
        });
        n.push(s)
    }), Promise.all(n).then(function () {
        o.addClass("noshow").find("div").removeClass("loadingnow"), $(".price-controls").removeClass("disable-interaction"), bindPopups(), bindReady()
    })
}

function bindPopups() {
    $("a.popup, .button.popup, input.popup").not(".parent-forms").featherlight({
        openSpeed: 100,
        variant: "popup",
        afterOpen: popupevent,
        contentFilters: ["ajax"]
    })
}

function RefreshCurrencyVAT(e, t, n) {
    var r = $(this);
    if (e.preventDefault(), !r.data("locked")) {
        r.data("locked", !0), $("#prices tr").removeClass("loaded").addClass("loading").find("td.price").html("");
        var i = AjaxPost(t, n);
        return i.always(function () {
            r.data("locked", !1)
        }), i
    }
}

function AjaxPost(e, t, n, r) {
    var i = !1;
    if ("" == n || void 0 == n ? bAccept = !0 : bAccept = confirm(n), bAccept) {
        var i = $.ajax({
            type: "POST",
            url: e.attr("action"),
            data: e.serialize(),
            dataType: "json",
            cache: !1,
            async: !0
        });
        i.fail(function (t, n, r) {
            if ("abort" == n) return !1;
            var i;
            500 == t.status ? i = "Could not connect to server" : 422 == t.status ? $.each(t.responseJSON.errors, function (t, n) {
                $errorDiv = e.find("textarea[name=" + t + "]").siblings("div"), $errorDiv[0] ? $errorDiv.html(n) : e.find("textarea[name=" + t + "]").after("<div class='red smalltext'>" + n + "</div>")
            }) : 401 != t.status && 404 != t.status && 503 != t.status && 403 != t.status || (i = t.responseJSON.message), void 0 !== i && AlertBox(i)
        }), i.done(function (e) {
            null != e && (1 == e.status && "" != e.html && (null != e.target && "" != e.target ? (t = $(e.target), t.fadeOut(function () {
                t.html(e.html).fadeIn()
            })) : null != e.targetappend && "" != e.targetappend ? t.append(e.html).show() : 1 === r ? t.prepend(e.html) : 2 === r ? t.append(e.html) : t.html(e.html).show(), bindPopups()), void 0 !== e.message && "" != e.message && AlertBox(e.message))
        })
    }
    return i
}

function AjaxGet(e, t, n, r, i) {
    var o = $.ajax({
        type: "GET",
        url: e,
        data: r,
        cache: !1
    });
    return o.fail(function (e, t, n) {
        if ("abort" == t) return !1;
        if (i === !0) return !1;
        var r = "Could not connect to server";
        500 == e.status ? r = "There was an error" : 404 == e.status || 503 == e.status || 403 == e.status ? r = e.responseJSON.message : 401 == e.status && (r = "Please login to do that"), void 0 !== r && AlertBox(r)
    }).done(function (e) {
        null !== e && (2 == n ? t.append(e) : 1 == n ? t.prepend(e) : 3 == n && t.html(e))
    }), o
}

function AlertBox(e) {
    return alert(e)
}

function DoMainCheckbox(e) {
    var t = e.closest("table"),
        n = e.prop("checked");
    if (n) {
        var r = $("td:first-child input[type=checkbox]", t).filter(":checked").not(":visible").prop("checked", !1);
        r.each(function () {
            toggleHighlightAndSyncInput($(this), e, !1)
        });
        var i = $("td:first-child input[type=checkbox]", t).not(":checked").filter(":visible")
    } else var i = $("td:first-child input[type=checkbox]", t);
    if (i.prop("checked", n).closest("tr").toggleClass("selected", n), void 0 !== e.data("copytoform")) {
        var o = $(e.data("copytoform")).parents("form");
        n ? i.each(function () {
            var e = $(this).parent().find("input");
            copyInputToForms(e, o)
        }) : $("input.selectedCheckbox", o).remove(), refreshFormToCopyButtonState(e, o)
    }
}

function DoSingleCheckbox(e) {
    var t = e.closest("table"),
        n = t.find(".mainCheckbox").eq(0),
        r = $("td:first-child input[type=checkbox]", t).filter(":visible");
    if (toggleHighlightAndSyncInput(e, n), n.prop("checked", r.length == r.filter(":checked").length && r.filter(":checked").length > 1), void 0 !== n.data("copytoform")) {
        var i = $(n.data("copytoform")).parents("form");
        refreshFormToCopyButtonState(n, i)
    }
}

function toggleHighlightAndSyncInput(e, t, n) {
    if (void 0 === n && (n = e.prop("checked")), e.closest("tr").toggleClass("selected", n), void 0 !== t.data("copytoform")) {
        var r = $(t.data("copytoform")).parents("form"),
            i = e.parent().find("input");
        n ? copyInputToForms(i, r) : removeInputFromForms(i, r)
    }
}

function refreshFormToCopyButtonState(e, t) {
    var n = e.closest("table"),
        r = $("td:first-child input[type=checkbox]", n).filter(":checked");
    t.find("input, button").each(function () {
        var e = $(this),
            t = e.data("maxselection"),
            n = e.data("minselection"),
            i = !1;
        r.length < 1 ? i = !1 : void 0 !== t && void 0 !== n ? r.length <= t && r.length >= n && (i = !0) : void 0 === t && void 0 !== n ? r.length >= n && (i = !0) : void 0 !== t && void 0 === n ? r.length <= t && (i = !0) : r.length > 0 && (i = !0), i ? e.prop("disabled", !1).removeClass("disabled") : e.prop("disabled", "disabled").addClass("disabled")
    })
}

function copyInputToForms(e, t) {
    e.each(function () {
        var e = $(this),
            n = e.attr("name"),
            r = n.replace(/[\[\]']+/g, ""),
            i = e.val();
        t.each(function () {
            var e = $(this);
            e.children("input[name='" + r + "'][value='" + i + "']").length || e.append("<input type='hidden' name='" + n + "' value='" + i + "' class='selectedCheckbox' />")
        })
    })
}

function removeInputFromForms(e, t) {
    e.each(function () {
        var e = $(this),
            n = e.attr("name"),
            r = e.val();
        $("input[name='" + n + "'][value='" + r + "']", t).remove()
    })
}

function updateScrollPos(e, t) {
    $("html").css("cursor", "move"), t.scrollTop(t.scrollTop() + (clickY - e.pageY) / 3), t.scrollLeft(t.scrollLeft() + (clickX - e.pageX) / 3)
}

function repositionDiagramLabels() {
    return "undefined" != typeof imagemapwidth && (kx = imagemapwidth / $("#image img").width(), void $("#image .label").each(function () {
        var e = $(this),
            t = (e.position(), e.data("origleft") / kx - 10 / kx),
            n = e.data("origtop") / kx - 10 / kx,
            r = e.data("origwidth") / kx,
            i = e.data("origheight") / kx;
        e.css("left", t + "px").css("top", n + "px").css("width", r + "px").css("height", i + "px")
    }))
}

function preselectDiagramLabel() {
    var e, t;
    for (var n in localStorage) localStorage.hasOwnProperty(n) && n.indexOf("label-") !== -1 && (t = JSON.parse(localStorage.getItem(n)), t.timestamp + 1800 < (new Date).getTime() / 1e3 && localStorage.removeItem(n));
    "" !== hashtag ? e = hashtag : (e = JSON.parse(localStorage.getItem("label-" + window.location.pathname)), null !== e && (e = e.value)), void 0 !== e && null !== e && HighlightLabel($("td.label_" + e), !0)
}

function HighlightLabel(e, t) {
    $(".label").removeClass("selected");
    var n = e.data("labelid");
    if ($(".label_" + n).addClass("selected"), t || !e.is("td")) {
        if ($label = $("td.label_" + n), !$("td.label_" + n)[0]) return;
        var r = $("td.label_" + n).offset().top,
            i = r - $(window).scrollTop();
        (t || i > window.innerHeight || i < 0) && $page.animate({
            scrollTop: r - 40
        }, 750)
    }
    "function" == typeof window.history.replaceState ? history.replaceState({}, document.title, location.href.substr(0, location.href.length - location.hash.length) + "#" + n) : location.hash = n;
    var o = {
        value: parseInt(n, 10),
        timestamp: (new Date).getTime() / 1e3
    };
    localStorage.setItem("label-" + window.location.pathname, JSON.stringify(o))
}

function UnHighlightLabel(e) {
    e.data("labelid");
    $(".label").removeClass("selected"), "function" == typeof window.history.replaceState ? history.replaceState({}, document.title, location.href.substr(0, location.href.length - location.hash.length)) : location.hash = "", localStorage.removeItem("label-" + window.location.pathname)
} ! function (e, t, n) {
    function r(e, t) {
        return typeof e === t
    }

    function i() {
        var e, t, n, i, o, a, s;
        for (var l in w)
            if (w.hasOwnProperty(l)) {
                if (e = [], t = w[l], t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
                    for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase());
                for (i = r(t.fn, "function") ? t.fn() : t.fn, o = 0; o < e.length; o++) a = e[o], s = a.split("."), 1 === s.length ? _[s[0]] = i : (!_[s[0]] || _[s[0]] instanceof Boolean || (_[s[0]] = new Boolean(_[s[0]])), _[s[0]][s[1]] = i), x.push((i ? "" : "no-") + s.join("-"))
            }
    }

    function o(e) {
        var t = k.className,
            n = _._config.classPrefix || "";
        if (S && (t = t.baseVal), _._config.enableJSClass) {
            var r = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
            t = t.replace(r, "$1" + n + "js$2")
        }
        _._config.enableClasses && (t += " " + n + e.join(" " + n), S ? k.className.baseVal = t : k.className = t)
    }

    function a(e, t) {
        if ("object" == typeof e)
            for (var n in e) D(e, n) && a(n, e[n]);
        else {
            e = e.toLowerCase();
            var r = e.split("."),
                i = _[r[0]];
            if (2 == r.length && (i = i[r[1]]), "undefined" != typeof i) return _;
            t = "function" == typeof t ? t() : t, 1 == r.length ? _[r[0]] = t : (!_[r[0]] || _[r[0]] instanceof Boolean || (_[r[0]] = new Boolean(_[r[0]])), _[r[0]][r[1]] = t), o([(t && 0 != t ? "" : "no-") + r.join("-")]), _._trigger(e, t)
        }
        return _
    }

    function s() {
        return "function" != typeof t.createElement ? t.createElement(arguments[0]) : S ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments)
    }

    function l(e) {
        return e.replace(/([a-z])-([a-z])/g, function (e, t, n) {
            return t + n.toUpperCase()
        }).replace(/^-/, "")
    }

    function u() {
        var e = t.body;
        return e || (e = s(S ? "svg" : "body"), e.fake = !0), e
    }

    function c(e, n, r, i) {
        var o, a, l, c, d = "modernizr",
            f = s("div"),
            p = u();
        if (parseInt(r, 10))
            for (; r--;) l = s("div"), l.id = i ? i[r] : d + (r + 1), f.appendChild(l);
        return o = s("style"), o.type = "text/css", o.id = "s" + d, (p.fake ? p : f).appendChild(o), p.appendChild(f), o.styleSheet ? o.styleSheet.cssText = e : o.appendChild(t.createTextNode(e)), f.id = d, p.fake && (p.style.background = "", p.style.overflow = "hidden", c = k.style.overflow, k.style.overflow = "hidden", k.appendChild(p)), a = n(f, e), p.fake ? (p.parentNode.removeChild(p), k.style.overflow = c, k.offsetHeight) : f.parentNode.removeChild(f), !!a
    }

    function d(e, t) {
        return !!~("" + e).indexOf(t)
    }

    function f(e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    }

    function p(e, t, n) {
        var i;
        for (var o in e)
            if (e[o] in t) return n === !1 ? e[o] : (i = t[e[o]], r(i, "function") ? f(i, n || t) : i);
        return !1
    }

    function h(e) {
        return e.replace(/([A-Z])/g, function (e, t) {
            return "-" + t.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }

    function g(t, n, r) {
        var i;
        if ("getComputedStyle" in e) {
            i = getComputedStyle.call(e, t, n);
            var o = e.console;
            if (null !== i) r && (i = i.getPropertyValue(r));
            else if (o) {
                var a = o.error ? "error" : "log";
                o[a].call(o, "getComputedStyle returning null, its possible modernizr test results are inaccurate")
            }
        } else i = !n && t.currentStyle && t.currentStyle[r];
        return i
    }

    function m(t, r) {
        var i = t.length;
        if ("CSS" in e && "supports" in e.CSS) {
            for (; i--;)
                if (e.CSS.supports(h(t[i]), r)) return !0;
            return !1
        }
        if ("CSSSupportsRule" in e) {
            for (var o = []; i--;) o.push("(" + h(t[i]) + ":" + r + ")");
            return o = o.join(" or "), c("@supports (" + o + ") { #modernizr { position: absolute; } }", function (e) {
                return "absolute" == g(e, null, "position")
            })
        }
        return n
    }

    function v(e, t, i, o) {
        function a() {
            c && (delete z.style, delete z.modElem)
        }
        if (o = !r(o, "undefined") && o, !r(i, "undefined")) {
            var u = m(e, i);
            if (!r(u, "undefined")) return u
        }
        for (var c, f, p, h, g, v = ["modernizr", "tspan", "samp"]; !z.style && v.length;) c = !0, z.modElem = s(v.shift()), z.style = z.modElem.style;
        for (p = e.length, f = 0; p > f; f++)
            if (h = e[f], g = z.style[h], d(h, "-") && (h = l(h)), z.style[h] !== n) {
                if (o || r(i, "undefined")) return a(), "pfx" != t || h;
                try {
                    z.style[h] = i
                } catch (y) { }
                if (z.style[h] != g) return a(), "pfx" != t || h
            } return a(), !1
    }

    function y(e, t, n, i, o) {
        var a = e.charAt(0).toUpperCase() + e.slice(1),
            s = (e + " " + B.join(a + " ") + a).split(" ");
        return r(t, "string") || r(t, "undefined") ? v(s, t, i, o) : (s = (e + " " + $.join(a + " ") + a).split(" "), p(s, t, n))
    }

    function b(e, t, r) {
        return y(e, n, n, t, r)
    }
    var x = [],
        w = [],
        C = {
            _version: "3.5.0",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function (e, t) {
                var n = this;
                setTimeout(function () {
                    t(n[e])
                }, 0)
            },
            addTest: function (e, t, n) {
                w.push({
                    name: e,
                    fn: t,
                    options: n
                })
            },
            addAsyncTest: function (e) {
                w.push({
                    name: null,
                    fn: e
                })
            }
        },
        _ = function () { };
    _.prototype = C, _ = new _, _.addTest("geolocation", "geolocation" in navigator), _.addTest("history", function () {
        var t = navigator.userAgent;
        return (-1 === t.indexOf("Android 2.") && -1 === t.indexOf("Android 4.0") || -1 === t.indexOf("Mobile Safari") || -1 !== t.indexOf("Chrome") || -1 !== t.indexOf("Windows Phone") || "file:" === location.protocol) && (e.history && "pushState" in e.history)
    }), _.addTest("localstorage", function () {
        var e = "modernizr";
        try {
            return localStorage.setItem(e, e), localStorage.removeItem(e), !0
        } catch (t) {
            return !1
        }
    }), _.addTest("sessionstorage", function () {
        var e = "modernizr";
        try {
            return sessionStorage.setItem(e, e), sessionStorage.removeItem(e), !0
        } catch (t) {
            return !1
        }
    });
    var T = C._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
    C._prefixes = T;
    var k = t.documentElement,
        S = "svg" === k.nodeName.toLowerCase();
    S || ! function (e, t) {
        function n(e, t) {
            var n = e.createElement("p"),
                r = e.getElementsByTagName("head")[0] || e.documentElement;
            return n.innerHTML = "x<style>" + t + "</style>", r.insertBefore(n.lastChild, r.firstChild)
        }

        function r() {
            var e = b.elements;
            return "string" == typeof e ? e.split(" ") : e
        }

        function i(e, t) {
            var n = b.elements;
            "string" != typeof n && (n = n.join(" ")), "string" != typeof e && (e = e.join(" ")), b.elements = n + " " + e, u(t)
        }

        function o(e) {
            var t = y[e[m]];
            return t || (t = {}, v++, e[m] = v, y[v] = t), t
        }

        function a(e, n, r) {
            if (n || (n = t), d) return n.createElement(e);
            r || (r = o(n));
            var i;
            return i = r.cache[e] ? r.cache[e].cloneNode() : g.test(e) ? (r.cache[e] = r.createElem(e)).cloneNode() : r.createElem(e), !i.canHaveChildren || h.test(e) || i.tagUrn ? i : r.frag.appendChild(i)
        }

        function s(e, n) {
            if (e || (e = t), d) return e.createDocumentFragment();
            n = n || o(e);
            for (var i = n.frag.cloneNode(), a = 0, s = r(), l = s.length; l > a; a++) i.createElement(s[a]);
            return i
        }

        function l(e, t) {
            t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function (n) {
                return b.shivMethods ? a(n, e, t) : t.createElem(n)
            }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + r().join().replace(/[\w\-:]+/g, function (e) {
                return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
            }) + ");return n}")(b, t.frag)
        }

        function u(e) {
            e || (e = t);
            var r = o(e);
            return !b.shivCSS || c || r.hasCSS || (r.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), d || l(e, r), e
        }
        var c, d, f = "3.7.3",
            p = e.html5 || {},
            h = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
            g = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
            m = "_html5shiv",
            v = 0,
            y = {};
        ! function () {
            try {
                var e = t.createElement("a");
                e.innerHTML = "<xyz></xyz>", c = "hidden" in e, d = 1 == e.childNodes.length || function () {
                    t.createElement("a");
                    var e = t.createDocumentFragment();
                    return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
                }()
            } catch (n) {
                c = !0, d = !0
            }
        }();
        var b = {
            elements: p.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
            version: f,
            shivCSS: p.shivCSS !== !1,
            supportsUnknownElements: d,
            shivMethods: p.shivMethods !== !1,
            type: "default",
            shivDocument: u,
            createElement: a,
            createDocumentFragment: s,
            addElements: i
        };
        e.html5 = b, u(t), "object" == typeof module && module.exports && (module.exports = b)
    }("undefined" != typeof e ? e : this, t);
    var E = "Moz O ms Webkit",
        $ = C._config.usePrefixes ? E.toLowerCase().split(" ") : [];
    C._domPrefixes = $;
    var D;
    ! function () {
        var e = {}.hasOwnProperty;
        D = r(e, "undefined") || r(e.call, "undefined") ? function (e, t) {
            return t in e && r(e.constructor.prototype[t], "undefined")
        } : function (t, n) {
            return e.call(t, n)
        }
    }(), C._l = {}, C.on = function (e, t) {
        this._l[e] || (this._l[e] = []), this._l[e].push(t), _.hasOwnProperty(e) && setTimeout(function () {
            _._trigger(e, _[e])
        }, 0)
    }, C._trigger = function (e, t) {
        if (this._l[e]) {
            var n = this._l[e];
            setTimeout(function () {
                var e, r;
                for (e = 0; e < n.length; e++)(r = n[e])(t)
            }, 0), delete this._l[e]
        }
    }, _._q.push(function () {
        C.addTest = a
    });
    var j = function () {
        function e(e, t) {
            var i;
            return !!e && (t && "string" != typeof t || (t = s(t || "div")), e = "on" + e, i = e in t, !i && r && (t.setAttribute || (t = s("div")), t.setAttribute(e, ""), i = "function" == typeof t[e], t[e] !== n && (t[e] = n), t.removeAttribute(e)), i)
        }
        var r = !("onblur" in t.documentElement);
        return e
    }();
    C.hasEvent = j, _.addTest("hashchange", function () {
        return j("hashchange", e) !== !1 && (t.documentMode === n || t.documentMode > 7)
    }), _.addTest("contenteditable", function () {
        if ("contentEditable" in k) {
            var e = s("div");
            return e.contentEditable = !0, "true" === e.contentEditable
        }
    }), _.addTest("cssgradients", function () {
        for (var e, t = "background-image:", n = "gradient(linear,left top,right bottom,from(#9f9),to(white));", r = "", i = 0, o = T.length - 1; o > i; i++) e = 0 === i ? "to " : "", r += t + T[i] + "linear-gradient(" + e + "left top, #9f9, white);";
        _._config.usePrefixes && (r += t + "-webkit-" + n);
        var a = s("a"),
            l = a.style;
        return l.cssText = r, ("" + l.backgroundImage).indexOf("gradient") > -1
    }), _.addTest("csspositionsticky", function () {
        var e = "position:",
            t = "sticky",
            n = s("a"),
            r = n.style;
        return r.cssText = e + T.join(t + ";" + e).slice(0, -e.length), -1 !== r.position.indexOf(t)
    }), _.addTest("rgba", function () {
        var e = s("a").style;
        return e.cssText = "background-color:rgba(150,255,150,.5)", ("" + e.backgroundColor).indexOf("rgba") > -1
    });
    var A = s("input"),
        N = "autocomplete autofocus list placeholder max min multiple pattern required step".split(" "),
        O = {};
    _.input = function (t) {
        for (var n = 0, r = t.length; r > n; n++) O[t[n]] = !!(t[n] in A);
        return O.list && (O.list = !(!s("datalist") || !e.HTMLDataListElement)), O
    }(N);
    var P = "search tel url email datetime date month week time datetime-local number range color".split(" "),
        q = {};
    _.inputtypes = function (e) {
        for (var r, i, o, a = e.length, s = "1)", l = 0; a > l; l++) A.setAttribute("type", r = e[l]), o = "text" !== A.type && "style" in A, o && (A.value = s, A.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(r) && A.style.WebkitAppearance !== n ? (k.appendChild(A), i = t.defaultView, o = i.getComputedStyle && "textfield" !== i.getComputedStyle(A, null).WebkitAppearance && 0 !== A.offsetHeight, k.removeChild(A)) : /^(search|tel)$/.test(r) || (o = /^(url|email)$/.test(r) ? A.checkValidity && A.checkValidity() === !1 : A.value != s)), q[e[l]] = !!o;
        return q
    }(P);
    var L = "CSS" in e && "supports" in e.CSS,
        F = "supportsCSS" in e;
    _.addTest("supports", L || F);
    var I = function () {
        var t = e.matchMedia || e.msMatchMedia;
        return t ? function (e) {
            var n = t(e);
            return n && n.matches || !1
        } : function (t) {
            var n = !1;
            return c("@media " + t + " { #modernizr { position: absolute; } }", function (t) {
                n = "absolute" == (e.getComputedStyle ? e.getComputedStyle(t, null) : t.currentStyle).position
            }), n
        }
    }();
    C.mq = I;
    var H = C.testStyles = c;
    _.addTest("hiddenscroll", function () {
        return H("#modernizr {width:100px;height:100px;overflow:scroll}", function (e) {
            return e.offsetWidth === e.clientWidth
        })
    });
    var R = function () {
        var e = navigator.userAgent,
            t = e.match(/w(eb)?osbrowser/gi),
            n = e.match(/windows phone/gi) && e.match(/iemobile\/([0-9])+/gi) && parseFloat(RegExp.$1) >= 9;
        return t || n
    }();
    R ? _.addTest("fontface", !1) : H('@font-face {font-family:"font";src:url("https://")}', function (e, n) {
        var r = t.getElementById("smodernizr"),
            i = r.sheet || r.styleSheet,
            o = i ? i.cssRules && i.cssRules[0] ? i.cssRules[0].cssText : i.cssText || "" : "",
            a = /src/i.test(o) && 0 === o.indexOf(n.split(" ")[0]);
        _.addTest("fontface", a)
    }), H('#modernizr{font:0/0 a}#modernizr:after{content:":)";visibility:hidden;font:7px/1 a}', function (e) {
        _.addTest("generatedcontent", e.offsetHeight >= 6)
    }), _.addTest("details", function () {
        var e, t = s("details");
        return "open" in t && (H("#modernizr details{display:block}", function (n) {
            n.appendChild(t), t.innerHTML = "<summary>a</summary>b", e = t.offsetHeight, t.open = !0, e = e != t.offsetHeight
        }), e)
    });
    var B = C._config.usePrefixes ? E.split(" ") : [];
    C._cssomPrefixes = B;
    var M = function (t) {
        var r, i = T.length,
            o = e.CSSRule;
        if ("undefined" == typeof o) return n;
        if (!t) return !1;
        if (t = t.replace(/^@/, ""), r = t.replace(/-/g, "_").toUpperCase() + "_RULE", r in o) return "@" + t;
        for (var a = 0; i > a; a++) {
            var s = T[a],
                l = s.toUpperCase() + "_" + r;
            if (l in o) return "@-" + s.toLowerCase() + "-" + t
        }
        return !1
    };
    C.atRule = M;
    var W = {
        elem: s("modernizr")
    };
    _._q.push(function () {
        delete W.elem
    });
    var z = {
        style: W.elem.style
    };
    _._q.unshift(function () {
        delete z.style
    }), C.testProp = function (e, t, r) {
        return v([e], n, t, r)
    }, C.testAllProps = y, C.prefixed = function (e, t, n) {
        return 0 === e.indexOf("@") ? M(e) : (-1 != e.indexOf("-") && (e = l(e)), t ? y(e, t, n) : y(e, "pfx"))
    }, C.testAllProps = b, _.addTest("cssanimations", b("animationName", "a", !0)), _.addTest("backgroundsize", b("backgroundSize", "100%", !0)), _.addTest("borderimage", b("borderImage", "url() 1", !0)),
        function () {
            _.addTest("csscolumns", function () {
                var e = !1,
                    t = b("columnCount");
                try {
                    e = !!t, e && (e = new Boolean(e))
                } catch (n) { }
                return e
            });
            for (var e, t, n = ["Width", "Span", "Fill", "Gap", "Rule", "RuleColor", "RuleStyle", "RuleWidth", "BreakBefore", "BreakAfter", "BreakInside"], r = 0; r < n.length; r++) e = n[r].toLowerCase(), t = b("column" + n[r]), ("breakbefore" === e || "breakafter" === e || "breakinside" == e) && (t = t || b(n[r])), _.addTest("csscolumns." + e, t)
        }(), _.addTest("flexbox", b("flexBasis", "1px", !0)), _.addTest("csstransforms", function () {
            return -1 === navigator.userAgent.indexOf("Android 2.") && b("transform", "scale(1)", !0)
        }), _.addTest("csstransforms3d", function () {
            var e = !!b("perspective", "1px", !0),
                t = _._config.usePrefixes;
            if (e && (!t || "webkitPerspective" in k.style)) {
                var n, r = "#modernizr{width:0;height:0}";
                _.supports ? n = "@supports (perspective: 1px)" : (n = "@media (transform-3d)", t && (n += ",(-webkit-transform-3d)")), n += "{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}", H(r + n, function (t) {
                    e = 7 === t.offsetWidth && 18 === t.offsetHeight
                })
            }
            return e
        }), _.addTest("csstransitions", b("transition", "all", !0)), i(), o(x), delete C.addTest, delete C.addAsyncTest;
    for (var U = 0; U < _._q.length; U++) _._q[U]();
    e.Modernizr = _
}(window, document), ! function (e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
    "use strict";

    function n(e, t, n) {
        var r, i = (t = t || ae).createElement("script");
        if (i.text = e, n)
            for (r in xe) n[r] && (i[r] = n[r]);
        t.head.appendChild(i).parentNode.removeChild(i)
    }

    function r(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? fe[pe.call(e)] || "object" : typeof e
    }

    function i(e) {
        var t = !!e && "length" in e && e.length,
            n = r(e);
        return !ye(e) && !be(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function o(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }

    function a(e, t, n) {
        return ye(t) ? we.grep(e, function (e, r) {
            return !!t.call(e, r, e) !== n
        }) : t.nodeType ? we.grep(e, function (e) {
            return e === t !== n
        }) : "string" != typeof t ? we.grep(e, function (e) {
            return de.call(t, e) > -1 !== n
        }) : we.filter(t, e, n)
    }

    function s(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }

    function l(e) {
        var t = {};
        return we.each(e.match(Ne) || [], function (e, n) {
            t[n] = !0
        }), t
    }

    function u(e) {
        return e
    }

    function c(e) {
        throw e
    }

    function d(e, t, n, r) {
        var i;
        try {
            e && ye(i = e.promise) ? i.call(e).done(t).fail(n) : e && ye(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }

    function f() {
        ae.removeEventListener("DOMContentLoaded", f), e.removeEventListener("load", f), we.ready()
    }

    function p(e, t) {
        return t.toUpperCase()
    }

    function h(e) {
        return e.replace(Le, "ms-").replace(Fe, p)
    }

    function g() {
        this.expando = we.expando + g.uid++
    }

    function m(e) {
        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Be.test(e) ? JSON.parse(e) : e)
    }

    function v(e, t, n) {
        var r;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(Me, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = m(n)
                } catch (e) { }
                Re.set(e, t, n)
            } else n = void 0;
        return n
    }

    function y(e, t, n, r) {
        var i, o, a = 20,
            s = r ? function () {
                return r.cur()
            } : function () {
                return we.css(e, t, "")
            },
            l = s(),
            u = n && n[3] || (we.cssNumber[t] ? "" : "px"),
            c = (we.cssNumber[t] || "px" !== u && +l) && ze.exec(we.css(e, t));
        if (c && c[3] !== u) {
            for (l /= 2, u = u || c[3], c = +l || 1; a--;) we.style(e, t, c + u), (1 - o) * (1 - (o = s() / l || .5)) <= 0 && (a = 0), c /= o;
            c *= 2, we.style(e, t, c + u), n = n || []
        }
        return n && (c = +c || +l || 0, i = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = u, r.start = c, r.end = i)), i
    }

    function b(e) {
        var t, n = e.ownerDocument,
            r = e.nodeName,
            i = Qe[r];
        return i || (t = n.body.appendChild(n.createElement(r)), i = we.css(t, "display"), t.parentNode.removeChild(t), "none" === i && (i = "block"), Qe[r] = i, i)
    }

    function x(e, t) {
        for (var n, r, i = [], o = 0, a = e.length; o < a; o++)(r = e[o]).style && (n = r.style.display, t ? ("none" === n && (i[o] = He.get(r, "display") || null, i[o] || (r.style.display = "")), "" === r.style.display && Xe(r) && (i[o] = b(r))) : "none" !== n && (i[o] = "none", He.set(r, "display", n)));
        for (o = 0; o < a; o++) null != i[o] && (e[o].style.display = i[o]);
        return e
    }

    function w(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && o(e, t) ? we.merge([e], n) : n
    }

    function C(e, t) {
        for (var n = 0, r = e.length; n < r; n++) He.set(e[n], "globalEval", !t || He.get(t[n], "globalEval"))
    }

    function _(e, t, n, i, o) {
        for (var a, s, l, u, c, d, f = t.createDocumentFragment(), p = [], h = 0, g = e.length; h < g; h++)
            if ((a = e[h]) || 0 === a)
                if ("object" === r(a)) we.merge(p, a.nodeType ? [a] : a);
                else if (Ke.test(a)) {
                    for (s = s || f.appendChild(t.createElement("div")), l = (Ze.exec(a) || ["", ""])[1].toLowerCase(), u = Ye[l] || Ye._default, s.innerHTML = u[1] + we.htmlPrefilter(a) + u[2], d = u[0]; d--;) s = s.lastChild;
                    we.merge(p, s.childNodes), (s = f.firstChild).textContent = ""
                } else p.push(t.createTextNode(a));
        for (f.textContent = "", h = 0; a = p[h++];)
            if (i && we.inArray(a, i) > -1) o && o.push(a);
            else if (c = we.contains(a.ownerDocument, a), s = w(f.appendChild(a), "script"), c && C(s), n)
                for (d = 0; a = s[d++];) Je.test(a.type || "") && n.push(a);
        return f
    }

    function T() {
        return !0
    }

    function k() {
        return !1
    }

    function S() {
        try {
            return ae.activeElement
        } catch (e) { }
    }

    function E(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            "string" != typeof n && (r = r || n, n = void 0);
            for (s in t) E(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i) i = k;
        else if (!i) return e;
        return 1 === o && (a = i, (i = function (e) {
            return we().off(e), a.apply(this, arguments)
        }).guid = a.guid || (a.guid = we.guid++)), e.each(function () {
            we.event.add(this, t, i, r, n)
        })
    }

    function $(e, t) {
        return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") ? we(e).children("tbody")[0] || e : e
    }

    function D(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function j(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
    }

    function A(e, t) {
        var n, r, i, o, a, s, l, u;
        if (1 === t.nodeType) {
            if (He.hasData(e) && (o = He.access(e), a = He.set(t, o), u = o.events)) {
                delete a.handle, a.events = {};
                for (i in u)
                    for (n = 0, r = u[i].length; n < r; n++) we.event.add(t, i, u[i][n])
            }
            Re.hasData(e) && (s = Re.access(e), l = we.extend({}, s), Re.set(t, l))
        }
    }

    function N(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && Ge.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
    }

    function O(e, t, r, i) {
        t = ue.apply([], t);
        var o, a, s, l, u, c, d = 0,
            f = e.length,
            p = f - 1,
            h = t[0],
            g = ye(h);
        if (g || f > 1 && "string" == typeof h && !ve.checkClone && at.test(h)) return e.each(function (n) {
            var o = e.eq(n);
            g && (t[0] = h.call(this, n, o.html())), O(o, t, r, i)
        });
        if (f && (o = _(t, e[0].ownerDocument, !1, e, i), a = o.firstChild, 1 === o.childNodes.length && (o = a), a || i)) {
            for (l = (s = we.map(w(o, "script"), D)).length; d < f; d++) u = o, d !== p && (u = we.clone(u, !0, !0), l && we.merge(s, w(u, "script"))), r.call(e[d], u, d);
            if (l)
                for (c = s[s.length - 1].ownerDocument, we.map(s, j), d = 0; d < l; d++) u = s[d], Je.test(u.type || "") && !He.access(u, "globalEval") && we.contains(c, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? we._evalUrl && we._evalUrl(u.src) : n(u.textContent.replace(st, ""), c, u))
        }
        return e
    }

    function P(e, t, n) {
        for (var r, i = t ? we.filter(t, e) : e, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || we.cleanData(w(r)), r.parentNode && (n && we.contains(r.ownerDocument, r) && C(w(r, "script")), r.parentNode.removeChild(r));
        return e
    }

    function q(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || ut(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || we.contains(e.ownerDocument, e) || (a = we.style(e, t)), !ve.pixelBoxStyles() && lt.test(a) && ct.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a
    }

    function L(e, t) {
        return {
            get: function () {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }

    function F(e) {
        if (e in mt) return e;
        for (var t = e[0].toUpperCase() + e.slice(1), n = gt.length; n--;)
            if ((e = gt[n] + t) in mt) return e
    }

    function I(e) {
        var t = we.cssProps[e];
        return t || (t = we.cssProps[e] = F(e) || e), t
    }

    function H(e, t, n) {
        var r = ze.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }

    function R(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0,
            s = 0,
            l = 0;
        if (n === (r ? "border" : "content")) return 0;
        for (; a < 4; a += 2) "margin" === n && (l += we.css(e, n + Ue[a], !0, i)), r ? ("content" === n && (l -= we.css(e, "padding" + Ue[a], !0, i)), "margin" !== n && (l -= we.css(e, "border" + Ue[a] + "Width", !0, i))) : (l += we.css(e, "padding" + Ue[a], !0, i), "padding" !== n ? l += we.css(e, "border" + Ue[a] + "Width", !0, i) : s += we.css(e, "border" + Ue[a] + "Width", !0, i));
        return !r && o >= 0 && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - l - s - .5))), l
    }

    function B(e, t, n) {
        var r = ut(e),
            i = q(e, t, r),
            o = "border-box" === we.css(e, "boxSizing", !1, r),
            a = o;
        if (lt.test(i)) {
            if (!n) return i;
            i = "auto"
        }
        return a = a && (ve.boxSizingReliable() || i === e.style[t]), ("auto" === i || !parseFloat(i) && "inline" === we.css(e, "display", !1, r)) && (i = e["offset" + t[0].toUpperCase() + t.slice(1)], a = !0), (i = parseFloat(i) || 0) + R(e, t, n || (o ? "border" : "content"), a, r, i) + "px"
    }

    function M(e, t, n, r, i) {
        return new M.prototype.init(e, t, n, r, i)
    }

    function W() {
        yt && (!1 === ae.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(W) : e.setTimeout(W, we.fx.interval), we.fx.tick())
    }

    function z() {
        return e.setTimeout(function () {
            vt = void 0
        }), vt = Date.now()
    }

    function U(e, t) {
        var n, r = 0,
            i = {
                height: e
            };
        for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (n = Ue[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i
    }

    function X(e, t, n) {
        for (var r, i = (G.tweeners[t] || []).concat(G.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e)) return r
    }

    function V(e, t, n) {
        var r, i, o, a, s, l, u, c, d = "width" in t || "height" in t,
            f = this,
            p = {},
            h = e.style,
            g = e.nodeType && Xe(e),
            m = He.get(e, "fxshow");
        n.queue || (null == (a = we._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () {
            a.unqueued || s()
        }), a.unqueued++, f.always(function () {
            f.always(function () {
                a.unqueued--, we.queue(e, "fx").length || a.empty.fire()
            })
        }));
        for (r in t)
            if (i = t[r], bt.test(i)) {
                if (delete t[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
                    if ("show" !== i || !m || void 0 === m[r]) continue;
                    g = !0
                }
                p[r] = m && m[r] || we.style(e, r)
            } if ((l = !we.isEmptyObject(t)) || !we.isEmptyObject(p)) {
                d && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (u = m && m.display) && (u = He.get(e, "display")), "none" === (c = we.css(e, "display")) && (u ? c = u : (x([e], !0), u = e.style.display || u, c = we.css(e, "display"), x([e]))), ("inline" === c || "inline-block" === c && null != u) && "none" === we.css(e, "float") && (l || (f.done(function () {
                    h.display = u
                }), null == u && (c = h.display, u = "none" === c ? "" : c)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", f.always(function () {
                    h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                })), l = !1;
                for (r in p) l || (m ? "hidden" in m && (g = m.hidden) : m = He.access(e, "fxshow", {
                    display: u
                }), o && (m.hidden = !g), g && x([e], !0), f.done(function () {
                    g || x([e]), He.remove(e, "fxshow");
                    for (r in p) we.style(e, r, p[r])
                })), l = X(g ? m[r] : 0, r, f), r in m || (m[r] = l.start, g && (l.end = l.start, l.start = 0))
            }
    }

    function Q(e, t) {
        var n, r, i, o, a;
        for (n in e)
            if (r = h(n), i = t[r], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = we.cssHooks[r]) && "expand" in a) {
                o = a.expand(o), delete e[r];
                for (n in o) n in e || (e[n] = o[n], t[n] = i)
            } else t[r] = i
    }

    function G(e, t, n) {
        var r, i, o = 0,
            a = G.prefilters.length,
            s = we.Deferred().always(function () {
                delete l.elem
            }),
            l = function () {
                if (i) return !1;
                for (var t = vt || z(), n = Math.max(0, u.startTime + u.duration - t), r = 1 - (n / u.duration || 0), o = 0, a = u.tweens.length; o < a; o++) u.tweens[o].run(r);
                return s.notifyWith(e, [u, r, n]), r < 1 && a ? n : (a || s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u]), !1)
            },
            u = s.promise({
                elem: e,
                props: we.extend({}, t),
                opts: we.extend(!0, {
                    specialEasing: {},
                    easing: we.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: vt || z(),
                duration: n.duration,
                tweens: [],
                createTween: function (t, n) {
                    var r = we.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(r), r
                },
                stop: function (t) {
                    var n = 0,
                        r = t ? u.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; n < r; n++) u.tweens[n].run(1);
                    return t ? (s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u, t])) : s.rejectWith(e, [u, t]), this
                }
            }),
            c = u.props;
        for (Q(c, u.opts.specialEasing); o < a; o++)
            if (r = G.prefilters[o].call(u, e, c, u.opts)) return ye(r.stop) && (we._queueHooks(u.elem, u.opts.queue).stop = r.stop.bind(r)),
                r;
        return we.map(c, X, u), ye(u.opts.start) && u.opts.start.call(e, u), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always), we.fx.timer(we.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u
    }

    function Z(e) {
        return (e.match(Ne) || []).join(" ")
    }

    function J(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }

    function Y(e) {
        return Array.isArray(e) ? e : "string" == typeof e ? e.match(Ne) || [] : []
    }

    function K(e, t, n, i) {
        var o;
        if (Array.isArray(t)) we.each(t, function (t, r) {
            n || At.test(e) ? i(e, r) : K(e + "[" + ("object" == typeof r && null != r ? t : "") + "]", r, n, i)
        });
        else if (n || "object" !== r(t)) i(e, t);
        else
            for (o in t) K(e + "[" + o + "]", t[o], n, i)
    }

    function ee(e) {
        return function (t, n) {
            "string" != typeof t && (n = t, t = "*");
            var r, i = 0,
                o = t.toLowerCase().match(Ne) || [];
            if (ye(n))
                for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }

    function te(e, t, n, r) {
        function i(s) {
            var l;
            return o[s] = !0, we.each(e[s] || [], function (e, s) {
                var u = s(t, n, r);
                return "string" != typeof u || a || o[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), i(u), !1)
            }), l
        }
        var o = {},
            a = e === Wt;
        return i(t.dataTypes[0]) || !o["*"] && i("*")
    }

    function ne(e, t) {
        var n, r, i = we.ajaxSettings.flatOptions || {};
        for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && we.extend(!0, e, r), e
    }

    function re(e, t, n) {
        for (var r, i, o, a, s = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
        if (r)
            for (i in s)
                if (s[i] && s[i].test(r)) {
                    l.unshift(i);
                    break
                } if (l[0] in n) o = l[0];
        else {
            for (i in n) {
                if (!l[0] || e.converters[i + " " + l[0]]) {
                    o = i;
                    break
                }
                a || (a = i)
            }
            o = o || a
        }
        if (o) return o !== l[0] && l.unshift(o), n[o]
    }

    function ie(e, t, n, r) {
        var i, o, a, s, l, u = {},
            c = e.dataTypes.slice();
        if (c[1])
            for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
        for (o = c.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
                    if (!(a = u[l + " " + o] || u["* " + o]))
                        for (i in u)
                            if ((s = i.split(" "))[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                                !0 === a ? a = u[i] : !0 !== u[i] && (o = s[0], c.unshift(s[1]));
                                break
                            } if (!0 !== a)
                        if (a && e["throws"]) t = a(t);
                        else try {
                            t = a(t)
                        } catch (e) {
                            return {
                                state: "parsererror",
                                error: a ? e : "No conversion from " + l + " to " + o
                            }
                        }
                }
        return {
            state: "success",
            data: t
        }
    }
    var oe = [],
        ae = e.document,
        se = Object.getPrototypeOf,
        le = oe.slice,
        ue = oe.concat,
        ce = oe.push,
        de = oe.indexOf,
        fe = {},
        pe = fe.toString,
        he = fe.hasOwnProperty,
        ge = he.toString,
        me = ge.call(Object),
        ve = {},
        ye = function (e) {
            return "function" == typeof e && "number" != typeof e.nodeType
        },
        be = function (e) {
            return null != e && e === e.window
        },
        xe = {
            type: !0,
            src: !0,
            noModule: !0
        },
        we = function (e, t) {
            return new we.fn.init(e, t)
        },
        Ce = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    we.fn = we.prototype = {
        jquery: "3.3.1",
        constructor: we,
        length: 0,
        toArray: function () {
            return le.call(this)
        },
        get: function (e) {
            return null == e ? le.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function (e) {
            var t = we.merge(this.constructor(), e);
            return t.prevObject = this, t
        },
        each: function (e) {
            return we.each(this, e)
        },
        map: function (e) {
            return this.pushStack(we.map(this, function (t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function () {
            return this.pushStack(le.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor()
        },
        push: ce,
        sort: oe.sort,
        splice: oe.splice
    }, we.extend = we.fn.extend = function () {
        var e, t, n, r, i, o, a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            u = !1;
        for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || ye(a) || (a = {}), s === l && (a = this, s--); s < l; s++)
            if (null != (e = arguments[s]))
                for (t in e) n = a[t], a !== (r = e[t]) && (u && r && (we.isPlainObject(r) || (i = Array.isArray(r))) ? (i ? (i = !1, o = n && Array.isArray(n) ? n : []) : o = n && we.isPlainObject(n) ? n : {}, a[t] = we.extend(u, o, r)) : void 0 !== r && (a[t] = r));
        return a
    }, we.extend({
        expando: "jQuery" + ("3.3.1" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
            throw new Error(e)
        },
        noop: function () { },
        isPlainObject: function (e) {
            var t, n;
            return !(!e || "[object Object]" !== pe.call(e) || (t = se(e)) && ("function" != typeof (n = he.call(t, "constructor") && t.constructor) || ge.call(n) !== me))
        },
        isEmptyObject: function (e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        globalEval: function (e) {
            n(e)
        },
        each: function (e, t) {
            var n, r = 0;
            if (i(e))
                for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++);
            else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r])) break;
            return e
        },
        trim: function (e) {
            return null == e ? "" : (e + "").replace(Ce, "")
        },
        makeArray: function (e, t) {
            var n = t || [];
            return null != e && (i(Object(e)) ? we.merge(n, "string" == typeof e ? [e] : e) : ce.call(n, e)), n
        },
        inArray: function (e, t, n) {
            return null == t ? -1 : de.call(t, e, n)
        },
        merge: function (e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
            return e.length = i, e
        },
        grep: function (e, t, n) {
            for (var r, i = [], o = 0, a = e.length, s = !n; o < a; o++)(r = !t(e[o], o)) !== s && i.push(e[o]);
            return i
        },
        map: function (e, t, n) {
            var r, o, a = 0,
                s = [];
            if (i(e))
                for (r = e.length; a < r; a++) null != (o = t(e[a], a, n)) && s.push(o);
            else
                for (a in e) null != (o = t(e[a], a, n)) && s.push(o);
            return ue.apply([], s)
        },
        guid: 1,
        support: ve
    }), "function" == typeof Symbol && (we.fn[Symbol.iterator] = oe[Symbol.iterator]), we.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
        fe["[object " + t + "]"] = t.toLowerCase()
    });
    var _e = function (e) {
        function t(e, t, n, r) {
            var i, o, a, s, l, u, c, f = t && t.ownerDocument,
                h = t ? t.nodeType : 9;
            if (n = n || [], "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h) return n;
            if (!r && ((t ? t.ownerDocument || t : B) !== O && N(t), t = t || O, q)) {
                if (11 !== h && (l = ve.exec(e)))
                    if (i = l[1]) {
                        if (9 === h) {
                            if (!(a = t.getElementById(i))) return n;
                            if (a.id === i) return n.push(a), n
                        } else if (f && (a = f.getElementById(i)) && H(t, a) && a.id === i) return n.push(a), n
                    } else {
                        if (l[2]) return Y.apply(n, t.getElementsByTagName(e)), n;
                        if ((i = l[3]) && C.getElementsByClassName && t.getElementsByClassName) return Y.apply(n, t.getElementsByClassName(i)), n
                    } if (C.qsa && !X[e + " "] && (!L || !L.test(e))) {
                        if (1 !== h) f = t, c = e;
                        else if ("object" !== t.nodeName.toLowerCase()) {
                            for ((s = t.getAttribute("id")) ? s = s.replace(we, Ce) : t.setAttribute("id", s = R), o = (u = S(e)).length; o--;) u[o] = "#" + s + " " + p(u[o]);
                            c = u.join(","), f = ye.test(e) && d(t.parentNode) || t
                        }
                        if (c) try {
                            return Y.apply(n, f.querySelectorAll(c)), n
                        } catch (e) { } finally {
                                s === R && t.removeAttribute("id")
                            }
                    }
            }
            return $(e.replace(se, "$1"), t, n, r)
        }

        function n() {
            function e(n, r) {
                return t.push(n + " ") > _.cacheLength && delete e[t.shift()], e[n + " "] = r
            }
            var t = [];
            return e
        }

        function r(e) {
            return e[R] = !0, e
        }

        function i(e) {
            var t = O.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function o(e, t) {
            for (var n = e.split("|"), r = n.length; r--;) _.attrHandle[n[r]] = t
        }

        function a(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r) return r;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function s(e) {
            return function (t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }

        function l(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function u(e) {
            return function (t) {
                return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Te(t) === e : t.disabled === e : "label" in t && t.disabled === e
            }
        }

        function c(e) {
            return r(function (t) {
                return t = +t, r(function (n, r) {
                    for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }

        function d(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }

        function f() { }

        function p(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
            return r
        }

        function h(e, t, n) {
            var r = t.dir,
                i = t.next,
                o = i || r,
                a = n && "parentNode" === o,
                s = W++;
            return t.first ? function (t, n, i) {
                for (; t = t[r];)
                    if (1 === t.nodeType || a) return e(t, n, i);
                return !1
            } : function (t, n, l) {
                var u, c, d, f = [M, s];
                if (l) {
                    for (; t = t[r];)
                        if ((1 === t.nodeType || a) && e(t, n, l)) return !0
                } else
                    for (; t = t[r];)
                        if (1 === t.nodeType || a)
                            if (d = t[R] || (t[R] = {}), c = d[t.uniqueID] || (d[t.uniqueID] = {}), i && i === t.nodeName.toLowerCase()) t = t[r] || t;
                            else {
                                if ((u = c[o]) && u[0] === M && u[1] === s) return f[2] = u[2];
                                if (c[o] = f, f[2] = e(t, n, l)) return !0
                            } return !1
            }
        }

        function g(e) {
            return e.length > 1 ? function (t, n, r) {
                for (var i = e.length; i--;)
                    if (!e[i](t, n, r)) return !1;
                return !0
            } : e[0]
        }

        function m(e, n, r) {
            for (var i = 0, o = n.length; i < o; i++) t(e, n[i], r);
            return r
        }

        function v(e, t, n, r, i) {
            for (var o, a = [], s = 0, l = e.length, u = null != t; s < l; s++)(o = e[s]) && (n && !n(o, r, i) || (a.push(o), u && t.push(s)));
            return a
        }

        function y(e, t, n, i, o, a) {
            return i && !i[R] && (i = y(i)), o && !o[R] && (o = y(o, a)), r(function (r, a, s, l) {
                var u, c, d, f = [],
                    p = [],
                    h = a.length,
                    g = r || m(t || "*", s.nodeType ? [s] : s, []),
                    y = !e || !r && t ? g : v(g, f, e, s, l),
                    b = n ? o || (r ? e : h || i) ? [] : a : y;
                if (n && n(y, b, s, l), i)
                    for (u = v(b, p), i(u, [], s, l), c = u.length; c--;)(d = u[c]) && (b[p[c]] = !(y[p[c]] = d));
                if (r) {
                    if (o || e) {
                        if (o) {
                            for (u = [], c = b.length; c--;)(d = b[c]) && u.push(y[c] = d);
                            o(null, b = [], u, l)
                        }
                        for (c = b.length; c--;)(d = b[c]) && (u = o ? ee(r, d) : f[c]) > -1 && (r[u] = !(a[u] = d))
                    }
                } else b = v(b === a ? b.splice(h, b.length) : b), o ? o(null, a, b, l) : Y.apply(a, b)
            })
        }

        function b(e) {
            for (var t, n, r, i = e.length, o = _.relative[e[0].type], a = o || _.relative[" "], s = o ? 1 : 0, l = h(function (e) {
                return e === t
            }, a, !0), u = h(function (e) {
                return ee(t, e) > -1
            }, a, !0), c = [function (e, n, r) {
                var i = !o && (r || n !== D) || ((t = n).nodeType ? l(e, n, r) : u(e, n, r));
                return t = null, i
            }]; s < i; s++)
                if (n = _.relative[e[s].type]) c = [h(g(c), n)];
                else {
                    if ((n = _.filter[e[s].type].apply(null, e[s].matches))[R]) {
                        for (r = ++s; r < i && !_.relative[e[r].type]; r++);
                        return y(s > 1 && g(c), s > 1 && p(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(se, "$1"), n, s < r && b(e.slice(s, r)), r < i && b(e = e.slice(r)), r < i && p(e))
                    }
                    c.push(n)
                } return g(c)
        }

        function x(e, n) {
            var i = n.length > 0,
                o = e.length > 0,
                a = function (r, a, s, l, u) {
                    var c, d, f, p = 0,
                        h = "0",
                        g = r && [],
                        m = [],
                        y = D,
                        b = r || o && _.find.TAG("*", u),
                        x = M += null == y ? 1 : Math.random() || .1,
                        w = b.length;
                    for (u && (D = a === O || a || u); h !== w && null != (c = b[h]); h++) {
                        if (o && c) {
                            for (d = 0, a || c.ownerDocument === O || (N(c), s = !q); f = e[d++];)
                                if (f(c, a || O, s)) {
                                    l.push(c);
                                    break
                                } u && (M = x)
                        }
                        i && ((c = !f && c) && p--, r && g.push(c))
                    }
                    if (p += h, i && h !== p) {
                        for (d = 0; f = n[d++];) f(g, m, a, s);
                        if (r) {
                            if (p > 0)
                                for (; h--;) g[h] || m[h] || (m[h] = Z.call(l));
                            m = v(m)
                        }
                        Y.apply(l, m), u && !r && m.length > 0 && p + n.length > 1 && t.uniqueSort(l)
                    }
                    return u && (M = x, D = y), g
                };
            return i ? r(a) : a
        }
        var w, C, _, T, k, S, E, $, D, j, A, N, O, P, q, L, F, I, H, R = "sizzle" + 1 * new Date,
            B = e.document,
            M = 0,
            W = 0,
            z = n(),
            U = n(),
            X = n(),
            V = function (e, t) {
                return e === t && (A = !0), 0
            },
            Q = {}.hasOwnProperty,
            G = [],
            Z = G.pop,
            J = G.push,
            Y = G.push,
            K = G.slice,
            ee = function (e, t) {
                for (var n = 0, r = e.length; n < r; n++)
                    if (e[n] === t) return n;
                return -1
            },
            te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            ne = "[\\x20\\t\\r\\n\\f]",
            re = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            ie = "\\[" + ne + "*(" + re + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + re + "))|)" + ne + "*\\]",
            oe = ":(" + re + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ie + ")*)|.*)\\)|)",
            ae = new RegExp(ne + "+", "g"),
            se = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
            le = new RegExp("^" + ne + "*," + ne + "*"),
            ue = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
            ce = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
            de = new RegExp(oe),
            fe = new RegExp("^" + re + "$"),
            pe = {
                ID: new RegExp("^#(" + re + ")"),
                CLASS: new RegExp("^\\.(" + re + ")"),
                TAG: new RegExp("^(" + re + "|[*])"),
                ATTR: new RegExp("^" + ie),
                PSEUDO: new RegExp("^" + oe),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + te + ")$", "i"),
                needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
            },
            he = /^(?:input|select|textarea|button)$/i,
            ge = /^h\d$/i,
            me = /^[^{]+\{\s*\[native \w/,
            ve = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ye = /[+~]/,
            be = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
            xe = function (e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            },
            we = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            Ce = function (e, t) {
                return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
            },
            _e = function () {
                N()
            },
            Te = h(function (e) {
                return !0 === e.disabled && ("form" in e || "label" in e)
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            Y.apply(G = K.call(B.childNodes), B.childNodes), G[B.childNodes.length].nodeType
        } catch (e) {
            Y = {
                apply: G.length ? function (e, t) {
                    J.apply(e, K.call(t))
                } : function (e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++];);
                    e.length = n - 1
                }
            }
        }
        C = t.support = {}, k = t.isXML = function (e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return !!t && "HTML" !== t.nodeName
        }, N = t.setDocument = function (e) {
            var t, n, r = e ? e.ownerDocument || e : B;
            return r !== O && 9 === r.nodeType && r.documentElement ? (O = r, P = O.documentElement, q = !k(O), B !== O && (n = O.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", _e, !1) : n.attachEvent && n.attachEvent("onunload", _e)), C.attributes = i(function (e) {
                return e.className = "i", !e.getAttribute("className")
            }), C.getElementsByTagName = i(function (e) {
                return e.appendChild(O.createComment("")), !e.getElementsByTagName("*").length
            }), C.getElementsByClassName = me.test(O.getElementsByClassName), C.getById = i(function (e) {
                return P.appendChild(e).id = R, !O.getElementsByName || !O.getElementsByName(R).length
            }), C.getById ? (_.filter.ID = function (e) {
                var t = e.replace(be, xe);
                return function (e) {
                    return e.getAttribute("id") === t
                }
            }, _.find.ID = function (e, t) {
                if ("undefined" != typeof t.getElementById && q) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }) : (_.filter.ID = function (e) {
                var t = e.replace(be, xe);
                return function (e) {
                    var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }, _.find.ID = function (e, t) {
                if ("undefined" != typeof t.getElementById && q) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
                        for (i = t.getElementsByName(e), r = 0; o = i[r++];)
                            if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
                    }
                    return []
                }
            }), _.find.TAG = C.getElementsByTagName ? function (e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : C.qsa ? t.querySelectorAll(e) : void 0
            } : function (e, t) {
                var n, r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }, _.find.CLASS = C.getElementsByClassName && function (e, t) {
                if ("undefined" != typeof t.getElementsByClassName && q) return t.getElementsByClassName(e)
            }, F = [], L = [], (C.qsa = me.test(O.querySelectorAll)) && (i(function (e) {
                P.appendChild(e).innerHTML = "<a id='" + R + "'></a><select id='" + R + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && L.push("[*^$]=" + ne + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || L.push("\\[" + ne + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + R + "-]").length || L.push("~="), e.querySelectorAll(":checked").length || L.push(":checked"), e.querySelectorAll("a#" + R + "+*").length || L.push(".#.+[+~]")
            }), i(function (e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = O.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && L.push("name" + ne + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && L.push(":enabled", ":disabled"), P.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && L.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), L.push(",.*:")
            })), (C.matchesSelector = me.test(I = P.matches || P.webkitMatchesSelector || P.mozMatchesSelector || P.oMatchesSelector || P.msMatchesSelector)) && i(function (e) {
                C.disconnectedMatch = I.call(e, "*"), I.call(e, "[s!='']:x"), F.push("!=", oe)
            }), L = L.length && new RegExp(L.join("|")), F = F.length && new RegExp(F.join("|")), t = me.test(P.compareDocumentPosition), H = t || me.test(P.contains) ? function (e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            } : function (e, t) {
                if (t)
                    for (; t = t.parentNode;)
                        if (t === e) return !0;
                return !1
            }, V = t ? function (e, t) {
                if (e === t) return A = !0, 0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !C.sortDetached && t.compareDocumentPosition(e) === n ? e === O || e.ownerDocument === B && H(B, e) ? -1 : t === O || t.ownerDocument === B && H(B, t) ? 1 : j ? ee(j, e) - ee(j, t) : 0 : 4 & n ? -1 : 1)
            } : function (e, t) {
                if (e === t) return A = !0, 0;
                var n, r = 0,
                    i = e.parentNode,
                    o = t.parentNode,
                    s = [e],
                    l = [t];
                if (!i || !o) return e === O ? -1 : t === O ? 1 : i ? -1 : o ? 1 : j ? ee(j, e) - ee(j, t) : 0;
                if (i === o) return a(e, t);
                for (n = e; n = n.parentNode;) s.unshift(n);
                for (n = t; n = n.parentNode;) l.unshift(n);
                for (; s[r] === l[r];) r++;
                return r ? a(s[r], l[r]) : s[r] === B ? -1 : l[r] === B ? 1 : 0
            }, O) : O
        }, t.matches = function (e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function (e, n) {
            if ((e.ownerDocument || e) !== O && N(e), n = n.replace(ce, "='$1']"), C.matchesSelector && q && !X[n + " "] && (!F || !F.test(n)) && (!L || !L.test(n))) try {
                var r = I.call(e, n);
                if (r || C.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
            } catch (e) { }
            return t(n, O, null, [e]).length > 0
        }, t.contains = function (e, t) {
            return (e.ownerDocument || e) !== O && N(e), H(e, t)
        }, t.attr = function (e, t) {
            (e.ownerDocument || e) !== O && N(e);
            var n = _.attrHandle[t.toLowerCase()],
                r = n && Q.call(_.attrHandle, t.toLowerCase()) ? n(e, t, !q) : void 0;
            return void 0 !== r ? r : C.attributes || !q ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }, t.escape = function (e) {
            return (e + "").replace(we, Ce)
        }, t.error = function (e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function (e) {
            var t, n = [],
                r = 0,
                i = 0;
            if (A = !C.detectDuplicates, j = !C.sortStable && e.slice(0), e.sort(V), A) {
                for (; t = e[i++];) t === e[i] && (r = n.push(i));
                for (; r--;) e.splice(n[r], 1)
            }
            return j = null, e
        }, T = t.getText = function (e) {
            var t, n = "",
                r = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += T(e)
                } else if (3 === i || 4 === i) return e.nodeValue
            } else
                for (; t = e[r++];) n += T(t);
            return n
        }, (_ = t.selectors = {
            cacheLength: 50,
            createPseudo: r,
            match: pe,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function (e) {
                    return e[1] = e[1].replace(be, xe), e[3] = (e[3] || e[4] || e[5] || "").replace(be, xe), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function (e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function (e) {
                    var t, n = !e[6] && e[2];
                    return pe.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && de.test(n) && (t = S(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function (e) {
                    var t = e.replace(be, xe).toLowerCase();
                    return "*" === e ? function () {
                        return !0
                    } : function (e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function (e) {
                    var t = z[e + " "];
                    return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && z(e, function (e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function (e, n, r) {
                    return function (i) {
                        var o = t.attr(i, e);
                        return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(ae, " ") + " ").indexOf(r) > -1 : "|=" === n && (o === r || o.slice(0, r.length + 1) === r + "-"))
                    }
                },
                CHILD: function (e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3),
                        a = "last" !== e.slice(-4),
                        s = "of-type" === t;
                    return 1 === r && 0 === i ? function (e) {
                        return !!e.parentNode
                    } : function (t, n, l) {
                        var u, c, d, f, p, h, g = o !== a ? "nextSibling" : "previousSibling",
                            m = t.parentNode,
                            v = s && t.nodeName.toLowerCase(),
                            y = !l && !s,
                            b = !1;
                        if (m) {
                            if (o) {
                                for (; g;) {
                                    for (f = t; f = f[g];)
                                        if (s ? f.nodeName.toLowerCase() === v : 1 === f.nodeType) return !1;
                                    h = g = "only" === e && !h && "nextSibling"
                                }
                                return !0
                            }
                            if (h = [a ? m.firstChild : m.lastChild], a && y) {
                                for (b = (p = (u = (c = (d = (f = m)[R] || (f[R] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] || [])[0] === M && u[1]) && u[2], f = p && m.childNodes[p]; f = ++p && f && f[g] || (b = p = 0) || h.pop();)
                                    if (1 === f.nodeType && ++b && f === t) {
                                        c[e] = [M, p, b];
                                        break
                                    }
                            } else if (y && (b = p = (u = (c = (d = (f = t)[R] || (f[R] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] || [])[0] === M && u[1]), !1 === b)
                                for (;
                                    (f = ++p && f && f[g] || (b = p = 0) || h.pop()) && ((s ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++b || (y && ((c = (d = f[R] || (f[R] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] = [M, b]), f !== t)););
                            return (b -= i) === r || b % r == 0 && b / r >= 0
                        }
                    }
                },
                PSEUDO: function (e, n) {
                    var i, o = _.pseudos[e] || _.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[R] ? o(n) : o.length > 1 ? (i = [e, e, "", n], _.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function (e, t) {
                        for (var r, i = o(e, n), a = i.length; a--;) e[r = ee(e, i[a])] = !(t[r] = i[a])
                    }) : function (e) {
                        return o(e, 0, i)
                    }) : o
                }
            },
            pseudos: {
                not: r(function (e) {
                    var t = [],
                        n = [],
                        i = E(e.replace(se, "$1"));
                    return i[R] ? r(function (e, t, n, r) {
                        for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                    }) : function (e, r, o) {
                        return t[0] = e, i(t, null, o, n), t[0] = null, !n.pop()
                    }
                }),
                has: r(function (e) {
                    return function (n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: r(function (e) {
                    return e = e.replace(be, xe),
                        function (t) {
                            return (t.textContent || t.innerText || T(t)).indexOf(e) > -1
                        }
                }),
                lang: r(function (e) {
                    return fe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(be, xe).toLowerCase(),
                        function (t) {
                            var n;
                            do
                                if (n = q ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1
                        }
                }),
                target: function (t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function (e) {
                    return e === P
                },
                focus: function (e) {
                    return e === O.activeElement && (!O.hasFocus || O.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: u(!1),
                disabled: u(!0),
                checked: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function (e) {
                    return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                },
                empty: function (e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function (e) {
                    return !_.pseudos.empty(e)
                },
                header: function (e) {
                    return ge.test(e.nodeName)
                },
                input: function (e) {
                    return he.test(e.nodeName)
                },
                button: function (e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function (e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: c(function () {
                    return [0]
                }),
                last: c(function (e, t) {
                    return [t - 1]
                }),
                eq: c(function (e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: c(function (e, t) {
                    for (var n = 0; n < t; n += 2) e.push(n);
                    return e
                }),
                odd: c(function (e, t) {
                    for (var n = 1; n < t; n += 2) e.push(n);
                    return e
                }),
                lt: c(function (e, t, n) {
                    for (var r = n < 0 ? n + t : n; --r >= 0;) e.push(r);
                    return e
                }),
                gt: c(function (e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
                    return e
                })
            }
        }).pseudos.nth = _.pseudos.eq;
        for (w in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) _.pseudos[w] = s(w);
        for (w in {
            submit: !0,
            reset: !0
        }) _.pseudos[w] = l(w);
        return f.prototype = _.filters = _.pseudos, _.setFilters = new f, S = t.tokenize = function (e, n) {
            var r, i, o, a, s, l, u, c = U[e + " "];
            if (c) return n ? 0 : c.slice(0);
            for (s = e, l = [], u = _.preFilter; s;) {
                r && !(i = le.exec(s)) || (i && (s = s.slice(i[0].length) || s), l.push(o = [])), r = !1, (i = ue.exec(s)) && (r = i.shift(), o.push({
                    value: r,
                    type: i[0].replace(se, " ")
                }), s = s.slice(r.length));
                for (a in _.filter) !(i = pe[a].exec(s)) || u[a] && !(i = u[a](i)) || (r = i.shift(), o.push({
                    value: r,
                    type: a,
                    matches: i
                }), s = s.slice(r.length));
                if (!r) break
            }
            return n ? s.length : s ? t.error(e) : U(e, l).slice(0)
        }, E = t.compile = function (e, t) {
            var n, r = [],
                i = [],
                o = X[e + " "];
            if (!o) {
                for (t || (t = S(e)), n = t.length; n--;)(o = b(t[n]))[R] ? r.push(o) : i.push(o);
                (o = X(e, x(i, r))).selector = e
            }
            return o
        }, $ = t.select = function (e, t, n, r) {
            var i, o, a, s, l, u = "function" == typeof e && e,
                c = !r && S(e = u.selector || e);
            if (n = n || [], 1 === c.length) {
                if ((o = c[0] = c[0].slice(0)).length > 2 && "ID" === (a = o[0]).type && 9 === t.nodeType && q && _.relative[o[1].type]) {
                    if (!(t = (_.find.ID(a.matches[0].replace(be, xe), t) || [])[0])) return n;
                    u && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                for (i = pe.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !_.relative[s = a.type]);)
                    if ((l = _.find[s]) && (r = l(a.matches[0].replace(be, xe), ye.test(o[0].type) && d(t.parentNode) || t))) {
                        if (o.splice(i, 1), !(e = r.length && p(o))) return Y.apply(n, r), n;
                        break
                    }
            }
            return (u || E(e, c))(r, t, !q, n, !t || ye.test(e) && d(t.parentNode) || t), n
        }, C.sortStable = R.split("").sort(V).join("") === R, C.detectDuplicates = !!A, N(), C.sortDetached = i(function (e) {
            return 1 & e.compareDocumentPosition(O.createElement("fieldset"))
        }), i(function (e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function (e, t, n) {
            if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), C.attributes && i(function (e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function (e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
        }), i(function (e) {
            return null == e.getAttribute("disabled")
        }) || o(te, function (e, t, n) {
            var r;
            if (!n) return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }), t
    }(e);
    we.find = _e, we.expr = _e.selectors, we.expr[":"] = we.expr.pseudos, we.uniqueSort = we.unique = _e.uniqueSort, we.text = _e.getText, we.isXMLDoc = _e.isXML, we.contains = _e.contains, we.escapeSelector = _e.escape;
    var Te = function (e, t, n) {
        for (var r = [], i = void 0 !== n;
            (e = e[t]) && 9 !== e.nodeType;)
            if (1 === e.nodeType) {
                if (i && we(e).is(n)) break;
                r.push(e)
            } return r
    },
        ke = function (e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        Se = we.expr.match.needsContext,
        Ee = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    we.filter = function (e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? we.find.matchesSelector(r, e) ? [r] : [] : we.find.matches(e, we.grep(t, function (e) {
            return 1 === e.nodeType
        }))
    }, we.fn.extend({
        find: function (e) {
            var t, n, r = this.length,
                i = this;
            if ("string" != typeof e) return this.pushStack(we(e).filter(function () {
                for (t = 0; t < r; t++)
                    if (we.contains(i[t], this)) return !0
            }));
            for (n = this.pushStack([]), t = 0; t < r; t++) we.find(e, i[t], n);
            return r > 1 ? we.uniqueSort(n) : n
        },
        filter: function (e) {
            return this.pushStack(a(this, e || [], !1))
        },
        not: function (e) {
            return this.pushStack(a(this, e || [], !0))
        },
        is: function (e) {
            return !!a(this, "string" == typeof e && Se.test(e) ? we(e) : e || [], !1).length
        }
    });
    var $e, De = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (we.fn.init = function (e, t, n) {
        var r, i;
        if (!e) return this;
        if (n = n || $e, "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : De.exec(e)) || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof we ? t[0] : t, we.merge(this, we.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : ae, !0)), Ee.test(r[1]) && we.isPlainObject(t))
                    for (r in t) ye(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = ae.getElementById(r[2])) && (this[0] = i, this.length = 1), this
        }
        return e.nodeType ? (this[0] = e, this.length = 1, this) : ye(e) ? void 0 !== n.ready ? n.ready(e) : e(we) : we.makeArray(e, this)
    }).prototype = we.fn, $e = we(ae);
    var je = /^(?:parents|prev(?:Until|All))/,
        Ae = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    we.fn.extend({
        has: function (e) {
            var t = we(e, this),
                n = t.length;
            return this.filter(function () {
                for (var e = 0; e < n; e++)
                    if (we.contains(this, t[e])) return !0
            })
        },
        closest: function (e, t) {
            var n, r = 0,
                i = this.length,
                o = [],
                a = "string" != typeof e && we(e);
            if (!Se.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && we.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        } return this.pushStack(o.length > 1 ? we.uniqueSort(o) : o)
        },
        index: function (e) {
            return e ? "string" == typeof e ? de.call(we(e), this[0]) : de.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function (e, t) {
            return this.pushStack(we.uniqueSort(we.merge(this.get(), we(e, t))))
        },
        addBack: function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), we.each({
        parent: function (e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function (e) {
            return Te(e, "parentNode")
        },
        parentsUntil: function (e, t, n) {
            return Te(e, "parentNode", n)
        },
        next: function (e) {
            return s(e, "nextSibling")
        },
        prev: function (e) {
            return s(e, "previousSibling")
        },
        nextAll: function (e) {
            return Te(e, "nextSibling")
        },
        prevAll: function (e) {
            return Te(e, "previousSibling")
        },
        nextUntil: function (e, t, n) {
            return Te(e, "nextSibling", n)
        },
        prevUntil: function (e, t, n) {
            return Te(e, "previousSibling", n)
        },
        siblings: function (e) {
            return ke((e.parentNode || {}).firstChild, e)
        },
        children: function (e) {
            return ke(e.firstChild)
        },
        contents: function (e) {
            return o(e, "iframe") ? e.contentDocument : (o(e, "template") && (e = e.content || e), we.merge([], e.childNodes))
        }
    }, function (e, t) {
        we.fn[e] = function (n, r) {
            var i = we.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = we.filter(r, i)), this.length > 1 && (Ae[e] || we.uniqueSort(i), je.test(e) && i.reverse()), this.pushStack(i)
        }
    });
    var Ne = /[^\x20\t\r\n\f]+/g;
    we.Callbacks = function (e) {
        e = "string" == typeof e ? l(e) : we.extend({}, e);
        var t, n, i, o, a = [],
            s = [],
            u = -1,
            c = function () {
                for (o = o || e.once, i = t = !0; s.length; u = -1)
                    for (n = s.shift(); ++u < a.length;) !1 === a[u].apply(n[0], n[1]) && e.stopOnFalse && (u = a.length, n = !1);
                e.memory || (n = !1), t = !1, o && (a = n ? [] : "")
            },
            d = {
                add: function () {
                    return a && (n && !t && (u = a.length - 1, s.push(n)), function i(t) {
                        we.each(t, function (t, n) {
                            ye(n) ? e.unique && d.has(n) || a.push(n) : n && n.length && "string" !== r(n) && i(n)
                        })
                    }(arguments), n && !t && c()), this
                },
                remove: function () {
                    return we.each(arguments, function (e, t) {
                        for (var n;
                            (n = we.inArray(t, a, n)) > -1;) a.splice(n, 1), n <= u && u--
                    }), this
                },
                has: function (e) {
                    return e ? we.inArray(e, a) > -1 : a.length > 0
                },
                empty: function () {
                    return a && (a = []), this
                },
                disable: function () {
                    return o = s = [], a = n = "", this
                },
                disabled: function () {
                    return !a
                },
                lock: function () {
                    return o = s = [], n || t || (a = n = ""), this
                },
                locked: function () {
                    return !!o
                },
                fireWith: function (e, n) {
                    return o || (n = [e, (n = n || []).slice ? n.slice() : n], s.push(n), t || c()), this
                },
                fire: function () {
                    return d.fireWith(this, arguments), this
                },
                fired: function () {
                    return !!i
                }
            };
        return d
    }, we.extend({
        Deferred: function (t) {
            var n = [
                ["notify", "progress", we.Callbacks("memory"), we.Callbacks("memory"), 2],
                ["resolve", "done", we.Callbacks("once memory"), we.Callbacks("once memory"), 0, "resolved"],
                ["reject", "fail", we.Callbacks("once memory"), we.Callbacks("once memory"), 1, "rejected"]
            ],
                r = "pending",
                i = {
                    state: function () {
                        return r
                    },
                    always: function () {
                        return o.done(arguments).fail(arguments), this
                    },
                    "catch": function (e) {
                        return i.then(null, e)
                    },
                    pipe: function () {
                        var e = arguments;
                        return we.Deferred(function (t) {
                            we.each(n, function (n, r) {
                                var i = ye(e[r[4]]) && e[r[4]];
                                o[r[1]](function () {
                                    var e = i && i.apply(this, arguments);
                                    e && ye(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + "With"](this, i ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    then: function (t, r, i) {
                        function o(t, n, r, i) {
                            return function () {
                                var s = this,
                                    l = arguments,
                                    d = function () {
                                        var e, d;
                                        if (!(t < a)) {
                                            if ((e = r.apply(s, l)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                            d = e && ("object" == typeof e || "function" == typeof e) && e.then, ye(d) ? i ? d.call(e, o(a, n, u, i), o(a, n, c, i)) : (a++, d.call(e, o(a, n, u, i), o(a, n, c, i), o(a, n, u, n.notifyWith))) : (r !== u && (s = void 0, l = [e]), (i || n.resolveWith)(s, l))
                                        }
                                    },
                                    f = i ? d : function () {
                                        try {
                                            d()
                                        } catch (e) {
                                            we.Deferred.exceptionHook && we.Deferred.exceptionHook(e, f.stackTrace), t + 1 >= a && (r !== c && (s = void 0, l = [e]), n.rejectWith(s, l))
                                        }
                                    };
                                t ? f() : (we.Deferred.getStackHook && (f.stackTrace = we.Deferred.getStackHook()), e.setTimeout(f))
                            }
                        }
                        var a = 0;
                        return we.Deferred(function (e) {
                            n[0][3].add(o(0, e, ye(i) ? i : u, e.notifyWith)), n[1][3].add(o(0, e, ye(t) ? t : u)), n[2][3].add(o(0, e, ye(r) ? r : c))
                        }).promise()
                    },
                    promise: function (e) {
                        return null != e ? we.extend(e, i) : i
                    }
                },
                o = {};
            return we.each(n, function (e, t) {
                var a = t[2],
                    s = t[5];
                i[t[1]] = a.add, s && a.add(function () {
                    r = s
                }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock), a.add(t[3].fire), o[t[0]] = function () {
                    return o[t[0] + "With"](this === o ? void 0 : this, arguments), this
                }, o[t[0] + "With"] = a.fireWith
            }), i.promise(o), t && t.call(o, o), o
        },
        when: function (e) {
            var t = arguments.length,
                n = t,
                r = Array(n),
                i = le.call(arguments),
                o = we.Deferred(),
                a = function (e) {
                    return function (n) {
                        r[e] = this, i[e] = arguments.length > 1 ? le.call(arguments) : n, --t || o.resolveWith(r, i)
                    }
                };
            if (t <= 1 && (d(e, o.done(a(n)).resolve, o.reject, !t), "pending" === o.state() || ye(i[n] && i[n].then))) return o.then();
            for (; n--;) d(i[n], a(n), o.reject);
            return o.promise()
        }
    });
    var Oe = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    we.Deferred.exceptionHook = function (t, n) {
        e.console && e.console.warn && t && Oe.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }, we.readyException = function (t) {
        e.setTimeout(function () {
            throw t
        })
    };
    var Pe = we.Deferred();
    we.fn.ready = function (e) {
        return Pe.then(e)["catch"](function (e) {
            we.readyException(e)
        }), this
    }, we.extend({
        isReady: !1,
        readyWait: 1,
        ready: function (e) {
            (!0 === e ? --we.readyWait : we.isReady) || (we.isReady = !0, !0 !== e && --we.readyWait > 0 || Pe.resolveWith(ae, [we]))
        }
    }), we.ready.then = Pe.then, "complete" === ae.readyState || "loading" !== ae.readyState && !ae.documentElement.doScroll ? e.setTimeout(we.ready) : (ae.addEventListener("DOMContentLoaded", f), e.addEventListener("load", f));
    var qe = function (e, t, n, i, o, a, s) {
        var l = 0,
            u = e.length,
            c = null == n;
        if ("object" === r(n)) {
            o = !0;
            for (l in n) qe(e, t, l, n[l], !0, a, s)
        } else if (void 0 !== i && (o = !0, ye(i) || (s = !0), c && (s ? (t.call(e, i), t = null) : (c = t, t = function (e, t, n) {
            return c.call(we(e), n)
        })), t))
            for (; l < u; l++) t(e[l], n, s ? i : i.call(e[l], l, t(e[l], n)));
        return o ? e : c ? t.call(e) : u ? t(e[0], n) : a
    },
        Le = /^-ms-/,
        Fe = /-([a-z])/g,
        Ie = function (e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
        };
    g.uid = 1, g.prototype = {
        cache: function (e) {
            var t = e[this.expando];
            return t || (t = {}, Ie(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function (e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t) i[h(t)] = n;
            else
                for (r in t) i[h(r)] = t[r];
            return i
        },
        get: function (e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][h(t)]
        },
        access: function (e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
        },
        remove: function (e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(h) : (t = h(t)) in r ? [t] : t.match(Ne) || []).length;
                    for (; n--;) delete r[t[n]]
                } (void 0 === t || we.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function (e) {
            var t = e[this.expando];
            return void 0 !== t && !we.isEmptyObject(t)
        }
    };
    var He = new g,
        Re = new g,
        Be = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Me = /[A-Z]/g;
    we.extend({
        hasData: function (e) {
            return Re.hasData(e) || He.hasData(e)
        },
        data: function (e, t, n) {
            return Re.access(e, t, n)
        },
        removeData: function (e, t) {
            Re.remove(e, t)
        },
        _data: function (e, t, n) {
            return He.access(e, t, n)
        },
        _removeData: function (e, t) {
            He.remove(e, t)
        }
    }), we.fn.extend({
        data: function (e, t) {
            var n, r, i, o = this[0],
                a = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (i = Re.get(o), 1 === o.nodeType && !He.get(o, "hasDataAttrs"))) {
                    for (n = a.length; n--;) a[n] && 0 === (r = a[n].name).indexOf("data-") && (r = h(r.slice(5)), v(o, r, i[r]));
                    He.set(o, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each(function () {
                Re.set(this, e)
            }) : qe(this, function (t) {
                var n;
                if (o && void 0 === t) {
                    if (void 0 !== (n = Re.get(o, e))) return n;
                    if (void 0 !== (n = v(o, e))) return n
                } else this.each(function () {
                    Re.set(this, e, t)
                })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function (e) {
            return this.each(function () {
                Re.remove(this, e)
            })
        }
    }), we.extend({
        queue: function (e, t, n) {
            var r;
            if (e) return t = (t || "fx") + "queue", r = He.get(e, t), n && (!r || Array.isArray(n) ? r = He.access(e, t, we.makeArray(n)) : r.push(n)), r || []
        },
        dequeue: function (e, t) {
            t = t || "fx";
            var n = we.queue(e, t),
                r = n.length,
                i = n.shift(),
                o = we._queueHooks(e, t),
                a = function () {
                    we.dequeue(e, t)
                };
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function (e, t) {
            var n = t + "queueHooks";
            return He.get(e, n) || He.access(e, n, {
                empty: we.Callbacks("once memory").add(function () {
                    He.remove(e, [t + "queue", n])
                })
            })
        }
    }), we.fn.extend({
        queue: function (e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? we.queue(this[0], e) : void 0 === t ? this : this.each(function () {
                var n = we.queue(this, e, t);
                we._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && we.dequeue(this, e)
            })
        },
        dequeue: function (e) {
            return this.each(function () {
                we.dequeue(this, e)
            })
        },
        clearQueue: function (e) {
            return this.queue(e || "fx", [])
        },
        promise: function (e, t) {
            var n, r = 1,
                i = we.Deferred(),
                o = this,
                a = this.length,
                s = function () {
                    --r || i.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(n = He.get(o[a], e + "queueHooks")) && n.empty && (r++, n.empty.add(s));
            return s(), i.promise(t)
        }
    });
    var We = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ze = new RegExp("^(?:([+-])=|)(" + We + ")([a-z%]*)$", "i"),
        Ue = ["Top", "Right", "Bottom", "Left"],
        Xe = function (e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && we.contains(e.ownerDocument, e) && "none" === we.css(e, "display")
        },
        Ve = function (e, t, n, r) {
            var i, o, a = {};
            for (o in t) a[o] = e.style[o], e.style[o] = t[o];
            i = n.apply(e, r || []);
            for (o in t) e.style[o] = a[o];
            return i
        },
        Qe = {};
    we.fn.extend({
        show: function () {
            return x(this, !0)
        },
        hide: function () {
            return x(this)
        },
        toggle: function (e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                Xe(this) ? we(this).show() : we(this).hide()
            })
        }
    });
    var Ge = /^(?:checkbox|radio)$/i,
        Ze = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
        Je = /^$|^module$|\/(?:java|ecma)script/i,
        Ye = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    Ye.optgroup = Ye.option, Ye.tbody = Ye.tfoot = Ye.colgroup = Ye.caption = Ye.thead, Ye.th = Ye.td;
    var Ke = /<|&#?\w+;/;
    ! function () {
        var e = ae.createDocumentFragment().appendChild(ae.createElement("div")),
            t = ae.createElement("input");
        t.setAttribute("type", "radio"), t.setAttribute("checked", "checked"), t.setAttribute("name", "t"), e.appendChild(t), ve.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, e.innerHTML = "<textarea>x</textarea>", ve.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
    }();
    var et = ae.documentElement,
        tt = /^key/,
        nt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        rt = /^([^.]*)(?:\.(.+)|)/;
    we.event = {
        global: {},
        add: function (e, t, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, g, m = He.get(e);
            if (m)
                for (n.handler && (n = (o = n).handler, i = o.selector), i && we.find.matchesSelector(et, i), n.guid || (n.guid = we.guid++), (l = m.events) || (l = m.events = {}), (a = m.handle) || (a = m.handle = function (t) {
                    return "undefined" != typeof we && we.event.triggered !== t.type ? we.event.dispatch.apply(e, arguments) : void 0
                }), u = (t = (t || "").match(Ne) || [""]).length; u--;) p = g = (s = rt.exec(t[u]) || [])[1], h = (s[2] || "").split(".").sort(), p && (d = we.event.special[p] || {}, p = (i ? d.delegateType : d.bindType) || p, d = we.event.special[p] || {}, c = we.extend({
                    type: p,
                    origType: g,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && we.expr.match.needsContext.test(i),
                    namespace: h.join(".")
                }, o), (f = l[p]) || ((f = l[p] = []).delegateCount = 0, d.setup && !1 !== d.setup.call(e, r, h, a) || e.addEventListener && e.addEventListener(p, a)), d.add && (d.add.call(e, c), c.handler.guid || (c.handler.guid = n.guid)), i ? f.splice(f.delegateCount++, 0, c) : f.push(c), we.event.global[p] = !0)
        },
        remove: function (e, t, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, g, m = He.hasData(e) && He.get(e);
            if (m && (l = m.events)) {
                for (u = (t = (t || "").match(Ne) || [""]).length; u--;)
                    if (s = rt.exec(t[u]) || [], p = g = s[1], h = (s[2] || "").split(".").sort(), p) {
                        for (d = we.event.special[p] || {}, f = l[p = (r ? d.delegateType : d.bindType) || p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = f.length; o--;) c = f[o], !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (f.splice(o, 1), c.selector && f.delegateCount--, d.remove && d.remove.call(e, c));
                        a && !f.length && (d.teardown && !1 !== d.teardown.call(e, h, m.handle) || we.removeEvent(e, p, m.handle), delete l[p])
                    } else
                        for (p in l) we.event.remove(e, p + t[u], n, r, !0);
                we.isEmptyObject(l) && He.remove(e, "handle events")
            }
        },
        dispatch: function (e) {
            var t, n, r, i, o, a, s = we.event.fix(e),
                l = new Array(arguments.length),
                u = (He.get(this, "events") || {})[s.type] || [],
                c = we.event.special[s.type] || {};
            for (l[0] = s, t = 1; t < arguments.length; t++) l[t] = arguments[t];
            if (s.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, s)) {
                for (a = we.event.handlers.call(this, s, u), t = 0;
                    (i = a[t++]) && !s.isPropagationStopped();)
                    for (s.currentTarget = i.elem, n = 0;
                        (o = i.handlers[n++]) && !s.isImmediatePropagationStopped();) s.rnamespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, s.data = o.data, void 0 !== (r = ((we.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, l)) && !1 === (s.result = r) && (s.preventDefault(), s.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, s), s.result
            }
        },
        handlers: function (e, t) {
            var n, r, i, o, a, s = [],
                l = t.delegateCount,
                u = e.target;
            if (l && u.nodeType && !("click" === e.type && e.button >= 1))
                for (; u !== this; u = u.parentNode || this)
                    if (1 === u.nodeType && ("click" !== e.type || !0 !== u.disabled)) {
                        for (o = [], a = {}, n = 0; n < l; n++) void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? we(i, this).index(u) > -1 : we.find(i, this, null, [u]).length), a[i] && o.push(r);
                        o.length && s.push({
                            elem: u,
                            handlers: o
                        })
                    } return u = this, l < t.length && s.push({
                        elem: u,
                        handlers: t.slice(l)
                    }), s
        },
        addProp: function (e, t) {
            Object.defineProperty(we.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: ye(t) ? function () {
                    if (this.originalEvent) return t(this.originalEvent)
                } : function () {
                    if (this.originalEvent) return this.originalEvent[e]
                },
                set: function (t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function (e) {
            return e[we.expando] ? e : new we.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function () {
                    if (this !== S() && this.focus) return this.focus(), !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    if (this === S() && this.blur) return this.blur(), !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function () {
                    if ("checkbox" === this.type && this.click && o(this, "input")) return this.click(), !1
                },
                _default: function (e) {
                    return o(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function (e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    }, we.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }, we.Event = function (e, t) {
        return this instanceof we.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? T : k, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && we.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[we.expando] = !0, void 0) : new we.Event(e, t)
    }, we.Event.prototype = {
        constructor: we.Event,
        isDefaultPrevented: k,
        isPropagationStopped: k,
        isImmediatePropagationStopped: k,
        isSimulated: !1,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = T, e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = T, e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = T, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, we.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function (e) {
            var t = e.button;
            return null == e.which && tt.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && nt.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, we.event.addProp), we.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (e, t) {
        we.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function (e) {
                var n, r = this,
                    i = e.relatedTarget,
                    o = e.handleObj;
                return i && (i === r || we.contains(r, i)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), we.fn.extend({
        on: function (e, t, n, r) {
            return E(this, e, t, n, r)
        },
        one: function (e, t, n, r) {
            return E(this, e, t, n, r, 1)
        },
        off: function (e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj) return r = e.handleObj, we(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
            if ("object" == typeof e) {
                for (i in e) this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = k), this.each(function () {
                we.event.remove(this, e, n, t)
            })
        }
    });
    var it = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        ot = /<script|<style|<link/i,
        at = /checked\s*(?:[^=]|=\s*.checked.)/i,
        st = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    we.extend({
        htmlPrefilter: function (e) {
            return e.replace(it, "<$1></$2>")
        },
        clone: function (e, t, n) {
            var r, i, o, a, s = e.cloneNode(!0),
                l = we.contains(e.ownerDocument, e);
            if (!(ve.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || we.isXMLDoc(e)))
                for (a = w(s), r = 0, i = (o = w(e)).length; r < i; r++) N(o[r], a[r]);
            if (t)
                if (n)
                    for (o = o || w(e), a = a || w(s), r = 0, i = o.length; r < i; r++) A(o[r], a[r]);
                else A(e, s);
            return (a = w(s, "script")).length > 0 && C(a, !l && w(e, "script")), s
        },
        cleanData: function (e) {
            for (var t, n, r, i = we.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (Ie(n)) {
                    if (t = n[He.expando]) {
                        if (t.events)
                            for (r in t.events) i[r] ? we.event.remove(n, r) : we.removeEvent(n, r, t.handle);
                        n[He.expando] = void 0
                    }
                    n[Re.expando] && (n[Re.expando] = void 0)
                }
        }
    }), we.fn.extend({
        detach: function (e) {
            return P(this, e, !0)
        },
        remove: function (e) {
            return P(this, e)
        },
        text: function (e) {
            return qe(this, function (e) {
                return void 0 === e ? we.text(this) : this.empty().each(function () {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function () {
            return O(this, arguments, function (e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || $(this, e).appendChild(e)
            })
        },
        prepend: function () {
            return O(this, arguments, function (e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = $(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function () {
            return O(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function () {
            return O(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function () {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (we.cleanData(w(e, !1)), e.textContent = "");
            return this
        },
        clone: function (e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function () {
                return we.clone(this, e, t)
            })
        },
        html: function (e) {
            return qe(this, function (e) {
                var t = this[0] || {},
                    n = 0,
                    r = this.length;
                if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !ot.test(e) && !Ye[(Ze.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = we.htmlPrefilter(e);
                    try {
                        for (; n < r; n++) 1 === (t = this[n] || {}).nodeType && (we.cleanData(w(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) { }
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function () {
            var e = [];
            return O(this, arguments, function (t) {
                var n = this.parentNode;
                we.inArray(this, e) < 0 && (we.cleanData(w(this)), n && n.replaceChild(t, this))
            }, e)
        }
    }), we.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, t) {
        we.fn[e] = function (e) {
            for (var n, r = [], i = we(e), o = i.length - 1, a = 0; a <= o; a++) n = a === o ? this : this.clone(!0), we(i[a])[t](n), ce.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var lt = new RegExp("^(" + We + ")(?!px)[a-z%]+$", "i"),
        ut = function (t) {
            var n = t.ownerDocument.defaultView;
            return n && n.opener || (n = e), n.getComputedStyle(t)
        },
        ct = new RegExp(Ue.join("|"), "i");
    ! function () {
        function t() {
            if (u) {
                l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", et.appendChild(l).appendChild(u);
                var t = e.getComputedStyle(u);
                r = "1%" !== t.top, s = 12 === n(t.marginLeft), u.style.right = "60%", a = 36 === n(t.right), i = 36 === n(t.width), u.style.position = "absolute", o = 36 === u.offsetWidth || "absolute", et.removeChild(l), u = null
            }
        }

        function n(e) {
            return Math.round(parseFloat(e))
        }
        var r, i, o, a, s, l = ae.createElement("div"),
            u = ae.createElement("div");
        u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", ve.clearCloneStyle = "content-box" === u.style.backgroundClip, we.extend(ve, {
            boxSizingReliable: function () {
                return t(), i
            },
            pixelBoxStyles: function () {
                return t(), a
            },
            pixelPosition: function () {
                return t(), r
            },
            reliableMarginLeft: function () {
                return t(), s
            },
            scrollboxSize: function () {
                return t(), o
            }
        }))
    }();
    var dt = /^(none|table(?!-c[ea]).+)/,
        ft = /^--/,
        pt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        ht = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        gt = ["Webkit", "Moz", "ms"],
        mt = ae.createElement("div").style;
    we.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var n = q(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function (e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = h(t),
                    l = ft.test(t),
                    u = e.style;
                if (l || (t = I(s)), a = we.cssHooks[t] || we.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : u[t];
                "string" == (o = typeof n) && (i = ze.exec(n)) && i[1] && (n = y(e, t, i), o = "number"), null != n && n === n && ("number" === o && (n += i && i[3] || (we.cssNumber[s] ? "" : "px")), ve.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (l ? u.setProperty(t, n) : u[t] = n))
            }
        },
        css: function (e, t, n, r) {
            var i, o, a, s = h(t);
            return ft.test(t) || (t = I(s)), (a = we.cssHooks[t] || we.cssHooks[s]) && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = q(e, t, r)), "normal" === i && t in ht && (i = ht[t]), "" === n || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }), we.each(["height", "width"], function (e, t) {
        we.cssHooks[t] = {
            get: function (e, n, r) {
                if (n) return !dt.test(we.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? B(e, t, r) : Ve(e, pt, function () {
                    return B(e, t, r)
                })
            },
            set: function (e, n, r) {
                var i, o = ut(e),
                    a = "border-box" === we.css(e, "boxSizing", !1, o),
                    s = r && R(e, t, r, a, o);
                return a && ve.scrollboxSize() === o.position && (s -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - R(e, t, "border", !1, o) - .5)), s && (i = ze.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n, n = we.css(e, t)), H(e, n, s)
            }
        }
    }), we.cssHooks.marginLeft = L(ve.reliableMarginLeft, function (e, t) {
        if (t) return (parseFloat(q(e, "marginLeft")) || e.getBoundingClientRect().left - Ve(e, {
            marginLeft: 0
        }, function () {
            return e.getBoundingClientRect().left
        })) + "px"
    }), we.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (e, t) {
        we.cssHooks[e + t] = {
            expand: function (n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++) i[e + Ue[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        }, "margin" !== e && (we.cssHooks[e + t].set = H)
    }), we.fn.extend({
        css: function (e, t) {
            return qe(this, function (e, t, n) {
                var r, i, o = {},
                    a = 0;
                if (Array.isArray(t)) {
                    for (r = ut(e), i = t.length; a < i; a++) o[t[a]] = we.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? we.style(e, t, n) : we.css(e, t)
            }, e, t, arguments.length > 1)
        }
    }), we.Tween = M, M.prototype = {
        constructor: M,
        init: function (e, t, n, r, i, o) {
            this.elem = e, this.prop = n, this.easing = i || we.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (we.cssNumber[n] ? "" : "px")
        },
        cur: function () {
            var e = M.propHooks[this.prop];
            return e && e.get ? e.get(this) : M.propHooks._default.get(this)
        },
        run: function (e) {
            var t, n = M.propHooks[this.prop];
            return this.options.duration ? this.pos = t = we.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : M.propHooks._default.set(this), this
        }
    }, M.prototype.init.prototype = M.prototype, M.propHooks = {
        _default: {
            get: function (e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = we.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function (e) {
                we.fx.step[e.prop] ? we.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[we.cssProps[e.prop]] && !we.cssHooks[e.prop] ? e.elem[e.prop] = e.now : we.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, M.propHooks.scrollTop = M.propHooks.scrollLeft = {
        set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, we.easing = {
        linear: function (e) {
            return e
        },
        swing: function (e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, we.fx = M.prototype.init, we.fx.step = {};
    var vt, yt, bt = /^(?:toggle|show|hide)$/,
        xt = /queueHooks$/;
    we.Animation = we.extend(G, {
        tweeners: {
            "*": [function (e, t) {
                var n = this.createTween(e, t);
                return y(n.elem, e, ze.exec(t), n), n
            }]
        },
        tweener: function (e, t) {
            ye(e) ? (t = e, e = ["*"]) : e = e.match(Ne);
            for (var n, r = 0, i = e.length; r < i; r++) n = e[r], G.tweeners[n] = G.tweeners[n] || [], G.tweeners[n].unshift(t)
        },
        prefilters: [V],
        prefilter: function (e, t) {
            t ? G.prefilters.unshift(e) : G.prefilters.push(e)
        }
    }), we.speed = function (e, t, n) {
        var r = e && "object" == typeof e ? we.extend({}, e) : {
            complete: n || !n && t || ye(e) && e,
            duration: e,
            easing: n && t || t && !ye(t) && t
        };
        return we.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in we.fx.speeds ? r.duration = we.fx.speeds[r.duration] : r.duration = we.fx.speeds._default), null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function () {
            ye(r.old) && r.old.call(this), r.queue && we.dequeue(this, r.queue)
        }, r
    }, we.fn.extend({
        fadeTo: function (e, t, n, r) {
            return this.filter(Xe).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function (e, t, n, r) {
            var i = we.isEmptyObject(e),
                o = we.speed(t, n, r),
                a = function () {
                    var t = G(this, we.extend({}, e), o);
                    (i || He.get(this, "finish")) && t.stop(!0)
                };
            return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function (e, t, n) {
            var r = function (e) {
                var t = e.stop;
                delete e.stop, t(n)
            };
            return "string" != typeof e && (n = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each(function () {
                var t = !0,
                    i = null != e && e + "queueHooks",
                    o = we.timers,
                    a = He.get(this);
                if (i) a[i] && a[i].stop && r(a[i]);
                else
                    for (i in a) a[i] && a[i].stop && xt.test(i) && r(a[i]);
                for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                !t && n || we.dequeue(this, e)
            })
        },
        finish: function (e) {
            return !1 !== e && (e = e || "fx"), this.each(function () {
                var t, n = He.get(this),
                    r = n[e + "queue"],
                    i = n[e + "queueHooks"],
                    o = we.timers,
                    a = r ? r.length : 0;
                for (n.finish = !0, we.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                for (t = 0; t < a; t++) r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }), we.each(["toggle", "show", "hide"], function (e, t) {
        var n = we.fn[t];
        we.fn[t] = function (e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(U(t, !0), e, r, i)
        }
    }), we.each({
        slideDown: U("show"),
        slideUp: U("hide"),
        slideToggle: U("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function (e, t) {
        we.fn[e] = function (e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), we.timers = [], we.fx.tick = function () {
        var e, t = 0,
            n = we.timers;
        for (vt = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || we.fx.stop(), vt = void 0
    }, we.fx.timer = function (e) {
        we.timers.push(e), we.fx.start()
    }, we.fx.interval = 13, we.fx.start = function () {
        yt || (yt = !0, W())
    }, we.fx.stop = function () {
        yt = null
    }, we.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, we.fn.delay = function (t, n) {
        return t = we.fx ? we.fx.speeds[t] || t : t, n = n || "fx", this.queue(n, function (n, r) {
            var i = e.setTimeout(n, t);
            r.stop = function () {
                e.clearTimeout(i)
            }
        })
    },
        function () {
            var e = ae.createElement("input"),
                t = ae.createElement("select").appendChild(ae.createElement("option"));
            e.type = "checkbox", ve.checkOn = "" !== e.value, ve.optSelected = t.selected, (e = ae.createElement("input")).value = "t", e.type = "radio", ve.radioValue = "t" === e.value
        }();
    var wt, Ct = we.expr.attrHandle;
    we.fn.extend({
        attr: function (e, t) {
            return qe(this, we.attr, e, t, arguments.length > 1)
        },
        removeAttr: function (e) {
            return this.each(function () {
                we.removeAttr(this, e)
            })
        }
    }), we.extend({
        attr: function (e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? we.prop(e, t, n) : (1 === o && we.isXMLDoc(e) || (i = we.attrHooks[t.toLowerCase()] || (we.expr.match.bool.test(t) ? wt : void 0)), void 0 !== n ? null === n ? void we.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : null == (r = we.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function (e, t) {
                    if (!ve.radioValue && "radio" === t && o(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function (e, t) {
            var n, r = 0,
                i = t && t.match(Ne);
            if (i && 1 === e.nodeType)
                for (; n = i[r++];) e.removeAttribute(n)
        }
    }), wt = {
        set: function (e, t, n) {
            return !1 === t ? we.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, we.each(we.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var n = Ct[t] || we.find.attr;
        Ct[t] = function (e, t, r) {
            var i, o, a = t.toLowerCase();
            return r || (o = Ct[a], Ct[a] = i, i = null != n(e, t, r) ? a : null, Ct[a] = o), i
        }
    });
    var _t = /^(?:input|select|textarea|button)$/i,
        Tt = /^(?:a|area)$/i;
    we.fn.extend({
        prop: function (e, t) {
            return qe(this, we.prop, e, t, arguments.length > 1)
        },
        removeProp: function (e) {
            return this.each(function () {
                delete this[we.propFix[e] || e]
            })
        }
    }), we.extend({
        prop: function (e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return 1 === o && we.isXMLDoc(e) || (t = we.propFix[t] || t, i = we.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function (e) {
                    var t = we.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : _t.test(e.nodeName) || Tt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), ve.optSelected || (we.propHooks.selected = {
        get: function (e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        },
        set: function (e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), we.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        we.propFix[this.toLowerCase()] = this
    }), we.fn.extend({
        addClass: function (e) {
            var t, n, r, i, o, a, s, l = 0;
            if (ye(e)) return this.each(function (t) {
                we(this).addClass(e.call(this, t, J(this)))
            });
            if ((t = Y(e)).length)
                for (; n = this[l++];)
                    if (i = J(n), r = 1 === n.nodeType && " " + Z(i) + " ") {
                        for (a = 0; o = t[a++];) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = Z(r)) && n.setAttribute("class", s)
                    } return this
        },
        removeClass: function (e) {
            var t, n, r, i, o, a, s, l = 0;
            if (ye(e)) return this.each(function (t) {
                we(this).removeClass(e.call(this, t, J(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ((t = Y(e)).length)
                for (; n = this[l++];)
                    if (i = J(n), r = 1 === n.nodeType && " " + Z(i) + " ") {
                        for (a = 0; o = t[a++];)
                            for (; r.indexOf(" " + o + " ") > -1;) r = r.replace(" " + o + " ", " ");
                        i !== (s = Z(r)) && n.setAttribute("class", s)
                    } return this
        },
        toggleClass: function (e, t) {
            var n = typeof e,
                r = "string" === n || Array.isArray(e);
            return "boolean" == typeof t && r ? t ? this.addClass(e) : this.removeClass(e) : ye(e) ? this.each(function (n) {
                we(this).toggleClass(e.call(this, n, J(this), t), t)
            }) : this.each(function () {
                var t, i, o, a;
                if (r)
                    for (i = 0, o = we(this), a = Y(e); t = a[i++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                else void 0 !== e && "boolean" !== n || ((t = J(this)) && He.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : He.get(this, "__className__") || ""))
            })
        },
        hasClass: function (e) {
            var t, n, r = 0;
            for (t = " " + e + " "; n = this[r++];)
                if (1 === n.nodeType && (" " + Z(J(n)) + " ").indexOf(t) > -1) return !0;
            return !1
        }
    });
    var kt = /\r/g;
    we.fn.extend({
        val: function (e) {
            var t, n, r, i = this[0];
            return arguments.length ? (r = ye(e), this.each(function (n) {
                var i;
                1 === this.nodeType && (null == (i = r ? e.call(this, n, we(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = we.map(i, function (e) {
                    return null == e ? "" : e + ""
                })), (t = we.valHooks[this.type] || we.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
            })) : i ? (t = we.valHooks[i.type] || we.valHooks[i.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : "string" == typeof (n = i.value) ? n.replace(kt, "") : null == n ? "" : n : void 0
        }
    }), we.extend({
        valHooks: {
            option: {
                get: function (e) {
                    var t = we.find.attr(e, "value");
                    return null != t ? t : Z(we.text(e))
                }
            },
            select: {
                get: function (e) {
                    var t, n, r, i = e.options,
                        a = e.selectedIndex,
                        s = "select-one" === e.type,
                        l = s ? null : [],
                        u = s ? a + 1 : i.length;
                    for (r = a < 0 ? u : s ? a : 0; r < u; r++)
                        if (((n = i[r]).selected || r === a) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
                            if (t = we(n).val(), s) return t;
                            l.push(t)
                        } return l
                },
                set: function (e, t) {
                    for (var n, r, i = e.options, o = we.makeArray(t), a = i.length; a--;)((r = i[a]).selected = we.inArray(we.valHooks.option.get(r), o) > -1) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        }
    }), we.each(["radio", "checkbox"], function () {
        we.valHooks[this] = {
            set: function (e, t) {
                if (Array.isArray(t)) return e.checked = we.inArray(we(e).val(), t) > -1
            }
        }, ve.checkOn || (we.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), ve.focusin = "onfocusin" in e;
    var St = /^(?:focusinfocus|focusoutblur)$/,
        Et = function (e) {
            e.stopPropagation()
        };
    we.extend(we.event, {
        trigger: function (t, n, r, i) {
            var o, a, s, l, u, c, d, f, p = [r || ae],
                h = he.call(t, "type") ? t.type : t,
                g = he.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = f = s = r = r || ae, 3 !== r.nodeType && 8 !== r.nodeType && !St.test(h + we.event.triggered) && (h.indexOf(".") > -1 && (h = (g = h.split(".")).shift(), g.sort()), u = h.indexOf(":") < 0 && "on" + h, t = t[we.expando] ? t : new we.Event(h, "object" == typeof t && t), t.isTrigger = i ? 2 : 3, t.namespace = g.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = r), n = null == n ? [t] : we.makeArray(n, [t]), d = we.event.special[h] || {}, i || !d.trigger || !1 !== d.trigger.apply(r, n))) {
                if (!i && !d.noBubble && !be(r)) {
                    for (l = d.delegateType || h, St.test(l + h) || (a = a.parentNode); a; a = a.parentNode) p.push(a), s = a;
                    s === (r.ownerDocument || ae) && p.push(s.defaultView || s.parentWindow || e)
                }
                for (o = 0;
                    (a = p[o++]) && !t.isPropagationStopped();) f = a, t.type = o > 1 ? l : d.bindType || h, (c = (He.get(a, "events") || {})[t.type] && He.get(a, "handle")) && c.apply(a, n), (c = u && a[u]) && c.apply && Ie(a) && (t.result = c.apply(a, n), !1 === t.result && t.preventDefault());
                return t.type = h, i || t.isDefaultPrevented() || d._default && !1 !== d._default.apply(p.pop(), n) || !Ie(r) || u && ye(r[h]) && !be(r) && ((s = r[u]) && (r[u] = null), we.event.triggered = h, t.isPropagationStopped() && f.addEventListener(h, Et), r[h](), t.isPropagationStopped() && f.removeEventListener(h, Et), we.event.triggered = void 0, s && (r[u] = s)), t.result
            }
        },
        simulate: function (e, t, n) {
            var r = we.extend(new we.Event, n, {
                type: e,
                isSimulated: !0
            });
            we.event.trigger(r, null, t)
        }
    }), we.fn.extend({
        trigger: function (e, t) {
            return this.each(function () {
                we.event.trigger(e, t, this)
            })
        },
        triggerHandler: function (e, t) {
            var n = this[0];
            if (n) return we.event.trigger(e, t, n, !0)
        }
    }), ve.focusin || we.each({
        focus: "focusin",
        blur: "focusout"
    }, function (e, t) {
        var n = function (e) {
            we.event.simulate(t, e.target, we.event.fix(e))
        };
        we.event.special[t] = {
            setup: function () {
                var r = this.ownerDocument || this,
                    i = He.access(r, t);
                i || r.addEventListener(e, n, !0), He.access(r, t, (i || 0) + 1)
            },
            teardown: function () {
                var r = this.ownerDocument || this,
                    i = He.access(r, t) - 1;
                i ? He.access(r, t, i) : (r.removeEventListener(e, n, !0), He.remove(r, t))
            }
        }
    });
    var $t = e.location,
        Dt = Date.now(),
        jt = /\?/;
    we.parseXML = function (e) {
        var t;
        if (!e || "string" != typeof e) return null;
        try {
            t = (new n.DOMParser).parseFromString(e, "text/xml")
        } catch (n) {
            t = void 0
        }
        return t && !t.getElementsByTagName("parsererror").length || we.error("Invalid XML: " + e), t
    };
    var At = /\[\]$/,
        Nt = /\r?\n/g,
        Ot = /^(?:submit|button|image|reset|file)$/i,
        Pt = /^(?:input|select|textarea|keygen)/i;
    we.param = function (e, t) {
        var n, r = [],
            i = function (e, t) {
                var n = ye(t) ? t() : t;
                r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
            };
        if (Array.isArray(e) || e.jquery && !we.isPlainObject(e)) we.each(e, function () {
            i(this.name, this.value)
        });
        else
            for (n in e) K(n, e[n], t, i);
        return r.join("&")
    }, we.fn.extend({
        serialize: function () {
            return we.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                var e = we.prop(this, "elements");
                return e ? we.makeArray(e) : this
            }).filter(function () {
                var e = this.type;
                return this.name && !we(this).is(":disabled") && Pt.test(this.nodeName) && !Ot.test(e) && (this.checked || !Ge.test(e))
            }).map(function (e, t) {
                var n = we(this).val();
                return null == n ? null : Array.isArray(n) ? we.map(n, function (e) {
                    return {
                        name: t.name,
                        value: e.replace(Nt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Nt, "\r\n")
                }
            }).get()
        }
    });
    var qt = /%20/g,
        Lt = /#.*$/,
        Ft = /([?&])_=[^&]*/,
        It = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Ht = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Rt = /^(?:GET|HEAD)$/,
        Bt = /^\/\//,
        Mt = {},
        Wt = {},
        zt = "*/".concat("*"),
        Ut = ae.createElement("a");
    Ut.href = $t.href, we.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: $t.href,
            type: "GET",
            isLocal: Ht.test($t.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": zt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": we.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function (e, t) {
            return t ? ne(ne(e, we.ajaxSettings), t) : ne(we.ajaxSettings, e)
        },
        ajaxPrefilter: ee(Mt),
        ajaxTransport: ee(Wt),
        ajax: function (e, t) {
            function n(e, t, n, a) {
                var l, d, f, b, x, w = t;
                u || (u = !0, s && _.clearTimeout(s), r = void 0, o = a || "", C.readyState = e > 0 ? 4 : 0, l = e >= 200 && e < 300 || 304 === e, n && (b = re(p, C, n)), b = ie(p, b, C, l), l ? (p.ifModified && ((x = C.getResponseHeader("Last-Modified")) && (we.lastModified[i] = x), (x = C.getResponseHeader("etag")) && (we.etag[i] = x)), 204 === e || "HEAD" === p.type ? w = "nocontent" : 304 === e ? w = "notmodified" : (w = b.state, d = b.data, l = !(f = b.error))) : (f = w, !e && w || (w = "error", e < 0 && (e = 0))), C.status = e, C.statusText = (t || w) + "", l ? m.resolveWith(h, [d, w, C]) : m.rejectWith(h, [C, w, f]), C.statusCode(y), y = void 0, c && g.trigger(l ? "ajaxSuccess" : "ajaxError", [C, p, l ? d : f]), v.fireWith(h, [C, w]), c && (g.trigger("ajaxComplete", [C, p]), --we.active || we.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var r, i, o, a, s, l, u, c, d, f, p = we.ajaxSetup({}, t),
                h = p.context || p,
                g = p.context && (h.nodeType || h.jquery) ? we(h) : we.event,
                m = we.Deferred(),
                v = we.Callbacks("once memory"),
                y = p.statusCode || {},
                b = {},
                x = {},
                w = "canceled",
                C = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                        var t;
                        if (u) {
                            if (!a)
                                for (a = {}; t = It.exec(o);) a[t[1].toLowerCase()] = t[2];
                            t = a[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function () {
                        return u ? o : null
                    },
                    setRequestHeader: function (e, t) {
                        return null == u && (e = x[e.toLowerCase()] = x[e.toLowerCase()] || e, b[e] = t), this
                    },
                    overrideMimeType: function (e) {
                        return null == u && (p.mimeType = e), this
                    },
                    statusCode: function (e) {
                        var t;
                        if (e)
                            if (u) C.always(e[C.status]);
                            else
                                for (t in e) y[t] = [y[t], e[t]];
                        return this
                    },
                    abort: function (e) {
                        var t = e || w;
                        return r && r.abort(t), n(0, t), this
                    }
                };
            if (m.promise(C), p.url = ((e || p.url || $t.href) + "").replace(Bt, $t.protocol + "//"), p.type = t.method || t.type || p.method || p.type, p.dataTypes = (p.dataType || "*").toLowerCase().match(Ne) || [""], null == p.crossDomain) {
                l = ae.createElement("a");
                try {
                    l.href = p.url, l.href = l.href, p.crossDomain = Ut.protocol + "//" + Ut.host != l.protocol + "//" + l.host
                } catch (_) {
                    p.crossDomain = !0
                }
            }
            if (p.data && p.processData && "string" != typeof p.data && (p.data = we.param(p.data, p.traditional)), te(Mt, p, t, C), u) return C;
            (c = we.event && p.global) && 0 == we.active++ && we.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Rt.test(p.type), i = p.url.replace(Lt, ""), p.hasContent ? p.data && p.processData && 0 === (p.contentType || "").indexOf("application/x-www-form-urlencoded") && (p.data = p.data.replace(qt, "+")) : (f = p.url.slice(i.length), p.data && (p.processData || "string" == typeof p.data) && (i += (jt.test(i) ? "&" : "?") + p.data, delete p.data), !1 === p.cache && (i = i.replace(Ft, "$1"), f = (jt.test(i) ? "&" : "?") + "_=" + Dt++ + f), p.url = i + f), p.ifModified && (we.lastModified[i] && C.setRequestHeader("If-Modified-Since", we.lastModified[i]), we.etag[i] && C.setRequestHeader("If-None-Match", we.etag[i])), (p.data && p.hasContent && !1 !== p.contentType || t.contentType) && C.setRequestHeader("Content-Type", p.contentType), C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + zt + "; q=0.01" : "") : p.accepts["*"]);
            for (d in p.headers) C.setRequestHeader(d, p.headers[d]);
            if (p.beforeSend && (!1 === p.beforeSend.call(h, C, p) || u)) return C.abort();
            if (w = "abort", v.add(p.complete), C.done(p.success), C.fail(p.error), r = te(Wt, p, t, C)) {
                if (C.readyState = 1, c && g.trigger("ajaxSend", [C, p]), u) return C;
                p.async && p.timeout > 0 && (s = _.setTimeout(function () {
                    C.abort("timeout")
                }, p.timeout));
                try {
                    u = !1, r.send(b, n)
                } catch (_) {
                    if (u) throw _;
                    n(-1, _)
                }
            } else n(-1, "No Transport");
            return C
        },
        getJSON: function (e, t, n) {
            return we.get(e, t, n, "json")
        },
        getScript: function (e, t) {
            return we.get(e, void 0, t, "script")
        }
    }), we.each(["get", "post"], function (e, t) {
        we[t] = function (e, n, r, i) {
            return ye(n) && (i = i || r, r = n, n = void 0), we.ajax(we.extend({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            }, we.isPlainObject(e) && e))
        }
    }), we._evalUrl = function (e) {
        return we.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            "throws": !0
        })
    }, we.fn.extend({
        wrapAll: function (e) {
            var t;
            return this[0] && (ye(e) && (e = e.call(this[0])), t = we(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                return e
            }).append(this)), this
        },
        wrapInner: function (e) {
            return ye(e) ? this.each(function (t) {
                we(this).wrapInner(e.call(this, t))
            }) : this.each(function () {
                var t = we(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function (e) {
            var t = ye(e);
            return this.each(function (n) {
                we(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function (e) {
            return this.parent(e).not("body").each(function () {
                we(this).replaceWith(this.childNodes)
            }), this
        }
    }), we.expr.pseudos.hidden = function (e) {
        return !we.expr.pseudos.visible(e)
    }, we.expr.pseudos.visible = function (e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }, we.ajaxSettings.xhr = function () {
        try {
            return new e.XMLHttpRequest
        } catch (e) { }
    };
    var Xt = {
        0: 200,
        1223: 204
    },
        Vt = we.ajaxSettings.xhr();
    ve.cors = !!Vt && "withCredentials" in Vt, ve.ajax = Vt = !!Vt, we.ajaxTransport(function (e) {
        var t, n;
        if (ve.cors || Vt && !e.crossDomain) return {
            send: function (r, i) {
                var o, a = e.xhr();
                if (a.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                    for (o in e.xhrFields) a[o] = e.xhrFields[o];
                e.mimeType && a.overrideMimeType && a.overrideMimeType(e.mimeType), e.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
                for (o in r) a.setRequestHeader(o, r[o]);
                t = function (e) {
                    return function () {
                        t && (t = n = a.onload = a.onerror = a.onabort = a.ontimeout = a.onreadystatechange = null, "abort" === e ? a.abort() : "error" === e ? "number" != typeof a.status ? i(0, "error") : i(a.status, a.statusText) : i(Xt[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                            binary: a.response
                        } : {
                            text: a.responseText
                        }, a.getAllResponseHeaders()))
                    }
                }, a.onload = t(), n = a.onerror = a.ontimeout = t("error"), void 0 !== a.onabort ? a.onabort = n : a.onreadystatechange = function () {
                    4 === a.readyState && s.setTimeout(function () {
                        t && n()
                    })
                }, t = t("abort");
                try {
                    a.send(e.hasContent && e.data || null)
                } catch (s) {
                    if (t) throw s
                }
            },
            abort: function () {
                t && t()
            }
        }
    }), we.ajaxPrefilter(function (e) {
        e.crossDomain && (e.contents.script = !1)
    }), we.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function (e) {
                return we.globalEval(e), e
            }
        }
    }), we.ajaxPrefilter("script", function (e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), we.ajaxTransport("script", function (e) {
        if (e.crossDomain) {
            var t, n;
            return {
                send: function (r, i) {
                    t = we("<script>").prop({
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", n = function (e) {
                        t.remove(), n = null, e && i("error" === e.type ? 404 : 200, e.type)
                    }), ae.head.appendChild(t[0])
                },
                abort: function () {
                    n && n()
                }
            }
        }
    });
    var Qt = [],
        Gt = /(=)\?(?=&|$)|\?\?/;
    we.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = Qt.pop() || we.expando + "_" + Dt++;
            return this[e] = !0, e
        }
    }), we.ajaxPrefilter("json jsonp", function (t, n, r) {
        var i, o, a, s = !1 !== t.jsonp && (Gt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Gt.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0]) return i = t.jsonpCallback = ye(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(Gt, "$1" + i) : !1 !== t.jsonp && (t.url += (jt.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function () {
            return a || we.error(i + " was not called"), a[0]
        }, t.dataTypes[0] = "json", o = e[i], e[i] = function () {
            a = arguments
        }, r.always(function () {
            void 0 === o ? we(e).removeProp(i) : e[i] = o, t[i] && (t.jsonpCallback = n.jsonpCallback, Qt.push(i)), a && ye(o) && o(a[0]), a = o = void 0
        }), "script"
    }), ve.createHTMLDocument = function () {
        var e = ae.implementation.createHTMLDocument("").body;
        return e.innerHTML = "<form></form><form></form>", 2 === e.childNodes.length
    }(), we.parseHTML = function (e, t, n) {
        if ("string" != typeof e) return [];
        "boolean" == typeof t && (n = t, t = !1);
        var r, i, o;
        return t || (ve.createHTMLDocument ? ((r = (t = ae.implementation.createHTMLDocument("")).createElement("base")).href = ae.location.href, t.head.appendChild(r)) : t = ae), i = Ee.exec(e), o = !n && [], i ? [t.createElement(i[1])] : (i = _([e], t, o), o && o.length && we(o).remove(), we.merge([], i.childNodes))
    }, we.fn.load = function (e, t, n) {
        var r, i, o, a = this,
            s = e.indexOf(" ");
        return s > -1 && (r = Z(e.slice(s)), e = e.slice(0, s)), ye(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), a.length > 0 && we.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function (e) {
            o = arguments, a.html(r ? we("<div>").append(we.parseHTML(e)).find(r) : e)
        }).always(n && function (e, t) {
            a.each(function () {
                n.apply(this, o || [e.responseText, t, e])
            })
        }), this
    }, we.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
        we.fn[t] = function (e) {
            return this.on(t, e)
        }
    }), we.expr.pseudos.animated = function (e) {
        return we.grep(we.timers, function (t) {
            return e === t.elem
        }).length
    }, we.offset = {
        setOffset: function (e, t, n) {
            var r, i, o, a, s, l, u, c = we.css(e, "position"),
                d = we(e),
                f = {};
            "static" === c && (e.style.position = "relative"), s = d.offset(), o = we.css(e, "top"), l = we.css(e, "left"), (u = ("absolute" === c || "fixed" === c) && (o + l).indexOf("auto") > -1) ? (a = (r = d.position()).top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(l) || 0), ye(t) && (t = t.call(e, n, we.extend({}, s))), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), "using" in t ? t.using.call(e, f) : d.css(f)
        }
    }, we.fn.extend({
        offset: function (e) {
            if (arguments.length) return void 0 === e ? this : this.each(function (t) {
                we.offset.setOffset(this, e, t)
            });
            var t, n, r = this[0];
            return r ? r.getClientRects().length ? (t = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function () {
            if (this[0]) {
                var e, t, n, r = this[0],
                    i = {
                        top: 0,
                        left: 0
                    };
                if ("fixed" === we.css(r, "position")) t = r.getBoundingClientRect();
                else {
                    for (t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === we.css(e, "position");) e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = we(e).offset()).top += we.css(e, "borderTopWidth", !0), i.left += we.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - we.css(r, "marginTop", !0),
                    left: t.left - i.left - we.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var e = this.offsetParent; e && "static" === we.css(e, "position");) e = e.offsetParent;
                return e || et
            })
        }
    }), we.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (e, t) {
        var n = "pageYOffset" === t;
        we.fn[e] = function (r) {
            return qe(this, function (e, r, i) {
                var o;
                return be(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), void 0 === i ? o ? o[t] : e[r] : void (o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i)
            }, e, r, arguments.length)
        }
    }), we.each(["top", "left"], function (e, t) {
        we.cssHooks[t] = L(ve.pixelPosition, function (e, n) {
            if (n) return n = q(e, t), lt.test(n) ? we(e).position()[t] + "px" : n
        })
    }), we.each({
        Height: "height",
        Width: "width"
    }, function (e, t) {
        we.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function (n, r) {
            we.fn[r] = function (i, o) {
                var a = arguments.length && (n || "boolean" != typeof i),
                    s = n || (!0 === i || !0 === o ? "margin" : "border");
                return qe(this, function (t, n, i) {
                    var o;
                    return be(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? we.css(t, n, s) : we.style(t, n, i, s)
                }, t, a ? i : void 0, a)
            }
        })
    }), we.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (e, t) {
        we.fn[t] = function (e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), we.fn.extend({
        hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), we.fn.extend({
        bind: function (e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function (e, t) {
            return this.off(e, null, t)
        },
        delegate: function (e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function (e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), we.proxy = function (e, t) {
        var n, r, i;
        if ("string" == typeof t && (n = e[t], t = e, e = n), ye(e)) return r = le.call(arguments, 2), i = function () {
            return e.apply(t || this, r.concat(le.call(arguments)))
        }, i.guid = e.guid = e.guid || we.guid++, i
    }, we.holdReady = function (e) {
        e ? we.readyWait++ : we.ready(!0)
    }, we.isArray = Array.isArray, we.parseJSON = JSON.parse, we.nodeName = o, we.isFunction = ye, we.isWindow = be, we.camelCase = h, we.type = r, we.now = Date.now, we.isNumeric = function (e) {
        var t = we.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }, "function" == typeof define && define.amd && define("jquery", [], function () {
        return we
    });
    var Zt = e.jQuery,
        Jt = e.$;
    return we.noConflict = function (t) {
        return e.$ === we && (e.$ = Jt), t && e.jQuery === we && (e.jQuery = Zt), we
    }, t || (e.jQuery = e.$ = we), we
}),
    function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : jQuery)
    }(function (e) {
        e.ui = e.ui || {};
        var t = (e.ui.version = "1.12.1", 0),
            n = Array.prototype.slice;
        e.cleanData = function (t) {
            return function (n) {
                var r, i, o;
                for (o = 0; null != (i = n[o]); o++) try {
                    r = e._data(i, "events"), r && r.remove && e(i).triggerHandler("remove")
                } catch (a) { }
                t(n)
            }
        }(e.cleanData), e.widget = function (t, n, r) {
            var i, o, a, s = {},
                l = t.split(".")[0];
            t = t.split(".")[1];
            var u = l + "-" + t;
            return r || (r = n, n = e.Widget), e.isArray(r) && (r = e.extend.apply(null, [{}].concat(r))), e.expr[":"][u.toLowerCase()] = function (t) {
                return !!e.data(t, u)
            }, e[l] = e[l] || {}, i = e[l][t], o = e[l][t] = function (e, t) {
                return this._createWidget ? void (arguments.length && this._createWidget(e, t)) : new o(e, t)
            }, e.extend(o, i, {
                version: r.version,
                _proto: e.extend({}, r),
                _childConstructors: []
            }), a = new n, a.options = e.widget.extend({}, a.options), e.each(r, function (t, r) {
                return e.isFunction(r) ? void (s[t] = function () {
                    function e() {
                        return n.prototype[t].apply(this, arguments)
                    }

                    function i(e) {
                        return n.prototype[t].apply(this, e)
                    }
                    return function () {
                        var t, n = this._super,
                            o = this._superApply;
                        return this._super = e, this._superApply = i, t = r.apply(this, arguments), this._super = n, this._superApply = o, t
                    }
                }()) : void (s[t] = r)
            }), o.prototype = e.widget.extend(a, {
                widgetEventPrefix: i ? a.widgetEventPrefix || t : t
            }, s, {
                constructor: o,
                namespace: l,
                widgetName: t,
                widgetFullName: u
            }), i ? (e.each(i._childConstructors, function (t, n) {
                var r = n.prototype;
                e.widget(r.namespace + "." + r.widgetName, o, n._proto)
            }), delete i._childConstructors) : n._childConstructors.push(o), e.widget.bridge(t, o), o
        }, e.widget.extend = function (t) {
            for (var r, i, o = n.call(arguments, 1), a = 0, s = o.length; a < s; a++)
                for (r in o[a]) i = o[a][r], o[a].hasOwnProperty(r) && void 0 !== i && (e.isPlainObject(i) ? t[r] = e.isPlainObject(t[r]) ? e.widget.extend({}, t[r], i) : e.widget.extend({}, i) : t[r] = i);
            return t
        }, e.widget.bridge = function (t, r) {
            var i = r.prototype.widgetFullName || t;
            e.fn[t] = function (o) {
                var a = "string" == typeof o,
                    s = n.call(arguments, 1),
                    l = this;
                return a ? this.length || "instance" !== o ? this.each(function () {
                    var n, r = e.data(this, i);
                    return "instance" === o ? (l = r, !1) : r ? e.isFunction(r[o]) && "_" !== o.charAt(0) ? (n = r[o].apply(r, s), n !== r && void 0 !== n ? (l = n && n.jquery ? l.pushStack(n.get()) : n, !1) : void 0) : e.error("no such method '" + o + "' for " + t + " widget instance") : e.error("cannot call methods on " + t + " prior to initialization; attempted to call method '" + o + "'")
                }) : l = void 0 : (s.length && (o = e.widget.extend.apply(null, [o].concat(s))), this.each(function () {
                    var t = e.data(this, i);
                    t ? (t.option(o || {}), t._init && t._init()) : e.data(this, i, new r(o, this))
                })), l
            }
        }, e.Widget = function () { }, e.Widget._childConstructors = [], e.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                classes: {},
                disabled: !1,
                create: null
            },
            _createWidget: function (n, r) {
                r = e(r || this.defaultElement || this)[0], this.element = e(r), this.uuid = t++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = e(), this.hoverable = e(), this.focusable = e(), this.classesElementLookup = {}, r !== this && (e.data(r, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function (e) {
                        e.target === r && this.destroy()
                    }
                }), this.document = e(r.style ? r.ownerDocument : r.document || r), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this.options = e.widget.extend({}, this.options, this._getCreateOptions(), n), this._create(), this.options.disabled && this._setOptionDisabled(this.options.disabled), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: function () {
                return {}
            },
            _getCreateEventData: e.noop,
            _create: e.noop,
            _init: e.noop,
            destroy: function () {
                var t = this;
                this._destroy(), e.each(this.classesElementLookup, function (e, n) {
                    t._removeClass(n, e)
                }), this.element.off(this.eventNamespace).removeData(this.widgetFullName), this.widget().off(this.eventNamespace).removeAttr("aria-disabled"), this.bindings.off(this.eventNamespace)
            },
            _destroy: e.noop,
            widget: function () {
                return this.element
            },
            option: function (t, n) {
                var r, i, o, a = t;
                if (0 === arguments.length) return e.widget.extend({}, this.options);
                if ("string" == typeof t)
                    if (a = {}, r = t.split("."), t = r.shift(), r.length) {
                        for (i = a[t] = e.widget.extend({}, this.options[t]), o = 0; o < r.length - 1; o++) i[r[o]] = i[r[o]] || {}, i = i[r[o]];
                        if (t = r.pop(), 1 === arguments.length) return void 0 === i[t] ? null : i[t];
                        i[t] = n
                    } else {
                        if (1 === arguments.length) return void 0 === this.options[t] ? null : this.options[t];
                        a[t] = n
                    } return this._setOptions(a), this
            },
            _setOptions: function (e) {
                var t;
                for (t in e) this._setOption(t, e[t]);
                return this
            },
            _setOption: function (e, t) {
                return "classes" === e && this._setOptionClasses(t), this.options[e] = t, "disabled" === e && this._setOptionDisabled(t), this
            },
            _setOptionClasses: function (t) {
                var n, r, i;
                for (n in t) i = this.classesElementLookup[n], t[n] !== this.options.classes[n] && i && i.length && (r = e(i.get()), this._removeClass(i, n), r.addClass(this._classes({
                    element: r,
                    keys: n,
                    classes: t,
                    add: !0
                })))
            },
            _setOptionDisabled: function (e) {
                this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!e), e && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
            },
            enable: function () {
                return this._setOptions({
                    disabled: !1
                })
            },
            disable: function () {
                return this._setOptions({
                    disabled: !0
                })
            },
            _classes: function (t) {
                function n(n, o) {
                    var a, s;
                    for (s = 0; s < n.length; s++) a = i.classesElementLookup[n[s]] || e(), a = e(t.add ? e.unique(a.get().concat(t.element.get())) : a.not(t.element).get()), i.classesElementLookup[n[s]] = a, r.push(n[s]), o && t.classes[n[s]] && r.push(t.classes[n[s]])
                }
                var r = [],
                    i = this;
                return t = e.extend({
                    element: this.element,
                    classes: this.options.classes || {}
                }, t), this._on(t.element, {
                    remove: "_untrackClassesElement"
                }), t.keys && n(t.keys.match(/\S+/g) || [], !0), t.extra && n(t.extra.match(/\S+/g) || []), r.join(" ")
            },
            _untrackClassesElement: function (t) {
                var n = this;
                e.each(n.classesElementLookup, function (r, i) {
                    e.inArray(t.target, i) !== -1 && (n.classesElementLookup[r] = e(i.not(t.target).get()))
                })
            },
            _removeClass: function (e, t, n) {
                return this._toggleClass(e, t, n, !1)
            },
            _addClass: function (e, t, n) {
                return this._toggleClass(e, t, n, !0)
            },
            _toggleClass: function (e, t, n, r) {
                r = "boolean" == typeof r ? r : n;
                var i = "string" == typeof e || null === e,
                    o = {
                        extra: i ? t : n,
                        keys: i ? e : t,
                        element: i ? this.element : e,
                        add: r
                    };
                return o.element.toggleClass(this._classes(o), r), this
            },
            _on: function (t, n, r) {
                var i, o = this;
                "boolean" != typeof t && (r = n, n = t, t = !1), r ? (n = i = e(n), this.bindings = this.bindings.add(n)) : (r = n, n = this.element, i = this.widget()), e.each(r, function (r, a) {
                    function s() {
                        if (t || o.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled")) return ("string" == typeof a ? o[a] : a).apply(o, arguments)
                    }
                    "string" != typeof a && (s.guid = a.guid = a.guid || s.guid || e.guid++);
                    var l = r.match(/^([\w:-]*)\s*(.*)$/),
                        u = l[1] + o.eventNamespace,
                        c = l[2];
                    c ? i.on(u, c, s) : n.on(u, s)
                })
            },
            _off: function (t, n) {
                n = (n || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.off(n).off(n), this.bindings = e(this.bindings.not(t).get()), this.focusable = e(this.focusable.not(t).get()), this.hoverable = e(this.hoverable.not(t).get())
            },
            _delay: function (e, t) {
                function n() {
                    return ("string" == typeof e ? r[e] : e).apply(r, arguments)
                }
                var r = this;
                return setTimeout(n, t || 0)
            },
            _hoverable: function (t) {
                this.hoverable = this.hoverable.add(t), this._on(t, {
                    mouseenter: function (t) {
                        this._addClass(e(t.currentTarget), null, "ui-state-hover")
                    },
                    mouseleave: function (t) {
                        this._removeClass(e(t.currentTarget), null, "ui-state-hover")
                    }
                })
            },
            _focusable: function (t) {
                this.focusable = this.focusable.add(t), this._on(t, {
                    focusin: function (t) {
                        this._addClass(e(t.currentTarget), null, "ui-state-focus")
                    },
                    focusout: function (t) {
                        this._removeClass(e(t.currentTarget), null, "ui-state-focus")
                    }
                })
            },
            _trigger: function (t, n, r) {
                var i, o, a = this.options[t];
                if (r = r || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], o = n.originalEvent)
                    for (i in o) i in n || (n[i] = o[i]);
                return this.element.trigger(n, r), !(e.isFunction(a) && a.apply(this.element[0], [n].concat(r)) === !1 || n.isDefaultPrevented())
            }
        }, e.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function (t, n) {
            e.Widget.prototype["_" + t] = function (r, i, o) {
                "string" == typeof i && (i = {
                    effect: i
                });
                var a, s = i ? i === !0 || "number" == typeof i ? n : i.effect || n : t;
                i = i || {}, "number" == typeof i && (i = {
                    duration: i
                }), a = !e.isEmptyObject(i), i.complete = o, i.delay && r.delay(i.delay), a && e.effects && e.effects.effect[s] ? r[t](i) : s !== t && r[s] ? r[s](i.duration, i.easing, o) : r.queue(function (n) {
                    e(this)[t](), o && o.call(r[0]), n()
                })
            }
        });
        e.widget
    }),
    function (e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery", "jquery-ui/ui/widget"], e) : "object" == typeof exports ? e(require("jquery"), require("./vendor/jquery.ui.widget")) : e(window.jQuery)
    }(function (e) {
        "use strict";

        function t(t) {
            var n = "dragover" === t;
            return function (r) {
                r.dataTransfer = r.originalEvent && r.originalEvent.dataTransfer;
                var i = r.dataTransfer;
                i && e.inArray("Files", i.types) !== -1 && this._trigger(t, e.Event(t, {
                    delegatedEvent: r
                })) !== !1 && (r.preventDefault(), n && (i.dropEffect = "copy"))
            }
        }
        e.support.fileInput = !(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent) || e('<input type="file"/>').prop("disabled")), e.support.xhrFileUpload = !(!window.ProgressEvent || !window.FileReader), e.support.xhrFormDataFileUpload = !!window.FormData, e.support.blobSlice = window.Blob && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice), e.widget("blueimp.fileupload", {
            options: {
                dropZone: e(document),
                pasteZone: void 0,
                fileInput: void 0,
                replaceFileInput: !0,
                paramName: void 0,
                singleFileUploads: !0,
                limitMultiFileUploads: void 0,
                limitMultiFileUploadSize: void 0,
                limitMultiFileUploadSizeOverhead: 512,
                sequentialUploads: !1,
                limitConcurrentUploads: void 0,
                forceIframeTransport: !1,
                redirect: void 0,
                redirectParamName: void 0,
                postMessage: void 0,
                multipart: !0,
                maxChunkSize: void 0,
                uploadedBytes: void 0,
                recalculateProgress: !0,
                progressInterval: 100,
                bitrateInterval: 500,
                autoUpload: !0,
                messages: {
                    uploadedBytes: "Uploaded bytes exceed file size"
                },
                i18n: function (t, n) {
                    return t = this.messages[t] || t.toString(), n && e.each(n, function (e, n) {
                        t = t.replace("{" + e + "}", n)
                    }), t
                },
                formData: function (e) {
                    return e.serializeArray()
                },
                add: function (t, n) {
                    return !t.isDefaultPrevented() && void ((n.autoUpload || n.autoUpload !== !1 && e(this).fileupload("option", "autoUpload")) && n.process().done(function () {
                        n.submit()
                    }))
                },
                processData: !1,
                contentType: !1,
                cache: !1,
                timeout: 0
            },
            _specialOptions: ["fileInput", "dropZone", "pasteZone", "multipart", "forceIframeTransport"],
            _blobSlice: e.support.blobSlice && function () {
                var e = this.slice || this.webkitSlice || this.mozSlice;
                return e.apply(this, arguments)
            },
            _BitrateTimer: function () {
                this.timestamp = Date.now ? Date.now() : (new Date).getTime(), this.loaded = 0, this.bitrate = 0, this.getBitrate = function (e, t, n) {
                    var r = e - this.timestamp;
                    return (!this.bitrate || !n || r > n) && (this.bitrate = (t - this.loaded) * (1e3 / r) * 8, this.loaded = t, this.timestamp = e), this.bitrate
                }
            },
            _isXHRUpload: function (t) {
                return !t.forceIframeTransport && (!t.multipart && e.support.xhrFileUpload || e.support.xhrFormDataFileUpload)
            },
            _getFormData: function (t) {
                var n;
                return "function" === e.type(t.formData) ? t.formData(t.form) : e.isArray(t.formData) ? t.formData : "object" === e.type(t.formData) ? (n = [], e.each(t.formData, function (e, t) {
                    n.push({
                        name: e,
                        value: t
                    })
                }), n) : []
            },
            _getTotal: function (t) {
                var n = 0;
                return e.each(t, function (e, t) {
                    n += t.size || 1
                }), n
            },
            _initProgressObject: function (t) {
                var n = {
                    loaded: 0,
                    total: 0,
                    bitrate: 0
                };
                t._progress ? e.extend(t._progress, n) : t._progress = n
            },
            _initResponseObject: function (e) {
                var t;
                if (e._response)
                    for (t in e._response) e._response.hasOwnProperty(t) && delete e._response[t];
                else e._response = {}
            },
            _onProgress: function (t, n) {
                if (t.lengthComputable) {
                    var r, i = Date.now ? Date.now() : (new Date).getTime();
                    if (n._time && n.progressInterval && i - n._time < n.progressInterval && t.loaded !== t.total) return;
                    n._time = i, r = Math.floor(t.loaded / t.total * (n.chunkSize || n._progress.total)) + (n.uploadedBytes || 0), this._progress.loaded += r - n._progress.loaded, this._progress.bitrate = this._bitrateTimer.getBitrate(i, this._progress.loaded, n.bitrateInterval), n._progress.loaded = n.loaded = r, n._progress.bitrate = n.bitrate = n._bitrateTimer.getBitrate(i, r, n.bitrateInterval), this._trigger("progress", e.Event("progress", {
                        delegatedEvent: t
                    }), n), this._trigger("progressall", e.Event("progressall", {
                        delegatedEvent: t
                    }), this._progress)
                }
            },
            _initProgressListener: function (t) {
                var n = this,
                    r = t.xhr ? t.xhr() : e.ajaxSettings.xhr();
                r.upload && (e(r.upload).bind("progress", function (e) {
                    var r = e.originalEvent;
                    e.lengthComputable = r.lengthComputable, e.loaded = r.loaded, e.total = r.total, n._onProgress(e, t)
                }), t.xhr = function () {
                    return r
                })
            },
            _isInstanceOf: function (e, t) {
                return Object.prototype.toString.call(t) === "[object " + e + "]"
            },
            _initXHRData: function (t) {
                var n, r = this,
                    i = t.files[0],
                    o = t.multipart || !e.support.xhrFileUpload,
                    a = "array" === e.type(t.paramName) ? t.paramName[0] : t.paramName;
                t.headers = e.extend({}, t.headers), t.contentRange && (t.headers["Content-Range"] = t.contentRange), o && !t.blob && this._isInstanceOf("File", i) || (t.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(i.uploadName || i.name) + '"'), o ? e.support.xhrFormDataFileUpload && (t.postMessage ? (n = this._getFormData(t), t.blob ? n.push({
                    name: a,
                    value: t.blob
                }) : e.each(t.files, function (r, i) {
                    n.push({
                        name: "array" === e.type(t.paramName) && t.paramName[r] || a,
                        value: i
                    })
                })) : (r._isInstanceOf("FormData", t.formData) ? n = t.formData : (n = new FormData, e.each(this._getFormData(t), function (e, t) {
                    n.append(t.name, t.value)
                })), t.blob ? n.append(a, t.blob, i.uploadName || i.name) : e.each(t.files, function (i, o) {
                    (r._isInstanceOf("File", o) || r._isInstanceOf("Blob", o)) && n.append("array" === e.type(t.paramName) && t.paramName[i] || a, o, o.uploadName || o.name)
                })), t.data = n) : (t.contentType = i.type || "application/octet-stream", t.data = t.blob || i), t.blob = null
            },
            _initIframeSettings: function (t) {
                var n = e("<a></a>").prop("href", t.url).prop("host");
                t.dataType = "iframe " + (t.dataType || ""), t.formData = this._getFormData(t), t.redirect && n && n !== location.host && t.formData.push({
                    name: t.redirectParamName || "redirect",
                    value: t.redirect
                })
            },
            _initDataSettings: function (e) {
                this._isXHRUpload(e) ? (this._chunkedUpload(e, !0) || (e.data || this._initXHRData(e), this._initProgressListener(e)), e.postMessage && (e.dataType = "postmessage " + (e.dataType || ""))) : this._initIframeSettings(e)
            },
            _getParamName: function (t) {
                var n = e(t.fileInput),
                    r = t.paramName;
                return r ? e.isArray(r) || (r = [r]) : (r = [], n.each(function () {
                    for (var t = e(this), n = t.prop("name") || "files[]", i = (t.prop("files") || [1]).length; i;) r.push(n), i -= 1
                }), r.length || (r = [n.prop("name") || "files[]"])), r
            },
            _initFormSettings: function (t) {
                t.form && t.form.length || (t.form = e(t.fileInput.prop("form")), t.form.length || (t.form = e(this.options.fileInput.prop("form")))), t.paramName = this._getParamName(t), t.url || (t.url = t.form.prop("action") || location.href), t.type = (t.type || "string" === e.type(t.form.prop("method")) && t.form.prop("method") || "").toUpperCase(), "POST" !== t.type && "PUT" !== t.type && "PATCH" !== t.type && (t.type = "POST"), t.formAcceptCharset || (t.formAcceptCharset = t.form.attr("accept-charset"))
            },
            _getAJAXSettings: function (t) {
                var n = e.extend({}, this.options, t);
                return this._initFormSettings(n), this._initDataSettings(n), n
            },
            _getDeferredState: function (e) {
                return e.state ? e.state() : e.isResolved() ? "resolved" : e.isRejected() ? "rejected" : "pending"
            },
            _enhancePromise: function (e) {
                return e.success = e.done, e.error = e.fail, e.complete = e.always, e
            },
            _getXHRPromise: function (t, n, r) {
                var i = e.Deferred(),
                    o = i.promise();
                return n = n || this.options.context || o, t === !0 ? i.resolveWith(n, r) : t === !1 && i.rejectWith(n, r), o.abort = i.promise, this._enhancePromise(o)
            },
            _addConvenienceMethods: function (t, n) {
                var r = this,
                    i = function (t) {
                        return e.Deferred().resolveWith(r, t).promise()
                    };
                n.process = function (t, o) {
                    return (t || o) && (n._processQueue = this._processQueue = (this._processQueue || i([this])).then(function () {
                        return n.errorThrown ? e.Deferred().rejectWith(r, [n]).promise() : i(arguments)
                    }).then(t, o)), this._processQueue || i([this])
                }, n.submit = function () {
                    return "pending" !== this.state() && (n.jqXHR = this.jqXHR = r._trigger("submit", e.Event("submit", {
                        delegatedEvent: t
                    }), this) !== !1 && r._onSend(t, this)), this.jqXHR || r._getXHRPromise()
                }, n.abort = function () {
                    return this.jqXHR ? this.jqXHR.abort() : (this.errorThrown = "abort", r._trigger("fail", null, this), r._getXHRPromise(!1))
                }, n.state = function () {
                    return this.jqXHR ? r._getDeferredState(this.jqXHR) : this._processQueue ? r._getDeferredState(this._processQueue) : void 0
                }, n.processing = function () {
                    return !this.jqXHR && this._processQueue && "pending" === r._getDeferredState(this._processQueue)
                }, n.progress = function () {
                    return this._progress
                }, n.response = function () {
                    return this._response
                }
            },
            _getUploadedBytes: function (e) {
                var t = e.getResponseHeader("Range"),
                    n = t && t.split("-"),
                    r = n && n.length > 1 && parseInt(n[1], 10);
                return r && r + 1
            },
            _chunkedUpload: function (t, n) {
                t.uploadedBytes = t.uploadedBytes || 0;
                var r, i, o = this,
                    a = t.files[0],
                    s = a.size,
                    l = t.uploadedBytes,
                    u = t.maxChunkSize || s,
                    c = this._blobSlice,
                    d = e.Deferred(),
                    f = d.promise();
                return !(!(this._isXHRUpload(t) && c && (l || ("function" === e.type(u) ? u(t) : u) < s)) || t.data) && (!!n || (l >= s ? (a.error = t.i18n("uploadedBytes"), this._getXHRPromise(!1, t.context, [null, "error", a.error])) : (i = function () {
                    var n = e.extend({}, t),
                        f = n._progress.loaded;
                    n.blob = c.call(a, l, l + ("function" === e.type(u) ? u(n) : u), a.type), n.chunkSize = n.blob.size, n.contentRange = "bytes " + l + "-" + (l + n.chunkSize - 1) + "/" + s, o._initXHRData(n), o._initProgressListener(n), r = (o._trigger("chunksend", null, n) !== !1 && e.ajax(n) || o._getXHRPromise(!1, n.context)).done(function (r, a, u) {
                        l = o._getUploadedBytes(u) || l + n.chunkSize, f + n.chunkSize - n._progress.loaded && o._onProgress(e.Event("progress", {
                            lengthComputable: !0,
                            loaded: l - n.uploadedBytes,
                            total: l - n.uploadedBytes
                        }), n), t.uploadedBytes = n.uploadedBytes = l, n.result = r, n.textStatus = a, n.jqXHR = u, o._trigger("chunkdone", null, n), o._trigger("chunkalways", null, n), l < s ? i() : d.resolveWith(n.context, [r, a, u])
                    }).fail(function (e, t, r) {
                        n.jqXHR = e, n.textStatus = t, n.errorThrown = r, o._trigger("chunkfail", null, n), o._trigger("chunkalways", null, n), d.rejectWith(n.context, [e, t, r])
                    })
                }, this._enhancePromise(f), f.abort = function () {
                    return r.abort()
                }, i(), f)))
            },
            _beforeSend: function (e, t) {
                0 === this._active && (this._trigger("start"), this._bitrateTimer = new this._BitrateTimer, this._progress.loaded = this._progress.total = 0, this._progress.bitrate = 0), this._initResponseObject(t), this._initProgressObject(t), t._progress.loaded = t.loaded = t.uploadedBytes || 0, t._progress.total = t.total = this._getTotal(t.files) || 1, t._progress.bitrate = t.bitrate = 0, this._active += 1, this._progress.loaded += t.loaded, this._progress.total += t.total
            },
            _onDone: function (t, n, r, i) {
                var o = i._progress.total,
                    a = i._response;
                i._progress.loaded < o && this._onProgress(e.Event("progress", {
                    lengthComputable: !0,
                    loaded: o,
                    total: o
                }), i), a.result = i.result = t, a.textStatus = i.textStatus = n, a.jqXHR = i.jqXHR = r, this._trigger("done", null, i)
            },
            _onFail: function (e, t, n, r) {
                var i = r._response;
                r.recalculateProgress && (this._progress.loaded -= r._progress.loaded, this._progress.total -= r._progress.total), i.jqXHR = r.jqXHR = e, i.textStatus = r.textStatus = t, i.errorThrown = r.errorThrown = n, this._trigger("fail", null, r)
            },
            _onAlways: function (e, t, n, r) {
                this._trigger("always", null, r)
            },
            _onSend: function (t, n) {
                n.submit || this._addConvenienceMethods(t, n);
                var r, i, o, a, s = this,
                    l = s._getAJAXSettings(n),
                    u = function () {
                        return s._sending += 1, l._bitrateTimer = new s._BitrateTimer, r = r || ((i || s._trigger("send", e.Event("send", {
                            delegatedEvent: t
                        }), l) === !1) && s._getXHRPromise(!1, l.context, i) || s._chunkedUpload(l) || e.ajax(l)).done(function (e, t, n) {
                            s._onDone(e, t, n, l)
                        }).fail(function (e, t, n) {
                            s._onFail(e, t, n, l)
                        }).always(function (e, t, n) {
                            if (s._onAlways(e, t, n, l), s._sending -= 1, s._active -= 1, l.limitConcurrentUploads && l.limitConcurrentUploads > s._sending)
                                for (var r = s._slots.shift(); r;) {
                                    if ("pending" === s._getDeferredState(r)) {
                                        r.resolve();
                                        break
                                    }
                                    r = s._slots.shift();
                                }
                            0 === s._active && s._trigger("stop")
                        })
                    };
                return this._beforeSend(t, l), this.options.sequentialUploads || this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending ? (this.options.limitConcurrentUploads > 1 ? (o = e.Deferred(), this._slots.push(o), a = o.then(u)) : (this._sequence = this._sequence.then(u, u), a = this._sequence), a.abort = function () {
                    return i = [void 0, "abort", "abort"], r ? r.abort() : (o && o.rejectWith(l.context, i), u())
                }, this._enhancePromise(a)) : u()
            },
            _onAdd: function (t, n) {
                var r, i, o, a, s = this,
                    l = !0,
                    u = e.extend({}, this.options, n),
                    c = n.files,
                    d = c.length,
                    f = u.limitMultiFileUploads,
                    p = u.limitMultiFileUploadSize,
                    h = u.limitMultiFileUploadSizeOverhead,
                    g = 0,
                    m = this._getParamName(u),
                    v = 0;
                if (!d) return !1;
                if (p && void 0 === c[0].size && (p = void 0), (u.singleFileUploads || f || p) && this._isXHRUpload(u))
                    if (u.singleFileUploads || p || !f)
                        if (!u.singleFileUploads && p)
                            for (o = [], r = [], a = 0; a < d; a += 1) g += c[a].size + h, (a + 1 === d || g + c[a + 1].size + h > p || f && a + 1 - v >= f) && (o.push(c.slice(v, a + 1)), i = m.slice(v, a + 1), i.length || (i = m), r.push(i), v = a + 1, g = 0);
                        else r = m;
                    else
                        for (o = [], r = [], a = 0; a < d; a += f) o.push(c.slice(a, a + f)), i = m.slice(a, a + f), i.length || (i = m), r.push(i);
                else o = [c], r = [m];
                return n.originalFiles = c, e.each(o || c, function (i, a) {
                    var u = e.extend({}, n);
                    return u.files = o ? a : [a], u.paramName = r[i], s._initResponseObject(u), s._initProgressObject(u), s._addConvenienceMethods(t, u), l = s._trigger("add", e.Event("add", {
                        delegatedEvent: t
                    }), u)
                }), l
            },
            _replaceFileInput: function (t) {
                var n = t.fileInput,
                    r = n.clone(!0),
                    i = n.is(document.activeElement);
                t.fileInputClone = r, e("<form></form>").append(r)[0].reset(), n.after(r).detach(), i && r.focus(), e.cleanData(n.unbind("remove")), this.options.fileInput = this.options.fileInput.map(function (e, t) {
                    return t === n[0] ? r[0] : t
                }), n[0] === this.element[0] && (this.element = r)
            },
            _handleFileTreeEntry: function (t, n) {
                var r, i = this,
                    o = e.Deferred(),
                    a = [],
                    s = function (e) {
                        e && !e.entry && (e.entry = t), o.resolve([e])
                    },
                    l = function (e) {
                        i._handleFileTreeEntries(e, n + t.name + "/").done(function (e) {
                            o.resolve(e)
                        }).fail(s)
                    },
                    u = function () {
                        r.readEntries(function (e) {
                            e.length ? (a = a.concat(e), u()) : l(a)
                        }, s)
                    };
                return n = n || "", t.isFile ? t._file ? (t._file.relativePath = n, o.resolve(t._file)) : t.file(function (e) {
                    e.relativePath = n, o.resolve(e)
                }, s) : t.isDirectory ? (r = t.createReader(), u()) : o.resolve([]), o.promise()
            },
            _handleFileTreeEntries: function (t, n) {
                var r = this;
                return e.when.apply(e, e.map(t, function (e) {
                    return r._handleFileTreeEntry(e, n)
                })).then(function () {
                    return Array.prototype.concat.apply([], arguments)
                })
            },
            _getDroppedFiles: function (t) {
                t = t || {};
                var n = t.items;
                return n && n.length && (n[0].webkitGetAsEntry || n[0].getAsEntry) ? this._handleFileTreeEntries(e.map(n, function (e) {
                    var t;
                    return e.webkitGetAsEntry ? (t = e.webkitGetAsEntry(), t && (t._file = e.getAsFile()), t) : e.getAsEntry()
                })) : e.Deferred().resolve(e.makeArray(t.files)).promise()
            },
            _getSingleFileInputFiles: function (t) {
                t = e(t);
                var n, r, i = t.prop("webkitEntries") || t.prop("entries");
                if (i && i.length) return this._handleFileTreeEntries(i);
                if (n = e.makeArray(t.prop("files")), n.length) void 0 === n[0].name && n[0].fileName && e.each(n, function (e, t) {
                    t.name = t.fileName, t.size = t.fileSize
                });
                else {
                    if (r = t.prop("value"), !r) return e.Deferred().resolve([]).promise();
                    n = [{
                        name: r.replace(/^.*\\/, "")
                    }]
                }
                return e.Deferred().resolve(n).promise()
            },
            _getFileInputFiles: function (t) {
                return t instanceof e && 1 !== t.length ? e.when.apply(e, e.map(t, this._getSingleFileInputFiles)).then(function () {
                    return Array.prototype.concat.apply([], arguments)
                }) : this._getSingleFileInputFiles(t)
            },
            _onChange: function (t) {
                var n = this,
                    r = {
                        fileInput: e(t.target),
                        form: e(t.target.form)
                    };
                this._getFileInputFiles(r.fileInput).always(function (i) {
                    r.files = i, n.options.replaceFileInput && n._replaceFileInput(r), n._trigger("change", e.Event("change", {
                        delegatedEvent: t
                    }), r) !== !1 && n._onAdd(t, r)
                })
            },
            _onPaste: function (t) {
                var n = t.originalEvent && t.originalEvent.clipboardData && t.originalEvent.clipboardData.items,
                    r = {
                        files: []
                    };
                n && n.length && (e.each(n, function (e, t) {
                    var n = t.getAsFile && t.getAsFile();
                    n && r.files.push(n)
                }), this._trigger("paste", e.Event("paste", {
                    delegatedEvent: t
                }), r) !== !1 && this._onAdd(t, r))
            },
            _onDrop: function (t) {
                t.dataTransfer = t.originalEvent && t.originalEvent.dataTransfer;
                var n = this,
                    r = t.dataTransfer,
                    i = {};
                r && r.files && r.files.length && (t.preventDefault(), this._getDroppedFiles(r).always(function (r) {
                    i.files = r, n._trigger("drop", e.Event("drop", {
                        delegatedEvent: t
                    }), i) !== !1 && n._onAdd(t, i)
                }))
            },
            _onDragOver: t("dragover"),
            _onDragEnter: t("dragenter"),
            _onDragLeave: t("dragleave"),
            _initEventHandlers: function () {
                this._isXHRUpload(this.options) && (this._on(this.options.dropZone, {
                    dragover: this._onDragOver,
                    drop: this._onDrop,
                    dragenter: this._onDragEnter,
                    dragleave: this._onDragLeave
                }), this._on(this.options.pasteZone, {
                    paste: this._onPaste
                })), e.support.fileInput && this._on(this.options.fileInput, {
                    change: this._onChange
                })
            },
            _destroyEventHandlers: function () {
                this._off(this.options.dropZone, "dragenter dragleave dragover drop"), this._off(this.options.pasteZone, "paste"), this._off(this.options.fileInput, "change")
            },
            _destroy: function () {
                this._destroyEventHandlers()
            },
            _setOption: function (t, n) {
                var r = e.inArray(t, this._specialOptions) !== -1;
                r && this._destroyEventHandlers(), this._super(t, n), r && (this._initSpecialOptions(), this._initEventHandlers())
            },
            _initSpecialOptions: function () {
                var t = this.options;
                void 0 === t.fileInput ? t.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]') : t.fileInput instanceof e || (t.fileInput = e(t.fileInput)), t.dropZone instanceof e || (t.dropZone = e(t.dropZone)), t.pasteZone instanceof e || (t.pasteZone = e(t.pasteZone))
            },
            _getRegExp: function (e) {
                var t = e.split("/"),
                    n = t.pop();
                return t.shift(), new RegExp(t.join("/"), n)
            },
            _isRegExpOption: function (t, n) {
                return "url" !== t && "string" === e.type(n) && /^\/.*\/[igm]{0,3}$/.test(n)
            },
            _initDataAttributes: function () {
                var t = this,
                    n = this.options,
                    r = this.element.data();
                e.each(this.element[0].attributes, function (e, i) {
                    var o, a = i.name.toLowerCase();
                    /^data-/.test(a) && (a = a.slice(5).replace(/-[a-z]/g, function (e) {
                        return e.charAt(1).toUpperCase()
                    }), o = r[a], t._isRegExpOption(a, o) && (o = t._getRegExp(o)), n[a] = o)
                })
            },
            _create: function () {
                this._initDataAttributes(), this._initSpecialOptions(), this._slots = [], this._sequence = this._getXHRPromise(!0), this._sending = this._active = 0, this._initProgressObject(this), this._initEventHandlers()
            },
            active: function () {
                return this._active
            },
            progress: function () {
                return this._progress
            },
            add: function (t) {
                var n = this;
                t && !this.options.disabled && (t.fileInput && !t.files ? this._getFileInputFiles(t.fileInput).always(function (e) {
                    t.files = e, n._onAdd(null, t)
                }) : (t.files = e.makeArray(t.files), this._onAdd(null, t)))
            },
            send: function (t) {
                if (t && !this.options.disabled) {
                    if (t.fileInput && !t.files) {
                        var n, r, i = this,
                            o = e.Deferred(),
                            a = o.promise();
                        return a.abort = function () {
                            return r = !0, n ? n.abort() : (o.reject(null, "abort", "abort"), a)
                        }, this._getFileInputFiles(t.fileInput).always(function (e) {
                            if (!r) {
                                if (!e.length) return void o.reject();
                                t.files = e, n = i._onSend(null, t), n.then(function (e, t, n) {
                                    o.resolve(e, t, n)
                                }, function (e, t, n) {
                                    o.reject(e, t, n)
                                })
                            }
                        }), this._enhancePromise(a)
                    }
                    if (t.files = e.makeArray(t.files), t.files.length) return this._onSend(null, t)
                }
                return this._getXHRPromise(!1, t && t.context)
            }
        })
    }), $(document).on("click", "a.disabled, button.disabled, .button.disabled", function (e) {
        return e.stopImmediatePropagation(), !1
    }), $(document).ready(function () {
        $.ajaxSetup({
            async: !0,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            }
        });
        var e = $("body").data("url");
        if ($('nav a[href$="/' + e + '"]').addClass("here").parents("li").find("a").eq(0).addClass("here"), $(".rating input[type=radio]:checked").parents("span").addClass("selected"), $("tr.loader").each(function () {
            var e = $(this),
                t = e.data("url");
            e.load(t)
        }), "undefined" != typeof ga && $("#parts details")[0] && $(document).on("click", "#parts details", function () {
            var e = $(this),
                t = e.data("eventcount"),
                n = e.parents("tr").attr("class"),
                r = e.parents("td").siblings(".label").data("labelid");
            t || (t = 0), t++, t > 2 || (e.data("eventcount", t), e.is("[open]") ? ga("send", "event", "Details", "Close diagram label", n + ", Label: " + r) : ga("send", "event", "Details", "Open diagram label", n + ", Label: " + r))
        }), $(".fileupload").each(function () {
            $(this).fileupload({
                dataType: "json",
                dropZone: $(this).parents(".uploadbox").eq(0),
                submit: function (e, t) {
                    $(this).parent().addClass("loading")
                },
                done: function (e, t) {
                    if (void 0 != t.result)
                        if (1 == t.result.status) $(t.result.targetappend).append(t.result.html), $(t.result.targetappend).find("li").not(":has(a)").remove(), $(t.result.targetappend).animate({
                            scrollTop: $(t.result.targetappend).children().last().offset().top
                        }, 500);
                        else if (void 0 != t.result.message) {
                            var n = "";
                            $(t.result.message).each(function (e, t) {
                                n += t.file + ", "
                            }), AlertBox(n)
                        }
                    $(this).parent().removeClass("loading")
                },
                fail: function (e, t) {
                    AlertBox("Something went wrong with the upload. Please try again")
                }
            })
        }), "undefined" != typeof price_refresh_urls && price_refresh_urls.refresh instanceof Array && price_refresh_urls.refresh.length > 0) {
            var t = {};
            $.each(price_refresh_urls.refresh, function (e, n) {
                "undefined" != typeof price_refresh_urls.urls[n] && (t[n] = price_refresh_urls.urls[n])
            });
            var n = $($("#refresh_prices").data("target"));
            "undefined" != typeof ga && ga("send", "event", "Links", "Refresh Prices"), RefreshPrices(n, t)
        }
        if (bindReady(), $("#triggerYoutubeEmbed")[0]) {
            var r = $("#triggerYoutubeEmbed"),
                i = AjaxGet(r.data("url"), r, 3, void 0, !0);
            i.fail(function () {
                r.remove()
            })
        }
    }), $(document).on("click", ".rating span.selectable", function () {
        $(".rating span.selectable").removeClass("selected"), $(this).addClass("selected"), $(this).find("input").prop("checked", "checked")
    }), $(document).on("click", ".message, .message-error", function () {
        var e = $(this);
        e.fadeOut(function () {
            e.remove()
        })
    }), $(document).on("focus click", ".forceselect", function () {
        $(this).select()
    }), $(document).on("click", ".toggle-details", function (e) {
        e.stopPropagation();
        var t = $(this),
            n = t.data("filter"),
            r = $("details");
        return void 0 !== n && (r = $("details." + n)), r.not("[open]")[0] ? r.attr("open", "") : r.removeAttr("open"), !1
    }), $(document).on("change", ".toggle-rows", function () {
        var e = $(this),
            t = $(e.data('target'));
        "hidden" == e.data("state") ? (t.find(".purchased").removeClass("hidden"), e.data("state", "visible")) : (t.find(".purchased").addClass("hidden"), e.data("state", "hidden"))
    }), $(document).on("click", ".showmore", function () {
        var e = $(this),
            t = e.parents("table").eq(0);
        "hidden" == e.data("state") ? (t.find(".hidden").removeClass("hidden"), e.data("state", "visible").text(e.data("hidetext"))) : (t.get(0).scrollIntoView({
            block: "start",
            behavior: "smooth"
        }), t.find(".hideable").addClass("hidden"), e.data("state", "hidden").text(e.data("showtext")))
    }), $(document).on("click", ".vin-example span", function () {
        var e = $(this).index();
        $(".vin-example span").removeClass("selected"), $(".vin-example .details li").hide(), $(".vin-example .details li").eq(e).show(), $(this).addClass("selected")
    }), $(document).on("click", ".hideme", function () {
        $(this).addClass("hidden")
    }), $(document).on("click", "#refresh_prices", function () {
        var e = $($(this).data("target"));
        return "undefined" != typeof ga && ga("send", "event", "Links", "Refresh Prices - Manual"), RefreshPrices(e), !1
    });
var imageevent = function () {
    if ("undefined" != typeof ga) {
        var e = this.$currentTarget.find("img");
        ga("send", "event", "Image", "Open larger image", e.attr("alt") + ", " + e.attr("src").split("/").pop())
    }
},
    popupevent = function () {
        "undefined" != typeof ga && ga("send", "event", "Button", this.$currentTarget.text())
    };
$(document).ready(function () {
    $(".lightbox").featherlightGallery({
        previousIcon: "«",
        nextIcon: "»",
        galleryFadeIn: 100,
        openSpeed: 100,
        afterOpen: imageevent,
        contentFilters: ["image"]
    }), bindPopups()
}), $(document).on("click", "button.ajax, input.ajax", function () {
    var e = $(this).parents("form");
    return AjaxPost(e), !1
}), $(document).on("click", ".cloner", function () {
    var e = $(this),
        t = $(e.data("target")),
        n = t.clone(),
        r = e.data("newValue");
    return void 0 === r && (r = 0), n.removeClass("hidden").removeAttr("id").find("input, select").val("").removeAttr("disabled").each(function () {
        this.name = this.name.replace(/\[\]/, "[" + r + "]")
    }), e.data("newValue", r + 1), t.parent().append(n), !1
}), $(document).on("click", ".show-connection", function () {
    var e = $(this),
        t = e.parents(".connector-view"),
        n = e.parents("form"),
        r = e.hasClass("move-left") ? 1 : 2;
    1 == r && e.parents("table").prev("table")[0] ? (r = 3, t = e.parents("table").prev("table")) : 2 == r && e.parents("table").next("table")[0] && (r = 3, t = e.parents("table").next("table"));
    var i = AjaxPost(n, t, "", r);
    return i.done(function () {
        n.parents(".connector-view").addClass("scroll")
    }), !1
}), $(document).on("click", ".removeparent", function () {
    return $(this).parent().remove(), !1
}), $(document).on("keypress", ".disable-interaction", function (e) {
    if (9 != e.keyCode) return e.returnValue = !1, !1
}), $(document).on("click", ".popup.parent-forms", function () {
    var e = $(this),
        t = e.parents("form"),
        n = t.serialize(),
        r = AjaxGet(t.attr("action"), e, 4, n);
    return r.done(function () {
        $.featherlight($(), {
            openSpeed: 100,
            variant: "popup",
            afterOpen: popupevent,
            contentFilters: ["html"],
            html: r.responseText
        })
    }), !1
}), $(document).on("click", ".ajaxreplace", function () {
    var e = $($(this).data("target")),
        t = $(this).parents("form"),
        n = e.html();
    $(this).data("scroll") && e.get(0).scrollIntoView(), e.html("").addClass("loading-spinner loading-spinner-central");
    var r = AjaxPost(t, e);
    return r.fail(function () {
        e.html(n)
    }), r.always(function () {
        e.removeClass("loading-spinner loading-spinner-central"), bindReady()
    }), !1
}), $(document).on("click", ".ajaxtoggle", function () {
    var e = $(this).parents("form"),
        t = e.html(),
        n = AjaxPost(e);
    n.fail(function () {
        e.html(t)
    })
}), $(document).on("click", ".confirm", function () {
    var e = $(this).data("confirm");
    return "undefined" == typeof e && (e = "Are you sure?"), confirm(e)
}), $(document).on("change", ".changesubmit", function () {
    $(this).parents("form").submit()
}), $(document).on("change", ".pickable .mainCheckbox", function () {
    DoMainCheckbox($(this))
}), $(document).on("change", ".pickable td:first-child input[type=checkbox]", function () {
    DoSingleCheckbox($(this))
}), $(document).on("change", "#excludevatbutton", function (e) {
    var t = $($(this).data("target")),
        n = $(this).parents("form"),
        r = RefreshCurrencyVAT(e, n, t);
    return r.always(function () {
        "undefined" != typeof ga && ga("send", "event", "Button", "Switch VAT")
    }), !1
}), $(document).on("change", "#currencyexchange", function (e) {
    var t = $($(this).data("target")),
        n = $(this).parents("form"),
        r = RefreshCurrencyVAT(e, n, t);
    return r.always(function () {
        "undefined" != typeof ga && ga("send", "event", "Select", "Switch Currency")
    }), !1
}), $(document).on("click", ".comment-reply-link, .comment-add-link, .notes-add-link", function (e) {
    var t = $($(this).data("target"));
    if ("" !== t.html()) t.find("textarea").val() || t.html("");
    else {
        t.addClass("loading-spinner");
        var n = $(this).attr("href"),
            r = AjaxGet(n, t, 3);
        r.done(function () {
            t.find("textarea").focus()
        }), r.always(function () {
            t.removeClass("loading-spinner")
        })
    }
    return !1
}), $(document).on("click", ".save-comment", function (e) {
    var t = $(this),
        n = t.parents("form").parent();
    if (t.hasClass("reverse")) var r = n.next(),
        i = 1;
    else var r = n.prev(),
        i = 2;
    n.addClass("loading-spinner");
    var o = AjaxPost(t.parents("form"), r, null, i);
    return o.done(function () {
        n.html("")
    }), o.always(function () {
        n.removeClass("loading-spinner")
    }), !1
}), $(document).on("click", ".delete-comment", function (e) {
    var t = $($(this).data("target")),
        n = AjaxPost($(this).parents("form"), t, $(this).data("confirm")),
        r = $(this).parents("form").parent();
    return r.addClass("loading-spinner"), n !== !1 ? (n.done(function () {
        t.remove()
    }), n.always(function () {
        r.removeClass("loading-spinner")
    })) : r.removeClass("loading-spinner"), !1
});
var clicked = !1,
    clickY, clickX;
$(document).on({
    mousemove: function (e) {
        clicked && updateScrollPos(e, $(this))
    },
    mousedown: function (e) {
        e.preventDefault(), clicked = !0, clickY = e.pageY, clickX = e.pageX
    },
    mouseup: function () {
        clicked = !1, $("html").css("cursor", "auto")
    }
}, ".scrollbox");
var getCellValue = function (e, t) {
    return e.children[t].dataset.sortvalue || e.children[t].innerText || e.children[t].textContent
},
    comparer = function (e, t) {
        return function (n, r) {
            return function (e, t) {
                return "" === e || "" === t || isNaN(e) || isNaN(t) ? e.toString().localeCompare(t) : e - t
            }(getCellValue(t ? n : r, e), getCellValue(t ? r : n, e))
        }
    },
    sortTable = function (e, t, n) {
        e instanceof jQuery && (e = e.get(0));
        for (var r = e.parentNode;
            "TABLE" != r.tagName.toUpperCase();) r = r.parentNode;
        var i = r.querySelector("tbody"),
            o = i.querySelectorAll("tr"),
            a = Array.prototype.slice.call(e.parentNode.children).indexOf(e);
        n && (t = this.asc = !this.asc, localStorage.setItem("sort-" + r.id, JSON.stringify({
            col: a,
            asc: t
        }))), r.querySelectorAll("th").forEach(function (e) {
            e.querySelector("i") && (e.querySelector("i").classList.remove("fa-sort-up"), e.querySelector("i").classList.remove("fa-sort-down"), e.querySelector("i").classList.add("fa-sort"))
        }), e.querySelector("i") && (t ? (e.querySelector("i").classList.add("fa-sort-up"), e.querySelector("i").classList.remove("fa-sort", "fa-sort-down")) : (e.querySelector("i").classList.add("fa-sort-down"), e.querySelector("i").classList.remove("sa-sort", "fa-sort-up"))), Array.prototype.slice.call(o).sort(comparer(a, t)).forEach(function (e) {
            i.appendChild(e)
        })
    };
$(document).ready(function () {
    if (document.querySelector("table.sortable")) {
        var e = localStorage.getItem("sort-" + document.querySelector("table.sortable").id);
        e && (e = JSON.parse(e), sortTable(document.querySelector("table.sortable thead tr").children[e.col], e.asc, !1))
    }
    $(document).on("click", "table.sortable th", function () {
        return sortTable($(this), null, !0), !1
    })
}),
    function (e) {
        e.fn.menumaker = function (t) {
            var n = e(this),
                r = e.extend({
                    title: "Menu",
                    format: "dropdown",
                    sticky: !1
                }, t);
            return this.each(function () {
                n.prepend('<div id="menu-button">' + r.title + "</div>"), e(this).find("#menu-button").on("click", function () {
                    e(this).toggleClass("menu-opened");
                    var t = e(this).next("ul");
                    t.hasClass("open") ? t.hide().removeClass("open") : (t.show().addClass("open"), "dropdown" === r.format && t.find("ul").show())
                }), n.find("li ul").parent().addClass("has-sub"), multiTg = function () {
                    n.find(".has-sub").prepend('<span class="submenu-button"></span>'), n.find(".submenu-button").on("click", function () {
                        e(this).toggleClass("submenu-opened"), e(this).siblings("ul").hasClass("open") ? e(this).siblings("ul").removeClass("open").hide() : e(this).siblings("ul").addClass("open").show()
                    })
                }, "multitoggle" === r.format ? multiTg() : n.addClass("dropdown"), r.sticky === !0 && n.css("position", "fixed")
            })
        }
    }(jQuery),
    function (e) {
        e(document).ready(function () {
            e("#cssmenu").menumaker({
                title: "Menu",
                format: "multitoggle"
            })
        })
    }(jQuery);
var hashtag = location.hash.replace("#", ""),
    $page = $("html, body");
$(document).ready(function () {
    $(".no-csspositionsticky .sticky").sticky({
        topSpacing: 20
    }), $("#image img")[0] && (preselectDiagramLabel(), $(window).on("resize", function () {
        clearTimeout(window.resizedFinished), window.resizedFinished = setTimeout(function () {
            repositionDiagramLabels()
        }, 250)
    }))
}), $(document).on("click", ".label", function () {
    var e = $(this);
    return e.is(".permanent") ? void ("undefined" != typeof ga && ga("send", "event", "Wiring Looms", "Select label, in image", $("h1").text() + ", Label: " + e.data("labelid"))) : e.is(".selected") ? (UnHighlightLabel(e), !1) : ("undefined" != typeof ga && (e.parents("#image")[0] ? ga("send", "event", "Diagrams", "Find label, on diagram", $("h1").text() + ", Label: " + e.data("labelid")) : ga("send", "event", "Diagrams", "Find label, in table", $("h1").text() + ", Label: " + e.data("labelid"))), void HighlightLabel(e, !1))
}), $("#image img").one("load", function () {
    repositionDiagramLabels()
}).each(function () {
    this.complete && $(this).trigger("load")
}), $(document).on({
    mouseenter: function () {
        $($(this).data("target")).addClass("high-super")
    },
    mouseleave: function () {
        $($(this).data("target")).removeClass("high-super")
    }
}, ".superceded"), $(document).on("click", ".superceded", function () {
    var e = $($(this).data("target"));
    e.hasClass("high-super-perm") ? e.removeClass("high-super-perm") : e.addClass("high-super-perm")
}), $page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
    $page.stop()
}),
    function (e) {
        var t = {
            topSpacing: 0,
            bottomSpacing: 0,
            className: "is-sticky",
            wrapperClassName: "sticky-wrapper",
            center: !1,
            getWidthFrom: ""
        },
            n = e(window),
            r = e(document),
            i = [],
            o = n.height(),
            a = function () {
                for (var t = n.scrollTop(), a = r.height(), s = a - o, l = t > s ? s - t : 0, u = 0; u < i.length; u++) {
                    var c = i[u],
                        d = c.stickyWrapper.offset().top,
                        f = d - c.topSpacing - l;
                    if (t <= f) null !== c.currentTop && (c.stickyElement.css("position", "").css("top", ""), c.stickyElement.parent().removeClass(c.className), c.currentTop = null);
                    else {
                        var p = a - c.stickyElement.outerHeight() - c.topSpacing - c.bottomSpacing - t - l;
                        p < 0 ? p += c.topSpacing : p = c.topSpacing, c.currentTop != p && (c.stickyElement.css("position", "fixed").css("top", p), "undefined" != typeof c.getWidthFrom && c.stickyElement.css("width", e(c.getWidthFrom).width()), c.stickyElement.parent().addClass(c.className), c.currentTop = p)
                    }
                }
            },
            s = function () {
                o = n.height()
            },
            l = {
                init: function (n) {
                    var r = e.extend(t, n);
                    return this.each(function () {
                        var t = e(this);
                        stickyId = t.attr("id"), wrapper = e("<div></div>").attr("id", stickyId + "-sticky-wrapper").addClass(r.wrapperClassName), t.wrapAll(wrapper), r.center && t.parent().css({
                            width: t.outerWidth(),
                            marginLeft: "auto",
                            marginRight: "auto"
                        }), "right" == t.css("float") && t.css({
                            "float": "none"
                        }).parent().css({
                            "float": "right"
                        });
                        var n = t.parent();
                        n.css("height", t.outerHeight()), i.push({
                            topSpacing: r.topSpacing,
                            bottomSpacing: r.bottomSpacing,
                            stickyElement: t,
                            currentTop: null,
                            stickyWrapper: n,
                            className: r.className,
                            getWidthFrom: r.getWidthFrom
                        })
                    })
                },
                update: a
            };
        window.addEventListener ? (window.addEventListener("scroll", a, !1), window.addEventListener("resize", s, !1)) : window.attachEvent && (window.attachEvent("onscroll", a), window.attachEvent("onresize", s)), e.fn.sticky = function (t) {
            return l[t] ? l[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist on jQuery.sticky") : l.init.apply(this, arguments)
        }, e(function () {
            setTimeout(a, 0)
        })
    }(jQuery), ! function (e) {
        "use strict";

        function t(e, n) {
            if (!(this instanceof t)) {
                var r = new t(e, n);
                return r.open(), r
            }
            this.id = t.id++, this.setup(e, n), this.chainCallbacks(t._callbackChain)
        }

        function n(e, t) {
            var n = {};
            for (var r in e) r in t && (n[r] = e[r], delete e[r]);
            return n
        }

        function r(e, t) {
            var n = {},
                r = new RegExp("^" + t + "([A-Z])(.*)");
            for (var i in e) {
                var o = i.match(r);
                if (o) {
                    var a = (o[1] + o[2].replace(/([A-Z])/g, "-$1")).toLowerCase();
                    n[a] = e[i]
                }
            }
            return n
        }
        if ("undefined" == typeof e) return void ("console" in window && window.console.info("Too much lightness, Featherlight needs jQuery."));
        if (e.fn.jquery.match(/-ajax/)) return void ("console" in window && window.console.info("Featherlight needs regular jQuery, not the slim version."));
        var i = [],
            o = function (t) {
                return i = e.grep(i, function (e) {
                    return e !== t && e.$instance.closest("body").length > 0
                })
            },
            a = {
                allow: 1,
                allowfullscreen: 1,
                frameborder: 1,
                height: 1,
                longdesc: 1,
                marginheight: 1,
                marginwidth: 1,
                mozallowfullscreen: 1,
                name: 1,
                referrerpolicy: 1,
                sandbox: 1,
                scrolling: 1,
                src: 1,
                srcdoc: 1,
                style: 1,
                webkitallowfullscreen: 1,
                width: 1
            },
            s = {
                keyup: "onKeyUp",
                resize: "onResize"
            },
            l = function (n) {
                e.each(t.opened().reverse(), function () {
                    return n.isDefaultPrevented() || !1 !== this[s[n.type]](n) ? void 0 : (n.preventDefault(), n.stopPropagation(), !1)
                })
            },
            u = function (n) {
                if (n !== t._globalHandlerInstalled) {
                    t._globalHandlerInstalled = n;
                    var r = e.map(s, function (e, n) {
                        return n + "." + t.prototype.namespace
                    }).join(" ");
                    e(window)[n ? "on" : "off"](r, l)
                }
            };
        t.prototype = {
            constructor: t,
            namespace: "featherlight",
            targetAttr: "data-featherlight",
            variant: null,
            resetCss: !1,
            background: null,
            openTrigger: "click",
            closeTrigger: "click",
            filter: null,
            root: "body",
            openSpeed: 250,
            closeSpeed: 250,
            closeOnClick: "background",
            closeOnEsc: !0,
            closeIcon: "&#10005;",
            loading: "",
            persist: !1,
            otherClose: null,
            beforeOpen: e.noop,
            beforeContent: e.noop,
            beforeClose: e.noop,
            afterOpen: e.noop,
            afterContent: e.noop,
            afterClose: e.noop,
            onKeyUp: e.noop,
            onResize: e.noop,
            type: null,
            contentFilters: ["jquery", "image", "html", "ajax", "iframe", "text"],
            setup: function (t, n) {
                "object" != typeof t || t instanceof e != 0 || n || (n = t, t = void 0);
                var r = e.extend(this, n, {
                    target: t
                }),
                    i = r.resetCss ? r.namespace + "-reset" : r.namespace,
                    o = e(r.background || ['<div class="' + i + "-loading " + i + '">', '<div class="' + i + '-content">', '<button class="' + i + "-close-icon " + r.namespace + '-close" aria-label="Close">', r.closeIcon, "</button>", '<div class="' + r.namespace + '-inner">' + r.loading + "</div>", "</div>", "</div>"].join("")),
                    a = "." + r.namespace + "-close" + (r.otherClose ? "," + r.otherClose : "");
                return r.$instance = o.clone().addClass(r.variant), r.$instance.on(r.closeTrigger + "." + r.namespace, function (t) {
                    if (!t.isDefaultPrevented()) {
                        var n = e(t.target);
                        ("background" === r.closeOnClick && n.is("." + r.namespace) || "anywhere" === r.closeOnClick || n.closest(a).length) && (r.close(t), t.preventDefault())
                    }
                }), this
            },
            getContent: function () {
                if (this.persist !== !1 && this.$content) return this.$content;
                var t = this,
                    n = this.constructor.contentFilters,
                    r = function (e) {
                        return t.$currentTarget && t.$currentTarget.attr(e)
                    },
                    i = r(t.targetAttr),
                    o = t.target || i || "",
                    a = n[t.type];
                if (!a && o in n && (a = n[o], o = t.target && i), o = o || r("href") || "", !a)
                    for (var s in n) t[s] && (a = n[s], o = t[s]);
                if (!a) {
                    var l = o;
                    if (o = null, e.each(t.contentFilters, function () {
                        return a = n[this], a.test && (o = a.test(l)), !o && a.regex && l.match && l.match(a.regex) && (o = l), !o
                    }), !o) return "console" in window && window.console.error("Featherlight: no content filter found " + (l ? ' for "' + l + '"' : " (no target specified)")), !1
                }
                return a.process.call(t, o)
            },
            setContent: function (t) {
                return this.$instance.removeClass(this.namespace + "-loading"), this.$instance.toggleClass(this.namespace + "-iframe", t.is("iframe")), this.$instance.find("." + this.namespace + "-inner").not(t).slice(1).remove().end().replaceWith(e.contains(this.$instance[0], t[0]) ? "" : t), this.$content = t.addClass(this.namespace + "-inner"), this
            },
            open: function (t) {
                var n = this;
                if (n.$instance.hide().appendTo(n.root), !(t && t.isDefaultPrevented() || n.beforeOpen(t) === !1)) {
                    t && t.preventDefault();
                    var r = n.getContent();
                    if (r) return i.push(n), u(!0), n.$instance.fadeIn(n.openSpeed), n.beforeContent(t), e.when(r).always(function (e) {
                        n.setContent(e), n.afterContent(t)
                    }).then(n.$instance.promise()).done(function () {
                        n.afterOpen(t)
                    })
                }
                return n.$instance.detach(), e.Deferred().reject().promise()
            },
            close: function (t) {
                var n = this,
                    r = e.Deferred();
                return n.beforeClose(t) === !1 ? r.reject() : (0 === o(n).length && u(!1), n.$instance.fadeOut(n.closeSpeed, function () {
                    n.$instance.detach(), n.afterClose(t), r.resolve()
                })), r.promise()
            },
            resize: function (e, t) {
                if (e && t) {
                    this.$content.css("width", "").css("height", "");
                    var n = Math.max(e / (this.$content.parent().width() - 1), t / (this.$content.parent().height() - 1));
                    n > 1 && (n = t / Math.floor(t / n), this.$content.css("width", "" + e / n + "px").css("height", "" + t / n + "px"))
                }
            },
            chainCallbacks: function (t) {
                for (var n in t) this[n] = e.proxy(t[n], this, e.proxy(this[n], this))
            }
        }, e.extend(t, {
            id: 0,
            autoBind: "[data-featherlight]",
            defaults: t.prototype,
            contentFilters: {
                jquery: {
                    regex: /^[#.]\w/,
                    test: function (t) {
                        return t instanceof e && t
                    },
                    process: function (t) {
                        return this.persist !== !1 ? e(t) : e(t).clone(!0)
                    }
                },
                image: {
                    regex: /\.(png|jpg|jpeg|gif|tiff?|bmp|svg)(\?\S*)?$/i,
                    process: function (t) {
                        var n = this,
                            r = e.Deferred(),
                            i = new Image,
                            o = e('<img src="' + t + '" alt="" class="' + n.namespace + '-image" />');
                        return i.onload = function () {
                            o.naturalWidth = i.width, o.naturalHeight = i.height, r.resolve(o)
                        }, i.onerror = function () {
                            r.reject(o)
                        }, i.src = t, r.promise()
                    }
                },
                html: {
                    regex: /^\s*<[\w!][^<]*>/,
                    process: function (t) {
                        return e(t)
                    }
                },
                ajax: {
                    regex: /./,
                    process: function (t) {
                        var n = e.Deferred(),
                            r = e("<div></div>").load(t, function (e, t) {
                                "error" !== t && n.resolve(r.contents()), n.fail()
                            });
                        return n.promise()
                    }
                },
                iframe: {
                    process: function (t) {
                        var i = new e.Deferred,
                            o = e("<iframe/>"),
                            s = r(this, "iframe"),
                            l = n(s, a);
                        return o.hide().attr("src", t).attr(l).css(s).on("load", function () {
                            i.resolve(o.show())
                        }).appendTo(this.$instance.find("." + this.namespace + "-content")), i.promise()
                    }
                },
                text: {
                    process: function (t) {
                        return e("<div>", {
                            text: t
                        })
                    }
                }
            },
            functionAttributes: ["beforeOpen", "afterOpen", "beforeContent", "afterContent", "beforeClose", "afterClose"],
            readElementConfig: function (t, n) {
                var r = this,
                    i = new RegExp("^data-" + n + "-(.*)"),
                    o = {};
                return t && t.attributes && e.each(t.attributes, function () {
                    var t = this.name.match(i);
                    if (t) {
                        var n = this.value,
                            a = e.camelCase(t[1]);
                        if (e.inArray(a, r.functionAttributes) >= 0) n = new Function(n);
                        else try {
                            n = JSON.parse(n)
                        } catch (s) { }
                        o[a] = n
                    }
                }), o
            },
            extend: function (t, n) {
                var r = function () {
                    this.constructor = t
                };
                return r.prototype = this.prototype, t.prototype = new r, t.__super__ = this.prototype, e.extend(t, this, n), t.defaults = t.prototype, t
            },
            attach: function (t, n, r) {
                var i = this;
                "object" != typeof n || n instanceof e != 0 || r || (r = n, n = void 0), r = e.extend({}, r);
                var o, a = r.namespace || i.defaults.namespace,
                    s = e.extend({}, i.defaults, i.readElementConfig(t[0], a), r),
                    l = function (a) {
                        var l = e(a.currentTarget),
                            u = e.extend({
                                $source: t,
                                $currentTarget: l
                            }, i.readElementConfig(t[0], s.namespace), i.readElementConfig(a.currentTarget, s.namespace), r),
                            c = o || l.data("featherlight-persisted") || new i(n, u);
                        "shared" === c.persist ? o = c : c.persist !== !1 && l.data("featherlight-persisted", c), u.$currentTarget.blur && u.$currentTarget.blur(), c.open(a)
                    };
                return t.on(s.openTrigger + "." + s.namespace, s.filter, l), {
                    filter: s.filter,
                    handler: l
                }
            },
            current: function () {
                var e = this.opened();
                return e[e.length - 1] || null
            },
            opened: function () {
                var t = this;
                return o(), e.grep(i, function (e) {
                    return e instanceof t
                })
            },
            close: function (e) {
                var t = this.current();
                return t ? t.close(e) : void 0
            },
            _onReady: function () {
                var t = this;
                if (t.autoBind) {
                    var n = e(t.autoBind);
                    n.each(function () {
                        t.attach(e(this))
                    }), e(document).on("click", t.autoBind, function (r) {
                        if (!r.isDefaultPrevented()) {
                            var i = e(r.currentTarget),
                                o = n.length;
                            if (n = n.add(i), o !== n.length) {
                                var a = t.attach(i);
                                (!a.filter || e(r.target).parentsUntil(i, a.filter).length > 0) && a.handler(r)
                            }
                        }
                    })
                }
            },
            _callbackChain: {
                onKeyUp: function (t, n) {
                    return 27 === n.keyCode ? (this.closeOnEsc && e.featherlight.close(n), !1) : t(n)
                },
                beforeOpen: function (t, n) {
                    return e(document.documentElement).addClass("with-featherlight"), this._previouslyActive = document.activeElement, this._$previouslyTabbable = e("a, input, select, textarea, iframe, button, iframe, [contentEditable=true]").not("[tabindex]").not(this.$instance.find("button")), this._$previouslyWithTabIndex = e("[tabindex]").not('[tabindex="-1"]'), this._previousWithTabIndices = this._$previouslyWithTabIndex.map(function (t, n) {
                        return e(n).attr("tabindex")
                    }), this._$previouslyWithTabIndex.add(this._$previouslyTabbable).attr("tabindex", -1), document.activeElement.blur && document.activeElement.blur(), t(n)
                },
                afterClose: function (n, r) {
                    var i = n(r),
                        o = this;
                    return this._$previouslyTabbable.removeAttr("tabindex"), this._$previouslyWithTabIndex.each(function (t, n) {
                        e(n).attr("tabindex", o._previousWithTabIndices[t])
                    }), this._previouslyActive.focus(), 0 === t.opened().length && e(document.documentElement).removeClass("with-featherlight"), i
                },
                onResize: function (e, t) {
                    return this.resize(this.$content.naturalWidth, this.$content.naturalHeight), e(t)
                },
                afterContent: function (e, t) {
                    var n = e(t);
                    return this.$instance.find("[autofocus]:not([disabled])").focus(), this.onResize(t), n
                }
            }
        }), e.featherlight = t, e.fn.featherlight = function (e, n) {
            return t.attach(this, e, n), this
        }, e(document).ready(function () {
            t._onReady()
        })
    }(jQuery), ! function (e) {
        "use strict";

        function t(n, r) {
            if (!(this instanceof t)) {
                var i = new t(e.extend({
                    $source: n,
                    $currentTarget: n.first()
                }, r));
                return i.open(), i
            }
            e.featherlight.apply(this, arguments), this.chainCallbacks(s)
        }
        var n = function (e) {
            window.console && window.console.warn && window.console.warn("FeatherlightGallery: " + e)
        };
        if ("undefined" == typeof e) return n("Too much lightness, Featherlight needs jQuery.");
        if (!e.featherlight) return n("Load the featherlight plugin before the gallery plugin");
        var r = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch,
            i = e.event && e.event.special.swipeleft && e,
            o = window.Hammer && function (e) {
                var t = new window.Hammer.Manager(e[0]);
                return t.add(new window.Hammer.Swipe), t
            },
            a = r && (i || o);
        r && !a && n("No compatible swipe library detected; one must be included before featherlightGallery for swipe motions to navigate the galleries.");
        var s = {
            afterClose: function (e, t) {
                var n = this;
                return n.$instance.off("next." + n.namespace + " previous." + n.namespace), n._swiper && (n._swiper.off("swipeleft", n._swipeleft).off("swiperight", n._swiperight), n._swiper = null), e(t)
            },
            beforeOpen: function (e, t) {
                var n = this;
                return n.$instance.on("next." + n.namespace + " previous." + n.namespace, function (e) {
                    var t = "next" === e.type ? 1 : -1;
                    n.navigateTo(n.currentNavigation() + t)
                }), a && (n._swiper = a(n.$instance).on("swipeleft", n._swipeleft = function () {
                    n.$instance.trigger("next")
                }).on("swiperight", n._swiperight = function () {
                    n.$instance.trigger("previous")
                }), n.$instance.addClass(this.namespace + "-swipe-aware", a)), n.$instance.find("." + n.namespace + "-content").append(n.createNavigation("previous")).append(n.createNavigation("next")),
                    e(t)
            },
            beforeContent: function (e, t) {
                var n = this.currentNavigation(),
                    r = this.slides().length;
                return this.$instance.toggleClass(this.namespace + "-first-slide", 0 === n).toggleClass(this.namespace + "-last-slide", n === r - 1), e(t)
            },
            onKeyUp: function (e, t) {
                var n = {
                    37: "previous",
                    39: "next"
                }[t.keyCode];
                return n ? (this.$instance.trigger(n), !1) : e(t)
            }
        };
        e.featherlight.extend(t, {
            autoBind: "[data-featherlight-gallery]"
        }), e.extend(t.prototype, {
            previousIcon: "&#9664;",
            nextIcon: "&#9654;",
            galleryFadeIn: 100,
            galleryFadeOut: 300,
            slides: function () {
                return this.filter ? this.$source.find(this.filter) : this.$source
            },
            images: function () {
                return n("images is deprecated, please use slides instead"), this.slides()
            },
            currentNavigation: function () {
                return this.slides().index(this.$currentTarget)
            },
            navigateTo: function (t) {
                var n = this,
                    r = n.slides(),
                    i = r.length,
                    o = n.$instance.find("." + n.namespace + "-inner");
                return t = (t % i + i) % i, n.$currentTarget = r.eq(t), n.beforeContent(), e.when(n.getContent(), o.fadeTo(n.galleryFadeOut, .2)).always(function (e) {
                    n.setContent(e), n.afterContent(), e.fadeTo(n.galleryFadeIn, 1)
                })
            },
            createNavigation: function (t) {
                var n = this;
                return e('<span title="' + t + '" class="' + this.namespace + "-" + t + '"><span>' + this[t + "Icon"] + "</span></span>").click(function (r) {
                    e(this).trigger(t + "." + n.namespace), r.preventDefault()
                })
            }
        }), e.featherlightGallery = t, e.fn.featherlightGallery = function (e) {
            return t.attach(this, e), this
        }, e(document).ready(function () {
            t._onReady()
        })
    }(jQuery);