
        const canvas=document.getElementById("canvas1");
        const ctx=canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const rndmRng = (h, l) => Math.random() * (h - l) + l;
        let monoliths = [];
        let hills = [];
        let ground = [];
        let sun = {x: w*rndmRng(.7,.3), y: h*rndmRng(.45,-.05),}
        const colorsM = ['#B8AE36','#7C832A','#7C832A','#706C19','#445112','#1C2E0D','#081809','#050A06','#040504'];
        const colorsG = ['211, 200, 57,','125, 132, 42,','125, 132, 42,','112, 108, 25,','68, 81, 18,','28, 46, 13,','8, 24, 9,','5, 10, 6,']

        const groupBy = (arr, fn) =>
            arr
                .map(typeof fn === 'function' ? fn : val => val[fn])
                .reduce((acc, val, i) => {
                acc[val] = (acc[val] || []).concat(arr[i]);
                return acc;
                }, []);

        function coinflip(a,b) {
            return (Math.floor(Math.random() * 2) == 0) ? a : b;
        } 

        function drawTree(h) {
            const trunkY = h.y-rndmRng(h.r+150,h.r+30);
            const leavesR = rndmRng(34,8)+h.type*3;

            ctx.strokeStyle= colorsM[h.type];
            ctx.fillStyle= colorsM[h.type];
            ctx.lineWidth = rndmRng(4*h.type,2*h.type);

            ctx.moveTo(h.x,h.y);
            ctx.lineTo(h.x, trunkY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(h.x, trunkY, leavesR, 0, 2 * Math.PI);
            if (Math.random() > .66) ctx.arc(h.x, trunkY-leavesR, leavesR/rndmRng(2,1.1), 0, 2 * Math.PI);
            ctx.fill();
        }

        function quadCurves(y1,y2, max, min, s, x) {
            const cables = coinflip(1,2);
                
            for (let j = cables; j--;) {
                const cpy = Math.max(y1,y2) + rndmRng(max,min);
                ctx.beginPath()
                ctx.moveTo(s.x,s.y);
                ctx.quadraticCurveTo(s.x+(x-s.x)/2, cpy, x, y2);
                ctx.stroke();
            }

            s.x = x;
            s.y = y2;

            return s;
        }

        function drawPoles(t) {
            ctx.strokeStyle= colorsM[t];
            let poleTop = h-rndmRng(350,250);
            let start = {
                x: rndmRng(0,-100),
                y: poleTop
            }
            let i = w*rndmRng(.4,.1);
            
            while (i < w-100) {
                poleTop = h-rndmRng(350,250);
                ctx.lineWidth = 2;
                start = quadCurves(start.y,poleTop, 300, 75, start, i);

                ctx.lineWidth = 15;
                ctx.beginPath();
                ctx.moveTo(i,h);
                ctx.lineTo(i, poleTop);
                ctx.stroke();
                i+=rndmRng(900,500);
            } 

            ctx.lineWidth = 2;
            const endY = poleTop;
            const endX = rndmRng(w+100,w);
            let cpy = Math.max(start.y,endY) + rndmRng(300,75);

            ctx.beginPath()
            ctx.moveTo(start.x,start.y);
            ctx.quadraticCurveTo(start.x+(endX-start.x)/2+35, cpy, endX, endY);
            ctx.stroke();
        }

        function drawCables(rows,t) {
            let start = {
                x: rndmRng(0,-100),
                y: h * rndmRng(.2+(t*.11),-.05+(t*.06)),
            }
            ctx.strokeStyle = colorsM[t];
            ctx.lineWidth = 2;

            rows.forEach(m => {
                start = quadCurves(start.y,m.y, 800, 200, start,m.x+(m.mw/2));
            });

            const endY = h * rndmRng(.2+(t*.11),-.05+(t*.06));
            const endX = rndmRng(w+100,w);
            let cpy = Math.max(start.y,endY) + rndmRng(800,200);
            ctx.beginPath()
            ctx.moveTo(start.x,start.y);
            ctx.quadraticCurveTo(start.x+(endX-start.x)/2+35, cpy, endX, endY);
            ctx.stroke();
        }

        function drawCables2(amt) {
            ctx.strokeStyle="#EBEDAA";
            ctx.fillStyle="#EBEDAA";

            for (let i = amt; i--;) {
                const p0 = {x: rndmRng(0,-400), y: h-rndmRng(500,300),}
                const p1 = {x: rndmRng(w*.7,w*.3), y: h-rndmRng(250,0),}
                const p2 = {x: rndmRng(w+400,w), y: h-rndmRng(500,300),}    

                ctx.beginPath()
                ctx.moveTo(p0.x, p0.y);
                ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
                ctx.stroke();

                let j = .02;
                while (j<.9) {
                    let t = rndmRng(.9,j);
                    let x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
                    let y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

                    ctx.beginPath()
                    ctx.arc(x, y, rndmRng(20,3), 0, 2 * Math.PI);
                    ctx.fill();

                    j+=t;
                }
            }
        }

        function drawHill(h) {
            ctx.fillStyle = colorsM[h.type];
            ctx.beginPath();
            ctx.arc(h.x, h.y, h.r, 0, 2 * Math.PI);
            ctx.fill();
            if (h.tree) drawTree(h);
        }

        function drawGround(g) {
            ctx.fillStyle = colorsM[g.type];
            ctx.beginPath();
            ctx.arc(g.x, g.y, g.r, 0, 2 * Math.PI);
            ctx.fill();
        }

        function generateHillRow(type) {
            let x = rndmRng(0,-25);

            while (x < w+50) {
                const decrease = Math.abs((w/2)-x)*.35;
                const r = rndmRng(300,100);
                const y = h * rndmRng(.7+(type*.06),.5+(type*.06)) - decrease + r;
                const tree = (Math.random() > .75) ? true : false;
                
                hills.push({
                    decrease,
                    type,
                    x,
                    y,
                    r,
                    tree,
                });
                x+=100;
            }  
        }

        function generateGround(type) {
            let x = rndmRng(0,-25);

            while (x < w+50) {
                const r = rndmRng(1200,700);
                const y = h * rndmRng(.99,.88) + r;
                
                ground.push({
                    type,
                    x,
                    y,
                    r,
                });
                x+=600;
            }  
        }

        function generateMonolith(type,x) {
            const mw = rndmRng(100,40);
            const mh =  rndmRng(350,120);
            const y = h * rndmRng(.2+(type*.11),-.05+(type*.06))

            monoliths.push({
                        type,
                        x,
                        y,
                        mw,
                        mh,
                    });
        }

        function generateMonoRow(t) {
            let x = w*rndmRng(.16,.02);;
            while (x < w-100) {
                generateMonolith(t,x);
                x+=rndmRng(800,200);
            }  
        }

        function drawMonolith(m) {
            ctx.fillStyle=colorsM[m.type];
            ctx.strokeStyle="#EBEDAA";
            ctx.lineWidth=3;
            ctx.fillRect(m.x, m.y, m.mw, m.mh);
            if (m.type === 0) {
                ctx.beginPath();
                if (sun.x - m.x + m.mw/2 > 400) {
                    ctx.moveTo(m.x+m.mw, m.y);
                    ctx.lineTo(m.x+m.mw, m.y+m.mh);
                } else if (sun.x - m.x + m.mw/2 < -400) {
                    ctx.moveTo(m.x-1, m.y);
                    ctx.lineTo(m.x-1, m.y+m.mh);
                }
                if (m.y - sun.y > 70) {
                    ctx.moveTo(m.x, m.y);
                    ctx.lineTo(m.x+m.mw, m.y);
                } else if (m.y+m.mh - sun.y < -70) {
                    ctx.moveTo(m.x, m.y+m.mh);
                    ctx.lineTo(m.x+m.mw, m.y+m.mh);
                }
                ctx.stroke();
            }
        }

        function drawGradient(type) {
            const gradient = ctx.createLinearGradient(w/2,0,w/2,h);

            (type===0) ?
                gradient.addColorStop(.05, `rgba(${colorsG[type]} 0)`) :
                gradient.addColorStop(((2*(3.5/(2-(type*.13))))/8)-.1, `rgba(${colorsG[type]} 0)`);
            
            gradient.addColorStop(.4+(type*.36)/((type+1)*.53), `rgba(${colorsG[type]} 1)`);
            gradient.addColorStop(1, `rgba(${colorsG[type]} 1)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        }

        function drawSun() {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#EBEDAA";
            ctx.fillStyle="#EBEDAA";
            ctx.arc(sun.x, sun.y, rndmRng(600,200), 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        function drawDudes() {
            let peaks = [{
                x: w* rndmRng(.5,.3),
                y: h-rndmRng(270,200),
                r: rndmRng(30,20),
            }];

            peaks.push({
                x: peaks[0].x + w * rndmRng(.2,.1),
                y: h-rndmRng(270,200),
                r: rndmRng(30,20),
            })

            peaks.forEach((p,i) => {
                ctx.lineWidth = 2;
                ctx.fillStyle="#050605";

                //body
                ctx.beginPath()
                let startX = p.x+rndmRng(-80,-120);
                ctx.moveTo(startX,h+10);
                ctx.quadraticCurveTo(p.x, p.y-300, p.x+rndmRng(80,120),h+10);
                ctx.lineTo(startX,h+10);
                ctx.fill();

                //face
                ctx.beginPath();
                ctx.arc(p.x, p.y+p.r, p.r, 0, 2 * Math.PI);
                var grdRadial = ctx.createRadialGradient(p.x,p.y+p.r,p.r, 
                                                        p.x+rndmRng(p.r,p.r*-1),p.y+rndmRng(p.r*4,p.r*-2),p.r+rndmRng(10,-10));
                grdRadial.addColorStop(0, '#313a03');
                grdRadial.addColorStop(.8, '#060805');
                grdRadial.addColorStop(1, '#060805');
                ctx.fillStyle = grdRadial;
                ctx.fill();

                ctx.shadowBlur = 3;
                ctx.shadowColor = "#050605";
                //eyes
                ctx.beginPath();
                ctx.fillStyle = '#E6E29B';
                ctx.arc(p.x-(rndmRng(12,5)), p.y+(rndmRng(18,8)), (rndmRng(3,1)), 0, 2 * Math.PI);
                ctx.arc(p.x+(rndmRng(12,5)), p.y+(rndmRng(18,8)), (rndmRng(3,1)), 0, 2 * Math.PI);
                ctx.fill();

                ctx.shadowBlur = 0;
                //smile
                ctx.beginPath();
                ctx.strokeStyle = '#050605';
                ctx.arc(p.x, p.y+p.r, p.r-rndmRng(10,5), rndmRng(.7,-.4), rndmRng(1.1,.8) * Math.PI);
                ctx.stroke();

                //Flag
                if (i===1) {
                    ctx.lineWidth = 10;
                    ctx.strokeStyle = '#050605';
                    let ground = {x: p.x-rndmRng(120,80), y: h+10}
                    let flag = {x: p.x-rndmRng(140,100), y: h-rndmRng(400,300)}
                    ctx.beginPath();
                    ctx.moveTo(ground.x,ground.y);
                    ctx.lineTo(flag.x,flag.y);
                    ctx.stroke();

                    let angle = Math.atan2(ground.y - flag.y, ground.x - flag.x) * 180 / Math.PI;
                    let l = rndmRng(80,40);

                    ctx.moveTo(flag.x,flag.y);
                    ctx.fillStyle = '#050605';
                    ctx.lineTo(flag.x- (l * Math.cos((angle)* Math.PI / 180)),flag.y- (l * Math.sin((angle)* Math.PI / 180)));
                    ctx.lineTo(flag.x- (l * Math.cos((60+angle)* Math.PI / 180)),flag.y- (l * Math.sin((60+angle)* Math.PI / 180)));
                    ctx.lineTo(flag.x,flag.y);
                    ctx.fill();
                    ctx.stroke();
                }
            })
        }

        export function loadWorld() {
            ctx.clearRect(0,0,w,h);
            ctx.shadowColor = "#000"
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;  
            ctx.setLineDash([]);
            ctx.save(); 

             monoliths = [];
             hills = [];
             ground = [];
             sun = {x: w*rndmRng(.7,.3), y: h*rndmRng(.45,-.05),}

            ctx.fillStyle="#E1D640";
            ctx.fillRect(0,0,w,h);
            ctx.beginPath();

            drawSun();
            generateMonoRow(0);
            generateMonoRow(1);
            generateHillRow(2);
            generateHillRow(3);
            generateHillRow(4);
            generateHillRow(5);
            generateHillRow(6);
            generateHillRow(7);
            
            let monolithsGrouped = groupBy(monoliths, 'type');

            monolithsGrouped.forEach((r,i) => {
                drawCables(r,i);
                r.forEach(m => {
                    drawMonolith(m);
                });
                drawGradient(i);
            });

            let hillsGrouped = groupBy(hills, 'type');

            hillsGrouped.forEach((r,i) => {
                r.forEach(h => {
                    drawHill(h);
                });
                drawGradient(r[0].type);
            });

            generateGround(8);

            ground.forEach(g => {
                drawGround(g);
            })
            
            drawPoles(8);
            drawCables2(3);
            drawDudes();

            ctx.restore();
        }

        
