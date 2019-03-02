const SVG_NS = "http://www.w3.org/2000/svg";

function wait(duration = 100) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// Add a numeric value to text value and return as text.
function add(text, val) {
    return (parseInt(text) + val).toString();
}
/** Set key-value attributes on an element.
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

function draw() {
    let svg = document.getElementById('mySVG');

    let c = Promise.resolve();
    // Check scope. all the shapes are drawing at once.
    // Use more functions.
    var p = Promise.resolve();
    for (j = 0; j < 10; j++) {
        c = c.then(function () {
            let defaultAttrs = {
                fill: randomColor(),
                cx: "0",
                cy: "0",
                r: "30",
            };
            console.log(defaultAttrs)
            // Create circle.
            let circle = document.createElementNS(SVG_NS, 'circle');
            setAttrs(circle, defaultAttrs);

            svg.appendChild(circle);


            for (let i = 0; i < 20; i++) {
                p = p.then(wait)
                    // .then(() => setAttrs(circle, {cx: "20", cy: "30"}))
                    .then(() => move(circle, 10, 10));
            }
            p.then(() => svg.removeChild(circle));
        })
    }
};
