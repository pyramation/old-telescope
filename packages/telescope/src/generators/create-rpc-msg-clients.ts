import { buildAllImports, getDepsFromQueries } from '../imports';
import { Bundler } from '../bundler';
import { createRpcClientClass, createRpcClientInterface, createGRPCGatewayMsgClass, GetDesc, getMethodDesc, grpcWebRpcInterface, createGrpcWebMsgInterface, createGrpcWebMsgClass, getGrpcWebImpl } from '@osmonauts/ast';
import { getNestedProto } from '@osmonauts/proto-parser';
import { parse } from '../parse';
import { TelescopeBuilder } from '../builder';

export const plugin = (
    builder: TelescopeBuilder,
    bundler: Bundler
) => {
    // if (!builder.options.rpcClients.enabled) {
    //     return;
    // }

    const mutationContexts = bundler
        .contexts
        .filter(context => context.mutations.length > 0);

    const clients = mutationContexts.map(c => {

        const enabled = c.proto.pluginValue('rpcClients.enabled');
        if (!enabled) return;

        const inline = c.proto.pluginValue('rpcClients.inline');
        if (inline) return;

        if (c.proto.isExcluded()) return;

        const localname = bundler.getLocalFilename(c.ref, 'rpc.msg');
        const filename = bundler.getFilename(localname);
        const ctx = bundler.getFreshContext(c);

        // get mutations, services
        parse(ctx);

        const proto = getNestedProto(c.ref.traversed);
        // hard-coding, for now, only Msg service
        if (!proto?.Msg || proto.Msg?.type !== 'Service') {
            return;
        }

        //////// 
        const asts = [];
        switch (c.proto.pluginValue("rpcClients.type")) {
            case 'grpc-gateway':
                asts.push(createGRPCGatewayMsgClass(ctx.generic, proto.Msg))
            break;
            case 'grpc-web':
                asts.push(createGrpcWebMsgInterface(ctx.generic, proto.Msg))
                asts.push(createGrpcWebMsgClass(ctx.generic, proto.Msg))
                asts.push(GetDesc(ctx.generic, proto.Msg))
                const Desces = getMethodDesc(ctx.generic, proto.Msg);
                for (let i = 0; i < Desces.length; i++) {
                    const element = Desces[i];
                    asts.push(element);
                }
                asts.push(grpcWebRpcInterface())
                asts.push(getGrpcWebImpl(ctx.generic))
            break;
            case 'tendermint':
                default:
                    asts.push(createRpcClientInterface(ctx.generic, proto.Msg))
                    asts.push(createRpcClientClass(ctx.generic, proto.Msg))
        }
        
        ////////

        const serviceImports = getDepsFromQueries(
            ctx.mutations,
            localname
        );

        // TODO we do NOT need all imports...
        const imports = buildAllImports(ctx, serviceImports, localname);
        const prog = []
            .concat(imports)
            .concat(ctx.body)
            .concat(asts);


        bundler.writeAst(prog, filename);
        bundler.addToBundle(c, localname);

        return {
            package: c.ref.proto.package,
            localname,
            filename
        };

    }).filter(Boolean);

    bundler.addRPCMsgClients(clients);

};