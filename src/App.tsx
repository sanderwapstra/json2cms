import { useEffect, useState } from 'react';
import './App.css';
import Dropzone from './Dropzone';

function App() {
    const [data, setData] = useState<JSON | undefined>(undefined);

    const handleDataLoaded = (data: JSON) => {
        setData(data);
    };

    const renderMenu = (data: JSON) => {
        const renderMenuItem = (data: JSON) => (
            <ul>
                {Object.keys(data).map(key => {
                    console.log(`key`, key);
                    console.log(`typeof key`, typeof data[key]);

                    if (typeof data[key] === 'object') {
                        console.log('keep going');
                        return (
                            <>
                                <li>{key}</li>
                                <ul>{renderMenuItem(data[key])}</ul>
                            </>
                        );
                    } else {
                        console.log('these are the fields');
                        return null;
                    }
                })}
            </ul>
        );

        return renderMenuItem(data);
    };

    return (
        <div className="App">
            {!data ? (
                <Dropzone onDataLoaded={handleDataLoaded} />
            ) : (
                <div>
                    {renderMenu(data)}
                    <div>Data loaded</div>
                </div>
            )}
        </div>
    );
}

export default App;
