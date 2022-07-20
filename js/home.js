// PROGRESSBAR
const allProgress = document.querySelectorAll('main .goals li .progress');

allProgress.forEach(item=> {
	item.style.setProperty('--value', item.dataset.value)
})

// APEXCHART
var fakeData = {
  series: [{
  name: 'Ingresos',
  data: [35000, 20000, 12000, 15000, 45000, 30000, 22000],
  color: '#48ACF0',
}, {
  name: 'Egresos',
  data: [15000, 30000, 22000, 10000, 20000, 17000, 28000],
  color: '#7F5A83',
}],
  chart: {
  height: 350,
  type: 'area'
},
dataLabels: {
  enabled: false
},
stroke: {
  curve: 'smooth'
},
xaxis: {
  type: 'month',
  categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
}
};

var chart = new ApexCharts(document.querySelector('#chart'), fakeData);
chart.render();