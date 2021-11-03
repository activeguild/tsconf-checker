import chalk from 'chalk';
import { parseNative, TSConfckParseNativeError } from 'tsconfck';
import { CompilerOptions } from 'typescript';
import message from './message.json';

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

export const checkCompilerOptions = (
    conpilerOptions: CompilerOptionsExtends
): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    errMsgs.push(...checkStrictOptions(conpilerOptions));
    errMsgs.push(...checkJsOptions(conpilerOptions));
    errMsgs.push(...checkDeprecatedOptions(conpilerOptions));
    errMsgs.push(...checkJsxOptions(conpilerOptions));
    errMsgs.push(...checkRecommendOptinos(conpilerOptions));

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
export const checkStrictOptions = ({
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
                replaceMessageArgs(message.checkStrictOptions.strict, key)
            );
        }
    }

    return errMsgs;
};

export const checkJsOptions = ({
    allowJs,
    checkJs,
    maxNodeModuleJsDepth,
}: CompilerOptionsExtends): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    if (!allowJs) {
        if (checkJs) {
            errMsgs.push(message.checkJsOptions.checkJs);
        }
        if (maxNodeModuleJsDepth !== undefined) {
            errMsgs.push(message.checkJsOptions.maxNodeModuleJsDepth);
        }
    }
    return errMsgs;
};

export const checkDeprecatedOptions = ({
    out,
    suppressExcessPropertyErrors,
    suppressImplicitAnyIndexErrors,
    reactNamespace,
}: CompilerOptionsExtends): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    if (out) {
        errMsgs.push(message.checkDeprecatedOptions.out);
    }

    if (suppressExcessPropertyErrors) {
        errMsgs.push(
            message.checkDeprecatedOptions.suppressExcessPropertyErrors
        );
    }

    if (suppressImplicitAnyIndexErrors) {
        errMsgs.push(
            message.checkDeprecatedOptions.suppressImplicitAnyIndexErrors
        );
    }

    if (reactNamespace) {
        errMsgs.push(message.checkDeprecatedOptions.reactNamespace);
    }
    return errMsgs;
};

export const checkRecommendOptinos = ({
    skipLibCheck,
    esModuleInterop,
    forceConsistentCasingInFileNames,
}: CompilerOptionsExtends): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    if (skipLibCheck) {
        errMsgs.push(message.checkRecommendOptinos.skipLibCheck);
    }

    if (esModuleInterop) {
        errMsgs.push(message.checkRecommendOptinos.esModuleInterop);
    }

    if (forceConsistentCasingInFileNames) {
        errMsgs.push(
            message.checkRecommendOptinos.forceConsistentCasingInFileNames
        );
    }

    return errMsgs;
};

export const checkJsxOptions = ({
    jsx,
    jsxFactory,
    jsxFragmentFactory,
}: CompilerOptionsExtends) => {
    const errMsgs: ErrMsg[] = [];

    // [Note]: Native Error
    // const validJsxEmits = Object.entries(JsxEmit).reduce<string[]>(
    //     (prev, [key, value]) => {
    //         if (Number.isFinite(Number(key)) || Number(value) === 0) {
    //             return prev;
    //         }
    //         return [...prev, key];
    //     },
    //     []
    // );
    // if (jsx !== undefined && !validJsxEmits.includes(JsxEmit[jsx])) {
    //     errMsgs.push(
    //         `'jsx' option must be set to ${validJsxEmits.join(', ')}.`
    //     );
    // }
    if (!jsxFactory && jsxFragmentFactory) {
        errMsgs.push(message.checkJsxOptions.jsxFragmentFactory);
    }
    return errMsgs;
};

const replaceMessageArgs = (src: string, ...args: string[]) => {
    for (let i = 0; i < args.length; i++) {
        src.replace(`value${i}`, args[i]);
    }

    return src;
};

main();
