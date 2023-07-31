const express =required ('express')
const app =  express()
const port = 3001

app.get('/',  (reg,res) => {
    res.send({data : 'hola mundo'})
} )
app.listen(port ,()=> {console.log ('la aplicacion esta en linea');n
})