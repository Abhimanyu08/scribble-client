import { createContext, useState} from "react";

const AlertContext = createContext();

export const AlertProvider = ({children}) => {

    const [alert, setAlert] = useState(null);

    const writeAlert = (text) => {

        setAlert(text);
        setTimeout(() => setAlert(null), 2000);
    }

    return (
        <AlertContext.Provider value={{alert, writeAlert}}>
            {children}
        </AlertContext.Provider>
    )
}

export default AlertContext