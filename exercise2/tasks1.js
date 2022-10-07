dependencies = {
    'a': [],
    'b': [],
    'c': ['a'],
    'd': ['b', 'c'],
    'e': ['d']
}
//This is to measure if async calls are done correctly
timeOuts = {
    'a': 2000,
    'b': 500,
    'c': 3000,
    'd': 500,
    'e': 500
}

//The tasks accept data from dependant task through parameters
async function task(taskLetter, dependendantOn){   
       
    for (let i = 0; i < dependendantOn.length; i++){
        await task(dependendantOn[i], dependencies[dependendantOn[i]])
        .then((string) => {
            console.log(string);
        })
        .catch(e => console.log(e));
    }

    return new Promise((resolve, reject) => {
        setTimeout(function () {    
            //Task passes data to dependant through resolve        
            resolve(taskLetter + ' done');
        }, timeOuts[taskLetter]);
    })
}

task('e', dependencies['e'])
.then((string) => {   
    console.log(string); 
})
.catch(e => console.log(e));
;
