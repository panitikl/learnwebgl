const vsSource = `
    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec3 aVertexColor;
    varying vec3 aFragmentColor;

    void main() {
        aFragmentColor = aVertexColor;
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    }
`

const fsSource = `
    precision mediump float;

    varying vec3 aFragmentColor;

    void main() {
        gl_FragColor = vec4(aFragmentColor, 1.0);
    }
`

// -------------
// MAIN
// -------------
function main(){
    let canvas = document.getElementById("glCanvas")
    let gl = canvas.getContext("webgl2")

    if  (!gl) {
        console.error("ERROR Unable to initialize WebGL.")
    }

    let shader = initShader(gl)
    let shaderProgram = initShaderProgram(gl, shader.vertexShader, shader.fragmentShader)
    let buffers = initBuffer(gl)

    let vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition")
    let vertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor")

    drawScene(gl, shaderProgram, vertexPosition, vertexColor)
}

// ----------------
// INIT SHADER
// ----------------
function initShader(gl) {
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
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader))
        gl.deleteShader(fragmentShader)
        return
    }

    return {vertexShader:vertexShader, fragmentShader:fragmentShader}
}

// ------------------------
// INIT SHADER PROGRAM
// ------------------------
function initShaderProgram(gl, vertexShader, fragmentShader) {
    let shaderProgram = gl.createProgram()

    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)

    gl.linkProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(shaderProgram))
        return
    }
    return shaderProgram
}

// --------------
// INIT BUFFER
// --------------
function initBuffer(gl) {
    let vertices = [
         0.5,  0.5, 1.0, 0.0, 0.0,
        -0.5,  0.5, 0.0, 1.0, 0.0, 
        -0.5, -0.5, 0.0, 0.0, 1.0,
         0.5, -0.5, 0.8, 0.2, 0.5
    ]

    let vertexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, 
                new Float32Array(vertices), 
                gl.STATIC_DRAW)
    
    return vertexBuffer
}

function drawScene(gl, shaderProgram, vertexPosition, vertexColor) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let positionComponents = 2  // X Y
    let positionType = gl.FLOAT
    let positionNormalize = gl.FALSE
    let positionStride = 5 * Float32Array.BYTES_PER_ELEMENT // X Y R G B
    let positionOffset = 0 * Float32Array.BYTES_PER_ELEMENT

    gl.vertexAttribPointer(
        vertexPosition,
        positionComponents,
        positionType,
        positionNormalize,
        positionStride,
        positionOffset
    )
    
    let colorComponents = 3 // R G B
    let colorType = gl.FLOAT
    let colorNormalize = gl.FALSE
    let colorStride = 5 * Float32Array.BYTES_PER_ELEMENT    // X Y R G B
    let colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT

    gl.vertexAttribPointer(
        vertexColor,
        colorComponents,
        colorType,
        colorNormalize,
        colorStride,
        colorOffset
    )

    gl.enableVertexAttribArray(vertexPosition)
    gl.enableVertexAttribArray(vertexColor)

    gl.useProgram(shaderProgram)
    
    const drawOffset = 0
    const drawVertexCount = 4

    gl.drawArrays(gl.TRIANGLE_FAN, drawOffset, drawVertexCount)
}

window.onload = main()