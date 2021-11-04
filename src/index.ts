import chalk from 'chalk';
import { parseNative, TSConfckParseNativeError } from 'tsconfck';
import { CompilerOptions } from 'typescript';
import message from './message.json';

type CompilerOptionsExtends = CompilerOptions & {
    out?: string;
};

type ErrMsg = string;

export const checkTsconf = async (fileName: string) => {
    const errMsgs: ErrMsg[] = [];

    try {
        const tsConfigFile = await parseNative(fileName);

        for (const error of tsConfigFile.result.errors) {
            errMsgs.push(`Warning: ${chalk.yellow(error.messageText)}`);
        }
        const { compilerOptions }: { compilerOptions: CompilerOptionsExtends } =
            tsConfigFile.tsconfig;

        errMsgs.push(...checkCompilerOptions(compilerOptions));
    } catch (e: unknown) {
        if (e instanceof TSConfckParseNativeError) {
            errMsgs.push(`Warning: ${e.diagnostic.messageText}`);
        } else if (e instanceof Error) {
            errMsgs.push(`Error: ${e.name}\n${e.message}\n${e.stack}`);
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
    errMsgs.push(...checkDefaultOptions(conpilerOptions));

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
    exactOptionalPropertyTypes,
    skipLibCheck,
    esModuleInterop,
    forceConsistentCasingInFileNames,
}: CompilerOptionsExtends): ErrMsg[] => {
    const errMsgs: ErrMsg[] = [];

    if (exactOptionalPropertyTypes) {
        errMsgs.push(message.checkRecommendOptinos.skipLibCheck);
    }

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

export const checkDefaultOptions = ({
    exactOptionalPropertyTypes,
    noFallthroughCasesInSwitch,
    noImplicitOverride,
    noImplicitReturns,
    noPropertyAccessFromIndexSignature,
    noUncheckedIndexedAccess,
    noUnusedLocals,
    noUnusedParameters,
    allowUmdGlobalAccess,
    resolveJsonModule,
    declarationMap,
    downlevelIteration,
    emitBOM,
    emitDeclarationOnly,
    importHelpers,
    inlineSourceMap,
    inlineSources,
    noEmit,
    noEmitHelpers,
    noEmitOnError,
    preserveValueImports,
    removeComments,
    sourceMap,
    disableSizeLimit,
    esModuleInterop,
    forceConsistentCasingInFileNames,
    isolatedModules,
    preserveSymlinks,
    keyofStringsOnly,
    noImplicitUseStrict,
    noStrictGenericChecks,
    suppressExcessPropertyErrors,
    suppressImplicitAnyIndexErrors,
    emitDecoratorMetadata,
    experimentalDecorators,
    noLib,
    diagnostics,
    explainFiles,
    extendedDiagnostics,
    listEmittedFiles,
    listFiles,
    traceResolution,
    composite,
    disableReferencedProjectLoad,
    disableSolutionSearching,
    disableSourceOfProjectReferenceRedirect,
    noErrorTruncation,
    preserveWatchOutput,
    skipDefaultLibCheck,
    skipLibCheck,
    maxNodeModuleJsDepth,
    charset,
    pretty,
}: CompilerOptionsExtends) => {
    const errMsgs: ErrMsg[] = [];

    const defaultOptions = {
        exactOptionalPropertyTypes,
        noFallthroughCasesInSwitch,
        noImplicitOverride,
        noImplicitReturns,
        noPropertyAccessFromIndexSignature,
        noUncheckedIndexedAccess,
        noUnusedLocals,
        noUnusedParameters,
        allowUmdGlobalAccess,
        resolveJsonModule,
        declarationMap,
        downlevelIteration,
        emitBOM,
        emitDeclarationOnly,
        importHelpers,
        inlineSourceMap,
        inlineSources,
        noEmit,
        noEmitHelpers,
        noEmitOnError,
        preserveValueImports,
        removeComments,
        sourceMap,
        disableSizeLimit,
        esModuleInterop,
        forceConsistentCasingInFileNames,
        isolatedModules,
        preserveSymlinks,
        keyofStringsOnly,
        noImplicitUseStrict,
        noStrictGenericChecks,
        suppressExcessPropertyErrors,
        suppressImplicitAnyIndexErrors,
        emitDecoratorMetadata,
        experimentalDecorators,
        noLib,
        diagnostics,
        explainFiles,
        extendedDiagnostics,
        listEmittedFiles,
        listFiles,
        traceResolution,
        composite,
        disableReferencedProjectLoad,
        disableSolutionSearching,
        disableSourceOfProjectReferenceRedirect,
        noErrorTruncation,
        preserveWatchOutput,
        skipDefaultLibCheck,
        skipLibCheck,
    };

    for (const key of Object.keys(
        defaultOptions
    ) as (keyof typeof defaultOptions)[]) {
        if (defaultOptions[key] === false) {
            errMsgs.push(
                replaceMessageArgs(message.checkDefaultOprions.default, key)
            );
        }
    }

    if (maxNodeModuleJsDepth === 0) {
        errMsgs.push(message.checkDefaultOprions.maxNodeModuleJsDepth);
    }

    if (charset === 'utf-8') {
        errMsgs.push(message.checkDefaultOprions.charset);
    }

    if (pretty === true) {
        errMsgs.push(message.checkDefaultOprions.pretty);
    }

    return errMsgs;
};

const replaceMessageArgs = (src: string, ...args: string[]) => {
    for (let i = 0; i < args.length; i++) {
        src = src.replace(`value${i}`, args[i]);
    }

    return src;
};
