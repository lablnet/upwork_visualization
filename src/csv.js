export default function csvJSON(csv){
    let lines=csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");

    for(let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(",");

        // fix date, as date contains ",".
        obj['Date'] = currentline[0] + ', ' + currentline[1] ;
        for(let j = 2; j < (headers.length); j++){
            obj[headers[j - 1]] = currentline[j];
        }

        result.push(obj);
    }

    return JSON.stringify(result);
}
