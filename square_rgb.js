const DEFAULT_CANVAS_COLOR = [
    0.0,    // R
    0.0,    // G
    0.0,    // B
    1.0     // A
]

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

function main() {
    let canvas = document.getElementById("glCanvas")
    let gl = canvas.getContext("webgl2")

    if (!gl) {
        console.error("ERROR Unable to initial WebGL.")
        return
    }

    gl.clearColor(DEFAULT_CANVAS_COLOR[0], 
                DEFAULT_CANVAS_COLOR[1], 
                DEFAULT_CANVAS_COLOR[2], 
                DEFAULT_CANVAS_COLOR[3])

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // -----------------
    // Create Shader
    // -----------------
    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vsSource)
    gl.shaderSource(fragmentShader, fsSource)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader))
        return
    }

    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader))
        return
    }

    // ------------------
    // Create Program
    // ------------------
    let program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(program))
        return
    }

    // ------------------
    // Create Buffer
    // ------------------
    let vertices = [
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0
    ]

    let vertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, "aVertexPosition")
    let colorAttribLocation = gl.getAttribLocation(program, "aVertexColor")

    gl.vertexAttribPointer(
        positionAttribLocation,
        2,  // X Y
        gl.FLOAT,   // Data Type
        gl.FALSE,   // Normalize
        5 * Float32Array.BYTES_PER_ELEMENT, // X Y R G B
        0 * Float32Array.BYTES_PER_ELEMENT  // Offset
    )

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,  // R G B
        gl.FLOAT,   // Data Type
        gl.FALSE,   // Normalize
        5 * Float32Array.BYTES_PER_ELEMENT, // X Y R G B
        2 * Float32Array.BYTES_PER_ELEMENT  // Offset
    )

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation)

    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

}


window.onload = main()