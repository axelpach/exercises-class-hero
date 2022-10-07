const list = [
    {
        name: "Mike Vargas",
        score: 76,
        school: "507f1f77bcf86cd799439011"
    },
    {
        name: "Jake Smith",
        score: 100,
        school: "507f1f723cf86cd932439011"
    },
    {
        name: "Stephen Gonzales",
        score: 23,
        school: "507f1f77bcf86cd799439011"
    },
    {
        name: "Omar Rubio",
        score: 76,
        school: "507f1f77bcf86cd799439011"
    },
    {
        name: "Aldo Aldana",
        score: 80,
        school: "507f1f723cf86cd932439011"
    },
    {
        name: "Miguel Lim",
        score: 38,
        school: "507f1f723cf86cd932439011"
    },
    {
        name: "Bruno Gonzalves",
        score: 92,
        school: "507f1f77bcf86cd799439011"
    },
    {
        name: "Fred Wilson",
        score: 76,
        school: "507f1f723cf86cd932439011"
    },
    {
        name: "Canelo Alvarez",
        score: 65,
        school: "507f1f723cf86cd932439011"
    },
    null,
    {
        name: "Evelyn Johnson",
        score: 54,
        school: "507f1f77bcf86cd799439011"
    }
];

//console.log(list[9]);

//a
console.log(list.find(dictionary => dictionary.name === 'Canelo Alvarez'));

//b
console.log(list.find(dictionary => dictionary ? dictionary.name === 'Evelyn Johnson' : ''));

//c
console.log(list.filter(dictionary => dictionary ? 20 <= dictionary.score && dictionary.score <=70 && dictionary.school == '507f1f77bcf86cd799439011' : ''));

//d
console.log([...new Set(list.filter(dictionary => dictionary ? dictionary.school : '').map(dictionary => dictionary && dictionary.school))]);
//Note: The filter part is just to avoid null dictionaries, if there weren't null dictionaries the command would have been:
//console.log([...new Set(list.map(dictionary => dictionary && dictionary.school))]);

//e 
function compareSchoolAndName(a, b){
    if (a && b){
        return a.school.localeCompare(b.school) || a.name.localeCompare(b.name);
    }
}
console.log(list.sort(compareSchoolAndName));