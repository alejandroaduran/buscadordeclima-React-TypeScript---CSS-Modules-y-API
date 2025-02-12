import { countries } from "../../data/countries";
import styles from "./Form.module.css";

export default function Form() {
    return (
        <form action="" className={styles.form}>
            <div className={styles.field}>
                <label htmlFor="city">Ciudad: </label>
                <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Ej. Buenos Aires"
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="pais">País: </label>
                <select name="" id="">
                    <option value="">-- Seleccione un País --</option>
                    {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name}</option>
                    ))}
                </select>
            </div>

            <input type="submit" value="Consultar clima" />
        </form>
    )
}
