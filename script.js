document.getElementById('creditCalculator').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const currency = document.getElementById('currency').value;
    const totalAmount = parseFloat(document.getElementById('totalAmount').value);
    const initialPayment = parseFloat(document.getElementById('initialPayment').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const amortizationPeriod = parseInt(document.getElementById('amortizationPeriod').value);

    // Calcular el importe del préstamo
    const loanAmount = totalAmount - initialPayment;

    // Calcular la tasa de interés mensual
    const monthlyInterestRate = interestRate / 100 / 12;

    // Calcular el número total de pagos
    const totalPayments = amortizationPeriod * 12;

    // Calcular el pago mensual
    const monthlyPayment = (loanAmount * monthlyInterestRate) / 
        (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

    // Crear datos para el gráfico
    let remainingBalance = loanAmount;
    const labels = [];
    const data = [];
    for (let i = 1; i <= totalPayments; i++) {
        labels.push(`Mes ${i}`);
        remainingBalance -= (monthlyPayment - remainingBalance * monthlyInterestRate);
        data.push(remainingBalance.toFixed(2));
    }

    // Mostrar el resultado en SweetAlert
    const currencySymbol = currency === 'CRC' ? '₡' : '$';
    const resultContent = `
        <p>Pago mensual: ${currencySymbol}${monthlyPayment.toFixed(2)}</p>
        <canvas id="resultChart" width="400" height="200"></canvas>
    `;

    Swal.fire({
        title: 'Resultado de la calculadora de crédito',
        html: resultContent,
        didOpen: () => {
            const ctx = document.getElementById('resultChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Saldo pendiente',
                        data: data,
                        borderColor: 'rgba(255, 99, 132, 0.6)', // Borde rojo semi-transparente
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Relleno rojo semi-transparente
                        borderWidth: 0, // Sin borde
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'black' // Color del texto de la leyenda en negro
                            },
                            // Personalización del símbolo de la leyenda para 'Saldo pendiente'
                            display: true,
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'rectRounded', // Estilo del punto como un rectángulo redondeado
                                radius: 8, // Tamaño del punto
                                borderWidth: 1, // Ancho del borde alrededor del punto
                                borderColor: '#ff0000', // Color del borde del punto en rojo (#ff0000)
                                backgroundColor: '#ff0000' // Color de fondo del punto en rojo (#ff0000)
                            }
                        }
                    }
                }
            });
            
            
            
            
            
            
        }
    });
});
