/* =====================================================================
   იმერეთი ტური: საიტის მთავარი პროგრამა (JavaScript)

   ფაილის აგებულება (ზემოდან ქვემოთ):
    1. ტექსტები სამ ენაზე
    2. გაჩერებები
    3. პარამეტრები (ბრძანებები ფაილიდან schedule-config.js)
    4. რეისების თარიღების ლოგიკა
    5. ენა და დამხმარე ფუნქციები
    6. გვერდის ხატვა
    7. გვერდები და ნავიგაცია
    8. ამანათის ფორმა
    9. ძებნა
   10. ფასები, ზედა ზოლი, შეფასებები
   12. ადმინ-პანელი
   13. სტატისტიკა
   14. გაშვება

   ცვლილებების უმეტესობა არ მოითხოვს ამ ფაილის შეცვლას. განრიგს, ფასებს,
   და ტექსტებს ცვლი ადმინ-გვერდიდან: შენი-საიტი/#/admin
   ===================================================================== */

// ======================================================================
// 1. ტექსტები სამ ენაზე (ka = ქართული, ru = რუსული, en = ინგლისური)
// ტექსტის შესაცვლელად იპოვე შესაბამისი ენა და გასაღები (მაგ. brand, h, sub) და შეცვალე მნიშვნელობა.
// ======================================================================

