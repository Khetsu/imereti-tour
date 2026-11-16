/* =====================================================================
   იმერეთი ტური · 3D სცენები (Three.js, js/vendor/three.module.min.js)

   1. დამხმარეები: ფერები, ხმაური (მთების ფორმა), გზის მრუდი
   2. ავტობუსის 3D მოდელი (კრემისფერი, ნარინჯისფერი ზოლით)
   3. მოგზაურობა (მთავარი გვერდი): ზღვა, მთები, გზა, ქალაქები, ვარსკვლავები.
      სქროლისას ავტობუსი მიდის ბათუმიდან მოსკოვამდე, კამერა მას მიჰყვება.
   4. შიდა გვერდების სცენები: ავტობუსი (bus), საათის რგოლები (orbit),
      ყუთები (boxes), ქაღალდის თვითმფრინავები (planes), კრისტალები (gems)
   5. გაშვება: მხოლოდ ხილულ სცენას ხატავს, ტელეფონზე უფრო მსუბუქია

   თუ ბრაუზერს 3D არ შეუძლია, საიტი ჩვეულებრივ მუშაობს (ჩანს ფონის სურათი).
   ===================================================================== */
// Three.js იტვირთება მოგვიანებით (გვერდის გამოჩენის შემდეგ), რომ საიტი სწრაფად გაიხსნას.
let THREE;

const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOB = matchMedia("(max-width: 760px)").matches || (navigator.hardwareConcurrency || 8) <= 4;
const DPR = Math.min(devicePixelRatio || 1, MOB ? 1.5 : 1.75);

