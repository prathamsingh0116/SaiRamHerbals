const monthLabels = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
];

// =======================
// Revenue Chart
// =======================

const revenueValues = new Array(12).fill(0);

if (window.revenueChartData) {

    window.revenueChartData.forEach(item => {

        revenueValues[item._id.month - 1] = item.revenue;

    });

}

const revenueCanvas = document.getElementById("revenueChart");

if (revenueCanvas) {

    new Chart(revenueCanvas, {

        type: "line",

        data: {

            labels: monthLabels,

            datasets: [{

                label: "Revenue",

                data: revenueValues,

                borderColor: "#16a34a",

                backgroundColor: "rgba(22,163,74,.15)",

                fill: true,

                tension: .4

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}

// =======================
// Order Chart
// =======================

const orderValues = new Array(12).fill(0);

if (window.orderChartData) {

    window.orderChartData.forEach(item => {

        orderValues[item._id.month - 1] = item.orders;

    });

}

const orderCanvas = document.getElementById("orderChart");

if (orderCanvas) {

    new Chart(orderCanvas, {

        type: "bar",

        data: {

            labels: monthLabels,

            datasets: [{

                label: "Orders",

                data: orderValues,

                backgroundColor: "#2563eb"

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}

const statusCanvas = document.getElementById("statusChart");

if(statusCanvas){

new Chart(statusCanvas,{

type:"doughnut",

data:{

labels:[

"Delivered",

"Pending",

"Processing",

"Cancelled"

],

datasets:[{

data:[

window.statusData.delivered,

window.statusData.pending,

window.statusData.processing,

window.statusData.cancelled

],

backgroundColor:[

"#22c55e",

"#f59e0b",

"#3b82f6",

"#ef4444"

],

hoverOffset:12,

borderWidth:0

}]

},

options:{

responsive:true,

cutout:"70%",

plugins:{

legend:{

position:"bottom",

labels:{

padding:20,

usePointStyle:true,

pointStyle:"circle"

}

}

}

}

});

}