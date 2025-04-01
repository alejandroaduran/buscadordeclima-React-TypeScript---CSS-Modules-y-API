export const formatTemperature = (temp: number) : number=> {
    const kelvin = 273.15
    return parseFloat((temp - kelvin).toFixed(1))
}