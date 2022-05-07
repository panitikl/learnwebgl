var GL = ""
var VS = ""
var FS = ""
var PROGRAM = ""
var POSITION_LOCATION = ""
var MATRIX_LOCATION = ""
var COLOR_LOCATION = ""

var MATRIX = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]

function degreeToRadians(d) {
    return (360 - d) * Math.PI / 180
}

var TRANSLATION = [0, 0, 0]
var ROTATION = [0, 0, 0]
var SCALE = [1, 1, 1]

var VERTICES = [
    0, 0, 0,
    0, 70, 0,
    100, 70, 0,

    0, 0, 0,
    100, 0, 0, 
    100, 70, 0
]

var COLORS = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0, 

    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
]

var M4 = {
    translation: function(tx, ty,  tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1
        ]
    },

    xRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians)
        let s = Math.sin(angleInRadians)

        return [
            1,  0,  0,  0,
            0,  c,  s,  0,
            0, -s,  c,  0,
            0,  0,  0,  1
        ]
    },

    yRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians)
        let s = Math.sin(angleInRadians)

        return [
            c,  0, -s,  0,
            0,  1,  0,  0,
            s,  0,  c,  0,
            0,  0,  0,  1
        ]
    },

    zRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians)
        let s = Math.sin(angleInRadians)

        return [
            c,  s,  0,  0,
           -s,  c,  0,  0,
            0,  0,  1,  0,
            0,  0,  0,  1
        ]
    },

    scaling: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0,  sy, 0,  0,
            0,  0,  sz, 0,
            0,  0,  0,  1
        ]
    },

    projection: function(width, height, depth) {
        return [
             2 / width, 0, 0, 0,
             0, -2 / height, 0, 0,
             0,  0,  2 / depth, 0,
            -1,  1,  0,  1
        ]
    },

    translate: function(m, tx, ty, tz) {
        return M4.multiply(m, M4.translation(tx, ty, tz))
    },

    xRotate: function(m, angleInRadians) {
        return M4.multiply(m, M4.xRotation(angleInRadians))
    },

    yRotate: function(m, angleInRadians) {
        return M4.multiply(m, M4.yRotation(angleInRadians))
    },

    zRotate: function(m, angleInRadians) {
        return M4.multiply(m, M4.zRotation(angleInRadians))
    },

    scale: function(m, sx, sy, sz) {
        return M4.multiply(m, M4.scaling(sx, sy, sz))
    },

    multiply: function(a, b) {
        let a00 = a[0 * 4 + 0]      // a
        let a01 = a[0 * 4 + 1]
        let a02 = a[0 * 4 + 2]
        let a03 = a[0 * 4 + 3]

        let a10 = a[1 * 4 + 0]
        let a11 = a[1 * 4 + 1]
        let a12 = a[1 * 4 + 2]
        let a13 = a[1 * 4 + 3]

        let a20 = a[2 * 4 + 0]
        let a21 = a[2 * 4 + 1]
        let a22 = a[2 * 4 + 2]
        let a23 = a[2 * 4 + 3]

        let a30 = a[3 * 4 + 0]
        let a31 = a[3 * 4 + 1]
        let a32 = a[3 * 4 + 2]
        let a33 = a[3 * 4 + 3]

        let b00 = b[0 * 4 + 0]      // b
        let b01 = b[0 * 4 + 1]
        let b02 = b[0 * 4 + 2]
        let b03 = b[0 * 4 + 3]

        let b10 = b[1 * 4 + 0]
        let b11 = b[1 * 4 + 1]
        let b12 = b[1 * 4 + 2]
        let b13 = b[1 * 4 + 3]

        let b20 = b[2 * 4 + 0]
        let b21 = b[2 * 4 + 1]
        let b22 = b[2 * 4 + 2]
        let b23 = b[2 * 4 + 3]

        let b30 = b[3 * 4 + 0]
        let b31 = b[3 * 4 + 1]
        let b32 = b[3 * 4 + 2]
        let b33 = b[3 * 4 + 3]

        return [
            (b00 * a00) + (b01 * a10) + (b02 * a20) + (b03 * a30),
            (b00 * a01) + (b01 * a11) + (b02 * a21) + (b03 * a31),
            (b00 * a02) + (b01 * a12) + (b02 * a22) + (b03 * a32),
            (b00 * a03) + (b01 * a13) + (b02 * a23) + (b03 * a33),

            (b10 * a00) + (b11 * a10) + (b12 * a20) + (b13 * a30),
            (b10 * a01) + (b11 * a11) + (b12 * a21) + (b13 * a31),
            (b10 * a02) + (b11 * a12) + (b12 * a22) + (b13 * a32),
            (b10 * a03) + (b11 * a13) + (b12 * a23) + (b13 * a33),

            (b20 * a00) + (b21 * a10) + (b22 * a20) + (b23 * a30),
            (b20 * a01) + (b21 * a11) + (b22 * a21) + (b23 * a31),
            (b20 * a02) + (b21 * a12) + (b22 * a22) + (b23 * a32),
            (b20 * a03) + (b21 * a13) + (b22 * a23) + (b23 * a33),

            (b30 * a00) + (b31 * a10) + (b32 * a20) + (b33 * a30),
            (b30 * a01) + (b31 * a11) + (b32 * a21) + (b33 * a31),
            (b30 * a02) + (b31 * a12) + (b32 * a22) + (b33 * a32),
            (b30 * a03) + (b31 * a13) + (b32 * a23) + (b33 * a33)
        ]
    }
}

