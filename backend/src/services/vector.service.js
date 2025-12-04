import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey:
    process.env.PINECONE_API_KEY ||
    "pcsk_39PVye_7S2Ut7Z2r6An5Fav7JnyUy4kf5Y5fpKQV1T3MX6z2L2ZC2zNbh8dA6GVRHJesna",
});

const pcChatgptIndex = pc.index(
  "chatgpt-project",
  "https://chatgpt-project-9tkan6x.svc.aped-4627-b74a.pinecone.io"
);

async function createMemory({ vectors, messageId, metadata }) {
  console.log(messageId);

  await pcChatgptIndex.upsert([
    {
      id: messageId,
      values: vectors,
      metadata,
    },
  ]);
}

async function createQuery({ queryVector, limit = 5, metadata }) {
  const response = await pcChatgptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? metadata : undefined,
    includeMetadata: true,
  });

  // Extract matches or data of interest
  return response.matches || [];
}

export { createMemory, createQuery };