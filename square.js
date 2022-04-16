const DEFUALT_CANVAS_COLOR = [
    0.0,    // R
    0.0,    // G
    0.0,    // B
    1.0     // A
]

const DEFAULT_VERTICES = ` 0.5,    0.5,  1.0, 0.0, 0.0, 
-0.5,    0.5,  0.0, 1.0, 0.0,
-0.5,   -0.5,  0.0, 0.0, 1.0,

 0.5,    0.5,  1.0, 0.0, 0.0, 
-0.5,   -0.5,  0.0, 1.0, 0.0,
 0.5,   -0.5,  0.0, 0.0, 1.0
`
const MATRIX_TEXTAREA = document.getElementById('matrixTextarea')
MATRIX_TEXTAREA.value = DEFAULT_VERTICES

const vsSource = `
    precision mediump float;

    attribute   vec2 aVertexPosition;
    attribute   vec3 aVertexColor;
    varying     vec3 aFragmentColor;

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

function changeInput() {
    main(MATRIX_TEXTAREA.value)
}

function main(vertices) {
    let canvas = document.getElementById("glCanvas")
    let gl = canvas.getContext("webgl2")

    if (!gl) {
        console.error("Unable to initialize WebGL.")
        return
    }


    gl.clearColor(DEFUALT_CANVAS_COLOR[0], 
                DEFUALT_CANVAS_COLOR[1], 
                DEFUALT_CANVAS_COLOR[2], 
                DEFUALT_CANVAS_COLOR[3])

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // -----------------------
    // Create Shader 
    // -----------------------
    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vsSource)
    gl.shaderSource(fragmentShader, fsSource)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
        return 
    }

    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
        return
    }

    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program))
        return
    }

    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program))
        return
    }

    // ------------------
    // Create Buffer 
    // ------------------
    let paresVertices = []

    for (let each of vertices.split(',')) {
        paresVertices.push(each.trim())
    }

    let vertexBufferObject = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(paresVertices), gl.STATIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, 'aVertexPosition')
    let colorAttribLocation = gl.getAttribLocation(program, 'aVertexColor')

    let dimension       = 2
    let triagleCount    = 2
    let colorLen        = 9 * triagleCount

    gl.vertexAttribPointer(
        positionAttribLocation,
        dimension,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    )

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    )

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation)

    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, (paresVertices.length-colorLen)/dimension)

}


window.onload = main(DEFAULT_VERTICES)