import dynamic from 'next/dynamic';
export const Plotly = dynamic(() => import('react-plotly.js'), { ssr: false });
import { Button } from "@heroui/button";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from "@heroui/dropdown";
import { DateRangePicker } from "@heroui/react";
import { useEffect, useState } from 'react';
import { collect } from "collect.js";


const Chart = () => {
    type DataSet = {
        dates: Array<Date>;
        values: Array<number>;
        days: Array<Date>;
        hours: Array<Date>;
    }

    type SensorList = {
        Sensor_ID: Array<number>;
        Sensor_Description: Array<string>;
    }

    type BoardList = {
        Board_ID: Array<string>;
        Board_Description: Array<string>;
    }



    const [dataset, setDataset] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [dataset2, setDataset2] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [dataset3, setDataset3] = useState<DataSet>({
        dates: [],
        values: [],
        days: [],
        hours: [],
    });

    const [value, setValue] = useState("500");

    const [sensor, setSensor] = useState("2");
    const [board, setBoard] = useState("0xa8610a34362d800f");

    const [sensor2, setSensor2] = useState<string | null>(null);
    const [board2, setBoard2] = useState<string | null>(null);

    const [sensor3, setSensor3] = useState<string | null>(null);
    const [board3, setBoard3] = useState<string | null>(null);


    const [chartType, setChartType] = useState(1);

    console.log(board);
    const [sensorList, setSensorList] = useState<SensorList>({
        Sensor_ID: [],
        Sensor_Description: [],
    })

    const [boardList, setBoardList] = useState<BoardList>({
        Board_ID: [],
        Board_Description: [],
    })


    useEffect(() => {
        const fetchData = async () => {
            try {

                const [response, response2, response3, sensorResponse, boardResponse] = await Promise.all([
                    fetch(`/api/hourly/${value}/${sensor}`),
                    fetch(`/api/hourly/${value}/${sensor2}`),
                    fetch(`/api/hourly/${value}/${sensor3}`),
                    fetch(`/api/sensors`),
                    fetch(`/api/boards`)

                ]);
                const data = await response.json();
                const data2 = await response2.json();
                const data3 = await response3.json();
                const sensorsData = await sensorResponse.json();
                const boardsData = await boardResponse.json();

                data.reverse();


                const hours = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values = data.map((data: { Average_Reading: number }) => data.Average_Reading);
                const days = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates = data.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

                const hours2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values2 = data2.map((data: { Average_Reading: number }) => data.Average_Reading);
                const days2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates2 = data2.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

                const hours3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/Chicago"
                }));
                const values3 = data3.map((data: { Average_Reading: number }) => data.Average_Reading);
                const days3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp).toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "America/Chicago"
                }));

                const dates3 = data3.map((data: { Hourly_Timestamp: string }) => new Date(data.Hourly_Timestamp));

                console.log(hours3);
                console.log(values3);
                console.log(dates3);

                setDataset({
                    dates: dates,
                    values: values,
                    days: days,
                    hours: hours,
                });

                setDataset2({
                    dates: dates2,
                    values: values2,
                    days: days2,
                    hours: hours2,
                });

                setDataset3({
                    dates: dates3,
                    values: values3,
                    days: days3,
                    hours: hours3,
                });


                setSensorList({
                    Sensor_ID: sensorsData.map((sensorsData: { Sensor_ID: number }) => sensorsData.Sensor_ID),
                    Sensor_Description: sensorsData.map((sensorsData: { Sensor_Description: number }) => sensorsData.Sensor_Description),
                });
                setBoardList({
                    Board_ID: boardsData.map((boardsData: { Board_ID: number }) => boardsData.Board_ID),
                    Board_Description: boardsData.map((boardsData: { Board_Description: number }) => boardsData.Board_Description),
                });

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [value, sensor, board, sensor2, board2, sensor3, board3]);

    function createCart() {
        switch (chartType) {
            case 1:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers' },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false
                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );

            case 2:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'markers' },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'markers' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'markers' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false
                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );

            case 3:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'bar' },
                        { x: dataset2.dates, y: dataset2.values, type: 'bar' },
                        { x: dataset3.dates, y: dataset3.values, type: 'bar' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false
                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );


            case 4:
                return (
                    <Plotly
                        data={[{ x: dataset.days, y: dataset.hours, z: dataset.values, type: 'heatmap' }]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false
                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                );
            default:
                return (
                    <Plotly
                        data={[{ x: dataset.dates, y: dataset.values, type: 'scatter', mode: 'lines+markers' },
                        { x: dataset2.dates, y: dataset2.values, type: 'scatter', mode: 'lines+markers' },
                        { x: dataset3.dates, y: dataset3.values, type: 'scatter', mode: 'lines+markers' }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false
                        }}
                        config={{ displayModeBar: false, scrollZoom: true, responsive: true }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}

                    />
                );
        }
    }

    return (
        <div className="w-full h-full grid gap-2 p-2 lg:grid-cols-4 md:grid-cols-2 lg:grid-rows-[0.75fr_2fr_0.25fr] md:grid-rows-[0.75fr_0.75fr_2fr_0.5fr]">
            <div className="h-full bg-slate-100 shadow-sm rounded-md">
                <div className="p-3">
                    <h1 className="text-center text-xl font-semibold font-mono">Time</h1>
                    <div className="grid grid-cols-3 gap-2">
                        <Button onPress={() => setValue("24")} className="shadow-sm" color="primary" radius="sm">Past Day</Button>
                        <Button onPress={() => setValue("168")} className="shadow-sm" color="primary" radius="sm">Past Week</Button>
                        <Button onPress={() => setValue("744")} className="shadow-sm" color="primary" radius="sm">Past Month</Button>
                        <div className="col-span-3">
                            <DateRangePicker className="flex items-center justify-center h-full" label="Custom" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 h-full col-span-2 bg-slate-100 shadow-sm rounded-md flex-grow">
                <h1 className="text-center text-xl font-semibold font-mono">Sensors</h1>
                <div className="p-3 grid flex-grow gap-2 grid-cols-[0.5fr_2fr_2fr_0.05fr]">
                    <h1>Sensor 1: </h1>
                    <div>
                        <Dropdown >
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {board ? boardList.Board_Description[boardList.Board_ID.indexOf(board)] : "Tank Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setBoard(key.toString())}>
                                {boardList.Board_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{boardList.Board_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="col-span-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {sensor ? sensorList.Sensor_Description[Number(sensor) - 1] : "Sensor Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setSensor(key.toString())}>
                                {sensorList.Sensor_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{sensorList.Sensor_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>


                    <h1>Sensor 2: </h1>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {board2 ? boardList.Board_Description[boardList.Board_ID.indexOf(board2)] : "Tank Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setBoard2(key.toString())}>
                                {boardList.Board_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{boardList.Board_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {sensor2 ? sensorList.Sensor_Description[Number(sensor2) - 1] : "Sensor Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setSensor2(key.toString())}>
                                {sensorList.Sensor_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{sensorList.Sensor_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div>
                        <Button onPress={() => [setSensor2(null), setBoard2(null)]} className="shadow-sm" color="danger" radius="sm" size="sm">Clear</Button>
                    </div>

                    <h1>Sensor 3: </h1>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {board3 ? boardList.Board_Description[boardList.Board_ID.indexOf(board3)] : "Tank Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setBoard3(key.toString())}>
                                {boardList.Board_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{boardList.Board_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="shadow-sm w-full" radius="sm" variant="bordered" size="sm">
                                    {sensor3 ? sensorList.Sensor_Description[Number(sensor3) - 1] : "Sensor Selection"}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu onAction={(key) => setSensor3(key.toString())}>
                                {sensorList.Sensor_ID.map((id, index) => (
                                    <DropdownItem key={id.toString()}>{sensorList.Sensor_Description[index]}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div>
                        <Button onPress={() => [setSensor3(null), setBoard3(null)]} className="shadow-sm" color="danger" radius="sm" size="sm">Clear</Button>
                    </div>
                </div>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Chart Type</h1>
                <div className="p-3">

                    <div className="grid grid-cols-2 gap-2">
                        <Button onPress={() => setChartType(1)} className="shadow-sm" color="primary" radius="sm">Line Chart</Button>
                        <Button onPress={() => setChartType(2)} className="shadow-sm" color="primary" radius="sm">Scatter Plot</Button>
                        <Button onPress={() => setChartType(3)} className="shadow-sm" color="primary" radius="sm">Bar Chart</Button>
                        <Button onPress={() => setChartType(4)} className="shadow-sm" color="primary" radius="sm">Heatmap</Button>
                    </div>
                </div>
            </div>

            <div className="row-span-2 col-span-1 p-4 h-full  bg-slate-100 shadow-sm rounded-md lg:col-span-3 md:col-span-2 flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Chart</h1>
                <div className="flex-grow w-full h-0">

                    {createCart()}
                </div>
            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md flex flex-col">
                <h1 className="text-center text-xl font-semibold font-mono">Stats</h1>

                <div className="grid grid-cols-3">
                    <div className="text-center">
                        <h1>Average: {collect(dataset.values.filter(value => value !== null)).average().toFixed(2)}</h1>
                        <h1>Min: {collect(dataset.values.filter(value => value !== null)).min().toFixed(2)}</h1>
                        <h1>Max: {collect(dataset.values.filter(value => value !== null)).max().toFixed(2)}</h1>
                        <h1>Median: {collect(dataset.values.filter(value => value !== null)).median().toFixed(2)}</h1>
                    </div>
                    {sensor2 && (<div className="text-center">
                        <h1>Average: {collect(dataset2.values.filter(value => value !== null)).average().toFixed(2)}</h1>
                        <h1>Min: {collect(dataset2.values.filter(value => value !== null)).min().toFixed(2)}</h1>
                        <h1>Max: {collect(dataset2.values.filter(value => value !== null)).max().toFixed(2)}</h1>
                        <h1>Median: {collect(dataset2.values.filter(value => value !== null)).median().toFixed(2)}</h1>
                    </div>)}

                     {sensor3 && (<div className="text-center">
                        <h1>Average: {collect(dataset3.values.filter(value => value !== null)).average().toFixed(2)}</h1>
                        <h1>Min: {collect(dataset3.values.filter(value => value !== null)).min().toFixed(2)}</h1>
                        <h1>Max: {collect(dataset3.values.filter(value => value !== null)).max().toFixed(2)}</h1>
                        <h1>Median: {collect(dataset3.values.filter(value => value !== null)).median().toFixed(2)}</h1>
                    </div>)}

                </div>
                <div className="flex-grow w-full h-0">

                    <Plotly
                        data={[{ y: dataset.values, type: 'box', name: " " },
                        { y: dataset2.values, type: 'box',  name: "  " },
                        { y: dataset3.values, type: 'box',  name: "   " }
                        ]}
                        layout={{
                            autosize: true,
                            margin: { t: 20, l: 40, r: 20, b: 40 },
                            xaxis: { automargin: true },
                            yaxis: { automargin: true },
                            paper_bgcolor: '#f1f5f9',
                            plot_bgcolor: '#f1f5f9',
                            showlegend: false,
                        }}
                        config={{ scrollZoom: true, responsive: true, displayModeBar: false }}
                        useResizeHandler={true}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>

            </div>
            <div className="p-4 h-full bg-slate-100 shadow-sm rounded-md">
                <h1 className="text-center text-xl font-semibold font-mono">Downloads</h1>
                <div className="flex gap-4 p-4 justify-center">
                    <Button color="primary" radius="sm">Download</Button>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="shadow-sm w-full" radius="sm" variant="bordered" >Download Format</Button>
                        </DropdownTrigger>
                        <DropdownMenu className="shadow-sm">
                            <DropdownItem key="PDF">PDF</DropdownItem>
                            <DropdownItem key="PNG">PNG</DropdownItem>
                            <DropdownItem key="CSV">CSV</DropdownItem>
                            <DropdownItem key="JSON">JSON</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

        </div>
    );
}

export default Chart;