var GL = ""
var VS = ""
var FS = ""
var PROGRAM = ""
var POSITION_LOCATION = ""
var COLOR_LOCATION = ""

var RESOLUTION_LOCATION = ""
var MATRIX_LOCATION = ""
var MATRIX = [
    1, 0, 0,
    0, 1, 0,
    200, 120, 1
]

var VERTICES = [        // position by resolution
     0,   0,
    -70,  70,
     70,  70
]

var COLORS = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
]

var M3 = {
    translation: function(tx, ty) {
        return [
            1,  0,  0,
            0,  1,  0,
            tx, ty, 0
        ]
    },
    rotation: function(angleInRadius) {
        let c = Math.cos(angleInRadius)
        let s = Math.sin(angleInRadius)

        return [
            c, -s, 0,
            s,  c, 0,
            0,  0, 1
        ]
    },

    scale: function(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0,  0, 1
        ]
    },

    multiply: function(a, b) {
        let a00 = a[0 * 3 + 0]
        let a01 = a[0 * 3 + 1]
        let a02 = a[0 * 3 + 2]

        let a10 = a[1 * 3 + 0]
        let a11 = a[1 * 3 + 1]
        let a12 = a[1 * 3 + 2]

        let a20 = a[2 * 3 + 0]
        let a21 = a[2 * 3 + 1]
        let a22 = a[2 * 3 + 2]

        let b00 = b[0 * 3 + 0]
        let b01 = b[0 * 3 + 1]
        let b02 = b[0 * 3 + 2]

        let b10 = b[1 * 3 + 0]
        let b11 = b[1 * 3 + 1]
        let b12 = b[1 * 3 + 2]

        let b20 = b[2 * 3 + 0]
        let b21 = b[2 * 3 + 1]
        let b22 = b[2 * 3 + 2]

        return [
            (b00 * a00) + (b01 * a10) + (b02 * a20),
            (b00 * a01) + (b01 * a11) + (b02 * a21),
            (b00 * a02) + (b01 * a12) + (b02 * a22),

            (b10 * a00) + (b11 * a10) + (b12 * a20),
            (b10 * a01) + (b11 * a11) + (b12 * a21),
            (b10 * a02) + (b11 * a12) + (b12 * a22),

            (b20 * a00) + (b21 * a10) + (b22 * a20),
            (b20 * a01) + (b21 * a11) + (b22 * a21),
            (b20 * a02) + (b21 * a12) + (b22 * a22)
        ]
    }
}

function main() {
    let canvas = document.getElementById("glCanvas")
    GL = canvas.getContext("webgl2")

    if (!GL) {
        console.error("ERROR Unable to initialize webGL2")
    }

    initShader()            // init shaders

    POSITION_LOCATION = GL.getAttribLocation(PROGRAM, "a_position")
    COLOR_LOCATION = GL.getAttribLocation(PROGRAM, "a_color")

    RESOLUTION_LOCATION = GL.getUniformLocation(PROGRAM, "u_resolution")
    MATRIX_LOCATION = GL.getUniformLocation(PROGRAM, "u_matrix")

    GL.useProgram(PROGRAM)

    setGeometry()           // set geometry
    drawScene()             // draw scene

}

function initShader() {
    const vsSource = `
        attribute vec2 a_position;
        attribute vec3 a_color;

        uniform vec2 u_resolution;
        uniform mat3 u_matrix;

        varying vec3 v_color;

        void main() {
            v_color = a_color;
            
            vec2 position = (u_matrix * vec3(a_position, 1)).xy;
            vec2 zeroToOne =  position / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;
            
            gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
        }
    `

    const fsSource = `
        precision mediump float;

        varying vec3 v_color;

        void main() {
            gl_FragColor = vec4(v_color, 1.0);
        }
    `
    // VERTEX SHADER
    VS = GL.createShader(GL.VERTEX_SHADER)
    GL.shaderSource(VS, vsSource)
    GL.compileShader(VS)

    if (!GL.getShaderParameter(VS, GL.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", GL.getShaderInfoLog(VS))
        GL.deleteShader(VS)
        return 
    }

    // FRAGMENT SHADER
    FS = GL.createShader(GL.FRAGMENT_SHADER)
    GL.shaderSource(FS, fsSource)
    GL.compileShader(FS)

    if (!GL.getShaderParameter(FS, GL.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", GL.getShaderInfoLog(FS))
        GL.deleteShader(FS)
        return 
    }

    // PROGRAM
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
    GL.clear(GL.COLOR_BUFFER_BIT)

    GL.uniform2f(RESOLUTION_LOCATION, GL.canvas.width, GL.canvas.height)
    GL.uniformMatrix3fv(MATRIX_LOCATION, false, MATRIX)

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
    // position buffer
    //
    let position_buffer = GL.createBuffer()

    GL.bindBuffer(GL.ARRAY_BUFFER, position_buffer)
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(VERTICES),
        GL.STATIC_DRAW
    )
    
    //
    // position
    //
    GL.vertexAttribPointer(
        POSITION_LOCATION,      // position buffer
        2,                      // X Y
        GL.FLOAT,               // data type
        GL.FALSE,               // normalize
        0 * Float32Array.BYTES_PER_ELEMENT,     // stride
        0 * Float32Array.BYTES_PER_ELEMENT      // offset
    )
    GL.enableVertexAttribArray(POSITION_LOCATION)

    //
    // color
    //
    let color_buffer = GL.createBuffer()

    GL.bindBuffer(GL.ARRAY_BUFFER, color_buffer)
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(COLORS),
        GL.STATIC_DRAW
    )

    GL.vertexAttribPointer(
        COLOR_LOCATION,
        3,
        GL.FLOAT,
        GL.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    )

    GL.enableVertexAttribArray(COLOR_LOCATION)
}

// -----------------
// update matrix
// -----------------
function updateMatrix() {
    let txSlider = document.getElementById("tx-slider")
    let tySlider = document.getElementById("ty-slider")
    let sxSlider = document.getElementById("sx-slider")
    let sySlider = document.getElementById("sy-slider")
    let angleSlider = document.getElementById("angle-slider")
    
    let txValue = document.getElementById("tx-value")
    let tyValue = document.getElementById("ty-value")
    let sxValue = document.getElementById("sx-value")
    let syValue = document.getElementById("sy-value")
    let angleValue = document.getElementById("angle-value")

    let txVal = parseFloat(txSlider.value)
    let tyVal = parseFloat(tySlider.value)
    let sxVal = parseFloat(sxSlider.value)
    let syVal = parseFloat(sySlider.value)
    let angleVal = parseFloat(angleSlider.value)

    txValue.innerHTML = txVal
    tyValue.innerHTML = tyVal
    sxValue.innerHTML = sxVal
    syValue.innerHTML = syVal
    angleValue.innerHTML = angleVal

    let angleInRadius = (360 - angleVal) * Math.PI / 180

    let translationMatrix = M3.translation(txVal, tyVal)
    let rotateMatrix = M3.rotation(angleInRadius)
    let scaleMatrix = M3.scale(sxVal, syVal)

    let _matrix = M3.multiply(translationMatrix, rotateMatrix)
    MATRIX = M3.multiply(_matrix, scaleMatrix)

    drawScene()
}


window.onload = main()