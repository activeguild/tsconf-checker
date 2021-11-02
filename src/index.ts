import chalk from 'chalk';
import { parseNative, TSConfckParseNativeError } from 'tsconfck';
import { CompilerOptions } from 'typescript';

type CompilerOptionsExtends = CompilerOptions & {
    out?: string;
};

type ErrMsg = string;

export const main = async () => {
    const errMsgs: ErrMsg[] = [];

    try {
        const tsConfigFile = await parseNative('index.ts');

        for (const error of tsConfigFile.result.errors) {
            errMsgs.push(`Warning: ${chalk.yellow(error.messageText)}`);
        }
        console.log('tsConfigFile :>> ', tsConfigFile.result.errors);
        const { compilerOptions }: { compilerOptions: CompilerOptionsExtends } =
            tsConfigFile.tsconfig;

        errMsgs.push(...checkCompilerOptions(compilerOptions));
    } catch (e: unknown) {
        if (e instanceof TSConfckParseNativeError) {
            errMsgs.push(`Warning: ${e.diagnostic.messageText}`);
        }
    }

    if (errMsgs.length === 0) {
        console.log(chalk.green('Success!!'));
    } else {
        for (const errMsg of errMsgs) {
            console.log(chalk.yellow(errMsg));
        }
    }
};

const checkCompilerOptions = (
    conpilerOptions: CompilerOptionsExtends
): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    errMsgs.push(...checkStrictOptions(conpilerOptions));
    errMsgs.push(...checkJsOptions(conpilerOptions));
    errMsgs.push(...checkDeprecatedOptions(conpilerOptions));
    // errMsgs.push(...checkJsxOptions(conpilerOptions));

    return errMsgs;
};

const checkStrictOptions = ({
    strict,
    noImplicitAny,
    noImplicitThis,
    strictNullChecks,
    strictFunctionTypes,
    strictBindCallApply,
    strictPropertyInitialization,
    alwaysStrict,
    useUnknownInCatchVariables,
}: CompilerOptionsExtends): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

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
            errMsgs.push(
                `Warning: '${key}' is implicitly true because 'strict' option is true.`
            );
        }
    }

    return errMsgs;
};

const checkJsOptions = ({
    allowJs,
    checkJs,
    maxNodeModuleJsDepth,
}: CompilerOptionsExtends): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    if (!allowJs) {
        if (checkJs) {
            errMsgs.push(
                `Warning: 'checkJs' option cannot be set to true when 'allowJs' option is false or undefined.`
            );
        }
        if (maxNodeModuleJsDepth !== undefined) {
            errMsgs.push(
                `Warning: 'maxNodeModuleJsDepth' cannot be set when 'allowJs' option is false or undefined.`
            );
        }
    }
    return errMsgs;
};

const checkDeprecatedOptions = ({
    out,
    suppressExcessPropertyErrors,
    suppressImplicitAnyIndexErrors,
    reactNamespace,
}: CompilerOptionsExtends): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    if (out) {
        errMsgs.push(
            `Warning: 'out' option is deprecated. Use 'outfile' option instead.`
        );
    }

    if (suppressExcessPropertyErrors) {
        errMsgs.push(
            `Warning: 'suppressExcessPropertyErrors' option is deprecated in modern codebases. Use '@ts-ignore' comment instead.`
        );
    }

    if (suppressImplicitAnyIndexErrors) {
        errMsgs.push(
            `Warning: 'suppressImplicitAnyIndexErrors' option is deprecated. Use '@ts-ignore' comment instead.`
        );
    }

    if (reactNamespace) {
        errMsgs.push(
            `Warning: 'reactNamespace' option is deprecated. Use 'jsxFactory' comment instead.`
        );
    }
    return errMsgs;
};

// [Note]: Native Error
// const checkJsxOptions = ({ jsx }: CompilerOptionsExtends) => {
//     const errMsgs: ErrMsg[] = [];
//     const validJsxEmits = Object.entries(JsxEmit).reduce<string[]>(
//         (prev, [key, value]) => {
//             if (Number.isFinite(Number(key)) || Number(value) === 0) {
//                 return prev;
//             }
//             return [...prev, key];
//         },
//         []
//     );

//     if (jsx !== undefined && !validJsxEmits.includes(JsxEmit[jsx])) {
//         errMsgs.push(
//             `'jsx' option must be set to ${validJsxEmits.join(', ')}.`
//         );
//     }

//     return errMsgs;
// };

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
