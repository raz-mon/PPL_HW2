//import { Exp, Program } from '../imp/L3-ast';
import { isNumber, isArray, isString } from '../shared/type-predicates';
import { Result, makeFailure, makeOk } from '../shared/result';
//import { unparseL31 } from './L31-ast';
import { parse as p, isSexpString, isToken, isCompoundSexp } from "../shared/parser";       // added isCompundSexp
import { append, is, map } from 'ramda';
import { first } from '../shared/list';

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

// SExp
export interface CompoundSExp {
    tag: "CompoundSexp";
    val1: SExpValue;
    val2: SExpValue;
}
export interface EmptySExp {
    tag: "EmptySExp";
}


export type Value = SExpValue;
export type SExpValue = number | boolean | PrimOp;
//export type SExpValue = number | boolean | string | PrimOp | EmptySExp | CompoundSExp;

export type Exp = DefineExp | CExp;
export type AtomicExp = NumExp | BoolExp | PrimOp | VarRef;
//export type AtomicExp = NumExp | BoolExp | StrExp | PrimOp | VarRef;
export type CompoundExp = AppExp | IfExp | ProcExp;
//export type CompoundExp = AppExp | IfExp | ProcExp | LetExp;                              
export type CExp =  AtomicExp | CompoundExp;

export interface Program {tag: "Program"; exps: Exp[]; }
export interface DefineExp {tag: "DefineExp"; var: VarDecl; val: CExp; }
export interface NumExp {tag: "NumExp"; val: number; }
export interface BoolExp {tag: "BoolExp"; val: boolean; }
export interface StrExp {tag: "StrExp"; val: string; }
export interface PrimOp {tag: "PrimOp"; op: string; }
export interface VarRef {tag: "VarRef"; var: string; }
export interface VarDecl {tag: "VarDecl"; var: string; }
export interface AppExp {tag: "AppExp"; rator: CExp; rands: CExp[]; }
// L2
export interface IfExp {tag: "IfExp"; test: CExp; then: CExp; alt: CExp; }
export interface ProcExp {tag: "ProcExp"; args: VarDecl[], body: CExp[]; }
export interface Binding {tag: "Binding"; var: VarDecl; val: CExp; }
export interface LetExp {tag: "LetExp"; bindings: Binding[]; body: CExp[]; }


// Type predicates for disjoint types
export const isProgram = (x: any): x is Program => x.tag === "Program";
export const isDefineExp = (x: any): x is DefineExp => x.tag === "DefineExp";

export const isNumExp = (x: any): x is NumExp => x.tag === "NumExp";
export const isBoolExp = (x: any): x is BoolExp => x.tag === "BoolExp";
export const isStrExp = (x: any): x is StrExp => x.tag === "StrExp";
export const isPrimOp = (x: any): x is PrimOp => x.tag === "PrimOp";
export const isVarRef = (x: any): x is VarRef => x.tag === "VarRef";
export const isVarDecl = (x: any): x is VarDecl => x.tag === "VarDecl";
export const isAppExp = (x: any): x is AppExp => x.tag === "AppExp";
// L2
export const isIfExp = (x: any): x is IfExp => x.tag === "IfExp";
export const isProcExp = (x: any): x is ProcExp => x.tag === "ProcExp";
export const isBinding = (x: any): x is Binding => x.tag === "Binding";
export const isLetExp = (x: any): x is LetExp => x.tag === "LetExp";


// Printable form for values
export const compoundSExpToArray = (cs: CompoundSExp, res: string[]): string[] | { s1: string[], s2: string } =>
    isEmptySExp(cs.val2) ? append(valueToString(cs.val1), res) :
    isCompoundSExp(cs.val2) ? compoundSExpToArray(cs.val2, append(valueToString(cs.val1), res)) :
    ({ s1: append(valueToString(cs.val1), res), s2: valueToString(cs.val2)})
 
export const compoundSExpToString = (cs: CompoundSExp, css = compoundSExpToArray(cs, [])): string => 
    isArray(css) ? `(${css.join(' ')})` :
    `(${css.s1.join(' ')} . ${css.s2})`

export const makeEmptySExp = (): EmptySExp => ({tag: "EmptySExp"});
export const isEmptySExp = (x: any): x is EmptySExp => x.tag === "EmptySExp";

export const makeCompoundSExp = (val1: SExpValue, val2: SExpValue): CompoundSExp =>
    ({tag: "CompoundSexp", val1: val1, val2 : val2});
export const isCompoundSExp = (x: any): x is CompoundSExp => x.tag === "CompoundSexp";


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
    isProcExp(exp) ? unparseProcExp2Python(exp) :
    isIfExp(exp) ? `(${unparsel2ToPython(exp.then)} if ${unparsel2ToPython(exp.test)} else ${unparsel2ToPython(exp.alt)})` :
    isAppExp(exp) ? unparseL2PythonApp(exp) :
    isPrimOp(exp) ? opToString(exp) :
    isDefineExp(exp) ? `${exp.var.var} = ${unparsel2ToPython(exp.val)}` :
    isProgram(exp) ? `${unparseL2PythonExps(exp.exps)}` :
    exp;


export const unparseProcExp2Python = (pe: ProcExp): string => 
    `(lambda ${map((p: VarDecl) => p.var, pe.args).join(", ")} : ${unparseL2PythonExps(pe.body)})`

export const unparseL2PythonExps = (les: Exp[]): string =>
    map(unparsel2ToPython, les).join(" ");

export const unparseL2PythonApp = (app: AppExp): string =>
    isPrimOp(app.rator) ? `(${unparseLExpsWithPrimOp(app.rands, app.rator)})`:
    isProcExp(app.rator) ? `(${unparseProcExp2Python(app.rator)} (${map(unparsel2ToPython, app.rands).join(",")}))`:
    `${unparsel2ToPython(app.rator)}(${map(unparsel2ToPython, app.rands).join(",")})`;


export const unparseLExpsWithPrimOp = (les: Exp[], op: PrimOp): string =>
    les.length === 1 ? unparsel2ToPython(les[0]) :
    (map(unparsel2ToPython, les.slice(0, les.length - 1)).join(" " + op.op)).concat(" " + unparsel2ToPython(les[length - 1]));

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
    primOp.op === "=" ? '=' :
    primOp.op === "eq?" ? '==' :
    primOp.op === "and" ? '&&' :
    primOp.op === "or" ? '||' :
    primOp.op === "not" ? '!' :
    primOp.op === "boolean?" ? '(lambda x : (type(x) == bool)' :
    primOp.op === "number?" ? '(lambda x : (type(x) == number)' :
    primOp.op;

