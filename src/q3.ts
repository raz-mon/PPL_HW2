import { ClassExp, ProcExp, Exp, Program, IfExp, makeBoolExp } from "./L31-ast";
import { Result, makeFailure } from "../shared/result";
import { is, isEmpty, map } from "ramda";
import { Binding, CExp, makeAppExp, makeIfExp, makePrimOp, makeProcExp, makeStrExp, VarDecl } from "../imp/L3-ast";
import { METHODS } from "node:http";
import { first, rest } from "../shared/list";
import exp from "node:constants";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/

export const class2proc = (exp: ClassExp): ProcExp => {
    const vars = map((b) => b.var, exp.methods);    // VarDecl[]
    const vals = map((b) => b.val, exp.methods) as CExp[];    // CExp[]
    const x = (msg: VarDecl[]) => (makeProcExp(msg, [rewriteNewIfExp(first(msg), vars, vals)]));
    const y = makeProcExp(exp.fields, x(msg));
    return y;
}

export const rewriteNewIfExp = (msg: VarDecl, vars: VarDecl[], vals: CExp[]): CExp => {
    //  AppExp[eq?, [msg, mtd.name]]
    let x = makeAppExp(makePrimOp("eq?"), [makeStrExp(msg.var), makeStrExp(first(vars).var)]);
    if(vars.length === 1 && vals.length === 1){
        return makeIfExp(x, first(vals), makeBoolExp(false));
    }else{
        return makeIfExp(x, first(vals), rewriteNewIfExp(msg, rest(vars), rest(vals)));
    }
}


/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    makeFailure("TODO");