var T = {
    ka: {
        brand: "იმერეთი ტური", h: "საქართველო–მოსკოვი, უსაფრთხოდ და კომფორტულად", sub: "რეგულარული რეისები ორივე მიმართულებით და ამანათების სწრაფი გადაზიდვა.", nx1: "უახლოესი გასვლა საქართველოდან", nx2: "უახლოესი გასვლა მოსკოვიდან", cta: "დაჯავშნა", rt: "მარშრუტი", bk: "ადგილის დაჯავშნა", dir: "მიმართულება", d1o: "საქართველო → მოსკოვი", d2o: "მოსკოვი → საქართველო", dt: "თარიღი", st1: "ასვლის გაჩერება", st2: "ჩამოსვლის გაჩერება", px: "მგზავრები", nm: "სახელი", ph: "ტელეფონი", send: "გაგზავნა WhatsApp-ში", q6: "შემიძლია ჯავშნის გაუქმება?", a6: "დიახ. გაუქმების შემთხვევაში გადახდილ თანხას დაგიბრუნებთ. მოგვწერეთ WhatsApp-ში.", mapl: "რუკაზე ნახვა", sl2: "დარჩა {n} ადგილი", sf: "ადგილები ამოიწურა", tot: "ჯამი", dep: "ავანსი (25%)", per: "ერთ ადგილზე", pkg: "ამანათი, 1 კგ", prh: "ფასები", rvh: "მგზავრები გვიყვებიან", noinfo: "ინფორმაცია მალე დაემატება. დაგვიკავშირდი WhatsApp-ში.", nv5: "პირობები", kgl: "წონა (კგ)", est: "სავარაუდო ფასი", prt: "დაბეჭდვა / PDF", tkh: "ჯავშნის მოთხოვნა. დასადასტურებლად მოგვწერე WhatsApp-ში.", fg: "საქართველოდან", rtl: "მოსკოვიდან", stt: "აირჩიე ადგილები", ssh: "ადგილი ჯერ არ არის არჩეული", ssl: "არჩეული ადგილები", sl: "ადგილები", lf: "თავისუფალი", ls: "არჩეული", lt: "დაკავებული", snote: "ადგილი ფიქსირდება ავანსის გადახდისა და დადასტურების შემდეგ.", vt1: "მთებიდან დიდ ქალაქებამდე", vt2: "შენი გზა საქართველოდან მოსკოვამდე", tag: "საქართველო–მოსკოვი", sp: "ძებნა საიტზე...", nores: "ვერაფერი მოიძებნა", nv4: "ამანათები", more: "ვრცლად ამანათებზე", mw: "მოსკოვი", pt: "ამანათების გადაზიდვა საქართველო–მოსკოვი", ps: "სწრაფი და უსაფრთხო გზავნილი ავტობუსის რეგულარული რეისებით, ორივე მიმართულებით.", f1: "სწრაფად", f1t: "ამანათი მიდის უახლოესი რეისით, რეგულარულად ორივე მიმართულებით.", f2: "უსაფრთხოდ", f2t: "ვზრუნავთ თქვენი ამანათის უსაფრთხო ტრანსპორტირებაზე.", f3: "ორივე მიმართულებით", f3t: "საქართველოდან მოსკოვში და მოსკოვიდან საქართველოში.", f4: "მოსახერხებელი გაჩერებები", f4t: "ბათუმი, ქობულეთი, ფოთი, ქუთაისი, თბილისი და მოსკოვი.", how: "როგორ გავგზავნო", s1: "მოგვწერე WhatsApp-ში: მიმართულება და რისი გაგზავნა გინდა.", s2: "დაგიდასტურებთ პირობებს, გაჩერებას და გადაცემის დროს.", s3: "ამანათი მიდის უახლოესი რეისით და ადრესატი იღებს დანიშნულების ადგილას.", pts: "გაჩერებები", pform: "გამოგვიგზავნე მოთხოვნა", pwhat: "რისი გაგზავნა გინდა", pmsg: "გამარჯობა! მინდა ამანათის გაგზავნა.", nv0: "მთავარი", nv1: "ავტობუსები", nv2: "განრიგი", nv3: "კითხვები", bh: "ჩვენი ავტობუსები", bsub: "კომფორტული ავტობუსები და საიმედო მომსახურება გრძელ გზაზე.", amh: "რას გთავაზობთ გზაზე", am1: "კომფორტული ავტობუსები", am2: "უსაფრთხო და საიმედო მომსახურება", am3: "კონდიციონერი", am5: "USB დასატენი", sh: "გასვლის განრიგი", fh: "ხშირი კითხვები", q1: "როგორ დავჯავშნო ადგილი?", a1: "შეავსე ფორმა მთავარ გვერდზე და გამოგვიგზავნე WhatsApp-ში, ან დაგვირეკე ნომრებზე.", q2: "რამდენი უნდა გადავიხადო დაჯავშნისას?", a2: "მინიმუმ 25%. სურვილის შემთხვევაში შეგიძლია სრულად გადაიხადო.", q3: "რომელ დღეს არის რეისები?", a3: "საქართველოდან ოთხშაბათს და შაბათს, მოსკოვიდან სამშაბათს და შაბათს.", q4: "გადააქვთ თუ არა ამანათები?", a4: "დიახ, ორივე მიმართულებით. დეტალები დაგვირეკე ან მოგვწერე.", q5: "საიდან შემიძლია ასვლა?", a5: "ბათუმი, ქობულეთი, ფოთი, ქუთაისი, თბილისი. მოსკოვში მეტრო „ანინოსთან“.", pay: "ანგარიშსწორება", pay1: "მინიმუმ 25% წინასწარ", pay2: "100% სრულად", note: "დაჯავშნისას აუცილებელია მინიმუმ 25%-ის ჩარიცხვა, ან შეგიძლიათ სრულად გადაიხადოთ. გადახდის რეკვიზიტებს გამოგიგზავნით WhatsApp-ში. გაუქმების შემთხვევაში თანხას დაგიბრუნებთ.", pm: "ანგარიშსწორება", pc: "ამანათები", pct: "სწრაფად და უსაფრთხოდ ვაგზავნით ამანათებს საქართველო–მოსკოვის ორივე მიმართულებით.", ct: "კონტაქტი", ofk: "ქობულეთის ოფისი", ofp: "ფოთის ოფისი", wd: "გასვლა: ოთხშაბათს და შაბათს", ret: "მოსკოვიდან: სამშაბათს და შაბათს", msk: "მოსკოვი, მეტრო „ანინო“ (МКАД 33 км, владение 6, стр. 5)", d: "დღე", hh: "სთ", mm: "წთ", lc: "ka-GE", msg: "გამარჯობა! მინდა ადგილის დაჯავშნა.", f: "მიმართულება", w: "თარიღი", s: "გაჩერება", p: "მგზავრები", n: "სახელი", t: "ტელეფონი", ge: "საქართველო → მოსკოვი", ru: "მოსკოვი → საქართველო"
    },
    ru: {
        brand: "Имерети Тур", h: "Грузия–Москва: безопасно и удобно", sub: "Регулярные рейсы в обе стороны и быстрая доставка посылок.", nx1: "Ближайший выезд из Грузии", nx2: "Ближайший выезд из Москвы", cta: "Забронировать", rt: "Маршрут", bk: "Бронирование места", dir: "Направление", d1o: "Грузия → Москва", d2o: "Москва → Грузия", dt: "Дата", st1: "Остановка посадки", st2: "Остановка высадки", px: "Пассажиры", nm: "Имя", ph: "Телефон", send: "Отправить в WhatsApp", q6: "Можно ли отменить бронирование?", a6: "Да. При отмене мы возвращаем уплаченную сумму. Напишите нам в WhatsApp.", mapl: "Показать на карте", sl2: "Осталось мест: {n}", sf: "Мест нет", tot: "Итого", dep: "Аванс (25%)", per: "за место", pkg: "Посылка, 1 кг", prh: "Цены", rvh: "Отзывы пассажиров", noinfo: "Информация скоро появится. Напишите нам в WhatsApp.", nv5: "Условия", kgl: "Вес (кг)", est: "Ориентировочная цена", prt: "Печать / PDF", tkh: "Заявка на бронирование. Для подтверждения напишите в WhatsApp.", fg: "Из Грузии", rtl: "Из Москвы", stt: "Выберите места", ssh: "Места ещё не выбраны", ssl: "Выбранные места", sl: "Места", lf: "Свободно", ls: "Выбрано", lt: "Занято", snote: "Место закрепляется после внесения аванса и подтверждения.", vt1: "От гор до больших городов", vt2: "Ваш путь из Грузии в Москву", tag: "Грузия–Москва", sp: "Поиск по сайту...", nores: "Ничего не найдено", nv4: "Посылки", more: "Подробнее о посылках", mw: "Москва", pt: "Перевозка посылок Грузия–Москва", ps: "Быстрая и безопасная отправка посылок регулярными рейсами автобусов в обе стороны.", f1: "Быстро", f1t: "Посылка уходит ближайшим рейсом, регулярно в обе стороны.", f2: "Надёжно", f2t: "Мы заботимся о безопасной перевозке вашей посылки.", f3: "В обе стороны", f3t: "Из Грузии в Москву и из Москвы в Грузию.", f4: "Удобные остановки", f4t: "Батуми, Кобулети, Поти, Кутаиси, Тбилиси и Москва.", how: "Как отправить", s1: "Напишите нам в WhatsApp: направление и что нужно отправить.", s2: "Мы подтвердим условия, остановку и время передачи.", s3: "Посылка едет ближайшим рейсом, получатель забирает её в пункте назначения.", pts: "Остановки", pform: "Отправьте заявку", pwhat: "Что отправляете", pmsg: "Здравствуйте! Хочу отправить посылку.", nv0: "Главная", nv1: "Автобусы", nv2: "Расписание", nv3: "Вопросы", bh: "Наши автобусы", bsub: "Комфортные автобусы и надёжный сервис в дальней дороге.", amh: "Что вас ждёт в пути", am1: "Комфортные автобусы", am2: "Безопасный и надёжный сервис", am3: "Кондиционер", am5: "USB-зарядка", sh: "Расписание выездов", fh: "Частые вопросы", q1: "Как забронировать место?", a1: "Заполните форму на главной странице и отправьте в WhatsApp, либо позвоните по нашим номерам.", q2: "Сколько нужно оплатить при бронировании?", a2: "Минимум 25%. При желании можно оплатить полностью.", q3: "В какие дни идут рейсы?", a3: "Из Грузии по средам и субботам, из Москвы по вторникам и субботам.", q4: "Перевозите ли вы посылки?", a4: "Да, в обоих направлениях. Подробности уточняйте по телефону или в мессенджере.", q5: "Где можно сесть в автобус?", a5: "Батуми, Кобулети, Поти, Кутаиси, Тбилиси. В Москве у метро «Анино».", pay: "Оплата", pay1: "Минимум 25% заранее", pay2: "100% полностью", note: "При бронировании необходимо внести минимум 25% стоимости или оплатить полностью. Реквизиты для оплаты пришлём в WhatsApp. При отмене бронирования деньги возвращаем.", pm: "Оплата", pc: "Посылки", pct: "Быстро и безопасно перевозим посылки в обоих направлениях Грузия–Москва.", ct: "Контакты", ofk: "Офис в Кобулети", ofp: "Офис в Поти", wd: "Выезд: среда и суббота", ret: "Из Москвы: вторник и суббота", msk: "Москва, метро «Анино» (МКАД 33 км, владение 6, стр. 5)", d: "дн", hh: "ч", mm: "мин", lc: "ru-RU", msg: "Здравствуйте! Хочу забронировать место.", f: "Направление", w: "Дата", s: "Остановка", p: "Пассажиры", n: "Имя", t: "Телефон", ge: "Грузия → Москва", ru: "Москва → Грузия"
    },
    en: {
        brand: "Imereti Tour", h: "Georgia–Moscow, safe and comfortable", sub: "Regular trips both ways and fast, secure parcel delivery.", nx1: "Next departure from Georgia", nx2: "Next departure from Moscow", cta: "Book a seat", rt: "Route", bk: "Book a seat", dir: "Direction", d1o: "Georgia → Moscow", d2o: "Moscow → Georgia", dt: "Date", st1: "Pickup stop", st2: "Drop-off stop", px: "Passengers", nm: "Name", ph: "Phone", send: "Send via WhatsApp", q6: "Can I cancel my booking?", a6: "Yes. If you cancel, we refund the amount you paid. Message us on WhatsApp.", mapl: "View on map", sl2: "{n} seats left", sf: "Sold out", tot: "Total", dep: "Advance (25%)", per: "per seat", pkg: "Parcel, 1 kg", prh: "Prices", rvh: "Passenger reviews", noinfo: "Information coming soon. Message us on WhatsApp.", nv5: "Terms", kgl: "Weight (kg)", est: "Estimated price", prt: "Print / PDF", tkh: "Booking request. Please confirm via WhatsApp.", fg: "From Georgia", rtl: "From Moscow", stt: "Choose your seats", ssh: "No seats selected yet", ssl: "Selected seats", sl: "Seats", lf: "Free", ls: "Selected", lt: "Taken", snote: "A seat is secured once the advance payment is made and confirmed.", vt1: "From mountains to big cities", vt2: "Your way from Georgia to Moscow", tag: "Georgia–Moscow", sp: "Search the site...", nores: "Nothing found", nv4: "Parcels", more: "More about parcels", mw: "Moscow", pt: "Parcel delivery Georgia–Moscow", ps: "Fast, secure parcel delivery on our regular bus trips, in both directions.", f1: "Fast", f1t: "Your parcel goes on the next trip, regularly in both directions.", f2: "Secure", f2t: "We take care of transporting your parcel safely.", f3: "Both directions", f3t: "From Georgia to Moscow and from Moscow to Georgia.", f4: "Convenient stops", f4t: "Batumi, Kobuleti, Poti, Kutaisi, Tbilisi and Moscow.", how: "How to send", s1: "Message us on WhatsApp: direction and what you want to send.", s2: "We confirm the terms, the stop and the handover time.", s3: "The parcel travels on the next trip and the recipient collects it at the destination.", pts: "Stops", pform: "Send a request", pwhat: "What are you sending", pmsg: "Hello! I would like to send a parcel.", nv0: "Home", nv1: "Buses", nv2: "Schedule", nv3: "FAQ", bh: "Our buses", bsub: "Comfortable buses and reliable service on the long road.", amh: "What you get on board", am1: "Comfortable buses", am2: "Safe and reliable service", am3: "Air conditioning", am5: "USB charging", sh: "Departure schedule", fh: "Frequently asked questions", q1: "How do I book a seat?", a1: "Fill in the form on the home page and send it via WhatsApp, or call our numbers.", q2: "How much do I pay when booking?", a2: "At least 25%. You can also pay the full amount.", q3: "Which days do buses run?", a3: "From Georgia on Wednesdays and Saturdays, from Moscow on Tuesdays and Saturdays.", q4: "Do you carry parcels?", a4: "Yes, in both directions. Call or message us for details.", q5: "Where can I board?", a5: "Batumi, Kobuleti, Poti, Kutaisi, Tbilisi. In Moscow at metro Annino.", pay: "Payment", pay1: "At least 25% in advance", pay2: "100% in full", note: "To confirm a booking you must pay at least 25% in advance, or you can pay the full amount. We will send payment details via WhatsApp. If you cancel, we refund your money.", pm: "Payment", pc: "Parcels", pct: "We deliver parcels fast and securely in both directions between Georgia and Moscow.", ct: "Contact", ofk: "Kobuleti office", ofp: "Poti office", wd: "Departures: Wednesday and Saturday", ret: "From Moscow: Tuesday and Saturday", msk: "Moscow, metro Annino (MKAD 33 km, 6 vladenie, building 5)", d: "d", hh: "h", mm: "min", lc: "en-GB", msg: "Hello! I would like to book a seat.", f: "Direction", w: "Date", s: "Stop", p: "Passengers", n: "Name", t: "Phone", ge: "Georgia → Moscow", ru: "Moscow → Georgia"
    }
};

