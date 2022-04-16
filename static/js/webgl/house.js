// -------------
// MAIN
// -------------
function main() {
    let canvas = document.getElementById("glCanvas-house")
    let gl = canvas.getContext("webgl2")

    if (!gl) {
        console.error("ERROR Unable to initial WebGL.")
        return
    }

    let vertexShader = initShader(gl, "vertex")
    let fragmentShader = initShader(gl, "fragment")
    let shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader)

    let vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition")
    let vertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor")

    initBuffer(gl)
    drawScene(gl, shaderProgram, vertexPosition, vertexColor)

}

// ---------------
// INIT SHADER
// ---------------
function initShader(gl, type){
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

    let shader = ""
    let shaderSource = ""

    if (type === "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER)
        shaderSource = vsSource
    }
    else if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER)
        shaderSource = fsSource
    }

    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`ERROR compiling ${type} shader`, gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return 
    }
    return shader
}

// -------------------------
// INIT SHADER PROGRAM
// -------------------------
function initShaderProgram(gl, vertexShader, fragmentShader) {
    let shaderProgram = gl.createProgram()

    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(shaderProgram))
        gl.deleteProgram(shaderProgram)
        return
    }
    return shaderProgram
}

// ---------------
// INIT BUFFER
// ---------------
function initBuffer(gl) {
    let divider = 0.5
    let vertices = [
    //         X            Y         R      G      B
         0.5*divider,  0.5*divider, 0.303, 0.297, 0.297,    // front
        -0.5*divider,  0.5*divider, 0.303, 0.297, 0.297,    // front
         0.5*divider, -0.5*divider, 0.303, 0.297, 0.297,    // front

        -0.5*divider,  0.5*divider, 0.303, 0.297, 0.297,    // front
        -0.5*divider, -0.5*divider, 0.303, 0.297, 0.297,    // front
         0.5*divider, -0.5*divider, 0.303, 0.297, 0.297,    // front

         0.0*divider,  1.0*divider, 0.165, 0.0, 0.0,        // front roof
        -0.5*divider,  0.5*divider, 0.165, 0.0, 0.0,        // front roof
         0.5*divider,  0.5*divider, 0.165, 0.0, 0.0,        // front roof

         0.5*divider,  0.5*divider, 0.5, 0.5, 0.5,          // side
         0.5*divider, -0.5*divider, 0.5, 0.5, 0.5,          // side
         1.5*divider, -0.5*divider, 0.5, 0.5, 0.5,          // side

         1.5*divider,  0.5*divider, 0.5, 0.5, 0.5,          // side
         0.5*divider,  0.5*divider, 0.5, 0.5, 0.5,          // side
         1.5*divider, -0.5*divider, 0.5, 0.5, 0.5,          // side

         1.0*divider,  1.0*divider, 0.378, 0.0, 0.0,        // back roof
         0.5*divider,  0.5*divider, 0.378, 0.0, 0.0,        // back roof
         1.5*divider,  0.5*divider, 0.378, 0.0, 0.0,        // back roof

         1.0*divider,  1.0*divider, 0.378, 0.0, 0.0,        // side roof
         0.0*divider,  1.0*divider, 0.378, 0.0, 0.0,        // side roof
         0.5*divider,  0.5*divider, 0.378, 0.0, 0.0         // side roof

    ]

    let vertexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(vertices),
        gl.STATIC_DRAW
    )

    return vertexBuffer
}

function drawScene(gl, shaderProgram, vertexPosition, vertexColor) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let positionComponents = 2      // X Y
    let positionType = gl.FLOAT
    let positionNormalize = gl.FALSE
    let positionStride = 5 * Float32Array.BYTES_PER_ELEMENT     // X Y R G B
    let positionOffset = 0 * Float32Array.BYTES_PER_ELEMENT 

    gl.vertexAttribPointer(
        vertexPosition,
        positionComponents,
        positionType,
        positionNormalize,
        positionStride,
        positionOffset
    )

    let colorComponents = 3      // R G B
    let colorType = gl.FLOAT
    let colorNormalize = gl.FALSE
    let colorStride = 5 * Float32Array.BYTES_PER_ELEMENT     // X Y R G B
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
    const drawVertexCount = 21

    gl.drawArrays(gl.TRIANGLES, drawOffset, drawVertexCount)

}

window.onload = main()