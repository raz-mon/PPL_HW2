import { ClassExp, ProcExp, Program, makeBoolExp, makeVarRef, makeLitExp, isClassExp,
    isAtomicExp, isLetExp, isProcExp, isIfExp, isLitExp, isDefineExp, isExp, isAppExp,
    isProgram, makeLetExp, makeDefineExp, makeProgram, Exp, CExp, isCExp, makeAppExp, makeIfExp, 
    makePrimOp, makeProcExp, makeVarDecl, makeBinding, VarDecl } from "./L31-ast";
import { Result, makeOk } from "../shared/result";
import { map } from "ramda";
import { first, rest } from "../shared/list";
import { makeSymbolSExp } from "../imp/L3-value";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp => {
    const vars = map((b) => b.var, exp.methods);    // VarDecl[]
    const vals = map((b) => b.val, exp.methods) as CExp[];    // CExp[]
    const msg = makeVarDecl("msg");
    return makeProcExp(exp.fields, 
        [makeProcExp([msg], [rewriteNewIfExp(msg, vars, vals)])]);
}

/*
Purpose: construct nested IfExp, ends with #f
Signature: rewriteNewIfExp(msg: VarDecl, vars: VarDecl[], vals: CExp[])
Type: [VarDecl , VarDecl[], CExp[]] => CExp
*/
export const rewriteNewIfExp = (msg: VarDecl, vars: VarDecl[], vals: CExp[]): CExp =>
    vars.length === 1 && vals.length === 1 ?
    makeIfExp(makeAppExp(makePrimOp("eq?"), [makeVarRef(msg.var), makeLitExp(makeSymbolSExp( first(vars).var))])
    , makeAppExp(first(vals),[]), makeBoolExp(false)):
    makeIfExp(makeAppExp(makePrimOp("eq?"), [makeVarRef(msg.var), makeLitExp(makeSymbolSExp( first(vars).var))])
    , makeAppExp(first(vals),[]), rewriteNewIfExp(msg, rest(vars), rest(vals)));

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    makeOk(rewriteAllClass(exp));

/*
Purpose: construct L31AST without classExp
Signature: rewriteAllClass(l31AST)
Type: [Program | Exp] => Program | Exp
*/
export const rewriteAllClass = (exp: Program | Exp): Program | Exp =>
isExp(exp) ? rewriteAllClassExp(exp) :
isProgram(exp) ? makeProgram(map(rewriteAllClassExp, exp.exps)) :
exp; // never

/*
Purpose: construct L31AST without classExp
Signature: rewriteAllClass(exp: Exp)
Type: [Exp] => Exp
*/
const rewriteAllClassExp = (exp: Exp): Exp =>
isCExp(exp) ? rewriteAllClassCExp(exp) :
isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllClassCExp(exp.val)) :
exp; // never

/*
Purpose: construct L31AST without classExp
Signature: rewriteAllClassCExp(exp: CExp)
Type: [CExp] => CExp
*/
const rewriteAllClassCExp = (exp: CExp): CExp =>
isAtomicExp(exp) ? exp :
isLitExp(exp) ? exp :
isIfExp(exp) ? makeIfExp(rewriteAllClassCExp(exp.test),
                         rewriteAllClassCExp(exp.then),
                         rewriteAllClassCExp(exp.alt)) :
isAppExp(exp) ? makeAppExp(rewriteAllClassCExp(exp.rator),
                           map(rewriteAllClassCExp, exp.rands)) :
isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllClassCExp, exp.body)) :
isClassExp(exp) ? rewriteAllClassCExp(class2proc(exp)) :
isLetExp(exp) ? makeLetExp( exp.bindings.map( (b) => makeBinding(b.var.var, rewriteAllClassCExp(b.val) ) ), map(rewriteAllClassCExp, exp.body) ) :
exp; // never

