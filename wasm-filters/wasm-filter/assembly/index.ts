export * from "@solo-io/proxy-runtime/proxy";
import { RootContext, Context, RootContextHelper, ContextHelper, registerRootContext, FilterHeadersStatusValues, stream_context, LogLevelValues, log } from "@solo-io/proxy-runtime";

class AddHeaderRoot extends RootContext {
  configuration : string;

  onConfigure(): bool {
    let conf_buffer = super.getConfiguration();
    let result = String.UTF8.decode(conf_buffer);
    this.configuration = result;
    return true;
  }

  createContext(): Context {
    return ContextHelper.wrap(new AddHeader(this));
  }
}

class AddHeader extends Context {
  root_context : AddHeaderRoot;
  constructor(root_context:AddHeaderRoot){
    super();
    this.root_context = root_context;
  }

  onResponseHeaders(a: u32): FilterHeadersStatusValues {
    const root_context = this.root_context;
    log(LogLevelValues.debug, "something");

    if (root_context.configuration == "") {
      stream_context.headers.response.add("hello", "Consulate dfdfdf");
    } else {
      stream_context.headers.response.add("hello", root_context.configuration);
    }

    return FilterHeadersStatusValues.Continue;
  }
}

registerRootContext(() => { return RootContextHelper.wrap(new AddHeaderRoot()); }, "add_header");