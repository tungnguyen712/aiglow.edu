import PropTypes from "prop-types";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts";

const RenderChart = ({ apiResponse }) => {
    const { data, kind_of_chart } = apiResponse || {};

    const sanitizedLabels = Array.isArray(data?.labels) ? data.labels : [];
    const sanitizedValues = Array.isArray(data?.values) ? data.values : [];

    const formattedData =
        sanitizedLabels.map((label, index) => ({
            name: label,
            value: sanitizedValues[index] ?? 0,
        })) || [];


    const renderTable = () => {
        if (sanitizedLabels.length === 0 || sanitizedValues.length === 0) {
            return <p>No data available</p>;
        }

        return (
            <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left uppercase">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left uppercase">Value</th>
                </tr>
                </thead>
                <tbody>
                {formattedData.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const renderChartByType = () => {
        if (!kind_of_chart || typeof kind_of_chart !== "string") {
            return <p>No valid chart type provided</p>;
        }

        if (formattedData.length === 0) {
            return <p>No data available for the chart</p>;
        }

        if (kind_of_chart.includes("bar")) {
            return (
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            );
        } else if (kind_of_chart.includes("line")) {
            return (
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
            );
        } else if (kind_of_chart.includes("pie")) {
            return (
                <PieChart>
                    <Pie
                        data={formattedData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={["#8884d8", "#82ca9d", "#ffc658", "#d0ed57"][index % 4]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            );
        } else if (kind_of_chart.includes("area")) {
            return (
                <AreaChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            );
        } else if (kind_of_chart.includes("radar")) {
            return (
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar
                        name="Value"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                    <Legend />
                </RadarChart>
            );
        } else if (kind_of_chart.includes("table")) {
            return renderTable();
        } else {
            return null;
        }
    };

    return (
        <ResponsiveContainer width="100%" height={kind_of_chart === "table" ? undefined : 300}>
            {apiResponse ? renderChartByType() : <p>Loading chart...</p>}
        </ResponsiveContainer>
    );
};

RenderChart.propTypes = {
    apiResponse: PropTypes.shape({
        data: PropTypes.shape({
            labels: PropTypes.arrayOf(PropTypes.string),
            values: PropTypes.arrayOf(PropTypes.number),
        }),
        kind_of_chart: PropTypes.string,
        natural_language: PropTypes.string,
        sql_query: PropTypes.string,
    }).isRequired,
};

export default RenderChart;
