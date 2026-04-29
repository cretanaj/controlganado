const express = require('express')
const bodyParser = require('body-parser')
const csv = require('fast-csv')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const mysql = require('mysql')
const { error } = require('console')
const { url } = require('inspector')
const app = express()
app.listen()

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

// multer config

let storage = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,"./uploads/")
    },
    filename:(req,file,callback) => {
        callback(null,file.filename + "-" + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({
    storage:storage
})

// create the connection

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: 3306,
    database: 'ganadodb'
})

app.get('/',(req,res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post('/import-csv',upload.single('file'),(req,res) => {
    console.log(req.file.path)
    uploadCsv(__dirname + "/uploads/" + req.file.filename)
    res.send("Records imported!!!")
})

function uploadCsv (path){
    let stream = fs.createReadStream(path)
    let csvDataColl = []
    let fileStream = csv
    .parse()
    .on('data',function(data){
        csvDataColl.push(data)
    })
    .on('end',function(){
        csvDataColl.shift()

        pool.getConnection((error,connection) => {
            if(error){
                console.log(error)
            }
            else{
                /*let query = "INSERT INTO pesaje (idAnimal,pesoKg) VALUES ?"*/
                let query = "CALL _SP_insert_animal ?"
                connection.query(query,[csvDataColl],(error,res) => {
                    console.log(query,[csvDataColl])
                })
            }
        })

        fs.unlinkSync(path)
    })

    stream.pipe(fileStream)
}

app.listen(3000,() => {
    console.log("Aqui vamos go go go")
})