// ======================================================================
// 2. გაჩერებები (დრო, ქალაქი სამ ენაზე)
// დროებს უმჯობესია ცვლიდე ადმინ-გვერდიდან (#/admin).
// ======================================================================

var S = [["00:00", {
            ka: "ბათუმი", ru: "Батуми", en: "Batumi"
        }], ["00:30", {
            ka: "ქობულეთი", ru: "Кобулети", en: "Kobuleti"
        }], ["01:00", {
            ka: "ფოთი", ru: "Поти", en: "Poti"
        }], ["03:00", {
            ka: "ქუთაისი", ru: "Кутаиси", en: "Kutaisi"
        }], ["06:00", {
            ka: "თბილისი", ru: "Тбилиси", en: "Tbilisi"
        }]];

// ======================================================================
// 3. პარამეტრები ფაილიდან js/schedule-config.js
// აქ მზადდება საიტის პარამეტრები და ხდება მათი ნაგულისხმევი მნიშვნელობები.
// ======================================================================

var BASE = document.body.dataset.base || "", PG = document.body.dataset.page || "", SPA = !!document.body.dataset.spa;
var SC = window.SCHEDULE || {};
SC.days = SC.days || {
    ge: [3, 6], ru: [2, 6]
};
SC.stops = SC.stops || ["00:00", "00:30", "01:00", "03:00", "06:00"];
SC.cancel = SC.cancel || [];
SC.add = SC.add || [];
SC.ruTime = SC.ruTime || "";
SC.cur = SC.cur || "₾";
SC.price = SC.price || {
    ge: 0, ru: 0
};
SC.kg = SC.kg || {
    ge: 0, ru: 0
};
SC.notice = SC.notice || {
    ka: "", ru: "", en: ""
};
SC.info = SC.info || {
    ka: "", ru: "", en: ""
};
SC.reviews = SC.reviews || [];
SC.maps = SC.maps || {};
SC.ga = SC.ga || "";
S.forEach(function (s, i) {
    if (SC.stops[i])
        s[0] = SC.stops[i];
});

