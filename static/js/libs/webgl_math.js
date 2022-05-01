var m3 = {
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