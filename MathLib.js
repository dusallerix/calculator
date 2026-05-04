export class MathLib {
    constructor() {
        this.ops = {
            '+': { prior: 1, assoc: 'L', args: 2 },
            '-': { prior: 1, assoc: 'L', args: 2 },

            '*': { prior: 2, assoc: 'L', args: 2 },
            '/': { prior: 2, assoc: 'L', args: 2 },

            '^': { prior: 4, assoc: 'R', args: 2 },
            'root': { prior: 4, assoc: 'R', args: 2 },

            '~': { prior: 5, assoc: 'R', args: 1 }, // унарный минус
            '√': { prior: 5, assoc: 'R', args: 1 },

            '!': { prior: 6, assoc: 'L', args: 1 }
        };

        this.func = {
            'sin': { args: 1, fn:(x) => Math.sin(x*Math.PI/180) },
            'cos': { args: 1, fn:(x) => Math.cos(x*Math.PI/180) },
            'tan': { args: 1, fn:(x) => Math.tan(x*Math.PI/180) },
        };
    }

    //разбиваем строку на токены
    tokenize(str){
        let arr = str.match(/(\d+(\.\d+)?)|[+\-*/^()%!√]|[a-zA-Z]+/g);
        return arr;
    }

    //переводим на rpn(reverse polish notation)
    shuntingYard(exp){
        let tokens = this.tokenize(exp);
        let stack = [];
        let rpn = [];

        let prev = null;

        for (const token of tokens) {
            //число
            if (!isNaN(parseFloat(token))) {
                rpn.push(parseFloat(token));
                prev = 'number';
            } 
            //оператор
            else if (token in this.ops) {
                let op = token;
                // определяем унарный минус
                if (token == '-' && (prev == null || prev == 'operator' || prev == '(' || prev == 'func')) op = '~';

                while (
                    stack.length > 0 &&
                    stack[stack.length - 1] !== '(' &&
                    (
                        (this.ops[op].assoc == 'L' &&
                        this.ops[stack[stack.length - 1]].prior >= this.ops[op].prior) ||
                        (this.ops[op].assoc == 'R' &&
                        this.ops[stack[stack.length - 1]].prior > this.ops[op].prior)
                    )
                ) {
                    rpn.push(stack.pop());
                }
                stack.push(op);
                prev = 'operator';
            } 
            else if (token in this.func) {
                stack.push(token);
                prev = 'func';
            }
            // открывающая скобка
            else if (token == '(') {
                stack.push(token);
                prev = token;
            } 
            // закрывающая скобка
            else if (token == ')') {
                while (stack.length>0 && stack[stack.length-1] !== '(') {
                    rpn.push(stack.pop());
                }
                stack.pop(); // удаляем '('
                prev = token;
            }
        }

        // оставшиеся операторы
        while (stack.length > 0) {
            rpn.push(stack.pop());
        }
        console.log(rpn)
        return rpn;
    }

    evalRPN(exp){
        let rpn = this.shuntingYard(exp);
        let stack = []

        for (const token of rpn) {
            //число
            if (!isNaN(token)) { 
                stack.push(token);
            } 
            //факториал
            else if (token === '!') {
                stack.push(this.factorial(stack.pop()));
            } 
            //квадратный корень
            else if (token === '√') {
                stack.push(Math.sqrt(stack.pop()));
            } 
            //функция
            else if (token in this.func) {
                let f = this.func[token];

                if (stack.length < f.args) {
                    throw new Error("Недостаточно аргументов для функции " + token);
                }

                stack.push(f.fn(stack.pop()));
            } 
            //оператор
            else if (token in this.ops) {     
                let op = this.ops[token];

                if (stack.length<op.args) {
                    throw new Error("Недостаточно аргументов для " + token);
                }

                if (op.args == 1) {
                    let a = stack.pop();

                    switch (token) {
                        case '~': stack.push(-a); break;
                    }

                } else {
                    let b = stack.pop();
                    let a = stack.pop();

                    switch (token) {
                        case '+': stack.push(a+b); break;
                        case '-': stack.push(a-b); break;
                        case '*': stack.push(a*b); break;
                        case '/': stack.push(a/b); break;
                        case '^': stack.push(Math.pow(a, b)); break;
                        case 'root': stack.push(Math.pow(b, 1/a)); break;
                    }
                }
            }
        }

        if (stack.length != 1) {
            return "Error";
        }
        stack = Math.round(stack * 10000)/10000;
        console.log(stack)
        return stack;
    }

    factorial(n) {
        let res = 1;

        if (n == 0) return 1;
        else {
            for (let i =n;i>0; i--) res *= i;
        }
        return res;
    }
}


