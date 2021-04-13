import { isNumber } from '../shared/type-predicates';
import { Result, makeOk } from '../shared/result';
import { map } from 'ramda';
import {isBoolExp, isProcExp, isAppExp, isDefineExp,
        isIfExp, isNumExp, isVarRef, isPrimOp, isProgram,
        Exp, Program, AppExp, PrimOp, VarDecl, ProcExp} from "../imp/L3-ast";


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

/*
Purpose: unparse the Exp or Program into a string in python
Signature: unparsel2ToPython(l2AST)
Type: [EXP | Program] => string
*/
export const unparsel2ToPython = (exp: Exp | Program): string =>
    isBoolExp(exp) ? valueToString(exp.val) :
    isNumExp(exp) ? valueToString(exp.val) :
    isVarRef(exp) ? exp.var :
    isProcExp(exp) ? `${unparseProcExp2Python(exp)}` :
    isIfExp(exp) ? `(${unparsel2ToPython(exp.then)} if ${unparsel2ToPython(exp.test)} else ${unparsel2ToPython(exp.alt)})` :
    isAppExp(exp) ? `${unparseL2PythonApp(exp)}` :
    isPrimOp(exp) ? opToString(exp) :
    isDefineExp(exp) ? `${exp.var.var} = ${unparsel2ToPython(exp.val)}` :
    isProgram(exp) ? `${unparseL2PythonExps(exp.exps)}` :
    "";     // Temporary only!!

/*
Purpose: procExp into a string in python
Signature: unparseProcExp2Python(ProcExp)
Type: [ProcExp] => string
*/
export const unparseProcExp2Python = (pe: ProcExp): string => 
    `(lambda ${map((p: VarDecl) => p.var, pe.args).join(",")} : ${unparseL2PythonExps(pe.body)})`
// Deleted the whitespace after every , in the arguments. Yet this doesn't feel right. Why not have the whitespace?


/*
Purpose: Unparse multiple expressions into a string
Signature: unparseL2PythonExps(Exp[])
Type: [Exp[]] => string
*/
export const unparseL2PythonExps = (les: Exp[]): string =>
    map(unparsel2ToPython, les).join("\n");


/*
Purpose: check wether app is PrimOp/ProcExp/other and send to the relevant unparser
Signature: unparseL2PythonApp(AppExp)
Type: [AppExp] => string
*/
export const unparseL2PythonApp = (app: AppExp): string =>
    isPrimOp(app.rator) ? `(${unparseLExpsWithPrimOp(app.rands, app.rator)})`:
    isProcExp(app.rator) ? `${unparseProcExp2Python(app.rator)}(${map(unparsel2ToPython, app.rands).join(",")})`:
    `${unparsel2ToPython(app.rator)}(${map(unparsel2ToPython, app.rands).join(",")})`;


/*
Purpose: unparse an expression with a primop operator
Signature: unparseLExpsWithPrimOp(Exp[], PrimOp)
Type: [Exp[], PrimOp] => string
*/
export const unparseLExpsWithPrimOp = (les: Exp[], op: PrimOp): string =>
    les.length === 0 ? opToString(op) :
    les.length === 1 ? opToString(op) + " " + unparsel2ToPython(les[0]) :
    (map(unparsel2ToPython, les.slice(0, les.length - 1)).join(" " + op.op + " ")).concat(" " + 
    opToString(op) + " " + unparsel2ToPython(les[les.length - 1]));

/*
Purpose: can return True/False , a number litteral or primop token
Signature: valueToString(Value)
Type: [Value] => string
*/    
export const valueToString = (val: Value): string =>
    isNumber(val) ?  val.toString() :
    val === true ? 'True' :
    val === false ? 'False' :
    isPrimOp(val) ? opToString(val):
    val;

/*
Purpose: Convert primOp litteral in L2 into a litteral in python
Signature: opToString(PrimOp)
Type: [PrimOp] => string
*/   
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