// ======================================================================
// 4. რეისების თარიღები (განრიგის ლოგიკა)
// ======================================================================

// ადგილობრივი თარიღი + დრო → ზუსტი მომენტი (UTC მილიწამებში). off = დროის სარტყლის წანაცვლება საათებში.
function at(ds, tm, off) {
    var p = ds.split("-"), h = tm ? tm.split(":") : [0, 0];
    return Date.UTC(+p[0], p[1] - 1, +p[2], +h[0], +h[1]) - off * 36e5;
}
// ითვლის უახლოეს რეისებს. kind = "ge" (საქართველოდან) ან "ru" (მოსკოვიდან). ითვალისწინებს კვირის დღეებს, გაუქმებულ და დამატებულ რეისებს.
// რამდენი თარიღი ჩანს დაჯავშნის ფორმაში (კვირაში 2 რეისით 16 ≈ 2 თვე).
var BOOK_N = 16;
function trips(kind, n) {
    var ge = kind == "ge", off = ge ? 4 : 3, now = Date.now(), base = ge ? S[0][0] : SC.ruTime, sh0 = new Date(now + off * 36e5), o = [];
    for (var i = 0; i < 120; i++) {
        var d = new Date(sh0.getTime() + i * 864e5);
        if (SC.days[kind].indexOf(d.getUTCDay()) < 0)
            continue;
        var ds = d.toISOString().slice(0, 10);
        if (SC.cancel.indexOf(kind + "-" + ds) >= 0)
            continue;
        o.push(at(ds, base, off));
    }
    SC.add.forEach(function (a) {
        if (a.k == kind)
            o.push(at(a.date, a.time || base, off));
    });
    o = o.filter(function (t) {
        return ge ? t > now : t + 864e5 > now;
    }).sort(function (a, b) {
        return a - b;
    }).filter(function (t, i, a) {
        return i == 0 || t != a[i - 1];
    });
    return o.slice(0, n);
}
// მომენტი → საათი:წუთი მითითებულ დროის სარტყელში (მაგ. "06:00").
function hm(t, tz) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false
    }).format(new Date(t));
}
// ლამაზი ტექსტი რეისისთვის: "ოთხშაბათი, 7 ოქტომბერი · 00:00".
function ft(t, ge) {
    var tz = ge ? "Asia/Tbilisi" : "Europe/Moscow", x = hm(t, tz);
    return fmt(t, tz) + ((ge || x != "00:00") ? " · " + x : "");
}
// "06:30" → წუთები დღის დასაწყისიდან (390).
function tmn(x) {
    var a = x.split(":");
    return +a[0] * 60 + +a[1];
}
// დროის წანაცვლება: shf("00:30", 60) → "01:30". გამოიყენება რეისის გადატანისას.
function shf(x, d) {
    var m = ((tmn(x) + d) % 1440 + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
}
// კვირის დღეების სახელები ტექსტად, მაგ. "ოთხშაბათი, შაბათი".
function dn(kind) {
    return SC.days[kind].slice().sort(function (a, b) {
        return (a || 7) - (b || 7);
    }).map(wname).join(", ");
}
// ავსებს "გაჩერების" არჩევანს ჯავშნის ფორმაში (დროები რეისის მიხედვით ინაცვლებს).
function fillSt() {
    var ge = $("dir").value == "ge", t = trips(ge ? "ge" : "ru", BOOK_N)[+$("dt").value || 0], dl = 0;
    if (ge && t)
        dl = tmn(hm(t, "Asia/Tbilisi")) - tmn(S[0][0]);
    var sv = $("st").value || 0;
    $("st").innerHTML = S.map(function (s, i) {
        return '<option value="' + i + '">' + s[1][L] + " · " + shf(s[0], dl) + "</option>";
    }).join("");
    $("st").value = sv;
}

// ======================================================================
// 5. ენა და დამხმარე ფუნქციები
// ======================================================================

var L = "ka";
try {
    L = localStorage.getItem("l") || "ka";
}
catch (e) { }
var $ = function (i) {
    return document.getElementById(i);
};
var WK = ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"], MN = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
// კვირის დღის სახელი არჩეულ ენაზე (0 = კვირა).
function wname(d) {
    return L == "ka" ? WK[d] : new Intl.DateTimeFormat(T[L].lc, {
        weekday: "long", timeZone: "UTC"
    }).format(new Date(Date.UTC(2024, 0, 7 + d)));
}
// თარიღი ტექსტად არჩეულ ენაზე.
function fmt(t, tz) {
    if (L != "ka")
        return new Intl.DateTimeFormat(T[L].lc, {
            timeZone: tz, weekday: "long", day: "numeric", month: "long"
        }).format(new Date(t));
    var p = {};
    new Intl.DateTimeFormat("en-US", {
        timeZone: tz, weekday: "short", day: "numeric", month: "numeric"
    }).formatToParts(new Date(t)).forEach(function (x) {
        p[x.type] = x.value;
    });
    return WK[["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday)] + ", " + p.day + " " + MN[+p.month - 1];
}
// უკუთვლა უახლოეს გასვლამდე (დღე / საათი / წუთი).
function cd() {
    var g = trips("ge", 1)[0];
    if (!g)
        return;
    var m = Math.max(0, g - Date.now()), k = T[L];
    $("cd").innerHTML = Math.floor(m / 864e5) + "<i>" + k.d + "</i>" + Math.floor(m % 864e5 / 36e5) + "<i>" + k.hh + "</i>" + Math.floor(m % 36e5 / 6e4) + "<i>" + k.mm + "</i>";
}

// ======================================================================
// 6. გვერდის ხატვა (ტექსტები, მენიუ, სიები)
// ======================================================================

// ხატავს მთელ გვერდს: ტექსტებს, მენიუს, რეისების სიებს, ფორმის არჩევანებს. ეძახიან ენის შეცვლისას და ჩატვირთვისას.
function render() {
    var k = T[L];
    document.documentElement.lang = L;
    $("q").placeholder = T[L].sp;
    document.querySelectorAll("[data-i]").forEach(function (e) {
        e.textContent = k[e.dataset.i];
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.l == L);
    });
    var g = trips("ge", 4), m = trips("ru", 4);
    $("d1").textContent = g[0] ? ft(g[0], 1) : "—";
    $("d2").textContent = m[0] ? ft(m[0], 0) : "—";
    var r = "";
    S.forEach(function (s, i) {
        r += "<li><time>" + s[0] + "</time>" + s[1][L] + mp(s[1].en, SC.maps[i]) + "</li>";
    });
    r += '<li class="days">' + k.fg + ": " + dn("ge") + '</li><li class="end"><b>' + k.msk + "</b>" + mp("Annino metro station Moscow", SC.maps.m) + "<small>" + k.rtl + ": " + dn("ru") + "</small></li>";
    $("route").innerHTML = r;
    $("route2").innerHTML = r;
    $("sg").innerHTML = g.map(function (t) {
        return "<li>" + ft(t, 1) + "</li>";
    }).join("");
    $("sm").innerHTML = m.map(function (t) {
        return "<li>" + ft(t, 0) + "</li>";
    }).join("");
    $("a3").textContent = k.fg + ": " + dn("ge") + ". " + k.rtl + ": " + dn("ru") + ".";
    $("pp").innerHTML = S.map(function (s) {
        return "<span>" + s[1][L] + "</span>";
    }).join("") + "<span>" + k.mw + "</span>";
    $("mn").innerHTML = [["", "nv0"], ["buses", "nv1"], ["schedule", "nv2"], ["parcels", "nv4"], ["info", "nv5"], ["faq", "nv3"]].map(function (x) {
        return '<a href="' + (SPA ? "#/" + x[0] : (BASE + (x[0] ? x[0] + "/" : "") || "./")) + '" data-p="' + x[0] + '">' + k[x[1]] + "</a>";
    }).join("");
    route();
    var ge = $("dir").value == "ge", ds = trips(ge ? "ge" : "ru", BOOK_N), sel = $("dt").value;
    $("dt").innerHTML = ds.map(function (t, i) {
        return '<option value="' + i + '" data-m="' + ft(t, ge) + '">' + ft(t, ge) + "</option>";
    }).join("");
    $("dt").value = sel || 0;
    fillSt();
    $("stl").textContent = ge ? k.st1 : k.st2;
    renderX();
    cd();
    upd();
}
// ანახლებს WhatsApp-ის ბმულს ფორმაში შევსებული მონაცემებით.
function upd() {
    var k = T[L], ge = $("dir").value == "ge", dt = $("dt").selectedOptions[0], st = $("st").selectedOptions[0];
    var tx = k.msg + "\n" + k.f + ": " + (ge ? k.ge : k.ru) + "\n" + k.w + ": " + (dt ? dt.dataset.m : "") + "\n" + k.s + ": " + (st ? st.textContent : "") + "\n" + k.p + ": " + $("px").value + "\n" + k.pm + ": " + $("pay").selectedOptions[0].textContent + (pinfo() ? "\n" + k.tot + ": " + pinfo().tot + " " + SC.cur + "\n" + k.dep + ": " + pinfo().dep + " " + SC.cur : "") + "\n" + k.n + ": " + $("nm").value + "\n" + k.t + ": " + $("ph").value;
    prShow();
    pupd();
    $("wa").href = "https://wa.me/995598808022?text=" + encodeURIComponent(tx);
}
document.querySelectorAll(".lang button").forEach(function (b) {
    b.onclick = function () {
        L = b.dataset.l;
        try {
            localStorage.setItem("l", L);
        }
        catch (e) { }
        render();
    };
});
$("dir").onchange = render;
["st", "px", "nm", "ph", "pay"].forEach(function (i) {
    $(i).oninput = upd;
});
$("dt").onchange = function () {
    fillSt();
    upd();
};

// ======================================================================
// 7. გვერდები და ნავიგაცია
// ======================================================================

// გვერდების გადართვა: აჩვენებს მხოლოდ ერთ გვერდს (მთავარი, ავტობუსები, განრიგი...).
function route() {
    var h = location.hash, p = h.indexOf("#/") == 0 ? h.slice(2) : PG;
    if (["buses", "schedule", "parcels", "info", "faq", "admin"].indexOf(p) < 0)
        p = "";
    ["home", "buses", "schedule", "parcels", "info", "faq", "admin"].forEach(function (n) {
        var e = $("p-" + n);
        if (e)
            e.hidden = (n != (p || "home"));
    });
    document.querySelectorAll("#mn a").forEach(function (a) {
        if (a.dataset.p == p)
            a.setAttribute("aria-current", "page");
        else
            a.removeAttribute("aria-current");
    });
    var cur = $("p-" + (p || "home"));
    if (cur) {
        cur.classList.remove("enter");
        void cur.offsetWidth;
        cur.classList.add("enter");
    }
    if (h == "#book" || h == "#contact") {
        $("p-home").hidden = false;
        ["buses", "schedule", "parcels", "info", "faq", "admin"].forEach(function (n) {
            $("p-" + n).hidden = true;
        });
        $(h.slice(1)).scrollIntoView();
    }
    else if (h)
        window.scrollTo(0, 0);
}

// ======================================================================
// 8. ამანათის ფორმა
// ======================================================================

// ამანათის ფორმა: ითვლის სავარაუდო ფასს და ანახლებს WhatsApp-ის ბმულს.
function pupd() {
    var k = T[L], ge = $("pdir").value == "ge", kp = SC.kg[ge ? "ge" : "ru"] || 0, w = +$("pkg").value || 0, e = $("ppr"), pr = kp * w;
    e.hidden = !(kp > 0 && w > 0);
    if (!e.hidden)
        e.textContent = k.est + ": " + pr + " " + SC.cur;
    $("pwa").href = "https://wa.me/995598808022?text=" + encodeURIComponent(k.pmsg + "\n" + k.f + ": " + (ge ? k.ge : k.ru) + "\n" + k.pwhat + ": " + $("pwh").value + (w ? "\n" + k.kgl + ": " + w : "") + (e.hidden ? "" : "\n" + k.est + ": " + pr + " " + SC.cur) + "\n" + k.n + ": " + $("pnm").value + "\n" + k.t + ": " + $("pph").value);
}
["pdir", "pwh", "pkg", "pnm", "pph"].forEach(function (i) {
    $(i).oninput = pupd;
});

// ======================================================================
// 9. ძებნა საიტზე
// ======================================================================

// საძიებო ინდექსი: სია იმისა, რაც საიტზე შეიძლება მოიძებნოს (სათაური, მისამართი, საკვანძო სიტყვები).
function sIdx() {
    var k = T[L], a = [[k.nv0, "#/", "მთავარი главная home"], [k.nv1, "#/buses", "ავტობუსი автобус bus wifi wi-fi usb კონდიციონერი кондиционер air conditioning ფოტო фото photo"], [k.nv2, "#/schedule", "განრიგი расписание schedule დრო время time გასვლა выезд departure"], [k.nv4, "#/parcels", "ამანათი ამანათები посылка посылки parcel parcels delivery გზავნილი"], [k.nv5, "#/info", "პირობები გაუქმება დაბრუნება თანხა ბარგი საბუთები cancel refund terms luggage documents условия возврат отмена багаж документы"], [k.nv3, "#/faq", "კითხვა კითხვები вопрос вопросы faq question"], [k.bk, "#book", "დაჯავშნა бронь бронирование booking book ბილეთი билет ticket ადგილი seat"], [k.ct, "#contact", "კონტაქტი контакты contact ტელეფონი телефон phone whatsapp ნომერი number"], [k.q2, "#/faq", "გადახდა оплата payment ავანსი аванс 25%"], [k.mw, "#/schedule", "მოსკოვი москва moscow annino ანინო анино"]];
    [1, 3, 4, 5, 6].forEach(function (i) {
        a.push([k["q" + i], "#/faq", k["a" + i]]);
    });
    S.forEach(function (s) {
        a.push([s[1][L], "#/schedule", s[1].ka + " " + s[1].ru + " " + s[1].en + " " + s[0]]);
    });
    return a;
}
var qi = $("q"), ql = $("qr"), sel = -1, cur = [];
// ეძებს ინდექსში და აჩვენებს შედეგებს ძებნის ველის ქვეშ.
function find() {
    var v = qi.value.trim().toLowerCase();
    if (!v) {
        ql.hidden = true;
        return;
    }
    var w = v.split(/\s+/);
    cur = sIdx().filter(function (e) {
        var t = (e[0] + " " + e[2]).toLowerCase();
        return w.every(function (x) {
            return t.indexOf(x) >= 0;
        });
    }).slice(0, 7);
    sel = -1;
    ql.innerHTML = cur.length ? cur.map(function (e, i) {
        return '<li data-n="' + i + '">' + e[0] + "</li>";
    }).join("") : '<li class="no">' + T[L].nores + "</li>";
    ql.hidden = false;
}
// შედეგის არჩევა: გადადის შესაბამის გვერდზე.
function pick(e) {
    ql.hidden = true;
    qi.value = "";
    qi.blur();
    var g = e[1];
    if (!SPA && g.indexOf("#/") == 0) {
        var pp = g.slice(2);
        location.href = BASE + (pp ? pp + "/" : "") || "./";
    }
    else {
        location.hash = g;
        route();
    }
}
// ჩანიშნავს არჩეულ შედეგს ისრებით სიაში გადაადგილებისას.
function mark() {
    ql.querySelectorAll("li").forEach(function (li, i) {
        li.classList.toggle("on", i == sel);
    });
}
qi.oninput = find;
qi.onfocus = find;
qi.onkeydown = function (e) {
    if (e.key == "Escape") {
        ql.hidden = true;
    }
    else if (e.key == "ArrowDown" && cur.length) {
        e.preventDefault();
        sel = (sel + 1) % cur.length;
        mark();
    }
    else if (e.key == "ArrowUp" && cur.length) {
        e.preventDefault();
        sel = (sel <= 0 ? cur.length : sel) - 1;
        mark();
    }
    else if (e.key == "Enter" && cur.length && !ql.hidden) {
        e.preventDefault();
        pick(cur[sel >= 0 ? sel : 0]);
    }
};
ql.onmousedown = function (e) {
    e.preventDefault();
    var li = e.target.closest("li[data-n]");
    if (li)
        pick(cur[+li.dataset.n]);
};
document.addEventListener("click", function (e) {
    if (!e.target.closest(".sr"))
        ql.hidden = true;
});
(function () {
    var vs = document.querySelectorAll(".vb"), t = false;
    function up() {
        t = false;
        vs.forEach(function (b) {
            var r = b.parentNode.getBoundingClientRect(), h = innerHeight;
            if (r.bottom < 0 || r.top > h)
                return;
            b.style.transform = "translateY(" + (((r.top + r.height / 2 - h / 2) / h) * -44) + "px)";
        });
    }
    if (!matchMedia("(prefers-reduced-motion:reduce)").matches) {
        addEventListener("scroll", function () {
            if (!t) {
                t = true;
                requestAnimationFrame(up);
            }
        }, { passive: true });
        addEventListener("hashchange", function () {
            setTimeout(up, 60);
        });
        up();
    }
})();

// ======================================================================
// 10. დამატებითი: ფასები, ზედა ზოლი, შეფასებები
// ======================================================================

// უსაფრთხო ტექსტი: HTML სიმბოლოებს აქცევს ჩვეულებრივ ტექსტად.
function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
        return {
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
        }[c];
    });
}
// 📍 რუკის ბმული. თუ ბმული მითითებულია (u), იყენებს მას, თუ არა, ეძებს სახელით.
function mp(q, u) {
    return ' <a class="mp" target="_blank" rel="noopener" aria-label="map" href="' + (u ? esc(u) : "https://www.google.com/maps/search/?api=1&amp;query=" + encodeURIComponent(q)) + '">📍</a>';
}
// ჯამი და ავანსი (25%) მგზავრების რაოდენობის მიხედვით. თუ ფასი 0-ია, აბრუნებს null-ს.
function pinfo() {
    var ge = $("dir").value == "ge", p = SC.price[ge ? "ge" : "ru"] || 0, n = +$("px").value || 1;
    return p > 0 ? {
        tot: p * n, dep: Math.ceil(p * n / 4)
    } : null;
}
// რუკის ბმული არჩეული გაჩერებისთვის.
function stm() {
    var a = $("stm"), i = +$("st").value || 0, u = SC.maps[i];
    a.href = u || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S[i][1].en);
    a.textContent = "📍 " + T[L].mapl;
}
// აჩვენებს ჯამს და ავანსს ფორმაში.
function prShow() {
    stm();
    var k = T[L], pi = pinfo(), e = $("pr");
    e.hidden = !pi;
    if (pi)
        e.textContent = k.tot + ": " + pi.tot + " " + SC.cur + " · " + k.dep + ": " + pi.dep + " " + SC.cur;
}
// ავსებს დამატებით ბლოკებს: ფასები, შეფასებები, ზედა ზოლი, პირობების გვერდი.
function renderX() {
    var k = T[L], c = SC.cur, h = "";
    [["ge", k.ge], ["ru", k.ru]].forEach(function (x) {
        if (SC.price[x[0]] > 0)
            h += "<li>" + x[1] + ": <b>" + SC.price[x[0]] + " " + c + "</b> " + k.per + "</li>";
        if (SC.kg[x[0]] > 0)
            h += "<li>" + k.pkg + " · " + x[1] + ": <b>" + SC.kg[x[0]] + " " + c + "</b></li>";
    });
    $("pl").innerHTML = h ? '<h2 style="margin-top:32px">' + k.prh + '</h2><ul class="dl">' + h + "</ul>" : "";
    var rv = SC.reviews;
    $("rvs").hidden = !rv.length;
    $("rvl").innerHTML = rv.map(function (r) {
        return "<blockquote><p>" + esc(r.t) + "</p><cite>— " + esc(r.n) + "</cite></blockquote>";
    }).join("");
    var nt = SC.notice[L] || SC.notice.ka || "", ds = "";
    try {
        ds = localStorage.getItem("nbx");
    }
    catch (e) { }
    $("nbt").textContent = nt;
    $("nb").hidden = !nt || ds == nt;
    var f = (SC.info[L] || SC.info.ka || "").trim();
    $("inf").innerHTML = f ? f.split(/\n\s*\n/).map(function (p) {
        return "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>";
    }).join("") : "<p>" + k.noinfo + "</p>";
}
$("nbx").onclick = function () {
    try {
        localStorage.setItem("nbx", $("nbt").textContent);
    }
    catch (e) { }
    $("nb").hidden = true;
};
// ======================================================================
// 12. ადმინ-პანელი (გახსენი: #/admin)
// აქ ცვლი განრიგს, ფასებს და ტექსტებს, მერე ჩამოტვირთავ ფაილს.
// ======================================================================

