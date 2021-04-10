import { adjust, map, zipWith } from "ramda";
import { makeEmptySExp, makeSymbolSExp, SExpValue, makeCompoundSExp, valueToString } from '../imp/L3-value'
import { first, second, rest, allT, isEmpty } from "../shared/list";
import { isArray, isString, isNumericString, isIdentifier } from "../shared/type-predicates";
import { Result, makeOk, makeFailure, bind, mapResult, safe2, isOk } from "../shared/result";
import { parse as p, isSexpString, isToken } from "../shared/parser";
import { Sexp, Token } from "s-expression";

//import "src/L31-ast.ts";
import {parseL31Exp, parseL31, unparseL31} from "../src/L31-ast"



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
console.log(JSON.stringify(parseL31(`(L31 (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b))))))`), null, 2));

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

