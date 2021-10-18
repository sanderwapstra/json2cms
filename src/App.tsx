import { useCallback, useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { useImmer } from 'use-immer';
import './App.css';
import Dropzone from './Dropzone';
import _ from 'lodash';
import { exportToJsonFile } from './utils/exportToJsonFile';
import dayjs from 'dayjs';

function App() {
    const [fileName, setFileName] = useState<string | undefined>(undefined);
    const [data, setData] = useImmer<Record<string, any> | undefined>(
        undefined
    );

    const handleDataLoaded = (fileName: string, data: Record<string, any>) => {
        setFileName(fileName);
        setData(data);
    };

    const handleChange = useCallback(
        (key: string, value: string) => {
            setData(draft => {
                if (draft) {
                    _.set(draft, key, value);
                }
            });
        },
        [setData]
    );

    const renderInput = (key: string, value: string) => {
        return (
            <input
                type="text"
                value={value}
                onChange={e => handleChange(key, e.target.value)}
            />
        );
    };

    const handleDownload = () => {
        if (data) {
            exportToJsonFile(
                `${dayjs().format('YYYY-MM-DD')}_${fileName}`,
                data
            );
        }
    };

    const renderMenu = (data: Record<string, any>) => {
        const renderMenuItem = (data: Record<string, any>, tree: string) =>
            Object.keys(data).map((key, index) => {
                if (typeof data[key] !== 'string') {
                    return (
                        <Accordion
                            key={index}
                            allowMultipleExpanded
                            allowZeroExpanded
                        >
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        {key}
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    {renderMenuItem(
                                        data[key],
                                        tree ? `${tree}.${key}` : key
                                    )}
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    );
                } else {
                    return (
                        <div key={index}>
                            <label>{key}</label>
                            {renderInput(
                                tree ? `${tree}.${key}` : key,
                                data[key]
                            )}
                        </div>
                    );
                }
            });

        return renderMenuItem(data, '');
    };

    return (
        <div className="App">
            {!data ? (
                <>
                    <Dropzone onDataLoaded={handleDataLoaded} />
                </>
            ) : (
                <div>
                    {renderMenu(data)}
                    <button className="download" onClick={handleDownload}>
                        Download
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
