const INIT_TRIAGLE_MATRIX = {
    p1: {
        x: 0.0,
        y: 0.5,
        r: 1.0,
        g: 0.0,
        b: 0.0
    },
    p2: {
        x: -0.5,
        y: -0.5,
        r: 0.0,
        g: 1.0,
        b: 0.0
    },
    p3: {
        x: 0.5,
        y: -0.5,
        r: 0.0,
        g: 0.0,
        b: 1.0
    }
}

function initSquareComponentTable() {
    let headers = ["Point", "X", "Y", "R", "G", "B"]
    
    let table = document.getElementById('componentTable')

    let headerTR = document.createElement("TR")
    table.appendChild(headerTR)

    for (let header of headers) {
        let th = document.createElement('TH')
        th.innerHTML = header
        headerTR.appendChild(th)
    }

    let valTR = document.createElement("TR")
    table.appendChild(valTR)

    let squarePoints = 3   // square -> 2 triangles

    for (let i=0; i<squarePoints; i++) {
        let pointTR = document.createElement("TR")
        pointTR.innerHTML = `P${i+1}`
        table.appendChild(pointTR)

        for (let elem of headers.slice(1)) {
            let elemTD = document.createElement("TD")
            pointTR.appendChild(elemTD)

            let elemInput = document.createElement("input")
            elemTD.appendChild(elemInput)

        }
    }

    
}

window.onload = initSquareComponentTable()