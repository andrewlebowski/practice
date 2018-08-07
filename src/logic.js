function intersect(x, y){
  if(x < y)
    return x;
  else 
    return y;
}

function union(x, y){
  if(x > y)
    return x;
  else 
    return y;
}

function addition(x){
  return 1 - x;
}

function difference(x, y){
  return intersect(x, addition(y));
}

function symmDifference(x, y){
  return union(difference(x, y), difference(y, x));
}

function checkPriority(c) {
	switch (c) {
	case '¬': return 5;
	case '∩': return 4;
	case '∪': return 3;
	case '\\': return 2;
	case '△': return 1;
	default: return 0;
	}
}

function checkElem(s, opsStack, opn){
  if(opsStack.length == 0){
    opsStack.push(s);
  } else {
    var c = opsStack[opsStack.length - 1];
    while (checkPriority(c) > checkPriority(s)) {
			opn += c;
			opsStack.pop();
			if (opsStack.length != 0)
				c = opsStack[opsStack.length - 1];
			else
				break;
		}
    opsStack.push(s);
  }
  return opn;
}

function OPN(str){
    var opsStack = [];
    var opn = "";
    for(var i = 0; i < str.length; i++){
      var currVar = str.charAt(i);
      if(currVar == "("){
        opsStack.push(currVar);
      } else if (currVar == ")"){
        var c = opsStack.pop();
        while(c != "("){
          opn += c;
          c = opsStack.pop();
        }
      } else if(currVar == "¬" || currVar == "∪" || currVar == "∩" || currVar == "\\" || currVar == "△"){
        opn = checkElem(currVar, opsStack, opn);
      } else
      opn += currVar;
    }
    while (opsStack.length != 0) {
      opn += opsStack.pop();
    }

    console.log(opn);
    return opn;
}

function elemsInExpression(str){
  var a = str.match(/[A-H]/gi); 
  a = a.sort(); 
  var obj =[]; 
  obj.push(a[0]); 
  for(var i=1;i<a.length;i++) 
  { 
    if(a[i]!=a[i-1]) obj.push(a[i]); 
  }
  return obj;
}

function createElemTable(arrObj){
  var numOfElem = arrObj.length;
  var numOfRow = 2;
  var tableOfElem = [];
  for(var i = 1; i < numOfElem; i++){
    numOfRow *= 2;
  }
  for(var i = 0; i < numOfRow; i++){
    tableOfElem[i] = [];
    var number = i.toString(2);
    var k = 0;
    for(var j = 0; j < numOfElem; j++){
      if(j < (numOfElem - number.length)){
        tableOfElem[i][j] = 0;
      } else {
        tableOfElem[i][j] = Number(number.charAt(k));
        k++;
      }
    }
  }
  
  console.log(tableOfElem);
  return tableOfElem;
}

function find(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == value) return i;
  }
  return -1;
}

function substitutionElem(str, numArr){
  var arrObj = elemsInExpression(str);
  var newStr = "";
  for(var i = 0; i < str.length; i++){
    var ind = find(arrObj, str.charAt(i));
    if(ind > -1){
      newStr += numArr[ind];
    } else{
      newStr += str.charAt(i);
    }
  }
  console.log(newStr);
  return newStr;
}

function evaluateOPN(str){
  var valsStack = [];
  for(var i = 0; i < str.length; i++){
    var currVar = str.charAt(i);
    switch (currVar) {
      case '¬': 
        var val = valsStack.pop();
        valsStack.push(addition(val));
        break;
      case '∩': 
        var val1 = valsStack.pop();
        var val2 = valsStack.pop();
        valsStack.push(intersect(val2, val1));
        break;
      case '∪': 
        var val1 = valsStack.pop();
        var val2 = valsStack.pop();
        valsStack.push(union(val2, val1));
        break;
      case '\\':
        var val1 = valsStack.pop();
        var val2 = valsStack.pop();
        valsStack.push(difference(val2, val1));
        break;
      case '△': 
        var val1 = valsStack.pop();
        var val2 = valsStack.pop();
        valsStack.push(symmDifference(val2, val1));
        break;
      default: 
        valsStack.push(Number(currVar));
      }
  }

  return valsStack[0];
}

function check(leftPart, rightPart){
  var elemsFromLeftPart = elemsInExpression(leftPart);
  var elemsFromRightPart = elemsInExpression(rightPart);
  if(elemsFromLeftPart.toString() == elemsFromRightPart.toString()){
    var elemTable = createElemTable(elemsFromLeftPart);
    var opnLP = OPN(leftPart);
    var opnRP = OPN(rightPart);

    var valsOfLP = [];
    var valsOfRP = [];
    for(var i = 0; i < elemTable.length; i++){
      var opnLPWithSubstElem = substitutionElem(opnLP, elemTable[i]);
      var opnRPWithSubstElem = substitutionElem(opnRP, elemTable[i]);
      valsOfLP.push(evaluateOPN(opnLPWithSubstElem));
      valsOfRP.push(evaluateOPN(opnRPWithSubstElem));
    }
    console.log(valsOfLP);
    console.log(valsOfRP);
    console.log(valsOfLP.toString() == valsOfRP.toString());
    return (valsOfLP.toString() == valsOfRP.toString());
  } else
    return false;
}

function errorList(lpArr, rpArr){
  var errList = [];
  if(lpArr.length == 1 || rpArr.length == 1){
    errList.push(-1);
    return errList;
  } else if(check(lpArr[0], rpArr[0]) == false){
    errList.push(-2);
    return errList;
  } else if(lpArr[lpArr.length - 1].toString() != rpArr[rpArr.length - 1].toString()){
    errList.push(-3);
    return errList;
  } else {
    for(var i = 0; i < lpArr.length; i++){
      if(lpArr[i].toString() == "" || rpArr[i].toString() == ""){
        errList.push(-4);
        return errList;
      }
    }
    for(var i = 0; i < lpArr.length; i++){
      if(check(lpArr[i], rpArr[i]) == false){
        errList.push(i);
      }
    }
  }
  return errList;
}
