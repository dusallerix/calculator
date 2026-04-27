import { MathLib } from "./MathLib.js"

window.clickNum = clickNum;
window.clickOp = clickOp;
window.calcEx = calcEx;
window.AllClear = AllClear;
window.ClearEntry = ClearEntry;
window.del = del;

const result = document.querySelector('#result'),
    number = document.querySelectorAll('.number:not(.equal)'),
    expression = document.querySelector('#last-action');

const pi = Math.round(Math.PI*100)/100;
const calc = new MathLib();

let ex='';
let justEvaluated = false;
result.value = '0';

//ввод числа
function clickNum(btn) { // when we click on a number
    if(!ex || ex == 0) {
        expression.value = btn.id
        ex = btn.id;
    } else {
        //не позволяем больше одной точки в введенном числе
        if (btn.id == '.' && /\./.test(result.value)) return;
        else {
            expression.value += btn.id
            ex += btn.id;
        }
    }
    result.value = ex.split(/\/|\*|\+|-|=/).pop();
    checkLength(result.value)
};

//ввод оператора
function clickOp(op) {
    let lastChar = Array.from(ex).slice(-1);

    //начинаем новое выражение с результатом прошлого вычисления
    if (justEvaluated) {
        expression.value = ex;
        justEvaluated = false;
    }

    //возможность поставить минус в начале
    if(!ex) {
        if (op === '-') {
            expression.value += '-';
            ex += '-';
            result.value = ex;
        }
        return;
    }

    // если последний символ является оператором
    if(/[\+\-\*\/]/.test(lastChar)) {
        // разрешаем ставить минус в начале числа и не допускаем больше одного '-'
        if(op === '-' && lastChar != '-') {
            expression.value += op;
            ex += op; // например: 5*-
        } else {
            //не допускаем повторных символов
            if(lastChar == '-' && /[\+\-\*\/]/.test(ex.slice(-2, -1))) {
                return
            }
            // заменяем оператор
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
    if (!ex) return;

    if (!justEvaluated) {
        let res = calc.evalRPN(ex);

        expression.value = ex + "=";
        result.value = res;

        ex = res;
        justEvaluated = true;
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
  if(arg.toString().length > 14) {
    expression.value = 'press CE to return';
    result.value = 'number too long'.toUpperCase();
  } 
}


