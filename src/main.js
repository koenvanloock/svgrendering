import {attributesModule, classModule, eventListenersModule, h, init, styleModule, toVNode} from 'snabbdom'
import {defs} from './defs.js'

const width = 500;
const patch = init([classModule, styleModule, attributesModule, eventListenersModule])
const center = {x: width / 2, y: width / 2}
const backCircleRadius = 200
let innerRadius = 100
let radius = 140
const debug = false;
let selectedText = null;
const korthagenSteps = ["Handelen",'Terugblikken','Bewustwording', 'Alternatieven ontwikkelen', 'Uitproberen']
const abcStepsVoluit = ['Airway', 'Breathing', 'Circulation', 'Disablility', 'Exposure', 'Full set fysiek', 'Fullset psychisch', 'Full set sociaal']
const abcSteps = ['A', 'B', 'C', 'D', 'E', 'Ff', 'Fp', 'Fs']
const texts = ['informatieverwerking', 'VP en Co-P', 'Doelstellingen', "Interventies en observaties", 'Evaluatie', 'reflectie', 'situatieschets', 'Gegevensverzameling']
let whitespace = 0
const degrees_to_radians = deg => (deg * Math.PI) / 180.0;

const rainbowColors = ['red', 'orange', 'yellow', 'lime', 'green', 'blue', 'indigo', 'violet']

function renderRotatedText(text, point, angle, color = 'white') {
    console.log(color);
    return h('text', {
        attrs: {
            x: point.x,
            y: Math.floor(angle) == 180 ? point.y + 10 : point.y,
            'text-anchor': 'middle',
            'font-family': 'Arial, Helvetica, sans-serif',
            'font-size': '8px',
            transform: `rotate(${Math.floor(angle) == 180 ? 0 : angle}, ${point.x},${point.y})`,
        },
        style: {
            fontWeight: 'bold',
            fill: color,
        }
    }, [text])
}

function circleArc(text, center, outerRadius, arcRadius, fromAngle, toAngle, fill = 'yellow', horizontalExtra = 0, overriddenTextAngle = null, verticalExtra = 0) {
    let clockwise = fromAngle - toAngle > 0;

    let firstRadians = degrees_to_radians(fromAngle);
    let secondRadians = degrees_to_radians(toAngle);
    let textAngle = (toAngle + fromAngle) / 2
    let textRadians = degrees_to_radians(overriddenTextAngle != null ? overriddenTextAngle : textAngle)
    let sinA = Math.sin(firstRadians)
    let cosA = Math.cos(firstRadians)
    let sinB = Math.sin(secondRadians)
    let cosB = Math.cos(secondRadians)
    let cosC = Math.cos(textRadians)
    let sinC = Math.sin(textRadians)
    let backRadius = outerRadius - arcRadius
    let firstPoint = {
        x: cosA * outerRadius + center.x,
        y: sinA * outerRadius + center.y
    }
    let secondPoint = {
        x: cosB * (outerRadius + horizontalExtra) + center.x,
        y: sinB * (outerRadius) + center.y
    }
    let textHeight = -20;
    let textPoint = {
        x: cosC * (outerRadius - textHeight) + center.x,
        y: sinC * (outerRadius - textHeight) + center.y
    }
    return [h('path', {
        attrs: {
            d: `M ${firstPoint.x}, ${firstPoint.y} 
                A ${backRadius + verticalExtra} ${backRadius + horizontalExtra} ${!clockwise ? '0 0 1' : '0 1 0'} ${secondPoint.x} ${secondPoint.y} 
                L ${center.x} ${center.y} 
                L ${firstPoint.x} ${firstPoint.y}`,
            fill: fill
        }
    }),
        renderRotatedText(text, textPoint, (overriddenTextAngle != null ? overriddenTextAngle : textAngle) - 90, 'red')
    ]
}

function generateArrayOfCount(count) {
    const res = []
    for (let i = 1; i <= count; i++) {
        res.push(i)
    }
    return res;
}

function line(pointA, pointB, stroke) {
    return h('line', {
        attrs: {
            stroke: stroke,
            strokeWidth: 1,
            x1: pointA.x,
            x2: pointB.x,
            y1: pointA.y,
            y2: pointB.y
        }
    })
}

function circle(center, radius, fill) {
    return h('circle', {
        attrs: {
            cx: center.x,
            cy: center.y,
            r: radius,
            fill: fill
        }
    })
}

