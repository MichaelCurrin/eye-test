const SVG_NS = "http://www.w3.org/2000/svg";


function wait(duration = 30) {
    return new Promise(resolve => setTimeout(resolve, duration));
}


// Add a numeric value to text value and return as text.
function add(text, val) {
    return (parseInt(text) + val).toString();
}


/**
 * Set key-value attributes on an element.
 * TODO: Convert numeric values to strings.
 */
function setAttrs(el, attrs) {
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
    };
}


// Take distance rather than coordinate
function move(el, xDistance, yDistance) {
    // el.cx did not work for some reason but .setAttribute does
    // el.setAttribute("cx", "50");
    if (typeof yDistance === 'undefined') {
        yDistance = xDistance;
    }
    newX = add(el.getAttribute("cx"), xDistance);
    newY = add(el.getAttribute("cx"), yDistance);

    setAttrs(el, {
        cx: newX,
        cy: newY,
    });
}


// https://stackoverflow.com/questions/1484506/random-color-generator
function randomColor(el) {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}


function makeCircle(attrs) {
    if (!attrs) {
        attrs = {
            id: 'moving-shape',
            fill: randomColor(),
            cx: "0",
            cy: "0",
            r: "10",
        };
    }
    var circle = document.createElementNS(SVG_NS, 'circle');
    setAttrs(circle, attrs);

    return circle;
}


function animate(svg) {
    var shape = makeCircle();
    svg.appendChild(shape);

    var p = Promise.resolve();
    for (let i = 0; i < 500; i++) {
        p = p.then(wait)
            .then(() => move(shape, 1));
    }

    return shape;
}


function distanceTravelled(shape) {
    var initalCx = 0;
    var initalCy = 0;
    var cx = shape.getAttribute('cx');
    var cy = shape.getAttribute('cx');

    var distance = Math.sqrt((cx - initalCx) ** 2 + (cy - initalCy) ** 2)

    return parseInt(distance);
}


function average(values) {
    var count = values.length;
    if (!count) {
        return 0;
    }

    var total = values.reduce((a, b) => a + b, 0);

    return (total / count)
}


function deleteMovingShape() {
    var shape = document.getElementById('moving-shape')
    if (shape) {
        shape.remove();
    }
}


function play(svg) {
    var distances = [];

    console.log('Begin!');
    var shape = animate(svg);

    svg.onclick = function () {
        var distance = distanceTravelled(shape);
        distances.push(distance);
        avg = average(distances);
        console.log(`${distances.length}) Distance: ${distance} px. Avg: ${avg.toFixed(1)} px.`);

        deleteMovingShape();
        shape = animate(svg);
    };
}


function setup() {
    var svg = document.getElementById('mySVG');

    var marker = makeCircle({
        id: 'marker',
        fill: 'grey',
        cx: "500",
        cy: "500",
        r: "10"
    })
    svg.appendChild(marker);

    var playButton = document.getElementById('play');
    playButton.onclick = function () {
        deleteMovingShape();
        play(svg);
    };
}
