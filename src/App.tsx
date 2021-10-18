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
import './assets/css/App.css';
import Dropzone from './Dropzone';
import _ from 'lodash';
import { exportToJsonFile } from './utils/exportToJsonFile';
import dayjs from 'dayjs';
import { ReactComponent as DownloadIcon } from './assets/svg/download.svg';

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
                        <div key={index} className="formRow">
                            <label className="formLabel">{key}</label>
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

    const renderInput = (key: string, value: string) => {
        return (
            <input
                className="formControl"
                type="text"
                value={value}
                onChange={e => handleChange(key, e.target.value)}
            />
        );
    };

    return (
        <div className="App">
            <div className="header">
                <h1>json2cms</h1>
            </div>
            <div className="container">
                {!data ? (
                    <>
                        <Dropzone onDataLoaded={handleDataLoaded} />
                    </>
                ) : (
                    <div className="accordion__container">
                        {renderMenu(data)}
                        <button className="download" onClick={handleDownload}>
                            Download <DownloadIcon className="downloadIcon" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
