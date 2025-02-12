import { getNestedProto } from '@osmonauts/proto-parser';
import { expectCode, getTestProtoStore, printCode } from '../../../../../test-utils/'
import { ProtoParseContext } from '../../../context';
import { createSDKType, createProtoType, createProtoTypeType } from '..';
import { createAminoType } from '../amino';

const store = getTestProtoStore();
store.traverseAll();

describe('MsgDelegate', () => {
    const ref = store.findProto('cosmos/staking/v1beta1/tx.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('interface', () => {
        expectCode(createProtoType(context, 'MsgDelegate',
            getNestedProto(ref.traversed).MsgDelegate
        ));
    });
})

describe('MsgSend', () => {
    const ref = store.findProto('cosmos/bank/v1beta1/tx.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('interface', () => {
        expectCode(createProtoType(context, 'MsgSend',
            getNestedProto(ref.traversed).MsgSend
        ));
    });
    it('interface type', () => {
        expectCode(createProtoTypeType(context, 'MsgSend',
            getNestedProto(ref.traversed).MsgSend
        ));
    });
    it('api interface', () => {
        expectCode(createSDKType(context, 'MsgSend',
            getNestedProto(ref.traversed).MsgSend
        ));
    });
    it('amino interface', () => {
        expectCode(createAminoType(context, 'MsgSend',
            getNestedProto(ref.traversed).MsgSend
        ));
    });
    // it('interface', () => {
    //     expectCode(createObjectWithMethods(context, 'MsgSend',
    //         getNestedProto(ref.traversed).MsgSend
    //     ));
    // });
});

describe('PageRequest', () => {
    const ref = store.findProto('cosmos/base/query/v1beta1/pagination.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('interface', () => {
        expectCode(createProtoType(context, 'PageRequest',
            getNestedProto(ref.traversed).PageRequest
        ));
    });
    it('api interface', () => {
        expectCode(createSDKType(context, 'PageRequest',
            getNestedProto(ref.traversed).PageRequest
        ));
    });
});

describe('PageResponse', () => {
    const ref = store.findProto('cosmos/base/query/v1beta1/pagination.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('interface', () => {
        expectCode(createProtoType(context, 'PageResponse',
            getNestedProto(ref.traversed).PageResponse
        ));
    });
    it('api interface', () => {
        expectCode(createSDKType(context, 'PageResponse',
            getNestedProto(ref.traversed).PageResponse
        ));
    });
});

describe('cosmos/auth/v1beta1/auth.proto', () => {
    const ref = store.findProto('cosmos/auth/v1beta1/auth.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('BaseAccount', () => {
        expectCode(createProtoType(context, 'BaseAccount',
            getNestedProto(ref.traversed).BaseAccount
        ));
    });
    it('ModuleAccount', () => {
        expectCode(createProtoType(context, 'ModuleAccount',
            getNestedProto(ref.traversed).ModuleAccount
        ));
    });
});

describe('GenesisState', () => {
    const ref = store.findProto('cosmos/auth/v1beta1/genesis.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('interface', () => {
        expectCode(createProtoType(context, 'GenesisState',
            getNestedProto(ref.traversed).GenesisState
        ));
    });
});

describe('cosmos/authz/v1beta1/authz.proto', () => {
    const ref = store.findProto('cosmos/authz/v1beta1/authz.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('Grant Type', () => {
        expectCode(createProtoTypeType(context, 'Grant',
            getNestedProto(ref.traversed).Grant
        ));
    });
    it('GrantAuthorization Type', () => {
        expectCode(createProtoTypeType(context, 'GrantAuthorization',
            getNestedProto(ref.traversed).GrantAuthorization
        ));
    });
    it('Grant', () => {
        expectCode(createProtoType(context, 'Grant',
            getNestedProto(ref.traversed).Grant
        ));
    });
    it('GrantAuthorization', () => {
        expectCode(createProtoType(context, 'GrantAuthorization',
            getNestedProto(ref.traversed).GrantAuthorization
        ));
    });
});

describe('cosmos/authz/v1beta1/query.proto', () => {
    const ref = store.findProto('cosmos/authz/v1beta1/query.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('QueryGrantsRequest', () => {
        expectCode(createProtoType(context, 'QueryGrantsRequest',
            getNestedProto(ref.traversed).QueryGrantsRequest
        ));
    });
});

describe('confio/proofs.proto', () => {
    const ref = store.findProto('confio/proofs.proto');
    const context = new ProtoParseContext(ref, store, store.options);
    it('ExistenceProof', () => {
        expectCode(createProtoType(context, 'ExistenceProof',
            getNestedProto(ref.traversed).ExistenceProof
        ));
    });
});
