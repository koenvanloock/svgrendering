import {attributesModule, classModule, h, init, styleModule} from 'snabbdom'

const patch = init([classModule, styleModule, attributesModule])

function circleArc(clockwise = false) {
    return h('path', {
        attrs: {
            d: `M 210, 150 A 40 40 ${clockwise ? '0 0 1' : '0 1 0'} 150 210 L 150 150 L 210 150`,
            fill: 'yellow'
        }
    })
}

patch(document.querySelector('main'), h('svg', {attrs: {width: 300, height: 300}}, [
    h('circle', {
        attrs: {
            cx: 150,
            cy: 150,
            stroke: '#abcabc',
            fill: 'green',
            r: 60
        }
    }, []), circleArc(true)]))