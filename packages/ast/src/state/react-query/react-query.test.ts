import { traverse, getNestedProto } from '@osmonauts/proto-parser'
import { defaultTelescopeOptions, ProtoService } from '@osmonauts/types';
import { expectCode, getTestProtoStore } from '../../../test-utils';
import { GenericParseContext } from '../../encoding';
import { createRpcQueryHooks, createRpcQueryHookInterfaces } from './react-query';
import * as t from '@babel/types';

const store = getTestProtoStore();
store.traverseAll();

it('createRpcQueryHooks', () => {
    const ref = store.findProto('cosmos/auth/v1beta1/query.proto');
    const res = traverse(store, ref);
    const service: ProtoService = getNestedProto(res).Query;
    const context = new GenericParseContext(ref, store, defaultTelescopeOptions);
    expectCode(createRpcQueryHooks(context, service))
});

it('createRpcQueryHookInterfaces', () => {
    const ref = store.findProto('cosmos/auth/v1beta1/query.proto');
    const res = traverse(store, ref);
    const service: ProtoService = getNestedProto(res).Query;
    const context = new GenericParseContext(ref, store, defaultTelescopeOptions);
    expectCode(t.program([
        ...createRpcQueryHookInterfaces(context, service)
    ]))
});

