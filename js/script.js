heading = new Array();
data = new Array();
var fs = require('fs');
var rl = require('readline').createInterface({
  input: require('fs').createReadStream('../data/WDI_Data.csv')
});
var c = fs.readFileSync('../json/countries.json');
country = JSON.parse(c);
c = fs.readFileSync('../json/continents.json');
continents = JSON.parse(c);
c = fs.readFileSync('../json/continent_country.json');
country_by_cont = JSON.parse(c);
rl.on('line',function(line){
    var arr = line.split(',');
    if(arr[0]==="Country Name") {
      for(var i=0; i<arr.length; i++) {
        heading.push(arr[i]);
      }
    }
    if((arr[2]==="Arable land (% of land area)" && country.indexOf(arr[0])>-1) || (arr[2]==="Arable land (hectares per person)" && country.indexOf(arr[0])>-1) ||(arr[2]==="Arable land (hectares)" && country.indexOf(arr[0])>-1)) {
      data.push(arr);
    }
});
rl.on('close',function() {
    var LENGTH = data.length;
    var percInd = new Array();
    var hppInd = new Array();
    var hInd = new Array();
    var africaPerc = new Array();
    var contValue = new Array();
    var CONTINENTS = new Object();
    CONTINENTS["ASIA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["ASIA"].push(0.0);
    }
    CONTINENTS["AFRICA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["AFRICA"].push(0.0);
    }
    CONTINENTS["N_AMERICA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["N_AMERICA"].push(0.0);
    }
    CONTINENTS["S_AMERICA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["S_AMERICA"].push(0.0);
    }
    CONTINENTS["OCEANIA"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["OCEANIA"].push(0.0);
    }
    CONTINENTS["EUROPE"]=new Array();
    for(var i=0; i<56; i++) {
        CONTINENTS["EUROPE"].push(0.0);
    }
    for(var i=0; i<LENGTH; i++) {
        if(data[i][0]==="India") {
            if(data[i][2]==="Arable land (% of land area)") {
                for(var j=4; j<60; j++) {
                    if(isNaN(parseFloat(data[i][j]))) {
                        continue;
                    }
                    newObj = new Object();
                    newObj["year"] = heading[j];
                    newObj["value"] = parseFloat(data[i][j]);
                    percInd.push(newObj);
                }
            }
            else if(data[i][2]==="Arable land (hectares per person)") {
              for(var j=4; j<60; j++) {
                  if(isNaN(parseFloat(data[i][j]))) {
                      continue;
                  }
                  newObj = new Object();
                  newObj["year"] = heading[j];
                  newObj["value"] = parseFloat(data[i][j]);
                  hppInd.push(newObj);
                }
            }
            else if(data[i][2]==="Arable land (hectares)") {
              for(var j=4; j<60; j++) {
                  if(isNaN(parseFloat(data[i][j]))) {
                      continue;
                  }
                  newObj = new Object();
                  newObj["year"] = heading[j];
                  newObj["value"] = parseFloat(data[i][j]);
                  hInd.push(newObj);
                }
            }
        }
        if((country_by_cont["AFRICA"]).indexOf(data[i][0]) > -1) {
            if(data[i][2]==="Arable land (% of land area)") {
                if(isNaN(parseFloat(data[i][54]))) {
                  continue;
                }
                newObj = new Object();
                newObj["country"] = data[i][0];
                newObj["value"] = parseFloat(data[i][54]);
                africaPerc.push(newObj);
            }
        }
        if(data[i][2]==="Arable land (hectares)") {
            for(var j=4; j<60; j++) {
              if(isNaN(parseFloat(data[i][j]))){
                continue;
              }
              CONTINENTS[continents[data[i][0]]][j-4]+=parseFloat(data[i][j]);
            }
        }
    }
    for(var i=4; i<60; i++) {
      var temp = new Object();
      temp["year"] = heading[i];
      for(key in CONTINENTS) {
        if(CONTINENTS[key][i-4]<=0) {
          temp[key]=0;
        }
        temp[key] = CONTINENTS[key][i-4];
      }
      contValue.push(temp);
    }
    var jsonOne = JSON.stringify(percInd);
    fs.writeFile('../json/reqOne1.json',jsonOne,function(err){
      if(err){
        console.error(err);
      }
    });
    var jsonTwo = JSON.stringify(hppInd);
    fs.writeFile('../json/reqOne2.json',jsonTwo,function(err){
      if(err){
        console.error(err);
      }
    });
    var jsonThree = JSON.stringify(hInd);
    fs.writeFile('../json/reqOne3.json',jsonThree,function(err){
      if(err){
        console.error(err);
      }
    });
    var jsonFour = JSON.stringify(africaPerc);
    fs.writeFile('../json/reqTwo.json',jsonFour,function(err){
      if(err){
        console.error(err);
      }
    });
    var jsonFive = JSON.stringify(contValue);
    fs.writeFile('../json/reqThree.json',jsonFive,function(err){
      if(err){
        console.error(err);
      }
    });
});
