//import { Exp, Program } from '../imp/L3-ast';
import { isNumber, isArray, isString } from '../shared/type-predicates';
import { Result, makeFailure, makeOk } from '../shared/result';
//import { unparseL31 } from './L31-ast';
import { parse as p, isSexpString, isToken, isCompoundSexp } from "../shared/parser";       // added isCompundSexp
import { append, is, map } from 'ramda';
import { first } from '../shared/list';


import {isBoolExp, isProcExp, isLetExp, isAppExp, isAtomicExp, isBinding, isCompoundExp, isDefineExp,
        isExp, isIfExp, isLitExp, isCExp, isNumExp, isVarDecl, isVarRef, isPrimOp, isProgram,
        Exp, Program, AppExp, PrimOp, VarDecl, ProcExp, parseL3Exp} from "../imp/L3-ast";


/*
<program> ::= (L2 <exp>+) // program(exps:List(exp))
<exp> ::= <define-exp> | <cexp>
<define-exp> ::= (define <var-decl> <cexp>) // def-exp(var:var-decl, val:cexp)
<cexp> ::= <num-exp> // num-exp(val:Number)
       | <bool-exp>  // bool-exp(val:Boolean)
       | <prim-op>   // prim-op(op:string)
       | <var-ref>   // var-ref(var:string)
       | (if <exp> <exp> <exp>) // if-exp(test,then,else)                                   ##### L2
       | (lambda (<var-decl>*) <cexp>+) // proc-exp(params:List(var-decl), body:List(cexp)) ##### L2
       | (<cexp> <cexp>*) // app-exp(rator:cexp, rands:List(cexp))
<prim-op> ::= + | - | * | / | < | > | = | not
<num-exp> ::= a number token
<bool-exp> ::= #t | #f
<var-ref> ::= an identifier token
<var-decl> ::= an identifier token
*/
export type Value = SExpValue;
export type SExpValue = number | boolean | PrimOp;

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
    makeOk(unparsel2ToPython(exp));

export const unparsel2ToPython = (exp: Exp | Program): string =>
    isBoolExp(exp) ? valueToString(exp.val) :
    isNumExp(exp) ? valueToString(exp.val) :
    //isStrExp(exp) ? valueToString(exp.val) :
    isVarRef(exp) ? exp.var :
    isProcExp(exp) ? `${unparseProcExp2Python(exp)}` :
    isIfExp(exp) ? `(${unparsel2ToPython(exp.then)} if ${unparsel2ToPython(exp.test)} else ${unparsel2ToPython(exp.alt)})` :
    isAppExp(exp) ? `${unparseL2PythonApp(exp)}` :
    isPrimOp(exp) ? opToString(exp) :
    isDefineExp(exp) ? `${exp.var.var} = ${unparsel2ToPython(exp.val)}` :
    isProgram(exp) ? `${unparseL2PythonExps(exp.exps)}` :
    //exp;
    "";     // Temporary only!!

export const unparseProcExp2Python = (pe: ProcExp): string => 
    `(lambda ${map((p: VarDecl) => p.var, pe.args).join(",")} : ${unparseL2PythonExps(pe.body)})`
// Deleted the whitespace after every , in the arguments. Yet this doesn't feel right. Why not have the whitespace?

export const unparseL2PythonExps = (les: Exp[]): string =>
    map(unparsel2ToPython, les).join("\n");

export const unparseL2PythonApp = (app: AppExp): string =>
    isPrimOp(app.rator) ? `(${unparseLExpsWithPrimOp(app.rands, app.rator)})`:
    isProcExp(app.rator) ? `${unparseProcExp2Python(app.rator)}(${map(unparsel2ToPython, app.rands).join(",")})`:
    `${unparsel2ToPython(app.rator)}(${map(unparsel2ToPython, app.rands).join(",")})`;


export const unparseLExpsWithPrimOp = (les: Exp[], op: PrimOp): string =>
    les.length === 0 ? opToString(op) :
    les.length === 1 ? opToString(op) + " " + unparsel2ToPython(les[0]) :
    (map(unparsel2ToPython, les.slice(0, les.length - 1)).join(" " + op.op + " ")).concat(" " + 
    opToString(op) + " " + unparsel2ToPython(les[les.length - 1]));
    
export const valueToString = (val: Value): string =>
    isNumber(val) ?  val.toString() :
    val === true ? 'True' :
    val === false ? 'False' :
    isPrimOp(val) ? opToString(val):
    val;

export const opToString = (primOp: PrimOp): string =>
    primOp.op === "+" ? '+' :
    primOp.op === "*" ? '*' :
    primOp.op === "-" ? '-' :
    primOp.op === "/" ? '/' :
    primOp.op === ">" ? '>' :
    primOp.op === "<" ? '<' :
    primOp.op === "=" ? '==' :
    primOp.op === "eq?" ? '==' :
    primOp.op === "and" ? '&&' :
    primOp.op === "or" ? '||' :
    primOp.op === "not" ? 'not' :
    primOp.op === "boolean?" ? '(lambda x : (type(x) == bool)' :
    primOp.op === "number?" ? '(lambda x : (type(x) == number)' :
    primOp.op;

