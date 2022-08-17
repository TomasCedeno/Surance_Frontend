const BACKEND_URL = 'https://surance-db.herokuapp.com'
const userId = localStorage.getItem('userId')
const tableDiv = document.querySelector('#tbody_income')
let chart
headTable()
createGraphic()
loadData()

//#region LOGOUT SECTION
if (!userId) {
	logOut()
}

document.querySelector('#btnLogout').addEventListener('click', logOut)

function logOut() {
	localStorage.clear()
	alert('Se cerrará tu sesión')
	location.replace('index.html')
}
//#endregion


async function loadData() {
	incomesBack = await getIncomes()

	incomesBack.forEach((formIncome) => {
		insertGoal(formIncome)
	})
	loadTable()
	chart.updateOptions(await getGraphicData())
}
// filter table

function headTable() {
	$(document).ready(function () {
		$('#table_income thead tr')
			.clone(true)
			.addClass('filters')
			.appendTo('#table_income thead');
	});
}

function loadTable() {
	$(document).ready(function () {
		$('#table_income thead tr')

		var table = $('#table_income').DataTable({

			"columnDefs": [
				{ "width": "7%", "targets": 4 }
			],
			orderCellsTop: true,
			fixedHeader: true,
			initComplete: function () {
				var api = this.api();


				api
					.columns([0, 1, 2, 3])
					.eq(0)
					.each(function (colIdx) {

						var cell = $('.filters th').eq(
							$(api.column(colIdx).header()).index()
						);
						var title = $(cell).text();
						$(cell).html('<input type="text" placeholder="' + title + '" />');
						$(
							'input',
							$('.filters th').eq($(api.column(colIdx).header()).index())
						)
							.off('keyup change')
							.on('change', function (e) {

								$(this).attr('title', $(this).val());
								var regexr = '({search})';

								api
									.column(colIdx)
									.search(
										this.value != ''
											? regexr.replace('{search}', '(((' + this.value + ')))')
											: '',
										this.value != '',
										this.value == ''
									)
									.draw();
							})
							.on('keyup', function (e) {
								e.stopPropagation();

								$(this).trigger('change');
								$(this)
									.focus()[0]

							});
					});

			},
			"language": {
				"processing": "Procesando...",
				"lengthMenu": "Mostrar _MENU_ registros",
				"zeroRecords": "No se encontraron resultados",
				"emptyTable": "Ningún dato disponible en esta tabla",
				"infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
				"infoFiltered": "(filtrado de un total de _MAX_ registros)",
				"search": "Buscar:",
				"infoThousands": ",",
				"loadingRecords": "Cargando...",
				"paginate": {
					"first": "Primero",
					"last": "Último",
					"next": "Siguiente",
					"previous": "Anterior"
				},
				"info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
			}

		});

	});
}

function destroyTable() {
	var table = $('#table_income').DataTable();
	table.clear()
	table.destroy();
}


//  -------------- Graficas ---------------------
async function createGraphic(){
	chart = new ApexCharts(document.querySelector("#columnchart_material"), await getGraphicData());
	chart.render();
}

async function getGraphicData() {
	const lblMonths = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
	'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
   
	let monthlyIncomes = await getMonthlyIncomes()

	let totalIncomes = []
	let months = []

	monthlyIncomes.map(i => {
		totalIncomes.push(i.total)
		months.push(lblMonths[i.month])
	})

	var options = {
		series: [{
			name: 'Ingresos',
			data: totalIncomes
		}],
		chart: {
			height: 260,
			type: 'bar',
		},
		plotOptions: {
			bar: {
				borderRadius: 10,
				dataLabels: {
					position: 'top', // top, center, bottom
				},
			}
		},
		dataLabels: {
			enabled: true,
			offsetY: -14,
			style: {
				fontSize: '11px',
				colors: ["#304758"]
			}
		},

		xaxis: {
			categories: months,
			position: 'top',
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
			crosshairs: {
				fill: {
					type: 'gradient',
					gradient: {
						colorFrom: '#D8E3F0',
						colorTo: '#BED1E6',
						stops: [0, 100],
						opacityFrom: 0.4,
						opacityTo: 0.5,
					}
				}
			},
			tooltip: {
				enabled: true,
			}
		},
		yaxis: {
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false,
			},
			labels: {
				show: false,

			}

		},
		title: {
			text: 'Ingresos Mensuales',
			floating: true,
			offsetY: 240,
			align: 'center',
			style: {
				color: '#444'
			}
		}
	};

	return options
}

// conexion ---------------------------------------------------------------
// conexion ---------------------------------------------------------------
// conexion ---------------------------------------------------------------


document.querySelector('#form_register').addEventListener('submit', async (event) => {
	event.preventDefault();

	const formIncome = {
		user: userId,
		value: +document.querySelector('#register_value').value,
		date: document.querySelector('#register_date').value,
		category: document.querySelector('#register_category').value,
		description: document.querySelector('#register_description').value,
	}

	await sendJSON(formIncome)

	event.target.reset()
	destroyTable()
	loadData()
})

async function sendJSON(formIncome) {
	try {
		await fetch(`${BACKEND_URL}/incomes/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formIncome)
		})
	} catch (error) {
		console.error(error)
	}
}

function insertGoal(formIncome) {
	let tbody = document.createElement('tr')
	tbody.innerHTML = `        
    <td>${formIncome.value}</td>
    <td>${formIncome.date}</td>
    <td>${formIncome.category}</td>
    <td>${formIncome.description}</td>
    <td ><button class="btn_row_delete" id="btn_delete" type="submit" onclick="deleteIncome(${formIncome.id})">Eliminar</button></td>               
	`
	tableDiv.appendChild(tbody)
}

async function getIncomes() {
	try {
		const response = await fetch(`${BACKEND_URL}/incomes/${userId}`)
		const incomesBack = await response.json()
		return incomesBack
	} catch (error) {
		console.error(error)
	}

}

async function getMonthlyIncomes() {
	try {
		const response = await fetch(`${BACKEND_URL}/incomes/monthly/${userId}`)
		const monthlyIncomes = await response.json()
		return monthlyIncomes.slice(0, 6).reverse()
	} catch (error) {
		console.error(error)
	}

}


//  -------------- delete ---------------------

async function deleteIncome(incomeId) {
	try {
		await fetch(`${BACKEND_URL}/incomes/`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({user: userId, id: incomeId})
		}).then(res => {
			if (res.status == 204){
				alert('Ingreso eliminado exitosamente.')
				destroyTable()
				loadData()
			}
		})
	} catch (error) {
		console.error(error)
	}
}

