import {h} from "snabbdom";
const circleGradients = [
    scalingOpacityGradient('Grad1', 5, "#9c60d7"),
    scalingOpacityGradient('Grad2', 9, "#8cdad3"),
    scalingOpacityGradient('Grad3', 5, "#e385b6")
]
const gradients = [{
    id: 'green',
    gradients: [
        {
            offset: '0%',
            stopColor: '#abcabc',
            stopOpacity: '1'
        },
        {
            offset: '50%',
            stopColor: '#29a16a',
            stopOpacity: '1'
        },
        {
            offset: '100%',
            stopColor: '#022515',
            stopOpacity: '1'
        }
    ]
},
    {
        id: 'blue',
        gradients: [
            {
                offset: '0%',
                stopColor: '#8bcae3',
                stopOpacity: '1'
            },
            {
                offset: '50%',
                stopColor: '#36b1e1',
                stopOpacity: '1'
            },
            {
                offset: '100%',
                stopColor: '#1a5870',
                stopOpacity: '1'
            }
        ]
    },
    {
        id: 'red',
        gradients: [
            {
                offset: '0%',
                stopColor: '#e38b9b',
                stopOpacity: '1'
            },
            {
                offset: '50%',
                stopColor: '#e71f44',
                stopOpacity: '1'
            },
            {
                offset: '100%',
                stopColor: '#520a17',
                stopOpacity: '1'
            }
        ]
    },
    {
        id: 'orange',
        gradients: [
            {
                offset: '0%',
                stopColor: '#e3bd8b',
                stopOpacity: '1'
            },
            {
                offset: '50%',
                stopColor: '#ea901b',
                stopOpacity: '1'
            },
            {
                offset: '100%',
                stopColor: '#543309',
                stopOpacity: '1'
            }
        ]
    },
    {
        id: 'yellow',
        gradients: [
            {
                offset: '0%',
                stopColor: '#e3e28b',
                stopOpacity: '1'
            },
            {
                offset: '50%',
                stopColor: '#e0dd18',
                stopOpacity: '1'
            },
            {
                offset: '100%',
                stopColor: '#444308',
                stopOpacity: '1'
            }
        ]
    },
    {
        id: 'indigo',
        gradients: [
            {
                offset: '0%',
                stopColor: '#b88be3',
                stopOpacity: '1'
            },
            {
                offset: '50%',
                stopColor: '#7d1cda',
                stopOpacity: '1'
            },
            {
                offset: '100%',
                stopColor: '#2c0a4d',
                stopOpacity: '1'
            }
        ]
    },
    {
        id: 'violet',
        gradients: [
            {
                offset: '0%',
                stopColor: '#d481dc',
                stopOpacity: '1'
            },
            {
                offset: '50%',
                stopColor: '#d01de1',
                stopOpacity: '1'
            },
            {
                offset: '100%',
                stopColor: '#4f0b56',
                stopOpacity: '1'
            }
        ]
    },
    {
        id: 'lime',
        gradients: [
            {
                offset: '0%',
                stopColor: '#aadc81',
                stopOpacity: '1'
            },
            {
                offset: '50%',
                stopColor: '#71da1b',
                stopOpacity: '1'
            },
            {
                offset: '100%',
                stopColor: '#36690c',
                stopOpacity: '1'
            }
        ]
    }
]

function linearGradient(id, gradientArray) {
    return h('linearGradient#' + id, gradientArray.map(gradient => h('stop', {
        attrs: {
            offset: gradient.offset,
            'stop-color': gradient.stopColor,
            'stop-opacity': gradient.stopOpacity
        }
    })))
}

function scalingOpacityGradient(id, stepCount, color, limit = 0.2) {
    let steps = [];
    let unit = Math.floor(100 / stepCount)
    for(let i = 0; i < stepCount; i++) {
        steps.push({ offset: Math.min(100, (unit * i)) + '%',
            stopColor: color,
            stopOpacity: Math.max(limit, 1 - (1 / (Math.max(1, i)))) })
    }
    return linearGradient(id, steps)
}

export function defs() {
    return h('defs', [
        ...gradients.map(gradientArray => linearGradient(gradientArray.id, gradientArray.gradients)),
        ...circleGradients
    ])
}