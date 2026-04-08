const result = document.querySelector('#result'),
    number = document.querySelectorAll('.number:not(.equal)'),
    expression = document.querySelector('#last-action');

const pi = Math.PI;
const e = Math.round(Math.E, 3);

let ex='';
result.value = '0';

//ввод числа
function clickNum(btn) { // when we click on a number
    if(!ex || typeof(ex) === 'number' || ex === 0) {
        expression.value = btn.id
        ex = btn.id;
    } else {
        expression.value += btn.id
        ex += btn.id;
    }
    result.value = ex.split(/\/|\*|\+|-|=/).pop();
    checkLength(result.value)
};

//ввод оператора
function clickOp(op) {
    //возможность поставить минус в начале
    if (!ex) {
        if (op === '-') {
            expression.value += '-';
            ex += '-';
            result.value = ex;
        }
        return;
    }

    let lastChar = ex.slice(-1);

    // если последний символ является оператором
    if (/[\+\-\*\/]/.test(lastChar)) {
        // разрешаем ставить минус в начале числа и не допускаем больше одного '-'
        if (op === '-' && lastChar != '-') {
            expression.value += op;
            ex += op; // например: 5*-
        } else {
            // заменяем оператор
            if (lastChar === '-' && /[\+\-\*\/]/.test(ex.slice(-2, -1))) {
                return
            }
            expression.value = ex.slice(0, -1) + op;
            ex = ex.slice(0, -1) + op;
        }
    } else {
        expression.value += op;
        ex += op;
    }
    result.value = op;
}

//подсчёт
function calcEx() {
    if(!ex) return;

    if(ex.slice(-1) != '=') {
        ex = eval(ex);
        expression.value += '=';
        result.value = ex;
    }

}

//очистить все поля
function AllClear() {
    result.value = '0';
    expression.value = '';
    ex = '';
}

//очистить последнее введенное число/оператор
function ClearEntry() {
    let entryNum = ex.split(/\/|\*|\+|-|=/).pop()
    let entryOp = ex.slice(-1);
    //если последнее введенное данное является числом
    if(!ex || !/[\+\-\*\/]/.test(entryOp)) {
        ex = ex.slice(0, -entryNum.length); //удаляется не по одной цифре, а по числу
        expression.value = ex;
    } else { //иначе удаляется оператор, т.е. один символ
        ex = ex.slice(0, -1);
        expression.value = ex;
    }
    result.value = '0';
}

//удаление по одному символу
function del(){
    ex = ex.slice(0, -1);
    expression.value = ex;
    result.value = ex.split(/\/|\*|\+|-|=/).pop();
}

//ограничение ввода числа до 14 символов
function checkLength(arg) {
  if (arg.toString().length > 14) {
    expression.value = 'press CE to return';
    result.value = 'number too long'.toUpperCase();
  } 
}


