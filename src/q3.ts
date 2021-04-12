import { ClassExp, ProcExp, Exp, Program, IfExp, makeBoolExp, makeVarRef, makeLitExp } from "./L31-ast";
import { Result, makeFailure } from "../shared/result";
import { is, isEmpty, map } from "ramda";
import { AppExp, Binding, CExp, isCExp, makeAppExp, makeIfExp, makePrimOp, makeProcExp, makeStrExp, makeVarDecl, VarDecl } from "../imp/L3-ast";
import { METHODS } from "node:http";
import { first, rest } from "../shared/list";
import exp from "node:constants";
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
    makeFailure("TODO");
