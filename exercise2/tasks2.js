dependencies = {
    'a': [],
    'b': [],
    'c': ['a'],
    'd': ['b', 'c'],
    'e': ['d']
}
//This is to measure if async calls are done correctly
timeOuts = {
    'a': 5000,
    'b': 500,
    'c': 1000,
    'd': 500,
    'e': 500
}

//Number of chunks of data to be subdivided in
let n = 5;
let data = ['tasks done: ']

async function task(taskLetter, dependendantOn){   
       
    for (let i = 0; i < dependendantOn.length; i++){
        await task(dependendantOn[i], dependencies[dependendantOn[i]])
        .then((string) => {
            data.push(dependendantOn[i]);
            string && console.log(string, data);                                    
        })
        .catch(e => console.log(e));
    }  
    
    // To break in smaller chunks of data I would use recursion 
    // taskA is a function that will iterate n times through the data
    if(taskLetter == 'a'){        
        return new Promise(async (resolve, reject) => {
            resolve(
                await taskA(1)
                .then((string) => {                    
                    data.push('part 1 of a');
                    console.log(string, data); 
                })
                .catch(e => console.log(e)),
                taskA(n)
                    .then((string) => {   
                        data.push('part 5 of a');                     
                        console.log(string, data)
                    }) 
            );
        })                        
    } else {
        return new Promise((resolve, reject) => {        
            setTimeout(function () {    
                //Task passes data to dependant through resolve        
                resolve(taskLetter + ' done');
            }, timeOuts[taskLetter]);
            
        })        
    }

}

async function taskA(chunk){
    
    if (chunk > 2 ){
        await (taskA(chunk - 1))
        .then((string) => {
            let chunkToPass = chunk - 1
            data.push('part ' + chunkToPass + ' of a');
            console.log(string, data);
        })
        .catch(e => console.log(e));
        ;
    }    

    return new Promise((resolve, reject) => {
        setTimeout(function(){
            resolve('part ' + chunk + ' of task "a" done');            
        }, timeOuts['a']/n);
    })
}


task('e', dependencies['e'])
.then((string) => {   
    data.push('e');
    console.log(string, data); 
})
.catch(e => console.log(e))
;