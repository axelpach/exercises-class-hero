'use strict'
//console.log('si');
let startDate = document.getElementById('startDate').value;
let endDate = document.getElementById('endDate').value;
let startAndEndDates = [];
let labels = [];
let prices = [];
let bestRate = 0;
let periodIndexes = [0, 0];

async function calculateReturn(prices){
    bestRate = 0;
    periodIndexes = [0, 0];
    
    let i = 0;
    let j = 0;    
    while (i < prices.length){ //We iterate from every value
        j = i+1;
        while (prices[j] > prices[i]){
            //We compare with each subsequent value as long as the subsequent value is greater
            //than the first. If it has a better rate, we save the rate as the highest and
            //the indexes of the period
            if( prices[j]/prices[i] - 1 > bestRate){
                bestRate = prices[j]/prices[i] - 1;
                periodIndexes = [i, j];
            }
            j++;
        }
        i++;
    }        
}

function addDays(date, days){
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function convertToStringDate(date){
    return date.toISOString().slice(0,10);
}

function getStartAndEndDates(startDate, endDate){
    let startDateTemp = new Date(startDate);
    let endDateTemp = new Date(endDate);    
    startAndEndDates = [];
    let days = (endDateTemp - startDateTemp)/1000/60/60/24;
    let today = new Date();

    let limit = 0;
    if (days > 0 && days < 365*5 && endDateTemp < today){
        while (days > limit){
            startDateTemp = limit == 0 ? startDateTemp : addDays(startDate, limit + 1);        
            limit+=365;
            let endDateTemp2 = days < limit ? endDateTemp : addDays(startDate, limit);
            startAndEndDates.push([convertToStringDate(startDateTemp), convertToStringDate(endDateTemp2)]);
        }
    }    

}

$(document).ready(function(){  
    
    async function makeAllQueries(){

        for (const dates of startAndEndDates){                

            await $.ajax({
                type: 'GET',
                url: `http://api.nbp.pl/api/cenyzlota/${dates[0]}/${dates[1]}`,
                data: {},
                success: function(data){                                           
                    //console.log(data);
                    data.forEach(element => {
                        labels.push(element.data);
                        prices.push(element.cena);
                    });                    
                    // resolve();
                }
            })
            .catch(e => {
                reject(e);
            })
        } 
        
    }   
    
    //Function for updating the chart
    function updateChart(){
         
        //We set investment values to ''
        $('#return')[0].value = '';
        $('#startDateSuggestion')[0].value =  '';
        $('#endDateSuggestion')[0].value = ''; 

        //This function is to get an array with pairs of dates to query
        getStartAndEndDates(startDate, endDate);

        //If there are no dates to query there's a mistake in the user input
        if(startAndEndDates.length == 0){
            alert('Select a range where: \n Start Date is before End Date \n End Date is not after today. \n Range between two dates is less than 5 years');
            return
        } 

        
        //If everything seems correct, we then initialize the labels and prices 
        // and then make all the asynchronous queries for data
        labels = [];
        prices = [];
        
        makeAllQueries()
        .then(function(){   
            //After executing all the queries we update the line graph
            const chartData = {
            labels: labels,
            datasets: [{
                label: 'Gold Fluctuation',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: prices,
                }]
            }; 
                        
            myChart.data = chartData;
            myChart.update(); 
        })                

    }
    

    //Listeners to the date selectors, everytime a date is changed, the chart is updated
    document.querySelector('jsuites-calendar').addEventListener('onchange', function(e) {        
        startDate = e.target.value.toString().replace('00:00:00', '').trim();
        updateChart();
    });

    document.getElementById('endDate').addEventListener('onchange', function(e){        
        endDate = e.target.value.toString().replace('00:00:00', '').trim();
        updateChart();
    });        

    //Initialize the line chart
    const config = {
        type: 'line',
        data: {},
        options: {}
    };
         
    let myChart = new Chart(
        document.getElementById('myChart'),
        config
    ); 
    
    //First run of creating the chart when the page loads
    updateChart();    

    //Listener for calculate investemnt event
    $('#calculate').on('click', function(event) {        
        let value = $('#investment')[0].value;    
                                         
        calculateReturn(prices)
        .then(() => {
            //After the calculation is performed, we actualize front values
            $('#return')[0].value = '$' + value * (1+ bestRate);
            $('#startDateSuggestion')[0].value =  labels[periodIndexes[0]];
            $('#endDateSuggestion')[0].value = labels[periodIndexes[1]];
        });
        ;

    });
  
});
