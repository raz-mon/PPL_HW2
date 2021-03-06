import { adjust, map, zipWith } from "ramda";
import { makeEmptySExp, makeSymbolSExp, SExpValue, makeCompoundSExp, valueToString } from '../imp/L3-value'
import { first, second, rest, allT, isEmpty } from "../shared/list";
import { isArray, isString, isNumericString, isIdentifier } from "../shared/type-predicates";
import { Result, makeOk, makeFailure, bind, mapResult, safe2, isOk } from "../shared/result";
import { parse as p, isSexpString, isToken } from "../shared/parser";
import { Sexp, Token } from "s-expression";

import {isBoolExp, isProcExp, isLetExp, isAppExp, isAtomicExp, isBinding, isCompoundExp, isDefineExp,
    isExp, isIfExp, isLitExp, isCExp, isNumExp, isVarDecl, isVarRef, isPrimOp, isProgram,
    Exp, Program, AppExp, PrimOp, VarDecl, ProcExp, parseL3} from "../imp/L3-ast";

//import "src/L31-ast.ts";
import {parseL31Exp, parseL31, unparseL31, parseL31CExp, isClassExp, ClassExp, CExp} from "../src/L31-ast"
import { class2proc , L31ToL3 } from "./q3";
import { parseL3CExp , parseL3Exp} from "../imp/L3-ast";
import { l2ToPython } from "../src/q4";

// (+ 3 5) ⇒ (3 + 5)

//console.log(l2ToPython(parseL3(`(L31 (+ 3 5))`)));
const l2ToPythonResult = (x: string): Result<string> =>
    bind(bind(p(x),parseL3Exp),l2ToPython);

console.log(bind(parseL3(`(L3 (+ 3 5 7))`), l2ToPython ))

console.log(l2ToPythonResult(`(= 3 (+ 1 2))`))
//console.log(bind(parseL3(`(L3 (- 3 5))`), l2ToPython ))

//const x = parseL31(`(L31 (+ 3 5))`)
//isOk(x)? console.log(l2ToPython(x.value))












// (bind(p(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`), parseL31Exp), L31ToL3)
//console.log(JSON.stringify(bind((bind(p(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`)
//                                    , parseL31Exp)), L31ToL3), null, 2));
          /*                          
console.log(JSON.stringify(bind(p(`(class (a b) ((first (lambda () a)) ))`), 
                    parseL31Exp ), null, 2) )
console.log("\n\n");
console.log(JSON.stringify(bind(p(`(class (a b) ((first (lambda () a)) ))`), 
        (s: Sexp) => bind(parseL31Exp(s),  L31ToL3 ) ), null, 2) )
*/
//console.log(JSON.stringify(bind(p(`(class (a b) ((first (class (a b) ((first (lambda () a)) ))) ))`), 
//        (s: Sexp) => bind(parseL31Exp(s),  L31ToL3 ) ), null, 2) )
/*
console.log(parseL31(`(L31 (+ 3 5 7))`));
console.log(JSON.stringify(parseL31(`(L31 (+ 3 5 7))`), null, 2));
*/
/*
console.log(p("1")); // { tag: 'Ok', value: '1' }
console.log(p("(1 2)")); // { tag: 'Ok', value: [ '1', '2' ] }
console.log(p("(+ 1 (* 2 3))")); // { tag: 'Ok', value: [ '+', '1', [ '*', '2', '3' ] ] }
console.log(p("(define x 5)")); // { tag: 'Ok', value: [ 'define', 'x', '5' ] }
*/

//console.log(p("1")); // { tag: 'Ok', value: '1' }
//console.log("%j", p(" ( y lambda (x) ( * 2 x ) ( lambda (x) ( 3 * x ) ) )"));
/*
console.log("%j", p(" ( first (lambda () a) )"));
console.log(p("a"));
const a = [1,2,3,4];
console.log(a.reduce( (acc: number[][], curr: number) => acc.concat([[curr]]) , []));
*/

 //console.log(parseL31(`(L31 (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b))))))`));
//console.log(JSON.stringify(parseL31(`(L31 (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b))))))`), null, 2));
//console.log(JSON.stringify(parseL31Exp(`(L31 (class (a b) ((first (lambda () a)) )))`), null, 2));






/*
const prgR: Result<Program> = parseL31(`(L31 (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b))))))`);
if(isOk(prgR)){
    let x = prgR.value.exps[0];
    //console.log(unparseL31(x));
    if(isClassExp(x)){
        console.log(unparseL31(class2proc(x)));
        //console.log(JSON.stringify(class2proc(x),null,2));
        const prgR2: Result<Program> = parseL31(`(L31 (lambda (a b) (lambda (msg) (if (eq? msg 'first) ((lambda () a) ) (if (eq? msg 'second) ((lambda () b) ) (if (eq? msg 'sum) ((lambda () (+ a b)) ) #f))))))`);
        if(isOk(prgR2)){
            let y = prgR2.value.exps[0];
            console.log(unparseL31(y));
            //console.log(JSON.stringify(y,null,2));
        }
    }

    //console.log(JSON.stringify(class2proc(x),null,2))  
    //console.log(JSON.stringify(x, null, 2));
}
*/

























//console.log(JSON.stringify(parseL31CExp(`(class (a b) ((first (lambda () a)) ))`), null, 2));

//const x = parseL31(`(L31 (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b))))))`);
//isOk(x) ? console.log(JSON.stringify(unparseL31(x.value), null, 2)) : ""

//console.log(JSON.stringify(parseL31(`(L31 (lambda (x) (* x x)))`), null, 2));

// console.log(bind(p(`(class (a b) ((first (lambda () a))))`), parseL31Exp));
// console.log(bind(p(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`), parseL31Exp));

// (bind(p(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`),parseL31Exp)

//console.log("%j", parseL31("( L31 (lambda (x) ( * 2 x) (lambda (x) ( 3 * x) ) ) )") ) ;
//console.log("%j", parseL31("( L31 (y lambda x (+ 2 x)))"));

/*
console.log(bind(p("1"), parseL31Exp));
console.log("%j", parseL31("( L31 1)"));  
console.log("%j", parseL31("( L31 (define x 1))"));
console.log("%j", parseL31("( L31 (define x 1) (define y 2))"));
*/

