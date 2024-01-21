// HINTS:
// 1. Import express and axios
import axios from "axios"
import express from "express"

// 2. Create an express app and set the port number.
const app = express();
const port = 3000
let data = {}
app.use(express.static("public"))
app.use(express.urlencoded({ extended:true }));
const apiKeyToken = "335f906b6f3ca1dc2e76ead63f1e1093"
app.get("/",async (req,res)=>{
    res.render("index.ejs")
})
app.post("/submit",async (req,res)=>{
    let city = req.body.city
    try{
        const response1 = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`,{
            params:{
                apiKey:`${apiKeyToken}`,
                q:`${city}`
            }
        })
        const obj = (response1.data)[0];
        let latitude = obj.lat;
        let longitude = obj.lon;
        const response2 = await axios.get(`https://api.openweathermap.org/data/2.5/weather`,{
            params:{
                appid:`${apiKeyToken}`,
                lat:`${latitude}`,
                lon:`${longitude}`,
            }
        })
        let weather = response2.data.weather[0].description;
        let temperature = Math.floor(parseFloat(response2.data.main.temp)-273.15);
        res.render("index.ejs",{
            temperature:temperature,
            weather:weather
        })
        
    }catch(error){
        res.send(error.message);
    }
})
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})