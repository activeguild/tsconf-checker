import {
    checkDeprecatedOptions,
    checkJsOptions,
    checkJsxOptions,
    checkRecommendOptinos,
    checkStrictOptions,
} from './index';
import message from './message.json';

test('checkStrictOptions', () => {
    expect(checkStrictOptions({ strict: true, noImplicitAny: true })).toEqual([
        "Warning: noImplicitAny is implicitly true because 'strict' option is true.",
    ]);
});

test('checkJsOptions', () => {
    expect(checkJsOptions({ allowJs: false, checkJs: true })).toEqual([
        message.checkJsOptions.checkJs,
    ]);
    expect(checkJsOptions({ allowJs: false, maxNodeModuleJsDepth: 1 })).toEqual(
        [message.checkJsOptions.maxNodeModuleJsDepth]
    );
});

test('checkDeprecatedOptions', () => {
    expect(checkDeprecatedOptions({ out: './' })).toEqual([
        message.checkDeprecatedOptions.out,
    ]);
    expect(
        checkDeprecatedOptions({ suppressExcessPropertyErrors: true })
    ).toEqual([message.checkDeprecatedOptions.suppressExcessPropertyErrors]);
    expect(
        checkDeprecatedOptions({ suppressImplicitAnyIndexErrors: true })
    ).toEqual([message.checkDeprecatedOptions.suppressImplicitAnyIndexErrors]);
    expect(checkDeprecatedOptions({ reactNamespace: 'test' })).toEqual([
        message.checkDeprecatedOptions.reactNamespace,
    ]);
});

test('checkRecommendOptinos', () => {
    expect(checkRecommendOptinos({ skipLibCheck: true })).toEqual([
        message.checkRecommendOptinos.skipLibCheck,
    ]);
    expect(checkRecommendOptinos({ esModuleInterop: true })).toEqual([
        message.checkRecommendOptinos.esModuleInterop,
    ]);
    expect(
        checkRecommendOptinos({ forceConsistentCasingInFileNames: true })
    ).toEqual([message.checkRecommendOptinos.forceConsistentCasingInFileNames]);
});

test('checkJsxOptions', () => {
    expect(checkJsxOptions({ jsxFragmentFactory: 'React.Fragment' })).toEqual([
        message.checkJsxOptions.jsxFragmentFactory,
    ]);
});
