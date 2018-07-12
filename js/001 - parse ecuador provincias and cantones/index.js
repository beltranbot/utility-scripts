let fs = require('fs')
const path = require('path')

const input = fs.readFileSync(path.join(__dirname, './data.txt'), {
    encoding: 'utf-8'
})

function isIncluded (arr, j, line) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][j] == line[j]) return true
    }
    return false
}

function provincias (data) {
    let provincias = []

    for (let i = 0; i < data.length; i++) {
        let line = data[i].split('\t')
        if (!isIncluded(provincias, 0, line)) {
            provincias.push([
                line[0],
                line[1],
            ])
        }
    }

    let output = ""

    output += `<?xml version="1.0"?>` + '\n'
    output += `<openerp>` + '\n'
    output += '    <data noupdate="0">'

    for (let provincia of provincias) {
        output += `
        <record model="kumbal_divipoli_co.departamento"
            id="kumbal_divipoli_co_departamento_ecuador_${provincia[0]}">
            <field name="pais_id"
                ref="kumbal_divipoli_co_pais_2"/>
            <field name="nombre">${provincia[1]}</field>
            <field name="codigo_dane">${provincia[0]}</field>
        </record>` + '\n'
    }

    output += '    </data>' + '\n'
    output += '</openerp>'

    fs.writeFile(path.join(__dirname, 'provincias.xml'), output, function (err) {
        if (err) return console.log(err)
        console.log("finished provincias")
    })
}

function cantones (data) {
    let provincias = []

    for (let i = 0; i < data.length; i++) {
        let line = data[i].split('\t')
        if (!isIncluded(provincias, 2, line)) {
            provincias.push([
                line[0],
                line[1],
                line[2],
                line[3],
            ])
        }
    }

    let output = ""

    output += `<?xml version="1.0"?>` + '\n'
    output += `<openerp>` + '\n'
    output += '    <data noupdate="0">'

    for (let provincia of provincias) {
        output += `
        <record model="kumbal_divipoli_co.ciudad"
            id="kumbal_ciudad_ecuador_${provincia[2]}">
            <field name="departamento_id"
                ref="kumbal_divipoli_co_departamento_ecuador_${provincia[0]}"/>
            <field name="nombre">${provincia[3]}</field>
            <field name="codigo_dane">${provincia[2]}</field>
        </record>` + '\n'
    }

    output += '    </data>' + '\n'
    output += '</openerp>'

    fs.writeFile(path.join(__dirname, 'cantones.xml'), output, function (err) {
        if (err) return console.log(err)
        console.log("finished cantones")
    })
}

function solve (data) {
    data = data.split('\n')

    provincias(data)
    cantones(data)
}

function main (data) {
    console.time('solve()')
    let sol = solve(data)
    console.timeEnd('solve()')
}

main(input)