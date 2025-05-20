import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import date adapter
import './Css/Modal.css'
ChartJS.register(...registerables);

const fetchData = async () => {
    try {
        const layer = new FeatureLayer({
            url: 'https://tfsgis-dfe02.tfs.tamu.edu/arcgis/rest/services/DroughtAnalysis/DroughtAnalysis/MapServer/1',
        });

        const query = new Query({
            where: '1=1',
            returnGeometry: false,
            outFields: ['*'],
        });

        const results = await layer.queryFeatures(query);

        const data = {
            labels: [],
            datasets: [
                { label: 'Exceptional Drought', data: [], backgroundColor: 'rgba(139, 0, 0, 0.5)', borderColor: 'rgba(139, 0, 0, 1)', fill: 'origin' },
                { label: 'Extreme Drought', data: [], backgroundColor: 'rgba(255, 69, 0, 0.5)', borderColor: 'rgba(255, 69, 0, 1)', fill: 'origin' },
                { label: 'Severe Drought', data: [], backgroundColor: 'rgba(255, 140, 0, 0.5)', borderColor: 'rgba(255, 140, 0, 1)', fill: 'origin' },
                { label: 'Moderate Drought', data: [], backgroundColor: 'rgba(255, 215, 0, 0.5)', borderColor: 'rgba(255, 215, 0, 1)', fill: 'origin' },
                { label: 'Abnormally Dry', data: [], backgroundColor: 'rgba(255, 255, 0, 0.5)', borderColor: 'rgba(255, 255, 0, 1)', fill: 'origin' },
            ]
        };

        results.features.forEach((feature) => {
            const date = new Date(feature.attributes.Date);
            const dateString = date.toISOString(); // ISO string for time scale
            if (!data.labels.includes(dateString)) {
                data.labels.push(dateString);
            }
            switch (feature.attributes.DM) {
                case 0: data.datasets[4].data.push(feature.attributes.AllPct); break;
                case 1: data.datasets[3].data.push(feature.attributes.AllPct); break;
                case 2: data.datasets[2].data.push(feature.attributes.AllPct); break;
                case 3: data.datasets[1].data.push(feature.attributes.AllPct); break;
                case 4: data.datasets[0].data.push(feature.attributes.AllPct); break;
                default: break;
            }
        });

        // Ensure the datasets have the same length as labels
        data.datasets.forEach(dataset => {
            while (dataset.data.length < data.labels.length) {
                dataset.data.push(null);
            }
        });

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { labels: [], datasets: [] }; // Return empty data in case of error
    }
};

const options = {
    scales: {
        x: {
            stacked: true,
            type: 'time',
            time: { unit: 'month' },
            title: { display: true, text: 'Date' }
        },
        y: {
            stacked: true,
            beginAtZero: true,
            title: { display: true, text: 'Percent of Forestland' },
            ticks: { callback: (value) => value + '%' }
        }
    },
    pan: { enabled: true, mode: "x" },
    zoom: { enabled: true, mode: "x", sensitivity: 0.5 }
};

function Histogram({ isOpen, onClose }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const getData = async () => {
            const data = await fetchData();
            console.log('Fetched data:', data); // Debugging line
            setChartData(data);
        };
        getData();
    }, []);

    useEffect(() => {
        // Clean up the chart on component unmount or when the data changes
        return () => {
            const chartInstance = ChartJS.instances[0];
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [chartData]);

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Histogram" ariaHideApp={false}>
            <div>
                <h2>Area of forestland by dryness/drought condition over time</h2>
                {chartData && chartData.labels && chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
}

Histogram.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Histogram;