/* =====================================================================
   იმერეთი ტური · ანიმაციები, 3D ეფექტები და რეკლამა (js/fx.js)
   იტვირთება script.js-ის შემდეგ და იყენებს მის ცვლადებს (T, L, S, SC, BASE, $, esc).

    1. საერთო: ჩატვირთვის ეკრანი, ფარდა გვერდებს შორის, სქროლის ზოლი
    2. მოგზაურობა (მთავარი ეკრანი): ქალაქების „ფანჯრები“ სქროლისას
    3. მოძრავი ქალაქების ზოლი, „ფანჯრების“ ჰორიზონტალური გალერეა
    4. რიცხვები, 3D დახრა მაუსით, მაგნიტური ღილაკები
    5. გვერდების ანიმაციები: ავტობუსების კარუსელი, განრიგის დაფა,
       ამანათის ყუთი, პირობების ბარათები, კითხვები
    6. რეკლამა (პარტნიორები): მთავარ გვერდზე და შიდა გვერდების ბოლოს
    7. ერთი საერთო ციკლი (requestAnimationFrame), რომელიც ყველაფერს ამოძრავებს

   3D სცენები (ავტობუსი, მთები, გზა) ცალკე ფაილშია: js/scene.js
   ===================================================================== */
(function () {
    "use strict";
    var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
    var html = document.documentElement;
    html.classList.add("fx");
    if (RM) html.classList.add("rm");
    var all = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    var VH = innerHeight, VW = innerWidth;

    // ==================================================================
    // 1. ჩატვირთვის ეკრანი და ფარდა
    // პირველ შესვლაზე ჩანს ლოგო და მოძრავი ავტობუსი, შემდეგ გვერდებზე მხოლოდ ფარდა იხსნება.
    // ==================================================================
    var pre = $("pre"), seen = false;
    try { seen = sessionStorage.getItem("it-seen"); } catch (e) { }
    function open() {
        if (!pre || pre.classList.contains("out")) return;
        pre.classList.add("out");
        html.classList.add("ready");
        try { sessionStorage.setItem("it-seen", "1"); } catch (e) { }
        setTimeout(function () { pre.hidden = true; }, 1000);
    }
    if (seen || RM) { if (pre) pre.classList.add("fast"); requestAnimationFrame(open); }
    else {
        addEventListener("load", function () { setTimeout(open, 700); });
        setTimeout(open, 2600);
    }
    // შიდა ბმულზე დაჭერისას ფარდა იხურება და მერე იხსნება ახალი გვერდი.
    var curtain = $("curtain");
    document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest("a[href]");
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || RM) return;
        if ((a.target && a.target != "_self") || a.hasAttribute("download")) return;
        var u = new URL(a.href, location.href);
        if (u.origin != location.origin || u.pathname == location.pathname || u.protocol.indexOf("http") != 0) return;
        e.preventDefault();
        curtain.classList.add("go");
        setTimeout(function () { location.href = a.href; }, 560);
    });
    addEventListener("pageshow", function (e) {
        curtain.classList.remove("go");
        if (e.persisted && pre) pre.hidden = true;
    });

    // ==================================================================
    // 2. მოგზაურობა: ქალაქების ფანჯრები (ყოველ გაჩერებაზე თავისი ბარათი)
    // STOPS: სად ჩანს თითო ქალაქი სქროლის 0..1 მონაკვეთზე (scene.js იგივეს იყენებს).
    // ==================================================================
    var STOPS = window.TRIP_STOPS = [0.08, 0.2, 0.32, 0.46, 0.6, 0.76, 0.93];
    window.TRIP_P = 0;
    var trip = $("trip"), heroT = $("heroT"), hint = $("hint"), chap = $("chap"), trail = $("trail");
    function chapRender() {
        if (!chap) return;
        var k = T[L], items = S.map(function (s, i) {
            return { n: s[1][L], t: s[0], x: k["j" + i] };
        });
        items.push({ n: k.jL, t: "", x: k.jLt });
        items.push({ n: k.cMo, t: SC.ruTime || "", x: k.jMt });
        chap.innerHTML = items.map(function (c, i) {
            return '<article class="cw" data-side="' + (i % 2 ? "r" : "l") + '"><div class="cw-in"><small><i>' + String(i + 1).padStart(2, "0") + "</i>" + (i < S.length ? k.stp + (c.t ? " · " + c.t : "") : k.trk) + "</small><b>" + esc(c.n) + "</b><p>" + esc(c.x || "") + "</p></div></article>";
        }).join("");
        trail.querySelectorAll(".tdot").forEach(function (d) { d.remove(); });
        STOPS.forEach(function (p, i) {
            var d = document.createElement("i");
            d.className = "tdot";
            d.style.left = p * 100 + "%";
            d.title = items[i].n;
            trail.appendChild(d);
        });
        lastChap = -2;
    }
    var lastChap = -2;
    function tripTick() {
        if (!trip || $("p-home").hidden) return;
        var r = trip.getBoundingClientRect();
        if (r.bottom < 0 || r.top > VH) return;
        var p = clamp(-r.top / (trip.offsetHeight - VH), 0, 1);
        window.TRIP_P = p;
        trip.style.setProperty("--p", p.toFixed(4));
        var h = clamp(1 - p * 14, 0, 1);
        heroT.style.opacity = h;
        heroT.style.transform = "translateY(" + (-(1 - h) * 60) + "px) scale(" + (0.94 + h * 0.06) + ")";
        heroT.style.pointerEvents = h < 0.3 ? "none" : "";
        hint.style.opacity = clamp(1 - p * 30, 0, 1);
        var act = -1, best = 0.07;
        STOPS.forEach(function (s, i) {
            if (Math.abs(p - s) < best) { best = Math.abs(p - s); act = i; }
        });
        if (p > 0.97) act = STOPS.length - 1;
        if (act != lastChap) {
            lastChap = act;
            all(".cw", chap).forEach(function (c, i) {
                c.classList.toggle("on", i == act);
                c.classList.toggle("past", i < act);
            });
            all(".tdot", trail).forEach(function (d, i) { d.classList.toggle("on", i <= act); });
        }
        trail.style.setProperty("--p", p.toFixed(4));
    }

    // ==================================================================
    // 3. ქალაქების ზოლი და „ფანჯრები“ (ჰორიზონტალური სქროლი)
    // ==================================================================
    var marq = $("marq"), mx = 0, lastY = scrollY, vel = 0;
    function marqRender() {
        if (!marq) return;
        var k = T[L], n = S.map(function (s) { return s[1][L]; }).concat([k.jL, k.cMo]);
        var one = n.map(function (c) { return "<span>" + esc(c) + "</span><i>✦</i>"; }).join("");
        marq.innerHTML = "<div>" + one + one + "</div><div>" + one + one + "</div>";
    }
    var hs = $("hs"), hstr = $("hstr"), hsExtra = 0;
    function hsSize() {
        if (!hs || RM) return;
        hstr.style.transform = "";
        hsExtra = Math.max(0, hstr.scrollWidth - VW);
        hs.style.height = (VH + hsExtra * 1.1) + "px";
    }
    function hsTick() {
        if (!hs || RM || $("p-home").hidden) return;
        var r = hs.getBoundingClientRect();
        if (r.bottom < 0 || r.top > VH) return;
        var p = clamp(-r.top / (hs.offsetHeight - VH || 1), 0, 1);
        hstr.style.transform = "translate3d(" + (-p * hsExtra).toFixed(1) + "px,0,0)";
        all(".win", hstr).forEach(function (w) {
            var b = w.getBoundingClientRect(), c = clamp((b.left + b.width / 2 - VW / 2) / VW, -1.2, 1.2);
            w.style.transform = "perspective(1200px) rotateY(" + (c * -28).toFixed(2) + "deg) translateZ(" + (-Math.abs(c) * 120).toFixed(1) + "px)";
            w.firstChild.firstChild.style.transform = "translate3d(" + (c * -14).toFixed(2) + "%,0,0) scale(1.3)";
            w.style.opacity = (1 - Math.min(0.55, Math.abs(c) * 0.5)).toFixed(3);
        });
    }

    // ==================================================================
    // 4. რიცხვები, 3D დახრა და მაგნიტური ღილაკები
    // ==================================================================
    var counted = false;
    function statsRender() {
        var st = $("stats");
        if (!st) return;
        var k = T[L], v = [[S.length, k.st_s], [SC.days.ge.length + SC.days.ru.length, k.st_w], [2, k.st_d], [3, k.st_l]];
        st.innerHTML = v.map(function (x) {
            return '<div><b data-count="' + x[0] + '">' + (counted || RM ? x[0] : 0) + "</b><span>" + esc(x[1]) + "</span></div>";
        }).join("");
    }
    function countUp() {
        if (counted) return;
        counted = true;
        all("[data-count]").forEach(function (b) {
            var to = +b.dataset.count, t0 = performance.now();
            (function f(t) {
                var q = clamp((t - t0) / 1400, 0, 1);
                b.textContent = Math.round(to * (1 - Math.pow(1 - q, 3)));
                if (q < 1) requestAnimationFrame(f);
            })(t0);
        });
    }
    if (FINE && !RM) {
        document.addEventListener("pointermove", function (e) {
            var t = e.target.closest && e.target.closest("[data-tilt]");
            if (tiltEl && tiltEl != t) { tiltEl.style.setProperty("--rx", "0deg"); tiltEl.style.setProperty("--ry", "0deg"); }
            tiltEl = t;
            if (t) {
                var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
                var m = t.classList.contains("ticket") || t.classList.contains("contact") ? 4 : 9;
                t.style.setProperty("--rx", (-y * m).toFixed(2) + "deg");
                t.style.setProperty("--ry", (x * m).toFixed(2) + "deg");
                t.style.setProperty("--gx", (x + 0.5) * 100 + "%");
                t.style.setProperty("--gy", (y + 0.5) * 100 + "%");
            }
            var b = e.target.closest && e.target.closest(".mag");
            if (magEl && magEl != b) { magEl.style.translate = ""; }
            magEl = b;
            if (b) {
                var q = b.getBoundingClientRect();
                b.style.translate = ((e.clientX - q.left - q.width / 2) * 0.25).toFixed(1) + "px " + ((e.clientY - q.top - q.height / 2) * 0.35).toFixed(1) + "px";
            }
        }, { passive: true });
    }
    var tiltEl = null, magEl = null;

    // ==================================================================
    // 5. გვერდების ანიმაციები
    // ==================================================================
    // 5.1 გამოჩენა სქროლისას: სხვადასხვა გვერდზე სხვადასხვა მოძრაობა (data-rv)
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (a) {
        a.forEach(function (x) {
            if (!x.isIntersecting) return;
            x.target.classList.add("in");
            if (x.target.id == "stats") countUp();
            io.unobserve(x.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }) : null;
    function mark(sel, kind, step) {
        all(sel).forEach(function (e, i) {
            if (e.dataset.rv) return;
            e.dataset.rv = kind;
            e.style.setProperty("--d", (i * (step || 0.08)).toFixed(2) + "s");
            if (io && !RM) io.observe(e); else e.classList.add("in");
        });
    }
    function marks() {
        mark(".how li", "left", 0.1);
        mark(".am > div", "flip", 0.07);
        mark(".feat > div", "rise", 0.09);
        mark(".f3d details", "fold", 0.06);
        mark(".board .box", "zoom", 0.12);
        mark(".stack p", "card", 0.05);
        mark(".adl .ad", "rise", 0.1);
        mark("#rvl blockquote", "flip", 0.1);
        mark("#pl .dl li", "left", 0.05);
        if (io && !RM) { var st = $("stats"); if (st) io.observe(st); } else countUp();
    }
    // 5.2 სათაურები სიტყვა-სიტყვით ამოდის
    function words() {
        all(".phd h1").forEach(function (h) {
            var t = h.textContent;
            h.innerHTML = t.split(/(\s+)/).map(function (w, i) {
                return /^\s+$/.test(w) ? w : '<span class="wd"><span style="--d:' + (i * 0.05).toFixed(2) + 's">' + esc(w) + "</span></span>";
            }).join("");
        });
    }
    // 5.3 განრიგი: აეროპორტის დაფის მსგავსად ასოები ტრიალებს
    function flaps() {
        all(".board .dl li").forEach(function (li, n) {
            var t = li.textContent;
            li.innerHTML = Array.from(t).map(function (c, i) {
                return c == " " ? " " : '<span class="fl" style="--d:' + (n * 0.12 + i * 0.022).toFixed(3) + 's">' + esc(c) + "</span>";
            }).join("");
        });
    }
    // 5.4 ავტობუსების 3D კარუსელი: ტრიალებს თავისით, სქროლით და თითით/მაუსით
    var ring = $("ring"), ringw = $("ringw"), rA = 0, rV = 0, rDrag = false, rX = 0, rR = 300;
    function ringSize() {
        if (!ring) return;
        var f = all("figure", ring), n = f.length, w = f[0].offsetWidth;
        rR = Math.round(w / 2 / Math.tan(Math.PI / n) + 24);
        f.forEach(function (e, i) { e.style.transform = "rotateY(" + (i * 360 / n) + "deg) translateZ(" + rR + "px)"; });
    }
    if (ringw) {
        ringw.addEventListener("pointerdown", function (e) { rDrag = true; rX = e.clientX; rV = 0; ringw.classList.add("drag"); });
        addEventListener("pointermove", function (e) {
            if (!rDrag) return;
            var d = e.clientX - rX;
            rX = e.clientX;
            rA += d * 0.35;
            rV = d * 0.35;
        }, { passive: true });
        addEventListener("pointerup", function () { rDrag = false; ringw.classList.remove("drag"); });
        addEventListener("pointercancel", function () { rDrag = false; ringw.classList.remove("drag"); });
    }
    function ringTick(dt) {
        if (!ring || $("p-buses").hidden) return;
        var r = ringw.getBoundingClientRect();
        if (r.bottom < 0 || r.top > VH) return;
        if (!rDrag) { rV *= 0.94; rA += rV + (RM ? 0 : dt * 9); }
        var a = rA + (RM ? 0 : scrollY * 0.12);
        ring.style.transform = "translateZ(" + -rR + "px) rotateY(" + a.toFixed(2) + "deg)";
        all("figure", ring).forEach(function (e, i) {
            var c = Math.cos((a + i * 60) * Math.PI / 180);
            e.style.filter = "brightness(" + (0.45 + 0.55 * (c + 1) / 2).toFixed(3) + ")";
        });
    }
    // 5.5 განრიგის მარშრუტი: ხაზი იხატება სქროლით, გაჩერებები ინთება
    function rboxTick() {
        var b = $("rbox");
        if (!b || $("p-schedule").hidden) return;
        var r = b.getBoundingClientRect(), p = clamp((VH * 0.8 - r.top) / (r.height * 0.9), 0, 1);
        b.style.setProperty("--p", p.toFixed(3));
        var li = all("li", b);
        li.forEach(function (e, i) { e.classList.toggle("lit", i / li.length < p); });
    }
    // 5.6 ამანათის ყუთი: ტრიალებს და იხსნება სქროლით
    function unboxTick() {
        var b = $("unbox");
        if (!b || $("p-parcels").hidden) return;
        var r = b.getBoundingClientRect(), p = clamp((VH - r.top) / (VH + r.height), 0, 1);
        b.style.setProperty("--cp", RM ? 0.6 : p.toFixed(4));
        b.style.setProperty("--open", clamp((p - 0.35) / 0.3, 0, 1).toFixed(3));
    }
    // 5.7 პირობები: ბარათები ერთმანეთზე ეწყობა და წინა პატარავდება
    function stackTick() {
        var s = $("inf");
        if (!s || $("p-info").hidden) return;
        var p = all("p", s);
        p.forEach(function (e, i) {
            e.style.setProperty("--i", i);
            var n = p[i + 1];
            if (!n) { e.style.transform = ""; return; }
            var a = e.getBoundingClientRect(), b = n.getBoundingClientRect(), o = clamp((a.bottom - b.top) / a.height, 0, 1);
            e.style.transform = "scale(" + (1 - o * 0.06).toFixed(4) + ")";
            e.style.filter = "brightness(" + (1 - o * 0.12).toFixed(3) + ")";
        });
    }
    // 5.8 ბილეთი „იბეჭდება“: სქროლისას იხრება და სწორდება
    function ticketTick() {
        var t = $("f");
        if (!t || $("p-home").hidden || RM) return;
        var r = t.getBoundingClientRect(), p = clamp((VH - r.top) / (VH * 0.7), 0, 1);
        t.style.setProperty("--tp", ((1 - p) * 18).toFixed(2) + "deg");
    }

    // ==================================================================
    // 6. რეკლამა (პარტნიორები)
    // რეკლამებს ამატებ ადმინ-გვერდიდან (#/admin), ინახება js/schedule-config.js-ში (ads).
    // ==================================================================
    function src(p) { return /^(https?:|data:|\/)/.test(p) ? p : BASE + p; }
    function link(u) {
        if (!u) return "";
        if (/^\+?[\d\s()-]{7,}$/.test(u)) return "tel:" + u.replace(/[^\d+]/g, "");
        return /^(https?:|mailto:|tel:)/.test(u) ? u : "https://" + u;
    }
    function adCard(a, cls) {
        var k = T[L], h = link(a.u), tag = h ? "a" : "div";
        return "<" + tag + ' class="ad ' + (cls || "") + '" data-tilt' + (h ? ' href="' + esc(h) + '" target="_blank" rel="sponsored noopener"' : "") + ">" +
            '<span class="ad-img">' + (a.img ? '<img src="' + esc(src(a.img)) + '" alt="" loading="lazy">' : '<i class="ad-ph">' + esc((a.t || "?").charAt(0)) + "</i>") + "</span>" +
            '<span class="ad-tag">' + k.adl + "</span>" +
            '<span class="ad-b"><b>' + esc(a.t) + "</b>" + (a.x ? "<small>" + esc(a.x) + "</small>" : "") + (h ? "<em>" + k.adv + " →</em>" : "") + "</span></" + tag + ">";
    }
    function adFree(cls) {
        var k = T[L], wa = "https://wa.me/995598808022?text=" + encodeURIComponent(k.adm);
        return '<a class="ad free ' + (cls || "") + '" data-tilt href="' + wa + '" target="_blank" rel="noopener"><span class="ad-plus">+</span><span class="ad-b"><b>' + k.adf + "</b><small>" + k.adft + '</small></span><em class="btn coral">' + k.adb + "</em></a>";
    }
    function adGhost(i) {
        var k = T[L], wa = "https://wa.me/995598808022?text=" + encodeURIComponent(k.adm);
        return '<a class="ad ghost" data-tilt href="' + wa + '" target="_blank" rel="noopener"><span class="ad-img"><i>' + k.ads2 + " #" + i + '</i></span><span class="ad-tag">' + k.adl + '</span><span class="ad-b"><b>' + k.ads2 + "</b><small>" + k.adft + "</small><em>" + k.adb + " →</em></span></a>";
    }
    function adsRender() {
        var ads = (SC.ads || []).filter(function (a) { return a && a.t; }), l = $("adl"), bar = $("adbar");
        if (l) {
            l.className = "adl";
            var n = ads.length, gh = '';
            // ცარიელ ადგილებს ავსებს: „აქ შეიძლება იყოს თქვენი რეკლამა“ + სარეკლამო ადგილები
            if (n < 2) for (var g = n; g < 2; g++) gh += adGhost(g + 2);
            l.innerHTML = ads.map(function (a) { return adCard(a); }).join('') + (n % 3 || !n ? adFree() : '') + gh;
        }
        if (bar) {
            var a = ads.length ? ads[Math.floor(Math.random() * ads.length)] : null;
            bar.innerHTML = a ? adCard(a, "wide") : adFree("wide");
        }
        adbarVis();
    }
    function adbarVis() {
        var bar = $("adbar");
        if (bar) bar.hidden = !$("p-home").hidden || !$("p-admin").hidden;
    }

    // ==================================================================
    // 7. საერთო ციკლი და ხატვა
    // render() script.js-შია. აქ ვამატებთ ჩვენს ნაწილს, რომ ენის შეცვლისას ყველაფერი განახლდეს.
    // ==================================================================
    function fxRender() {
        var hd = $("hd");
        if (hd) html.style.setProperty("--hdh", hd.offsetHeight + "px");
        chapRender();
        marqRender();
        statsRender();
        adsRender();
        words();
        flaps();
        marks();
        hsSize();
        ringSize();
    }
    var baseRender = window.render;
    window.render = function () {
        baseRender.apply(this, arguments);
        fxRender();
    };
    fxRender();
    addEventListener("hashchange", function () { setTimeout(function () { adbarVis(); hsSize(); ringSize(); }, 30); });
    addEventListener("resize", function () {
        if (Math.abs(innerWidth - VW) < 2 && Math.abs(innerHeight - VH) < 120) return; // ტელეფონზე მისამართის ზოლი
        VH = innerHeight;
        VW = innerWidth;
        hsSize();
        ringSize();
    });
    addEventListener("load", function () { hsSize(); ringSize(); });

    var prog = $("prog").firstChild, t0 = performance.now();
    function loop(t) {
        var dt = Math.min(0.05, (t - t0) / 1000);
        t0 = t;
        var y = scrollY, d = y - lastY;
        lastY = y;
        vel += (d - vel) * 0.12;
        var max = document.documentElement.scrollHeight - VH;
        prog.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0).toFixed(4) + ")";
        tripTick();
        hsTick();
        ticketTick();
        ringTick(dt);
        rboxTick();
        unboxTick();
        stackTick();
        if (marq && !RM && !$("p-home").hidden) {
            mx -= (40 + Math.abs(vel) * 18) * dt;
            var w = marq.firstChild.offsetWidth / 2 || 1;
            if (-mx > w) mx += w;
            marq.style.setProperty("--x", mx.toFixed(1) + "px");
            marq.style.setProperty("--sk", clamp(vel * -0.25, -8, 8).toFixed(2) + "deg");
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();
