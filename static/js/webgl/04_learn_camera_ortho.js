var GL = ""
var VS = ""
var FS = ""
var PROGRAM = ""
var POSITION_LOCATION = ""
var MATRIX_LOCATION = ""

var VERTICES = [
    -0.5,  0.5, 0.0,    // under
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,

    -0.5,  0.5, 0.0,
     0.5,  0.5, 0.0,
     0.5, -0.5, 0.0

    -0.5,  0.5, 0.5,    // top
    -0.5, -0.5, 0.5,
     0.5, -0.5, 0.5,

    -0.5,  0.5, 0.5,
     0.5,  0.5, 0.5,
     0.5, -0.5, 0.5
]

function main() {
    let canvas = document.getElementById("glCanvas")
    GL = canvas.getContext("webgl2")

    if (!GL) {
        console.error("ERROR unable to initialize webgl")
        return
    }
    initShader()

    POSITION_LOCATION = GL.getAttribLocation(PROGRAM, "a_position")
    // MATRIX_LOCATION = GL.getUniformLocation(PROGRAM, "u_matrix")

    setGeometry()
    drawScene()
    

}

function initShader() {
    let vsSource = `
        attribute vec4 a_position;

        // uniform mat4 u_matrix;

        void main() {
            gl_Position = a_position;
        }
    `
    
    let fsSource = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `
    //
    // init vertex shader
    //
    VS = GL.createShader(GL.VERTEX_SHADER)
    GL.shaderSource(VS, vsSource)
    GL.compileShader(VS)
    
    if (!GL.getShaderParameter(VS, GL.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", GL.getShaderInfoLog(VS))
        GL.deleteShader(VS)
        return
    }

    //
    // init fragment shader
    //
    FS = GL.createShader(GL.FRAGMENT_SHADER)
    GL.shaderSource(FS, fsSource)
    GL.compileShader(FS)
    
    if (!GL.getShaderParameter(FS, GL.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", GL.getShaderInfoLog(FS))
        GL.deleteShader(FS)
        return
    }

    //
    // init program
    //
    PROGRAM = GL.createProgram()
    GL.attachShader(PROGRAM, VS)
    GL.attachShader(PROGRAM, FS)
    GL.linkProgram(PROGRAM)

    if (!GL.getProgramParameter(PROGRAM, GL.LINK_STATUS)) {
        console.error("ERROR linking program!", GL.getProgramInfoLog(PROGRAM))
        GL.deleteProgram(PROGRAM)
        return
    }
}

function drawScene() {
    GL.clearColor(0.0, 0.0, 0.0, 1.0)
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

    GL.useProgram(PROGRAM)

    let dimension = 3
    let primType = GL.TRIANGLES
    let primOffset = 0
    let primCount = parseInt(VERTICES.length / dimension)
    
    GL.drawArrays(
        primType,
        primOffset,
        primCount
    )
}

function setGeometry() {
    let position_buffer = GL.createBuffer()
    
    GL.bindBuffer(GL.ARRAY_BUFFER, position_buffer)
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(VERTICES),
        GL.STATIC_DRAW
    )
    GL.vertexAttribPointer(
        POSITION_LOCATION,
        3,
        GL.FLOAT,
        GL.FALSE,
        0 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    )

    GL.enableVertexAttribArray(POSITION_LOCATION)
}


window.onload = main()