// ======================================================================
// 1. დამხმარეები
// ======================================================================
const COL = { navy: 0x14213D, navy2: 0x1F3158, navy3: 0x0D1730, cream: 0xF6F1E7, coral: 0xFF6B5B, coral2: 0xE8574A, sea: 0x1A3A66 };
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
function hash(x, y) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function ridge(x, y) {
    let s = 0, a = 0.55, f = 1;
    for (let i = 0; i < 5; i++) { s += a * (1 - Math.abs(2 * vnoise(x * f, y * f) - 1)); f *= 2.1; a *= 0.5; }
    return s;
}
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function webgl() {
    try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); }
    catch (e) { return false; }
}
function makeRenderer(canvas, alpha) {
    const r = new THREE.WebGLRenderer({ canvas, antialias: !MOB, alpha, powerPreference: "high-performance" });
    r.setPixelRatio(DPR);
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    return r;
}
function glowTexture(inner, outer) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner); gr.addColorStop(0.35, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function windowsTexture() {
    const c = document.createElement("canvas"); c.width = 64; c.height = 128;
    const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, 64, 128);
    for (let y = 4; y < 128; y += 8) for (let x = 4; x < 64; x += 8) {
        if (Math.random() < 0.45) { g.fillStyle = Math.random() < 0.25 ? "#FF8A6B" : "#FFE7B8"; g.fillRect(x, y, 4, 5); }
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t;
}

// გზა: მიდის -z მიმართულებით, მარცხნივ-მარჯვნივ იხვევა
const LEN = 640;
const roadX = z => 16 * Math.sin(z * 0.011) + 7 * Math.sin(z * 0.029 + 1.3);
const zAt = t => 10 - t * LEN;
const tAt = z => (10 - z) / LEN;
// მთების სიმაღლე მარშრუტის მიხედვით: ზღვა → დაბლობი → იმერეთი → თბილისი → კავკასიონი → მოსკოვის ვაკე
const AMP = [[0, 5], [0.18, 4], [0.3, 3], [0.42, 12], [0.55, 9], [0.64, 20], [0.74, 46], [0.82, 38], [0.88, 6], [1.1, 2]];
function amp(t) {
    for (let i = 1; i < AMP.length; i++) if (t <= AMP[i][0]) {
        const a = AMP[i - 1], b = AMP[i], k = smooth(0, 1, (t - a[0]) / (b[0] - a[0]));
        return lerp(a[1], b[1], k);
    }
    return 2;
}
function heightAt(x, z) {
    const t = tAt(z), d = Math.abs(x - roadX(z));
    let h = amp(t) * ridge(x * 0.018, z * 0.018) * smooth(5, 20 + amp(t) * 0.25, d);
    // ზღვა მარცხნივ, მოგზაურობის დასაწყისში (ბათუმი, ქობულეთი, ფოთი)
    const sea = smooth(0.36, 0.26, t) * smooth(9, 22, roadX(z) - x);
    h = h * (1 - sea) - sea * 4;
    return h;
}

// ======================================================================
// 2. ავტობუსი
// ======================================================================
function makeBus() {
    const g = new THREE.Group();
    const L = 8, H = 2.7, W = 2.5, r = 0.55;
    const sh = new THREE.Shape();
    sh.moveTo(-L / 2 + r, 0.35); sh.lineTo(L / 2 - r, 0.35); sh.quadraticCurveTo(L / 2, 0.35, L / 2, 0.35 + r);
    sh.lineTo(L / 2, H - 0.7); sh.quadraticCurveTo(L / 2, H, L / 2 - 0.9, H); sh.lineTo(-L / 2 + r, H);
    sh.quadraticCurveTo(-L / 2, H, -L / 2, H - r); sh.lineTo(-L / 2, 0.35 + r); sh.quadraticCurveTo(-L / 2, 0.35, -L / 2 + r, 0.35);
    const body = new THREE.ExtrudeGeometry(sh, { depth: W - 0.24, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 3, curveSegments: 8 });
    body.translate(0, 0, -(W - 0.24) / 2);
    body.rotateY(Math.PI / 2); // წინა მხარე -z-ისკენ
    const cream = new THREE.MeshStandardMaterial({ color: COL.cream, roughness: 0.35, metalness: 0.15 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x0A1226, roughness: 0.08, metalness: 0.9, emissive: 0x1a2a50, emissiveIntensity: 0.25 });
    const coral = new THREE.MeshStandardMaterial({ color: COL.coral, roughness: 0.4, metalness: 0.1 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    g.add(new THREE.Mesh(body, cream));
    const win = new THREE.Mesh(new THREE.BoxGeometry(W + 0.02, 0.95, L - 1.5), glass); win.position.set(0, 1.85, 0.35); g.add(win);
    const ws = new THREE.Mesh(new THREE.BoxGeometry(W - 0.2, 1.35, 0.06), glass); ws.position.set(0, 1.75, -L / 2 - 0.17); ws.rotation.x = -0.12; g.add(ws);
    const st = new THREE.Mesh(new THREE.BoxGeometry(W + 0.03, 0.22, L - 0.6), coral); st.position.set(0, 1.05, 0); g.add(st);
    const st2 = new THREE.Mesh(new THREE.BoxGeometry(W + 0.03, 0.08, L - 0.6), coral); st2.position.set(0, 0.8, 0); g.add(st2);
    const ac = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.28, 2.4), cream); ac.position.set(0, H + 0.2, 0.8); g.add(ac);
    const wheelG = new THREE.CylinderGeometry(0.55, 0.55, 0.42, 18); wheelG.rotateZ(Math.PI / 2);
    const hubG = new THREE.CylinderGeometry(0.25, 0.25, 0.44, 10); hubG.rotateZ(Math.PI / 2);
    const hubM = new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.8, roughness: 0.3 });
    g.wheels = [];
    for (const [x, z] of [[-1.15, -2.6], [1.15, -2.6], [-1.15, 2.5], [1.15, 2.5]]) {
        const w = new THREE.Group(); w.add(new THREE.Mesh(wheelG, dark)); w.add(new THREE.Mesh(hubG, hubM));
        w.position.set(x, 0.55, z); g.add(w); g.wheels.push(w);
    }
    const hl = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xFFF2D6, emissiveIntensity: 2.2 });
    const tl = new THREE.MeshStandardMaterial({ color: COL.coral, emissive: COL.coral, emissiveIntensity: 2 });
    for (const x of [-0.85, 0.85]) {
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.08), hl); h.position.set(x, 0.75, -L / 2 - 0.14); g.add(h);
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.08), tl); t.position.set(x, 0.95, L / 2 + 0.14); g.add(t);
    }
    // ფარების შუქი გზაზე
    const beamT = glowTexture("rgba(255,240,210,.55)", "rgba(255,240,210,0)");
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(5, 14), new THREE.MeshBasicMaterial({ map: beamT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    beam.rotation.x = -Math.PI / 2; beam.position.set(0, 0.06, -L / 2 - 6.5); g.add(beam); g.beam = beam;
    g.traverse(o => { if (o.isMesh && o !== beam) o.castShadow = true; });
    return g;
}

// ======================================================================
// 3. მოგზაურობა (მთავარი გვერდი)
// ======================================================================
function journey(canvas) {
    const R = makeRenderer(canvas, false);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, 1, 0.5, 1400);
    scene.fog = new THREE.Fog(0x2a3560, 60, 430);

    // ცა: გრადიენტი, რომელიც ფერს იცვლის (მზის ჩასვლა → ბინდი → ღამე)
    const skyU = { top: { value: new THREE.Color() }, mid: { value: new THREE.Color() }, bot: { value: new THREE.Color() } };
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({
        side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
        vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.55, h)) : mix(mid, bot, smoothstep(0.0, -0.25, h)); gl_FragColor = vec4(c, 1.0); }"
    }));
    scene.add(sky);
    const SKY = [ // t, ზედა, ჰორიზონტი, ქვედა
        [0, "#1B2A55", "#FF8A6B", "#2a3560"], [0.3, "#16244A", "#E8746A", "#24305a"], [0.55, "#101B3B", "#8C5A86", "#1d2850"],
        [0.75, "#0B1430", "#4A5A92", "#16203f"], [1, "#050A1C", "#2A3A70", "#0D1730"]];
    const cA = new THREE.Color(), cB = new THREE.Color();
    function skyAt(t) {
        let i = 1; while (i < SKY.length - 1 && t > SKY[i][0]) i++;
        const a = SKY[i - 1], b = SKY[i], k = smooth(a[0], b[0], t);
        for (let j = 0; j < 3; j++) {
            const u = [skyU.top, skyU.mid, skyU.bot][j];
            u.value.copy(cA.set(a[j + 1])).lerp(cB.set(b[j + 1]), k);
        }
        scene.fog.color.copy(skyU.mid.value).lerp(skyU.bot.value, 0.45);
    }

    // სინათლე
    const hemi = new THREE.HemisphereLight(0xFFD9C9, COL.navy3, 1.1); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xFFB38F, 2.4); scene.add(sun); scene.add(sun.target);
    const fill = new THREE.DirectionalLight(0x6F86C9, 0.6); fill.position.set(-1, 1, 1); scene.add(fill);

    // მზე
    const sunSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture("rgba(255,170,140,1)", "rgba(255,107,91,0)"), fog: false, depthWrite: false, blending: THREE.AdditiveBlending }));
    sunSpr.scale.set(160, 160, 1); scene.add(sunSpr);

    // რელიეფი
    const W = 380, D = LEN + 260, sx = MOB ? 110 : 180, sz = MOB ? 230 : 380;
    const tg = new THREE.PlaneGeometry(W, D, sx, sz); tg.rotateX(-Math.PI / 2); tg.translate(0, 0, 70 - D / 2);
    const pos = tg.attributes.position, col = new Float32Array(pos.count * 3);
    const cLow = new THREE.Color("#1E2E55"), cMid = new THREE.Color("#2E4478"), cHigh = new THREE.Color("#55689A"), cSnow = new THREE.Color("#F6F1E7"), cSand = new THREE.Color("#C9A98A"), c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i), h = heightAt(x, z);
        pos.setY(i, h);
        if (h < -0.2) c.copy(cSand).lerp(cLow, smooth(-0.2, -3, h));
        else if (h < 10) c.copy(cLow).lerp(cMid, h / 10);
        else if (h < 24) c.copy(cMid).lerp(cHigh, (h - 10) / 14);
        else c.copy(cHigh).lerp(cSnow, smooth(22, 30, h));
        c.offsetHSL(0, 0, (hash(i, 3) - 0.5) * 0.03);
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    tg.setAttribute("color", new THREE.BufferAttribute(col, 3));
    tg.computeVertexNormals();
    scene.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })));

    // ზღვა
    const seaM = new THREE.MeshStandardMaterial({ color: COL.sea, roughness: 0.25, metalness: 0.6, transparent: true, opacity: 0.92 });
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(W, 340, 1, 1), seaM); sea.rotation.x = -Math.PI / 2; sea.position.set(0, -0.6, -100); scene.add(sea);

    // გზა და მონიშვნა
    const N = Math.round(LEN * 1.25), rw = 3.2, vp = [], ix = [];
    const z0 = 40, z1 = -LEN - 60;
    for (let i = 0; i <= N; i++) {
        const z = lerp(z0, z1, i / N), x = roadX(z), dx = (roadX(z - 0.5) - roadX(z + 0.5));
        const len = Math.hypot(dx, 1), nx = 1 / len, nz = dx / len; // გზის პერპენდიკულარი
        vp.push(x - nx * rw, 0.07, z - nz * rw, x + nx * rw, 0.07, z + nz * rw);
        if (i) { const a = (i - 1) * 2; ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const rg = new THREE.BufferGeometry(); rg.setAttribute("position", new THREE.Float32BufferAttribute(vp, 3)); rg.setIndex(ix); rg.computeVertexNormals();
    scene.add(new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ color: 0x0E162C, roughness: 0.75, side: THREE.DoubleSide })));
    const dashN = Math.round((z0 - z1) / 4.5);
    const dash = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.05, 1.7), new THREE.MeshStandardMaterial({ color: COL.cream, emissive: 0xFFE7C4, emissiveIntensity: 0.35 }), dashN);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s1 = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < dashN; i++) {
        const z = z0 - i * 4.5;
        e.set(0, Math.atan2(-(roadX(z - 0.5) - roadX(z + 0.5)), 1), 0); q.setFromEuler(e); m4.compose(v.set(roadX(z), 0.1, z), q, s1); dash.setMatrixAt(i, m4);
    }
    scene.add(dash);

    // ხეები
    const treeN = MOB ? 650 : 1400;
    const tree = new THREE.InstancedMesh(new THREE.ConeGeometry(1, 3.4, 5), new THREE.MeshStandardMaterial({ color: 0x24406A, flatShading: true, roughness: 0.9 }), treeN);
    let placed = 0;
    for (let k = 0; k < treeN * 4 && placed < treeN; k++) {
        const z = lerp(z0, z1, rnd()), side = rnd() < 0.5 ? -1 : 1, d = 6 + rnd() * 50, x = roadX(z) + side * d, h = heightAt(x, z);
        const t = tAt(z);
        if (h < 0.3 || h > 18 || t > 0.86) continue;
        const sc = 0.6 + rnd() * 0.9;
        m4.compose(v.set(x, h + 1.5 * sc, z), q.identity(), new THREE.Vector3(sc, sc * (0.8 + rnd() * 0.6), sc));
        tree.setMatrixAt(placed++, m4);
    }
    tree.count = placed; scene.add(tree);

    // ქალაქები: შენობები განათებული ფანჯრებით
    const winTex = windowsTexture();
    function city(t, n, spread, maxH, side) {
        const z = zAt(t), m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x1B2A50, roughness: 0.6, emissive: 0xffffff, emissiveMap: winTex, emissiveIntensity: 0.9 }), n);
        let c = 0;
        for (let i = 0; i < n * 3 && c < n; i++) {
            const dz = (rnd() - 0.5) * spread, sd = side || (rnd() < 0.5 ? -1 : 1), d = 22 + rnd() * spread * 0.7;
            const x = roadX(z + dz) + sd * d, zz = z + dz, h = heightAt(x, zz);
            if (h < -0.3) continue;
            const w = 2 + rnd() * 3, hh = 2 + Math.pow(rnd(), 2.6) * maxH * Math.min(1, (d - 12) / 30);
            m4.compose(v.set(x, h + hh / 2, zz), q.identity(), new THREE.Vector3(w, hh, 2 + rnd() * 3)); m.setMatrixAt(c++, m4);
        }
        m.count = c; scene.add(m); return m;
    }
    city(0.03, 60, 50, 20, 1);   // ბათუმი
    city(0.32, 26, 30, 8);       // ფოთი
    city(0.46, 50, 40, 12);      // ქუთაისი
    city(0.6, 80, 60, 16);       // თბილისი
    const moscow = city(1.05, 190, 120, 50);    // მოსკოვი

    // გაჩერებების ნიშნები: ნარინჯისფერი სვეტი და რგოლი
    const STOPS = window.TRIP_STOPS || [0.08, 0.2, 0.32, 0.46, 0.6, 0.76, 0.93];
    const beamTex = glowTexture("rgba(255,107,91,.9)", "rgba(255,107,91,0)");
    const marks = STOPS.map(t => {
        const z = zAt(t), x = roadX(z) - 7.5, g = new THREE.Group();
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.09, 8, 40), new THREE.MeshBasicMaterial({ color: COL.coral }));
        ring.rotation.x = -Math.PI / 2; ring.position.y = 0.2; g.add(ring);
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 40, 8, 1, true), new THREE.MeshBasicMaterial({ color: COL.coral, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
        col.position.y = 20; g.add(col);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: beamTex, depthWrite: false, blending: THREE.AdditiveBlending }));
        glow.scale.set(7, 7, 1); glow.position.y = 1.2; g.add(glow);
        g.position.set(x, Math.max(0, heightAt(x, z)), z); scene.add(g);
        g.ring = ring; g.glow = glow; g.t = t; return g;
    });

    // ვარსკვლავები
    const SN = MOB ? 900 : 1800, sp = new Float32Array(SN * 3);
    for (let i = 0; i < SN; i++) {
        const th = rnd() * Math.PI * 2, ph = Math.acos(rnd() * 0.9), r = 800;
        sp[i * 3] = r * Math.sin(ph) * Math.cos(th); sp[i * 3 + 1] = r * Math.cos(ph); sp[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xFFF6E8, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
    scene.add(stars);

    // ავტობუსი
    const bus = makeBus(); scene.add(bus);
    const head = new THREE.SpotLight(0xFFF0D0, 0, 60, 0.5, 0.6, 1.2); bus.add(head); head.position.set(0, 1, -4); bus.add(head.target); head.target.position.set(0, 0, -20);

    // კამერის წერტილები: [p, მარჯვნივ, ზემოთ, უკან, სად იყურება წინ, სიმაღლე ყურებისას]
    const K = [
        [0.00, -26, 26, 34, 40, 4], [0.07, 7, 5, 15, 12, 1.5], [0.2, 15, 6, 12, 8, 1.6], [0.33, -9, 9, 20, 18, 2],
        [0.46, 12, 6, -16, -2, 1.8], [0.6, -14, 12, 24, 26, 3], [0.72, 24, 18, 26, 30, 8], [0.8, 9, 5, 16, 16, 3],
        [0.87, 12, 6, -20, 0, 1.8], [0.94, -16, 14, 28, 26, 6], [1.0, -24, 26, 40, 40, 9]];
    function camKey(p) {
        let i = 1; while (i < K.length - 1 && p > K[i][0]) i++;
        const a = K[i - 1], b = K[i], k = smooth(a[0], b[0], p), o = [];
        for (let j = 1; j < 6; j++) o.push(lerp(a[j], b[j], k));
        return o;
    }

    let ps = 0, last = performance.now(), wheel = 0, mx = 0, my = 0, w = 0, h = 0;
    const camPos = new THREE.Vector3(), look = new THREE.Vector3(), lookS = new THREE.Vector3(), tmp = new THREE.Vector3();
    let first = true;
    addEventListener("pointermove", e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    function size() {
        const nw = canvas.clientWidth, nh = canvas.clientHeight;
        if (nw === w && nh === h) return;
        w = nw; h = nh; R.setSize(w, h, false); cam.aspect = w / h; cam.fov = w / h < 0.8 ? 64 : 50; cam.updateProjectionMatrix();
    }
    function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        size();
        const target = window.TRIP_P || 0;
        ps += (target - ps) * (1 - Math.exp(-dt * (RM ? 20 : 3.2)));
        const t = 0.015 + ps * 0.955;
        const z = zAt(t), x = roadX(z), dxz = roadX(z - 0.5) - roadX(z + 0.5);
        const fwd = tmp.set(dxz, 0, -1).normalize(), right = new THREE.Vector3(-fwd.z, 0, fwd.x);
        bus.position.set(x + right.x * 1.6, 0.08 + Math.sin(now * 0.012) * 0.02, z + right.z * 1.6);
        bus.rotation.y = Math.atan2(-fwd.x, -fwd.z);
        const speed = Math.abs(target - ps) * 400 + 0.6;
        wheel -= speed * dt * 3; bus.wheels.forEach(wh => wh.rotation.x = wheel);

        const o = camKey(ps), bp = bus.position;
        camPos.set(bp.x + right.x * o[0] - fwd.x * o[2], bp.y + o[1], bp.z + right.z * o[0] - fwd.z * o[2]);
        camPos.x += mx * 4; camPos.y += -my * 2.5 + Math.sin(now * 0.0006) * 0.4;
        const gh = heightAt(camPos.x, camPos.z) + 2.5; if (camPos.y < gh) camPos.y = gh;
        look.set(bp.x + fwd.x * o[3], bp.y + o[4], bp.z + fwd.z * o[3]);
        if (first) { cam.position.copy(camPos); lookS.copy(look); first = false; }
        cam.position.lerp(camPos, 1 - Math.exp(-dt * 4)); lookS.lerp(look, 1 - Math.exp(-dt * 5)); cam.lookAt(lookS);
        sky.position.copy(cam.position); stars.position.copy(cam.position);

        // დღე-ღამე: მზე ჩადის, ვარსკვლავები ჩნდება, ფარები ინთება
        skyAt(ps);
        const night = smooth(0.5, 0.95, ps);
        sunSpr.position.set(bp.x + 120, lerp(60, -40, smooth(0.1, 0.85, ps)), bp.z - 520);
        sunSpr.material.opacity = 1 - night * 0.9;
        sun.position.copy(sunSpr.position); sun.target.position.copy(bp);
        sun.intensity = lerp(2.6, 0.35, night); sun.color.setHSL(0.03, 0.9, lerp(0.75, 0.6, night));
        hemi.intensity = lerp(1.15, 0.45, night);
        stars.material.opacity = smooth(0.35, 0.85, ps);
        moscow.visible = ps > 0.83; // მოსკოვი ჩანს მხოლოდ ბოლოს
        head.intensity = night * 60; bus.beam.material.opacity = 0.35 + night * 0.65;
        seaM.color.setHex(COL.sea).lerp(cA.set("#FF8A6B"), 0.12 * (1 - night));
        marks.forEach(m => {
            const near = 1 - smooth(0.015, 0.07, Math.abs(m.t - ps));
            const pul = 1 + Math.sin(now * 0.004) * 0.12;
            m.ring.scale.setScalar(pul + near * 0.8); m.glow.scale.setScalar(6 + near * 8);
        });
        R.render(scene, cam);
    }
    return { frame, canvas, dispose: () => R.dispose() };
}

// ======================================================================
// 4. შიდა გვერდების სცენები
// ======================================================================
function mini(canvas, kind) {
    const R = makeRenderer(canvas, true);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    cam.position.set(0, 0, 18);
    scene.add(new THREE.HemisphereLight(0xFFE5D8, COL.navy3, 1.4));
    const key = new THREE.DirectionalLight(0xFFB59A, 2.6); key.position.set(6, 8, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x7C93D6, 1.6); rim.position.set(-8, 2, -6); scene.add(rim);
    const root = new THREE.Group(); scene.add(root);
    const items = [];
    const coral = new THREE.MeshStandardMaterial({ color: COL.coral, roughness: 0.35, metalness: 0.2, flatShading: true });
    const cream = new THREE.MeshStandardMaterial({ color: COL.cream, roughness: 0.4, metalness: 0.1, flatShading: true });
    const navy = new THREE.MeshStandardMaterial({ color: 0x2E4478, roughness: 0.3, metalness: 0.5, flatShading: true });
    let tick = () => { };

    if (kind === "bus") {
        // ავტობუსი ტრიალებს მოძრავ გზაზე
        const bus = makeBus(); bus.scale.setScalar(1.15); root.add(bus); bus.remove(bus.beam);
        const road = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.3, 64), new THREE.MeshStandardMaterial({ color: 0x0E162C, roughness: 0.7 }));
        road.position.y = -0.18; root.add(road);
        const dashes = new THREE.Group();
        for (let i = 0; i < 9; i++) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 1.3), cream); d.position.set(-1.6, 0.02, -8 + i * 2); dashes.add(d); }
        root.add(dashes);
        const ringM = new THREE.Mesh(new THREE.TorusGeometry(9.1, 0.08, 6, 80), new THREE.MeshBasicMaterial({ color: COL.coral })); ringM.rotation.x = Math.PI / 2; root.add(ringM);
        root.rotation.x = 0.32; cam.position.set(0, 3, 26);
        tick = (t, dt) => {
            root.rotation.y = t * 0.25 + px * 0.6;
            bus.wheels.forEach(w => w.rotation.x -= dt * 6);
            dashes.children.forEach(d => { d.position.z += dt * 6; if (d.position.z > 8) d.position.z -= 18; d.visible = Math.abs(d.position.z) < 8.5; });
            bus.position.y = Math.sin(t * 9) * 0.03;
        };
    } else if (kind === "orbit") {
        // საათი/გრაფიკი: რგოლები სხვადასხვა ღერძზე, ზედ რეისების წერტილები
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), coral); root.add(core);
        for (let i = 0; i < 4; i++) {
            const g = new THREE.Group(), r = 3 + i * 1.5;
            g.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 6, 120), new THREE.MeshBasicMaterial({ color: i % 2 ? COL.cream : COL.coral, transparent: true, opacity: 0.55 })));
            for (let k = 0; k < 2 + i; k++) {
                const a = k / (2 + i) * Math.PI * 2, b = new THREE.Mesh(new THREE.SphereGeometry(0.22 + (i === 0 ? 0.08 : 0), 12, 8), k % 2 ? cream : coral);
                b.position.set(Math.cos(a) * r, Math.sin(a) * r, 0); g.add(b);
            }
            g.rotation.set(Math.PI / 2 + (i - 1.5) * 0.45, i * 0.6, 0); g.sp = (i % 2 ? -1 : 1) * (0.25 + i * 0.08); root.add(g); items.push(g);
        }
        tick = t => { items.forEach(g => g.rotation.z = t * g.sp); core.rotation.set(t * 0.4, t * 0.6, 0); root.rotation.y = px * 0.5; root.rotation.x = py * 0.3; };
    } else if (kind === "boxes") {
        // ამანათები: ყუთები ცურავს და ტრიალებს
        const boxM = new THREE.MeshStandardMaterial({ color: 0xE7D3AE, roughness: 0.85 });
        for (let i = 0; i < 16; i++) {
            const g = new THREE.Group(), s = 0.8 + rnd() * 1.4;
            g.add(new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.8, s), boxM));
            const tape = new THREE.Mesh(new THREE.BoxGeometry(s * 0.22, s * 0.81, s * 1.01), coral); g.add(tape);
            g.position.set(rnd() * 17 - 5, (rnd() - 0.5) * 12, (rnd() - 0.5) * 8 - 2);
            g.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); g.v = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.8);
            g.sp = 0.4 + rnd() * 0.6; g.y0 = g.position.y; root.add(g); items.push(g);
        }
        tick = (t, dt) => { items.forEach((g, i) => { g.rotation.x += g.v.x * dt; g.rotation.y += g.v.y * dt; g.position.y = g.y0 + Math.sin(t * g.sp + i) * 0.8; }); root.position.x = px * 1.5; root.position.y = -py; };
    } else if (kind === "planes") {
        // პირობები: ქაღალდის თვითმფრინავები მიფრინავს
        const pg = new THREE.BufferGeometry();
        pg.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, -1.4, -0.9, 0.05, 0.8, 0, -0.15, 0.6, 0, 0, -1.4, 0, -0.15, 0.6, 0.9, 0.05, 0.8, 0, 0, -1.4, 0, -0.15, 0.6, 0, -0.45, 0.7], 3));
        pg.computeVertexNormals();
        const pm = new THREE.MeshStandardMaterial({ color: COL.cream, side: THREE.DoubleSide, flatShading: true, roughness: 0.6 });
        for (let i = 0; i < 9; i++) {
            const p = new THREE.Mesh(pg, i % 3 ? pm : coral); p.scale.setScalar(0.9 + rnd() * 0.9);
            p.r = 4 + rnd() * 8; p.sp = 0.25 + rnd() * 0.35; p.ph = rnd() * 6; p.h = (rnd() - 0.5) * 6; root.add(p); items.push(p);
        }
        const trail = new THREE.Mesh(new THREE.TorusGeometry(8, 0.03, 4, 160), new THREE.MeshBasicMaterial({ color: COL.cream, transparent: true, opacity: 0.25 }));
        trail.rotation.x = Math.PI / 2.4; root.add(trail);
        tick = t => {
            items.forEach(p => {
                const a = t * p.sp + p.ph, x = Math.cos(a) * p.r, z = Math.sin(a) * p.r * 0.5, y = p.h + Math.sin(a * 2) * 0.8;
                p.position.set(x, y, z); p.lookAt(Math.cos(a + 0.05) * p.r, p.h + Math.sin((a + 0.05) * 2) * 0.8, Math.sin(a + 0.05) * p.r * 0.5); p.rotateY(Math.PI); p.rotateZ(Math.sin(a) * 0.4);
            });
            root.rotation.y = px * 0.4; root.rotation.x = 0.2 + py * 0.2;
        };
    } else {
        // კითხვები: დაბალპოლიგონიანი კრისტალები
        const geos = [new THREE.IcosahedronGeometry(1, 0), new THREE.OctahedronGeometry(1, 0), new THREE.DodecahedronGeometry(1, 0)];
        const mats = [coral, cream, navy];
        for (let i = 0; i < 18; i++) {
            const m = new THREE.Mesh(geos[i % 3], mats[i % 3]); m.scale.setScalar(0.5 + rnd() * 1.3);
            m.position.set((rnd() - 0.5) * 28, (rnd() - 0.5) * 12, (rnd() - 0.5) * 10 - 3); m.sp = (rnd() - 0.5) * 1.4; m.y0 = m.position.y; root.add(m); items.push(m);
        }
        tick = t => { items.forEach((m, i) => { m.rotation.set(t * m.sp, t * m.sp * 0.7, 0); m.position.y = m.y0 + Math.sin(t * 0.8 + i) * 0.6; }); root.rotation.y = px * 0.5; root.rotation.x = py * 0.3; };
    }

    let px = 0, py = 0, w = 0, h = 0, last = performance.now(), t = 0;
    addEventListener("pointermove", e => { px += ((e.clientX / innerWidth - 0.5) - px) * 0.5; py += ((e.clientY / innerHeight - 0.5) - py) * 0.5; }, { passive: true });
    function size() {
        const nw = canvas.clientWidth, nh = canvas.clientHeight;
        if (nw === w && nh === h) return;
        w = nw; h = nh; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
        // ფართო ეკრანზე ობიექტი მარჯვნივაა (ტექსტი მარცხნივ), ტელეფონზე ზემოთ
        const wide = w / h > 1.25;
        root.position.set(wide ? (kind === "bus" ? 8 : 6) * Math.min(1.6, w / h / 1.6) : 0, wide ? 0 : (kind === "bus" ? 3.2 : 2.5), 0);
        root.scale.setScalar(wide ? 1 : 0.72);
        root.userData.base = root.position.clone();
    }
    function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000); last = now; t += RM ? 0 : dt;
        size();
        const b = root.userData.base;
        tick(t, RM ? 0 : dt);
        if (b && kind !== "boxes") root.position.copy(b);
        else if (b) { root.position.x += b.x; root.position.y += b.y; }
        R.render(scene, cam);
    }
    return { frame, canvas, dispose: () => R.dispose() };
}

