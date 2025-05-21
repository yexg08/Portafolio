// DOM Elements
const collapseSidebarBtn = document.getElementById('collapse-sidebar');
const sidebar = document.querySelector('.sidebar');
const currentDateEl = document.getElementById('current-date');
const chartActions = document.querySelectorAll('.chart-action-btn');

// Sidebar toggle
collapseSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    
    // Change icon
    const icon = collapseSidebarBtn.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-chevron-right');
    } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-bars');
    }
});

// Mobile sidebar toggle
const showSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.header-left').prepend(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('show') && 
                !sidebar.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }
};

// Set current date
const setCurrentDate = () => {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('es-ES', options);
};

// Chart actions toggle
chartActions.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        chartActions.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update chart based on selected view
        const view = button.dataset.view;
        updateUsersTrendChart(view);
    });
});

// ------------------------
// Charts Initialization
// ------------------------

// Users Trend Chart (Line Chart)
let usersTrendChart;

const initUsersTrendChart = () => {
    const ctx = document.getElementById('users-trend-chart').getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(108, 92, 231, 0.2)');
    gradient.addColorStop(1, 'rgba(108, 92, 231, 0)');
    
    usersTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Usuarios',
                data: [12500, 14200, 13800, 15600, 16200, 14800, 15900],
                borderColor: '#6C5CE7',
                backgroundColor: gradient,
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#6C5CE7',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#6C5CE7',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#2d3748',
                    titleFont: {
                        size: 14,
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    },
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Usuarios: ' + context.raw.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#718096'
                    }
                },
                y: {
                    beginAtZero: true,
                    grace: '10%',
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#718096',
                        callback: function(value) {
                            if (value >= 1000) {
                                return value / 1000 + 'k';
                            }
                            return value;
                        }
                    }
                }
            }
        }
    });
};

// Update Users Trend Chart based on view
const updateUsersTrendChart = (view) => {
    let labels, data;
    
    switch (view) {
        case 'week':
            labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            data = [12500, 14200, 13800, 15600, 16200, 14800, 15900];
            break;
        case 'month':
            labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
            data = [58500, 62300, 65800, 69500];
            break;
        case 'year':
            labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            data = [214500, 238700, 252300, 267800, 285600, 290100, 304500, 320800, 328400, 345700, 360200, 385200];
            break;
    }
    
    usersTrendChart.data.labels = labels;
    usersTrendChart.data.datasets[0].data = data;
    usersTrendChart.update();
};

// Traffic Sources Chart (Horizontal Bar Chart)
const initTrafficSourcesChart = () => {
    const ctx = document.getElementById('traffic-sources-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Búsqueda orgánica', 'Directo', 'Redes sociales', 'Referido', 'Email'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#6C5CE7',
                    '#00b894',
                    '#3498db',
                    '#fdcb6e',
                    '#ff6b6b'
                ],
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#2d3748',
                    titleFont: {
                        size: 14,
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    },
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.raw + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 50,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#718096',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#718096'
                    }
                }
            }
        }
    });
};

// Device Distribution Chart (Donut)
const initDeviceDonutChart = () => {
    // Using D3.js
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select("#device-donut-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    const data = [
        { label: "Móvil", value: 68, color: "#6C5CE7" },
        { label: "Escritorio", value: 24, color: "#00b894" },
        { label: "Tablet", value: 8, color: "#3498db" }
    ];
    
    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);
    
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null)
        .padAngle(0.03);
    
    // Add a group for each slice
    const g = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");
    
    // Add the colored arc paths
    g.append("path")
        .attr("d", arc)
        .style("fill", d => d.data.color)
        .style("stroke", "#fff")
        .style("stroke-width", 2)
        .style("transition", "all 0.3s ease");
    
    // Add percentage text in the center
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("class", "donut-center-text")
        .style("font-size", "2.5rem")
        .style("font-weight", "600")
        .style("fill", "#2d3748")
        .text(`${data[0].value}%`);
    
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "2.5em")
        .style("font-size", "0.85rem")
        .style("fill", "#718096")
        .text("Móvil");
    
    // Add hover effects
    g.on("mouseover", function(event, d) {
        d3.select(this).select("path")
            .style("opacity", 0.8)
            .style("transform", "scale(1.03)");
        
        // Update center text
        svg.select(".donut-center-text")
            .text(`${d.data.value}%`);
        
        svg.select("text:last-child")
            .text(d.data.label);
    })
    .on("mouseout", function() {
        d3.select(this).select("path")
            .style("opacity", 1)
            .style("transform", "scale(1)");
        
        // Reset center text
        svg.select(".donut-center-text")
            .text(`${data[0].value}%`);
        
        svg.select("text:last-child")
            .text("Móvil");
    });
};