function dognutPart(index, text, partCount, radius, innerRadius, center, whitespace = 0, selected = false) {
    let unitAngle = (360 / partCount) - whitespace;
    let degAngle = unitAngle * index + (index * whitespace);
    let radiansUnitAngle = degrees_to_radians(unitAngle / 2)
    let radiansAngle = degrees_to_radians(degAngle);
    let finalInner = selected ? innerRadius - 20 : innerRadius;
    let finalOuter = selected ? radius + 20 : radius;
    let cosA = Math.cos(radiansAngle - radiansUnitAngle)
    let cosB = Math.cos(radiansAngle + radiansUnitAngle)
    let cosC = Math.cos(radiansAngle)
    let sinC = Math.sin(radiansAngle)
    let sinA = Math.sin(radiansAngle - radiansUnitAngle)
    let sinB = Math.sin(radiansAngle + radiansUnitAngle)
    let firstInner = {
        x: cosA * finalInner + center.x,
        y: sinA * finalInner + center.y
    }
    let firstOuter = {
        x: cosA * finalOuter + center.x,
        y: sinA * finalOuter + center.y
    }
    let secondOuter = {
        x: cosB * finalOuter + center.x,
        y: sinB * finalOuter + center.y
    }
    let secondInner = {
        x: cosB * finalInner + center.x,
        y: sinB * finalInner + center.y
    }

    let textHeight = 20
    let anglePointOnCircle = {
        x: cosC * (radius - textHeight) + center.x,
        y: sinC * (radius - textHeight) + center.y
    }
    return debug ? [
        line(center, firstOuter, 'black'),
        line(center, secondOuter, 'black'),
        line(center, {
            x: Math.cos(radiansAngle) * finalOuter + center.x,
            y: Math.sin(radiansAngle) * finalOuter + center.y
        }, 'black'),
        circle(firstInner, 5, 'url(#green)'),
        circle(firstOuter, 5, 'orange'),
        circle(secondInner, 5, 'blue'),
        circle(secondOuter, 5, 'purple'),
        h('path', {
            attrs: {
                d: `M ${firstInner.x} ${firstInner.y} L ${firstOuter.x} ${firstOuter.y} L ${secondOuter.x} ${secondOuter.y} L ${secondInner.x} ${secondInner.y} L ${firstInner.x} ${firstInner.y}`,
                fill: (index % 2 === 0) ? 'orange' : 'url(#green)',
                stroke: 'black'
            }
        }),
        renderRotatedText(text, anglePointOnCircle, degAngle)
    ] : [h('path', {
        attrs: {
            d: `M ${firstInner.x} ${firstInner.y} L ${firstOuter.x} ${firstOuter.y} L ${secondOuter.x} ${secondOuter.y} L ${secondInner.x} ${secondInner.y} L ${firstInner.x} ${firstInner.y}`,
            fill: 'url(#' + rainbowColors[(index - 1) % 8] + ')',
            stroke: 'black'
        }
    }),
        renderRotatedText(text, anglePointOnCircle, degAngle - 90)


    ]
}

function radio(labelText, selectedItem, items, updateFunction) {
    return h('div', {
        style: {
            display: 'flex'
        }
    }, [
        h('label', {}, [labelText]),
        h('div', {display: 'flex', 'flex-direction': 'column'}, [...items, null].map(i => h('div', {
            style: {
                display: 'flex'
            }
        }, [
            h('input', {
                attrs: {
                    type: 'radio',
                    name: labelText,
                    value: i
                },
                on: {
                    change: e => {
                        updateFunction(e.target.value)
                        patch(toVNode(document.querySelector("svg")), svgNode())
                    }
                }
            }),
            h('label', {
                style: {
                    cursor: 'pointer'
                }, on: {
                    click: e => {
                        updateFunction(i)
                        patch(toVNode(document.querySelector("svg")), svgNode())
                    }
                }
            }, ['' + i])

        ])))
    ])
}

function labeledInput(labelText, initial, updateFunc) {
    return h('div', {
        style: {
            display: 'flex'
        }
    }, [
        h('label', {}, [labelText]),
        h('input', {
            attrs: {
                type: 'number',
                value: initial
            },
            on: {
                input: (e) => {
                    updateFunc(e.target.value);
                    patch(toVNode(document.querySelector("svg")), svgNode())
                }
            }
        }, []),
    ])
}

function isSelected(text) {
    return text === selectedText;
}

function svgNode() {
    return h('svg', {attrs: {width: width, height: width}},
        [
            defs(),
            ...circleArc('ABC - tool', center, radius, backCircleRadius, 293, 475, 'url(#Grad1)', 20
                , 0),
            ...circleArc('PESDIE', center, radius, backCircleRadius, 90, 248, 'url(#Grad2)'),
            ...circleArc('Korthagen', center, radius, backCircleRadius, 248, 293, 'url(#Grad3)', 0, null, 10),
            ...generateArrayOfCount(texts.length).flatMap(index => dognutPart(index, texts[index - 1], texts.length, radius, innerRadius, center, whitespace, isSelected(texts[index - 1]))),
            //circle(center, 5, 'red')
        ]);
}

patch(document.querySelector('main'), h('div', {}, [
    h('div.form', {}, [
        labeledInput('witruimte', whitespace, (value) => whitespace = value),
        labeledInput('afstand in het midden', innerRadius, (value) => innerRadius = value),
        labeledInput('afstand tot buitenste punten', radius, (value) => radius = value),
        radio('actief item', selectedText, texts, (v) => selectedText = v)
    ]),
    svgNode()]))
