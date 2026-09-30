// The conversation, driven by JSON: <ChatSession spec variant="cli" | "web" />.
export * from "./styles"

// The registry, the thread's parts and what every variant shares.
export * from "./conversations"

// Asks and answers: the moved shells, and the renderers as they are built.
export * from "./asks"
export * from "./answers"

// The contract: types, events, patches, validation, and the grammar's ids.
export * from "./protocol"
export * from "./grammar"
