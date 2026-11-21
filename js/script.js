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
   15. ახალი დიზაინის ღილაკები (მიმართულება, მგზავრები, ძებნა, მოძრავი ავტობუსი)

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
        brand: "Имерети Тур", h: "Грузия–Москва: безопасно и удобно", sub: "Регулярные рейсы в обе стороны и быстрая доставка посылок.", nx1: "Ближайший выезд из Грузии", nx2: "Ближайший выезд из Москвы", cta: "Забронировать", rt: "Маршрут", bk: "Бронирование места", dir: "Направление", d1o: "Грузия → Москва", d2o: "Москва → Грузия", dt: "Дата", st1: "Остановка посадки", st2: "Остановка высадки", px: "Пассажиры", nm: "Имя", ph: "Телефон", send: "Отправить в WhatsApp", q6: "Можно ли отменить бронирование?", a6: "Да. При отмене мы возвращаем уплаченную сумму. Напишите нам в WhatsApp.", mapl: "Показать на карте", sl2: "Осталось мест: {n}", sf: "Мест нет", tot: "Итого", dep: "Аванс (25%)", per: "за место", pkg: "Посылка, 1 кг", prh: "Цены", rvh: "Отзывы пассажиров", noinfo: "Информация скоро появится. Напишите нам в WhatsApp.", nv5: "Условия", kgl: "Вес (кг)", est: "Ориентировочная цена", prt: "Печать / PDF", tkh: "Заявка на бронирование. Для подтверждения напишите в WhatsApp.", fg: "Из Грузии", rtl: "Из Москвы", stt: "Выберите места", ssh: "Места ещё не выбраны", ssl: "Выбранные места", sl: "Места", lf: "Свободно", ls: "Выбрано", lt: "Занято", snote: "Место закрепляется после внесения аванса и подтверждения.", vt1: "От гор до больших городов", vt2: "Ваш путь из Грузии в Москву", tag: "Грузия–Москва", sp: "Поиск по сайту...", nores: "Ничего не найдено", nv4: "Посылки", more: "Подробнее о посылках", mw: "Москва", pt: "Перевозка посылок Грузия–Москва", ps: "Быстрая и безопасная отправка посылок регулярными рейсами автобусов в обе стороны.", f1: "Быстро", f1t: "Посылка уходит ближайшим рейсом, регулярно в обе стороны.", f2: "Надёжно", f2t: "Мы заботимся о безопасной перевозке вашей посылки.", f3: "В обе стороны", f3t: "Из Грузии в Москву и из Москвы в Грузию.", f4: "Удобные остановки", f4t: "Батуми, Кобулети, Поти, Кутаиси, Тбилиси и Москва.", how: "Как отправить", s1: "Напишите нам в WhatsApp: направление и что нужно отправить.", s2: "Мы подтвердим условия, остановку и время передачи.", s3: "Посылка едет ближайшим рейсом, получатель забирает её в пункте назначения.", pts: "Остановки", pform: "Отправьте заявку", pwhat: "Что отправляете", pmsg: "Здравствуйте! Хочу отправить посылку.", nv0: "Главная", nv1: "Автобусы", nv2: "Расписание", nv3: "Вопросы", bh: "Наши автобусы", bsub: "Комфортные автобусы и надёжный сервис в дальней дороге.", amh: "Что вас ждёт в пути", am1: "Комфортные автобусы", am2: "Безопасный и надёжный сервис", am3: "Кондиционер", am5: "USB-зарядка", sh: "Расписание выездов", fh: "Частые вопросы", q1: "Как забронировать место?", a1: "Заполните форму на главной странице и отправьте в WhatsApp, либо позвоните по нашим номерам.", q2: "Сколько нужно оплатить при бронировании?", a2: "Минимум 25%. При желании можно оплатить полностью.", q3: "В какие дни идут рейсы?", a3: "Из Грузии по средам и субботам, из Москвы по вторникам и субботам.", q4: "Перевозите ли вы посылки?", a4: "Да, в обоих направлениях. Подробности уточняйте по телефону или в мессенджере.", q5: "Где можно сесть в автобус?", a5: "Батуми, Кобулети, Поти, Кутаиси, Тбилиси. В Москве у метро «Аннино».", pay: "Оплата", pay1: "Минимум 25% заранее", pay2: "100% полностью", note: "При бронировании необходимо внести минимум 25% стоимости или оплатить полностью. Реквизиты для оплаты пришлём в WhatsApp. При отмене бронирования деньги возвращаем.", pm: "Оплата", pc: "Посылки", pct: "Быстро и безопасно перевозим посылки в обоих направлениях Грузия–Москва.", ct: "Контакты", ofk: "Офис в Кобулети", ofp: "Офис в Поти", wd: "Выезд: среда и суббота", ret: "Из Москвы: вторник и суббота", msk: "Москва, метро «Аннино» (МКАД 33 км, владение 6, стр. 5)", d: "дн", hh: "ч", mm: "мин", lc: "ru-RU", msg: "Здравствуйте! Хочу забронировать место.", f: "Направление", w: "Дата", s: "Остановка", p: "Пассажиры", n: "Имя", t: "Телефон", ge: "Грузия → Москва", ru: "Москва → Грузия"
    },
    en: {
        brand: "Imereti Tour", h: "Georgia–Moscow, safe and comfortable", sub: "Regular trips both ways and fast, secure parcel delivery.", nx1: "Next departure from Georgia", nx2: "Next departure from Moscow", cta: "Book a seat", rt: "Route", bk: "Book a seat", dir: "Direction", d1o: "Georgia → Moscow", d2o: "Moscow → Georgia", dt: "Date", st1: "Pickup stop", st2: "Drop-off stop", px: "Passengers", nm: "Name", ph: "Phone", send: "Send via WhatsApp", q6: "Can I cancel my booking?", a6: "Yes. If you cancel, we refund the amount you paid. Message us on WhatsApp.", mapl: "View on map", sl2: "{n} seats left", sf: "Sold out", tot: "Total", dep: "Advance (25%)", per: "per seat", pkg: "Parcel, 1 kg", prh: "Prices", rvh: "Passenger reviews", noinfo: "Information coming soon. Message us on WhatsApp.", nv5: "Terms", kgl: "Weight (kg)", est: "Estimated price", prt: "Print / PDF", tkh: "Booking request. Please confirm via WhatsApp.", fg: "From Georgia", rtl: "From Moscow", stt: "Choose your seats", ssh: "No seats selected yet", ssl: "Selected seats", sl: "Seats", lf: "Free", ls: "Selected", lt: "Taken", snote: "A seat is secured once the advance payment is made and confirmed.", vt1: "From mountains to big cities", vt2: "Your way from Georgia to Moscow", tag: "Georgia–Moscow", sp: "Search the site...", nores: "Nothing found", nv4: "Parcels", more: "More about parcels", mw: "Moscow", pt: "Parcel delivery Georgia–Moscow", ps: "Fast, secure parcel delivery on our regular bus trips, in both directions.", f1: "Fast", f1t: "Your parcel goes on the next trip, regularly in both directions.", f2: "Secure", f2t: "We take care of transporting your parcel safely.", f3: "Both directions", f3t: "From Georgia to Moscow and from Moscow to Georgia.", f4: "Convenient stops", f4t: "Batumi, Kobuleti, Poti, Kutaisi, Tbilisi and Moscow.", how: "How to send", s1: "Message us on WhatsApp: direction and what you want to send.", s2: "We confirm the terms, the stop and the handover time.", s3: "The parcel travels on the next trip and the recipient collects it at the destination.", pts: "Stops", pform: "Send a request", pwhat: "What are you sending", pmsg: "Hello! I would like to send a parcel.", nv0: "Home", nv1: "Buses", nv2: "Schedule", nv3: "FAQ", bh: "Our buses", bsub: "Comfortable buses and reliable service on the long road.", amh: "What you get on board", am1: "Comfortable buses", am2: "Safe and reliable service", am3: "Air conditioning", am5: "USB charging", sh: "Departure schedule", fh: "Frequently asked questions", q1: "How do I book a seat?", a1: "Fill in the form on the home page and send it via WhatsApp, or call our numbers.", q2: "How much do I pay when booking?", a2: "At least 25%. You can also pay the full amount.", q3: "Which days do buses run?", a3: "From Georgia on Wednesdays and Saturdays, from Moscow on Tuesdays and Saturdays.", q4: "Do you carry parcels?", a4: "Yes, in both directions. Call or message us for details.", q5: "Where can I board?", a5: "Batumi, Kobuleti, Poti, Kutaisi, Tbilisi. In Moscow at metro Annino.", pay: "Payment", pay1: "At least 25% in advance", pay2: "100% in full", note: "To confirm a booking you must pay at least 25% in advance, or you can pay the full amount. We will send payment details via WhatsApp. If you cancel, we refund your money.", pm: "Payment", pc: "Parcels", pct: "We deliver parcels fast and securely in both directions between Georgia and Moscow.", ct: "Contact", ofk: "Kobuleti office", ofp: "Poti office", wd: "Departures: Wednesday and Saturday", ret: "From Moscow: Tuesday and Saturday", msk: "Moscow, metro Annino (MKAD 33 km, 6 vladenie, building 5)", d: "d", hh: "h", mm: "min", lc: "en-GB", msg: "Hello! I would like to book a seat.", f: "Direction", w: "Date", s: "Stop", p: "Passengers", n: "Name", t: "Phone", ge: "Georgia → Moscow", ru: "Moscow → Georgia"
    }
};
// ახალი დიზაინის ტექსტები (მთავარი ეკრანი, ბილეთი, ბარათები). ემატება ზემოთა სიებს.
var T2 = {
    ka: { cGe: "საქართველო", cMo: "მოსკოვი", hsub: "რეგულარული რეისები ორივე მიმართულებით. დაჯავშნე ადგილი 1 წუთში, რეგისტრაციის გარეშე.", cdD: "დღე", cdH: "საათი", cdM: "წუთი", cdS: "წამი", fr: "საიდან", to: "სად", swp: "მიმართულების შეცვლა", hw: "სამი ნაბიჯი და ადგილი შენია", hw1: "აირჩიე თარიღი", hw1t: "უახლოესი რეისები ორივე მიმართულებით.", hw2: "მიუთითე გაჩერება", hw2t: "ბათუმი, ქობულეთი, ფოთი, ქუთაისი, თბილისი.", hw3: "გაგზავნე", hw3t: "ჯავშანი WhatsApp-ში მოგვდის და მალევე გიდასტურებთ.", whyt: "ნამდვილი ავტობუსები, ნამდვილი კომფორტი", c1: "თანამედროვე ავტობუსები", c1t: "კონდიციონერი · USB დამტენი", c2: "რბილი სავარძლები", c2t: "გრძელი გზისთვის", c3t: "ორივე მიმართულებით" },
    ru: { cGe: "Грузия", cMo: "Москва", hsub: "Регулярные рейсы в обе стороны. Забронируйте место за 1 минуту, без регистрации.", cdD: "дн.", cdH: "час.", cdM: "мин.", cdS: "сек.", fr: "Откуда", to: "Куда", swp: "Сменить направление", hw: "Три шага — и место ваше", hw1: "Выберите дату", hw1t: "Ближайшие рейсы в обе стороны.", hw2: "Укажите остановку", hw2t: "Батуми, Кобулети, Поти, Кутаиси, Тбилиси.", hw3: "Отправьте", hw3t: "Заявка приходит нам в WhatsApp, и мы быстро подтверждаем.", whyt: "Настоящие автобусы, настоящий комфорт", c1: "Современные автобусы", c1t: "Кондиционер · USB-зарядка", c2: "Удобные кресла", c2t: "для долгой дороги", c3t: "в обе стороны" },
    en: { cGe: "Georgia", cMo: "Moscow", hsub: "Regular trips both ways. Book a seat in 1 minute, no sign-up.", cdD: "days", cdH: "hours", cdM: "min", cdS: "sec", fr: "From", to: "To", swp: "Swap direction", hw: "Three steps and the seat is yours", hw1: "Pick a date", hw1t: "Upcoming trips in both directions.", hw2: "Choose your stop", hw2t: "Batumi, Kobuleti, Poti, Kutaisi, Tbilisi.", hw3: "Send", hw3t: "Your request reaches us on WhatsApp and we confirm shortly.", whyt: "Real buses, real comfort", c1: "Modern buses", c1t: "Air conditioning · USB charging", c2: "Comfortable seats", c2t: "for the long road", c3t: "both directions" }
};
// 3D მოგზაურობის, რიცხვების და რეკლამის ტექსტები (js/fx.js იყენებს)
var T3 = {
    ka: { nyN: "ახალი წელი სახლში", nyH: "ახალი წელი სახლში — ავტობუსით მოსკოვიდან საქართველოში", nyS: "დეკემბრის რეისები მოსკოვიდან ბათუმამდე, ქობულეთამდე, ფოთამდე, ქუთაისამდე და თბილისამდე. დაჯავშნეთ წინასწარ.", nyA: "მოსკოვიდან — ახალ წლამდე", nyB: "უკან მოსკოვში — დღესასწაულების შემდეგ", ny1h: "რატომ ავტობუსით", ny1a: "პირდაპირ თქვენს ქალაქამდე: ბათუმი, ქობულეთი, ფოთი, ქუთაისი, თბილისი.", ny1b: "საჩუქრები და ამანათები ოჯახისთვის შეგიძლიათ ჩვენი რეისით გამოაგზავნოთ.", ny1c: "დაჯავშნა ონლაინ, ავანსი — მინიმუმ 25%. გაუქმების შემთხვევაში თანხას გიბრუნებთ.", ny2h: "რჩევები გზის წინ", ny2a: "დღესასწაულების წინ ადგილი წინასწარ დაჯავშნეთ.", ny2b: "ზამთარში ზემო ლარსზე გზა ზოგჯერ დროებით იკეტება ამინდის გამო — ასეთ შემთხვევაში წინასწარ გაცნობებთ.", ny2c: "საბუთები თან იქონიეთ და არა ბარგში.", nyL: "ზემო ლარსის რჩევები", nySh: "გაუზიარეთ ოჯახს", nyCp: "ლინკი დაკოპირდა", nyBn: "ახალი წელი სახლში — დეკემბრის რეისები მოსკოვიდან", nyMsg: "ახალი წელი სახლში — ავტობუსი მოსკოვიდან საქართველოში:", gd0: "ახალი წელი სახლში", gd0t: "დეკემბრის რეისები მოსკოვიდან საქართველოში", gdK: "სასარგებლო", gdH: "სანამ გაემგზავრებით", gd1: "ავტობუსის დაქირავება", gd1t: "ექსკურსიები, ქორწილები, ჯგუფები — საქართველოში და ევროპაში", gd2: "ზემო ლარსი: რჩევები", gd2t: "საბუთები, რიგები და რა უნდა იცოდეთ საზღვარზე", gd3: "ამანათი მოსკოვში", gd3t: "როგორ გავაგზავნოთ: ნაბიჯები, ფასი, რჩევები", gdR: "წაიკითხეთ", pgN: "ამანათი მოსკოვში: გზამკვლევი", pgH: "ამანათის გაგზავნა მოსკოვში და მოსკოვიდან საქართველოში", pgS: "როგორ გავაგზავნოთ ამანათი ავტობუსით: ნაბიჯები, ფასი და რჩევები.", pg1h: "როგორ მუშაობს", pg1a: "მოგვწერეთ WhatsApp-ზე ან შეავსეთ ფორმა საიტზე: რას აგზავნით, დაახლოებითი წონა, საიდან და სად.", pg1b: "გეტყვით ფასს და ამანათის ჩაბარების ადგილსა და დროს.", pg1c: "ამანათს ავტობუსის გასვლისას გადმოგვცემთ. ის რეგულარული რეისით მიდის.", pg1d: "მიმღები ამანათს თავის ქალაქში იღებს.", pg3h: "როდის მიდის ამანათი", pg3: "ამანათი მიდის ჩვეულებრივი რეისით: საქართველოდან — ოთხშაბათს და შაბათს, მოსკოვიდან — სამშაბათს და შაბათს. ზუსტი თარიღები იხილეთ განრიგში.", pg4h: "რა ღირს", pg4: "ფასი დამოკიდებულია წონასა და ზომაზე. ზუსტ ფასს გეტყვით WhatsApp-ზე ან ამანათების გვერდზე ფორმის შევსების შემდეგ.", pg5h: "რჩევები", pg5a: "კარგად შეფუთეთ და მსხვრევადი ნივთის შესახებ წინასწარ გაგვაფრთხილეთ.", pg5b: "ამანათზე დაწერეთ მიმღების სახელი და ტელეფონის ნომერი.", pg5c: "კანონით აკრძალული ნივთები (იარაღი, ნარკოტიკები, ადვილად აალებადი ნივთიერებები) არ მიიღება. მედიკამენტების, სითხეებისა და ძვირფასი ნივთების შესახებ წინასწარ გვკითხეთ.", pg6: "ამანათის გასაგზავნად გადადით ამანათების გვერდზე ან მოგვწერეთ WhatsApp-ზე.", pgB: "ამანათის გაგზავნა", nv6: "დაქირავება", cpH: "ავტობუსის დაქირავება", cpS: "ავტობუსის დაქირავება — საქართველოს მასშტაბით, ევროპაში და სხვა ქვეყნებში.", cpHow: "როგორ დავჯავშნოთ", cs1: "მოგვწერეთ", cs1t: "WhatsApp-ზე მოგვწერეთ მარშრუტი, თარიღი და მგზავრების რაოდენობა.", cs2: "გაიგეთ ფასი", cs2t: "დეტალების მიხედვით გეტყვით ფასს და პირობებს.", cs3: "იმგზავრეთ", cs3t: "დათქმულ დროს ავტობუსი დაგხვდებათ შეთანხმებულ ადგილას.", cpFq: "ხშირი კითხვები", cq1: "რა ღირს ავტობუსის დაქირავება?", ca1: "ფასი დამოკიდებულია მარშრუტზე, მანძილზე და დღეების რაოდენობაზე. მოგვწერეთ დეტალები და ზუსტ ფასს გეტყვით.", cq2: "შეიძლება საზღვარგარეთ წასვლა?", ca2: "დიახ — ევროპაში და სხვა ქვეყნებში, წინასწარი შეთანხმებით.", cq3: "რამდენი ხნით ადრე უნდა დავჯავშნო?", ca3: "რაც უფრო ადრე, მით უკეთესი — განსაკუთრებით ზაფხულში და დღესასწაულებზე. გადაუდებელი შეკვეთისთვის დაგვირეკეთ.", laN: "ზემო ლარსი: რჩევები", laH: "ზემო ლარსის გადაკვეთა: საბუთები და რჩევები", laS: "რა უნდა იცოდეთ ავტობუსით საქართველოდან რუსეთში და უკან მგზავრობისას.", la1h: "რა არის ზემო ლარსი", la1: "ზემო ლარსი არის მთავარი სახმელეთო გადასასვლელი საქართველოსა და რუსეთს შორის, საქართველოს სამხედრო გზაზე, ყაზბეგის მუნიციპალიტეტში. ჩვენი ავტობუსი ამ გზით მიდის: საქართველოს ქალაქებიდან ზემო ლარსის გავლით ვლადიკავკაზისკენ და შემდეგ მოსკოვამდე.", la2h: "რა საბუთები გჭირდებათ", la2a: "საქართველოს მოქალაქეებს რუსეთში შესასვლელად ვიზა არ სჭირდებათ (უვიზო რეჟიმი 2023 წლიდან მოქმედებს). თან იქონიეთ მოქმედი პასპორტი.", la2b: "უცხო ქვეყნის მოქალაქეებს, მათ შორის რუსეთის მოქალაქეებს, 2026 წლის 1 იანვრიდან საქართველოში შესასვლელად სჭირდებათ სამედიცინო დაზღვევა მთელი ვიზიტის ვადით (დაფარვა მინიმუმ 30 000 ლარი).", la2c: "წესები შეიძლება შეიცვალოს — გამგზავრებამდე გადაამოწმეთ ოფიციალურ წყაროებში ან დაგვირეკეთ.", la3h: "პრაქტიკული რჩევები", la3a: "ზაფხულში და დღესასწაულებზე საზღვარზე რიგი შეიძლება რამდენიმე საათი გაგრძელდეს — თან იქონიეთ წყალი და საჭმელი.", la3b: "გზა მთაზე გადის და ზაფხულშიც კი შეიძლება ციოდეს — თბილი ტანსაცმელი ხელთ გქონდეთ.", la3c: "ზამთარში გზა ზოგჯერ დროებით იკეტება ამინდის გამო. ასეთ შემთხვევაში წინასწარ გაცნობებთ.", la3d: "საბუთები ყოველთვის თან გქონდეთ და არა ბარგში.", la3e: "უცნობი ადამიანისგან ნივთს ან ამანათს ნუ გაიტანთ — მის შიგთავსზე პასუხს თქვენ აგებთ.", la4: "განრიგი და დაჯავშნა — ამ საიტზე. კითხვებისთვის მოგვწერეთ WhatsApp-ზე.", chH: "ავტობუსის დაქირავება", chT: "დაიქირავეთ ავტობუსი ნებისმიერი მიზნით და მიმართულებით — ექსკურსიებზე, ღონისძიებებზე, საქართველოს მასშტაბით და მის ფარგლებს გარეთ: ევროპაში და სხვა ქვეყნებში.", ch1: "ექსკურსიები და ტურები საქართველოს მასშტაბით", ch2: "ქორწილები, დაბადების დღეები და ღონისძიებები", ch3: "კორპორატიული, სასკოლო და ჯგუფური მგზავრობა", ch4: "ტრანსფერები: აეროპორტი, სადგური, სასტუმრო", ch5: "საერთაშორისო რეისები: ევროპა და სხვა ქვეყნები", ch6: "ფასი შეთანხმებით — მოგვწერეთ მარშრუტი და თარიღი", chC: "დარეკვა", chM: "გამარჯობა! მინდა ავტობუსის დაქირავება. მარშრუტი და თარიღი: ", scrl: "გადაახვიე და იმოგზაურე", trk: "მოგზაურობა", j0: "ზღვის სანაპიროდან იწყება გზა.", j1: "სანაპიროს გასწვრივ, ჩრდილოეთისკენ.", j2: "ნავსადგური და კოლხეთის დაბლობი.", j3: "იმერეთის გული, ჩვენი სახლი.", j4: "დედაქალაქი, ბოლო გაჩერება საქართველოში.", jL: "ზემო ლარსი", jLt: "კავკასიონის მთები და საზღვარი.", jMt: "ფინიში. კეთილი იყოს თქვენი მობრძანება!", stp: "გაჩერება", st_s: "გაჩერება საქართველოში", st_w: "რეისი კვირაში", st_d: "მიმართულება", st_l: "ენა საიტზე", w3: "ნამდვილი ფოტოები, ჩვენი ავტობუსები", spin: "გადაატრიალე ან გადაახვიე", adk: "პარტნიორები", adh: "შენი ბიზნესი მგზავრების თვალწინ", adl: "რეკლამა", adf: "აქ შეიძლება იყოს თქვენი რეკლამა", adft: "სასტუმრო, რესტორანი, მაღაზია თუ სერვისი: განათავსე რეკლამა იმერეთი ტურის საიტზე.", adb: "რეკლამის განთავსება", adm: "გამარჯობა! მინდა რეკლამის განთავსება იმერეთი ტურის საიტზე.", adv: "ნახვა", ads2: "სარეკლამო ადგილი", rvk: "შეფასებები", rve: "ჯერ შეფასება არ არის. იყავი პირველი!", rvw: "დატოვე შეფასება", rvc: "ქალაქი", rvt2: "შენი შთაბეჭდილება მგზავრობაზე", rvb: "გაგზავნა", rvok: "მადლობა! შეფასება საიტზე გამოჩნდება შემოწმების შემდეგ.", rver: "ჩაწერე სახელი და კომენტარი.", rvn: "შეფასება", wk: "უახლოესი რეისები", mapH: "გაჩერებები რუკაზე", bmN: "ბათუმი: ოფისი", bmA: "ბაქოს ქუჩა 8", ktN: "ქუთაისიდან გასვლა", ktA: "ლადო ასათიანის ქ. 98, ქუთაისი, ლუკოილზე", tbN: "თბილისიდან გასვლა", tbA: "დავით აღმაშენებლის ხეივანი 29, მარი მარკეტთან", mwN: "მოსკოვი: ჩასვლა და გასვლა", mwA: "მეტრო „ანინო“, МКАД 33 км, владение 6, стр. 5", mpo: "გახსენი Google Maps-ში" },
    ru: { nyN: "Новый год дома", nyH: "Новый год — дома, в Грузии: автобус из Москвы", nyS: "Рейсы в декабре из Москвы в Батуми, Кобулети, Поти, Кутаиси и Тбилиси. Бронируйте заранее.", nyA: "Из Москвы — до Нового года", nyB: "Обратно в Москву — после праздников", ny1h: "Почему на автобусе", ny1a: "Прямо до вашего города: Батуми, Кобулети, Поти, Кутаиси, Тбилиси.", ny1b: "Подарки и посылки родным можно отправить нашим рейсом.", ny1c: "Бронирование онлайн, аванс — от 25%. При отмене возвращаем деньги.", ny2h: "Советы перед поездкой", ny2a: "Перед праздниками бронируйте место заранее.", ny2b: "Зимой дорогу через Верхний Ларс иногда временно закрывают из-за погоды — в таком случае мы предупредим вас заранее.", ny2c: "Документы держите при себе, а не в багаже.", nyL: "Советы для Верхнего Ларса", nySh: "Поделиться с родными", nyCp: "Ссылка скопирована", nyBn: "Новый год дома — рейсы в декабре из Москвы", nyMsg: "Новый год дома — автобус из Москвы в Грузию:", gd0: "Новый год дома", gd0t: "Рейсы в декабре из Москвы в Грузию", gdK: "Полезное", gdH: "Перед поездкой", gd1: "Аренда автобуса", gd1t: "Экскурсии, свадьбы, группы — по Грузии и в Европу", gd2: "Верхний Ларс: советы", gd2t: "Документы, очереди и что важно знать на границе", gd3: "Посылка в Москву", gd3t: "Как отправить: шаги, цена, советы", gdR: "Читать", pgN: "Посылка в Москву: инструкция", pgH: "Посылка из Москвы в Грузию и из Грузии в Москву", pgS: "Как отправить посылку автобусом: шаги, цена и советы.", pg1h: "Как это работает", pg1a: "Напишите нам в WhatsApp или заполните форму на сайте: что отправляете, примерный вес, откуда и куда.", pg1b: "Мы назовём цену, место и время передачи посылки.", pg1c: "Вы передаёте посылку при отправлении автобуса — она едет регулярным рейсом.", pg1d: "Получатель забирает посылку в своём городе.", pg3h: "Когда едет посылка", pg3: "Посылка едет обычным рейсом: из Грузии — в среду и субботу, из Москвы — во вторник и субботу. Точные даты смотрите в расписании.", pg4h: "Сколько стоит", pg4: "Цена зависит от веса и размера. Точную цену назовём в WhatsApp или после заполнения формы на странице посылок.", pg5h: "Советы", pg5a: "Хорошо упакуйте посылку и заранее предупредите, если внутри хрупкие вещи.", pg5b: "Напишите на посылке имя и телефон получателя.", pg5c: "Запрещённые законом предметы (оружие, наркотики, легковоспламеняющиеся вещества) не принимаются. О лекарствах, жидкостях и ценных вещах спросите заранее.", pg6: "Чтобы отправить посылку, перейдите на страницу посылок или напишите нам в WhatsApp.", pgB: "Отправить посылку", nv6: "Аренда", cpH: "Аренда автобуса", cpS: "Аренда автобуса — по всей Грузии, в Европу и другие страны.", cpHow: "Как заказать", cs1: "Напишите нам", cs1t: "Напишите в WhatsApp маршрут, дату и количество пассажиров.", cs2: "Узнайте цену", cs2t: "По деталям поездки назовём цену и условия.", cs3: "В путь", cs3t: "В назначенное время автобус будет ждать вас в условленном месте.", cpFq: "Частые вопросы", cq1: "Сколько стоит аренда автобуса?", ca1: "Цена зависит от маршрута, расстояния и количества дней. Напишите детали — назовём точную цену.", cq2: "Можно ли поехать за границу?", ca2: "Да — в Европу и другие страны, по предварительной договорённости.", cq3: "За сколько нужно бронировать?", ca3: "Чем раньше, тем лучше — особенно летом и в праздники. Для срочного заказа позвоните нам.", laN: "Верхний Ларс: советы", laH: "Верхний Ларс: документы и советы", laS: "Что нужно знать о поездке на автобусе из Грузии в Россию и обратно.", la1h: "Что такое Верхний Ларс", la1: "Верхний Ларс — главный сухопутный пункт пропуска между Грузией и Россией, на Военно-Грузинской дороге в Казбегском районе. Наш автобус едет этим путём: из городов Грузии через Верхний Ларс во Владикавказ и дальше до Москвы.", la2h: "Какие нужны документы", la2a: "Гражданам Грузии виза для въезда в Россию не нужна (безвизовый режим действует с 2023 года). Возьмите действующий паспорт.", la2b: "Иностранным гражданам, в том числе гражданам России, с 1 января 2026 года для въезда в Грузию нужна медицинская страховка на весь срок поездки (покрытие не менее 30 000 лари).", la2c: "Правила могут меняться — перед поездкой проверьте их в официальных источниках или позвоните нам.", la3h: "Практические советы", la3a: "Летом и в праздники очередь на границе может занять несколько часов — возьмите воду и еду.", la3b: "Дорога идёт через горы, и даже летом там бывает холодно — держите тёплую одежду под рукой.", la3c: "Зимой дорогу иногда временно закрывают из-за погоды. В таком случае мы предупредим вас заранее.", la3d: "Держите документы при себе, а не в багаже.", la3e: "Не берите вещи или посылки у незнакомых людей — за их содержимое отвечаете вы.", la4: "Расписание и бронирование — на этом сайте. Вопросы — пишите в WhatsApp.", chH: "Аренда автобуса", chT: "Арендуйте автобус для любой поездки — экскурсии, мероприятия, по всей Грузии и за её пределами: в Европу и другие страны.", ch1: "Экскурсии и туры по всей Грузии", ch2: "Свадьбы, дни рождения и мероприятия", ch3: "Корпоративные, школьные и групповые поездки", ch4: "Трансферы: аэропорт, вокзал, отель", ch5: "Международные рейсы: Европа и другие страны", ch6: "Цена по договорённости — напишите маршрут и дату", chC: "Позвонить", chM: "Здравствуйте! Хочу арендовать автобус. Маршрут и дата: ", scrl: "Листайте, и в путь", trk: "Путешествие", j0: "Путь начинается у моря.", j1: "Вдоль побережья, на север.", j2: "Порт и Колхидская низменность.", j3: "Сердце Имерети, наш дом.", j4: "Столица, последняя остановка в Грузии.", jL: "Верхний Ларс", jLt: "Горы Кавказа и граница.", jMt: "Финиш. Добро пожаловать!", stp: "Остановка", st_s: "остановок в Грузии", st_w: "рейса в неделю", st_d: "направления", st_l: "языка на сайте", w3: "Настоящие фото наших автобусов", spin: "Крутите или листайте", adk: "Партнёры", adh: "Ваш бизнес перед глазами пассажиров", adl: "Реклама", adf: "Здесь может быть ваша реклама", adft: "Гостиница, ресторан, магазин или сервис: разместите рекламу на сайте Имерети Тур.", adb: "Разместить рекламу", adm: "Здравствуйте! Хочу разместить рекламу на сайте Имерети Тур.", adv: "Подробнее", ads2: "Рекламное место", rvk: "Отзывы", rve: "Пока нет отзывов. Будьте первым!", rvw: "Оставить отзыв", rvc: "Город", rvt2: "Ваши впечатления о поездке", rvb: "Отправить", rvok: "Спасибо! Отзыв появится на сайте после проверки.", rver: "Укажите имя и комментарий.", rvn: "отзывов", wk: "Ближайшие рейсы", mapH: "Остановки на карте", bmN: "Батуми: офис", bmA: "ул. Баку 8", ktN: "Отправление из Кутаиси", ktA: "ул. Ладо Асатиани 98, Кутаиси, на АЗС «Лукойл»", tbN: "Тбилиси: отправление", tbA: "аллея Давида Агмашенебели 29, у «Мари маркет»", mwN: "Москва: прибытие и отправление", mwA: "метро «Аннино», МКАД 33 км, владение 6, стр. 5", mpo: "Открыть в Google Maps" },
    en: { nyN: "New Year at home", nyH: "New Year at home in Georgia: bus from Moscow", nyS: "December trips from Moscow to Batumi, Kobuleti, Poti, Kutaisi and Tbilisi. Book early.", nyA: "From Moscow — before New Year", nyB: "Back to Moscow — after the holidays", ny1h: "Why go by bus", ny1a: "Straight to your city: Batumi, Kobuleti, Poti, Kutaisi, Tbilisi.", ny1b: "Gifts and parcels for your family can travel on our bus too.", ny1c: "Book online with an advance from 25%. If you cancel, we refund your money.", ny2h: "Tips before the trip", ny2a: "Book your seat early before the holidays.", ny2b: "In winter the road over Upper Lars is sometimes closed for a while due to weather — if so, we will let you know in advance.", ny2c: "Keep your documents with you, not in your luggage.", nyL: "Upper Lars tips", nySh: "Share with family", nyCp: "Link copied", nyBn: "New Year at home — December trips from Moscow", nyMsg: "New Year at home — bus from Moscow to Georgia:", gd0: "New Year at home", gd0t: "December trips from Moscow to Georgia", gdK: "Useful", gdH: "Before you travel", gd1: "Bus rental", gd1t: "Excursions, weddings, groups — across Georgia and to Europe", gd2: "Upper Lars: tips", gd2t: "Documents, queues and what to know at the border", gd3: "Parcel to Moscow", gd3t: "How to send: steps, price, tips", gdR: "Read", pgN: "Parcel to Moscow: guide", pgH: "Sending a parcel between Moscow and Georgia", pgS: "How to send a parcel by bus: steps, price and tips.", pg1h: "How it works", pg1a: "Message us on WhatsApp or fill in the form on the site: what you are sending, approximate weight, from where and to where.", pg1b: "We tell you the price and where and when to hand over the parcel.", pg1c: "You hand over the parcel when the bus departs — it travels on a regular trip.", pg1d: "The recipient collects the parcel in their city.", pg3h: "When the parcel travels", pg3: "Parcels travel on regular trips: from Georgia on Wednesdays and Saturdays, from Moscow on Tuesdays and Saturdays. See the schedule for exact dates.", pg4h: "How much it costs", pg4: "The price depends on weight and size. We will give you the exact price on WhatsApp or after you fill in the form on the parcels page.", pg5h: "Tips", pg5a: "Pack the parcel well and tell us in advance if anything is fragile.", pg5b: "Write the recipient's name and phone number on the parcel.", pg5c: "Items prohibited by law (weapons, drugs, flammable substances) are not accepted. Ask us in advance about medicines, liquids and valuables.", pg6: "To send a parcel, go to the parcels page or message us on WhatsApp.", pgB: "Send a parcel", nv6: "Charter", cpH: "Bus charter", cpS: "Bus rental — across Georgia, to Europe and other countries.", cpHow: "How to book", cs1: "Message us", cs1t: "Send us the route, date and number of passengers on WhatsApp.", cs2: "Get a price", cs2t: "We'll quote a price and terms based on your trip.", cs3: "Travel", cs3t: "At the agreed time the bus will be waiting at the agreed place.", cpFq: "FAQ", cq1: "How much does a bus charter cost?", ca1: "It depends on the route, distance and number of days. Send us the details and we'll give you an exact price.", cq2: "Can we travel abroad?", ca2: "Yes — to Europe and other countries, by prior agreement.", cq3: "How far ahead should I book?", ca3: "The earlier the better, especially in summer and on holidays. For urgent trips, call us.", laN: "Upper Lars: tips", laH: "Crossing Upper Lars: documents and tips", laS: "What to know about travelling by bus between Georgia and Russia.", la1h: "What is Upper Lars", la1: "Upper Lars is the main land border crossing between Georgia and Russia, on the Georgian Military Road in the Kazbegi area. Our bus takes this route: from Georgian cities through Upper Lars to Vladikavkaz and on to Moscow.", la2h: "Documents you need", la2a: "Georgian citizens do not need a visa to enter Russia (visa-free travel since 2023). Bring a valid passport.", la2b: "Since 1 January 2026, foreign citizens, including Russian citizens, need health insurance covering their whole stay to enter Georgia (minimum cover 30,000 GEL).", la2c: "Rules can change — check official sources before you travel, or call us.", la3h: "Practical tips", la3a: "In summer and on holidays the border queue can take several hours — bring water and food.", la3b: "The road crosses the mountains and it can be cold even in summer — keep warm clothes at hand.", la3c: "In winter the road is sometimes closed temporarily due to weather. If so, we'll let you know in advance.", la3d: "Keep your documents on you, not in your luggage.", la3e: "Don't carry items or parcels for strangers — you are responsible for what's inside.", la4: "Schedule and booking are on this site. Questions? Message us on WhatsApp.", chH: "Bus charter", chT: "Rent a bus for any trip — excursions, events, across Georgia and beyond: to Europe and other countries.", ch1: "Excursions and tours across Georgia", ch2: "Weddings, birthdays and events", ch3: "Corporate, school and group trips", ch4: "Transfers: airport, station, hotel", ch5: "International trips: Europe and other countries", ch6: "Price on request — send us the route and date", chC: "Call", chM: "Hello! I would like to charter a bus. Route and date: ", scrl: "Scroll to ride", trk: "The journey", j0: "The road starts by the sea.", j1: "Along the coast, heading north.", j2: "The port and the Colchis lowland.", j3: "The heart of Imereti, our home.", j4: "The capital, last stop in Georgia.", jL: "Upper Lars", jLt: "The Caucasus mountains and the border.", jMt: "Finish line. Welcome!", stp: "Stop", st_s: "stops in Georgia", st_w: "trips a week", st_d: "directions", st_l: "site languages", w3: "Real photos of our buses", spin: "Drag or scroll to spin", adk: "Partners", adh: "Your business in front of travellers", adl: "Ad", adf: "Your ad could be here", adft: "Hotel, restaurant, shop or service: advertise on the Imereti Tour website.", adb: "Place an ad", adm: "Hello! I would like to advertise on the Imereti Tour website.", adv: "Visit", ads2: "Ad space", rvk: "Reviews", rve: "No reviews yet. Be the first!", rvw: "Leave a review", rvc: "City", rvt2: "Your impressions of the trip", rvb: "Send", rvok: "Thank you! Your review will appear after moderation.", rver: "Please enter your name and a comment.", rvn: "reviews", wk: "Upcoming trips", mapH: "Stops on the map", bmN: "Batumi: office", bmA: "8 Baku Street", ktN: "Departure from Kutaisi", ktA: "98 Lado Asatiani St, Kutaisi, at the Lukoil station", tbN: "Tbilisi: departure", tbA: "29 Davit Aghmashenebeli Alley, by Mari Market", mwN: "Moscow: arrival and departure", mwA: "Annino metro, MKAD 33 km, 6 vladenie, building 5", mpo: "Open in Google Maps" }
};
for (var tl in T2)
    for (var tk in T2[tl])
        T[tl][tk] = T2[tl][tk];