// Hourly Activity Heatmap
const initHourlyActivityChart = () => {
    // Using D3.js
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = document.getElementById('hourly-activity-chart').clientWidth - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;
    
    const svg = d3.select("#hourly-activity-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Days of the week
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    // Time periods
    const periods = ['Mañana', 'Tarde', 'Noche'];
    
    // Activity data (values from 0-1)
    const activityData = [
        // Morning, Afternoon, Evening
        [0.3, 0.5, 0.2],  // Monday
        [0.4, 0.6, 0.3],  // Tuesday
        [0.5, 0.7, 0.4],  // Wednesday
        [0.4, 0.8, 0.5],  // Thursday
        [0.6, 0.9, 0.7],  // Friday
        [0.8, 0.7, 0.9],  // Saturday
        [0.7, 0.4, 0.6]   // Sunday
    ];
    
    // Color scale
    const colorScale = d3.scaleLinear()
        .domain([0, 0.5, 1])
        .range(["#e2e8f0", "#8a7ff0", "#6C5CE7"]);
    
    // X scale
    const x = d3.scaleBand()
        .domain(periods)
        .range([0, width])
        .padding(0.05);
    
    // Y scale
    const y = d3.scaleBand()
        .domain(days)
        .range([0, height])
        .padding(0.05);
    
    // Add X axis
    svg.append("g")
        .style("font-size", "12px")
        .style("font-family", "Inter")
        .style("color", "#718096")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove();
    
    // Add Y axis
    svg.append("g")
        .style("font-size", "12px")
        .style("font-family", "Inter")
        .style("color", "#718096")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();
    
    // Create data array for heatmap
    const heatmapData = [];
    days.forEach((day, i) => {
        periods.forEach((period, j) => {
            heatmapData.push({
                day: day,
                period: period,
                value: activityData[i][j]
            });
        });
    });
    
    // Add heatmap cells
    svg.selectAll("rect")
        .data(heatmapData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.period))
        .attr("y", d => y(d.day))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("rx", 2)
        .attr("ry", 2)
        .style("fill", d => colorScale(d.value))
        .style("stroke", "#fff")
        .style("stroke-width", 2)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style("stroke", "#2d3748")
                .style("cursor", "pointer");
            
            // Add tooltip
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x(d.period) + x.bandwidth() / 2)
                .attr("y", y(d.day) + y.bandwidth() / 2)
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .style("fill", d.value > 0.5 ? "#fff" : "#2d3748")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("pointer-events", "none")
                .text(`${Math.round(d.value * 100)}%`);
        })
        .on("mouseout", function() {
            d3.select(this)
                .style("stroke", "#fff");
            
            // Remove tooltip
            svg.select("#tooltip").remove();
        });
};

// Initialize all charts on window load
window.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    initUsersTrendChart();
    initTrafficSourcesChart();
    initDeviceDonutChart();
    initHourlyActivityChart();
    showSidebarOnMobile();
    
    // Add resize handler for responsiveness
    window.addEventListener('resize', () => {
        if (usersTrendChart) {
            usersTrendChart.resize();
        }
    });
}); 