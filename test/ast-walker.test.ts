import 'mocha';
import { AstWalker } from '../src/core/ast-walker';
import * as expect from 'expect.js';
import { ImportElement } from '../src/core/index';

interface AstTest {
    testName: string;
    text: string;
    expected: ImportElement;
}

suite('AstWalker tests', () => {

    const testCases: AstTest[] = [
        {
            testName: 'test1a',
            text: `import { a, c as cc, b } from 'test.js';`,
            expected: {
                endPosition: { line: 0, character: 40 },
                moduleSpecifierName: 'test.js',
                hasFromKeyWord: true,
                namedBindings: [
                    { name: 'a', aliasName: null },
                    { name: 'c', aliasName: 'cc' },
                    { name: 'b', aliasName: null }
                ],
                startPosition: { line: 0, character: 0 }
            }

        },

        {
            testName: 'test1b',
            text: `//comment
            import  {  a  ,
                    c  as  cc , b
                }
                from 'test.js';

                `,
            expected: {
                moduleSpecifierName: 'test.js',
                startPosition: { line: 1, character: 12 },
                endPosition: { line: 4, character: 31 },
                hasFromKeyWord: true,
                namedBindings: [
                    { name: 'a', aliasName: null },
                    { name: 'c', aliasName: 'cc' },
                    { name: 'b', aliasName: null }
                ]
            }
        },
        {
            testName: 'test1c',
            text: `import { a, c as cc, b } from "test.js"`,
            expected: {
                endPosition: { line: 0, character: 39 },
                moduleSpecifierName: 'test.js',
                hasFromKeyWord: true,
                namedBindings: [
                    { name: 'a', aliasName: null },
                    { name: 'c', aliasName: 'cc' },
                    { name: 'b', aliasName: null }
                ],
                startPosition: { line: 0, character: 0 }
            }
        }
    ];

    const getImports = (text: string) => {
        const walker = new AstWalker();
        const imports = walker.parseImports('nonExistantFile', text);
        return imports;
    };

    const astWalkerTest = (testName, text, expected) => {
        test(`AstWalker:  ${testName} produces correct result`, () => {
            const imports = getImports(text);
            expect(imports.length).to.be(1);
            expect(imports[0]).to.eql(expected);
        });
    };

    testCases.forEach(testElement => {
        astWalkerTest(testElement.testName, testElement.text, testElement.expected);
    });
});