var AC = JSON.parse(JSON.stringify(SC)), DN = [["ორშ", 1], ["სამ", 2], ["ოთხ", 3], ["ხუთ", 4], ["პარ", 5], ["შაბ", 6], ["კვი", 0]];
// ადმინ-გვერდზე აგენებს ახალ schedule-config.js ფაილს გადმოსაწერად.
function sout() {
    var t = "/* განრიგის პარამეტრები */\nwindow.SCHEDULE=" + JSON.stringify(AC) + ";\n";
    $("sout").value = t;
    $("sdl").href = "data:text/javascript;charset=utf-8," + encodeURIComponent(t);
}
// ადმინ-გვერდის ფორმა: განრიგი, ფასები, ტექსტები, შეფასებები, რუკები.
function acr() {
    var h = "";
    ["ge", "ru"].forEach(function (k) {
        h += "<h3>" + (k == "ge" ? "გასვლა საქართველოდან" : "გასვლა მოსკოვიდან") + ": დღეები</h3><div class=dys>" + DN.map(function (d) {
            return '<label><input type=checkbox data-k="' + k + '" data-d="' + d[1] + '"' + (AC.days[k].indexOf(d[1]) >= 0 ? " checked" : "") + "> " + d[0] + "</label>";
        }).join("") + "</div>";
    });
    h += "<h3>დროები საქართველოდან (პირველი გაჩერებიდან ბოლომდე)</h3><div class=tms>" + S.map(function (s, i) {
        return "<label>" + s[1].ka + '<input type=time data-s="' + i + '" value="' + AC.stops[i] + '"></label>';
    }).join("") + "</div>";
    h += '<label>მოსკოვიდან გასვლის დრო (არასავალდებულო)<input type=time id=art value="' + AC.ruTime + '"></label>';
    h += '<h3>ცალკეული ცვლილება (გაუქმება, გადატანა, დამატება)</h3><div class=chg><label>მიმართულება<select id=cd1><option value=ge>საქართველო → მოსკოვი</option><option value=ru>მოსკოვი → საქართველო</option></select></label><label>ძველი თარიღი<input type=date id=cd2></label><label>ახალი თარიღი<input type=date id=cd3></label><label>ახალი დრო<input type=time id=cd4></label></div>';
    h += '<p><button type=button class=btn data-a=cancel>გაუქმება</button> <button type=button class=btn data-a=move>გადატანა / დამატება</button></p><ul class=dl>' + AC.cancel.map(function (c, i) {
        return "<li>❌ გაუქმებულია: " + c + ' <button type=button data-rc="' + i + '">×</button></li>';
    }).join("") + AC.add.map(function (a, i) {
        return "<li>➕ დამატებულია: " + a.k + "-" + a.date + (a.time ? " " + a.time : "") + ' <button type=button data-ra="' + i + '">×</button></li>';
    }).join("") + "</ul>";
    h += '<h3>ფასები (0 = არ ჩანს საიტზე)</h3><div class=tms><label>ვალუტა (₾, $, ₽)<input data-cur value="' + esc(AC.cur) + '"></label><label>საქართველო→მოსკოვი, ერთ ადგილზე<input type=number min=0 data-pg=ge value="' + AC.price.ge + '"></label><label>მოსკოვი→საქართველო, ერთ ადგილზე<input type=number min=0 data-pg=ru value="' + AC.price.ru + '"></label><label>ამანათი 1 კგ, საქართველო→მოსკოვი<input type=number min=0 data-kg=ge value="' + AC.kg.ge + '"></label><label>ამანათი 1 კგ, მოსკოვი→საქართველო<input type=number min=0 data-kg=ru value="' + AC.kg.ru + '"></label></div>';
    h += '<h3>გაფრთხილების ზოლი ზემოთ (ცარიელი = არ ჩანს)</h3><div class=tms>' + ["ka", "ru", "en"].map(function (l) {
        return "<label>" + l.toUpperCase() + '<input data-nt="' + l + '" value="' + esc(AC.notice[l]) + '"></label>';
    }).join("") + "</div>";
    h += '<h3>პირობები და ინფორმაცია: გაუქმება, ბარგი, საბუთები (აბზაცები ცარიელი ხაზით გამოყავი)</h3>' + ["ka", "ru", "en"].map(function (l) {
        return "<label>" + l.toUpperCase() + '<textarea rows=4 data-if="' + l + '">' + esc(AC.info[l]) + "</textarea></label>";
    }).join("");
    h += '<h3>მგზავრების შეფასებები (მხოლოდ რეალური)</h3><div class=chg><label>სახელი<input id=rvn></label><label>შეფასება<input id=rvt></label></div><p><button type=button class=btn data-a=rvadd>დამატება</button></p><ul class=dl>' + AC.reviews.map(function (r, i) {
        return "<li>" + esc(r.n) + ": " + esc(r.t) + ' <button type=button data-rr="' + i + '">×</button></li>';
    }).join("") + "</ul>";
    h += "<h3>რუკის ბმულები გაჩერებებისთვის (Google Maps)</h3><div class=tms>" + S.map(function (s, i) {
        return "<label>" + s[1].ka + '<input data-mp="' + i + '" value="' + esc(AC.maps[i] || "") + '"></label>';
    }).join("") + '<label>მოსკოვი<input data-mp=m value="' + esc(AC.maps.m || "") + '"></label></div>';
    h += '<h3>Google Analytics ID (მაგ. G-XXXXXXXXXX, არასავალდებულო)</h3><label><input data-ga value="' + esc(AC.ga) + '"></label>';
    $("sched").innerHTML = h;
    sout();
}
// ადმინ-გვერდზე შეყვანილ მნიშვნელობას ინახავს შესაბამის პარამეტრში.
function sset(t) {
    var d = t.dataset;
    if (d.d != null) {
        var a = AC.days[d.k], v = +d.d, i = a.indexOf(v);
        if (t.checked && i < 0)
            a.push(v);
        if (!t.checked && i >= 0)
            a.splice(i, 1);
    }
    else if (d.s != null)
        AC.stops[+d.s] = t.value;
    else if (t.id == "art")
        AC.ruTime = t.value;
    else if (d.cur != null)
        AC.cur = t.value;
    else if (d.pg)
        AC.price[d.pg] = +t.value || 0;
    else if (d.kg)
        AC.kg[d.kg] = +t.value || 0;
    else if (d.nt)
        AC.notice[d.nt] = t.value;
    else if (d["if"])
        AC.info[d["if"]] = t.value;
    else if (d.mp != null)
        AC.maps[d.mp] = t.value;
    else if (d.ga != null)
        AC.ga = t.value;
    sout();
}
$("sched").onchange = $("sched").oninput = function (e) {
    sset(e.target);
};
$("sched").onclick = function (e) {
    var b = e.target.closest("button");
    if (!b)
        return;
    var k = $("cd1").value, o = $("cd2").value, n = $("cd3").value, tm = $("cd4").value, d = b.dataset;
    if (d.a == "cancel" && o)
        AC.cancel.push(k + "-" + o);
    else if (d.a == "move" && n) {
        if (o)
            AC.cancel.push(k + "-" + o);
        AC.add.push({
            k: k, date: n, time: tm
        });
    }
    else if (d.rc != null)
        AC.cancel.splice(+d.rc, 1);
    else if (d.ra != null)
        AC.add.splice(+d.ra, 1);
    else if (d.a == "rvadd" && $("rvn").value && $("rvt").value)
        AC.reviews.push({
            n: $("rvn").value, t: $("rvt").value
        });
    else if (d.rr != null)
        AC.reviews.splice(+d.rr, 1);
    else
        return;
    acr();
};
acr();

// ======================================================================
// 13. სტატისტიკა (Google Analytics, არასავალდებულო)
// ======================================================================

if (SC.ga) {
    var gs = document.createElement("script");
    gs.async = 1;
    gs.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(SC.ga);
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        dataLayer.push(arguments);
    };
    gtag("js", new Date());
    gtag("config", SC.ga);
}
document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || !window.gtag)
        return;
    if (a.href.indexOf("wa.me") > 0)
        gtag("event", "whatsapp_click");
    else if (a.href.indexOf("tel:") == 0)
        gtag("event", "phone_click");
});

// ======================================================================
// 14. გაშვება
// ======================================================================

window.onhashchange = route;
(function () {
    var els = document.querySelectorAll(".band .w,.vc");
    if (!("IntersectionObserver" in window)) {
        els.forEach(function (e) {
            e.classList.add("rv", "in");
        });
        return;
    }
    var io = new IntersectionObserver(function (a) {
        a.forEach(function (x) {
            if (x.isIntersecting) {
                x.target.classList.add("in");
                io.unobserve(x.target);
            }
        });
    }, { threshold: .12 });
    els.forEach(function (e) {
        e.classList.add("rv");
        io.observe(e);
    });
})();
render();
setInterval(cd, 6e4);