function main() {
    let canvas = document.getElementById("glCanvas")
    GL = canvas.getContext("webgl2")

    if (!GL) {
        console.error("ERROR unable to initialize webgl")
        return
    }

    initShader()

    POSITION_LOCATION = GL.getAttribLocation(PROGRAM, "a_position")
    MATRIX_LOCATION = GL.getUniformLocation(PROGRAM, "u_matrix")
    COLOR_LOCATION = GL.getAttribLocation(PROGRAM, "a_color")

    setGeometry()
    drawScene()
}

function initShader() {
    let vsSource = `
        attribute vec4 a_position;
        attribute vec3 a_color;

        uniform mat4 u_matrix;

        varying vec3 v_color;

        void main() {
            v_color = a_color;
            gl_Position = u_matrix * a_position;
        }
    `
    
    let fsSource = `
    precision mediump float;

    varying vec3 v_color;

    void main() {
        gl_FragColor = vec4(v_color, 1.0);
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
    GL.viewport(0, 0, GL.canvas.clientWidth, GL.canvas.clientHeight)

    GL.clearColor(0.0, 0.0, 0.0, 1.0)
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

    GL.useProgram(PROGRAM)
    GL.enable(GL.DEPTH_TEST)
    
    // set the matrix
    MATRIX = M4.projection(GL.canvas.clientWidth, GL.canvas.clientHeight, 400)
    MATRIX = M4.translate(MATRIX, TRANSLATION[0], TRANSLATION[1], TRANSLATION[2])
    MATRIX = M4.xRotate(MATRIX, ROTATION[0])
    MATRIX = M4.yRotate(MATRIX, ROTATION[1])
    MATRIX = M4.zRotate(MATRIX, ROTATION[2])
    MATRIX = M4.scale(MATRIX, SCALE[0], SCALE[1], SCALE[1])

    GL.uniformMatrix4fv(MATRIX_LOCATION, false, MATRIX)

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
    //
    // Vertices
    //
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

    //
    // colors
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
        0 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    )

    GL.enableVertexAttribArray(COLOR_LOCATION)
}

function updateMatrix() {
    // transform input
    txSlider = document.getElementById("tx-slider")
    tySlider = document.getElementById("ty-slider")
    tzSlider = document.getElementById("tz-slider")

    rxSlider = document.getElementById("rx-slider")
    rySlider = document.getElementById("ry-slider")
    rzSlider = document.getElementById("rz-slider")

    sxSlider = document.getElementById("sx-slider")
    sySlider = document.getElementById("sy-slider")
    szSlider = document.getElementById("sz-slider")

    // transform display value
    txValue = document.getElementById("tx-value")
    tyValue = document.getElementById("ty-value")
    tzValue = document.getElementById("tz-value")

    rxValue = document.getElementById("rx-value")
    ryValue = document.getElementById("ry-value")
    rzValue = document.getElementById("rz-value")

    sxValue = document.getElementById("sx-value")
    syValue = document.getElementById("sy-value")
    szValue = document.getElementById("sz-value")

    // transform update DOM
    let tx = parseFloat(txSlider.value)
    let ty = parseFloat(tySlider.value)
    let tz = parseFloat(tzSlider.value)

    let rx = parseFloat(rxSlider.value)
    let ry = parseFloat(rySlider.value)
    let rz = parseFloat(rzSlider.value)

    let sx = parseFloat(sxSlider.value)
    let sy = parseFloat(sySlider.value)
    let sz = parseFloat(szSlider.value)

    txValue.innerHTML = tx
    tyValue.innerHTML = ty
    tzValue.innerHTML = tz

    rxValue.innerHTML = rx
    ryValue.innerHTML = ry
    rzValue.innerHTML = rz

    sxValue.innerHTML = sx
    syValue.innerHTML = sy
    szValue.innerHTML = sz

    TRANSLATION = [tx, ty, tz]
    ROTATION = [
        degreeToRadians(rx), 
        degreeToRadians(ry), 
        degreeToRadians(rz)
    ]
    SCALE = [sx, sy, sz]

    drawScene()
}


window.onload = main()