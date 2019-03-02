const SVG_NS = "http://www.w3.org/2000/svg";


/** Return a promise which resolves after a number of milliseconds. **/
function wait(duration = 30) {
    return new Promise(resolve => setTimeout(resolve, duration));
}


/**
 * Set key-value attributes on an element.
 */
function setAttrs(el, attrs, forceStringValues = true) {
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v);
    };
}


/**
 * Move a given SVG circle by target number of X and Y pixels.
 *
 * If only X distance is given, it is used for both X and Y.
 */
function moveCircle(el, xDistance, yDistance) {
    if (typeof yDistance === 'undefined') {
        yDistance = xDistance;
    }
    newX = parseInt(el.getAttribute('cx')) + xDistance;
    newY = parseInt(el.getAttribute('cx')) + yDistance;

    setAttrs(el, {
        cx: newX,
        cy: newY,
    });
}


/**
 * Generate random hex color and return as string.
 *
 * Based on: https://stackoverflow.com/questions/1484506/random-color-generator
 */
function randomColor(el) {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}


/**
 * Make a circle shape using given or default attributes and return it.
 *
 * @param {object} attrs Options associative array of attributes to set on the new circle.
 */
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

/**
 * Create a randomly colored circle on the given SVG and move it gradually to a point.
 */
function animate(svg) {
    var shape = makeCircle();
    svg.appendChild(shape);

    var p = Promise.resolve();
    for (let i = 0; i < 500; i++) {
        p = p.then(wait)
            .then(() => moveCircle(shape, 1));
    }

    return shape;
}


/**
 * Calculate how the Euclidean distance in pixels between two points and return as an integer.
 */
function distanceTravelled(newX, newY, oldX, oldY) {
    var distance = Math.sqrt((newX - oldX) ** 2 + (newY - oldY) ** 2)

    return parseInt(distance);
}


/**
 * Calculate the average of an array of numbers.
 */
function average(values) {
    var count = values.length;
    if (!count) {
        return 0;
    }

    var total = values.reduce((a, b) => a + b, 0);

    return (total / count)
}


/**
 * Delete the moving shape element.
 */
function deleteMovingShape() {
    var shape = document.getElementById('moving-shape')
    if (shape) {
        shape.remove();
    }
}


/**
 * Start the eye test game.
 *
 * In the given SVG space, start with a moving shape. When there is click event in the space,
 * log the stats, destroy the shape and create a new one. The stats are persisted throughout
 * the session within this function.
 */
function play(svg) {
    var distances = [];

    console.log('Begin!');
    var shape = animate(svg);

    svg.onclick = function () {
        var distance = distanceTravelled(shape.getAttribute('cx'), shape.getAttribute('cy'), 0, 0);
        distances.push(distance);
        avg = average(distances);
        console.log(`${distances.length}) Distance: ${distance} px. Avg: ${avg.toFixed(1)} px.`);

        deleteMovingShape();
        shape = animate(svg);
    };
}


/**
 * Setup the marker and play button in the SVG space.
 *
 * When the button is clicked, reset the moving shape and the stats and start with a fresh
 * shape and empty stats.
 */
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
