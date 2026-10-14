import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Sparkles } from 'lucide-react';

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, u) => a + (b - a) * u;
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function springEval(u, damping = 0.58, freq = 9.5) {
    u = clamp(u, 0, 1);
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    return (
        1 -
        Math.exp(-damping * freq * u) *
            Math.cos(freq * Math.sqrt(Math.max(0.01, 1 - damping * damping)) * u)
    );
}

function loopState(t, useSpring = true, damping = 0.58) {
    t = ((t % 8.0) + 8.0) % 8.0;
    let p = 0,
        phase = 'START',
        uHold = 0;
    if (t < 2.2) {
        const u = t / 2.2;
        p = useSpring ? springEval(u, damping, 9.0) : easeInOutCubic(u);
        phase = 'MOVE 0.0–2.2s';
    } else if (t < 6.6) {
        p = 1.0;
        uHold = (t - 2.2) / 4.4;
        phase = 'HOLD 2.2–6.6s';
    } else {
        const u = (t - 6.6) / 1.4;
        p = 1.0 - easeInOutCubic(u);
        phase = 'RETURN 6.6–8.0s';
    }
    return { t, p, uHold, phase };
}

function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function drawDashedRect(ctx, x, y, w, h, r, strokeStyle) {
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    roundRect(ctx, x, y, w, h, r);
    ctx.stroke();
    ctx.restore();
}

