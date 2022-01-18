export const rndmRng = (h, l) => Math.random() * (h - l) + l;

export const distanceToC = (px,py,cx,cy) => Math.sqrt((Math.pow(px-cx,2))+(Math.pow(py-cy,2)));

export const drawEllipseByCenter = (ctx, cx, cy, w, h) => {
    drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

const drawEllipse = (ctx, x, y, w, h) => {
    const kappa = .5522848,
        ox = (w / 2) * kappa, 
        oy = (h / 2) * kappa, 
        xe = x + w,           
        ye = y + h,        
        xm = x + w / 2,    
        ym = y + h / 2; 

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.fill();
}

export const coinflip = (a,b) => {
    return (Math.floor(Math.random() * 2) == 0) ? a : b;
} 

export const groupBy = (arr, fn) =>
    arr
        .map(typeof fn === 'function' ? fn : val => val[fn])
        .reduce((acc, val, i) => {
        acc[val] = (acc[val] || []).concat(arr[i]);
        return acc;
        }, []);

export const shuffle = (array) => {
    var currentIndex = array.length,  randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

export const flatten = (arr, depth = 1) =>
    arr.reduce(
        (a, v) =>
        a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
        []
    );