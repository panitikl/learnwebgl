var GL = ""
var PROGRAM = ""

var VERTEX_SHADER = ""
var FRAGMENT_SHADER = ""

var POSITION_BUFFER = ""
var COLOR_BUFFER = ""

var POSITION_LOCATION = ""
var RESOLUTION_LOCATION = ""
var COLOR_LOCATION = ""
var TRANSLATE_LOCATION = ""
var SCALE_LOCATION = ""
var ROTATE_LOCATION = ""

var AMP = 50
var VERTICES = [
    -25,  -50,
    -75,   50,
     50,   50
]
var TRANSLATE = [0, 0]
var ROTATE = [0.0, 1.0]
var SCALE = [1.0, 1.0]
var COLORS = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
]

function main() {
    let canvas = document.getElementById("glCanvas-translate")
    GL = canvas.getContext("webgl2")

    if (!GL) {
        console.error("ERROR Unable to initial WebGL.")
        return
    }

    initShader()
    initProgram()

    POSITION_LOCATION = GL.getAttribLocation(PROGRAM, "a_position")
    COLOR_LOCATION = GL.getAttribLocation(PROGRAM, "a_color")

    RESOLUTION_LOCATION = GL.getUniformLocation(PROGRAM, "u_resolution")
    TRANSLATE_LOCATION = GL.getUniformLocation(PROGRAM, "u_translate")
    ROTATE_LOCATION = GL.getUniformLocation(PROGRAM, "u_rotate")
    SCALE_LOCATION = GL.getUniformLocation(PROGRAM, "u_scale")

    GL.useProgram(PROGRAM)

    setGeometry(TRANSLATE[0], TRANSLATE[1])
    drawScene()
}

function initShader() {
    const vsSource = `
        attribute vec2 a_position;
        attribute vec3 a_color;

        uniform vec2 u_translate;
        uniform vec2 u_rotate;
        uniform vec2 u_scale;
        uniform vec2 u_resolution;

        varying vec3 v_color;

        void main() {
            vec2 scaledPosition = a_position * u_scale;

            vec2 rotatePosition = vec2(
                scaledPosition.x * u_rotate.y + scaledPosition.y * u_rotate.x,
                scaledPosition.y * u_rotate.y - scaledPosition.x * u_rotate.x
            );

            vec2 position = rotatePosition + u_translate;

            vec2 zeroToOne = position / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;

            v_color = a_color;
            gl_Position = vec4(clipSpace * vec2(1,-1), 0.0, 1.0);
        }
    `
    const fsSource = `
        precision highp float;

        varying vec3 v_color;

        void main() {
            gl_FragColor = vec4(v_color, 1.0);
        }
    `
    VERTEX_SHADER = GL.createShader(GL.VERTEX_SHADER)
    FRAGMENT_SHADER = GL.createShader(GL.FRAGMENT_SHADER)

    GL.shaderSource(VERTEX_SHADER, vsSource)
    GL.shaderSource(FRAGMENT_SHADER, fsSource)

    GL.compileShader(VERTEX_SHADER)
    if (!GL.getShaderParameter(VERTEX_SHADER, GL.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", GL.getShaderInfoLog(VERTEX_SHADER))
        GL.deleteShader(VERTEX_SHADER)
        return
    }

    GL.compileShader(FRAGMENT_SHADER)
    if (!GL.getShaderParameter(FRAGMENT_SHADER, GL.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", GL.getShaderInfoLog(FRAGMENT_SHADER))
        GL.deleteShader(FRAGMENT_SHADER)
        return
    }
}

function initProgram() {
    PROGRAM = GL.createProgram()

    GL.attachShader(PROGRAM, VERTEX_SHADER)
    GL.attachShader(PROGRAM, FRAGMENT_SHADER)
    GL.linkProgram(PROGRAM)

    if (!GL.getProgramParameter(PROGRAM, GL.LINK_STATUS)) {
        console.log("ERROR linking program!", GL.getProgramInfoLog(PROGRAM))
        GL.deleteProgram(PROGRAM)
        return
    }
}

function drawScene() {
    GL.clearColor(0.0, 0.0, 0.0, 1.0)
    GL.clear(GL.COLOR_BUFFER_BIT)

    GL.uniform2f(RESOLUTION_LOCATION, GL.canvas.width, GL.canvas.height)
    GL.uniform2fv(TRANSLATE_LOCATION, TRANSLATE)
    GL.uniform2fv(ROTATE_LOCATION, ROTATE)
    GL.uniform2fv(SCALE_LOCATION, SCALE)
    
    let primType = GL.TRIANGLES
    let primOffset = 0
    let primCount = 3

    GL.drawArrays(
        primType,
        primOffset,
        primCount
    )
}

function setGeometry() {
    //
    // Position
    //
    POSITION_BUFFER = GL.createBuffer()
    GL.bindBuffer(GL.ARRAY_BUFFER, POSITION_BUFFER)
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(VERTICES),
        GL.STATIC_DRAW
    )

    GL.vertexAttribPointer(
        POSITION_LOCATION,
        2,          // X Y
        GL.FLOAT,   // Data type
        GL.FALSE,   // Normalize
        0 * Float32Array.BYTES_PER_ELEMENT, // Stride
        0 * Float32Array.BYTES_PER_ELEMENT  // Offset
    )

    GL.enableVertexAttribArray(POSITION_LOCATION)

    //
    // Color
    //
    COLOR_BUFFER = GL.createBuffer()
    GL.bindBuffer(GL.ARRAY_BUFFER, COLOR_BUFFER)
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(COLORS),
        GL.STATIC_DRAW
    )

    GL.vertexAttribPointer(
        COLOR_LOCATION,
        3,          // R G B
        GL.FLOAT,   // Data type
        GL.FALSE,   // Normalize
        3 * Float32Array.BYTES_PER_ELEMENT, // Stride  
        0 * Float32Array.BYTES_PER_ELEMENT  // Offset
    )

    GL.enableVertexAttribArray(COLOR_LOCATION)
}


function updateTranslate() {
    let xRange = document.getElementById("tx-slider")
    let yRange = document.getElementById("ty-slider")

    let xValDom = document.getElementById("txValue")
    let yValDom = document.getElementById("tyValue")

    xVal = parseFloat(xRange.value)
    yVal = parseFloat(yRange.value)

    xValDom.innerHTML = xVal
    yValDom.innerHTML = yVal

    TRANSLATE[0] = xVal
    TRANSLATE[1] = yVal

    drawScene()
}

function updateScale() {
    let xRange = document.getElementById("sx-slider")
    let yRange = document.getElementById("sy-slider")

    let xValDom = document.getElementById("sxValue")
    let yValDom = document.getElementById("syValue")

    xVal = parseFloat(xRange.value)
    yVal = parseFloat(yRange.value)

    xValDom.innerHTML = xVal
    yValDom.innerHTML = yVal

    SCALE[0] = xVal
    SCALE[1] = yVal

    drawScene()
}

function updateRotate() {
    let rotateRange = document.getElementById("rotate-slider")
    let valDom = document.getElementById("rotateValue")

    rotVal = parseFloat(rotateRange.value)

    let angleInDegree = 360.0 - rotVal
    let angleInRadius = angleInDegree * Math.PI / 180

    valDom.innerHTML = rotVal

    ROTATE[0] = Math.sin(angleInRadius)
    ROTATE[1] = Math.cos(angleInRadius)

    drawScene()
}


window.onload = main()