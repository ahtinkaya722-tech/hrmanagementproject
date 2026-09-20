import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";

const DepartmentsNetSalaryPieChart = () => {
    const TOKEN = localStorage.getItem("token");
    const [data, setData] = useState({
        departmentNameAndSalary: [],
        totalNetSalary: 0,
    });
    const formatMoney = (value) => {
        return new Intl.NumberFormat("en-US").format(value);
    }
    const chartData = [
        ["Department", "Net Salary"],
        ...data.departmentNameAndSalary.map((dept) => [dept.name, dept.netSalary]),
    ];


    const BarChartData = [
        ["Department", "Net Salary"],
        ...data.departmentNameAndSalary.map((dept) => [dept.name, dept.netSalary]),
        ["TOTAL", data.totalNetSalary],

    ];
    const options = {
        title: "Each Net Salary By Departments",
        pieHole: 0.4,
        is3D: true,

        pieStartAngle: 100, // Rotates the chart
        sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
        legend: {
            position: "bottom",
            alignment: "center",
            textStyle: {
                color: "#233238",
                fontSize: 14,
            },
        },
        colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A", "#D1C28A"],
    };
    const options_barChart={

        
                        title: "Department Salary vs Total Salary",
                    
                        legend: { position: "none" },
                        colors: ["#42A5F5"],
                        hAxis: {
                            title: "Salary (Ks)",
                        },
                        vAxis: {
                            title: "Department",
                        },
                    
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api2/AllDepartmentsData",
    {
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    }
            );
            console.log(res.data);
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="grid grid-cols-4 mt-2 animate-fade-in">
            {data?.departmentNameAndSalary?.length > 0 ? (

                <div className="col-span-2">
                    <Chart
                        chartType="PieChart"
                        data={chartData}
                        options={options}
                        width={"100%"}
                        height={"400px"}
                    />
                </div>

            ) : (<h1>Data is not available</h1>)
            }
            <div className=" col-span-2 ">
                <Chart
                    chartType="BarChart"
                    data={BarChartData}
                    options={options_barChart}
                    width="100%"
                    height="400px"
                />

            </div>

        </div>
    );
};

export default DepartmentsNetSalaryPieChart;
