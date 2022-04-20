// -----------
// MAIN
// -----------
function main() {
    let canvas = document.getElementById("glCanvas-triangle-translate")
    let gl = canvas.getContext("webgl")
    
    if (!gl) {
        console.error("ERROR Unable initialize WebGL.")
    }

    let vertexShader = initShader(gl, "vertex")
    let fragmentShader = initShader(gl, "fragment")

    let shaderProgram = initShaderProgran(gl, vertexShader, fragmentShader)

    let vertexPosition = gl.getAttribLocation(shaderProgram, "a_vertexPosition")
    let vertexColor = gl.getAttribLocation(shaderProgram, "a_vertexColor")

    // INIT VERTEX BUFFER
    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // TRANSLATION
    let translation = gl.getUniformLocation(shaderProgram, "translation")

    drawScene(gl, shaderProgram, vertexPosition, vertexColor, canvas)
}

// ------------------
// INIT SHADER
// ------------------
function initShader(gl, type) {
    const vsSource = `
        attribute vec2 a_vertexPosition;
        attribute vec3 a_vertexColor;

        uniform vec2 u_resolution;
        uniform vec2 u_translation;

        varying vec3 v_fragmentColor;

        void main() {
            v_fragmentColor = a_vertexColor;
            gl_Position = vec4(a_vertexPosition + u_translation, 0.0, 1.0);
        }
    `

    const fsSource = `
        precision mediump float;

        varying vec3 v_fragmentColor;

        void main() {
            gl_FragColor = vec4(v_fragmentColor, 1.0);
        }
    `
    let shader = ""
    let shaderSource = ""

    if (type === "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER)
        shaderSource = vsSource
    }

    else if (type === "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER)
        shaderSource = fsSource
    }

    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`ERROR compiling ${type} shader!`, gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return
    }
    return shader
}

// --------------------------
// INIT SHADING PROGRAM
// --------------------------
function initShaderProgran(gl, vertexShader, fragmentShader) {
    let shaderProgram = gl.createProgram()

    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)

    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("ERROR linking program!", gl.getProgramInfoLog(shaderProgram))
        gl.deleteProgram(shaderProgram)
        return
    }
    return shaderProgram
}

// ----------------
// SET GEOMETRY
// ----------------
function setGeometry(gl) {
    let positions = [
         0.0,  0.5, 1.0, 0.0, 0.0, 
        -0.5, -0.5, 0.0, 1.0, 0.0,
         0.5, -0.5, 0.0, 0.0, 1.0
    ]

    //
    // POSITION
    //
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(positions), 
        gl.STATIC_DRAW
    )
}

// ----------------
// DRAW SCENE
// ----------------
function drawScene(gl, shaderProgram, vertexPosition, vertexColor, canvas, tx, ty) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    //
    // POSITION
    //
    let positionComponent = 2       // X Y
    let positionType = gl.FLOAT
    let positionNormalize = gl.FALSE
    let positionStrid = 5 * Float32Array.BYTES_PER_ELEMENT      // X Y R G B
    let positionOffset = 0 * Float32Array.BYTES_PER_ELEMENT

    gl.vertexAttribPointer(
        vertexPosition,
        positionComponent,
        positionType,
        positionNormalize,
        positionStrid,
        positionOffset
    )

    //
    // COLOR
    //
    let colorComponent = 3      // R G B
    let colorType = gl.FLOAT
    let colorNormalize = gl.FALSE
    let colorStrid = 5 * Float32Array.BYTES_PER_ELEMENT     // X Y R G B
    let colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT

    gl.vertexAttribPointer(
        vertexColor,
        colorComponent,
        colorType,
        colorNormalize,
        colorStrid,
        colorOffset
    )

    // SETUP SCENE
    setGeometry(gl)

    gl.enableVertexAttribArray(vertexPosition)
    gl.enableVertexAttribArray(vertexColor)

    gl.useProgram(shaderProgram)

    gl.viewport(0,0,canvas.width, canvas.height)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
}



function outputValue(axis) {
    range = document.getElementById(`${axis}-range`)
    document.getElementById(`${axis}RangeValue`).innerHTML = range.value

}

window.onload = main()