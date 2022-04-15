const DEFUALT_CANVAS_COLOR = [
    0.0,    // R 
    0.0,    // G
    0.0,    // B
    1.0     // A
]

const DEFAULT_VERTICES = ` 0.0,    0.5,   1.0,    0.0,    0.0, 
-0.5,   -0.5,   0.0,    1.0,    0.0, 
 0.5,   -0.5,   0.0,    0.0,    1.0`

let MATRIX_TEXTAREA = document.getElementById("matrixTextarea")
MATRIX_TEXTAREA.value = DEFAULT_VERTICES

const vsSource = `
    precision mediump float;

    attribute vec2 vtxPosition;
    attribute vec3 vtxColor;        // create for fragment color
    varying vec3 fragColor;         // connecting to fragment

    void main() {
        fragColor   = vtxColor;     // assign color to fragment
        gl_Position = vec4(vtxPosition, 0.0, 1.0);
    }
`
const fsSource = `
    precision mediump float;

    varying vec3 fragColor;     // create for fragment color share with vertex color
    
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`

//
// Change Matrix value
//
function dataMatrix() {
    main(MATRIX_TEXTAREA.value)
}


//
// Main
//
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

    // --------------------------
    // Create Shader
    // --------------------------
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vsSource)
    gl.shaderSource(fragmentShader, fsSource)

    // Compile Shader
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

    // ----------------------
    // Create Program
    // ----------------------
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

    // ---------------------
    // Create Buffer
    // ---------------------
    let parsedVertices = []

    for (let each of vertices.split(',')) {
        parsedVertices.push(each.trim())
    }

    let triangleVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedVertices), gl.STATIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, 'vtxPosition')
    let colorAttribLocation = gl.getAttribLocation(program, 'vtxColor')

    //
    // Vertex Position
    //
    gl.vertexAttribPointer(
        positionAttribLocation,     // Attribute location
        2,                          // Number of elements per attribute (X,Y)
        gl.FLOAT,                   // Type of elements
        gl.FALSE,                   // normalize
        5 * Float32Array.BYTES_PER_ELEMENT,     // Size of an individual vertex (X,Y,R,G,B)
        0                           // offset from the beginning of a single vertex of this attribute
    )
    
    //
    // vertex and fragment color
    //
    gl.vertexAttribPointer(
        colorAttribLocation,        // Attribute location
        3,                          // Number of elements per attribute (R,G,B)
        gl.FLOAT,                   // Type of elements
        gl.FALSE,                   // normalize
        5 * Float32Array.BYTES_PER_ELEMENT,     // Size of an individual vertex (X,Y,R,G,B)
        2 * Float32Array.BYTES_PER_ELEMENT      // offset from the beginning of a single vertex of this attribute
    )

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation)

    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}

window.onload = main(DEFAULT_VERTICES)