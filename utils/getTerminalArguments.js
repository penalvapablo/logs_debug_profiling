module.exports = function getArguments(data) {
  let result = '';
  
  delete data['$0'];

  if (data._.length === 0 & Object.keys(data).length === 1){
    result = 'no hay argumentos de entrada'
  }

  const dataWithoutAtribute = [...data._];
  dataWithoutAtribute.forEach((x) => {
    result = result + x + ' ';
  });
  delete data._;
  const arrOfDataWithArguments = Object.entries(data);

  arrOfDataWithArguments.forEach((x) => {
    let atribute = x[0];
    let value = x[1]
    if (atribute.length === 1) {
      atribute = '-' + atribute;
    } else {
      atribute = '--' + atribute;
    }
    result = result + atribute + ' ' + value + ' ';
  });
  return result;
};
