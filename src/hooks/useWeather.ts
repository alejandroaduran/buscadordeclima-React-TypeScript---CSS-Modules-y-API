import axios from "axios"
import { set, z } from "zod"
//import { object, string, number, InferOutput, parse } from "valibot"
import { SearchType } from "../types"
import { useMemo, useState } from "react"

/* 
TYPEGUARD O ASSERTION
function isWeatherResponse(weather: unknown): weather is Weather {
    return (
        Boolean(weather) &&
        typeof weather === "object" &&
        typeof (weather as Weather).name === "string" &&
        //typeof (weather as Weather).main === "object" &&
        typeof (weather as Weather).main.temp === "number" &&
        typeof (weather as Weather).main.temp_min === "number" &&
        typeof (weather as Weather).main.temp_max === "number"
    )
} */

//ZOD schema
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_min: z.number(),
        temp_max: z.number()
    })
})

export type Weather = z.infer<typeof Weather>

//Valibot schema
/* const WeatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_min: number(),
        temp_max: number()
    })
})

type Weather = InferOutput<typeof WeatherSchema> */

const initialState = {
    name: "",
    main: {
        temp: 0,
        temp_min: 0,
        temp_max: 0
    }
}

export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState)

    const [loading, setLoading] = useState(false)

    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search: SearchType) => {
        // Fetch weather data from API
        //console.log('Fetching weather data...')
        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState)
        try {

            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            const { data } = await axios.get(geoUrl)

            //Comprobar si existe
            if(!data[0]) {
                console.log("No hay datos")
                setNotFound(true)
                return
            }

            const lat = data[0].lat
            const lon = data[0].lon

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            //Castear el type
            //const { data: weatherResult } = await axios<Weather>.get(weatherUrl)

            //type Guards
            //const { data: weatherResult } = await axios.get(weatherUrl)
            //const result = isWeatherResponse(weatherResult) ? weatherResult : null

            //ZOD
            const { data: weatherResult } = await axios.get(weatherUrl)
            const result = Weather.safeParse(weatherResult)
            if (result.success) {
                setWeather(result.data)
                setNotFound(false)
            }
            console.log(result)

            //Valibot
            /*          const { data: weatherResult } = await axios.get(weatherUrl)
                     const result = parse(WeatherSchema, weatherResult)
                     console.log(result) */


        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name !== "", [weather])

    return {
        weather,
        fetchWeather,
        hasWeatherData,
        loading,
        notFound
    }

}