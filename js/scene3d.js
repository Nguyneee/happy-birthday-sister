/**
 * 3D Birthday Experience using Three.js
 * Multi-tier Cake with 3D Number 31 Candles, Dual Flickering Flames,
 * Fairy Light Garlands, Party Bunting, Floating Balloons, Gift Boxes,
 * Wishing Sky Lanterns, 3D Confetti Physics & Starfield.
 */

class BirthdayScene {
    constructor(canvasContainerId) {
        this.container = document.getElementById(canvasContainerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        // State
        this.isCandleLit = true;
        this.candleFlames = [];
        this.candleLights = [];
        this.cakeGroup = new THREE.Group();
        this.balloons = [];
        this.floatingPresents = [];
        this.lanterns = [];
        this.confettiPieces = [];
        this.smokeParticles = [];
        this.fairyLights = [];
        this.buntingFlags = [];
        this.stars = null;
        this.clock = new THREE.Clock();

        this.autoRotate = true;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        // 1. Scene & Atmospheric Fog
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x130722, 0.022);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 3.8, 10.5);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 4. OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enablePan = false;
            this.controls.minDistance = 5.0;
            this.controls.maxDistance = 16.0;
            this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
            this.controls.target.set(0, 1.8, 0);
        }

        // 5. Lights
        this.setupLights();

        // 6. Build 3D Objects & Background Environment
        this.createPartyTable();
        this.createCake();
        this.createNumberCandles31();
        this.createFairyLightsBackground();
        this.createBuntingFlagsBackground();
        this.createBalloons();
        this.createFloatingPresents();
        this.createStarfield();
        this.createDistantLanterns();

        // 7. Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });

        // 8. Start Render Loop
        this.animate();
    }

    setupLights() {
        // Ambient Light - soft mystical lavender
        const ambientLight = new THREE.AmbientLight(0x5a4373, 1.15);
        this.scene.add(ambientLight);

        // Main Warm Sun Light
        const mainLight = new THREE.DirectionalLight(0xfff2de, 1.35);
        mainLight.position.set(6, 12, 8);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 30;
        this.scene.add(mainLight);

        // Rim Light - neon rose magenta
        const rimLight = new THREE.DirectionalLight(0xff5599, 1.25);
        rimLight.position.set(-8, 6, -8);
        this.scene.add(rimLight);

        // Subtle bottom soft bounce light
        const bounceLight = new THREE.PointLight(0xa8329e, 0.9, 12);
        bounceLight.position.set(0, -3, 0);
        this.scene.add(bounceLight);
    }

    createPartyTable() {
        // Large round banquet table surface below the cake
        const tableGeo = new THREE.CylinderGeometry(8.5, 8.5, 0.4, 64);
        const tableMat = new THREE.MeshStandardMaterial({
            color: 0x210c38,
            roughness: 0.35,
            metalness: 0.25
        });
        const table = new THREE.Mesh(tableGeo, tableMat);
        table.position.y = -0.45;
        table.receiveShadow = true;
        this.scene.add(table);

        // Glowing golden table edge rim
        const rimGeo = new THREE.TorusGeometry(8.52, 0.06, 16, 64);
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.8,
            roughness: 0.2
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = -0.25;
        this.scene.add(rim);
    }

    createCake() {
        // Pedestal Plate (Marble / Rose Gold)
        const plateGeo = new THREE.CylinderGeometry(2.8, 2.4, 0.25, 64);
        const plateMat = new THREE.MeshStandardMaterial({
            color: 0xffeef5,
            metalness: 0.35,
            roughness: 0.2
        });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = 0.125;
        plate.receiveShadow = true;
        plate.castShadow = true;
        this.cakeGroup.add(plate);

        // Pedestal Base Stand
        const standGeo = new THREE.CylinderGeometry(1.2, 1.8, 0.35, 48);
        const stand = new THREE.Mesh(standGeo, plateMat);
        stand.position.y = -0.15;
        stand.receiveShadow = true;
        this.cakeGroup.add(stand);

        // --- TIER 1: Bottom Tier (Strawberry Rose Fondant) ---
        const tier1Geo = new THREE.CylinderGeometry(2.3, 2.3, 1.2, 64);
        const tier1Mat = new THREE.MeshStandardMaterial({
            color: 0xfcb4c5,
            roughness: 0.4,
            metalness: 0.05
        });
        const tier1 = new THREE.Mesh(tier1Geo, tier1Mat);
        tier1.position.y = 0.85;
        tier1.castShadow = true;
        tier1.receiveShadow = true;
        this.cakeGroup.add(tier1);

        // Tier 1 bottom decorative piping pearls
        const pearlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
        const pearlCount = 28;
        for (let i = 0; i < pearlCount; i++) {
            const angle = (i / pearlCount) * Math.PI * 2;
            const px = Math.cos(angle) * 2.32;
            const pz = Math.sin(angle) * 2.32;
            const pearlGeo = new THREE.SphereGeometry(0.09, 16, 16);
            const pearl = new THREE.Mesh(pearlGeo, pearlMat);
            pearl.position.set(px, 0.3, pz);
            this.cakeGroup.add(pearl);
        }

        // --- TIER 2: Middle Tier (Creamy Vanilla White) ---
        const tier2Geo = new THREE.CylinderGeometry(1.65, 1.65, 1.05, 64);
        const tier2Mat = new THREE.MeshStandardMaterial({
            color: 0xfff9f2,
            roughness: 0.35,
            metalness: 0.05
        });
        const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
        tier2.position.y = 1.95;
        tier2.castShadow = true;
        tier2.receiveShadow = true;
        this.cakeGroup.add(tier2);

        // Tier 2 Strawberry Glaze Drip
        const dripTorus = new THREE.TorusGeometry(1.68, 0.08, 16, 64);
        const dripMat = new THREE.MeshStandardMaterial({
            color: 0xff4f79,
            roughness: 0.15,
            metalness: 0.2
        });
        const dripMesh = new THREE.Mesh(dripTorus, dripMat);
        dripMesh.rotation.x = Math.PI / 2;
        dripMesh.position.y = 2.45;
        this.cakeGroup.add(dripMesh);

        // Golden sprinkles on tier 2
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
        for (let i = 0; i < 22; i++) {
            const angle = (i / 22) * Math.PI * 2 + (Math.random() * 0.2);
            const r = 1.67;
            const sx = Math.cos(angle) * r;
            const sz = Math.sin(angle) * r;
            const sy = 1.6 + Math.random() * 0.7;
            const sprinkle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.04), goldMat);
            sprinkle.position.set(sx, sy, sz);
            sprinkle.rotation.set(Math.random(), Math.random(), Math.random());
            this.cakeGroup.add(sprinkle);
        }

        // --- TIER 3: Top Tier (Pastel Coral Peach) ---
        const tier3Geo = new THREE.CylinderGeometry(1.05, 1.05, 0.9, 64);
        const tier3Mat = new THREE.MeshStandardMaterial({
            color: 0xff8fa3,
            roughness: 0.35,
            metalness: 0.05
        });
        const tier3 = new THREE.Mesh(tier3Geo, tier3Mat);
        tier3.position.y = 2.9;
        tier3.castShadow = true;
        tier3.receiveShadow = true;
        this.cakeGroup.add(tier3);

        // Whipped Cream dollops on top rim
        const creamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
        const creamCount = 10;
        for (let i = 0; i < creamCount; i++) {
            const angle = (i / creamCount) * Math.PI * 2;
            const cx = Math.cos(angle) * 0.88;
            const cz = Math.sin(angle) * 0.88;
            const cream = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 16), creamMat);
            cream.position.set(cx, 3.42, cz);
            cream.rotation.y = angle;
            this.cakeGroup.add(cream);
        }

        // 3D Strawberries on Top Tier (placed strategically to frame the 31 candles)
        const berryAngles = [Math.PI * 0.55, Math.PI * 0.85, Math.PI * 1.15, Math.PI * 1.45];
        berryAngles.forEach(angle => {
            const sx = Math.cos(angle) * 0.62;
            const sz = Math.sin(angle) * 0.62;
            const berryGroup = this.createStrawberry();
            berryGroup.position.set(sx, 3.42, sz);
            berryGroup.scale.set(0.68, 0.68, 0.68);
            this.cakeGroup.add(berryGroup);
        });

        // Add Entire Cake Base to Scene
        this.scene.add(this.cakeGroup);
    }

    createStrawberry() {
        const group = new THREE.Group();
        // Berry body: pointed tip at top, wide base at bottom
        const berryGeo = new THREE.ConeGeometry(0.18, 0.32, 16);
        berryGeo.translate(0, 0.16, 0);
        const berryMat = new THREE.MeshStandardMaterial({
            color: 0xd90429,
            roughness: 0.25,
            metalness: 0.1
        });
        const berry = new THREE.Mesh(berryGeo, berryMat);
        group.add(berry);

        // Green leaf crown at bottom base
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x38b000, roughness: 0.5 });
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.14), leafMat);
            leaf.position.set(Math.cos(angle) * 0.12, 0.02, Math.sin(angle) * 0.12);
            leaf.rotation.y = angle;
            group.add(leaf);
        }
        return group;
    }

    /**
     * 3D Candlesticks in Shape of Number "3" and "1"
     */
    createNumberCandles31() {
        // Luxury Golden Wax Material with brilliant gloss and shimmer
        const candleMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.85,
            roughness: 0.18,
            envMapIntensity: 1.5
        });

        const extrudeSettings = {
            depth: 0.16,
            bevelEnabled: true,
            bevelThickness: 0.035,
            bevelSize: 0.035,
            bevelSegments: 4
        };

        // --- BOLD DIGIT 3 ---
        const s3 = new THREE.Shape();
        s3.moveTo(-0.25, 0.55);
        s3.lineTo(0.25, 0.55);
        s3.quadraticCurveTo(0.38, 0.55, 0.38, 0.28);
        s3.quadraticCurveTo(0.38, 0.06, 0.10, 0.02);
        s3.quadraticCurveTo(0.40, -0.02, 0.40, -0.28);
        s3.quadraticCurveTo(0.40, -0.55, 0.20, -0.55);
        s3.lineTo(-0.25, -0.55);
        s3.lineTo(-0.25, -0.35);
        s3.lineTo(0.16, -0.35);
        s3.quadraticCurveTo(0.24, -0.35, 0.24, -0.24);
        s3.quadraticCurveTo(0.24, -0.12, 0.05, -0.12);
        s3.lineTo(-0.12, -0.12);
        s3.lineTo(-0.12, 0.08);
        s3.lineTo(0.05, 0.08);
        s3.quadraticCurveTo(0.22, 0.08, 0.22, 0.22);
        s3.quadraticCurveTo(0.22, 0.35, 0.14, 0.35);
        s3.lineTo(-0.25, 0.35);
        s3.closePath();

        const geo3 = new THREE.ExtrudeGeometry(s3, extrudeSettings);
        const mesh3 = new THREE.Mesh(geo3, candleMat);
        mesh3.castShadow = true;
        // Position number 3 on left of center
        const posX3 = -0.36;
        const posY = 3.95;
        mesh3.position.set(posX3 - 0.07, posY, 0);
        this.cakeGroup.add(mesh3);

        // Pick / stick at bottom of digit 3
        const pickMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const pick3 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12), pickMat);
        pick3.position.set(posX3, posY - 0.65, 0.08);
        this.cakeGroup.add(pick3);

        // Wick 3
        const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const wick3 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), wickMat);
        wick3.position.set(posX3 + 0.04, posY + 0.65, 0.08);
        this.cakeGroup.add(wick3);

        // Flame 3
        const flame3 = this.createFlameMesh();
        flame3.position.set(posX3 + 0.04, posY + 0.80, 0.08);
        this.cakeGroup.add(flame3);
        this.candleFlames.push(flame3);

        // Candle Light 3
        const light3 = new THREE.PointLight(0xffa726, 2.2, 9, 2);
        light3.position.set(posX3 + 0.04, posY + 0.82, 0.2);
        light3.castShadow = true;
        this.scene.add(light3);
        this.candleLights.push(light3);

        // --- BOLD DIGIT 1 ---
        const s1 = new THREE.Shape();
        s1.moveTo(-0.22, -0.55);
        s1.lineTo(0.22, -0.55);
        s1.lineTo(0.22, -0.35);
        s1.lineTo(0.08, -0.35);
        s1.lineTo(0.08, 0.55);
        s1.lineTo(-0.08, 0.55);
        s1.lineTo(-0.28, 0.32);
        s1.lineTo(-0.16, 0.20);
        s1.lineTo(-0.08, 0.28);
        s1.lineTo(-0.08, -0.35);
        s1.lineTo(-0.22, -0.35);
        s1.closePath();

        const geo1 = new THREE.ExtrudeGeometry(s1, extrudeSettings);
        const mesh1 = new THREE.Mesh(geo1, candleMat);
        mesh1.castShadow = true;
        // Position number 1 on right of center
        const posX1 = 0.36;
        mesh1.position.set(posX1 - 0.03, posY, 0);
        this.cakeGroup.add(mesh1);

        // Pick / stick at bottom of digit 1
        const pick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12), pickMat);
        pick1.position.set(posX1, posY - 0.65, 0.08);
        this.cakeGroup.add(pick1);

        // Wick 1
        const wick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), wickMat);
        wick1.position.set(posX1, posY + 0.65, 0.08);
        this.cakeGroup.add(wick1);

        // Flame 1
        const flame1 = this.createFlameMesh();
        flame1.position.set(posX1, posY + 0.80, 0.08);
        this.cakeGroup.add(flame1);
        this.candleFlames.push(flame1);

        // Candle Light 1
        const light1 = new THREE.PointLight(0xffa726, 2.2, 9, 2);
        light1.position.set(posX1, posY + 0.82, 0.2);
        light1.castShadow = true;
        this.scene.add(light1);
        this.candleLights.push(light1);
    }

    createFlameMesh() {
        const flameGroup = new THREE.Group();

        // Outer Flame (Glowing Orange)
        const outerFlameGeo = new THREE.ConeGeometry(0.075, 0.24, 16);
        outerFlameGeo.translate(0, 0.12, 0);
        const outerFlameMat = new THREE.MeshBasicMaterial({
            color: 0xff7700,
            transparent: true,
            opacity: 0.9
        });
        const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
        flameGroup.add(outerFlame);

        // Inner Flame Core (Bright Yellow-White)
        const innerFlameGeo = new THREE.ConeGeometry(0.04, 0.16, 16);
        innerFlameGeo.translate(0, 0.08, 0);
        const innerFlameMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95
        });
        const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
        flameGroup.add(innerFlame);

        // Flame Halo Aura (Soft Sphere)
        const haloGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
            color: 0xffa500,
            transparent: true,
            opacity: 0.28
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.y = 0.1;
        flameGroup.add(halo);

        return flameGroup;
    }

    /**
     * Hanging Fairy Lights Garlands in the Background
     */
    createFairyLightsBackground() {
        const garlandConfigs = [
            {
                start: new THREE.Vector3(-9, 8.5, -5.5),
                mid: new THREE.Vector3(0, 6.8, -4.5),
                end: new THREE.Vector3(9, 8.5, -5.5),
                bulbCount: 16
            },
            {
                start: new THREE.Vector3(-9, 7.2, -7.5),
                mid: new THREE.Vector3(0, 5.0, -6.5),
                end: new THREE.Vector3(9, 7.2, -7.5),
                bulbCount: 18
            }
        ];

        garlandConfigs.forEach((cfg) => {
            const curve = new THREE.QuadraticBezierCurve3(cfg.start, cfg.mid, cfg.end);
            
            // Wire
            const wireGeo = new THREE.TubeGeometry(curve, 40, 0.015, 6, false);
            const wireMat = new THREE.MeshBasicMaterial({ color: 0x332244 });
            const wire = new THREE.Mesh(wireGeo, wireMat);
            this.scene.add(wire);

            // Glowing Light Bulbs along the curve
            const bulbMat = new THREE.MeshStandardMaterial({
                color: 0xffe6a3,
                emissive: 0xffaa00,
                emissiveIntensity: 1.35,
                roughness: 0.15
            });

            for (let i = 1; i < cfg.bulbCount; i++) {
                const t = i / cfg.bulbCount;
                const pt = curve.getPoint(t);

                // Little hanging cord
                const cordGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6);
                const cord = new THREE.Mesh(cordGeo, wireMat);
                cord.position.set(pt.x, pt.y - 0.09, pt.z);
                this.scene.add(cord);

                // Bulb
                const bulbGeo = new THREE.SphereGeometry(0.08, 16, 16);
                const bulb = new THREE.Mesh(bulbGeo, bulbMat);
                bulb.position.set(pt.x, pt.y - 0.22, pt.z);
                this.scene.add(bulb);

                this.fairyLights.push({
                    mesh: bulb,
                    baseIntensity: 1.35,
                    phase: i * 0.4
                });
            }
        });
    }

    /**
     * Festive Birthday Bunting Flags in Background
     */
    createBuntingFlagsBackground() {
        const flagColors = [0xff758c, 0xffd166, 0x06d6a0, 0x118ab2, 0xc77dff, 0xffbe0b];
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-8.5, 9.6, -6.0),
            new THREE.Vector3(0, 8.4, -5.0),
            new THREE.Vector3(8.5, 9.6, -6.0)
        );

        const flagCount = 20;
        for (let i = 1; i < flagCount; i++) {
            const t = i / flagCount;
            const pt = curve.getPoint(t);
            const color = flagColors[i % flagColors.length];

            // Triangle shape
            const flagShape = new THREE.Shape();
            flagShape.moveTo(-0.16, 0);
            flagShape.lineTo(0.16, 0);
            flagShape.lineTo(0, -0.32);
            flagShape.closePath();

            const flagGeo = new THREE.ShapeGeometry(flagShape);
            const flagMat = new THREE.MeshStandardMaterial({
                color: color,
                side: THREE.DoubleSide,
                roughness: 0.4
            });
            const flag = new THREE.Mesh(flagGeo, flagMat);
            flag.position.set(pt.x, pt.y, pt.z);

            this.scene.add(flag);
            this.buntingFlags.push({
                mesh: flag,
                phase: i * 0.35,
                rotSpeed: 1.5
            });
        }
    }

    createBalloons() {
        const balloonColors = [
            0xff4d88, // Vivid Rose Pink
            0xffb703, // Warm Gold
            0x9d4edd, // Dreamy Violet
            0xff70a6, // Soft Coral
            0x00f5d4, // Pastel Aqua
            0xff0054  // Crimson Berry
        ];

        const balloonConfigs = [
            { x: -3.5, y: 3.5, z: -1.5, scale: 1.1, color: balloonColors[0], isHeart: false },
            { x: -2.8, y: 5.2, z: 1.2, scale: 0.95, color: balloonColors[1], isHeart: true },
            { x: 3.6, y: 4.2, z: -1.2, scale: 1.15, color: balloonColors[2], isHeart: false },
            { x: 2.9, y: 5.6, z: 1.5, scale: 0.9, color: balloonColors[3], isHeart: true },
            { x: -1.8, y: 6.2, z: -3.0, scale: 1.05, color: balloonColors[4], isHeart: false },
            { x: 2.2, y: 6.0, z: -2.8, scale: 1.0, color: balloonColors[5], isHeart: false }
        ];

        balloonConfigs.forEach((cfg, idx) => {
            const group = new THREE.Group();
            let balloonMesh;

            const mat = new THREE.MeshStandardMaterial({
                color: cfg.color,
                roughness: 0.15,
                metalness: 0.3,
                clearcoat: 0.8,
                clearcoatRoughness: 0.1
            });

            if (cfg.isHeart) {
                const shape = new THREE.Shape();
                const x = 0, y = 0;
                shape.moveTo(x + 0.25, y + 0.25);
                shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
                shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
                shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
                shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
                shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
                shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

                const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.15, bevelThickness: 0.15 };
                const heartGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                heartGeo.center();
                balloonMesh = new THREE.Mesh(heartGeo, mat);
                balloonMesh.rotation.x = Math.PI;
                balloonMesh.scale.set(1.4, 1.4, 1.4);
            } else {
                const sphereGeo = new THREE.SphereGeometry(0.65, 32, 32);
                sphereGeo.scale(1, 1.25, 1);
                balloonMesh = new THREE.Mesh(sphereGeo, mat);

                const knot = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.1, 12), mat);
                knot.position.y = -0.82;
                group.add(knot);
            }

            group.add(balloonMesh);

            // Balloon string
            const stringGeo = new THREE.CylinderGeometry(0.006, 0.006, 2.2, 8);
            const stringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
            const string = new THREE.Mesh(stringGeo, stringMat);
            string.position.y = -1.9;
            group.add(string);

            group.position.set(cfg.x, cfg.y, cfg.z);
            group.scale.set(cfg.scale, cfg.scale, cfg.scale);

            this.scene.add(group);
            this.balloons.push({
                mesh: group,
                baseY: cfg.y,
                speed: 1.2 + idx * 0.2,
                phase: idx * 1.1,
                rotSpeed: (Math.random() - 0.5) * 0.5
            });
        });
    }

    createFloatingPresents() {
        const giftConfigs = [
            { x: -2.8, y: 1.4, z: 2.2, size: 0.75, boxColor: 0x9c27b0, ribbonColor: 0xffd700, rotY: 0.4 },
            { x: 2.7, y: 1.2, z: 2.0, size: 0.85, boxColor: 0xff4081, ribbonColor: 0xffffff, rotY: -0.5 }
        ];

        giftConfigs.forEach((cfg) => {
            const group = new THREE.Group();

            const boxGeo = new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size);
            const boxMat = new THREE.MeshStandardMaterial({
                color: cfg.boxColor,
                roughness: 0.25,
                metalness: 0.2
            });
            const box = new THREE.Mesh(boxGeo, boxMat);
            box.castShadow = true;
            group.add(box);

            const ribbonMat = new THREE.MeshStandardMaterial({
                color: cfg.ribbonColor,
                roughness: 0.1,
                metalness: 0.4
            });
            const rib1 = new THREE.Mesh(new THREE.BoxGeometry(cfg.size * 1.02, cfg.size * 1.02, cfg.size * 0.18), ribbonMat);
            const rib2 = new THREE.Mesh(new THREE.BoxGeometry(cfg.size * 0.18, cfg.size * 1.02, cfg.size * 1.02), ribbonMat);
            group.add(rib1);
            group.add(rib2);

            const bowTorus1 = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.05, 12, 24), ribbonMat);
            bowTorus1.position.set(-0.1, cfg.size / 2 + 0.1, 0);
            bowTorus1.rotation.y = Math.PI / 4;
            const bowTorus2 = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.05, 12, 24), ribbonMat);
            bowTorus2.position.set(0.1, cfg.size / 2 + 0.1, 0);
            bowTorus2.rotation.y = -Math.PI / 4;
            group.add(bowTorus1);
            group.add(bowTorus2);

            group.position.set(cfg.x, cfg.y, cfg.z);
            group.rotation.y = cfg.rotY;

            this.scene.add(group);
            this.floatingPresents.push({
                mesh: group,
                baseY: cfg.y,
                speed: 1.0,
                phase: cfg.x
            });
        });
    }

    createStarfield() {
        const starCount = 1400;
        const starGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        const colorOptions = [
            new THREE.Color(0xfff3e0), // Champagne warm star
            new THREE.Color(0xff80ab), // Pink glitter
            new THREE.Color(0x80d8ff), // Soft cyan star
            new THREE.Color(0xffffff)  // Pure white star
        ];

        for (let i = 0; i < starCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 25 + Math.random() * 25;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const pickedColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = pickedColor.r;
            colors[i * 3 + 1] = pickedColor.g;
            colors[i * 3 + 2] = pickedColor.b;
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMat = new THREE.PointsMaterial({
            size: 0.16,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        this.stars = new THREE.Points(starGeo, starMat);
        this.scene.add(this.stars);
    }

    createDistantLanterns() {
        for (let i = 0; i < 18; i++) {
            const x = (Math.random() - 0.5) * 24;
            const y = Math.random() * 15 - 2;
            const z = -6 - Math.random() * 14;
            this.spawnSkyLantern(x, y, z, 0.45 + Math.random() * 0.35, false);
        }
    }

    spawnSkyLantern(x = 0, y = 2, z = 0, scale = 0.65, isInteractive = true) {
        const group = new THREE.Group();

        const lanternGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.9, 16);
        const lanternMat = new THREE.MeshStandardMaterial({
            color: 0xffaa33,
            emissive: 0xff6600,
            emissiveIntensity: 0.85,
            roughness: 0.4,
            transparent: true,
            opacity: 0.92
        });
        const lanternMesh = new THREE.Mesh(lanternGeo, lanternMat);
        group.add(lanternMesh);

        const light = new THREE.PointLight(0xff9900, 1.2, 5);
        light.position.y = 0;
        group.add(light);

        group.position.set(x, y, z);
        group.scale.set(scale, scale, scale);

        this.scene.add(group);
        this.lanterns.push({
            mesh: group,
            speedY: 0.015 + Math.random() * 0.018,
            swaySpeed: 0.8 + Math.random() * 0.5,
            swayOffset: Math.random() * Math.PI * 2,
            isInteractive: isInteractive
        });

        return group;
    }

    blowCandle() {
        if (!this.isCandleLit) return false;
        this.isCandleLit = false;

        // Extinguish both flames
        this.candleFlames.forEach(flame => {
            if (typeof gsap !== 'undefined') {
                gsap.to(flame.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        flame.visible = false;
                    }
                });
            } else {
                flame.visible = false;
            }
        });

        // Dim candle lights
        this.candleLights.forEach(light => {
            if (typeof gsap !== 'undefined') {
                gsap.to(light, { intensity: 0.05, duration: 0.5 });
            } else {
                light.intensity = 0.05;
            }
        });

        // Spawn Smoke Particles from both candles
        this.spawnSmokePuff(-0.30, 4.45);
        this.spawnSmokePuff(0.32, 4.45);

        // Trigger Huge 3D Confetti Explosion
        this.explodeConfetti();

        return true;
    }

    relightCandle() {
        this.isCandleLit = true;
        this.candleFlames.forEach(flame => {
            flame.visible = true;
            if (typeof gsap !== 'undefined') {
                gsap.to(flame.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)' });
            } else {
                flame.scale.set(1, 1, 1);
            }
        });

        this.candleLights.forEach(light => {
            if (typeof gsap !== 'undefined') {
                gsap.to(light, { intensity: 2.0, duration: 0.5 });
            } else {
                light.intensity = 2.0;
            }
        });
    }

    spawnSmokePuff(originX = 0, originY = 4.4) {
        const count = 16;
        const smokeMat = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.65
        });

        for (let i = 0; i < count; i++) {
            const geo = new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 8, 8);
            const smoke = new THREE.Mesh(geo, smokeMat.clone());
            smoke.position.set(
                originX + (Math.random() - 0.5) * 0.08,
                originY,
                (Math.random() - 0.5) * 0.08
            );
            this.scene.add(smoke);

            this.smokeParticles.push({
                mesh: smoke,
                vx: (Math.random() - 0.5) * 0.015,
                vy: 0.025 + Math.random() * 0.02,
                vz: (Math.random() - 0.5) * 0.015,
                life: 1.0
            });
        }
    }

    explodeConfetti() {
        const count = 300;
        const colors = [0xffd700, 0xff1493, 0x00ffff, 0xff4500, 0x7b2cbf, 0xffffff, 0x38b000];

        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 0.08 + Math.random() * 0.12;
            const geo = new THREE.PlaneGeometry(size, size * 1.6);
            const mat = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });
            const piece = new THREE.Mesh(geo, mat);

            // Start at cake top
            piece.position.set(
                (Math.random() - 0.5) * 0.8,
                3.8 + Math.random() * 0.4,
                (Math.random() - 0.5) * 0.8
            );

            // Explosive initial velocity
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.4;
            const speed = 0.14 + Math.random() * 0.22;

            const vx = Math.sin(phi) * Math.cos(theta) * speed;
            const vy = (0.2 + Math.cos(phi) * speed) * 1.4;
            const vz = Math.sin(phi) * Math.sin(theta) * speed;

            piece.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

            this.scene.add(piece);
            this.confettiPieces.push({
                mesh: piece,
                vx, vy, vz,
                rotX: (Math.random() - 0.5) * 0.2,
                rotY: (Math.random() - 0.5) * 0.2,
                rotZ: (Math.random() - 0.5) * 0.2,
                life: 1.0
            });
        }
    }

    onMouseMove(e) {
        this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    onTouchMove(e) {
        if (e.touches.length > 0) {
            this.targetMouse.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
            this.targetMouse.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        }
    }

    onWindowResize() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Smooth Mouse Parallax
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Auto-rotate scene subtly when enabled
        if (this.autoRotate && this.controls) {
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.9;
        } else if (this.controls) {
            this.controls.autoRotate = false;
        }

        if (this.controls) {
            this.controls.update();
        }

        // Animate Dual Candle Flames Flicker
        if (this.isCandleLit && this.candleFlames.length > 0) {
            this.candleFlames.forEach((flame, idx) => {
                const phase = idx * 1.5;
                const flicker = Math.sin(elapsedTime * 18 + phase) * 0.08 + Math.cos(elapsedTime * 24 + phase) * 0.05;
                flame.scale.y = 1.0 + flicker;
                flame.scale.x = 1.0 - flicker * 0.5;
                flame.scale.z = 1.0 - flicker * 0.5;
                flame.rotation.z = Math.sin(elapsedTime * 12 + phase) * 0.06;
            });

            this.candleLights.forEach((light, idx) => {
                const phase = idx * 1.5;
                const flicker = Math.sin(elapsedTime * 18 + phase) * 0.08;
                light.intensity = 1.9 + flicker * 1.2;
            });
        }

        // Animate Fairy Lights Shimmer
        this.fairyLights.forEach((bulb) => {
            const glow = Math.sin(elapsedTime * 2.5 + bulb.phase) * 0.35;
            bulb.mesh.material.emissiveIntensity = bulb.baseIntensity + glow;
        });

        // Animate Bunting Flags Sway
        this.buntingFlags.forEach((flag) => {
            flag.mesh.rotation.x = Math.sin(elapsedTime * flag.rotSpeed + flag.phase) * 0.18;
        });

        // Animate Floating Balloons
        this.balloons.forEach((b) => {
            b.mesh.position.y = b.baseY + Math.sin(elapsedTime * b.speed + b.phase) * 0.35;
            b.mesh.rotation.y += b.rotSpeed * delta;
        });

        // Animate Floating Gift Boxes
        this.floatingPresents.forEach((p) => {
            p.mesh.position.y = p.baseY + Math.sin(elapsedTime * p.speed + p.phase) * 0.18;
            p.mesh.rotation.y += 0.4 * delta;
        });

        // Animate Sky Lanterns
        for (let i = this.lanterns.length - 1; i >= 0; i--) {
            const lan = this.lanterns[i];
            lan.mesh.position.y += lan.speedY;
            lan.mesh.position.x += Math.sin(elapsedTime * lan.swaySpeed + lan.swayOffset) * 0.008;
            lan.mesh.rotation.y += 0.25 * delta;

            if (lan.mesh.position.y > 22) {
                if (lan.isInteractive) {
                    this.scene.remove(lan.mesh);
                    this.lanterns.splice(i, 1);
                } else {
                    lan.mesh.position.y = -2;
                }
            }
        }

        // Animate Smoke Particles
        for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
            const s = this.smokeParticles[i];
            s.mesh.position.x += s.vx;
            s.mesh.position.y += s.vy;
            s.mesh.position.z += s.vz;
            s.mesh.scale.multiplyScalar(1.025);
            s.life -= delta * 0.8;
            s.mesh.material.opacity = s.life * 0.5;

            if (s.life <= 0) {
                this.scene.remove(s.mesh);
                this.smokeParticles.splice(i, 1);
            }
        }

        // Animate 3D Confetti Particles
        for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
            const c = this.confettiPieces[i];
            c.vy -= 0.007;
            c.vx *= 0.985;
            c.vz *= 0.985;

            c.mesh.position.x += c.vx;
            c.mesh.position.y += c.vy;
            c.mesh.position.z += c.vz;

            c.mesh.rotation.x += c.rotX;
            c.mesh.rotation.y += c.rotY;
            c.mesh.rotation.z += c.rotZ;

            c.life -= delta * 0.2;
            if (c.mesh.position.y < -0.5 || c.life <= 0) {
                this.scene.remove(c.mesh);
                this.confettiPieces.splice(i, 1);
            }
        }

        // Slowly Rotate Starfield
        if (this.stars) {
            this.stars.rotation.y = elapsedTime * 0.015;
            this.stars.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.BirthdayScene = BirthdayScene;
