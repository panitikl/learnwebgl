var gl = ""
var shaders = ""
var program = ""
var positionBuffer = ""
var positionLocation = ""
var resolutionLocation = ""
var colorLocation = ""

var translation = []
var width = 100
var height = 30
var color = [1.0, 0.0, 0.0, 1.0]

function main() {
    let canvas = document.getElementById("glCanvas-translate")
    gl = canvas.getContext("webgl2")

    if (!gl) {
        console.error("Unable to initial WebGL")
        return
    }

    // Setup GLSL program
    shaders = initShader()
    program = initiProgram(shaders)   
    
    // look up where the vertex data needs to go.
    positionLocation = gl.getAttribLocation(program, "a_position")

    // look up uniforms
    resolutionLocation = gl.getUniformLocation(program, "u_resolution")
    colorLocation = gl.getUniformLocation(program, "u_color")

    // create a buffer to put positions in
    positionBuffer = gl.createBuffer()

    // tell webgl how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    // tell it to use our program (pair of shaders)
    gl.useProgram(program)

    // turn on the attribute
    gl.enableVertexAttribArray(positionLocation)

    // bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    translation = [0, 0]
    drawScene(translation[0], translation[1])
}

function initShader() {
    const vsSource = `
        attribute vec2 a_position;
        uniform vec2 u_resolution;

        void main() {
            // convert the rectangle points from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            // convert from 0->2 to -1->+1 (clipspace)
            vec2 clipSpace = zeroToTwo - 1.0;

            gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
        }
    `
    
    const fsSource = `
        precision mediump float;

        uniform vec4 u_color;

        void main() {
            gl_FragColor = u_color;
        }
    `

    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vsSource)
    gl.shaderSource(fragmentShader, fsSource)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader))
        gl.deleteShader(vertexShader)
        return
    }

    gl.compileShader(fragmentShader)
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!s", gl.getShaderInfoLog(fragmentShader))
        gl.deleteShader(fragmentShader)
        return
    }
    return {
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    }
}

function initiProgram(shaders) {
    let program = gl.createProgram()

    gl.attachShader(program, shaders.vertexShader)
    gl.attachShader(program, shaders.fragmentShader)
    
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }
    return program
}

//
// draw scene
//
function drawScene(x, y) {
    // clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    setRectangle(x, y)

    // tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let positionSize = 2                // 2 components per iteration
    let positionType = gl.FLOAT         // the data is 32bit floats
    let positionNormalize = gl.FALSE    // don't normalize the data
    let positionStride = 0              // 0 move forward size * sizeof(type) each iteration to get the next position
    let positionOffset = 0              // start at the beginning of the buffer

    gl.vertexAttribPointer(
        positionLocation,
        positionSize,
        positionType,
        positionNormalize,
        positionStride,
        positionOffset
    )

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

    // set the color
    gl.uniform4fv(colorLocation, color)

    let primType = gl.TRIANGLES
    let primOffset = 0
    let primCount = 6

    gl.drawArrays(primType, primOffset, primCount)
}

function setRectangle(x, y) {
    let x1 = x
    let x2 = x + width
    let y1 = y
    let y2 = y + height

    let vertices = [
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    )
}

function outputValue() {
    let xRange = document.getElementById(`x-slider`)
    let yRange = document.getElementById(`y-slider`)

    document.getElementById(`xRangeValue`).innerHTML = xRange.value
    document.getElementById(`yRangeValue`).innerHTML = yRange.value
    
    drawScene(parseFloat(xRange.value), parseFloat(yRange.value))
}

window.onload = main()