// ======================================================================
// 5. გაშვება: მხოლოდ ხილული სცენა იხატება
// ======================================================================
// სუსტი მოწყობილობა ან ნელი ინტერნეტი: 3D-ს გარეშე (ჩანს ფონის სურათი)
const NC = navigator.connection || {};
const LITE = NC.saveData || /(^|-)2g/.test(NC.effectiveType || "") || (navigator.deviceMemory && navigator.deviceMemory < 2);
if (!webgl() || LITE) document.documentElement.classList.add("no3d");
else {
    if (document.readyState !== "complete") await new Promise(r => addEventListener("load", r, { once: true }));
    await new Promise(r => (window.requestIdleCallback || setTimeout)(r, { timeout: 1200 }));
    THREE = await import("./vendor/three.module.min.js");
    const live = new Map();
    const seen = new WeakMap();
    const io = new IntersectionObserver(es => es.forEach(e => seen.set(e.target, e.isIntersecting)), { rootMargin: "100px" });
    function make(c) {
        if (live.has(c)) return;
        try {
            const s = c.id === "gl" ? journey(c) : mini(c, c.parentNode.dataset.scene);
            live.set(c, s); io.observe(c);
            requestAnimationFrame(() => c.classList.add("on"));
        } catch (err) { console.warn("3D:", err); }
    }
    function scan() {
        // ღია გვერდის ტილოები (დამალულ გვერდებზე არაფერს ვხატავთ)
        document.querySelectorAll("#gl, .phgl").forEach(c => { if (c.offsetParent !== null) make(c); });
    }
    scan();
    addEventListener("hashchange", () => setTimeout(scan, 50));
    function loop(now) {
        if (!document.hidden) live.forEach((s, c) => { if (seen.get(c) && c.offsetParent !== null) s.frame(now); });
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}