for (tl in T3)
    for (tk in T3[tl])
        T[tl][tk] = T3[tl][tk];

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
// გვერდის ენა (ka = მთავარი, ru = /ru/, en = /en/) და ბმულების საფუძველი ამ ენისთვის
var LANGP = document.body.dataset.lang || "", LB = BASE + (LANGP && LANGP != "ka" ? LANGP + "/" : "");
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
SC.sheet = SC.sheet || ""; // ჯავშნების ცხრილის (Google Apps Script) მისამართი
SC.ads = SC.ads || []; // რეკლამები: [{t: სათაური, x: ტექსტი, img: სურათი, u: ბმული}]
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
    L = LANGP || localStorage.getItem("l") || "ka";
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
// უკუთვლა უახლოეს გასვლამდე (დღე / საათი / წუთი / წამი), ყოველ წამში ახლდება.
function cd() {
    var g = trips("ge", 1)[0], box = $("cd");
    if (!g || !box)
        return;
    var m = Math.max(0, g - Date.now()), k = T[L], p = function (n) { return String(n).padStart(2, "0"); };
    var v = [Math.floor(m / 864e5), p(Math.floor(m % 864e5 / 36e5)), p(Math.floor(m % 36e5 / 6e4)), p(Math.floor(m % 6e4 / 1e3))], lb = [k.cdD, k.cdH, k.cdM, k.cdS];
    if (box.children.length != 4)
        box.innerHTML = lb.map(function () { return "<div><b></b><small></small></div>"; }).join("");
    v.forEach(function (x, i) {
        box.children[i].firstChild.textContent = x;
        box.children[i].lastChild.textContent = lb[i];
    });
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
        if (k[e.dataset.i] != null) e.textContent = k[e.dataset.i];
    });
    document.querySelectorAll(".chwa").forEach(function (a) { a.href = "https://wa.me/995598808022?text=" + encodeURIComponent(k.chM); });
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
    // ახალი წელი: მოსკოვიდან 31 დეკემბრამდე და უკან იანვარში
    if ($("nyRu")) {
        var nw = new Date(), ny = Date.UTC(nw.getUTCMonth() == 0 && nw.getUTCDate() < 15 ? nw.getUTCFullYear() : nw.getUTCFullYear() + 1, 0, 1);
        var nr = trips("ru", 60).filter(function (t) { return t < ny && t >= ny - 31.5 * 864e5; }), ng = trips("ge", 60).filter(function (t) { return t >= ny && t < ny + 31 * 864e5; }).slice(0, 6);
        $("nyRu").innerHTML = nr.length ? nr.map(function (t) { return "<li>" + ft(t, 0) + "</li>"; }).join("") : "<li>" + k.noinfo + "</li>";
        $("nyGe").innerHTML = ng.length ? ng.map(function (t) { return "<li>" + ft(t, 1) + "</li>"; }).join("") : "<li>" + k.noinfo + "</li>";
    }
    $("a3").textContent = k.fg + ": " + dn("ge") + ". " + k.rtl + ": " + dn("ru") + ".";
    $("pp").innerHTML = S.map(function (s) {
        return "<span>" + s[1][L] + "</span>";
    }).join("") + "<span>" + k.mw + "</span>";
    $("mn").innerHTML = [["", "nv0"], ["buses", "nv1"], ["charter", "nv6"], ["schedule", "nv2"], ["parcels", "nv4"], ["info", "nv5"], ["faq", "nv3"]].map(function (x) {
        return '<a href="' + (SPA ? "#/" + x[0] : (LB + (x[0] ? x[0] + "/" : "") || "./")) + '" data-p="' + x[0] + '">' + k[x[1]] + "</a>";
    }).join("");
    route();
    var ge = $("dir").value == "ge", ds = trips(ge ? "ge" : "ru", BOOK_N), sel = $("dt").value;
    $("dt").innerHTML = ds.map(function (t, i) {
        return '<option value="' + i + '" data-m="' + ft(t, ge) + '">' + ft(t, ge) + "</option>";
    }).join("");
    $("dt").value = sel || 0;
    fillSt();
    $("stl").textContent = ge ? k.st1 : k.st2;
    $("tkA").textContent = ge ? k.cGe : k.cMo;
    $("tkB").textContent = ge ? k.cMo : k.cGe;
    document.querySelectorAll("[data-i-aria]").forEach(function (e) {
        e.setAttribute("aria-label", k[e.dataset.iAria]);
    });
    document.querySelectorAll("[data-href]").forEach(function (a) {
        a.href = SPA ? "#/" + a.dataset.href : LB + a.dataset.href + "/";
    });
    renderX();
    cd();
    rbus();
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
        try {
            localStorage.setItem("l", b.dataset.l);
        }
        catch (e) { }
        // თითო ენას თავისი მისამართი აქვს (/, /ru/, /en/): გადადის იმავე გვერდზე სხვა ენაზე
        if (LANGP && !SPA && location.hash.indexOf("#/admin") != 0) {
            if (b.dataset.l != L) location.href = BASE + (b.dataset.l == "ka" ? "" : b.dataset.l + "/") + (PG ? PG + "/" : "") || "./";
            return;
        }
        L = b.dataset.l;
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
    // ძველი ბმული (/ru/#/schedule): თითო გვერდზე მხოლოდ საკუთარი შიგთავსია, ამიტომ გადავდივართ ნამდვილ მისამართზე
    if (!SPA && h.indexOf("#/") == 0 && p.replace(/\/$/, "") != PG && !(p == "admin" && !PG)) {
        location.replace(p == "admin" ? (LB || "./") + "#/admin" : (LB + (p ? p.replace(/\/$/, "") + "/" : "")) || "./");
        return;
    }
    if (p.indexOf("bus/") == 0)
        p = "route"; // ქალაქის გვერდი (მაგ. bus/kutaisi-moscow)
    if (["buses", "charter", "lars", "parcel-guide", "new-year", "schedule", "parcels", "info", "faq", "admin", "route"].indexOf(p) < 0)
        p = "";
    ["home", "buses", "charter", "lars", "parcel-guide", "new-year", "schedule", "parcels", "info", "faq", "admin", "route"].forEach(function (n) {
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
        ["buses", "charter", "lars", "parcel-guide", "new-year", "schedule", "parcels", "info", "faq", "admin", "route"].forEach(function (n) {
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
        location.href = LB + (pp ? pp + "/" : "") || "./";
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
    rvRender();
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
    h += '<h3>რეკლამა (პარტნიორები): ჩანს მთავარ გვერდზე და შიდა გვერდების ბოლოს</h3><p class=note>სურათი: ჩადე ფაილი საქაღალდეში images/ads/ და ჩაწერე images/ads/სახელი.jpg, ან ჩასვი სრული ბმული (https://...). საუკეთესო ზომა: 1200×750.</p><div class=chg><label>კომპანია / სათაური<input id=adt></label><label>მოკლე ტექსტი<input id=adx></label><label>სურათი<input id=adi placeholder="images/ads/hotel.jpg"></label><label>ბმული (საიტი, Facebook, ტელეფონი)<input id=adu placeholder="https://"></label></div><p><button type=button class=btn data-a=adadd>რეკლამის დამატება</button></p><ul class=dl>' + AC.ads.map(function (a, i) {
        return "<li>" + esc(a.t) + (a.u ? " · " + esc(a.u) : "") + ' <button type=button data-rad="' + i + '">×</button></li>';
    }).join("") + "</ul>";
    h += "<h3>რუკის ბმულები გაჩერებებისთვის (Google Maps)</h3><div class=tms>" + S.map(function (s, i) {
        return "<label>" + s[1].ka + '<input data-mp="' + i + '" value="' + esc(AC.maps[i] || "") + '"></label>';
    }).join("") + '<label>მოსკოვი<input data-mp=m value="' + esc(AC.maps.m || "") + '"></label></div>';
    h += '<h3>სოციალური ქსელებისთვის</h3><p class=note>უახლოესი რეისების სურათი (1080×1350) Facebook-ისა და Instagram-ის პოსტისთვის. თარიღები ავტომატურად ითვლება განრიგიდან.</p><p><button type=button class="btn coral" data-a=weekimg>📅 ამ კვირის რეისების სურათი (PNG)</button></p>';
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
    else if (d.a == "adadd" && $("adt").value)
        AC.ads.push({
            t: $("adt").value, x: $("adx").value, img: $("adi").value, u: $("adu").value
        });
    else if (d.rad != null)
        AC.ads.splice(+d.rad, 1);
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
// დაჭერები WhatsApp-ზე და ტელეფონზე იწერება Google-ის ცხრილში (ფურცელი Clicks): რომელი ღილაკი, რომელ გვერდზე, საიდან მოვიდა სტუმარი
document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (a && (a.href.indexOf("wa.me") > 0 || a.href.indexOf("tel:") == 0)) {
        var where = a.closest("section,.pg,.sticky,footer,.box");
        sheetLog({ t: "click", b: (a.href.indexOf("tel:") == 0 ? "ზარი" : "WhatsApp") + (where && where.id ? " · " + where.id : where && where.className ? " · " + String(where.className).split(" ")[0] : ""), ref: (document.referrer || "პირდაპირ").slice(0, 200) });
    }
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

// ======================================================================
// 15. ახალი დიზაინის ღილაკები: მიმართულების შეცვლა, მგზავრები −/+, ძებნა, მოძრავი ავტობუსი, ქვედა ღილაკი
// ======================================================================

// ჯავშნების ცხრილი (Google Sheets): WhatsApp-ის ღილაკზე დაჭერისას ჯავშანი ცხრილშიც იწერება.
// მისამართი: js/schedule-config.js → "sheet". ცარიელი = არ იგზავნება.
function sheetLog(d) {
    if (!SC.sheet)
        return;
    d.k = "it-2026";
    d.lang = L;
    d.page = location.pathname;
    var body = JSON.stringify(d);
    try {
        if (!(navigator.sendBeacon && navigator.sendBeacon(SC.sheet, new Blob([body], { type: "text/plain" }))))
            fetch(SC.sheet, { method: "POST", mode: "no-cors", keepalive: true, body: body });
    }
    catch (e) { }
}
function txt(i) {
    var e = $(i);
    return !e ? "" : e.tagName == "SELECT" ? (e.selectedOptions[0] ? e.selectedOptions[0].textContent : "") : e.value || e.textContent || "";
}
$("wa").addEventListener("click", function () {
    sheetLog({ t: "ბილეთი", dir: txt("tkA") + " → " + txt("tkB"), date: txt("dt"), stop: txt("st"), px: $("px").value, nm: txt("nm"), ph: txt("ph"), pay: txt("pay"), price: $("pr").hidden ? "" : txt("pr") });
});
$("pwa").addEventListener("click", function () {
    sheetLog({ t: "ამანათი", dir: txt("pdir"), nm: txt("pnm"), ph: txt("pph"), what: txt("pwh"), kg: txt("pkg"), price: $("ppr").hidden ? "" : txt("ppr") });
});

// ======================================================================
// 16. შეფასებები: მგზავრი წერს საიტზე → Google-ის ცხრილი (ფურცელი Reviews) →
//     შენ წერ „yes“ ან „კი“ სვეტში Approved → შეფასება ჩნდება საიტზე (5 წუთში).
//     ადმინ-გვერდიდან დამატებული შეფასებებიც ჩანს (SC.reviews).
// ======================================================================
var RV = [];
function stars(n) {
    n = Math.max(1, Math.min(5, Math.round(+n || 5)));
    return '<span class="rstars" aria-label="' + n + '/5">' + "★★★★★".slice(0, n) + '<i>' + "★★★★★".slice(n) + "</i></span>";
}
function rvRender() {
    var k = T[L], all = (RV || []).concat(SC.reviews.map(function (r) { return { n: r.n, t: r.t, c: r.c, s: r.s || 5 }; }));
    $("rvl").innerHTML = all.map(function (r) {
        return "<blockquote>" + stars(r.s) + "<p" + (/[ა-ჿ]/.test(r.t) ? ' lang="ka"' : "") + ">" + esc(r.t) + "</p><cite>— " + esc(r.n) + (r.c ? ", " + esc(r.c) : "") + "</cite></blockquote>";
    }).join("");
    $("rvempty").hidden = !!all.length;
    var a = $("rvavg");
    if (all.length) {
        var sum = 0;
        all.forEach(function (r) { sum += +r.s || 5; });
        a.innerHTML = stars(sum / all.length) + " <b>" + (sum / all.length).toFixed(1) + "</b> · " + all.length + " " + k.rvn;
    }
    a.hidden = !all.length;
}
(function () {
    if (!SC.sheet || !$("rvl"))
        return;
    var key = "it-rv", c = null;
    try { c = JSON.parse(sessionStorage.getItem(key) || "null"); } catch (e) { }
    if (c) { RV = c; rvRender(); return; }
    fetch(SC.sheet).then(function (r) { return r.json(); }).then(function (j) {
        RV = (j.reviews || []).filter(function (r) { return r.n && r.t; });
        try { sessionStorage.setItem(key, JSON.stringify(RV)); } catch (e) { }
        rvRender();
    }).catch(function () { });
})();
(function () {
    var box = $("rfs"), val = 5;
    if (!box)
        return;
    function paint(n) {
        box.querySelectorAll("button").forEach(function (b) {
            b.classList.toggle("on", +b.dataset.s <= n);
            b.setAttribute("aria-pressed", +b.dataset.s == n);
        });
    }
    paint(val);
    box.onclick = function (e) {
        var b = e.target.closest("button");
        if (b) { val = +b.dataset.s; paint(val); }
    };
    $("rfsend").onclick = function () {
        var k = T[L], n = $("rfn").value.trim(), t = $("rft").value.trim(), m = $("rfmsg");
        m.hidden = false;
        if (!n || t.length < 3) { m.textContent = k.rver; return; }
        if (!SC.sheet) return;
        this.disabled = true;
        fetch(SC.sheet, { method: "POST", mode: "no-cors", body: JSON.stringify({ k: "it-2026", t: "review", nm: n, city: $("rfc").value.trim(), stars: val, text: t }) })
            .catch(function () { });
        m.textContent = k.rvok;
        $("rft").value = "";
    };
})();

// ======================================================================
// 17. ადმინი: „ამ კვირის რეისების“ სურათი Facebook/Instagram-ისთვის (1080×1350)
// ======================================================================
function weekImage() {
    var k = T[L], c = document.createElement("canvas"), W = 1080, H = 1350;
    c.width = W; c.height = H;
    var g = c.getContext("2d"), F = '"FiraGO","Noto Sans Georgian",sans-serif', S = '"Noto Sans Georgian",sans-serif';
    var bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#14213D"); bg.addColorStop(1, "#0D1730");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    var gl = g.createRadialGradient(W, 0, 0, W, 0, 700);
    gl.addColorStop(0, "rgba(255,107,91,.4)"); gl.addColorStop(1, "rgba(255,107,91,0)");
    g.fillStyle = gl; g.fillRect(0, 0, W, H);
    g.textAlign = "center";
    g.fillStyle = "#FF6B5B"; g.font = "800 34px " + F;
    g.fillText(k.brand.toUpperCase(), W / 2, 120);
    g.fillStyle = "#fff"; g.font = "900 76px " + F;
    g.fillText(k.wk, W / 2, 215);
    g.fillStyle = "rgba(246,241,231,.75)"; g.font = "600 32px " + S;
    g.fillText(k.cGe + " ⇄ " + k.cMo, W / 2, 275);
    function block(y, title, list, ge) {
        g.fillStyle = "rgba(255,255,255,.06)";
        g.beginPath(); g.roundRect(90, y, W - 180, 100 + list.length * 62, 32); g.fill();
        g.textAlign = "left"; g.fillStyle = "#FF6B5B"; g.font = "800 34px " + F;
        g.fillText(title, 135, y + 62);
        g.fillStyle = "#F6F1E7"; g.font = "700 40px " + S;
        list.forEach(function (t, i) { g.fillText("•  " + ft(t, ge), 135, y + 128 + i * 62); });
        g.textAlign = "center";
        return y + 100 + list.length * 62 + 30;
    }
    var y = block(320, k.ge, trips("ge", 4), 1);
    y = block(y, k.ru, trips("ru", 3), 0);
    if (SC.price.ge > 0) {
        g.fillStyle = "#fff"; g.font = "800 40px " + F;
        g.fillText(SC.price.ge + " " + SC.cur + " " + k.per, W / 2, y + 40);
    }
    g.fillStyle = "#FF6B5B";
    g.beginPath(); g.roundRect(160, H - 230, W - 320, 100, 50); g.fill();
    g.fillStyle = "#fff"; g.font = "900 46px " + F;
    g.fillText("imeretitour.com", W / 2, H - 165);
    g.fillStyle = "rgba(246,241,231,.85)"; g.font = "700 34px " + S;
    g.fillText("WhatsApp: +995 598 80 80 22", W / 2, H - 70);
    return c;
}
document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-a=weekimg]");
    if (!b)
        return;
    (document.fonts ? document.fonts.load('900 40px "FiraGO"') : Promise.resolve()).then(function () {
        weekImage().toBlob(function (bl) {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(bl);
            a.download = "imereti-tour-" + new Date().toISOString().slice(0, 10) + ".png";
            a.click();
        });
    });
});

// ქალაქის გვერდიდან მოსული (?st=2): ფორმაში ეს გაჩერება წინასწარ არჩეულია
(function () {
    var m = /[?&]st=([0-9])/.exec(location.search);
    if (m && S[+m[1]]) {
        $("dir").value = "ge";
        render();
        $("st").value = m[1];
        upd();
    }
})();
$("swap").onclick = function () {
    $("dir").value = $("dir").value == "ge" ? "ru" : "ge";
    this.classList.toggle("spin");
    render();
};
function px(d) {
    var e = $("px"), v = Math.min(20, Math.max(1, (+e.value || 1) + d));
    e.value = v;
    upd();
}
$("pxm").onclick = function () { px(-1); };
$("pxp").onclick = function () { px(1); };
$("qbtn").onclick = function () {
    var s = $("sr");
    s.hidden = !s.hidden;
    if (!s.hidden)
        $("q").focus();
};
// ავტობუსი მარშრუტზე ჩადის ბოლო გაჩერებამდე (სიმაღლე ითვლება გვერდის ზომის მიხედვით).
function rbus() {
    var r = $("route"), c = $("rcard"), end = r && r.querySelector("li.end");
    if (!end || !c)
        return;
    var first = r.querySelector("li");
    c.style.setProperty("--rh", (end.offsetTop - first.offsetTop + 8) + "px");
}
addEventListener("resize", rbus);
// ტელეფონზე მენიუს რიგში მიმდინარე გვერდი ჩანდეს.
function mnScroll() {
    var a = document.querySelector('#mn a[aria-current="page"]'), m = $("mn");
    if (a && m.scrollWidth > m.clientWidth)
        m.scrollLeft = a.offsetLeft - m.clientWidth / 2 + a.offsetWidth / 2;
}
addEventListener("load", mnScroll);
// ქვედა ღილაკი იმალება, როცა ფორმა უკვე ეკრანზეა.
(function () {
    var st = $("sticky"), bk = $("book");
    if (!("IntersectionObserver" in window) || !st || !bk)
        return;
    new IntersectionObserver(function (a) {
        st.classList.toggle("off", a[0].isIntersecting && !$("p-home").hidden);
    }, { threshold: .25 }).observe(bk);
})();

// ======================================================================
// 14. გაშვება
// ======================================================================

window.onhashchange = route;
(function () {
    var els = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) {
        els.forEach(function (e) {
            e.classList.add("in");
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
    }, { threshold: .1 });
    els.forEach(function (e) {
        io.observe(e);
    });
})();
render();
rbus();
addEventListener("load", rbus);
setInterval(cd, 1000);

// რუკები (Google Maps) იტვირთება მხოლოდ მაშინ, როცა ეკრანზე ჩნდება: გვერდი ტელეფონზე ~2 მბ-ით მსუბუქია
(function () {
    var f = document.querySelectorAll("iframe[data-src]");
    if (!f.length) return;
    if (!("IntersectionObserver" in window)) { f.forEach(function (e) { e.src = e.dataset.src; }); return; }
    var io = new IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting) { x.target.src = x.target.dataset.src; io.unobserve(x.target); } });
    }, { rootMargin: "300px 0px" });
    f.forEach(function (e) { io.observe(e); });
})();

// „გაუზიარეთ ოჯახს“: ტელეფონზე სისტემური გაზიარება, სხვაგან WhatsApp
document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".nysh");
    if (!b) return;
    e.preventDefault();
    var k = T[L], u = location.origin + location.pathname;
    if (navigator.share) { navigator.share({ title: k.nyH, text: k.nyMsg, url: u }).catch(function () {}); return; }
    window.open("https://wa.me/?text=" + encodeURIComponent(k.nyMsg + " " + u), "_blank", "noopener");
});
