import chalk from 'chalk';
import { parseNative } from 'tsconfck';
import { CompilerOptions } from 'typescript';

type ErrMsgs = string[];

export const main = async () => {
    const tsConfigFile = await parseNative('index.ts');
    const { compilerOptions }: { compilerOptions: CompilerOptions } =
        tsConfigFile.tsconfig;

    const errMsgs = CheckCompilerOptions(compilerOptions);

    if (errMsgs.length === 0) {
        console.log(chalk.green('Success!!'));
    } else {
        for (const errMsg of errMsgs) {
            console.log(chalk.yellow(errMsg));
        }
    }
};

const CheckCompilerOptions = (conpilerOptions: CompilerOptions): ErrMsgs[] => {
    const errMsgs: ErrMsgs[] = [];

    errMsgs.push(CheckStrictOptions(conpilerOptions));

    return errMsgs;
};

const CheckStrictOptions = ({
    strict,
    noImplicitAny,
    noImplicitThis,
    strictNullChecks,
    strictFunctionTypes,
    strictBindCallApply,
    strictPropertyInitialization,
    alwaysStrict,
    useUnknownInCatchVariables,
}: CompilerOptions): ErrMsgs => {
    const errMsgs: ErrMsgs = [];

    if (strict !== undefined && !strict) {
        return errMsgs;
    }

    const strictOptions = {
        noImplicitAny,
        noImplicitThis,
        strictNullChecks,
        strictFunctionTypes,
        strictBindCallApply,
        strictPropertyInitialization,
        alwaysStrict,
        useUnknownInCatchVariables,
    };

    for (const key of Object.keys(
        strictOptions
    ) as (keyof typeof strictOptions)[]) {
        if (strictOptions[key]) {
            errMsgs.push('Warning');
        }
    }

    return errMsgs;
};

// export type StrictOptionName =
// | "noImplicitAny"
// | "noImplicitThis"x
// | "strictNullChecks"
// | "strictFunctionTypes"
// | "strictBindCallApply"
// | "strictPropertyInitialization"
// | "alwaysStrict"
// | "useUnknownInCatchVariables"
const strictCheck = () => {};

main();