export function drawVectorAirfoilDiagram(ctx, x, y, w, h, t, aoaDeg = 7.5) {
    ctx.save();
    roundRect(ctx, x, y, w, h, 12);
    ctx.fillStyle = '#090E17';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.42)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.clip();

    ctx.strokeStyle = 'rgba(56,189,248,0.07)';
    ctx.lineWidth = 1;
    for (let gx = x; gx < x + w; gx += 22) {
        ctx.beginPath();
        ctx.moveTo(gx, y);
        ctx.lineTo(gx, y + h);
        ctx.stroke();
    }
    for (let gy = y; gy < y + h; gy += 22) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x + w, gy);
        ctx.stroke();
    }

    const cx = x + w * 0.48,
        cy = y + h * 0.54;
    const chord = w * 0.68;

    for (let i = -3; i <= 3; i++) {
        if (i === 0) continue;
        const isUpper = i < 0;
        const baseOffset = i * (h * 0.095);
        ctx.beginPath();
        ctx.strokeStyle = isUpper ? 'rgba(56,189,248,0.78)' : 'rgba(212,175,55,0.68)';
        ctx.lineWidth = 1.7;
        for (let s = 0; s <= 40; s++) {
            const u = s / 40;
            const px = x + 10 + u * (w - 20);
            const dist = (px - cx) / (chord * 0.55);
            const bump = Math.exp(-dist * dist * 1.8) * (isUpper ? -h * 0.16 : -h * 0.04);
            const py = cy + baseOffset + bump;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const speed = isUpper ? 0.55 : 0.32;
        const uDot = (t * speed + Math.abs(i) * 0.23) % 1.0;
        const dx = x + 10 + uDot * (w - 20);
        const dDist = (dx - cx) / (chord * 0.55);
        const dBump = Math.exp(-dDist * dDist * 1.8) * (isUpper ? -h * 0.16 : -h * 0.04);
        const dy = cy + baseOffset + dBump;
        ctx.fillStyle = isUpper ? '#38BDF8' : '#FBBF24';
        ctx.beginPath();
        ctx.arc(dx, dy, 3.0, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-aoaDeg * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(-chord * 0.5, 4);
    ctx.quadraticCurveTo(-chord * 0.12, -h * 0.24, chord * 0.5, 6);
    ctx.quadraticCurveTo(-chord * 0.1, -h * 0.07, -chord * 0.5, 4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(212,175,55,0.18)';
    ctx.fill();
    ctx.strokeStyle = '#FAF7F2';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(250,247,242,0.45)';
    ctx.lineWidth = 1;
    for (let r = -0.36; r <= 0.36; r += 0.12) {
        const rx = r * chord;
        const uq = r + 0.5;
        const yTop = (1 - uq) * (1 - uq) * 4 + 2 * (1 - uq) * uq * (-h * 0.24) + uq * uq * 6;
        const yBot = (1 - uq) * (1 - uq) * 4 + 2 * (1 - uq) * uq * (-h * 0.07) + uq * uq * 6;
        ctx.beginPath();
        ctx.moveTo(rx, yTop);
        ctx.lineTo(rx, yBot);
        ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = '#38BDF8';
    ctx.font = '700 12px Inter, sans-serif';
    ctx.fillText('↑ LOWER PRESSURE · FASTER STREAMLINE VELOCITY', x + 16, y + 24);
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(`↑ HIGHER PRESSURE · NET LIFT (CAMBER 1:20 · α = ${aoaDeg.toFixed(1)}°)`, x + 16, y + h - 12);
    ctx.restore();
}

export const VectorAirfoilCanvas = () => {
    const canvasRef = useRef(null);
    const [aoa, setAoa] = useState(7.5);

    useEffect(() => {
        let raf;
        const start = performance.now();
        const loop = (now) => {
            const t = (now - start) / 1000;
            const c = canvasRef.current;
            if (c) {
                const ctx = c.getContext('2d');
                ctx.clearRect(0, 0, c.width, c.height);
                drawVectorAirfoilDiagram(ctx, 0, 0, c.width, c.height, t, aoa);
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [aoa]);

    return (
        <div className="w-full h-full flex flex-col justify-between bg-[#090E17] p-4">
            <canvas
                ref={canvasRef}
                width={720}
                height={380}
                className="w-full h-auto rounded-xl border border-[#E6C687]/30"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 py-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E6C687]">
                    Interactive 1901 Wind-Tunnel Camber Test: Angle of Attack (α = {aoa.toFixed(1)}°)
                </span>
                <input
                    type="range"
                    min="0"
                    max="14"
                    step="0.5"
                    value={aoa}
                    onChange={(e) => setAoa(parseFloat(e.target.value))}
                    className="w-44 accent-[#E6C687] cursor-pointer"
                />
            </div>
        </div>
    );
};

export const ClaudeMotionShowcase = () => {
    const canvasRef = useRef(null);
    const imgsRef = useRef({});
    const stateRef = useRef({
        scene: 0,
        playing: true,
        autoCycle: true,
        tSec: 0.3,
        lastTs: performance.now(),
    });

    const [activeScene, setActiveScene] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [autoCycle, setAutoCycle] = useState(true);
    const [clockText, setClockText] = useState('t = 0.30s / 8.0s');
    const [phaseText, setPhaseText] = useState('MOVE 0.0–2.2s');
    const [scrubVal, setScrubVal] = useState(0.3);

    useEffect(() => {
        const sources = {
            uni_logo: '/images/unischool-logo.png',
            hero_mentors_scene: '/images/visuals/hero_mentors_scene.jpg',
            kitty_hawk_sim: '/images/visuals/kitty_hawk_1_live.jpg',
            wind_tunnel_lab: '/images/visuals/kitty_hawk_2_decision.jpg',
            university_credit_campus: '/images/visuals/student_campus_lookup.jpg',
            school_biomedics: '/images/visuals/school_portrait_biomedics.jpg',
            school_engineering: '/images/visuals/school_portrait_engineering.jpg',
            school_business: '/images/visuals/school_portrait_business.jpg',
            school_law: '/images/visuals/school_portrait_law.jpg',
        };
        Object.entries(sources).forEach(([k, src]) => {
            const im = new Image();
            im.src = src;
            imgsRef.current[k] = im;
        });
    }, []);

    useEffect(() => {
        let raf;
        const drawBrandWatermark = (ctx) => {
            const im = imgsRef.current.uni_logo;
            if (im && im.complete && im.naturalWidth) {
                ctx.drawImage(im, 26, 20, 38, 38);
            }
            ctx.fillStyle = '#D4AF37';
            ctx.font = '700 14px Inter, sans-serif';
            ctx.fillText('UNIVERSITY SCHOOL', 72, 37);
            ctx.fillStyle = 'rgba(250,247,242,0.65)';
            ctx.font = '500 12px Inter, sans-serif';
            ctx.fillText('Starts at 11 · Accredited University Credits & Degrees', 72, 53);
        };

        const renderScene0 = (ctx, t) => {
            const { p, uHold } = loopState(t, true, 0.62);
            const grad = ctx.createLinearGradient(0, 0, 960, 500);
            grad.addColorStop(0, '#1B080B');
            grad.addColorStop(1, '#2D0E14');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 960, 500);

            ctx.strokeStyle = 'rgba(212,175,55,0.07)';
            ctx.lineWidth = 1;
            for (let x = 0; x < 960; x += 48) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, 500);
                ctx.stroke();
            }
            for (let y = 0; y < 500; y += 48) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(960, y);
                ctx.stroke();
            }

            drawBrandWatermark(ctx);

            const sx = 68,
                sy = 88,
                sw = 250,
                sh = 54,
                sr = 27;
            const ex = 68,
                ey = 78,
                ew = 824,
                eh = 392,
                er = 20;

            if (p > 0.08) {
                drawDashedRect(ctx, sx, sy - 20, sw, 36, 18, `rgba(212,175,55,${0.42 * clamp(p)})`);
                ctx.fillStyle = `rgba(212,175,55,${0.68 * clamp(p)})`;
                ctx.font = '600 11px Inter, sans-serif';
                ctx.fillText('GHOST ORIGIN: 58:00 PASSIVE VIDEO PILL', sx + 16, sy - 6);
            }

            const cx = lerp(sx, ex, p);
            const cy = lerp(sy, ey, p);
            const cw = lerp(sw, ew, p);
            const ch = lerp(sh, eh, p);
            const cr = lerp(sr, er, p);

            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.55)';
            ctx.shadowBlur = 32;
            ctx.shadowOffsetY = 14;
            ctx.fillStyle = p < 0.3 ? '#3A1219' : '#230B10';
            roundRect(ctx, cx, cy, cw, ch, cr);
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(212,175,55,0.55)';
            ctx.stroke();
            ctx.clip();

            const pillAlpha = clamp(1 - p * 3.2);
            if (pillAlpha > 0.01) {
                ctx.globalAlpha = pillAlpha;
                ctx.fillStyle = '#FAF7F2';
                ctx.font = '700 15px Inter, sans-serif';
                ctx.fillText('▶  Passive 58:00 Lecture', cx + 56, cy + 33);
            }

            const contentAlpha = clamp((p - 0.32) / 0.55);
            if (contentAlpha > 0.01) {
                ctx.globalAlpha = contentAlpha;
                ctx.fillStyle = 'rgba(250,247,242,0.06)';
                ctx.fillRect(cx, cy, cw, 44);
                ctx.fillStyle = '#D4AF37';
                ctx.font = '700 13px Inter, sans-serif';
                ctx.fillText(
                    'LIVE IMMERSIVE LAB · KITTY HAWK, NC (DEC 17, 1903) — AERO 101 CREDIT',
                    cx + 22,
                    cy + 27
                );

                const imgM = imgsRef.current.hero_mentors_scene;
                if (imgM && imgM.complete && imgM.naturalWidth) {
                    ctx.save();
                    roundRect(ctx, cx + 22, cy + 60, 350, 155, 12);
                    ctx.clip();
                    ctx.drawImage(imgM, cx + 22, cy + 60, 350, 155);
                    ctx.restore();
                    ctx.strokeStyle = 'rgba(212,175,55,0.4)';
                    roundRect(ctx, cx + 22, cy + 60, 350, 155, 12);
                    ctx.stroke();
                }
                ctx.fillStyle = '#FAF7F2';
                ctx.font = '700 14px Georgia, serif';
                ctx.fillText('“Test the camber at 7.5° angle of attack, Alex.”', cx + 32, cy + 202);

                drawVectorAirfoilDiagram(ctx, cx + 22, cy + 228, 350, 142, t);

                const rx = cx + 394,
                    ry = cy + 60,
                    rw = 406,
                    rh = 310;
                ctx.fillStyle = '#FAF7F2';
                roundRect(ctx, rx, ry, rw, rh, 14);
                ctx.fill();

                ctx.fillStyle = '#1B080B';
                ctx.font = '800 18px Georgia, serif';
                ctx.fillText('Don’t Just Learn It. Live It.', rx + 22, ry + 34);
                ctx.fillStyle = '#6E5A53';
                ctx.font = '600 12px Inter, sans-serif';
                ctx.fillText(
                    '1901 WRIGHT WIND TUNNEL · CAMBER 1:20 · LIFT COEFFICIENT',
                    rx + 22,
                    ry + 54
                );

                const gx = rx + 26,
                    gy = ry + 74,
                    gw = 230,
                    gh = 150;
                ctx.fillStyle = '#F2ECE1';
                roundRect(ctx, gx, gy, gw, gh, 10);
                ctx.fill();

                const drawProg = clamp((p - 0.45) / 0.5 + uHold * 0.25, 0, 1);
                ctx.beginPath();
                ctx.strokeStyle = '#8B1E24';
                ctx.lineWidth = 3.2;
                const pts = [
                    [0, 120],
                    [35, 92],
                    [70, 62],
                    [110, 36],
                    [150, 24],
                    [185, 32],
                    [210, 58],
                ];
                const maxIdx = Math.max(1, Math.floor(pts.length * drawProg));
                for (let i = 0; i < maxIdx; i++) {
                    const px = gx + 12 + pts[i][0],
                        py = gy + 14 + pts[i][1];
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.stroke();

                const activePt = pts[Math.min(pts.length - 1, maxIdx - 1)];
                const dotX = gx + 12 + activePt[0],
                    dotY = gy + 14 + activePt[1];
                ctx.fillStyle = '#10B981';
                ctx.beginPath();
                ctx.arc(dotX, dotY, 6 + 2 * Math.sin(t * 6), 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#1B080B';
                ctx.font = '700 12px Inter, sans-serif';
                ctx.fillText('Cl = 0.58 · L/D = 6.4 (Verified)', gx + 14, gy + gh - 12);

                const ringX = rx + 330,
                    ringY = ry + 148,
                    ringR = 46;
                const pct = Math.round(lerp(68, 74, uHold));
                ctx.strokeStyle = '#E5DEC9';
                ctx.lineWidth = 9;
                ctx.beginPath();
                ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = '#10B981';
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.arc(
                    ringX,
                    ringY,
                    ringR,
                    -Math.PI / 2,
                    -Math.PI / 2 + Math.PI * 2 * (pct / 100) * clamp(p)
                );
                ctx.stroke();
                ctx.fillStyle = '#1B080B';
                ctx.font = '800 20px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(pct + '%', ringX, ringY + 7);
                ctx.font = '600 12px Inter, sans-serif';
                ctx.fillStyle = '#6E5A53';
                ctx.fillText('AERO 101 Credit', ringX, ringY + 68);
                ctx.textAlign = 'left';

                ctx.fillStyle = '#1B080B';
                roundRect(ctx, rx + 22, ry + 242, rw - 44, 48, 10);
                ctx.fill();
                ctx.fillStyle = '#D4AF37';
                ctx.font = '700 13px Inter, sans-serif';
                const elapsed = (17 + Math.floor(uHold * 25)).toString().padStart(2, '0');
                ctx.fillText(
                    `● REC 0:${elapsed} / 0:42  ·  3.2x Faster Mastery vs Passive Video`,
                    rx + 36,
                    ry + 271
                );
            }

            const iconX = lerp(sx + 28, ex + ew - 38, p);
            const iconY = lerp(sy + 27, ey + 22, p);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#D4AF37';
            ctx.beginPath();
            ctx.arc(iconX, iconY, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1B080B';
            if (t < 2.5 || t > 6.6) {
                ctx.beginPath();
                ctx.moveTo(iconX - 4, iconY - 6);
                ctx.lineTo(iconX + 6, iconY);
                ctx.lineTo(iconX - 4, iconY + 6);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillRect(iconX - 5, iconY - 6, 3.5, 12);
                ctx.fillRect(iconX + 1.5, iconY - 6, 3.5, 12);
            }
            ctx.restore();
        };

        const renderScene1 = (ctx, t) => {
            const { p } = loopState(t, false);
            ctx.fillStyle = '#17070A';
            ctx.fillRect(0, 0, 960, 500);
            drawBrandWatermark(ctx);

            ctx.fillStyle = '#FAF7F2';
            ctx.font = '700 24px Georgia, serif';
            ctx.fillText('Same Knowledge. Different Door. Real University Credit.', 26, 92);

            const src = {
                x: 135,
                y: 285,
                w: 190,
                h: 96,
                title: '1st-Person Discovery',
                sub: 'Kitty Hawk · Wardenclyffe',
            };
            const schools = [
                {
                    x: 475,
                    y: 145,
                    title: 'School of Biomedics',
                    sub: 'Clinical & Bio-Systems',
                    col: '#10B981',
                    imgKey: 'school_biomedics',
                },
                {
                    x: 475,
                    y: 235,
                    title: 'School of Engineering',
                    sub: 'Aero, Robotics & Energy',
                    col: '#D4AF37',
                    imgKey: 'school_engineering',
                },
                {
                    x: 475,
                    y: 325,
                    title: 'School of Business',
                    sub: 'Venture & Economics',
                    col: '#F59E0B',
                    imgKey: 'school_business',
                },
                {
                    x: 475,
                    y: 415,
                    title: 'Law & Public Service',
                    sub: 'Constitutional & Policy',
                    col: '#EC4899',
                    imgKey: 'school_law',
                },
            ];
            const dst = {
                x: 820,
                y: 285,
                w: 205,
                h: 112,
                title: 'University Credit',
                sub: 'Transcripted · Starts at 11',
            };

            schools.forEach((s, idx) => {
                const delay1 = 0.18 + idx * 0.12;
                const pulse1 = clamp((t - delay1) / 1.05, 0, 1);
                const delay2 = 1.45 + idx * 0.1;
                const pulse2 = clamp((t - delay2) / 0.95, 0, 1);
                const wave2 = t > 3.4 && t < 6.4 ? clamp((t - 3.4 - idx * 0.12) / 1.2, 0, 1) : 0;

                ctx.strokeStyle = 'rgba(250,247,242,0.12)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(src.x + 95, src.y);
                ctx.bezierCurveTo(295, src.y, 310, s.y, s.x - 122, s.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(s.x + 122, s.y);
                ctx.bezierCurveTo(650, s.y, 665, dst.y, dst.x - 102, dst.y);
                ctx.stroke();

                if (pulse1 > 0 && p > 0.05) {
                    ctx.save();
                    ctx.strokeStyle = s.col;
                    ctx.lineWidth = 3;
                    ctx.globalAlpha = clamp(p);
                    ctx.beginPath();
                    ctx.moveTo(src.x + 95, src.y);
                    ctx.bezierCurveTo(295, src.y, 310, s.y, s.x - 122, s.y);
                    ctx.stroke();

                    const u = wave2 > 0 && wave2 < 1 ? wave2 : pulse1;
                    if (u > 0 && u < 1) {
                        const bx =
                            Math.pow(1 - u, 3) * (src.x + 95) +
                            3 * Math.pow(1 - u, 2) * u * 295 +
                            3 * (1 - u) * u * u * 310 +
                            u * u * u * (s.x - 122);
                        const by =
                            Math.pow(1 - u, 3) * src.y +
                            3 * Math.pow(1 - u, 2) * u * src.y +
                            3 * (1 - u) * u * u * s.y +
                            u * u * u * s.y;
                        ctx.fillStyle = '#FFFFFF';
                        ctx.beginPath();
                        ctx.arc(bx, by, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                if (pulse2 > 0 && p > 0.05) {
                    ctx.save();
                    ctx.strokeStyle = '#D4AF37';
                    ctx.lineWidth = 3;
                    ctx.globalAlpha = clamp(p) * pulse2;
                    ctx.beginPath();
                    ctx.moveTo(s.x + 122, s.y);
                    ctx.bezierCurveTo(650, s.y, 665, dst.y, dst.x - 102, dst.y);
                    ctx.stroke();
                    ctx.restore();
                }

                const arrived = pulse1 >= 0.95 && p > 0.2;
                ctx.fillStyle = arrived ? '#2B0E14' : '#210A0E';
                ctx.strokeStyle = arrived ? s.col : 'rgba(250,247,242,0.18)';
                ctx.lineWidth = arrived ? 2 : 1.2;
                roundRect(ctx, s.x - 122, s.y - 30, 244, 60, 14);
                ctx.fill();
                ctx.stroke();

                const simg = imgsRef.current[s.imgKey];
                if (simg && simg.complete && simg.naturalWidth) {
                    ctx.save();
                    roundRect(ctx, s.x - 114, s.y - 22, 44, 44, 10);
                    ctx.clip();
                    ctx.drawImage(simg, s.x - 114, s.y - 22, 44, 44);
                    ctx.restore();
                }
                ctx.fillStyle = '#FAF7F2';
                ctx.font = '700 14px Inter, sans-serif';
                ctx.fillText(s.title, s.x - 60, s.y - 4);
                ctx.fillStyle = 'rgba(250,247,242,0.65)';
                ctx.font = '500 12px Inter, sans-serif';
                ctx.fillText(s.sub, s.x - 60, s.y + 14);
            });

            ctx.fillStyle = '#2B0E14';
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 2;
            roundRect(ctx, src.x - 95, src.y - 48, src.w, src.h, 16);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#D4AF37';
            ctx.font = '700 12px Inter, sans-serif';
            ctx.fillText('HISTORICAL LAB CORE', src.x - 78, src.y - 18);
            ctx.fillStyle = '#FAF7F2';
            ctx.font = '700 15px Georgia, serif';
            ctx.fillText(src.title, src.x - 78, src.y + 6);
            ctx.fillStyle = 'rgba(250,247,242,0.7)';
            ctx.font = '500 12px Inter, sans-serif';
            ctx.fillText(src.sub, src.x - 78, src.y + 26);

            const dstLit = t > 2.1 && t < 7.2;
            ctx.fillStyle = dstLit ? '#FAF7F2' : '#2B0E14';
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 2.5;
            roundRect(ctx, dst.x - 102, dst.y - 56, dst.w, dst.h, 18);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = dstLit ? '#8B1E24' : '#D4AF37';
            ctx.font = '800 12px Inter, sans-serif';
            ctx.fillText('VERIFIED OUTCOME', dst.x - 84, dst.y - 24);
            ctx.fillStyle = dstLit ? '#1B080B' : '#FAF7F2';
            ctx.font = '800 18px Georgia, serif';
            ctx.fillText(dst.title, dst.x - 84, dst.y + 2);
            ctx.fillStyle = dstLit ? '#047857' : '#10B981';
            ctx.font = '700 12px Inter, sans-serif';
            ctx.fillText(dst.sub, dst.x - 84, dst.y + 24);
            ctx.fillText('✓ 5-Step Mastery Portfolio', dst.x - 84, dst.y + 42);
        };

        const renderScene2 = (ctx, t) => {
            ctx.fillStyle = '#1B080B';
            ctx.fillRect(0, 0, 960, 500);
            drawBrandWatermark(ctx);

            ctx.fillStyle = '#FAF7F2';
            ctx.font = '700 23px Georgia, serif';
            ctx.fillText('From Age 11 Curiosity to University Credit — On Real Springs', 26, 92);

            const cards = [
                {
                    title: '03 · University Credit',
                    sub: 'Accredited credits & degrees',
                    badge: 'STEP 03 · TRANSCRIPTED',
                    col: '#10B981',
                    damp: 0.85,
                    delay: 0.1,
                    targetX: 615,
                    targetRot: 0.1,
                    imgKey: 'university_credit_campus',
                },
                {
                    title: '02 · Socratic AI Defense',
                    sub: '1901 Wind-Tunnel Mentor Lab',
                    badge: 'STEP 02 · SOCRATIC LAB',
                    col: '#D4AF37',
                    damp: 0.65,
                    delay: 0.05,
                    targetX: 385,
                    targetRot: 0.0,
                    imgKey: 'wind_tunnel_lab',
                },
                {
                    title: '01 · Live the Discovery',
                    sub: '1903 Kitty Hawk Sim at age 11',
                    badge: 'STEP 01 · IMMERSIVE SIM',
                    col: '#F59E0B',
                    damp: 0.38,
                    delay: 0.0,
                    targetX: 155,
                    targetRot: -0.1,
                    imgKey: 'kitty_hawk_sim',
                },
            ];

            if (t > 0.25 && t < 6.8) {
                ctx.save();
                ctx.translate(155, 295);
                ctx.rotate(-0.1);
                drawDashedRect(ctx, -118, -145, 236, 290, 18, 'rgba(212,175,55,0.55)');
                ctx.restore();
            }

            cards.forEach((c) => {
                let sVal = 0;
                if (t < 2.2) {
                    sVal = springEval(clamp((t - c.delay) / 1.9), c.damp, 10.5);
                } else if (t < 6.6) {
                    sVal = 1.0;
                } else {
                    sVal = 1.0 - easeInOutCubic((t - 6.6) / 1.4);
                }
                const cx = lerp(385, c.targetX, sVal);
                const cy = 295;
                const rot = lerp(0, c.targetRot, sVal);

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rot);
                ctx.shadowColor = 'rgba(0,0,0,0.55)';
                ctx.shadowBlur = 24;
                ctx.shadowOffsetY = 10;
                ctx.fillStyle = '#FAF7F2';
                roundRect(ctx, -118, -145, 236, 290, 18);
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = c.col;
                ctx.stroke();

                const im = imgsRef.current[c.imgKey];
                if (im && im.complete && im.naturalWidth) {
                    ctx.save();
                    roundRect(ctx, -106, -131, 212, 132, 12);
                    ctx.clip();
                    ctx.drawImage(im, -106, -131, 212, 132);
                    ctx.restore();
                }

                ctx.fillStyle = '#8B1E24';
                ctx.font = '800 12px Inter, sans-serif';
                ctx.fillText(c.badge, -104, 24);
                ctx.fillStyle = '#1B080B';
                ctx.font = '800 16px Georgia, serif';
                ctx.fillText(c.title, -104, 50);
                ctx.fillStyle = '#5A4640';
                ctx.font = '500 12px Inter, sans-serif';
                ctx.fillText(c.sub, -104, 72);

                ctx.fillStyle = '#1B080B';
                roundRect(ctx, -104, 94, 208, 34, 8);
                ctx.fill();
                ctx.fillStyle = '#D4AF37';
                ctx.font = '700 12px Inter, sans-serif';
                ctx.fillText('✓ Verified Portfolio Artifact', -92, 116);
                ctx.restore();
            });

            const ix = 758,
                iy = 365,
                iw = 176,
                ih = 112;
            ctx.fillStyle = 'rgba(20,6,9,0.92)';
            ctx.strokeStyle = 'rgba(212,175,55,0.45)';
            ctx.lineWidth = 1.5;
            roundRect(ctx, ix, iy, iw, ih, 12);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#D4AF37';
            ctx.font = '700 12px Inter, sans-serif';
            ctx.fillText('SPRING PHYSICS (ζ=0.38)', ix + 12, iy + 22);

            ctx.strokeStyle = 'rgba(250,247,242,0.25)';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(ix + 12, iy + 52);
            ctx.lineTo(ix + iw - 12, iy + 52);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i <= 60; i++) {
                const u = i / 60;
                const sv = springEval(u, 0.38, 10.5);
                const px = ix + 12 + u * (iw - 24);
                const py = iy + 92 - sv * 40;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            const uNow = clamp(t / 2.2, 0, 1);
            const svNow = springEval(uNow, 0.38, 10.5);
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(ix + 12 + uNow * (iw - 24), iy + 92 - svNow * 40, 5, 0, Math.PI * 2);
            ctx.fill();
        };

        const tick = (now) => {
            const st = stateRef.current;
            if (st.playing) {
                const dt = Math.min(0.1, (now - st.lastTs) / 1000);
                const nextT = st.tSec + dt;
                if (nextT >= 8.0 && st.autoCycle) {
                    st.scene = (st.scene + 1) % 3;
                    st.tSec = 0.0;
                    setActiveScene(st.scene);
                } else {
                    st.tSec = nextT % 8.0;
                }
                const ls = loopState(st.tSec);
                setScrubVal(st.tSec);
                setClockText(`t = ${st.tSec.toFixed(2)}s / 8.0s`);
                setPhaseText(ls.phase);
            }
            st.lastTs = now;

            const c = canvasRef.current;
            if (c) {
                const ctx = c.getContext('2d');
                ctx.clearRect(0, 0, 960, 500);
                if (st.scene === 0) renderScene0(ctx, st.tSec);
                else if (st.scene === 1) renderScene1(ctx, st.tSec);
                else renderScene2(ctx, st.tSec);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const selectScene = (idx) => {
        stateRef.current.scene = idx;
        stateRef.current.tSec = 0.0;
        setActiveScene(idx);
    };

    const handleScrub = (val) => {
        const v = parseFloat(val);
        stateRef.current.playing = false;
        stateRef.current.tSec = v;
        setPlaying(false);
        setScrubVal(v);
        const ls = loopState(v);
        setClockText(`t = ${v.toFixed(2)}s / 8.0s`);
        setPhaseText(ls.phase);
    };

    return (
        <div className="bg-[#18070B] border border-[#E6C687]/35 rounded-3xl p-4 sm:p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E6C687]/15 text-[#E6C687] border border-[#E6C687]/35">
                        <Sparkles size={12} /> Interactive Motion Architecture
                    </span>
                    {[
                        '1. Passive Lecture → Live Kitty Hawk Lab',
                        '2. 1st-Person Core → 4 Knowledge Schools',
                        '3. Age 11 to University Credit (Spring Stack)',
                    ].map((label, idx) => (
                        <button
                            key={idx}
                            onClick={() => selectScene(idx)}
                            className={`text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl border transition-all ${
                                activeScene === idx
                                    ? 'bg-[#8B2332] text-[#FAF7F2] border-[#E6C687] shadow-lg'
                                    : 'bg-black/30 text-slate-300 border-white/10 hover:bg-white/10'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => {
                        stateRef.current.autoCycle = !stateRef.current.autoCycle;
                        setAutoCycle(stateRef.current.autoCycle);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                        autoCycle
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                            : 'bg-black/30 text-slate-400 border-white/10'
                    }`}
                >
                    Auto-Cycle: {autoCycle ? 'ON' : 'OFF'}
                </button>
            </div>

            <div className="w-full rounded-2xl overflow-hidden border border-[#E6C687]/25 bg-[#090406]">
                <canvas
                    ref={canvasRef}
                    width={960}
                    height={500}
                    className="w-full h-auto block"
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                    onClick={() => {
                        stateRef.current.playing = !stateRef.current.playing;
                        stateRef.current.lastTs = performance.now();
                        setPlaying(stateRef.current.playing);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E6C687] text-[#1B080B] flex items-center gap-1.5"
                >
                    {playing ? <Pause size={13} /> : <Play size={13} />}
                    {playing ? 'Pause' : 'Play'}
                </button>
                <button
                    onClick={() => selectScene((activeScene + 2) % 3)}
                    className="p-1.5 rounded-lg border border-white/15 bg-black/30 text-slate-300 hover:text-white"
                >
                    <SkipBack size={14} />
                </button>
                <button
                    onClick={() => selectScene((activeScene + 1) % 3)}
                    className="p-1.5 rounded-lg border border-white/15 bg-black/30 text-slate-300 hover:text-white"
                >
                    <SkipForward size={14} />
                </button>
                <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.01"
                    value={scrubVal}
                    onChange={(e) => handleScrub(e.target.value)}
                    className="flex-1 accent-[#E6C687] cursor-pointer"
                />
                <span className="text-xs font-mono font-semibold text-slate-300 w-28 text-right">
                    {clockText}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#E6C687]/15 text-[#E6C687] border border-[#E6C687]/30 w-32 text-center">
                    {phaseText}
                </span>
            </div>
        </div>
    );
};
