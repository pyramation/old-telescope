import * as t from '@babel/types';
import { getEnumFromJsonName, getEnumToJsonName } from './types';
import { identifier, tsEnumMember, functionDeclaration, makeCommentBlock, cleanComment } from '../../utils';
import { ProtoEnum } from '@osmonauts/types';
import { ProtoParseContext } from '../context';

const getEnumValues = (proto: ProtoEnum) => {
    const enums = Object.keys(proto.values).map(key => {
        const e = {
            name: key,
            comment: null,
            value: null
        };
        e.value = proto.values[key];
        if (proto.comments[key]) {
            e.comment = proto.comments[key];
        }
        return e;
    });
    return enums;
}

const ensureOneSpace = (str) => {
    if (/^[\s\n\t]+/.test(str)) return str;
    return ` ${str}`;
}

const processEnumComment = (e: ProtoEnum) => {
    const comment = e.comment;

    if (!/[\n]+/.test(comment)) {
        return `* ${e.name} - ${comment} `;
    }
    let lines = comment.split('\n');
    lines = ['*', ...lines, ' '];
    const comments = lines.map((line, i) => {
        if (i == 0) return line;
        if (i == 1) return ` * ${e.name} - ${cleanComment(line)}`;
        if (i == (lines.length - 1)) return cleanComment(line);
        return ` *${ensureOneSpace(cleanComment(line))}`
    });
    return comments.join('\n');
};

export const createProtoEnum = (
    context: ProtoParseContext,
    name: string,
    proto: ProtoEnum
) => {
    const enums = getEnumValues(proto);
    const values = enums.map(e => {
        return tsEnumMember(
            t.identifier(e.name),
            t.numericLiteral(e.value),
            e.comment ? [{
                type: 'CommentBlock',
                // @ts-ignore
                value: processEnumComment(e)
            }] : []
        );
    })
    const declaration = t.exportNamedDeclaration(
        t.tsEnumDeclaration(
            t.identifier(name),
            [
                ...values,
                // default
                tsEnumMember(
                    t.identifier('UNRECOGNIZED'),
                    t.unaryExpression('-', t.numericLiteral(1)),
                    null
                ),
            ]
        )
    );

    if (proto.comment) {
        declaration.leadingComments = [
            makeCommentBlock(proto.comment)
        ];
    }

    return declaration;
};

export const createProtoEnumFromJSON = (
    context: ProtoParseContext,
    name: string,
    proto: ProtoEnum
) => {

    const enums = getEnumValues(proto);
    const switches = enums.reduce((m, e) => {
        m.push(t.switchCase(t.numericLiteral(e.value), []));
        m.push(t.switchCase(t.stringLiteral(e.name), [
            t.returnStatement(t.memberExpression(
                t.identifier(name),
                t.identifier(e.name)
            ))
        ]));
        return m;
    }, []);

    const unrecognizedEnums = [
        t.switchCase(t.stringLiteral('UNRECOGNIZED'), [])
    ];

    return t.exportNamedDeclaration(
        functionDeclaration(
            t.identifier(getEnumFromJsonName(name)),
            [
                identifier('object', t.tsTypeAnnotation(t.tsAnyKeyword()))
            ],
            t.blockStatement([
                t.switchStatement(
                    t.identifier('object'),
                    [
                        ...switches,
                        // default
                        t.switchCase(t.unaryExpression('-', t.numericLiteral(1)), []),
                        ...unrecognizedEnums,
                        t.switchCase(
                            null, [
                            t.returnStatement(t.memberExpression(
                                t.identifier(name),
                                t.identifier('UNRECOGNIZED')
                            ))
                        ])
                    ]
                )
            ]),
            false,
            false,
            t.tsTypeAnnotation(t.tsTypeReference(
                t.identifier(name)
            ))
        )
    )
};

export const createProtoEnumToJSON = (
    context: ProtoParseContext,
    name: string,
    proto: ProtoEnum
) => {

    const enums = getEnumValues(proto);
    const switches = enums.map(e => {
        return t.switchCase(
            t.memberExpression(
                t.identifier(name),
                t.identifier(e.name)
            ),
            [
                t.returnStatement(
                    t.stringLiteral(e.name)
                )
            ]
        );
    });

    const unrecognizedEnums = [
        t.switchCase(
            t.memberExpression(
                t.identifier(name),
                t.identifier('UNRECOGNIZED')
            ),
            []
        )
    ];

    return t.exportNamedDeclaration(
        functionDeclaration(
            t.identifier(getEnumToJsonName(name)),
            [
                identifier('object', t.tsTypeAnnotation(
                    t.tsTypeReference(t.identifier(name))
                ))
            ],
            t.blockStatement([
                t.switchStatement(
                    t.identifier('object'),
                    [
                        ...switches,
                        // unrecognized
                        ...unrecognizedEnums,
                        // default
                        t.switchCase(
                            null,
                            [
                                t.returnStatement(
                                    t.stringLiteral('UNRECOGNIZED')
                                )
                            ]
                        )
                    ]
                )
            ]),
            false,
            false,
            t.tsTypeAnnotation(
                t.tsStringKeyword()
            )
        )
    )
};
